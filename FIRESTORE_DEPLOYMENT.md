# Firestore Security Rules — Deployment Guide

## What these rules protect

Every user's Hanma Health data lives in a single Firestore document at  
`users/{uid}` containing their nutrition logs, hydration history, workout  
records, weight history, body metrics, and app settings.

The rules enforce:

| Guarantee | How |
|---|---|
| Cross-user read isolation | `request.auth.uid == userId` on every read |
| Cross-user write isolation | Same check on every write |
| Anonymous user blocked | `sign_in_provider != 'anonymous'` |
| Timestamp forgery blocked | `updatedAt ≤ server time + 5 min` |
| Malformed data blocked | Structural + range validation on every write |
| All other paths denied | Top-level `/{document=**} → false` |

---

## Step 1 — Install the Firebase CLI

```bash
npm install -g firebase-tools
```

Verify:
```bash
firebase --version   # should be 13.x or later
```

---

## Step 2 — Log in and select your project

```bash
firebase login
firebase use hanmahealth-cbfe6
```

If the project is not listed:
```bash
firebase projects:list
firebase use --add
```

---

## Step 3 — Deploy the rules

From the project root (where `firebase.json` lives):

```bash
firebase deploy --only firestore:rules
```

Expected output:
```
✔  firestore: released rules firestore.rules to cloud.firestore
```

---

## Step 4 — Verify in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com) → **hanmahealth-cbfe6**
2. Navigate to **Firestore Database → Rules**
3. Confirm the rules match this file and the "Published" timestamp is recent
4. Use the **Rules Playground** to run the tests below

---

## Step 5 — Rules Playground test cases

Run these in Firebase Console → Firestore → Rules → Rules Playground.

### ✅ Should be ALLOWED

| Test | Path | Operation | Auth UID |
|---|---|---|---|
| Owner reads own doc | `users/abc123` | get | `abc123` |
| Owner writes own doc | `users/abc123` | set | `abc123` |
| Owner deletes own doc | `users/abc123` | delete | `abc123` |

### ❌ Should be DENIED

| Test | Path | Operation | Auth UID | Reason |
|---|---|---|---|---|
| Wrong user reads | `users/abc123` | get | `xyz999` | Different UID |
| Wrong user writes | `users/abc123` | set | `xyz999` | Different UID |
| Unauthenticated read | `users/abc123` | get | *(none)* | No auth token |
| Unauthenticated write | `users/abc123` | set | *(none)* | No auth token |
| Arbitrary path | `settings/global` | get | `abc123` | Not in rules |
| Future timestamp | `users/abc123` | set (updatedAt: now+10min) | `abc123` | Timestamp out of range |
| Missing state field | `users/abc123` | set (no `state` key) | `abc123` | Schema validation |
| Invalid age | `users/abc123` | set (age: 999) | `abc123` | Range validation |
| Invalid calorie budget | `users/abc123` | set (calorieBudget: -500) | `abc123` | Range validation |
| Anonymous user | `users/abc123` | get | `abc123` (anonymous) | Provider check |

---

## Step 6 — Move Firebase config to environment variables

The Firebase config values (API key, project ID, etc.) are currently  
hardcoded in `src/lib/firebase.ts`. This was identified as a critical issue  
in the production audit. The file has been updated to read from env vars.

### 6a — Local development

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your actual values from  
Firebase Console → Project Settings → Your apps → Web app.

`.env.local` is already gitignored via the `*.local` rule.

### 6b — Replit deployment

Add each `VITE_FIREBASE_*` variable as a Replit Secret  
(Tools → Secrets in the Replit workspace):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

### 6c — Vercel deployment

In Vercel → Project → Settings → Environment Variables, add the same  
seven keys. Make sure to set them for **Production**, **Preview**, and  
**Development** environments.

### 6d — Rotate the API key (recommended)

Because the old key was committed to git history, a motivated attacker  
could retrieve it from any public fork or cached view. To fully close  
this gap:

1. Firebase Console → Project Settings → General → Web API Key  
2. Click **Regenerate** (this invalidates the old key immediately)  
3. Update `.env.local` and all deployment environment variables with  
   the new key

---

## What the rules do NOT cover

| Area | Status | Notes |
|---|---|---|
| Firebase Storage | Not deployed | App does not use Storage |
| Firebase Auth rules | N/A | Auth is managed by Firebase itself |
| Firestore indexes | ✅ Empty `firestore.indexes.json` — no composite indexes needed for the current single-document-per-user model |
| Rate limiting | Partial | Firestore has built-in per-client rate limits; no custom throttle needed at this data scale |
| Data encryption at rest | ✅ | Firebase encrypts all Firestore data at rest by default |

---

## Re-deploying after rule changes

Any time `firestore.rules` is edited, redeploy:

```bash
firebase deploy --only firestore:rules
```

Consider adding this to your CI/CD pipeline so rule changes are  
automatically deployed on merge to `main`.
