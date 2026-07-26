import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import type { Routine } from "@/data/routineDatabase";

interface HeroBannerProps {
  routine: Routine;
  onStart: () => void;
}

export function HeroBanner({ routine, onStart }: HeroBannerProps) {
  return (
    <div className="relative rounded-chunky overflow-hidden min-h-[280px] flex items-end p-8 bg-[radial-gradient(circle_at_15%_15%,rgba(0,255,136,0.28)_0%,transparent_45%),linear-gradient(160deg,#0e1607_0%,#060806_55%,#030303_100%)]">
      <span className="absolute -top-[0.4em] left-[-0.03em] text-[5.5rem] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] select-none pointer-events-none z-0">
        POWER
      </span>

      <motion.svg
        viewBox="0 0 400 320"
        className="absolute right-[-1rem] bottom-0 h-[92%] w-auto max-w-[62%] z-[1] opacity-90"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <g stroke="#00ff88" strokeLinecap="round" fill="none" opacity="0.9">
          <circle cx="112" cy="58" r="23" fill="#00ff88" stroke="none" />
          <path d="M112,81 L112,98" strokeWidth="14" />
          <path d="M112,98 C108,130 106,160 106,188" strokeWidth="32" />
          <path d="M106,188 L92,300" strokeWidth="19" />
          <path d="M106,188 L134,300" strokeWidth="19" />
          <path d="M128,108 L154,146 L138,178" strokeWidth="15" />
          <path d="M94,108 L66,138 L94,155" strokeWidth="15" />
        </g>
        <g strokeLinecap="round" fill="none" opacity="0.55">
          <circle cx="292" cy="54" r="20" fill="#fff" stroke="none" />
          <path d="M306,44 Q328,40 320,68" stroke="#fff" strokeWidth="9" />
          <path d="M292,75 L292,90" stroke="#fff" strokeWidth="12" />
          <path d="M292,90 C288,110 286,120 288,132" stroke="#fff" strokeWidth="26" />
          <path d="M288,132 C286,142 286,148 289,156" stroke="#fff" strokeWidth="17" />
          <path d="M289,156 C292,168 294,178 291,190" stroke="#fff" strokeWidth="25" />
          <path d="M291,190 L276,300" stroke="#fff" strokeWidth="17" />
          <path d="M291,190 L312,300" stroke="#fff" strokeWidth="17" />
          <path d="M275,105 L250,128 L258,150" stroke="#fff" strokeWidth="13" />
          <path d="M306,108 L322,140 L305,150" stroke="#fff" strokeWidth="13" />
        </g>
      </motion.svg>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_25%,rgba(0,0,0,0.15)_100%),linear-gradient(to_right,rgba(0,0,0,0.55)_0%,transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative z-10 w-full"
      >
        <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full mb-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current">
            <span className="absolute inset-0 rounded-full bg-current animate-ping-dot" />
          </span>
          Today's Workout
        </span>
        <h3 className="text-3xl font-black text-white mt-1">{routine.name}</h3>
        <p className="text-text-secondary text-sm mt-1">{routine.muscles}</p>
        <div className="flex gap-5 text-xs text-text-secondary mt-2 mb-4">
          <span>{routine.exercises.length} Exercises</span>
          <span>{routine.duration} mins</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-primary text-black font-bold px-6 py-3 rounded-xl shadow-glow-primary"
        >
          <PlayCircle className="w-4 h-4" /> Start Workout
        </motion.button>
      </motion.div>
    </div>
  );
}
