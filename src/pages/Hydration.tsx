import { motion } from "framer-motion";
import { Droplet, Bell, BellRing, Calculator, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/store/AppStateContext";
import { useWaterReminders } from "@/hooks/useWaterReminders";
import {
  calculateWaterTargetMl,
  sumWorkoutsDuration,
  WATER_ML_PER_KG,
  WATER_ML_PER_EXERCISE_MIN,
  WATER_CLIMATE_BONUS_ML,
  formatHumanReadableDate,
} from "@/lib/calculations";

const QUICK_ADD = [250, 500, 750, 1000];
const INTERVALS = [
  { label: "1 HR", mins: 60 },
  { label: "2 HR", mins: 120 },
  { label: "3 HR", mins: 180 },
];

export function HydrationPage() {
  const { state, selectedDate, todayLog, updateDayLog } = useAppState();
  const { toggleReminders, setReminderInterval } = useWaterReminders();

  const exerciseMinutes = sumWorkoutsDuration(todayLog);
  const target = calculateWaterTargetMl(state.userProfile.weight, exerciseMinutes);
  const consumed = todayLog.water;
  const totalBlocks = 8;
  const filledBlocks = Math.round(Math.min(1, consumed / target) * totalBlocks);

  const base = Math.round(state.userProfile.weight * WATER_ML_PER_KG);
  const exerciseBonus = Math.round(exerciseMinutes * WATER_ML_PER_EXERCISE_MIN);

  function addWater(ml: number) {
    updateDayLog(selectedDate, (log) => ({ ...log, water: log.water + ml }));
  }

  const historyDates = Object.keys(state.dailyLogs)
    .filter((d) => state.dailyLogs[d].water > 0)
    .sort((a, b) => b.localeCompare(a));

  const reminderSettings = state.settings.waterReminders;

  return (
    <div className="space-y-6">
      <header>
        <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Fluid Tracker</span>
        <h2 className="text-3xl font-black mt-1 text-cyan">Hydration</h2>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-base flex items-center gap-2 text-cyan">
                <Droplet className="w-4 h-4" /> Today's Intake
              </h4>
              <button
                onClick={toggleReminders}
                className="w-9 h-9 rounded-full bg-white/5 border border-border flex items-center justify-center hover:border-cyan/40 transition-colors"
              >
                {reminderSettings.enabled ? <BellRing className="w-4 h-4 text-cyan" /> : <Bell className="w-4 h-4" />}
              </button>
            </div>
            <div className="h-px bg-border mb-4" />

            <div className="flex items-baseline gap-1.5 mb-4">
              <strong className="text-3xl font-black">{consumed}</strong>
              <span className="text-sm text-text-muted">ml / {target}ml</span>
            </div>

            <div className="grid grid-cols-8 gap-1.5 mb-5">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-3 rounded-sm ${i < filledBlocks ? "bg-cyan shadow-glow-cyan animate-block-pulse" : "bg-white/5"}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.03 }}
                />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {QUICK_ADD.map((ml) => (
                <motion.button
                  key={ml}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addWater(ml)}
                  className="border border-cyan/35 bg-cyan/[0.08] text-cyan rounded-lg py-2 text-xs font-bold hover:bg-cyan hover:text-black transition-colors"
                >
                  +{ml >= 1000 ? "1.0L" : `${ml}ML`}
                </motion.button>
              ))}
            </div>

            <div className="border-t border-border pt-3 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-text-muted font-bold uppercase tracking-wide">
                {reminderSettings.enabled ? `Reminders on — every ${reminderSettings.intervalMinutes / 60}h` : "Reminders off"}
              </p>
              <div className="flex gap-1.5">
                {INTERVALS.map((iv) => (
                  <button
                    key={iv.mins}
                    onClick={() => setReminderInterval(iv.mins)}
                    className={`text-[0.65rem] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                      reminderSettings.intervalMinutes === iv.mins
                        ? "border-cyan bg-cyan/10 text-cyan"
                        : "border-border text-text-muted"
                    }`}
                  >
                    {iv.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold text-base flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4" /> Daily Water Requirement
            </h4>
            <div className="h-px bg-border mb-4" />
            <div className="space-y-3 text-sm">
              <Row label="Base (weight × 33ml/kg)" value={`${base} ml`} />
              <Row label="Exercise bonus (today)" value={`+${exerciseBonus} ml`} />
              <Row label="Bangladesh climate bonus" value={`+${WATER_CLIMATE_BONUS_ML} ml`} />
              <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold">
                <span>Today's Target</span>
                <span className="text-cyan text-lg">{target} ml</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 leading-relaxed">
              Base uses the 30-35 ml/kg adult hydration range (IOM/Mayo-referenced). Exercise bonus is ~12ml per minute logged today.
              Climate bonus is fixed since this app is tuned for Bangladesh's heat.
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-base flex items-center gap-2">
              <History className="w-4 h-4" /> Hydration History
            </h4>
            <span className="text-xs text-text-muted">{historyDates.length} days logged</span>
          </div>
          <div className="h-px bg-border mb-4" />
          {historyDates.length === 0 ? (
            <p className="text-sm text-text-muted italic text-center py-6">No hydration logged yet.</p>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {historyDates.map((date) => {
                const dayLog = state.dailyLogs[date];
                const dayTarget = calculateWaterTargetMl(state.userProfile.weight, sumWorkoutsDuration(dayLog));
                const dayPct = Math.min(100, Math.round((dayLog.water / dayTarget) * 100));
                return (
                  <div key={date} className="glass-card p-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold">{formatHumanReadableDate(date)}</span>
                      <span
                        className={`text-[0.65rem] font-black px-2 py-0.5 rounded-full ${
                          dayPct >= 100 ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                        }`}
                      >
                        {dayPct}% of goal
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {dayLog.water} / {dayTarget} ml
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-text-secondary">
      <span>{label}</span>
      <strong className="text-text-primary">{value}</strong>
    </div>
  );
}
