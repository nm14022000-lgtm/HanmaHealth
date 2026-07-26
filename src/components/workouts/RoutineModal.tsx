import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Routine } from "@/data/routineDatabase";
import { useAppState } from "@/store/AppStateContext";

interface RoutineModalProps {
  routineKey: string | null;
  routine: Routine | null;
  onClose: () => void;
}

export function RoutineModal({ routine, onClose }: RoutineModalProps) {
  const { selectedDate, updateDayLog } = useAppState();
  if (!routine) return null;

  function logRoutine() {
    updateDayLog(selectedDate, (log) => ({
      ...log,
      workouts: [...log.workouts, { name: routine!.name, kcal: routine!.kcal, duration: routine!.duration, type: "Routine" }],
    }));
    onClose();
  }

  return (
    <Dialog open={!!routine} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{routine.name}</DialogTitle>
          <p className="text-xs text-text-secondary">{routine.muscles}</p>
        </DialogHeader>

        <div className="flex gap-5 text-xs text-text-secondary mb-4">
          <span>{routine.exercises.length} Exercises</span>
          <span>{routine.duration} mins</span>
          <span>~{routine.kcal} kcal</span>
        </div>

        <div className="space-y-2 mb-5 max-h-64 overflow-y-auto pr-1">
          {routine.exercises.map((ex) => (
            <div key={ex.name} className="flex items-center justify-between border border-border rounded-lg px-3 py-2.5 text-sm">
              <span className="font-bold">{ex.name}</span>
              <span className="text-text-muted text-xs">
                {ex.sets} sets × {ex.reps} reps
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full" onClick={logRoutine}>
          <CheckCircle2 className="w-4 h-4" /> Log This Routine to Today
        </Button>
      </DialogContent>
    </Dialog>
  );
}
