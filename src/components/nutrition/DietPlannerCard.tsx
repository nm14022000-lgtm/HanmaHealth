import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/store/AppStateContext";
import { checkPlanSafety, generateDietBudget } from "@/lib/calculations";

const TIMELINE_OPTIONS = [
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
];

const CHEAT_FOODS = ["Tehari", "Kacchi Biryani", "Fuchka", "Chotpoti", "Paratha"];

export function DietPlannerCard() {
  const { state, setState } = useAppState();
  const [targetWeight, setTargetWeight] = useState(state.weightPlanner.targetWeight);
  const [months, setMonths] = useState(state.weightPlanner.timelineMonths);
  const [isCustom, setIsCustom] = useState(state.weightPlanner.isCustomTimeline);
  const [customDays, setCustomDays] = useState(90);
  const [cheatFood, setCheatFood] = useState(state.weightPlanner.cheatFood);
  const [generated, setGenerated] = useState(false);

  const currentWeight = state.userProfile.weight;
  const days = isCustom ? customDays : months * 30;

  const safety = useMemo(() => checkPlanSafety(currentWeight, targetWeight, days), [currentWeight, targetWeight, days]);

  function generate() {
    if (safety.level === "invalid" || safety.level === "danger") return;
    const budget = generateDietBudget(currentWeight, targetWeight, days, state.userProfile.tdee, state.userProfile.sex);
    setState((prev) => ({
      ...prev,
      weightPlanner: {
        ...prev.weightPlanner,
        targetWeight,
        timelineMonths: months,
        isCustomTimeline: isCustom,
        customDays,
        calorieBudget: budget,
        cheatFood,
      },
    }));
    setGenerated(true);
  }

  const SafetyIcon = { safe: CheckCircle2, warn: AlertCircle, danger: AlertTriangle, invalid: Info }[safety.level];
  const safetyColor = {
    safe: "text-success bg-success/10 border-success/25",
    warn: "text-warn bg-warn/10 border-warn/25",
    danger: "text-danger bg-danger/10 border-danger/25",
    invalid: "text-text-muted bg-white/5 border-border",
  }[safety.level];

  return (
    <Card>
      <h4 className="font-bold text-base mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" /> Generate Diet Plan
      </h4>
      <div className="h-px bg-border mb-4" />

      <div className="space-y-4">
        <div>
          <Label>Target Weight (kg)</Label>
          <Input
            type="number"
            min={30}
            max={250}
            value={targetWeight}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <Label>Target Timeline</Label>
          <div className="flex gap-2 flex-wrap">
            {TIMELINE_OPTIONS.map((opt) => (
              <button
                key={opt.months}
                onClick={() => {
                  setMonths(opt.months);
                  setIsCustom(false);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                  !isCustom && months === opt.months
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-text-muted hover:text-text-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
                isCustom ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted hover:text-text-primary"
              }`}
            >
              Custom
            </button>
          </div>
          {isCustom && (
            <Input
              type="number"
              min={7}
              placeholder="Days"
              className="mt-2"
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value) || 0)}
            />
          )}
        </div>

        <div className={`flex items-start gap-2 rounded-lg border px-3.5 py-2.5 text-xs ${safetyColor}`}>
          <SafetyIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {safety.message}
            {safety.recommendedMonths && (
              <>
                <br />
                <strong>
                  Recommended timeline: {safety.recommendedMonths[0]}–{safety.recommendedMonths[1]} months
                </strong>
              </>
            )}
          </span>
        </div>

        <div>
          <Label>Favorite Cheat Food (Saturday Dinner)</Label>
          <select
            className="flex h-11 w-full rounded-lg border border-border bg-black/30 px-3 text-sm"
            value={cheatFood}
            onChange={(e) => setCheatFood(e.target.value)}
          >
            {CHEAT_FOODS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <Button className="w-full" disabled={safety.level === "invalid" || safety.level === "danger"} onClick={generate}>
          <Sparkles className="w-4 h-4" /> Generate Diet Plan
        </Button>
      </div>

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="h-px bg-border my-4" />
            <p className="text-sm mb-3">
              Daily Calorie Target: <strong className="text-primary text-lg">{state.weightPlanner.calorieBudget}</strong> kcal
            </p>
            <div className="space-y-2 text-sm">
              <div className="glass-card p-3">
                <strong>Monday – Friday:</strong> <span className="text-text-secondary">Calorie Deficit Day (Clean Meals)</span>
              </div>
              <div className="glass-card p-3">
                <strong>Saturday:</strong>{" "}
                <span className="text-text-secondary">Deficit Maintained + 1 Serving {cheatFood} Dinner!</span>
              </div>
              <div className="glass-card p-3">
                <strong>Sunday:</strong> <span className="text-text-secondary">Refeed Day (Eat at Maintenance)</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
