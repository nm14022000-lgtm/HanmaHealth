# Hanma Gym — React Rewrite

A full rebuild of the Hanma Gym app in **React + TypeScript + Tailwind CSS + Framer Motion + shadcn-style UI + Lucide Icons**, on **Vite**.

All your original data, features, and formulas were ported over exactly (not retyped by hand — extracted programmatically from the live app so nothing drifted):
- 36 exercises, all 3 routines (Push/Pull/Legs), 24 Bangladeshi food items, 5 muscle illustrations
- BMI / Navy body-fat% / Katch-McArdle & Mifflin-St Jeor BMR / TDEE / diet budget / MET workout burn / water target — same formulas, same sources
- Firebase Auth + Firestore cross-device cloud sync
- Water reminder notifications (with the same "works while the app's open" honesty note as before)

## 1. Install

You need **Node.js 18+** installed. Then, in this folder:

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## 3. Build for production

```bash
npm run build
```

Outputs static files to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## 4. Deploy

This is a static site after build — deploy `dist/` anywhere that serves static files (Vercel, Netlify, GitHub Pages, etc.). For **Vercel**:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

If you're moving from the old static-HTML Vercel project to this one, you'll want to either replace that project's contents with this repo, or create a fresh Vercel project pointing at this folder.

## 5. Firebase setup (same project as before)

The Firebase config in `src/lib/firebase.ts` is already set to your existing project (`hanmahealth-cbfe6`). Make sure, in the [Firebase Console](https://console.firebase.google.com/):

1. **Authentication → Sign-in method → Email/Password** is enabled.
2. **Firestore Database** exists (production mode).
3. Firestore **Rules** are set to:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## Project structure

```
src/
  components/
    ui/            shadcn-style primitives (Button, Card, Dialog, Progress, Tabs, Switch, Input, Label)
    layout/         Sidebar/nav + page transition wrapper
    dashboard/      Hero banner, weekly progress ring, quick actions, animated counter
    workouts/       Exercise modal, routine modal
  data/             Exercise library, routines, food database, muscle images (ported 1:1 from the original)
  lib/
    calculations.ts   Every formula (BMI, body fat%, BMR, TDEE, water, MET burn) with source comments
    firebase.ts        Firebase init
    defaultState.ts    Seed data + the "never crash on missing fields" state migration
    utils.ts           cn() class-merging helper
  store/            Global app state (React Context) + localStorage/Firestore sync
  hooks/            Water reminder notification scheduling
  pages/            Dashboard, Workouts, Nutrition, Hydration, Progress, Profile
```

## Known limitations (carried over honestly from the original)

- **Water reminders** use the browser's Notification API + an in-page timer. They work reliably while the site/PWA is open, but won't fire if the browser is fully closed — true always-on push needs a backend (Firebase Cloud Messaging + a scheduled Cloud Function), which is separate infrastructure.
- **Nutrition data** is recipe-research-based (±15-20% real-world variance depending on oil/portion) — not lab-measured.
- The bundle is a bit large (~3MB) mostly because the 5 muscle illustrations are embedded as base64 so they never depend on a missing asset folder. If you want a leaner bundle later, these could be moved to `/public` as real image files instead.
