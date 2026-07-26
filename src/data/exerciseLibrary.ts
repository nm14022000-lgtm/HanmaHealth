export interface Exercise {
  name: string;
  type: string;
  category: string;
  met: number;
  muscle: string;
  img: string;
  instruction: string;
}

export const exerciseLibrary: Exercise[] = [
  { name: "Bench Press", type: "Gym", category: "chest", met: 6, muscle: "Chest, Triceps, Shoulders", img: "chest", instruction: "Lie flat on a bench. Grip barbell slightly wider than shoulder-width, lower barbell slowly to chest level, then push it back up with control." },
  { name: "Incline Dumbbell Press", type: "Gym", category: "chest", met: 6, muscle: "Chest (Upper), Shoulders, Triceps", img: "chest", instruction: "Position incline bench at 30-45 degrees. Grip dumbbells, start at shoulders, press straight up and meet at center without locking out." },
  { name: "Squats", type: "Gym", category: "legs", met: 5.5, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Position barbell on shoulder traps. Stand feet shoulder-width, bend hips back and knees forward until thighs are parallel to ground, then drive back up." },
  { name: "Deadlifts", type: "Gym", category: "legs", met: 6, muscle: "Back (Lower), Hamstrings, Glutes", img: "legs", instruction: "Stand feet hip-width. Bend and grip barbell. Lift bar vertically by driving legs down and extending hips at top, keeping bar close to shins." },
  { name: "Pull-ups", type: "Gym", category: "back", met: 6, muscle: "Back (Lats), Biceps, Forearms", img: "back", instruction: "Hang from pull-up bar with overhand grip wider than shoulders. Pull body up until chin clears bar, lower body with control." },
  { name: "Overhead Press", type: "Gym", category: "shoulders", met: 5, muscle: "Shoulders, Triceps, Core", img: "shoulders", instruction: "Hold barbell at shoulder height, rack position. Press bar directly overhead, pushing head forward slightly at lock-out." },
  { name: "Bicep Curls", type: "Gym", category: "arms", met: 3, muscle: "Biceps, Brachialis", img: "arms", instruction: "Stand straight, grip dumbbells with palms facing up. Keeping elbows close to ribs, curl weight up towards shoulders. Squeeze at top." },
  { name: "Lateral Raises", type: "Gym", category: "shoulders", met: 3, muscle: "Shoulders (Lateral), Traps", img: "shoulders", instruction: "Stand holding dumbbells at sides. Raise arms out to sides with slight elbow bend until parallel to floor, then slowly lower." },
  { name: "Tricep Pushdowns", type: "Gym", category: "arms", met: 3.5, muscle: "Triceps", img: "arms", instruction: "Attach rope to high pulley. Grip rope, keep elbows pinned to ribs, extend arms down by engaging triceps, then return slowly." },
  { name: "Running", type: "Cardio", category: "cardio", met: 9.8, muscle: "Legs, Heart, Lungs", img: "legs", instruction: "Continuous steady-state outdoor or treadmill running. Promotes high cardiovascular endurance." },
  { name: "Cycling", type: "Cardio", category: "cardio", met: 7.5, muscle: "Quads, Hamstrings, Heart", img: "legs", instruction: "Steady-state bicycle riding. Build endurance and burns calories with low impact on joints." },
  { name: "Swimming", type: "Cardio", category: "cardio", met: 8, muscle: "Full Body, Back, Shoulders", img: "chest", instruction: "Steady lap swimming in a pool. Targets upper body and cardiovascular conditioning." },
  { name: "Jump Rope", type: "Cardio", category: "cardio", met: 10, muscle: "Calves, Delts, Cardiovascular", img: "legs", instruction: "Continuous jump-rope skipping. Promotes rapid agility, calf strength, and calorie burn." },
  { name: "HIIT Cardio", type: "Cardio", category: "cardio", met: 8, muscle: "Full Body, Cardiovascular", img: "back", instruction: "High intensity workout interval rounds. Alternates maximum efforts with recovery periods." },
  { name: "Air Bike", type: "Cardio", category: "cardio", met: 8.5, muscle: "Quads, Hamstrings, Cardiovascular", img: "legs", instruction: "Sit on the air/fan bike, grip handles, pedal while pushing/pulling handles in a steady rhythm. Resistance scales with your effort, great for intervals." },
  { name: "Rowing Machine", type: "Cardio", category: "cardio", met: 8.5, muscle: "Back, Legs, Cardiovascular", img: "back", instruction: "Sit on rower, drive through legs first, then lean back and pull handle to chest. Reverse the order returning to start position." },
  { name: "Stair Climbing", type: "Cardio", category: "cardio", met: 9, muscle: "Glutes, Quads, Cardiovascular", img: "legs", instruction: "Continuous stair machine or real-stair climbing at a steady pace, driving through the heel of each step." },
  { name: "Push-ups", type: "Gym", category: "chest", met: 8, muscle: "Chest, Triceps, Shoulders", img: "chest", instruction: "Start in plank position, hands slightly wider than shoulders. Lower chest to floor keeping body straight, then push back up." },
  { name: "Cable Chest Fly", type: "Gym", category: "chest", met: 4, muscle: "Chest (Inner), Shoulders", img: "chest", instruction: "Stand between cable towers, grip handles. Bring hands together in a wide arc in front of chest, squeeze, then return slowly." },
  { name: "Dips", type: "Gym", category: "chest", met: 6, muscle: "Chest (Lower), Triceps, Shoulders", img: "chest", instruction: "Support body on parallel bars, lower until elbows reach 90 degrees leaning slightly forward, then press back up." },
  { name: "Bent-over Barbell Row", type: "Gym", category: "back", met: 6, muscle: "Back (Lats, Mid), Biceps", img: "back", instruction: "Hinge at hips holding barbell, back flat. Pull bar towards lower ribs squeezing shoulder blades, then lower with control." },
  { name: "Lat Pulldown", type: "Gym", category: "back", met: 5, muscle: "Back (Lats), Biceps", img: "back", instruction: "Sit at lat pulldown machine, grip bar wide. Pull bar down to upper chest, squeezing lats, then let it rise back with control." },
  { name: "Seated Cable Row", type: "Gym", category: "back", met: 5, muscle: "Back (Mid), Lats, Biceps", img: "back", instruction: "Sit at cable row station, feet on platform. Pull handle to torso keeping back straight, squeeze shoulder blades, release slowly." },
  { name: "Dumbbell Shrugs", type: "Gym", category: "back", met: 3.5, muscle: "Traps", img: "back", instruction: "Hold dumbbells at sides, shrug shoulders straight up towards ears, pause briefly, then lower with control." },
  { name: "Dumbbell Lunges", type: "Gym", category: "legs", met: 5, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Hold dumbbells at sides, step forward into a lunge until both knees reach 90 degrees, push back to start, alternate legs." },
  { name: "Leg Press", type: "Gym", category: "legs", met: 5, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Sit in leg press machine, feet shoulder-width on platform. Lower weight by bending knees to 90 degrees, then press back up." },
  { name: "Leg Extension", type: "Gym", category: "legs", met: 4, muscle: "Quads", img: "legs", instruction: "Sit on leg extension machine, pad on shins. Extend legs straight out squeezing quads, then lower with control." },
  { name: "Leg Curls", type: "Gym", category: "legs", met: 4, muscle: "Hamstrings", img: "legs", instruction: "Lie face down on leg curl machine, pad on ankles. Curl heels towards glutes squeezing hamstrings, then lower slowly." },
  { name: "Calf Raises", type: "Gym", category: "legs", met: 3.5, muscle: "Calves", img: "legs", instruction: "Stand on edge of a step or calf machine, rise up onto toes as high as possible, pause, then lower heels below the step level." },
  { name: "Romanian Deadlift", type: "Gym", category: "legs", met: 5.5, muscle: "Hamstrings, Glutes, Lower Back", img: "legs", instruction: "Hold barbell, soft knees. Hinge at hips pushing glutes back, lower bar along legs until hamstring stretch, then drive hips forward." },
  { name: "Arnold Press", type: "Gym", category: "shoulders", met: 5, muscle: "Shoulders (All heads), Triceps", img: "shoulders", instruction: "Hold dumbbells at shoulders, palms facing you. Press up while rotating palms to face forward, reverse the rotation lowering back down." },
  { name: "Face Pulls", type: "Gym", category: "shoulders", met: 3.5, muscle: "Shoulders (Rear), Traps", img: "shoulders", instruction: "Set cable at face height with rope attachment. Pull rope towards face, flaring elbows wide, squeezing rear delts, then return slowly." },
  { name: "Front Raises", type: "Gym", category: "shoulders", met: 3, muscle: "Shoulders (Front)", img: "shoulders", instruction: "Hold dumbbells in front of thighs. Raise arms straight forward to shoulder height, pause, then lower with control." },
  { name: "Hammer Curls", type: "Gym", category: "arms", met: 3, muscle: "Biceps, Forearms", img: "arms", instruction: "Hold dumbbells with palms facing each other (neutral grip). Curl weights up towards shoulders keeping wrists neutral, then lower." },
  { name: "Skull Crushers", type: "Gym", category: "arms", met: 3.5, muscle: "Triceps", img: "arms", instruction: "Lie on bench holding barbell/EZ-bar above chest. Bend elbows lowering bar towards forehead, then extend arms back up." },
  { name: "Concentration Curls", type: "Gym", category: "arms", met: 3, muscle: "Biceps", img: "arms", instruction: "Sit, brace elbow against inner thigh holding dumbbell. Curl weight up squeezing bicep, then lower slowly with full control." },
];
