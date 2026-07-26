import { useEffect, useRef } from "react";
import { useAppState } from "@/store/AppStateContext";
import { calculateWaterTargetMl, sumWorkoutsDuration } from "@/lib/calculations";

/**
 * IMPORTANT (honest limitation, carried over from the original app): this
 * uses the browser's Notification API with an in-page timer. It reliably
 * reminds you while this site/tab is open (and on many Android/desktop
 * browsers, for a while after backgrounding). It is NOT a true server-push
 * notification that fires when the browser is fully closed — that needs a
 * backend (Firebase Cloud Messaging + a scheduled Cloud Function).
 */
export function useWaterReminders() {
  const { state, setState, selectedDate, getDayLog } = useAppState();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const settings = state.settings.waterReminders;
    if (settings.enabled && "Notification" in window && Notification.permission === "granted") {
      start();
    } else {
      stop();
    }
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.settings.waterReminders.enabled, state.settings.waterReminders.intervalMinutes]);

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function start() {
    stop();
    timerRef.current = setInterval(() => {
      const settings = state.settings.waterReminders;
      if (!settings.enabled) return;

      const hour = new Date().getHours();
      const withinWakingHours = hour >= 7 && hour <= 23;
      const elapsedMs = Date.now() - (settings.lastNotifiedAt || 0);
      const intervalMs = (settings.intervalMinutes || 120) * 60 * 1000;

      if (withinWakingHours && elapsedMs >= intervalMs && Notification.permission === "granted") {
        const log = getDayLog(selectedDate);
        const target = calculateWaterTargetMl(state.userProfile.weight, sumWorkoutsDuration(log));
        const pct = Math.min(100, Math.round((log.water / target) * 100));
        new Notification("Time to hydrate 💧", {
          body: `You've completed ${pct}% of today's water goal (${log.water}/${target}ml). Drink some water and log it!`,
        });
        setState((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            waterReminders: { ...prev.settings.waterReminders, lastNotifiedAt: Date.now() },
          },
        }));
      }
    }, 60 * 1000);
  }

  async function toggleReminders() {
    const settings = state.settings.waterReminders;
    if (!settings.enabled) {
      if (!("Notification" in window)) {
        alert("This browser doesn't support notifications.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setState((prev) => ({
          ...prev,
          settings: {
            ...prev.settings,
            waterReminders: { ...prev.settings.waterReminders, enabled: true, lastNotifiedAt: Date.now() },
          },
        }));
        new Notification("Hanma Gym 💧", { body: "Water reminders are on." });
      } else {
        alert("Notification permission was not granted, so reminders can't be turned on.");
      }
    } else {
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, waterReminders: { ...prev.settings.waterReminders, enabled: false } },
      }));
    }
  }

  function setInterval_(mins: number) {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, waterReminders: { ...prev.settings.waterReminders, intervalMinutes: mins } },
    }));
  }

  return { toggleReminders, setReminderInterval: setInterval_ };
}
