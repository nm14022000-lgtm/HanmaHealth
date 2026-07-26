import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useAppState } from "@/store/AppStateContext";
import type { TabKey } from "@/components/layout/Sidebar";
import { WeeklyProgressCard } from "@/components/dashboard/WeeklyProgressCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import {
  sumFoodKcal,
  sumWorkoutsKcal,
  sumWorkoutsDuration,
  getWorkoutsLoggedThisWeek,
  getRoutineKeyForDate,
  formatHumanReadableDate,
} from "@/lib/calculations";
import { routineDatabase } from "@/data/routineDatabase";

export function DashboardPage({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { state, selectedDate, getDayLog } = useAppState();
  const log = getDayLog(selectedDate);

  const burned = sumWorkoutsKcal(log);
  const activeDuration = sumWorkoutsDuration(log);
  const calorieTarget = state.weightPlanner.calorieBudget || 2100;
  const weekCount = useMemo(() => getWorkoutsLoggedThisWeek(state.dailyLogs, selectedDate), [state.dailyLogs, selectedDate]);
  const routineKey = getRoutineKeyForDate(selectedDate);
  const routine = routineDatabase[routineKey];

  // Referenced so today's food intake stays available for future dashboard widgets.
  void sumFoodKcal(log);

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Hello, Athlete 👋</span>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black italic uppercase text-cyan mt-1"
          >
            Ready to crush goals?
          </motion.h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-primary text-sm font-bold">{formatHumanReadableDate(selectedDate)}</span>
          <button className="relative w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProgressCard
          weekCount={weekCount}
          weekTarget={8}
          caloriesBurned={burned}
          calorieTarget={calorieTarget}
          activeMinutes={activeDuration}
        />
        <HeroBanner routine={routine} onStart={() => onNavigate("workouts")} />
      </div>

      <QuickActions onNavigate={onNavigate} />
    </div>
  );
}
