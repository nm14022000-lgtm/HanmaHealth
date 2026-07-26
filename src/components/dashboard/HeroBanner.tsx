import { motion } from "framer-motion";
import { PlayCircle, Zap } from "lucide-react";
import type { Routine } from "@/data/routineDatabase";

interface HeroBannerProps {
  routine: Routine;
  onStart: () => void;
}

export function HeroBanner({ routine, onStart }: HeroBannerProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-end p-6"
      style={{
        background:
          "radial-gradient(ellipse at 15% 30%, rgba(34,197,94,0.18) 0%, transparent 55%), linear-gradient(160deg, #0e1a14 0%, #0b0f0d 50%, #0a0c10 100%)",
        border: "1px solid rgba(34,197,94,0.15)",
      }}
    >
      {/* Background label */}
      <span className="absolute -top-[0.3em] left-[-0.02em] text-[5rem] font-black leading-none text-transparent select-none pointer-events-none z-0"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.04)" }}>
        POWER
      </span>

      {/* Animated figure */}
      <motion.svg
        viewBox="0 0 400 320"
        className="absolute right-[-0.5rem] bottom-0 h-[88%] w-auto max-w-[55%] z-[1] opacity-80"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <g stroke="#22c55e" strokeLinecap="round" fill="none" opacity="0.85">
          <circle cx="112" cy="58" r="23" fill="#22c55e" stroke="none" />
          <path d="M112,81 L112,98" strokeWidth="14" />
          <path d="M112,98 C108,130 106,160 106,188" strokeWidth="32" />
          <path d="M106,188 L92,300" strokeWidth="19" />
          <path d="M106,188 L134,300" strokeWidth="19" />
          <path d="M128,108 L154,146 L138,178" strokeWidth="15" />
          <path d="M94,108 L66,138 L94,155" strokeWidth="15" />
        </g>
        <g strokeLinecap="round" fill="none" opacity="0.35">
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.05) 100%), linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full"
      >
        <span className="badge-emerald mb-2 inline-flex">
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current">
            <span className="absolute inset-0 rounded-full bg-current animate-ping-dot" />
          </span>
          Today's Workout
        </span>
        <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{routine.name}</h3>
        <p className="text-text-secondary text-sm mt-0.5">{routine.muscles}</p>
        <div className="flex gap-4 text-xs text-text-muted mt-1.5 mb-4">
          <span>{routine.exercises.length} exercises</span>
          <span>{routine.duration} min</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(34,197,94,0.35)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-primary text-black text-sm font-bold px-5 py-2.5 rounded-xl shadow-glow-primary transition-shadow"
        >
          <PlayCircle className="w-4 h-4" /> Start Workout
        </motion.button>
      </motion.div>

      {/* Top-right sparkle */}
      <div className="absolute top-4 right-4 z-10">
        <Zap className="w-4 h-4 text-primary/40" />
      </div>
    </div>
  );
}
