import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { foodDatabase } from "@/data/foodDatabase";
import { useAppState } from "@/store/AppStateContext";
import { sumFoodKcal, sumFoodMacro } from "@/lib/calculations";
import type { MealType } from "@/types";

const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

export function NutritionPage() {
  const { state, selectedDate, todayLog, updateDayLog } = useAppState();
  const [activeMeal, setActiveMeal] = useState<MealType>("breakfast");
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState("");

  const target = state.weightPlanner.calorieBudget || 2100;
  const consumed = sumFoodKcal(todayLog);
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(100, Math.round((consumed / target) * 100));

  const targetCarb = Math.round((target * 0.5) / 4);
  const targetProt = Math.round((target * 0.3) / 4);
  const targetFat = Math.round((target * 0.2) / 9);
  const carb = sumFoodMacro(todayLog, "carb");
  const prot = sumFoodMacro(todayLog, "prot");
  const fat = sumFoodMacro(todayLog, "fat");

  function addFood(item: { name: string; kcal: number; carb: number; prot: number; fat: number }) {
    updateDayLog(selectedDate, (log) => ({
      ...log,
      [activeMeal]: [...log[activeMeal], item],
    }));
  }

  function removeFood(index: number) {
    updateDayLog(selectedDate, (log) => ({
      ...log,
      [activeMeal]: log[activeMeal].filter((_, i) => i !== index),
    }));
  }

  function addCustom() {
    const kcal = parseFloat(customKcal);
    if (!customName || !kcal) return;
    addFood({ name: customName, kcal, carb: 0, prot: 0, fat: 0 });
    setCustomName("");
    setCustomKcal("");
  }

  const loggedItems = todayLog[activeMeal];

  return (
    <div className="space-y-6">
      <header>
        <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Fuel Tracker</span>
        <h2 className="text-3xl font-black mt-1">Daily Nutrition</h2>
      </header>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        <Card>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-40 h-40 mb-2">
              <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <motion.circle
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 60}
                  initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - pct / 100) }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[0.65rem] uppercase tracking-wide text-text-muted font-bold">Remaining</span>
                <span className="text-2xl font-black">
                  <AnimatedCounter value={remaining} />
                </span>
                <span className="text-xs text-text-muted">kcal</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            <MacroBar label="Carbs" color="bg-primary" value={carb} target={targetCarb} />
            <MacroBar label="Protein" color="bg-secondary" value={prot} target={targetProt} />
            <MacroBar label="Fat" color="bg-purple-500" value={fat} target={targetFat} />
          </div>
        </Card>

        <Card>
          <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
            {MEALS.map((meal) => (
              <button
                key={meal}
                onClick={() => setActiveMeal(meal)}
                className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors capitalize ${
                  activeMeal === meal ? "text-primary border-primary" : "text-text-muted border-transparent hover:text-text-primary"
                }`}
              >
                {meal}
              </button>
            ))}
          </div>

          <motion.div
            key={activeMeal}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4"
          >
            {foodDatabase.map((food) => (
              <motion.button
                key={food.name}
                variants={staggerItem}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => addFood(food)}
                className="glass-card p-3 text-center"
              >
                <div className="font-bold text-xs">{food.shortName}</div>
                <div className="text-[0.65rem] text-text-muted">{food.serving}</div>
                <div className="text-[0.7rem] text-primary font-bold mt-1">{food.kcal} kcal</div>
              </motion.button>
            ))}
          </motion.div>

          <div className="flex gap-2 mb-4">
            <Input placeholder="Or enter custom food..." value={customName} onChange={(e) => setCustomName(e.target.value)} />
            <Input placeholder="Kcal" type="number" className="w-24" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} />
            <Button size="icon" onClick={addCustom}>
              +
            </Button>
          </div>

          <p className="text-[0.7rem] text-text-muted mb-3 leading-relaxed">
            Calorie values are per-serving estimates researched from Bangladeshi/Bengali recipe & nutrition sources — real values vary
            ±15-20% by recipe, oil amount, and portion.
          </p>

          <h5 className="text-xs uppercase tracking-wide text-text-muted font-bold mb-2">Logged Food ({activeMeal})</h5>
          {loggedItems.length === 0 ? (
            <p className="text-sm text-text-muted italic text-center py-6">No food logged for this meal.</p>
          ) : (
            <div className="space-y-2">
              {loggedItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-t border-border pt-2 text-sm">
                  <span>{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">+{item.kcal} kcal</span>
                    <button onClick={() => removeFood(i)} className="text-text-muted hover:text-danger transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MacroBar({ label, color, value, target }: { label: string; color: string; value: number; target: number }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold uppercase tracking-wide text-text-secondary">{label}</span>
        <span className="text-text-muted">
          {Math.round(value)}g / {target}g
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
