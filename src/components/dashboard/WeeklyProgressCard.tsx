import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "./AnimatedCounter";
import { formatActiveTimeText } from "@/lib/calculations";

interface WeeklyProgressCardProps {
  weekCount: number;
  weekTarget: number;
  caloriesBurned: number;
  calorieTarget: number;
  activeMinutes: number;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function WeeklyProgressCard({
  weekCount,
  weekTarget,
  caloriesBurned,
  calorieTarget,
  activeMinutes,
}: WeeklyProgressCardProps) {
  const pct = Math.min(100, Math.round((weekCount / weekTarget) * 100));
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <p className="stat-label mb-4">Weekly Progress</p>
      <div className="flex items-center gap-6 flex-wrap">
        {/* Ring */}
        <div className="relative w-[120px] h-[120px] shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {/* Glow layer */}
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="rgba(34,197,94,0.12)"
              strokeWidth="12"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
            {/* Main progress */}
            <motion.circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tracking-tight">
              <AnimatedCounter value={pct} suffix="%" />
            </span>
            <span className="text-[0.65rem] text-text-muted font-medium">
              {weekCount}/{weekTarget} days
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-1.5 stat-label mb-1">
              <Flame className="w-3 h-3 text-accent-amber" />
              Calories burned
            </div>
            <div className="stat-number text-lg">
              <AnimatedCounter value={caloriesBurned} />
              <span className="text-text-muted text-sm font-normal"> / {calorieTarget} kcal</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 stat-label mb-1">
              <Clock className="w-3 h-3 text-primary" />
              Active time
            </div>
            <div className="stat-number text-lg">{formatActiveTimeText(activeMinutes)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
