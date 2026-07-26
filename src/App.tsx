import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppStateProvider } from "@/store/AppStateContext";
import { Sidebar, type TabKey } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { useWaterReminders } from "@/hooks/useWaterReminders";
import { DashboardPage } from "@/pages/Dashboard";
import { WorkoutsPage } from "@/pages/Workouts";
import { NutritionPage } from "@/pages/Nutrition";
import { HydrationPage } from "@/pages/Hydration";
import { ProgressPage } from "@/pages/Progress";
import { ProfilePage } from "@/pages/Profile";

function AppShell() {
  const [tab, setTab] = useState<TabKey>("home");
  useWaterReminders();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      <Sidebar active={tab} onChange={setTab} />

      {/* Main scrollable content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1320px] w-full mx-auto px-6 py-8 md:px-10 md:py-10">
          <AnimatePresence mode="wait">
            <PageTransition key={tab}>
              {tab === "home" && <DashboardPage onNavigate={setTab} />}
              {tab === "workouts" && <WorkoutsPage />}
              {tab === "nutrition" && <NutritionPage />}
              {tab === "hydration" && <HydrationPage />}
              {tab === "progress" && <ProgressPage />}
              {tab === "profile" && <ProfilePage />}
            </PageTransition>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppShell />
    </AppStateProvider>
  );
}
