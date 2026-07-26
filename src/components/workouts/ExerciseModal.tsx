import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Exercise } from "@/data/exerciseLibrary";
import { MUSCLE_IMAGES } from "@/data/muscleAssets";
import { calculateWorkoutBurn } from "@/lib/calculations";
import { useAppState } from "@/store/AppStateContext";

interface ExerciseModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  const { state, selectedDate, updateDayLog } = useAppState();
  const [duration, setDuration] = useState(30);
  const [weight, setWeight] = useState(state.userProfile.weight || 70);

  if (!exercise) return null;
  const burn = calculateWorkoutBurn(exercise.met, weight, duration);
  const imgSrc = MUSCLE_IMAGES[exercise.img];

  function logIt() {
    updateDayLog(selectedDate, (log) => ({
      ...log,
      workouts: [...log.workouts, { name: exercise!.name, kcal: burn, duration, type: exercise!.type }],
    }));
    onClose();
  }

  return (
    <Dialog open={!!exercise} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <span className="inline-flex w-fit text-[0.62rem] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full mb-2">
            {exercise.type} Workout
          </span>
          <DialogTitle>{exercise.name}</DialogTitle>
          <p className="text-xs text-text-secondary">Targets: {exercise.muscle}</p>
        </DialogHeader>

        {imgSrc && (
          <div className="w-full max-w-[280px] h-[280px] mx-auto bg-[#0a0a0c] border border-border rounded-2xl p-2 flex items-center justify-center overflow-hidden mb-4">
            <img src={imgSrc} alt={exercise.muscle} className="max-w-full max-h-full object-contain" style={{ filter: "brightness(1.2) contrast(1.15)" }} />
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-text-muted font-bold mb-2">Instructions &amp; Intensity</p>
          <p className="text-sm text-text-secondary leading-relaxed">{exercise.instruction}</p>
          <div className="mt-3 border border-border rounded-xl px-4 py-2.5 text-sm">
            Intensity Burn Factor: <strong>{exercise.met} METs</strong>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-text-muted font-bold mb-2">Calorie Burn Calculator</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Duration (mins)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        <motion.div
          key={burn}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.4 }}
          className="w-full text-center border-2 border-dashed border-primary/40 bg-primary/10 rounded-xl py-3 mb-3"
        >
          Estimated Burn: <strong className="text-primary text-lg">{burn} kcal</strong>
        </motion.div>

        <Button className="w-full" onClick={logIt}>
          <PlusCircle className="w-4 h-4" /> Log to Today's Activity
        </Button>
      </DialogContent>
    </Dialog>
  );
}
