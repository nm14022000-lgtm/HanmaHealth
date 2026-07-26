import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, Droplets, Scale } from "lucide-react";
import { useAppState } from "@/store/AppStateContext";
import type { TabKey } from "@/components/layout/Sidebar";
import { WeeklyProgressCard } from "@/components/dashboard/WeeklyProgressCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { Progress } from "@/components/ui/progress";
import {
  sumFoodKcal,
  sumWorkoutsKcal,
  sumWorkoutsDuration,
  getWorkoutsLoggedThisWeek,
  getRoutineKeyForDate,
  formatHumanReadableDate,
} from "@/lib/calculations";
import { routineDatabase } from "@/data/routineDatabase";
import { staggerContainer, staggerItem } from "@/components/layout/PageTransition";

const RING_RADIUS = 64;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export function DashboardPage({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { state, selectedDate, getDayLog } = useAppState();
  const log = getDayLog(selectedDate);

  const burned = sumWorkoutsKcal(log);
  const activeDuration = sumWorkoutsDuration(log);
  const calorieTarget = state.weightPlanner.calorieBudget || 2100;
  const foodKcal = sumFoodKcal(log);
  const weekCount = useMemo(
    () => getWorkoutsLoggedThisWeek(state.dailyLogs, selectedDate),
    [state.dailyLogs, selectedDate]
  );
  const routineKey = getRoutineKeyForDate(selectedDate);
  const routine = routineDatabase[routineKey];

  // Calorie ring
  const caloriePct = Math.min(100, Math.round((foodKcal / calorieTarget) * 100));
  const calorieOffset = RING_CIRC - (caloriePct / 100) * RING_CIRC;

  // Water
  const waterMl = log.water ?? 0;
  const waterTarget = 2500; // ml default; Hydration page manages the per-user target
  const waterPct = Math.min(100, Math.round((waterMl / waterTarget) * 100));

  // Weight
  const currentWeight = state.userProfile?.weight ?? 0;
  const targetWeight = state.weightPlanner?.targetWeight ?? 0;

  return (
    <div className="space-y-7">
      {/* ── Top header ─────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <p className="stat-label">Hello, Athlete 👋</p>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold tracking-tight text-text-primary mt-0.5"
          >
            Ready to crush goals?
          </motion.h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-muted hidden sm:block">
            {formatHumanReadableDate(selectedDate)}
          </span>
          <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center hover:border-border-strong transition-colors">
            <Bell className="w-4 h-4 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-glow-primary-sm" />
          </button>
        </div>
      </header>

      {/* ── Bento row 1: calorie ring + water + weight ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Calorie ring */}
        <motion.div variants={staggerItem} className="glass-card p-5 flex flex-col">
          <p className="stat-label mb-4">Daily Calories</p>
          <div className="flex items-center gap-5 flex-1">
            <div className="relative w-[100px] h-[100px] shrink-0">
              <svg viewBox="0 0 144 144" className="w-full h-full -rotate-90">
                <circle cx="72" cy="72" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                {/* Glow */}
                <circle cx="72" cy="72" r={RING_RADIUS} fill="none"
                  stroke="rgba(34,197,94,0.1)" strokeWidth="14"
                  strokeDasharray={RING_CIRC} strokeDashoffset={calorieOffset} strokeLinecap="round" />
                {/* Ring */}
                <motion.circle cx="72" cy="72" r={RING_RADIUS} fill="none"
                  stroke="#22c55e" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={RING_CIRC}
                  initial={{ strokeDashoffset: RING_CIRC }}
                  animate={{ strokeDashoffset: calorieOffset }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold">
                  <AnimatedCounter value={caloriePct} suffix="%" />
                </span>
                <span className="text-[0.6rem] text-text-muted">of goal</span>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="stat-label">Consumed</p>
                <p className="text-lg font-bold text-primary">
                  <AnimatedCounter value={foodKcal} />
                  <span className="text-xs text-text-muted font-normal"> kcal</span>
                </p>
              </div>
              <div>
                <p className="stat-label">Goal</p>
                <p className="text-base font-semibold text-text-secondary">{calorieTarget} kcal</p>
              </div>
              <div>
                <p className="stat-label">Burned</p>
                <p className="text-base font-semibold text-accent-amber">
                  <AnimatedCounter value={burned} />
                  <span className="text-xs text-text-muted font-normal"> kcal</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Water */}
        <motion.div variants={staggerItem} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-4 h-4 text-blue-400" />
            <p className="stat-label">Hydration</p>
          </div>
          <p className="text-2xl font-bold tracking-tight mb-1">
            <AnimatedCounter value={Math.round(waterMl / 100) / 10} decimals={1} suffix="L" />
          </p>
          <p className="text-xs text-text-muted mb-4">of {(waterTarget / 1000).toFixed(1)}L goal</p>
          <Progress value={waterPct} indicatorClassName="bg-gradient-to-r from-blue-500/70 to-blue-400" />
          <div className="flex justify-between text-[0.65rem] text-text-muted mt-2">
            <span>0L</span>
            <span className="text-blue-400 font-medium">{waterPct}%</span>
            <span>{(waterTarget / 1000).toFixed(1)}L</span>
          </div>
        </motion.div>

        {/* Weight */}
        <motion.div variants={staggerItem} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-accent-purple" />
            <p className="stat-label">Body Weight</p>
          </div>
          <p className="text-2xl font-bold tracking-tight mb-0.5">
            {currentWeight > 0 ? `${currentWeight} kg` : "—"}
          </p>
          <p className="text-xs text-text-muted mb-4">
            {targetWeight > 0 ? `Target: ${targetWeight} kg` : "Set a target in Profile"}
          </p>
          {currentWeight > 0 && targetWeight > 0 && (
            <>
              <Progress
                value={Math.min(100, Math.round((Math.min(currentWeight, targetWeight) / Math.max(currentWeight, targetWeight)) * 100))}
                indicatorClassName="bg-gradient-to-r from-purple-500/70 to-purple-400"
              />
              <p className="text-[0.65rem] text-text-muted mt-2">
                {Math.abs(currentWeight - targetWeight).toFixed(1)} kg {currentWeight > targetWeight ? "to lose" : "to gain"}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* ── Row 2: AI Insight + Hero banner ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* AI Insights */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(15,18,24,0.8) 100%)",
            border: "1px solid rgba(34,197,94,0.14)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-primary">Hanma Intelligence</span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed">
            You've completed{" "}
            <span className="text-primary font-semibold">{weekCount} workout{weekCount !== 1 ? "s" : ""}</span> this
            week. Based on your activity and calorie data, consider increasing protein intake by{" "}
            <span className="text-primary font-semibold">10–15g</span> post-workout to support muscle recovery.
          </p>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-1.5 rounded-lg text-xs font-semibold text-black bg-primary hover:bg-primary-hover transition-colors">
              View Analysis
            </button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary transition-colors border border-border">
              Dismiss
            </button>
          </div>
        </div>

        {/* Hero banner */}
        <HeroBanner routine={routine} onStart={() => onNavigate("workouts")} />
      </div>

      {/* ── Row 3: Weekly progress + Quick actions ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <WeeklyProgressCard
          weekCount={weekCount}
          weekTarget={8}
          caloriesBurned={burned}
          calorieTarget={calorieTarget}
          activeMinutes={activeDuration}
        />
        <QuickActions onNavigate={onNavigate} />
      </div>
    </div>
  );
}
