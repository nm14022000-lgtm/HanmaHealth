// Firebase setup for Hanma Gym — Auth + Firestore cross-device sync.
// Loaded as a <script type="module">, exposes everything the classic app.js
// needs through window.fb so app.js does not need to become a module itself.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgRosqcgOxIZP5nGcCqMOljY1RQZGA8o4",
    authDomain: "hanmahealth-cbfe6.firebaseapp.com",
    projectId: "hanmahealth-cbfe6",
    storageBucket: "hanmahealth-cbfe6.firebasestorage.app",
    messagingSenderId: "540316272873",
    appId: "1:540316272873:web:7314cf08de0d2fdce44878",
    measurementId: "G-G6YZGTTLJ7"
};

const app = initializeApp(firebaseConfig);

// Analytics can fail quietly in some environments (ad-blockers, file:// preview, etc.)
// Never let it block the actual app functionality.
let analytics = null;
try {
    analytics = getAnalytics(app);
} catch (err) {
    console.warn("Firebase Analytics unavailable:", err);
}

const auth = getAuth(app);
const db = getFirestore(app);

// Expose a small bridge on window so the classic (non-module) app.js can use it.
window.fb = {
    app,
    analytics,
    auth,
    db,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    doc,
    getDoc,
    setDoc
};

// Let app.js know Firebase is ready, in case it started listening before this loaded.
window.dispatchEvent(new Event("firebase-ready"));
