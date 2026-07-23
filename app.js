// Shasthya v4 - Gym & Workout App JS Logic

// Global state
let state = {
    userProfile: {
        age: 28,
        sex: "male",
        height: 170,
        weight: 78,
        waist: 94,
        neck: 38,
        hip: 0,
        activity: "1.375",
        bmi: 27.0,
        bf: 25.0,
        lbm: 58.5,
        tdee: 2400
    },
    weightPlanner: {
        targetWeight: 68,
        timelineMonths: 3,
        timelineDays: 90,
        isCustomTimeline: false,
        mealCount: 4,
        favoriteFoods: ["Tehari"],
        calorieBudget: 1900,
        cheatFood: "Tehari"
    },
    dailyLogs: {
        // Prepopulated data to look rich on load
        "2026-07-20": {
            breakfast: [{ name: "Roti (রুটি)", kcal: 120, carb: 26, prot: 3, fat: 1 }, { name: "Egg (ডিম)", kcal: 75, carb: 0.5, prot: 6, fat: 5 }],
            lunch: [{ name: "Rice (ভাত)", kcal: 400, carb: 90, prot: 8, fat: 1 }, { name: "Fish (মাছ)", kcal: 180, carb: 0, prot: 22, fat: 10 }],
            dinner: [{ name: "Chicken (মুরগি)", kcal: 250, carb: 0, prot: 28, fat: 14 }],
            snacks: [],
            workouts: [
                { name: "Running (দৌড়ানো)", kcal: 350, duration: 30, type: "Cardio" }
            ]
        },
        "2026-07-21": {
            breakfast: [{ name: "Egg (ডিম)", kcal: 150, carb: 1, prot: 12, fat: 10 }],
            lunch: [{ name: "Rice (ভাত)", kcal: 200, carb: 45, prot: 4, fat: 0.5 }, { name: "Beef (গরু)", kcal: 320, carb: 0, prot: 24, fat: 25 }],
            dinner: [{ name: "Fish (মাছ)", kcal: 180, carb: 0, prot: 22, fat: 10 }],
            snacks: [{ name: "Chotpoti (চটপটি)", kcal: 250, carb: 42, prot: 10, fat: 5 }],
            workouts: [
                { name: "Bench Press", kcal: 164, duration: 30, type: "Gym" },
                { name: "Lateral Raises", kcal: 82, duration: 30, type: "Gym" }
            ]
        }
    },
    progressHistory: [
        { date: "Week 1", weight: 78, bf: 25, waist: 94 },
        { date: "Week 2", weight: 77.5, bf: 24.8, waist: 93.5 },
        { date: "Week 3", weight: 76.8, bf: 24.3, waist: 92.8 }
    ],
    streak: {
        currentStreak: 12,
        loggedDaysCount: 17,
        lastLogDate: "2026-07-21"
    },
    settings: {
        skinTheme: "classic" // classic (lime) or demon (red)
    }
};

// Selection metrics
let selectedDate = "";
let calendarYear = 2026;
let calendarMonth = 6; // July (0-indexed)
let activeMealSlot = "breakfast";
let activeRoutineDetails = null;
let activeExerciseDetails = null;

// Global chart handle
let analyticsChart = null;

// Exercise Database Catalog
const exerciseLibrary = [
    { name: "Bench Press", type: "Gym", category: "chest", met: 6.0, muscle: "Chest, Triceps, Shoulders", img: "chest", instruction: "Lie flat on a bench. Grip barbell slightly wider than shoulder-width, lower barbell slowly to chest level, then push it back up with control." },
    { name: "Incline Dumbbell Press", type: "Gym", category: "chest", met: 6.0, muscle: "Chest (Upper), Shoulders, Triceps", img: "chest", instruction: "Position incline bench at 30-45 degrees. Grip dumbbells, start at shoulders, press straight up and meet at center without locking out." },
    { name: "Squats", type: "Gym", category: "legs", met: 5.5, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Position barbell on shoulder traps. Stand feet shoulder-width, bend hips back and knees forward until thighs are parallel to ground, then drive back up." },
    { name: "Deadlifts", type: "Gym", category: "legs", met: 6.0, muscle: "Back (Lower), Hamstrings, Glutes", img: "legs", instruction: "Stand feet hip-width. Bend and grip barbell. Lift bar vertically by driving legs down and extending hips at top, keeping bar close to shins." },
    { name: "Pull-ups", type: "Gym", category: "back", met: 6.0, muscle: "Back (Lats), Biceps, Forearms", img: "back", instruction: "Hang from pull-up bar with overhand grip wider than shoulders. Pull body up until chin clears bar, lower body with control." },
    { name: "Overhead Press", type: "Gym", category: "shoulders", met: 5.0, muscle: "Shoulders, Triceps, Core", img: "shoulders", instruction: "Hold barbell at shoulder height, rack position. Press bar directly overhead, pushing head forward slightly at lock-out." },
    { name: "Bicep Curls", type: "Gym", category: "arms", met: 3.0, muscle: "Biceps, Brachialis", img: "arms", instruction: "Stand straight, grip dumbbells with palms facing up. Keeping elbows close to ribs, curl weight up towards shoulders. Squeeze at top." },
    { name: "Lateral Raises", type: "Gym", category: "shoulders", met: 3.0, muscle: "Shoulders (Lateral), Traps", img: "shoulders", instruction: "Stand holding dumbbells at sides. Raise arms out to sides with slight elbow bend until parallel to floor, then slowly lower." },
    { name: "Tricep Pushdowns", type: "Gym", category: "arms", met: 3.5, muscle: "Triceps", img: "arms", instruction: "Attach rope to high pulley. Grip rope, keep elbows pinned to ribs, extend arms down by engaging triceps, then return slowly." },
    { name: "Running", type: "Cardio", category: "cardio", met: 9.8, muscle: "Legs, Heart, Lungs", img: "legs", instruction: "Continuous steady-state outdoor or treadmill running. Promotes high cardiovascular endurance." },
    { name: "Cycling", type: "Cardio", category: "cardio", met: 7.5, muscle: "Quads, Hamstrings, Heart", img: "legs", instruction: "Steady-state bicycle riding. Build endurance and burns calories with low impact on joints." },
    { name: "Swimming", type: "Cardio", category: "cardio", met: 8.0, muscle: "Full Body, Back, Shoulders", img: "chest", instruction: "Steady lap swimming in a pool. Targets upper body and cardiovascular conditioning." },
    { name: "Jump Rope", type: "Cardio", category: "cardio", met: 10.0, muscle: "Calves, Delts, Cardiovascular", img: "legs", instruction: "Continuous jump-rope skipping. Promotes rapid agility, calf strength, and calorie burn." },
    { name: "HIIT Cardio", type: "Cardio", category: "cardio", met: 8.0, muscle: "Full Body, Cardiovascular", img: "back", instruction: "High intensity workout interval rounds. Alternates maximum efforts with recovery periods." },
    { name: "Air Bike", type: "Cardio", category: "cardio", met: 8.5, muscle: "Quads, Hamstrings, Cardiovascular", img: "legs", instruction: "Sit on the air/fan bike, grip handles, pedal while pushing/pulling handles in a steady rhythm. Resistance scales with your effort, great for intervals." },
    { name: "Rowing Machine", type: "Cardio", category: "cardio", met: 8.5, muscle: "Back, Legs, Cardiovascular", img: "back", instruction: "Sit on rower, drive through legs first, then lean back and pull handle to chest. Reverse the order returning to start position." },
    { name: "Stair Climbing", type: "Cardio", category: "cardio", met: 9.0, muscle: "Glutes, Quads, Cardiovascular", img: "legs", instruction: "Continuous stair machine or real-stair climbing at a steady pace, driving through the heel of each step." },
    { name: "Push-ups", type: "Gym", category: "chest", met: 8.0, muscle: "Chest, Triceps, Shoulders", img: "chest", instruction: "Start in plank position, hands slightly wider than shoulders. Lower chest to floor keeping body straight, then push back up." },
    { name: "Cable Chest Fly", type: "Gym", category: "chest", met: 4.0, muscle: "Chest (Inner), Shoulders", img: "chest", instruction: "Stand between cable towers, grip handles. Bring hands together in a wide arc in front of chest, squeeze, then return slowly." },
    { name: "Dips", type: "Gym", category: "chest", met: 6.0, muscle: "Chest (Lower), Triceps, Shoulders", img: "chest", instruction: "Support body on parallel bars, lower until elbows reach 90 degrees leaning slightly forward, then press back up." },
    { name: "Bent-over Barbell Row", type: "Gym", category: "back", met: 6.0, muscle: "Back (Lats, Mid), Biceps", img: "back", instruction: "Hinge at hips holding barbell, back flat. Pull bar towards lower ribs squeezing shoulder blades, then lower with control." },
    { name: "Lat Pulldown", type: "Gym", category: "back", met: 5.0, muscle: "Back (Lats), Biceps", img: "back", instruction: "Sit at lat pulldown machine, grip bar wide. Pull bar down to upper chest, squeezing lats, then let it rise back with control." },
    { name: "Seated Cable Row", type: "Gym", category: "back", met: 5.0, muscle: "Back (Mid), Lats, Biceps", img: "back", instruction: "Sit at cable row station, feet on platform. Pull handle to torso keeping back straight, squeeze shoulder blades, release slowly." },
    { name: "Dumbbell Shrugs", type: "Gym", category: "back", met: 3.5, muscle: "Traps", img: "back", instruction: "Hold dumbbells at sides, shrug shoulders straight up towards ears, pause briefly, then lower with control." },
    { name: "Dumbbell Lunges", type: "Gym", category: "legs", met: 5.0, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Hold dumbbells at sides, step forward into a lunge until both knees reach 90 degrees, push back to start, alternate legs." },
    { name: "Leg Press", type: "Gym", category: "legs", met: 5.0, muscle: "Quads, Glutes, Hamstrings", img: "legs", instruction: "Sit in leg press machine, feet shoulder-width on platform. Lower weight by bending knees to 90 degrees, then press back up." },
    { name: "Leg Extension", type: "Gym", category: "legs", met: 4.0, muscle: "Quads", img: "legs", instruction: "Sit on leg extension machine, pad on shins. Extend legs straight out squeezing quads, then lower with control." },
    { name: "Leg Curls", type: "Gym", category: "legs", met: 4.0, muscle: "Hamstrings", img: "legs", instruction: "Lie face down on leg curl machine, pad on ankles. Curl heels towards glutes squeezing hamstrings, then lower slowly." },
    { name: "Calf Raises", type: "Gym", category: "legs", met: 3.5, muscle: "Calves", img: "legs", instruction: "Stand on edge of a step or calf machine, rise up onto toes as high as possible, pause, then lower heels below the step level." },
    { name: "Romanian Deadlift", type: "Gym", category: "legs", met: 5.5, muscle: "Hamstrings, Glutes, Lower Back", img: "legs", instruction: "Hold barbell, soft knees. Hinge at hips pushing glutes back, lower bar along legs until hamstring stretch, then drive hips forward." },
    { name: "Arnold Press", type: "Gym", category: "shoulders", met: 5.0, muscle: "Shoulders (All heads), Triceps", img: "shoulders", instruction: "Hold dumbbells at shoulders, palms facing you. Press up while rotating palms to face forward, reverse the rotation lowering back down." },
    { name: "Face Pulls", type: "Gym", category: "shoulders", met: 3.5, muscle: "Shoulders (Rear), Traps", img: "shoulders", instruction: "Set cable at face height with rope attachment. Pull rope towards face, flaring elbows wide, squeezing rear delts, then return slowly." },
    { name: "Front Raises", type: "Gym", category: "shoulders", met: 3.0, muscle: "Shoulders (Front)", img: "shoulders", instruction: "Hold dumbbells in front of thighs. Raise arms straight forward to shoulder height, pause, then lower with control." },
    { name: "Hammer Curls", type: "Gym", category: "arms", met: 3.0, muscle: "Biceps, Forearms", img: "arms", instruction: "Hold dumbbells with palms facing each other (neutral grip). Curl weights up towards shoulders keeping wrists neutral, then lower." },
    { name: "Skull Crushers", type: "Gym", category: "arms", met: 3.5, muscle: "Triceps", img: "arms", instruction: "Lie on bench holding barbell/EZ-bar above chest. Bend elbows lowering bar towards forehead, then extend arms back up." },
    { name: "Concentration Curls", type: "Gym", category: "arms", met: 3.0, muscle: "Biceps", img: "arms", instruction: "Sit, brace elbow against inner thigh holding dumbbell. Curl weight up squeezing bicep, then lower slowly with full control." }
];

// Routines details database
const routineDatabase = {
    push: {
        name: "Push Day",
        muscles: "Chest, Shoulders, Triceps",
        kcal: 320,
        duration: 45,
        exercises: [
            { name: "Bench Press", sets: 4, reps: 12 },
            { name: "Incline Dumbbell Press", sets: 4, reps: 12 },
            { name: "Overhead Press", sets: 3, reps: 10 },
            { name: "Lateral Raises", sets: 3, reps: 12 },
            { name: "Tricep Pushdowns", sets: 3, reps: 15 }
        ]
    },
    pull: {
        name: "Pull Day",
        muscles: "Back, Biceps, Forearms",
        kcal: 280,
        duration: 40,
        exercises: [
            { name: "Pull-ups", sets: 4, reps: 10 },
            { name: "Deadlifts", sets: 3, reps: 8 },
            { name: "Bicep Curls", sets: 3, reps: 12 },
            { name: "Dumbbell Shrugs", sets: 3, reps: 15 }
        ]
    },
    legs: {
        name: "Leg Day",
        muscles: "Quads, Hamstrings, Glutes, Calves",
        kcal: 380,
        duration: 50,
        exercises: [
            { name: "Squats", sets: 4, reps: 12 },
            { name: "Dumbbell Lunges", sets: 3, reps: 12 },
            { name: "Leg Curls", sets: 3, reps: 12 },
            { name: "Calf Raises", sets: 4, reps: 20 }
        ]
    }
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const RING_CIRCUMFERENCE_MEDIUM = 2 * Math.PI * 42; // ~263.89
const RING_CIRCUMFERENCE_BIG = 2 * Math.PI * 58; // ~364.42

// Helpers: Date
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatHumanReadableDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
}

// Initializer
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    
    // Default active date setup
    const today = getTodayDateString();
    selectedDate = today;
    
    const parts = today.split('-');
    calendarYear = parseInt(parts[0]);
    calendarMonth = parseInt(parts[1]) - 1;

    // Listeners
    initBottomNav();
    initThemeSkinToggler();
    initFoodTrackerListeners();
    initCalendarWidget();
    initProgressLoggerListeners();
    initProfileListeners();
    initWorkoutPanelListeners();
    initModalListeners();
    initAuthForms();
    initFirebaseSync();

    // Render Initial UI
    applyThemeSkin();
    updateHomeDashboard();
    updateNutritionTab();
    updateProgressTab();
    updateProfileTab();

    initLucideIcons();
});

// Load state from localStorage
function loadStateFromStorage() {
    const savedState = localStorage.getItem("shasthya_state_v4");
    if (savedState) {
        try {
            state = JSON.parse(savedState);
        } catch (e) {
            console.error("Failed to parse local storage state", e);
        }
    } else {
        // Fallback check v2/v3
        const oldState = localStorage.getItem("shasthya_state_v2");
        if (oldState) {
            try {
                const old = JSON.parse(oldState);
                if (old.userProfile) state.userProfile = old.userProfile;
                if (old.weightPlanner) state.weightPlanner = old.weightPlanner;
                if (old.progressHistory) state.progressHistory = old.progressHistory;
                if (old.streak) state.streak = old.streak;
                if (old.dailyLogs) {
                    for (let date in old.dailyLogs) {
                        state.dailyLogs[date] = {
                            breakfast: old.dailyLogs[date].breakfast || [],
                            lunch: old.dailyLogs[date].lunch || [],
                            dinner: old.dailyLogs[date].dinner || [],
                            snacks: old.dailyLogs[date].snacks || [],
                            workouts: old.dailyLogs[date].workouts || []
                        };
                    }
                }
            } catch (err) {
                console.error("Error migrating old state", err);
            }
        }
    }
}

function saveState() {
    localStorage.setItem("shasthya_state_v4", JSON.stringify(state));
    scheduleCloudPush();
}

// -------------------------------------------------------------
// FIREBASE AUTH + CROSS-DEVICE CLOUD SYNC
// -------------------------------------------------------------
let currentUser = null;
let cloudSyncTimer = null;
let isPullingCloudState = false;

function initFirebaseSync() {
    const tryAttach = () => {
        if (!window.fb) return false;
        window.fb.onAuthStateChanged(window.fb.auth, handleAuthStateChanged);
        return true;
    };
    if (tryAttach()) return;

    window.addEventListener("firebase-ready", tryAttach, { once: true });

    // If Firebase never loads (offline, blocked script, etc.), don't leave the
    // Account & Sync card stuck on a blank state forever.
    setTimeout(() => {
        if (!window.fb) {
            renderAuthUI({ offline: true });
        }
    }, 5000);
}

async function handleAuthStateChanged(user) {
    currentUser = user;
    renderAuthUI({ user });

    if (user) {
        await pullCloudState(user.uid);
    }
}

async function pullCloudState(uid) {
    isPullingCloudState = true;
    try {
        const ref = window.fb.doc(window.fb.db, "users", uid);
        const snap = await window.fb.getDoc(ref);

        if (snap.exists() && snap.data() && snap.data().state) {
            state = snap.data().state;
            localStorage.setItem("shasthya_state_v4", JSON.stringify(state));
            setSyncStatusText("Synced from cloud");
        } else {
            // First time this account has synced — upload what's on this device.
            await window.fb.setDoc(ref, { state, updatedAt: Date.now() });
            setSyncStatusText("Synced");
        }
    } catch (err) {
        console.error("Cloud sync (pull) failed:", err);
        setSyncStatusText("Sync failed — check your connection");
    } finally {
        isPullingCloudState = false;
        refreshEntireUI();
    }
}

function scheduleCloudPush() {
    if (!currentUser || !window.fb || isPullingCloudState) return;
    clearTimeout(cloudSyncTimer);
    setSyncStatusText("Syncing...");
    cloudSyncTimer = setTimeout(async () => {
        try {
            const ref = window.fb.doc(window.fb.db, "users", currentUser.uid);
            await window.fb.setDoc(ref, { state, updatedAt: Date.now() });
            setSyncStatusText("Synced just now");
        } catch (err) {
            console.error("Cloud sync (push) failed:", err);
            setSyncStatusText("Sync failed — will retry on next change");
        }
    }, 900);
}

function refreshEntireUI() {
    applyThemeSkin();
    updateHomeDashboard();
    updateNutritionTab();
    renderCalendar();
    updateProgressTab();
    updateProfileTab();
    initLucideIcons();
}

function setSyncStatusText(text) {
    const el = document.getElementById("auth-sync-status");
    if (el) el.textContent = text;
}

function renderAuthUI({ user, offline } = {}) {
    const offlineNote = document.getElementById("auth-offline-note");
    const signedOutView = document.getElementById("auth-signed-out-view");
    const signedInView = document.getElementById("auth-signed-in-view");
    if (!offlineNote || !signedOutView || !signedInView) return;

    if (offline) {
        offlineNote.style.display = "flex";
        signedOutView.style.display = "none";
        signedInView.style.display = "none";
        return;
    }
    offlineNote.style.display = "none";

    if (user) {
        signedOutView.style.display = "none";
        signedInView.style.display = "flex";
        document.getElementById("auth-user-email").textContent = user.email || "Signed in";
    } else {
        signedOutView.style.display = "flex";
        signedInView.style.display = "none";
    }
}

function mapAuthError(err) {
    const code = (err && err.code) ? err.code : "";
    if (code.includes("email-already-in-use")) return "This email is already registered — try Sign In instead.";
    if (code.includes("invalid-email")) return "That email address looks invalid.";
    if (code.includes("weak-password")) return "Password should be at least 6 characters.";
    if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) return "Incorrect email or password.";
    if (code.includes("network-request-failed")) return "Network error — check your internet connection.";
    return "Something went wrong. Please try again.";
}

function initAuthForms() {
    const emailInput = document.getElementById("auth-email");
    const passInput = document.getElementById("auth-password");
    const errorEl = document.getElementById("auth-error");
    const signInBtn = document.getElementById("btn-auth-signin");
    const signUpBtn = document.getElementById("btn-auth-signup");
    const signOutBtn = document.getElementById("btn-auth-signout");
    if (!signInBtn || !signUpBtn || !signOutBtn) return;

    const showError = (msg) => {
        errorEl.textContent = msg;
        errorEl.style.display = "block";
    };
    const clearError = () => {
        errorEl.style.display = "none";
        errorEl.textContent = "";
    };

    signInBtn.addEventListener("click", async () => {
        clearError();
        if (!window.fb) return showError("Cloud sync is unavailable right now (offline?). Try again shortly.");
        const email = emailInput.value.trim();
        const pass = passInput.value;
        if (!email || !pass) return showError("Email and password are required.");

        signInBtn.disabled = true;
        try {
            await window.fb.signInWithEmailAndPassword(window.fb.auth, email, pass);
            passInput.value = "";
        } catch (err) {
            showError(mapAuthError(err));
        } finally {
            signInBtn.disabled = false;
        }
    });

    signUpBtn.addEventListener("click", async () => {
        clearError();
        if (!window.fb) return showError("Cloud sync is unavailable right now (offline?). Try again shortly.");
        const email = emailInput.value.trim();
        const pass = passInput.value;
        if (!email || !pass) return showError("Email and password are required.");
        if (pass.length < 6) return showError("Password should be at least 6 characters.");

        signUpBtn.disabled = true;
        try {
            await window.fb.createUserWithEmailAndPassword(window.fb.auth, email, pass);
            passInput.value = "";
        } catch (err) {
            showError(mapAuthError(err));
        } finally {
            signUpBtn.disabled = false;
        }
    });

    signOutBtn.addEventListener("click", async () => {
        if (window.fb) {
            await window.fb.signOut(window.fb.auth);
        }
    });
}

function initLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function animateCountUp(endValue, duration, onUpdate) {
    const startTime = performance.now();
    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.round(endValue * eased);
        onUpdate(current);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// -------------------------------------------------------------
// TAB ROUING & PREMIUM SKIN OVERLAY CONTROL
// -------------------------------------------------------------
function initBottomNav() {
    const tabBtns = document.querySelectorAll(".app-nav .nav-tab-btn");
    const panels = document.querySelectorAll(".app-tab-panel");
    const shortcutTriggers = document.querySelectorAll(".tab-trigger");

    const switchTab = (targetId) => {
        tabBtns.forEach(btn => btn.classList.remove("active"));
        panels.forEach(pan => {
            pan.classList.remove("active");
            pan.style.display = "none";
        });

        // Highlight Tab button
        const activeBtn = document.querySelector(`.app-nav .nav-tab-btn[data-target="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add("active");

        // Display panel
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.classList.add("active");
            targetPanel.style.display = "flex";

            // Module specific updates
            if (targetId === "tab-home") {
                updateHomeDashboard();
            } else if (targetId === "tab-nutrition") {
                updateNutritionTab();
            } else if (targetId === "tab-progress") {
                renderCalendar();
                updateProgressTab();
                setTimeout(updateChartsData, 50);
            } else if (targetId === "tab-profile") {
                updateProfileTab();
            }
        }

        initLucideIcons();
    };

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            switchTab(btn.dataset.target);
        });
    });

    shortcutTriggers.forEach(btn => {
        btn.addEventListener("click", () => {
            switchTab(btn.dataset.target);
        });
    });
}

function initThemeSkinToggler() {
    const btn = document.getElementById("btn-theme-skin");
    btn.addEventListener("click", () => {
        state.settings.skinTheme = state.settings.skinTheme === "classic" ? "demon" : "classic";
        saveState();
        applyThemeSkin();
    });
}

function applyThemeSkin() {
    const container = document.getElementById("app-theme-container");
    const btn = document.getElementById("btn-theme-skin");
    
    if (state.settings.skinTheme === "demon") {
        container.classList.add("demon-mode");
        btn.innerHTML = `<i data-lucide="shield-check" style="color: var(--primary);"></i>`;
        btn.title = "Switch to Classic Mode";
    } else {
        container.classList.remove("demon-mode");
        btn.innerHTML = `<i data-lucide="shield-alert" style="color: var(--text-secondary);"></i>`;
        btn.title = "Switch to Baki Demon Mode";
    }
    
    initLucideIcons();
    updateHomeDashboard();
    updateNutritionTab();
    updateProgressTab();
}

// -------------------------------------------------------------
// TAB 1: HOME PANEL DATA LOADING
// -------------------------------------------------------------
function updateHomeDashboard() {
    document.getElementById("home-date-display").textContent = formatHumanReadableDate(selectedDate);

    let consumed = 0;
    let burned = 0;
    let activeDuration = 0;
    let target = state.weightPlanner.calorieBudget || 2100;

    const log = state.dailyLogs[selectedDate];
    if (log) {
        consumed = sumItemCalories(log);
        burned = sumWorkoutsKcal(log);
        activeDuration = sumWorkoutsDuration(log);
    }

    // Weekly progress workouts target matching
    // Let's assume target is 4 workouts per week (Mon-Sun)
    // Count workouts logged for the current week
    const currentWeekCount = getWorkoutsLoggedThisWeek();
    const weekTarget = 8;
    const progressPct = Math.round((currentWeekCount / weekTarget) * 100);

    // Progress bar updates
    const progressRing = document.getElementById("weekly-progress-bar");
    progressRing.style.strokeDasharray = `${RING_CIRCUMFERENCE_MEDIUM} ${RING_CIRCUMFERENCE_MEDIUM}`;
    const progressOffset = RING_CIRCUMFERENCE_MEDIUM - (Math.min(100, progressPct) / 100 * RING_CIRCUMFERENCE_MEDIUM);
    progressRing.style.strokeDashoffset = progressOffset;

    document.getElementById("weekly-progress-pct").textContent = `${progressPct}%`;
    document.getElementById("weekly-progress-ratio").textContent = `${currentWeekCount}/${weekTarget}`;
    animateCountUp(progressPct, 800, (v) => {
        document.getElementById("weekly-progress-pct").textContent = `${v}%`;
    });

    animateCountUp(burned, 800, (v) => {
        document.getElementById("home-calories-burned").textContent = `${v} / ${target} kcal`;
    });
    document.getElementById("home-active-time").textContent = formatActiveTimeText(activeDuration);

    // Sync today's active workout routine
    // Switch between routines depending on date day index
    const dateObj = new Date(selectedDate);
    const day = dateObj.getDay(); // 0-6 (Sun-Sat)
    let routineKey = "push";
    if (day === 1 || day === 4) routineKey = "pull"; // Mon/Thu
    if (day === 2 || day === 5) routineKey = "legs"; // Tue/Fri
    if (day === 6) routineKey = "push"; // Sat
    if (day === 0) routineKey = "pull"; // Sun

    const routine = routineDatabase[routineKey];
    document.getElementById("home-workout-title").textContent = routine.name;
    document.getElementById("home-workout-desc").textContent = routine.muscles;
    document.getElementById("home-workout-ex-count").textContent = routine.exercises.length;
    document.getElementById("home-workout-duration").textContent = routine.duration;

    // Start workout button setup
    const startBtn = document.getElementById("btn-home-start-workout");
    startBtn.onclick = () => {
        openRoutineModal(routineKey);
    };
}

function sumItemCalories(dayLog) {
    if (!dayLog) return 0;
    const sum = (arr) => (arr || []).reduce((acc, curr) => acc + curr.kcal, 0);
    return sum(dayLog.breakfast) + sum(dayLog.lunch) + sum(dayLog.dinner) + sum(dayLog.snacks);
}

function sumWorkoutsKcal(dayLog) {
    if (!dayLog || !dayLog.workouts) return 0;
    return dayLog.workouts.reduce((acc, curr) => acc + curr.kcal, 0);
}

function sumWorkoutsDuration(dayLog) {
    if (!dayLog || !dayLog.workouts) return 0;
    return dayLog.workouts.reduce((acc, curr) => acc + curr.duration, 0);
}

function formatActiveTimeText(mins) {
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
}

function getWorkoutsLoggedThisWeek() {
    let count = 0;
    const dateObj = new Date(selectedDate);
    
    // Find Monday of the current week
    const currentDay = dateObj.getDay();
    const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayObj = new Date(dateObj);
    mondayObj.setDate(dateObj.getDate() + distanceToMon);

    for (let i = 0; i < 7; i++) {
        const loopDate = new Date(mondayObj);
        loopDate.setDate(mondayObj.getDate() + i);
        const loopDateStr = loopDate.toISOString().split('T')[0];
        
        const log = state.dailyLogs[loopDateStr];
        if (log && log.workouts && log.workouts.length > 0) {
            count += log.workouts.length;
        }
    }
    return count;
}

// -------------------------------------------------------------
// TAB 2: WORKOUTS & EXERCISES LOGIC
// -------------------------------------------------------------
function initWorkoutPanelListeners() {
    const tabs = document.querySelectorAll(".panel-toggle-tabs .toggle-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const targetPanel = tab.dataset.panel;
            document.getElementById("panel-routines").style.display = "none";
            document.getElementById("panel-library").style.display = "none";
            document.getElementById(targetPanel).style.display = "block";

            if (targetPanel === "panel-library") {
                renderExerciseLibrary();
            }
        });
    });

    // Routine view button handlers
    const routineButtons = document.querySelectorAll(".btn-view-routine");
    routineButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const routineKey = btn.dataset.routine;
            openRoutineModal(routineKey);
        });
    });

    // Search bar event
    const searchInput = document.getElementById("library-search-input");
    searchInput.addEventListener("input", renderExerciseLibrary);

    // Category pills events
    const catPills = document.querySelectorAll(".library-categories-scroll .cat-pill");
    catPills.forEach(pill => {
        pill.addEventListener("click", () => {
            catPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            renderExerciseLibrary();
        });
    });
}

function renderExerciseLibrary() {
    const listContainer = document.getElementById("library-exercise-list");
    listContainer.innerHTML = "";

    const query = document.getElementById("library-search-input").value.trim().toLowerCase();
    const activeCat = document.querySelector(".library-categories-scroll .cat-pill.active").dataset.category;

    const filtered = exerciseLibrary.filter(ex => {
        const matchesQuery = ex.name.toLowerCase().includes(query) || ex.muscle.toLowerCase().includes(query);
        const matchesCategory = activeCat === "all" || ex.category === activeCat;
        return matchesQuery && matchesCategory;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="empty-list-placeholder">No exercises match search criteria.</div>`;
        return;
    }

    filtered.forEach(ex => {
        const div = document.createElement("div");
        div.className = "library-ex-item";
        div.innerHTML = `
            <div class="ex-info-block">
                <span class="ex-name">${ex.name}</span>
                <span class="ex-muscle">${ex.muscle}</span>
            </div>
            <div class="ex-action-area">
                <span class="ex-met-badge">${ex.met} MET</span>
                <i data-lucide="chevron-right"></i>
            </div>
        `;
        
        div.addEventListener("click", () => {
            openExerciseModal(ex);
        });

        listContainer.appendChild(div);
    });

    initLucideIcons();
}

// -------------------------------------------------------------
// WORKOUT MODALS (LOGGERS)
// -------------------------------------------------------------
function initModalListeners() {
    // Close exercise modal
    document.getElementById("btn-close-modal").addEventListener("click", () => {
        document.getElementById("exercise-details-modal").style.display = "none";
    });

    // Close routine modal
    document.getElementById("btn-close-routine-modal").addEventListener("click", () => {
        document.getElementById("routine-preview-modal").style.display = "none";
    });

    // Modal burn calculation triggers
    const durInput = document.getElementById("modal-input-duration");
    const weightInput = document.getElementById("modal-input-weight");

    const triggerRecalculateBurn = () => {
        if (!activeExerciseDetails) return;
        const dur = parseInt(durInput.value) || 0;
        const weight = parseFloat(weightInput.value) || 78;
        const met = activeExerciseDetails.met;
        // MET Formula: Kcal = MET * 3.5 * weight / 200 * duration_mins
        const burn = Math.round((met * 3.5 * weight / 200) * dur);
        const resultEl = document.getElementById("modal-burn-result");
        resultEl.textContent = `${burn} kcal`;
        resultEl.classList.remove("stat-pop");
        void resultEl.offsetWidth; // force reflow so the animation can retrigger
        resultEl.classList.add("stat-pop");
    };

    durInput.addEventListener("input", triggerRecalculateBurn);
    weightInput.addEventListener("input", triggerRecalculateBurn);

    // Log exercise to active date
    document.getElementById("btn-modal-log-workout").addEventListener("click", () => {
        if (!activeExerciseDetails) return;
        const duration = parseInt(durInput.value) || 30;
        const weight = parseFloat(weightInput.value) || 78;
        const met = activeExerciseDetails.met;
        const kcal = Math.round((met * 3.5 * weight / 200) * duration);

        ensureDayLogsExist(selectedDate);
        state.dailyLogs[selectedDate].workouts.push({
            id: Date.now().toString(),
            name: activeExerciseDetails.name,
            kcal,
            duration,
            type: activeExerciseDetails.type
        });

        handleStreakIncrement(selectedDate);
        saveState();
        document.getElementById("exercise-details-modal").style.display = "none";
        
        updateHomeDashboard();
        updateNutritionTab();
    });

    // Log routine to active date
    document.getElementById("btn-modal-log-entire-routine").addEventListener("click", () => {
        if (!activeRoutineDetails) return;
        const routine = routineDatabase[activeRoutineDetails];

        ensureDayLogsExist(selectedDate);
        
        // Log the entire workout routine at once
        state.dailyLogs[selectedDate].workouts.push({
            id: Date.now().toString(),
            name: routine.name,
            kcal: routine.kcal,
            duration: routine.duration,
            type: "Gym Routine"
        });

        handleStreakIncrement(selectedDate);
        saveState();
        document.getElementById("routine-preview-modal").style.display = "none";

        updateHomeDashboard();
        updateNutritionTab();
    });
}

function openExerciseModal(ex) {
    activeExerciseDetails = ex;
    
    document.getElementById("modal-ex-type").textContent = `${ex.type} Workout`;
    document.getElementById("modal-ex-name").textContent = ex.name;
    document.getElementById("modal-ex-muscle-label").textContent = `Targets: ${ex.muscle}`;
    document.getElementById("modal-ex-instructions").textContent = ex.instruction;
    document.getElementById("modal-ex-met").textContent = `${ex.met} METs`;
    
    // Target muscle image (embedded base64, no external file/folder dependency)
    const imgEl = document.getElementById("modal-muscle-img");
    const embeddedSrc = (typeof MUSCLE_IMAGES !== "undefined") ? MUSCLE_IMAGES[ex.img] : null;
    if (embeddedSrc) {
        imgEl.src = embeddedSrc;
        imgEl.style.display = "";
    } else {
        // No dependency on any external network resource; just hide gracefully.
        imgEl.removeAttribute("src");
        imgEl.style.display = "none";
    }

    // Fill defaults
    document.getElementById("modal-input-duration").value = 30;
    document.getElementById("modal-input-weight").value = state.userProfile ? state.userProfile.weight : 78;

    // Calculate initial burn
    const duration = 30;
    const weight = state.userProfile ? state.userProfile.weight : 78;
    const burn = Math.round((ex.met * 3.5 * weight / 200) * duration);
    document.getElementById("modal-burn-result").textContent = `${burn} kcal`;

    document.getElementById("exercise-details-modal").style.display = "flex";
    initLucideIcons();
}

function openRoutineModal(routineKey) {
    activeRoutineDetails = routineKey;
    const routine = routineDatabase[routineKey];

    document.getElementById("routine-modal-title").textContent = routine.name;
    document.getElementById("routine-modal-muscle-label").textContent = routine.muscles;

    const list = document.getElementById("routine-modal-ex-list");
    list.innerHTML = "";

    routine.exercises.forEach(ex => {
        const div = document.createElement("div");
        div.className = "routine-ex-item-preview";
        div.innerHTML = `
            <span>${ex.name}</span>
            <strong>${ex.sets} Sets x ${ex.reps} Reps</strong>
        `;
        list.appendChild(div);
    });

    document.getElementById("btn-modal-log-entire-routine").textContent = `Log Completed Routine (${routine.kcal} kcal)`;
    document.getElementById("routine-preview-modal").style.display = "flex";
    initLucideIcons();
}

// -------------------------------------------------------------
// TAB 3: NUTRITION & CALORIE LOGS TRACKER
// -------------------------------------------------------------
function initFoodTrackerListeners() {
    const mealTabs = document.querySelectorAll(".food-tabs .meal-tab");
    mealTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            mealTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeMealSlot = tab.dataset.mealSlot;

            document.getElementById("nutr-meal-slot-label").textContent = tab.textContent;
            renderLoggedFoods();
        });
    });

    // Quick food buttons log
    const buttons = document.querySelectorAll(".quick-food-grid-v3 .food-btn-item");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const kcal = parseInt(btn.dataset.kcal);
            const carb = parseFloat(btn.dataset.carb) || 0;
            const prot = parseFloat(btn.dataset.prot) || 0;
            const fat = parseFloat(btn.dataset.fat) || 0;

            addFoodItem(name, kcal, carb, prot, fat);
        });
    });

    // Custom food add
    const addCustomBtn = document.getElementById("btn-add-custom-food");
    addCustomBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("food-custom-name");
        const kcalInput = document.getElementById("food-custom-cal");

        const name = nameInput.value.trim();
        const kcal = parseInt(kcalInput.value);

        if (!name || isNaN(kcal) || kcal <= 0) {
            alert("Please input a valid food name and positive calorie count.");
            return;
        }

        // Estimate macronutrients for custom input roughly (40% carb, 30% protein, 30% fat)
        const carb = Math.round((kcal * 0.4) / 4);
        const prot = Math.round((kcal * 0.3) / 4);
        const fat = Math.round((kcal * 0.3) / 9);

        addFoodItem(name, kcal, carb, prot, fat);
        
        nameInput.value = "";
        kcalInput.value = "";
    });
}

function addFoodItem(name, kcal, carb, prot, fat) {
    ensureDayLogsExist(selectedDate);
    state.dailyLogs[selectedDate][activeMealSlot].push({
        id: Date.now().toString(),
        name,
        kcal,
        carb,
        prot,
        fat
    });

    handleStreakIncrement(selectedDate);
    saveState();
    updateNutritionTab();
    updateHomeDashboard();
}

function deleteFoodItem(id) {
    if (state.dailyLogs[selectedDate] && state.dailyLogs[selectedDate][activeMealSlot]) {
        state.dailyLogs[selectedDate][activeMealSlot] = state.dailyLogs[selectedDate][activeMealSlot].filter(f => f.id !== id);
        saveState();
        updateNutritionTab();
        updateHomeDashboard();
    }
}

function renderLoggedFoods() {
    const list = document.getElementById("logged-foods-list-container");
    list.innerHTML = "";

    const log = state.dailyLogs[selectedDate];
    if (!log || !log[activeMealSlot] || log[activeMealSlot].length === 0) {
        list.innerHTML = `<li class="empty-list-placeholder">No food logged for this meal.</li>`;
        return;
    }

    log[activeMealSlot].forEach(item => {
        const li = document.createElement("li");
        li.className = "logged-food-item-row";
        li.innerHTML = `
            <span>${item.name}</span>
            <div class="val-block">
                <span class="kcal">+${item.kcal} kcal</span>
                <button class="btn-delete" data-id="${item.id}"><i data-lucide="trash-2" style="width: 0.95rem; height: 0.95rem;"></i></button>
            </div>
        `;

        li.querySelector(".btn-delete").addEventListener("click", () => {
            deleteFoodItem(item.id);
        });

        list.appendChild(li);
    });

    initLucideIcons();
}

function updateNutritionTab() {
    let target = state.weightPlanner.calorieBudget || 2100;
    let consumed = 0;
    let burned = 0;
    
    let carbs = 0;
    let protein = 0;
    let fat = 0;

    const log = state.dailyLogs[selectedDate];
    if (log) {
        consumed = sumItemCalories(log);
        burned = sumWorkoutsKcal(log);
        
        // Sum macros
        const sumMacro = (slot, key) => (log[slot] || []).reduce((acc, curr) => acc + (curr[key] || 0), 0);
        const slots = ["breakfast", "lunch", "dinner", "snacks"];
        slots.forEach(slot => {
            carbs += sumMacro(slot, "carb");
            protein += sumMacro(slot, "prot");
            fat += sumMacro(slot, "fat");
        });
    }

    const netCal = consumed - burned;
    const remaining = target - netCal;

    // Remaining calculations output
    const remainingSpan = document.getElementById("nutr-remaining-val");
    remainingSpan.textContent = Math.abs(remaining);

    const labelSpan = document.querySelector(".nutrition-summary-card .ring-label");
    const subtextSpan = document.querySelector(".nutrition-summary-card .ring-subtext");
    const ring = document.getElementById("nutr-progress-bar");

    ring.style.strokeDasharray = `${RING_CIRCUMFERENCE_BIG} ${RING_CIRCUMFERENCE_BIG}`;

    if (remaining >= 0) {
        labelSpan.textContent = "Remaining";
        labelSpan.style.color = "var(--text-secondary)";
        subtextSpan.textContent = "kcal";
        remainingSpan.style.color = "var(--text-primary)";
        ring.setAttribute("stroke", "var(--primary)");

        const percentage = netCal > 0 ? netCal / target : 0;
        const offset = RING_CIRCUMFERENCE_BIG - (Math.min(1, percentage) * RING_CIRCUMFERENCE_BIG);
        ring.style.strokeDashoffset = offset;
    } else {
        labelSpan.textContent = "Over limit";
        labelSpan.style.color = "var(--danger)";
        subtextSpan.textContent = "kcal over";
        remainingSpan.style.color = "var(--danger)";
        ring.setAttribute("stroke", "var(--danger)");
        
        ring.style.strokeDashoffset = 0;
    }

    // Macro progress sliders
    const targetCarb = 250;
    const targetProt = 160;
    const targetFat = 80;

    const carbPct = Math.round(Math.min(100, (carbs / targetCarb) * 100));
    const protPct = Math.round(Math.min(100, (protein / targetProt) * 100));
    const fatPct = Math.round(Math.min(100, (fat / targetFat) * 100));

    document.getElementById("macro-carb-bar").style.width = `${carbPct}%`;
    document.getElementById("macro-prot-bar").style.width = `${protPct}%`;
    document.getElementById("macro-fat-bar").style.width = `${fatPct}%`;

    document.getElementById("macro-carb-val").textContent = `${Math.round(carbs)}g / ${targetCarb}g`;
    document.getElementById("macro-prot-val").textContent = `${Math.round(protein)}g / ${targetProt}g`;
    document.getElementById("macro-fat-val").textContent = `${Math.round(fat)}g / ${targetFat}g`;

    renderLoggedFoods();
}

// -------------------------------------------------------------
// TAB 4: PROGRESS & CALENDAR SCENE
// -------------------------------------------------------------
function initCalendarWidget() {
    document.getElementById("btn-prev-month").onclick = () => {
        calendarMonth--;
        if (calendarMonth < 0) {
            calendarMonth = 11;
            calendarYear--;
        }
        renderCalendar();
    };

    document.getElementById("btn-next-month").onclick = () => {
        calendarMonth++;
        if (calendarMonth > 11) {
            calendarMonth = 0;
            calendarYear++;
        }
        renderCalendar();
    };
}

function renderCalendar() {
    const monthYear = document.getElementById("calendar-month-year");
    const container = document.getElementById("calendar-days-container");

    monthYear.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;
    container.innerHTML = "";

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Injected padding
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement("div");
        container.appendChild(div);
    }

    // Days grid
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
        const dayStr = String(dayNum).padStart(2, '0');
        const monthStr = String(calendarMonth + 1).padStart(2, '0');
        const loopDateStr = `${calendarYear}-${monthStr}-${dayStr}`;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-day-button";
        btn.textContent = dayNum;

        if (loopDateStr === selectedDate) {
            btn.classList.add("active");
        }

        const log = state.dailyLogs[loopDateStr];
        if (log) {
            const consumed = sumItemCalories(log);
            const burned = sumWorkoutsKcal(log);
            const net = consumed - burned;
            const target = state.weightPlanner.calorieBudget || 2100;

            if (consumed > 0 || burned > 0) {
                if (net <= target) {
                    btn.classList.add("has-data");
                } else {
                    btn.classList.add("has-data-over");
                }
            }
        }

        btn.addEventListener("click", () => {
            selectedDate = loopDateStr;
            renderCalendar();
            
            updateHomeDashboard();
            updateNutritionTab();
            updateProgressTab();
        });

        container.appendChild(btn);
    }
}

function initProgressLoggerListeners() {
    const form = document.getElementById("progress-log-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const weight = parseFloat(document.getElementById("prog-weight").value);
        const bf = parseFloat(document.getElementById("prog-bf").value);
        const waist = parseFloat(document.getElementById("prog-waist").value);

        if (isNaN(weight) || weight <= 0) {
            alert("Weight is required to save progress.");
            return;
        }

        const nextWeekIndex = state.progressHistory.length + 1;
        state.progressHistory.push({
            date: `Week ${nextWeekIndex}`,
            weight,
            bf: isNaN(bf) ? 0 : bf,
            waist: isNaN(waist) ? 0 : waist
        });

        // Sync weight to active profile
        if (state.userProfile) {
            state.userProfile.weight = weight;
            if (!isNaN(bf)) state.userProfile.bf = bf;
            if (!isNaN(waist)) state.userProfile.waist = waist;
            
            const recalculated = calculateBodyMetrics(
                state.userProfile.age,
                state.userProfile.sex,
                state.userProfile.height,
                weight,
                state.userProfile.waist,
                state.userProfile.neck,
                state.userProfile.hip,
                state.userProfile.activity
            );
            state.userProfile = { ...state.userProfile, ...recalculated };
        }

        saveState();
        form.reset();

        updateProgressTab();
        updateProfileTab();
        updateHomeDashboard();
        updateChartsData();
    });

    // Chart toggle event
    const selector = document.getElementById("chart-type-selector");
    selector.addEventListener("change", updateChartsData);
}

function updateProgressTab() {
    renderDailyHistory();

    const tbody = document.getElementById("progress-history-tbody");
    tbody.innerHTML = "";

    if (state.progressHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No logs saved.</td></tr>`;
        return;
    }

    [...state.progressHistory].reverse().forEach((log, index) => {
        const realIdx = state.progressHistory.length - 1 - index;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${log.date}</strong></td>
            <td>${log.weight.toFixed(1)} kg</td>
            <td>${log.bf > 0 ? log.bf.toFixed(1) + '%' : '--'}</td>
            <td>${log.waist > 0 ? log.waist.toFixed(1) + ' cm' : '--'}</td>
            <td style="text-align: right;">
                <button type="button" class="btn-delete" style="background:transparent;border:none;color:var(--text-muted);cursor:pointer;" onclick="deleteProgressEntry(${realIdx})">
                    <i data-lucide="trash" style="width: 0.9rem; height: 0.9rem;"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    initLucideIcons();
}

function renderDailyHistory() {
    const container = document.getElementById("daily-history-list");
    const countLabel = document.getElementById("daily-history-count");
    if (!container) return;

    const dates = Object.keys(state.dailyLogs).sort((a, b) => b.localeCompare(a));
    countLabel.textContent = `${dates.length} day${dates.length === 1 ? '' : 's'} logged`;

    if (dates.length === 0) {
        container.innerHTML = `<div class="dh-empty">No daily logs yet. Log food or a workout to see history here.</div>`;
        return;
    }

    const target = state.weightPlanner.calorieBudget || 2100;

    container.innerHTML = dates.map(dateStr => {
        const log = state.dailyLogs[dateStr];
        const consumed = sumItemCalories(log);
        const burned = sumWorkoutsKcal(log);
        const net = consumed - burned;

        if (consumed === 0 && burned === 0) return ""; // Skip empty scaffolded days

        const foodItems = [...(log.breakfast || []), ...(log.lunch || []), ...(log.dinner || []), ...(log.snacks || [])];
        const foodNames = foodItems.map(f => f.name).join(", ") || "No food logged";
        const workoutNames = (log.workouts || []).map(w => w.name).join(", ") || "No workout logged";

        const netIsOver = net > target;
        const netBadgeClass = netIsOver ? "dh-net-over" : "dh-net-good";
        const netSign = net >= 0 ? "+" : "";

        return `
            <div class="dh-item">
                <div class="dh-header">
                    <span class="dh-date">${formatHumanReadableDate(dateStr)}</span>
                    <span class="dh-net-badge ${netBadgeClass}">Net: ${netSign}${net} kcal</span>
                </div>
                <div class="dh-stats-row">
                    <div class="dh-stat-block">
                        <div class="dh-stat-label"><i data-lucide="utensils"></i> Food Intake</div>
                        <div class="dh-stat-value">${consumed} kcal</div>
                        <div class="dh-items-text">${foodNames}</div>
                    </div>
                    <div class="dh-stat-block">
                        <div class="dh-stat-label"><i data-lucide="flame"></i> Burned (Gym)</div>
                        <div class="dh-stat-value">${burned} kcal</div>
                        <div class="dh-items-text">${workoutNames}</div>
                    </div>
                </div>
            </div>
        `;
    }).join("") || `<div class="dh-empty">No daily logs yet. Log food or a workout to see history here.</div>`;

    initLucideIcons();
}

function deleteProgressEntry(index) {
    if (confirm("Are you sure you want to delete this weekly entry?")) {
        state.progressHistory.splice(index, 1);
        saveState();
        updateProgressTab();
        updateChartsData();
        updateHomeDashboard();
    }
}

// -------------------------------------------------------------
// TAB 5: PROFILE & BODY CALCULATORS
// -------------------------------------------------------------
function initProfileListeners() {
    const sexSelect = document.getElementById("sex");
    const hipGroup = document.getElementById("hip-group");
    const hipInput = document.getElementById("hip");
    const form = document.getElementById("body-analysis-form");
    const resetBtn = document.getElementById("reset-metrics-btn");

    sexSelect.addEventListener("change", () => {
        if (sexSelect.value === "female") {
            hipGroup.style.display = "flex";
            hipInput.setAttribute("required", "true");
        } else {
            hipGroup.style.display = "none";
            hipInput.removeAttribute("required");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const age = parseInt(document.getElementById("age").value);
        const sex = sexSelect.value;
        const height = parseFloat(document.getElementById("height").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const waist = parseFloat(document.getElementById("waist").value);
        const neck = parseFloat(document.getElementById("neck").value);
        const hip = sex === "female" ? parseFloat(hipInput.value) : 0;
        const activity = document.getElementById("activity").value;

        const metrics = calculateBodyMetrics(age, sex, height, weight, waist, neck, hip, activity);
        
        state.userProfile = {
            age, sex, height, weight, waist, neck, hip, activity, ...metrics
        };

        if (state.progressHistory.length === 3 && state.progressHistory[0].date === "Week 1" && state.progressHistory[0].weight === 78) {
            state.progressHistory = [
                { date: "Start", weight, bf: metrics.bf, waist }
            ];
        }

        saveState();
        updateProfileTab();
        updateNutritionTab();
        updateHomeDashboard();
        updateProgressTab();
        updateChartsData();
    });

    resetBtn.addEventListener("click", () => {
        form.reset();
        hipGroup.style.display = "none";
        hipInput.removeAttribute("required");
        state.userProfile = null;
        saveState();
        document.getElementById("analysis-results").style.display = "none";
    });

    // Diet Generator Button
    document.getElementById("btn-generate-diet-plan").onclick = () => {
        const targetW = parseFloat(document.getElementById("plan-target-weight").value);
        if (isNaN(targetW)) {
            alert("Please input a valid target weight.");
            return;
        }

        const cheat = document.getElementById("plan-cheat-food").value;
        state.weightPlanner.targetWeight = targetW;
        state.weightPlanner.cheatFood = cheat;

        generateDietPlan();
        saveState();
        updateNutritionTab();
        updateHomeDashboard();
    };

    // Timeline button row
    const timeBtns = document.querySelectorAll(".timeline-buttons-row .btn-option");
    timeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            timeBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const customInput = document.getElementById("plan-custom-days");
            if (btn.dataset.custom) {
                customInput.style.display = "block";
                state.weightPlanner.isCustomTimeline = true;
            } else {
                customInput.style.display = "none";
                state.weightPlanner.isCustomTimeline = false;
                state.weightPlanner.timelineMonths = parseInt(btn.dataset.months);
                state.weightPlanner.timelineDays = state.weightPlanner.timelineMonths * 30;
            }
            updatePlannerSafetyCheck();
        });
    });

    document.getElementById("plan-target-weight").addEventListener("input", updatePlannerSafetyCheck);
    document.getElementById("plan-custom-days").addEventListener("input", () => {
        if (state.weightPlanner.isCustomTimeline) {
            state.weightPlanner.timelineDays = parseInt(document.getElementById("plan-custom-days").value) || 90;
            updatePlannerSafetyCheck();
        }
    });
}

function calculateBodyMetrics(age, sex, height, weight, waist, neck, hip, activity) {
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM); // Standard BMI = kg / m^2 (WHO)

    // Body fat % — US Navy Circumference Method (Hodgdon & Beckett, 1984).
    // Requires waist + neck (+ hip for women). Validated against hydrostatic
    // weighing with a typical error margin of about ±3-4% body fat.
    let bf = 0;
    let bfValid = false;
    if (sex === "male") {
        const val = waist - neck;
        if (val > 0 && height > 0) {
            bf = 495 / (1.0324 - 0.19077 * Math.log10(val) + 0.15456 * Math.log10(height)) - 450;
            bfValid = true;
        }
    } else {
        const val = waist + hip - neck;
        if (val > 0 && height > 0) {
            bf = 495 / (1.29579 - 0.35004 * Math.log10(val) + 0.22100 * Math.log10(height)) - 450;
            bfValid = true;
        }
    }

    bf = Math.max(2, Math.min(60, bf));
    const lbm = weight * (1 - bf / 100); // Lean Body Mass = Weight - Fat Mass
    const idealMin = 18.5 * (heightM * heightM); // WHO "normal" BMI band
    const idealMax = 24.9 * (heightM * heightM);

    // BMR (Basal Metabolic Rate):
    // - If we have a real body-fat measurement, use Katch-McArdle, which is
    //   driven by lean body mass — it's more accurate for people with known
    //   body composition because it doesn't treat 1kg of muscle and 1kg of
    //   fat as burning the same calories (Katch & McArdle, 1996).
    //   BMR = 370 + 21.6 × LBM(kg)
    // - Otherwise fall back to Mifflin-St Jeor (1990), the equation the
    //   Academy of Nutrition and Dietetics currently recommends as the most
    //   accurate weight-based estimate when body composition isn't known.
    let bmr = 0;
    let bmrFormula = "";
    if (bfValid) {
        bmr = 370 + 21.6 * lbm;
        bmrFormula = "Katch-McArdle formula, using your measured lean body mass";
    } else if (sex === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        bmrFormula = "Mifflin-St Jeor formula, using total body weight (add waist & neck for a body-fat-based estimate)";
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        bmrFormula = "Mifflin-St Jeor formula, using total body weight (add waist, neck & hip for a body-fat-based estimate)";
    }

    // TDEE = BMR × activity multiplier (Harris-Benedict activity scale, in
    // standard clinical/nutrition use since the 1980s).
    const tdee = bmr * parseFloat(activity);

    return {
        bmi: Math.round(bmi * 10) / 10,
        bf: Math.round(bf * 10) / 10,
        bfValid,
        lbm: Math.round(lbm * 10) / 10,
        idealMin: Math.round(idealMin * 10) / 10,
        idealMax: Math.round(idealMax * 10) / 10,
        bmr: Math.round(bmr),
        bmrFormula,
        tdee: Math.round(tdee)
    };
}

function updatePlannerSafetyCheck() {
    const indicator = document.getElementById("plan-safety-check");
    const targetInput = document.getElementById("plan-target-weight");
    const currentW = state.userProfile ? state.userProfile.weight : 78;
    const targetW = parseFloat(targetInput.value);

    if (isNaN(targetW)) {
        indicator.innerHTML = `
            <div class="safety-status status-warn">
                <i data-lucide="info"></i>
                <span>Please enter your target weight to run safety checks.</span>
            </div>`;
        initLucideIcons();
        return;
    }

    if (targetW >= currentW) {
        indicator.innerHTML = `
            <div class="safety-status status-danger">
                <i data-lucide="alert-triangle"></i>
                <span>Target weight must be less than current weight (${currentW} kg).</span>
            </div>`;
        initLucideIcons();
        return;
    }

    const loss = currentW - targetW;
    const days = state.weightPlanner.isCustomTimeline ? (parseInt(document.getElementById("plan-custom-days").value) || 90) : (state.weightPlanner.timelineMonths * 30);
    const weeks = days / 7;
    const weeklyRate = loss / weeks;

    if (weeklyRate <= 0.75) {
        indicator.innerHTML = `
            <div class="safety-status status-safe">
                <i data-lucide="check-circle-2"></i>
                <span>✅ Safe Target Rate: <strong>${weeklyRate.toFixed(2)} kg/week</strong>. Sustained loss.</span>
            </div>`;
    } else if (weeklyRate <= 1.0) {
        indicator.innerHTML = `
            <div class="safety-status status-warn">
                <i data-lucide="alert-circle"></i>
                <span>⚠️ Moderate Rate: <strong>${weeklyRate.toFixed(2)} kg/week</strong>. Highly consistent logging needed.</span>
            </div>`;
    } else {
        const minMonths = Math.max(1, Math.ceil(loss / 4));
        const maxMonths = Math.ceil(loss / 2);
        indicator.innerHTML = `
            <div class="safety-status status-danger">
                <i data-lucide="x-circle"></i>
                <span>❌ Unsafe Rate: <strong>${weeklyRate.toFixed(2)} kg/week</strong>.<br>
                <strong>Recommended timeline:</strong> <strong>${minMonths}–${maxMonths} months</strong> for ${loss.toFixed(0)} kg.</span>
            </div>`;
    }
    initLucideIcons();
}

function generateDietPlan() {
    const currentW = state.userProfile ? state.userProfile.weight : 78;
    const targetW = state.weightPlanner.targetWeight;
    const loss = currentW - targetW;
    const days = state.weightPlanner.isCustomTimeline ? (parseInt(document.getElementById("plan-custom-days").value) || 90) : (state.weightPlanner.timelineMonths * 30);
    
    const tdee = state.userProfile ? state.userProfile.tdee : 2400;
    const sex = state.userProfile ? state.userProfile.sex : "male";

    const dailyDeficit = (loss * 7700) / days;
    let budget = tdee - dailyDeficit;
    
    const floorLimit = sex === "female" ? 1200 : 1500;
    if (budget < floorLimit) {
        budget = floorLimit;
    }

    state.weightPlanner.calorieBudget = Math.round(budget);

    // Display result box
    const resultBox = document.getElementById("diet-plan-result");
    resultBox.style.display = "block";
    document.getElementById("diet-plan-budget").textContent = state.weightPlanner.calorieBudget;
    document.getElementById("diet-plan-cheat").textContent = state.weightPlanner.cheatFood;
}

function updateProfileTab() {
    const resBox = document.getElementById("analysis-results");
    if (!state.userProfile) {
        resBox.style.display = "none";
        return;
    }

    resBox.style.display = "block";
    document.getElementById("res-bmi").textContent = state.userProfile.bmi;
    document.getElementById("res-bf").textContent = `${state.userProfile.bf}%`;
    document.getElementById("res-tdee").textContent = state.userProfile.tdee;
    document.getElementById("res-bmr").textContent = state.userProfile.bmr || "--";
    document.getElementById("res-bmr-formula-note").textContent = state.userProfile.bmrFormula || "";
    document.getElementById("res-lbm").textContent = `${state.userProfile.lbm} kg`;
    document.getElementById("res-ideal-range").textContent = `${state.userProfile.idealMin} - ${state.userProfile.idealMax} kg`;

    // Fill form inputs
    document.getElementById("age").value = state.userProfile.age;
    document.getElementById("sex").value = state.userProfile.sex;
    document.getElementById("height").value = state.userProfile.height;
    document.getElementById("weight").value = state.userProfile.weight;
    document.getElementById("waist").value = state.userProfile.waist;
    document.getElementById("neck").value = state.userProfile.neck;
    document.getElementById("activity").value = state.userProfile.activity;

    const hipInput = document.getElementById("hip");
    if (state.userProfile.sex === "female") {
        document.getElementById("hip-group").style.display = "flex";
        hipInput.value = state.userProfile.hip;
        hipInput.setAttribute("required", "true");
    } else {
        document.getElementById("hip-group").style.display = "none";
        hipInput.removeAttribute("required");
    }

    // Set badges
    const setStatusBadge = (el, val, text, cat) => {
        el.textContent = text;
        el.className = "badge";
        if (cat === "healthy") el.style.backgroundColor = "var(--success-bg)", el.style.color = "var(--success)";
        else if (cat === "warn") el.style.backgroundColor = "var(--warning-bg)", el.style.color = "var(--warning)";
        else el.style.backgroundColor = "var(--danger-bg)", el.style.color = "var(--danger)";
    };

    const bmiVal = state.userProfile.bmi;
    const bmiBadge = document.getElementById("res-bmi-status");
    if (bmiVal < 18.5) setStatusBadge(bmiBadge, bmiVal, "Underweight", "warn");
    else if (bmiVal < 25) setStatusBadge(bmiBadge, bmiVal, "Healthy", "healthy");
    else if (bmiVal < 30) setStatusBadge(bmiBadge, bmiVal, "Overweight", "warn");
    else setStatusBadge(bmiBadge, bmiVal, "Obese", "danger");

    const bfVal = state.userProfile.bf;
    const bfBadge = document.getElementById("res-bf-status");
    const sex = state.userProfile.sex;
    if (sex === "male") {
        if (bfVal < 14) setStatusBadge(bfBadge, bfVal, "Athletic", "healthy");
        else if (bfVal < 25) setStatusBadge(bfBadge, bfVal, "Average", "warn");
        else setStatusBadge(bfBadge, bfVal, "High", "danger");
    } else {
        if (bfVal < 21) setStatusBadge(bfBadge, bfVal, "Athletic", "healthy");
        else if (bfVal < 32) setStatusBadge(bfBadge, bfVal, "Average", "warn");
        else setStatusBadge(bfBadge, bfVal, "High", "danger");
    }

    // Set planner inputs
    document.getElementById("plan-target-weight").value = state.weightPlanner.targetWeight;
    document.getElementById("plan-cheat-food").value = state.weightPlanner.cheatFood;

    // Load active diet generator budget
    if (state.weightPlanner.calorieBudget) {
        generateDietPlan();
    }
}

function ensureDayLogsExist(dateStr) {
    if (!state.dailyLogs[dateStr]) {
        state.dailyLogs[dateStr] = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
            workouts: []
        };
    }
}

function handleStreakIncrement(dateStr) {
    const lastLog = state.streak.lastLogDate;
    if (lastLog === dateStr) return;

    state.streak.loggedDaysCount += 1;

    if (lastLog) {
        const last = new Date(lastLog);
        const curr = new Date(dateStr);
        const diff = Math.ceil(Math.abs(curr - last) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            state.streak.currentStreak += 1;
        } else if (diff > 1) {
            state.streak.currentStreak = 1;
        }
    } else {
        state.streak.currentStreak = 1;
    }
    state.streak.lastLogDate = dateStr;
}

// -------------------------------------------------------------
// CHART.JS IMPLEMENTATIONS
// -------------------------------------------------------------
function initCharts() {
    const ctx = document.getElementById("analyticsChart").getContext("2d");
    
    // Set standard options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: "rgba(255, 255, 255, 0.02)" }, ticks: { color: "#a1a1aa", font: { family: "Outfit" } } },
            y: { grid: { color: "rgba(255, 255, 255, 0.02)" }, ticks: { color: "#a1a1aa", font: { family: "Outfit" } } }
        }
    };

    // Grab colors dynamically based on active skin variables
    const getAccentColor = () => getComputedStyle(document.getElementById("app-theme-container")).getPropertyValue('--primary').trim() || "#84cc16";

    // Initial Weight Chart load
    const labels = state.progressHistory.map(h => h.date);
    const weightData = state.progressHistory.map(h => h.weight);

    analyticsChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                data: weightData,
                borderColor: getAccentColor(),
                backgroundColor: "rgba(132, 204, 22, 0.05)",
                fill: true,
                tension: 0.35,
                borderWidth: 3,
                pointRadius: 4
            }]
        },
        options
    });
}

function updateChartsData() {
    if (!analyticsChart) return;

    const selector = document.getElementById("chart-type-selector");
    const mode = selector.value;
    const labels = state.progressHistory.map(h => h.date);
    
    const getAccentColor = () => getComputedStyle(document.getElementById("app-theme-container")).getPropertyValue('--primary').trim() || "#84cc16";
    const getSecondaryColor = () => getComputedStyle(document.getElementById("app-theme-container")).getPropertyValue('--secondary').trim() || "#6366f1";

    let data = [];
    let type = "line";
    let datasetOptions = {
        borderColor: getAccentColor(),
        backgroundColor: "rgba(132, 204, 22, 0.05)",
        fill: true,
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 4
    };

    if (mode === "weight") {
        data = state.progressHistory.map(h => h.weight);
    } else if (mode === "bf") {
        data = state.progressHistory.map(h => h.bf > 0 ? h.bf : null);
        datasetOptions.borderColor = getSecondaryColor();
        datasetOptions.backgroundColor = "rgba(99, 102, 241, 0.05)";
    } else if (mode === "waist") {
        data = state.progressHistory.map(h => h.waist > 0 ? h.waist : null);
        datasetOptions.borderColor = "#f97316";
        datasetOptions.backgroundColor = "rgba(249, 115, 22, 0.05)";
    } else if (mode === "activity") {
        // Workout Frequency bar chart (Mon-Sun logged calories or time)
        type = "bar";
        labels.length = 0; // Clear labels
        const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        weekdays.forEach(w => labels.push(w));

        // Get workouts logged this week
        const dateObj = new Date(selectedDate);
        const currentDay = dateObj.getDay();
        const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
        const mondayObj = new Date(dateObj);
        mondayObj.setDate(dateObj.getDate() + distanceToMon);

        for (let i = 0; i < 7; i++) {
            const loopDate = new Date(mondayObj);
            loopDate.setDate(mondayObj.getDate() + i);
            const loopDateStr = loopDate.toISOString().split('T')[0];
            const log = state.dailyLogs[loopDateStr];
            let kCalBurned = 0;
            if (log) {
                kCalBurned = sumWorkoutsKcal(log);
            }
            data.push(kCalBurned);
        }

        datasetOptions = {
            backgroundColor: getAccentColor(),
            borderRadius: 6,
            barThickness: 16
        };
    }

    // Set chart details
    analyticsChart.config.type = type;
    analyticsChart.data.labels = labels;
    analyticsChart.data.datasets[0] = {
        data,
        ...datasetOptions
    };
    
    analyticsChart.update();
}

// Global hook for inline deletes
window.deleteProgressEntry = deleteProgressEntry;
