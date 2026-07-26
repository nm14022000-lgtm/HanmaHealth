import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppState } from "@/store/AppStateContext";
import { sumFoodKcal, sumWorkoutsKcal, formatHumanReadableDate } from "@/lib/calculations";

export function ProgressPage() {
  const { state } = useAppState();

  const dates = Object.keys(state.dailyLogs)
    .filter((d) => {
      const log = state.dailyLogs[d];
      return sumFoodKcal(log) > 0 || sumWorkoutsKcal(log) > 0;
    })
    .sort((a, b) => b.localeCompare(a));

  const target = state.weightPlanner.calorieBudget || 2100;

  const chartData = state.progressHistory.map((p) => ({ name: p.date, weight: p.weight }));

  return (
    <div className="space-y-6">
      <header>
        <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Analytics</span>
        <h2 className="text-3xl font-black mt-1">Progress</h2>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <h4 className="font-bold text-base flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" /> Weight Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "#0a0f18", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="weight" stroke="#00ff88" strokeWidth={2} dot={{ fill: "#00ff88", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-base">Daily History</h4>
            <span className="text-xs text-text-muted">{dates.length} days logged</span>
          </div>
          <div className="h-px bg-border mb-4" />
          {dates.length === 0 ? (
            <p className="text-sm text-text-muted italic text-center py-6">No daily logs yet.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {dates.map((date) => {
                const log = state.dailyLogs[date];
                const foodKcal = sumFoodKcal(log);
                const burnKcal = sumWorkoutsKcal(log);
                const net = foodKcal - burnKcal;
                const over = net > target;
                const foodNames = [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].map((f) => f.name).join(", ") || "No food logged";
                const workoutNames = log.workouts.map((w) => w.name).join(", ") || "No workout logged";
                return (
                  <div key={date} className="glass-card p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold">{formatHumanReadableDate(date)}</span>
                      <span
                        className={`text-[0.65rem] font-black px-2.5 py-1 rounded-full ${
                          over ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
                        }`}
                      >
                        Net: {net >= 0 ? "+" : ""}
                        {net} kcal
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/[0.02] border border-border rounded-lg p-2.5">
                        <div className="text-[0.65rem] uppercase font-bold text-text-secondary mb-1">Food Intake</div>
                        <div className="font-black text-sm">{foodKcal} kcal</div>
                        <div className="text-[0.68rem] text-text-muted mt-1 line-clamp-2">{foodNames}</div>
                      </div>
                      <div className="bg-white/[0.02] border border-border rounded-lg p-2.5">
                        <div className="text-[0.65rem] uppercase font-bold text-text-secondary mb-1">Burned (Gym)</div>
                        <div className="font-black text-sm">{burnKcal} kcal</div>
                        <div className="text-[0.68rem] text-text-muted mt-1 line-clamp-2">{workoutNames}</div>
                      </div>
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
