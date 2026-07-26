import { motion } from "framer-motion";
import { Dumbbell, Apple, TrendingUp, Calculator } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import type { TabKey } from "@/components/layout/Sidebar";

const ACTIONS: { label: string; icon: React.ElementType; color: string; tab: TabKey }[] = [
  { label: "Exercises", icon: Dumbbell, color: "bg-primary", tab: "workouts" },
  { label: "Nutrition", icon: Apple, color: "bg-secondary", tab: "nutrition" },
  { label: "Analytics", icon: TrendingUp, color: "bg-purple-500", tab: "progress" },
  { label: "Body Stats", icon: Calculator, color: "bg-cyan", tab: "profile" },
];

export function QuickActions({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">Quick Actions</h4>
      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ACTIONS.map((action) => (
          <motion.button
            key={action.label}
            variants={staggerItem}
            whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.16)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate(action.tab)}
            className="glass-card p-5 flex flex-col items-center gap-3 text-center"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color}`}>
              <action.icon className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-bold">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
