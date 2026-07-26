import type { AppState } from "@/types";

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function createDefaultState(): AppState {
  return {
    userProfile: {
      age: 28,
      sex: "male",
      height: 170,
      weight: 78,
      waist: 94,
      neck: 38,
      hip: 0,
      activity: "1.375",
      bmi: 27.0,
      bf: 25.0,
      lbm: 58.5,
      tdee: 2400,
    },
    weightPlanner: {
      targetWeight: 68,
      timelineMonths: 3,
      isCustomTimeline: false,
      calorieBudget: 1900,
      favoriteFoods: ["Tehari"],
      cheatFood: "Tehari",
    },
    dailyLogs: {
      [isoDate(-2)]: {
        breakfast: [
          { name: "Roti (রুটি)", kcal: 120, carb: 26, prot: 3, fat: 1 },
          { name: "Egg (ডিম)", kcal: 75, carb: 0.5, prot: 6, fat: 5 },
        ],
        lunch: [
          { name: "Rice (ভাত)", kcal: 400, carb: 90, prot: 8, fat: 1 },
          { name: "Fish (মাছ)", kcal: 180, carb: 0, prot: 22, fat: 10 },
        ],
        dinner: [{ name: "Chicken (মুরগি)", kcal: 250, carb: 0, prot: 28, fat: 14 }],
        snacks: [],
        workouts: [{ name: "Running (দৌড়ানো)", kcal: 350, duration: 30, type: "Cardio" }],
        water: 1800,
      },
      [isoDate(-1)]: {
        breakfast: [{ name: "Egg (ডিম)", kcal: 150, carb: 1, prot: 12, fat: 10 }],
        lunch: [
          { name: "Rice (ভাত)", kcal: 200, carb: 45, prot: 4, fat: 0.5 },
          { name: "Beef (গরু)", kcal: 320, carb: 0, prot: 24, fat: 25 },
        ],
        dinner: [{ name: "Fish (মাছ)", kcal: 180, carb: 0, prot: 22, fat: 10 }],
        snacks: [{ name: "Chotpoti (চটপটি)", kcal: 250, carb: 42, prot: 10, fat: 5 }],
        workouts: [
          { name: "Bench Press", kcal: 164, duration: 30, type: "Gym" },
          { name: "Lateral Raises", kcal: 82, duration: 30, type: "Gym" },
        ],
        water: 2600,
      },
    },
    progressHistory: [
      { date: "Week 1", weight: 78, bodyFat: 25, waist: 94 },
      { date: "Week 2", weight: 77.5, bodyFat: 24.8, waist: 93.5 },
      { date: "Week 3", weight: 76.8, bodyFat: 24.3, waist: 92.8 },
    ],
    streak: {
      currentStreak: 12,
      loggedDaysCount: 17,
      lastLogDate: isoDate(-1),
    },
    settings: {
      skinTheme: "classic",
      waterReminders: {
        enabled: false,
        intervalMinutes: 120,
        lastNotifiedAt: 0,
      },
    },
  };
}

/** Backfills any nested fields missing from an older saved state so the
 * app never crashes just because a saved object predates a newer field —
 * mirrors the ensureStateDefaults() safety net from the original app. */
export function ensureStateDefaults(state: Partial<AppState>): AppState {
  const fallback = createDefaultState();
  return {
    userProfile: { ...fallback.userProfile, ...state.userProfile },
    weightPlanner: { ...fallback.weightPlanner, ...state.weightPlanner },
    dailyLogs: state.dailyLogs ?? {},
    progressHistory: state.progressHistory ?? [],
    streak: { ...fallback.streak, ...state.streak },
    settings: {
      skinTheme: state.settings?.skinTheme ?? "classic",
      waterReminders: {
        enabled: state.settings?.waterReminders?.enabled ?? false,
        intervalMinutes: state.settings?.waterReminders?.intervalMinutes ?? 120,
        lastNotifiedAt: state.settings?.waterReminders?.lastNotifiedAt ?? 0,
      },
    },
  };
}
