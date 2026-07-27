# Hanma Health — Production Readiness Audit

**Audited:** 2026-07-27  
**Auditor role:** Senior QA Engineer · Senior Product Manager · Senior Frontend Engineer · Startup Product Auditor  
**Codebase branch:** `main` (post UI-redesign)  
**Live URL:** https://hanma-health.vercel.app

---

## CRITICAL ISSUES

---

### C-1 · Firebase API Key Hardcoded in Source Code

| | |
|---|---|
| **Problem** | Firebase config (apiKey, projectId, appId, measurementId) is committed verbatim in `src/lib/firebase.ts` lines 6–13. It ships in the compiled JS bundle and is visible to anyone who opens DevTools. |
| **Root Cause** | Config was written directly into the file rather than loaded from Vite env vars. |
| **Impact** | Any attacker who discovers your Firebase project ID can attempt brute-force auth, abuse Firestore quotas, or exploit loose Security Rules. Firebase API keys for web are "public by design," but combining a visible key with inadequate Firestore rules is dangerous. |
| **File(s)** | `src/lib/firebase.ts:6-13` |
| **Fix** | Move all values to `.env` (`VITE_FIREBASE_API_KEY`, etc.), add `.env` to `.gitignore`, load via `import.meta.env.VITE_*`. Add the variables as Replit Secrets so the deployed build picks them up. |

---

### C-2 · No Firestore Security Rules in the Codebase

| | |
|---|---|
| **Problem** | There is no `firestore.rules` file anywhere in the repo. The default Firebase rules shipped when a project is first created are either **world-readable/writable** (test mode) or locked to authenticated users with no path restrictions. |
| **Root Cause** | Rules were never authored or committed. |
| **Impact** | Any signed-in user can call `setDoc(doc(db, "users", VICTIM_UID), ...)` and overwrite another user's health data. If the project is still in test mode, even unauthenticated reads/writes are open for 30 days. |
| **File(s)** | Missing: `firestore.rules` |
| **Fix** | Create `firestore.rules` that restrict every user to their own document only: `allow read, write: if request.auth != null && request.auth.uid == userId;`. Deploy with `firebase deploy --only firestore:rules`. |

---

### C-3 · Streak Counter Is Hardcoded — Never Updates

| | |
|---|---|
| **Problem** | `state.streak` is initialized to `{ currentStreak: 12, loggedDaysCount: 17, lastLogDate: yesterday }` in `createDefaultState()`. There is no code anywhere that ever increments, resets, or re-calculates the streak when a user logs food or a workout. Every new user appears to have a 12-day streak on day one. |
| **Root Cause** | The streak model was defined in `types/index.ts` but the update logic was never implemented. |
| **Impact** | Core gamification metric displays fabricated data. When discovered by users, this destroys trust. |
| **File(s)** | `src/lib/defaultState.ts:68-72`, `src/types/index.ts:62-66` |
| **Fix** | In `updateDayLog` (or a dedicated `useEffect` on `state`), compute the streak by checking `dailyLogs` keys in reverse-chronological order. Reset streak to 0 if today and yesterday have no log. |

---

### C-4 · Weight Progress Chart Cannot Receive New Entries

| | |
|---|---|
| **Problem** | `state.progressHistory` is the data source for the weight trend `LineChart` on the Progress page. There is no UI — no form, no button, no modal — to add a new `ProgressEntry`. The chart permanently displays the 3 seeded entries ("Week 1", "Week 2", "Week 3"). |
| **Root Cause** | The Progress page was built to display data but the input path was never built. |
| **Impact** | Weight tracking — explicitly listed as a core feature — is completely non-functional for real users. |
| **File(s)** | `src/pages/Progress.tsx`, `src/types/index.ts:55-60` |
| **Fix** | Add a "Log Weight" form to the Progress page (or a modal) that appends `{ date: todayIso(), weight: number }` to `state.progressHistory`. |

---

### C-5 · Seed Data Shown to Every New User

| | |
|---|---|
| **Problem** | `createDefaultState()` seeds `progressHistory` with "Week 1/2/3" entries, `streak.currentStreak: 12`, `streak.loggedDaysCount: 17`, and two full days of fake food and workout logs in `dailyLogs`. Every brand-new user sees fabricated data that looks like their own. |
| **Root Cause** | Demo data was never gated behind a dev-only flag. |
| **Impact** | Users are deceived into thinking the app already knows their history. Their first interaction is confusion, not a clean onboarding. |
| **File(s)** | `src/lib/defaultState.ts:33-81` |
| **Fix** | Ship empty `dailyLogs: {}`, `progressHistory: []`, `streak: { currentStreak: 0, loggedDaysCount: 0, lastLogDate: "" }` as defaults. Move seed data to a separate `devSeedState` only loaded in development (`import.meta.env.DEV`). |

---

## HIGH PRIORITY ISSUES

---

### H-1 · Old Neon Color `#00ff88` Surviving in Two Pages

| | |
|---|---|
| **Problem** | The redesign changed the accent from `#00ff88` (neon green) to `#22c55e` (emerald). Two pages were missed. The calorie ring SVG stroke in `Nutrition.tsx` is still `#00ff88`. The weight chart line and dot fill in `Progress.tsx` are still `#00ff88`. |
| **Root Cause** | Inline hex values bypassed the Tailwind token system and weren't caught in the redesign sweep. |
| **Impact** | Visual inconsistency — the brand color is wrong on two of the six pages. |
| **File(s)** | `src/pages/Nutrition.tsx:79`, `src/pages/Progress.tsx:40-41` |
| **Fix** | Change every `#00ff88` to `#22c55e`. Enforce this going forward by defining a CSS variable `--color-primary: #22c55e` and referencing it in inline SVG styles. |

---

### H-2 · Custom Food Logging Drops All Macro Data

| | |
|---|---|
| **Problem** | When a user adds a custom food entry (name + kcal only), `addCustom()` saves `{ carb: 0, prot: 0, fat: 0 }` regardless of what the user actually ate. The macro bars (Carbs, Protein, Fat) remain permanently underreported for any day with custom entries. |
| **Root Cause** | The custom food form only has two fields (`name`, `kcal`). Macro inputs were never added. |
| **Impact** | Custom food, which is the primary entry path for foods not in the 24-item database, silently corrupts macro tracking. |
| **File(s)** | `src/pages/Nutrition.tsx:49-55`, `src/pages/Nutrition.tsx:145-151` |
| **Fix** | Add optional `carb`, `prot`, `fat` number inputs to the custom food row. Display them as compact fields (e.g., `C / P / F` in grams). |

---

### H-3 · Google Sign-In Not Implemented

| | |
|---|---|
| **Problem** | The Profile page only offers email + password authentication (sign in / create account). There is no "Continue with Google" button. Google Sign-In is listed as a required feature in the audit brief and is the expected auth flow for a modern consumer fitness app. |
| **Root Cause** | Only `signInWithEmailAndPassword` and `createUserWithEmailAndPassword` were wired up. |
| **Impact** | Sign-up friction is significantly higher than competitors. Users on mobile are unlikely to create a new email/password account for a fitness app they just discovered. |
| **File(s)** | `src/pages/Profile.tsx:52-70` |
| **Fix** | Add `GoogleAuthProvider` + `signInWithPopup` (desktop) / `signInWithRedirect` (mobile). Add a styled "Sign in with Google" button above the email fields. |

---

### H-4 · Water Reminder Hook Has a Stale Closure

| | |
|---|---|
| **Problem** | In `useWaterReminders.ts`, the `start()` function that creates the `setInterval` captures `state`, `selectedDate`, and `getDayLog` from the closure at the time the `useEffect` runs. The interval will always read the state values from when reminders were last toggled, not from the current moment the notification fires. Water % in the notification body will be stale. |
| **Root Cause** | `setInterval` callback captures closure variables by value at creation time. The `useEffect` dependency array only lists `enabled` and `intervalMinutes`. |
| **Impact** | Notifications report incorrect hydration percentages; if the user drinks water between when the reminder was enabled and when it fires, the notification still says their old, lower hydration level. |
| **File(s)** | `src/hooks/useWaterReminders.ts:22-36` |
| **Fix** | Use a `useRef` to hold a "current values" object (`stateRef.current = state; selectedDateRef.current = selectedDate`) and read from the ref inside the interval callback instead of from the closure. |

---

### H-5 · No History Date Navigation

| | |
|---|---|
| **Problem** | `setSelectedDate` is exported from `AppStateContext` but there is no UI anywhere that calls it. Users are permanently locked to today's date. The daily history logged in `state.dailyLogs` (food, workouts, water) cannot be viewed or corrected for any past day. |
| **Root Cause** | The navigation control was never built. |
| **Impact** | Users who miss logging and want to backfill, or who want to review yesterday's meals, cannot do so. Historical data in the store is write-only (it can only be added today, never read back). |
| **File(s)** | `src/store/AppStateContext.tsx:19`, every page — no consumer of `setSelectedDate` |
| **Fix** | Add a date picker or `← / →` day navigation to the Dashboard header (or a global date bar). Wire it to `setSelectedDate`. Pages already use `selectedDate` and `getDayLog(selectedDate)` so the data layer is already ready. |

---

### H-6 · `title` in `index.html` Is the Development Package Name

| | |
|---|---|
| **Problem** | `<title>hanma-gym-react</title>` — the browser tab, bookmark title, and home-screen label on iOS/Android all read "hanma-gym-react". |
| **Root Cause** | The default Vite scaffold title was never updated. |
| **Impact** | Unprofessional first impression. Breaks PWA-style home-screen installs on mobile. |
| **File(s)** | `index.html:6` |
| **Fix** | Change to `<title>Hanma Health</title>`. Add `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:image">`. |

---

### H-7 · No Web App Manifest or Apple Touch Icon

| | |
|---|---|
| **Problem** | There is no `manifest.json` / `site.webmanifest`, no `apple-touch-icon`, no `theme-color` meta tag. The app cannot be "Add to Home Screen" installed properly on iOS or Android. |
| **Root Cause** | PWA setup was skipped. |
| **Impact** | A health/fitness app is used daily on mobile. Without a proper manifest, the icon on the home screen is a generic screenshot, the status bar colour is wrong, and the splash screen is blank. This is expected baseline behaviour for a fitness app. |
| **File(s)** | `index.html`, `public/` (missing) |
| **Fix** | Add `manifest.json` with `name`, `short_name`, `icons` (192×192 and 512×512), `theme_color: "#22c55e"`, `background_color: "#0b0c10"`, `display: "standalone"`. Link it from `index.html`. |

---

## MEDIUM PRIORITY ISSUES

---

### M-1 · `skinTheme` Setting Is Defined But Never Applied

| | |
|---|---|
| **Problem** | `AppSettings.skinTheme: "classic" \| "demon"` exists in `types/index.ts` and is stored in state, but nothing in the UI reads it or changes the visual output based on its value. |
| **File(s)** | `src/types/index.ts:75-77`, `src/lib/defaultState.ts:73` |
| **Fix** | Either implement the theme system (different accent color, different backgrounds) or remove `skinTheme` from the type and state to avoid confusion. |

---

### M-2 · Food Database Has Only 24 Items — All Bangladeshi/Bengali

| | |
|---|---|
| **Problem** | The entire food database is 24 Bengali dishes. There are no generic protein sources (egg white, whey, greek yogurt), vegetables, fruits, or international foods. Users who eat anything other than traditional Bengali food have nothing to select. |
| **File(s)** | `src/data/foodDatabase.ts` |
| **Fix** | Expand to at least 80–100 items in logical categories: Grains, Proteins, Vegetables, Fruits, Dairy, Street Food, Snacks. Add a `category` field to `FoodItem` for filtering. |

---

### M-3 · No Loading State During Firebase Cloud Pull

| | |
|---|---|
| **Problem** | When a signed-in user loads the app, `isPullingCloud.current = true` and a `getDoc` call runs asynchronously. During this window, the UI renders stale localStorage data with no indication that a sync is in progress. If the pull takes 2–3 seconds, the user may start logging food into stale data before the cloud state overwrites it. |
| **File(s)** | `src/store/AppStateContext.tsx:89-105` |
| **Fix** | Add an `isSyncing: boolean` state variable. Set it `true` before `getDoc`, `false` in `finally`. Show a small banner ("Syncing your data…") while true. Disable log actions during the pull. |

---

### M-4 · No Success Feedback When Food or Workout Is Logged

| | |
|---|---|
| **Problem** | Clicking a food tile or pressing "Log This Routine" gives no visual confirmation beyond the item appearing in the list. Users on mobile often miss the list update (it's below the fold) and tap again, logging duplicates. |
| **File(s)** | `src/pages/Nutrition.tsx:35-40`, `src/components/workouts/RoutineModal.tsx:17-23` |
| **Fix** | Add a brief toast notification ("Roti added to Breakfast ✓") on each successful log action. A lightweight 2-second auto-dismiss toast is sufficient. |

---

### M-5 · No Confirmation Before Removing a Food Item

| | |
|---|---|
| **Problem** | The `Trash2` delete button on logged food items calls `removeFood(i)` immediately with no undo. On mobile where touch targets are small, accidental taps are common. |
| **File(s)** | `src/pages/Nutrition.tsx:168-170` |
| **Fix** | Either show a confirmation toast with an "Undo" action (2-3 seconds), or require a long-press/swipe to delete. |

---

### M-6 · `authOffline` Banner Triggers After Only 6 Seconds

| | |
|---|---|
| **Problem** | A `setTimeout(() => setAuthOffline(true), 6000)` in `AppStateContext.tsx` marks the connection as offline if Firebase auth hasn't responded in 6 seconds. On a slow mobile connection (3G, first load), this is a realistic latency and will falsely flag the user as offline. |
| **File(s)** | `src/store/AppStateContext.tsx:81` |
| **Fix** | Increase the timeout to 15–20 seconds, or use Firebase's own `onAuthStateChanged` to distinguish between "still connecting" and "confirmed offline." |

---

### M-7 · Progress Page Seed Data Uses Non-ISO Date Strings

| | |
|---|---|
| **Problem** | `progressHistory` entries are seeded with `date: "Week 1"`, `"Week 2"`, `"Week 3"`. Any real entry added later would use an ISO date like `"2026-07-26"`. The chart XAxis will mix "Week 1" labels with ISO date labels. |
| **File(s)** | `src/lib/defaultState.ts:64-67` |
| **Fix** | Use proper ISO dates for seed entries (or remove them — see C-5). Enforce `date: string` in `ProgressEntry` to always be ISO format. |

---

### M-8 · `DietPlannerCard` TDEE Defaults to 0 for New Users Without Running `Calculate`

| | |
|---|---|
| **Problem** | `generateDietBudget` uses `state.userProfile.tdee`. For a new user who hasn't visited Profile and pressed "Calculate", `tdee` defaults to `2400` (from seed data). If seed data is removed (see C-5), `tdee` will be `0`, causing `generateDietBudget` to return a negative or floor calorie budget. |
| **File(s)** | `src/components/nutrition/DietPlannerCard.tsx:34`, `src/lib/defaultState.ts:23` |
| **Fix** | Guard `generateDietBudget` when `tdee === 0`: show an inline prompt "Complete your profile first to calculate your calorie budget." |

---

### M-9 · `activity` Field Stored as String in `UserProfile`

| | |
|---|---|
| **Problem** | `UserProfile.activity` is typed `string` and stores the activity multiplier as `"1.375"`. Every calculation that uses it calls `parseFloat(activity)`, which will silently return `NaN` if any invalid value enters the field. The `<select>` in Profile forces valid values, but this is a fragile contract. |
| **File(s)** | `src/types/index.ts:8`, `src/lib/calculations.ts:70` |
| **Fix** | Change the type to `number` and parse once at the `<select onChange>` boundary with `parseFloat`. |

---

### M-10 · Hydration Page Uses Undefined Tailwind Classes

| | |
|---|---|
| **Problem** | `text-cyan`, `bg-cyan`, `border-cyan/35`, `shadow-glow-cyan`, and `animate-block-pulse` are used throughout `Hydration.tsx`. Tailwind's `cyan` color requires a numeric shade (`text-cyan-400`); bare `text-cyan` produces no color. `shadow-glow-cyan` and `animate-block-pulse` are not defined in `tailwind.config.js`. This means the hydration blocks have no fill animation and the cyan styling silently has no effect. |
| **File(s)** | `src/pages/Hydration.tsx:49,57,63,78,92,108`, `tailwind.config.js` |
| **Fix** | Either add `cyan` to the Tailwind theme extension (e.g., `cyan: { DEFAULT: "#06b6d4" }`), or replace bare `text-cyan` with `text-cyan-400`. Add `glow-cyan` to `boxShadow` and `block-pulse` to `keyframes`/`animation` in `tailwind.config.js`. |

---

## LOW PRIORITY ISSUES

---

### L-1 · No Privacy Policy, Terms of Service, or Medical Disclaimer

| | |
|---|---|
| **Problem** | There are no legal pages anywhere in the app or linked from any UI surface. |
| **Impact** | A health and fitness app that stores user biometric data (weight, body fat %, BMI, calorie history) and issues calorie deficit recommendations legally requires a Privacy Policy in most markets (GDPR, CCPA) and a Medical Disclaimer stating that the app is not a substitute for medical advice. Without these, the app cannot be lawfully operated commercially. |
| **Fix** | Create three static pages or modal overlays: `/privacy`, `/terms`, `/disclaimer`. Link them from the footer or Profile page. A Medical Disclaimer should be displayed on first launch. |

---

### L-2 · `favoriteFoods` Array Is Never Displayed or Used

| | |
|---|---|
| **Problem** | `WeightPlanner.favoriteFoods: string[]` is stored in state but nothing reads it. It was presumably intended to surface favourite items at the top of the food picker. |
| **File(s)** | `src/types/index.ts:27`, `src/lib/defaultState.ts:31` |
| **Fix** | Either implement "pin to top" food shortcuts in Nutrition, or remove the field. |

---

### L-3 · No OG / Social Meta Tags

| | |
|---|---|
| **Problem** | No `og:title`, `og:description`, `og:image`, `twitter:card`, or canonical URL. Sharing the app URL in WhatsApp, Instagram bio, or Twitter produces a blank unfurl. |
| **File(s)** | `index.html` |
| **Fix** | Add standard OG + Twitter Card meta tags with a 1200×630 preview image. |

---

### L-4 · `ExerciseModal` Does Not Allow Logging Individual Exercises

| | |
|---|---|
| **Problem** | Clicking an exercise in the library opens a modal that presumably shows exercise details, but individual exercises cannot be logged to the day's workout (only full routines can be logged via `RoutineModal`). |
| **File(s)** | `src/components/workouts/ExerciseModal.tsx` |
| **Fix** | Add a "Log this exercise" button to `ExerciseModal` with a duration/sets input that calculates burn via `calculateWorkoutBurn` and appends to `dayLog.workouts`. |

---

### L-5 · No Empty State on Dashboard for New Users After Fixing C-5

| | |
|---|---|
| **Problem** | Once seed data is removed, the Dashboard will show zero rings, empty weekly progress (0%), and "No workout today" — but with no guidance on what to do. |
| **File(s)** | `src/pages/Dashboard.tsx` |
| **Fix** | Add a first-run onboarding card: "Welcome to Hanma Health. Start by setting up your profile →" that disappears after the user visits Profile and runs `Calculate`. |

---

### L-6 · `getWorkoutsLoggedThisWeek` Counts Workouts Not Workout Days

| | |
|---|---|
| **Problem** | The function name and the Dashboard label ("3 workouts this week") are accurate, but if a user logs 3 routines on Monday, it returns 3 — making it look like 3 active days rather than 1 very active day. The AI Insights copy ("You've completed 3 workouts this week") can therefore be misleading. |
| **File(s)** | `src/lib/calculations.ts:147-165`, `src/pages/Dashboard.tsx` |
| **Fix** | Clarify the label to "3 sessions this week" or create a companion `getWorkoutDaysThisWeek` that counts unique days with at least one workout. |

---

## SECURITY SUMMARY

| Area | Status | Notes |
|---|---|---|
| Firebase API key in env vars | ❌ | Hardcoded in source (C-1) |
| Firestore Security Rules | ❌ | No rules file found (C-2) |
| Firebase Auth (email/password) | ✅ | Implemented with error mapping |
| Firebase Auth (Google) | ❌ | Not implemented (H-3) |
| LocalStorage — sensitive data | ⚠️ | Full app state (including body metrics) stored unencrypted — acceptable for a fitness app but worth noting |
| HTTPS | ✅ | Vercel deployment |
| XSS vectors | ✅ | React escapes by default; no `dangerouslySetInnerHTML` found |
| Dependency vulnerabilities | Not scanned | Run `npm audit` |
| Firebase Analytics | ✅ | Implemented with graceful ad-blocker fallback |

---

## PRODUCTION READINESS CHECKLIST

| Item | Status |
|---|---|
| Privacy Policy | ❌ Missing |
| Terms & Conditions | ❌ Missing |
| Medical Disclaimer | ❌ Missing |
| Error Boundaries | ✅ Added (wraps all pages + AppShell) |
| Firebase Analytics | ✅ Configured with safe fallback |
| Crash Handling | ✅ ErrorBoundary with "Try again" |
| App Manifest / PWA | ❌ Missing |
| Mobile viewport meta | ✅ `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| Correct page title | ❌ "hanma-gym-react" (H-6) |
| OG / social sharing | ❌ Missing (L-3) |
| Firestore Rules | ❌ Missing (C-2) |

---

## SCORES

| Dimension | Score | Rationale |
|---|---|---|
| **Launch Readiness** | **38 / 100** | Two critical security gaps (C-1, C-2), two broken features (C-3 streak, C-4 weight entry), fake seed data (C-5), and zero legal pages block any commercial launch. |
| **Commercial Readiness** | **28 / 100** | No privacy policy, no medical disclaimer, no Google Sign-In, no PWA manifest, wrong page title, no OG sharing. The product cannot be marketed or submitted to any app catalogue in this state. |
| **User Retention** | **44 / 100** | Core gamification (streak) is fake. Weight tracking is broken. No date history navigation. No push notifications for closed-browser reminders. Food database has only 24 items — most users will give up on day two. The UI quality and workout logging are solid foundations. |

---

## TOP 10 MISSING FEATURES BEFORE LAUNCH

| # | Feature | Why It Blocks Launch |
|---|---|---|
| 1 | **Weight entry UI** | The weight chart is permanently static. Weight tracking is advertised and broken. |
| 2 | **Real streak calculation** | The only gamification metric is fake. Users will discover this immediately. |
| 3 | **Firebase Security Rules** | Any signed-in user can overwrite any other user's data. Critical security gap. |
| 4 | **Privacy Policy + Medical Disclaimer** | Legally required for any health app processing biometric data in any major market. |
| 5 | **Google Sign-In** | Without OAuth, mobile signup conversion will be < 10%. Email/password alone is insufficient for a consumer app. |
| 6 | **Remove seed data from production** | Fabricated data shown to every new user destroys trust on first use. |
| 7 | **Date navigation for historical logs** | The data model supports history — users need to see and fix it. |
| 8 | **Web App Manifest + icons** | Daily-use fitness apps must be installable on iOS and Android home screens. |
| 9 | **Expanded food database** | 24 items covering only Bengali cuisine is unusable for most users' daily logs. |
| 10 | **Custom food macro inputs** | All custom food entries save `carb: 0, prot: 0, fat: 0` — silently corrupts the macro tracker. |

---

## EXACT ROADMAP TO PRODUCTION-READY STATUS

### Phase 1 — Security & Trust (Week 1) · Blocks launch

1. Move Firebase config to Vite env vars + Replit Secrets (`VITE_FIREBASE_API_KEY`, etc.)
2. Write and deploy `firestore.rules` — restrict every user to `users/{uid}` only
3. Write Privacy Policy, Terms of Service, Medical Disclaimer (static pages or modal)
4. Fix `index.html` title, add OG meta tags, add `manifest.json` and icons

### Phase 2 — Broken Core Features (Week 1–2) · Breaks product promise

5. Remove seed data from production defaults (empty `dailyLogs`, `progressHistory`, `streak`)
6. Add **weight entry form** to Progress page → append to `progressHistory`
7. Implement **streak calculation** in `AppStateContext` on every `updateDayLog` call
8. Fix **old neon color** `#00ff88` in `Nutrition.tsx` and `Progress.tsx`
9. Fix `animate-block-pulse` + `shadow-glow-cyan` + `text-cyan` in `tailwind.config.js` (Hydration page visual breakage)

### Phase 3 — UX Polish (Week 2–3) · Reduces churn

10. Add **Google Sign-In** (`GoogleAuthProvider` + `signInWithPopup`)
11. Add **date navigation** UI (`← today →`) wired to `setSelectedDate`
12. Add **macro inputs** to custom food entry (`carb`, `prot`, `fat`)
13. Add **toast notifications** for food-logged, workout-logged, weight-saved
14. Fix **stale closure** in `useWaterReminders` (use refs)
15. Add **loading banner** during cloud pull (`isSyncing` state)

### Phase 4 — Expansion (Week 3–4) · Reaches retention target

16. Expand food database to 80–100 items with categories; add search/filter
17. Add **individual exercise logging** from `ExerciseModal`
18. Add **first-run onboarding card** on Dashboard for new users
19. Implement or remove `skinTheme` setting (dead code)
20. Add `npm audit` to CI and resolve any high/critical vulnerabilities
