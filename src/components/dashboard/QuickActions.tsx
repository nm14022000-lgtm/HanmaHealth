import { motion } from "framer-motion";
import { Dumbbell, Salad, TrendingUp, Calculator } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import type { TabKey } from "@/components/layout/Sidebar";

const ACTIONS: {
  label: string;
  icon: React.ElementType;
  tab: TabKey;
  color: string;
  bg: string;
}[] = [
  { label: "Exercises", icon: Dumbbell,  tab: "workouts",  color: "text-primary",       bg: "rgba(34,197,94,0.12)" },
  { label: "Nutrition", icon: Salad,     tab: "nutrition",  color: "text-blue-400",       bg: "rgba(59,130,246,0.12)" },
  { label: "Analytics", icon: TrendingUp, tab: "progress",  color: "text-purple-400",    bg: "rgba(168,85,247,0.12)" },
  { label: "Body Stats", icon: Calculator, tab: "profile",  color: "text-amber-400",     bg: "rgba(245,158,11,0.12)" },
];

export function QuickActions({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  return (
    <div>
      <p className="stat-label mb-3">Quick Actions</p>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {ACTIONS.map((action) => (
          <motion.button
            key={action.label}
            variants={staggerItem}
            whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate(action.tab)}
            className="glass-card p-4 flex flex-col items-center gap-3 text-center cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: action.bg, border: `1px solid ${action.bg.replace("0.12", "0.25")}` }}
            >
              <action.icon className={`w-4.5 h-4.5 ${action.color}`} size={18} />
            </div>
            <span className="text-sm font-medium text-text-secondary">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
