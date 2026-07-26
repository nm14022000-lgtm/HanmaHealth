import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { exerciseLibrary, type Exercise } from "@/data/exerciseLibrary";
import { routineDatabase } from "@/data/routineDatabase";
import { ExerciseModal } from "@/components/workouts/ExerciseModal";
import { RoutineModal } from "@/components/workouts/RoutineModal";

const CATEGORIES = ["all", "chest", "back", "legs", "shoulders", "arms", "cardio"];

export function WorkoutsPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeRoutineKey, setActiveRoutineKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return exerciseLibrary.filter((ex) => {
      const matchesCategory = category === "all" || ex.category === category;
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="space-y-6">
      <header>
        <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Train Hard</span>
        <h2 className="text-3xl font-black mt-1">Workouts</h2>
      </header>

      <Tabs defaultValue="routines">
        <TabsList>
          <TabsTrigger value="routines">Routines</TabsTrigger>
          <TabsTrigger value="library">Exercise Library</TabsTrigger>
        </TabsList>

        <TabsContent value="routines">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(routineDatabase).map(([key, routine]) => (
              <motion.button
                key={key}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                onClick={() => setActiveRoutineKey(key)}
                className="text-left"
              >
                <Card className="hover:border-primary/40 transition-colors h-full">
                  <h3 className="font-black text-xl mb-1">{routine.name}</h3>
                  <p className="text-xs text-text-secondary mb-3">{routine.muscles}</p>
                  <div className="flex gap-4 text-xs text-text-muted">
                    <span>{routine.exercises.length} Exercises</span>
                    <span>{routine.duration} mins</span>
                    <span>~{routine.kcal} kcal</span>
                  </div>
                </Card>
              </motion.button>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="library">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input placeholder="Search exercises..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${
                    category === cat
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {cat[0].toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ex) => (
              <motion.button
                key={ex.name}
                variants={staggerItem}
                whileHover={{ y: -3, borderColor: "rgba(0,255,136,0.3)" }}
                onClick={() => setActiveExercise(ex)}
                className="glass-card p-4 text-left"
              >
                <h4 className="font-bold text-sm">{ex.name}</h4>
                <p className="text-xs text-text-muted mt-1">{ex.muscle}</p>
                <span className="text-[0.65rem] text-primary font-bold mt-2 inline-block">{ex.met} METs</span>
              </motion.button>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      <ExerciseModal exercise={activeExercise} onClose={() => setActiveExercise(null)} />
      <RoutineModal
        routineKey={activeRoutineKey}
        routine={activeRoutineKey ? routineDatabase[activeRoutineKey] : null}
        onClose={() => setActiveRoutineKey(null)}
      />
    </div>
  );
}
