export interface UserProfile {
  age: number;
  sex: "male" | "female";
  height: number; // cm
  weight: number; // kg
  waist?: number;
  neck?: number;
  hip?: number;
  activity: string; // multiplier as string, e.g. "1.55"
  bmi?: number;
  bf?: number;
  bfValid?: boolean;
  lbm?: number;
  idealMin?: number;
  idealMax?: number;
  bmr?: number;
  bmrFormula?: string;
  tdee: number;
}

export interface WeightPlanner {
  targetWeight: number;
  timelineMonths: number;
  isCustomTimeline: boolean;
  customDays?: number;
  calorieBudget: number;
  favoriteFoods: string[];
  cheatFood: string;
}

export interface LoggedFoodItem {
  name: string;
  kcal: number;
  carb: number;
  prot: number;
  fat: number;
}

export interface LoggedWorkout {
  name: string;
  kcal: number;
  duration: number;
  type: string;
}

export interface DayLog {
  breakfast: LoggedFoodItem[];
  lunch: LoggedFoodItem[];
  dinner: LoggedFoodItem[];
  snacks: LoggedFoodItem[];
  workouts: LoggedWorkout[];
  water: number; // ml
}

export interface ProgressEntry {
  date: string;
  weight: number;
  bodyFat?: number;
  waist?: number;
}

export interface StreakInfo {
  currentStreak: number;
  loggedDaysCount: number;
  lastLogDate: string;
}

export interface WaterReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  lastNotifiedAt: number;
}

export interface AppSettings {
  skinTheme: "classic" | "demon";
  waterReminders: WaterReminderSettings;
}

export interface AppState {
  userProfile: UserProfile;
  weightPlanner: WeightPlanner;
  dailyLogs: Record<string, DayLog>;
  progressHistory: ProgressEntry[];
  streak: StreakInfo;
  settings: AppSettings;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";
