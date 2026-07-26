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

const RADIUS = 54;
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
      <h4 className="font-bold text-base mb-4">Weekly Progress</h4>
      <div className="flex items-center gap-8 flex-wrap">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
            <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="65"
              cy="65"
              r={RADIUS}
              fill="none"
              stroke="#00ff88"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black">
              <AnimatedCounter value={pct} suffix="%" />
            </span>
            <span className="text-xs text-text-muted">
              {weekCount}/{weekTarget}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1">
              <Flame className="w-3.5 h-3.5 text-secondary" /> Calories burned
            </div>
            <div className="font-bold text-lg">
              <AnimatedCounter value={caloriesBurned} /> / {calorieTarget} kcal
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> Active time
            </div>
            <div className="font-bold text-lg">{formatActiveTimeText(activeMinutes)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
