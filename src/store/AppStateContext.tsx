import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createDefaultState, ensureStateDefaults } from "@/lib/defaultState";
import type { AppState, DayLog } from "@/types";
import { emptyDayLog } from "@/lib/calculations";

const STORAGE_KEY = "hanma_gym_state_v1";

interface AppStateContextValue {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  todayLog: DayLog;
  getDayLog: (date: string) => DayLog;
  updateDayLog: (date: string, updater: (log: DayLog) => DayLog) => void;
  currentUser: User | null;
  syncStatus: string;
  authOffline: boolean;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

function loadInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return ensureStateDefaults(JSON.parse(saved));
    }
  } catch (err) {
    console.error("Failed to parse saved state", err);
  }
  return createDefaultState();
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState("");
  const [authOffline, setAuthOffline] = useState(false);

  const cloudSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPullingCloud = useRef(false);
  const isFirstRender = useRef(true);

  // Persist to localStorage on every state change, and debounce-push to
  // Firestore if signed in.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!currentUser || isPullingCloud.current) return;

    setSyncStatus("Syncing...");
    if (cloudSyncTimer.current) clearTimeout(cloudSyncTimer.current);
    cloudSyncTimer.current = setTimeout(async () => {
      try {
        await setDoc(doc(db, "users", currentUser.uid), { state, updatedAt: Date.now() });
        setSyncStatus("Synced just now");
      } catch (err) {
        console.error("Cloud sync (push) failed:", err);
        setSyncStatus("Sync failed — will retry on next change");
      }
    }, 900);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Auth state + initial cloud pull
  useEffect(() => {
    const offlineTimer = setTimeout(() => setAuthOffline(true), 6000);

    const unsub = onAuthStateChanged(auth, async (user) => {
      clearTimeout(offlineTimer);
      setAuthOffline(false);
      setCurrentUser(user);
      if (!user) return;

      isPullingCloud.current = true;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists() && snap.data()?.state) {
          setState(ensureStateDefaults(snap.data()!.state));
          setSyncStatus("Synced from cloud");
        } else {
          await setDoc(ref, { state, updatedAt: Date.now() });
          setSyncStatus("Synced");
        }
      } catch (err) {
        console.error("Cloud sync (pull) failed:", err);
        setSyncStatus("Sync failed — check your connection");
      } finally {
        isPullingCloud.current = false;
      }
    });

    return () => {
      clearTimeout(offlineTimer);
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDayLog = useCallback(
    (date: string): DayLog => state.dailyLogs[date] ?? emptyDayLog(),
    [state.dailyLogs]
  );

  const updateDayLog = useCallback((date: string, updater: (log: DayLog) => DayLog) => {
    setState((prev) => {
      const current = prev.dailyLogs[date] ?? emptyDayLog();
      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [date]: updater(current),
        },
      };
    });
  }, []);

  const todayLog = getDayLog(selectedDate);

  return (
    <AppStateContext.Provider
      value={{
        state,
        setState,
        selectedDate,
        setSelectedDate,
        todayLog,
        getDayLog,
        updateDayLog,
        currentUser,
        syncStatus,
        authOffline,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
