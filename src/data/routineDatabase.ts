export interface RoutineExercise {
  name: string;
  sets: number;
  reps: number;
}

export interface Routine {
  name: string;
  muscles: string;
  kcal: number;
  duration: number;
  exercises: RoutineExercise[];
}

export const routineDatabase: Record<string, Routine> = {
  push: {
    name: "Push Day",
    muscles: "Chest, Shoulders, Triceps",
    kcal: 320,
    duration: 45,
    exercises: [
      { name: "Bench Press", sets: 4, reps: 12 },
      { name: "Incline Dumbbell Press", sets: 4, reps: 12 },
      { name: "Overhead Press", sets: 3, reps: 10 },
      { name: "Lateral Raises", sets: 3, reps: 12 },
      { name: "Tricep Pushdowns", sets: 3, reps: 15 },
    ],
  },
  pull: {
    name: "Pull Day",
    muscles: "Back, Biceps, Forearms",
    kcal: 280,
    duration: 40,
    exercises: [
      { name: "Pull-ups", sets: 4, reps: 10 },
      { name: "Deadlifts", sets: 3, reps: 8 },
      { name: "Bicep Curls", sets: 3, reps: 12 },
      { name: "Dumbbell Shrugs", sets: 3, reps: 15 },
    ],
  },
  legs: {
    name: "Leg Day",
    muscles: "Quads, Hamstrings, Glutes, Calves",
    kcal: 380,
    duration: 50,
    exercises: [
      { name: "Squats", sets: 4, reps: 12 },
      { name: "Dumbbell Lunges", sets: 3, reps: 12 },
      { name: "Leg Curls", sets: 3, reps: 12 },
      { name: "Calf Raises", sets: 4, reps: 20 },
    ],
  },
};
