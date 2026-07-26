import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgRosqcgOxIZP5nGcCqMOljY1RQZGA8o4",
  authDomain: "hanmahealth-cbfe6.firebaseapp.com",
  projectId: "hanmahealth-cbfe6",
  storageBucket: "hanmahealth-cbfe6.firebasestorage.app",
  messagingSenderId: "540316272873",
  appId: "1:540316272873:web:7314cf08de0d2fdce44878",
  measurementId: "G-G6YZGTTLJ7",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Analytics can fail quietly in some environments (ad-blockers, etc.) —
// never let it block the app.
isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  })
  .catch(() => {
    /* no-op */
  });
