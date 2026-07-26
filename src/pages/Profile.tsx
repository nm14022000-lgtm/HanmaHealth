import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, CheckCircle2, WifiOff } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/store/AppStateContext";
import { auth } from "@/lib/firebase";
import { calculateBodyMetrics } from "@/lib/calculations";
import type { UserProfile } from "@/types";

export function ProfilePage() {
  const { state, setState, currentUser, syncStatus, authOffline } = useAppState();
  const [form, setForm] = useState<UserProfile>(state.userProfile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  function updateField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function calculate() {
    const metrics = calculateBodyMetrics(
      form.age,
      form.sex,
      form.height,
      form.weight,
      form.waist || 0,
      form.neck || 0,
      form.hip || 0,
      form.activity
    );
    const updated = { ...form, ...metrics };
    setForm(updated);
    setState((prev) => ({ ...prev, userProfile: updated }));
  }

  function mapAuthError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? "";
    if (code.includes("email-already-in-use")) return "This email is already registered — try Sign In instead.";
    if (code.includes("invalid-email")) return "That email address looks invalid.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
      return "Incorrect email or password.";
    if (code.includes("network-request-failed")) return "Network error — check your internet connection.";
    return "Something went wrong. Please try again.";
  }

  async function handleSignIn() {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setPassword("");
    } catch (err) {
      setAuthError(mapAuthError(err));
    }
  }

  async function handleSignUp() {
    setAuthError("");
    if (password.length < 6) return setAuthError("Password should be at least 6 characters.");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setPassword("");
    } catch (err) {
      setAuthError(mapAuthError(err));
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <span className="text-xs uppercase tracking-widest text-text-muted font-bold">Profile Stats</span>
        <h2 className="text-3xl font-black mt-1">Body Analysis &amp; Goal Settings</h2>
      </header>

      <Card>
        <h4 className="font-bold text-base flex items-center gap-2 mb-3">
          <Cloud className="w-4 h-4" /> Account &amp; Sync
        </h4>
        <div className="h-px bg-border mb-4" />

        {authOffline && (
          <div className="flex items-center gap-2 bg-warn/10 border border-warn/25 text-warn rounded-lg px-4 py-3 text-sm">
            <WifiOff className="w-4 h-4 shrink-0" />
            Cloud sync is unavailable right now (no connection). Your data is still saved on this device.
          </div>
        )}

        {!authOffline && !currentUser && (
          <div>
            <p className="text-sm text-text-secondary mb-3">
              Sign in to save your workout &amp; diet history to the cloud, so it's the same on your phone and laptop.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            {authError && <p className="text-danger text-sm font-bold mb-3">{authError}</p>}
            <div className="flex gap-2">
              <Button onClick={handleSignIn}>Sign In</Button>
              <Button variant="secondary" onClick={handleSignUp}>
                Create Account
              </Button>
            </div>
          </div>
        )}

        {!authOffline && currentUser && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <strong className="block text-sm">{currentUser.email}</strong>
                <span className="text-xs text-text-muted">{syncStatus || "Synced"}</span>
              </div>
            </div>
            <Button variant="secondary" onClick={() => signOut(auth)}>
              Sign Out
            </Button>
          </div>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <h4 className="font-bold text-base mb-3">Body Analyzer &amp; TDEE</h4>
          <div className="h-px bg-border mb-4" />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <Label>Age</Label>
              <Input type="number" value={form.age} onChange={(e) => updateField("age", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Sex</Label>
              <select
                className="flex h-11 w-full rounded-lg border border-border bg-black/30 px-3 text-sm"
                value={form.sex}
                onChange={(e) => updateField("sex", e.target.value as "male" | "female")}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <Label>Height (cm)</Label>
              <Input type="number" value={form.height} onChange={(e) => updateField("height", parseInt(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" value={form.weight} onChange={(e) => updateField("weight", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Waist (cm)</Label>
              <Input type="number" min={40} value={form.waist ?? ""} onChange={(e) => updateField("waist", parseFloat(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Neck (cm)</Label>
              <Input type="number" value={form.neck ?? ""} onChange={(e) => updateField("neck", parseFloat(e.target.value) || 0)} />
            </div>
            {form.sex === "female" && (
              <div>
                <Label>Hip (cm)</Label>
                <Input type="number" value={form.hip ?? ""} onChange={(e) => updateField("hip", parseFloat(e.target.value) || 0)} />
              </div>
            )}
            <div className="col-span-2">
              <Label>Activity Level</Label>
              <select
                className="flex h-11 w-full rounded-lg border border-border bg-black/30 px-3 text-sm"
                value={form.activity}
                onChange={(e) => updateField("activity", e.target.value)}
              >
                <option value="1.2">Sedentary</option>
                <option value="1.375">Lightly Active</option>
                <option value="1.55">Moderately Active</option>
                <option value="1.725">Very Active</option>
                <option value="1.9">Extra Active</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={calculate}>
            Calculate
          </Button>

          {form.bmr !== undefined && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-3">
              <div className="glass-card p-4 text-center bg-primary/5 border-primary/25">
                <span className="text-xs uppercase tracking-wide text-text-muted font-bold">Maintenance (TDEE)</span>
                <div className="text-3xl font-black text-primary">{form.tdee}</div>
                <span className="text-xs text-text-muted">kcal / day</span>
              </div>
              <div className="text-sm space-y-1.5 text-text-secondary">
                <p>
                  BMI: <strong className="text-text-primary">{form.bmi}</strong> &nbsp;·&nbsp; Body Fat:{" "}
                  <strong className="text-text-primary">{form.bf}%</strong>
                </p>
                <p>
                  BMR (Basal Metabolic Rate): <strong className="text-text-primary">{form.bmr}</strong> kcal/day
                </p>
                <p className="text-xs text-text-muted">{form.bmrFormula}</p>
                <p>
                  Lean Body Mass: <strong className="text-text-primary">{form.lbm} kg</strong>
                </p>
              </div>
            </motion.div>
          )}
        </Card>

        <Card>
          <h4 className="font-bold text-base mb-3">About These Calculations</h4>
          <div className="h-px bg-border mb-4" />
          <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
            <p>
              <strong className="text-text-primary">Body Fat %</strong> uses the U.S. Navy Circumference Method
              (Hodgdon &amp; Beckett, 1984) — needs waist + neck (+ hip for women). ±3-4% margin vs. hydrostatic weighing.
            </p>
            <p>
              <strong className="text-text-primary">BMR</strong> uses Katch-McArdle when body-fat data is available (more
              accurate — driven by lean body mass), otherwise Mifflin-St Jeor (1990), the Academy of Nutrition and
              Dietetics' recommended weight-based estimate.
            </p>
            <p>
              <strong className="text-text-primary">TDEE</strong> = BMR × activity multiplier (standard Harris-Benedict
              activity scale).
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
