// 1. Data Structure
const colorDB = [
    { name: "Canyon River Blue Metallic", code: "640", hex: "#2E4A62" },
    { name: "Crystal Black Pearl", code: "731", hex: "#010101" },
    { name: "Majestic Black Pearl", code: "893", hex: "#080808" },
    { name: "Meteorite Gray Metallic", code: "904", hex: "#53575A" },
    { name: "Platinum White Pearl", code: "883", hex: "#F2F2F2" },
    { name: "Radiant Red Metallic", code: "569", hex: "#A6192E" },
    { name: "Solar Silver Metallic", code: "932", hex: "#A5A9AB" },
    { name: "Still Night Pearl", code: "575", hex: "#003399" },
    { name: "Urban Gray Pearl", code: "912", hex: "#6D7172" }
];

// 2. State Variables
let score = 0;
let currentLevel = 1;
let currentTarget = null;
let isProcessing = false;
let colorQueue = [];
let missedColors = []; // Experimental UI data collection for user struggles currently not in use but can be logged for future analysis and design iterations
let masteryList = [...colorDB];// Level 2 Mastery Tracking

// 3. Game Logic
function initRound() {
    if (isProcessing) return;

    if (currentLevel === 1) {
        // Level 1 logic: Shuffle queue to see everything once
        if (colorQueue.length === 0) {
            colorQueue = [...colorDB].sort(() => Math.random() - 0.5);
        }
        currentTarget = colorQueue.pop();
        setupLevel1();
    } else {
        // Level 2 logic: Mastery Pool
        if (masteryList.length === 0) {
            showVictoryScreen();
            return;
        }
        // Pick a random color from the remaining un-mastered pool
        currentTarget = masteryList[Math.floor(Math.random() * masteryList.length)];
        setupLevel2();
    }

    document.getElementById('color-display').style.backgroundColor = currentTarget.hex;
}

function setupLevel1() {
    const buttons = [document.getElementById('opt1'), document.getElementById('opt2'), document.getElementById('opt3')];
    let options = [currentTarget.code];

    while (options.length < 3) {
        let randomCode = colorDB[Math.floor(Math.random() * colorDB.length)].code;
        if (!options.includes(randomCode)) options.push(randomCode);
    }

    options.sort(() => Math.random() - 0.5);

    buttons.forEach((btn, i) => {
        btn.innerText = options[i];
        btn.className = "";
    });
}

function handleChoice(btn) {
    if (isProcessing) return;
    isProcessing = true;

    if (btn.innerText === currentTarget.code) {
        btn.classList.add('btn-correct');
        updateScore(10);
        setTimeout(() => { isProcessing = false; initRound(); }, 500);
    } else {
        btn.classList.add('btn-wrong');

        // // DATA COLLECTION: Log the color the user struggled with
        // if (!missedColors.includes(currentTarget.code)) {
        //     missedColors.push(currentTarget.code);
        //     console.log("Logged missed color:", currentTarget.name); // Helpful for debugging
        // }

        document.querySelectorAll('.options-grid button').forEach(b => {
            if (b.innerText === currentTarget.code) b.classList.add('btn-faint');
        });
        setTimeout(() => { isProcessing = false; initRound(); }, 1500);
    }
}

function setupLevel2() {
    const input = document.getElementById('code-input');
    input.value = "";
    input.style.borderColor = "#ddd";
    document.getElementById('feedback-text').innerText = "";
    input.focus();
}

function handleInput(input) {
    if (input.value.length === 3) {
        isProcessing = true;
        if (input.value === currentTarget.code) {
            input.style.borderColor = "#28a745"; // Success green

            // REMOVE from mastery list so it doesn't appear again
            masteryList = masteryList.filter(c => c.code !== currentTarget.code);

            updateScore(10);

            // Check for victory immediately
            if (masteryList.length === 0) {
                setTimeout(() => { showVictoryScreen(); }, 600);
            } else {
                setTimeout(() => { isProcessing = false; initRound(); }, 600);
            }
        } else {
            // If wrong, it stays in masteryList to be repeated later
            input.style.borderColor = "#dc3545"; // Error red
            document.getElementById('feedback-text').innerText = `Correct code: ${currentTarget.code}`;
            setTimeout(() => { isProcessing = false; initRound(); }, 1800);
        }
    }
}

function updateScore(pts) {
    score += pts;
    document.getElementById('score').innerText = score;

    // Transition threshold 90
    if (score >= 90 && currentLevel === 1) {
        currentLevel = 2;
        document.getElementById('level').innerText = "2";

        // Clean, simple messaging
        document.getElementById('summary-text').innerHTML = "<strong>Good Job!</strong>";

        // Trigger the professional transition modal
        document.getElementById('level-up-modal').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('level-up-modal').classList.add('hidden');
    document.getElementById('recognition-mode').classList.add('hidden');
    document.getElementById('manual-entry').classList.remove('hidden');
    initRound();
}

// Start the first round
initRound();