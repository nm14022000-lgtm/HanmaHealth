import type { UserProfile, DayLog } from "@/types";

export interface BodyMetricsResult {
  bmi: number;
  bf: number;
  bfValid: boolean;
  lbm: number;
  idealMin: number;
  idealMax: number;
  bmr: number;
  bmrFormula: string;
  tdee: number;
}

/**
 * Body metrics: BMI (WHO), Body Fat % (U.S. Navy Circumference Method,
 * Hodgdon & Beckett 1984, ±3-4% margin), BMR (Katch-McArdle 1996 when
 * body-fat data is available — more accurate since it's driven by lean
 * body mass; otherwise Mifflin-St Jeor 1990, the Academy of Nutrition and
 * Dietetics' recommended weight-based estimate), and TDEE (BMR × Harris-
 * Benedict activity multiplier).
 */
export function calculateBodyMetrics(
  age: number,
  sex: "male" | "female",
  height: number,
  weight: number,
  waist: number,
  neck: number,
  hip: number,
  activity: string
): BodyMetricsResult {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);

  let bf = 0;
  let bfValid = false;
  if (sex === "male") {
    const val = waist - neck;
    if (val > 0 && height > 0) {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(val) + 0.15456 * Math.log10(height)) - 450;
      bfValid = true;
    }
  } else {
    const val = waist + hip - neck;
    if (val > 0 && height > 0) {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(val) + 0.221 * Math.log10(height)) - 450;
      bfValid = true;
    }
  }

  bf = Math.max(2, Math.min(60, bf));
  const lbm = weight * (1 - bf / 100);
  const idealMin = 18.5 * (heightM * heightM);
  const idealMax = 24.9 * (heightM * heightM);

  let bmr = 0;
  let bmrFormula = "";
  if (bfValid) {
    bmr = 370 + 21.6 * lbm;
    bmrFormula = "Katch-McArdle formula, using your measured lean body mass";
  } else if (sex === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    bmrFormula = "Mifflin-St Jeor formula, using total body weight (add waist & neck for a body-fat-based estimate)";
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    bmrFormula = "Mifflin-St Jeor formula, using total body weight (add waist, neck & hip for a body-fat-based estimate)";
  }

  const tdee = bmr * parseFloat(activity);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bf: Math.round(bf * 10) / 10,
    bfValid,
    lbm: Math.round(lbm * 10) / 10,
    idealMin: Math.round(idealMin * 10) / 10,
    idealMax: Math.round(idealMax * 10) / 10,
    bmr: Math.round(bmr),
    bmrFormula,
    tdee: Math.round(tdee),
  };
}

/** Diet calorie budget: TDEE minus the deficit needed to hit the target
 * weight in the given timeframe, using the ~7700 kcal ≈ 1kg fat
 * approximation. Never drops below the clinical safety floor
 * (1500 kcal men / 1200 kcal women). */
export function generateDietBudget(
  currentWeight: number,
  targetWeight: number,
  days: number,
  tdee: number,
  sex: "male" | "female"
): number {
  const loss = currentWeight - targetWeight;
  const dailyDeficit = (loss * 7700) / days;
  let budget = tdee - dailyDeficit;
  const floor = sex === "female" ? 1200 : 1500;
  if (budget < floor) budget = floor;
  return Math.round(budget);
}

/** MET-based workout calorie burn: kcal = MET × 3.5 × weight(kg) / 200 × duration(min) */
export function calculateWorkoutBurn(met: number, weight: number, durationMinutes: number): number {
  return Math.round(((met * 3.5 * weight) / 200) * durationMinutes);
}

export const WATER_ML_PER_KG = 33;
export const WATER_ML_PER_EXERCISE_MIN = 12;
export const WATER_CLIMATE_BONUS_ML = 500;

/** Daily water target: 33ml/kg base (IOM/Mayo-referenced 30-35ml/kg band)
 * + ~12ml per minute of logged exercise (~355ml/30min guidance)
 * + fixed 500ml Bangladesh climate bonus. */
export function calculateWaterTargetMl(weight: number, exerciseMinutesToday: number): number {
  const base = weight * WATER_ML_PER_KG;
  const exerciseBonus = exerciseMinutesToday * WATER_ML_PER_EXERCISE_MIN;
  return Math.round(base + exerciseBonus + WATER_CLIMATE_BONUS_ML);
}

export function sumWorkoutsKcal(log?: DayLog): number {
  if (!log?.workouts) return 0;
  return log.workouts.reduce((acc, w) => acc + w.kcal, 0);
}

export function sumWorkoutsDuration(log?: DayLog): number {
  if (!log?.workouts) return 0;
  return log.workouts.reduce((acc, w) => acc + w.duration, 0);
}

export function sumFoodKcal(log?: DayLog): number {
  if (!log) return 0;
  return [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].reduce((acc, f) => acc + f.kcal, 0);
}

export function sumFoodMacro(log: DayLog | undefined, macro: "carb" | "prot" | "fat"): number {
  if (!log) return 0;
  return [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].reduce((acc, f) => acc + f[macro], 0);
}

export function emptyDayLog(): DayLog {
  return { breakfast: [], lunch: [], dinner: [], snacks: [], workouts: [], water: 0 };
}

/** Counts workouts logged Mon-Sun of the week containing `dateStr`. */
export function getWorkoutsLoggedThisWeek(dailyLogs: Record<string, { workouts: unknown[] }>, dateStr: string): number {
  let count = 0;
  const dateObj = new Date(dateStr);
  const currentDay = dateObj.getDay();
  const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
  const mondayObj = new Date(dateObj);
  mondayObj.setDate(dateObj.getDate() + distanceToMon);

  for (let i = 0; i < 7; i++) {
    const loopDate = new Date(mondayObj);
    loopDate.setDate(mondayObj.getDate() + i);
    const loopDateStr = loopDate.toISOString().split("T")[0];
    const log = dailyLogs[loopDateStr];
    if (log && log.workouts && log.workouts.length > 0) {
      count += log.workouts.length;
    }
  }
  return count;
}

export function formatActiveTimeText(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function formatHumanReadableDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

/** Convenience wrapper matching the shape most components need. */
export function getWaterTargetForProfile(profile: UserProfile, log?: DayLog): number {
  const exerciseMinutes = sumWorkoutsDuration(log);
  return calculateWaterTargetMl(profile.weight, exerciseMinutes);
}

/** Which push/pull/legs routine is "today's workout", based on weekday. */
export function getRoutineKeyForDate(dateStr: string): "push" | "pull" | "legs" {
  const day = new Date(dateStr).getDay(); // 0-6 (Sun-Sat)
  if (day === 1 || day === 4) return "pull"; // Mon/Thu
  if (day === 2 || day === 5) return "legs"; // Tue/Fri
  if (day === 6) return "push"; // Sat
  if (day === 0) return "pull"; // Sun
  return "push";
}

export type SafetyLevel = "safe" | "warn" | "danger" | "invalid";

export interface SafetyCheckResult {
  level: SafetyLevel;
  weeklyRate?: number;
  message: string;
  recommendedMonths?: [number, number];
}

/** Weekly weight-loss-rate safety check: ≤0.75kg/week = safe, ≤1.0kg/week =
 * moderate, above that = unsafe (with a recommended slower timeline). */
export function checkPlanSafety(currentWeight: number, targetWeight: number, days: number): SafetyCheckResult {
  if (isNaN(targetWeight)) {
    return { level: "invalid", message: "Please enter your target weight to run safety checks." };
  }
  if (targetWeight >= currentWeight) {
    return { level: "danger", message: `Target weight must be less than current weight (${currentWeight} kg).` };
  }

  const loss = currentWeight - targetWeight;
  const weeks = days / 7;
  const weeklyRate = loss / weeks;

  if (weeklyRate <= 0.75) {
    return { level: "safe", weeklyRate, message: `Safe Target Rate: ${weeklyRate.toFixed(2)} kg/week. Sustained loss.` };
  }
  if (weeklyRate <= 1.0) {
    return {
      level: "warn",
      weeklyRate,
      message: `Moderate Rate: ${weeklyRate.toFixed(2)} kg/week. Highly consistent logging needed.`,
    };
  }
  const minMonths = Math.max(1, Math.ceil(loss / 4));
  const maxMonths = Math.ceil(loss / 2);
  return {
    level: "danger",
    weeklyRate,
    message: `Unsafe Rate: ${weeklyRate.toFixed(2)} kg/week.`,
    recommendedMonths: [minMonths, maxMonths],
  };
}
