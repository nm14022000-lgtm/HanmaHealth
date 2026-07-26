import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AppStateProvider } from "@/store/AppStateContext";
import { Sidebar, type TabKey } from "@/components/layout/Sidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { useWaterReminders } from "@/hooks/useWaterReminders";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
    /*
     * On mobile: flex-col — nav bar stacks above the scrollable content area.
     * On desktop (md+): flex-row — sidebar is on the left, content on the right.
     * overflow-hidden is intentional on desktop to keep the sidebar at full
     * viewport height without a page-level scrollbar. On mobile the <main>
     * below handles all scrolling.
     */
    <div className="flex flex-col md:flex-row h-screen h-dvh overflow-hidden bg-bg-main">
      <Sidebar active={tab} onChange={setTab} />

      {/* Main scrollable content area */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1320px] w-full mx-auto px-4 py-5 sm:px-6 sm:py-6 md:px-10 md:py-10">
          <AnimatePresence mode="wait">
            <PageTransition key={tab}>
              <ErrorBoundary>
                {tab === "home" && <DashboardPage onNavigate={setTab} />}
                {tab === "workouts" && <WorkoutsPage />}
                {tab === "nutrition" && <NutritionPage />}
                {tab === "hydration" && <HydrationPage />}
                {tab === "progress" && <ProgressPage />}
                {tab === "profile" && <ProfilePage />}
              </ErrorBoundary>
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
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    </AppStateProvider>
  );
}
