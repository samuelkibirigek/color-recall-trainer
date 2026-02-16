// 1. Data Structure - Professional Vehicle Palette (De-branded)
const colorDB = [
    { name: "Deep Blue Metallic", code: "640", hex: "#2E4A62", models: "RDV, MDV, CRX" },
    { name: "Standard Black Pearl", code: "731", hex: "#010101", models: "RDV" },
    { name: "Premium Black Pearl", code: "893", hex: "#080808", models: "MDV, CRX" },
    { name: "Meteor Gray Metallic", code: "904", hex: "#53575A", models: "RDV" },
    { name: "Frost White Pearl", code: "883", hex: "#F2F2F2", models: "RDV, MDV, CRX" },
    { name: "Crimson Red Metallic", code: "569", hex: "#A6192E", models: "RDV" },
    { name: "Bright Silver Metallic", code: "932", hex: "#A5A9AB", models: "RDV, MDV, CRX" },
    { name: "Night Blue Pearl", code: "575", hex: "#003399", models: "RDV" },
    { name: "Modern Gray Pearl", code: "912", hex: "#6D7172", models: "RDV, MDV, CRX" }
];

// 2. State Variables
let score = 0;
let currentLevel = 1;
let currentTarget = null;
let isProcessing = false;
let colorQueue = [];
let masteryList = [...colorDB];

// 3. Game Logic
function initRound() {
    if (isProcessing) return;

    if (currentLevel === 1) {
        if (colorQueue.length === 0) {
            colorQueue = [...colorDB].sort(() => Math.random() - 0.5);
        }
        currentTarget = colorQueue.pop();
        setupLevel1();
    } else {
        if (masteryList.length === 0) {
            showVictoryScreen();
            return;
        }
        currentTarget = masteryList[Math.floor(Math.random() * masteryList.length)];
        setupLevel2();
    }

    document.getElementById('color-display').style.backgroundColor = currentTarget.hex;

    document.getElementById('model-info').innerText = `Models: ${currentTarget.models}`;
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
            input.style.borderColor = "#28a745";

            // Mastery logic: filter out the mastered color
            masteryList = masteryList.filter(c => c.code !== currentTarget.code);

            updateScore(10);

            if (masteryList.length === 0) {
                setTimeout(() => { showVictoryScreen(); }, 600);
            } else {
                setTimeout(() => { isProcessing = false; initRound(); }, 600);
            }
        } else {
            input.style.borderColor = "#dc3545";
            document.getElementById('feedback-text').innerText = `Correct code: ${currentTarget.code}`;
            setTimeout(() => { isProcessing = false; initRound(); }, 1800);
        }
    }
}

function updateScore(pts) {
    score += pts;
    document.getElementById('score').innerText = score;

    if (score >= 90 && currentLevel === 1) {
        currentLevel = 2;
        document.getElementById('level').innerText = "2";
        document.getElementById('summary-text').innerHTML = "<strong>Good Job!</strong>";
        document.getElementById('level-up-modal').classList.remove('hidden');
    }
}

function closeModal() {
    document.getElementById('level-up-modal').classList.add('hidden');
    document.getElementById('recognition-mode').classList.add('hidden');
    document.getElementById('manual-entry').classList.remove('hidden');
    initRound();
}

function showVictoryScreen() {
    isProcessing = true;
    document.getElementById('manual-entry').classList.add('hidden');
    document.getElementById('victory-modal').classList.remove('hidden');
}

function resetGame() {
    score = 0;
    currentLevel = 1;
    isProcessing = false;
    colorQueue = [];
    masteryList = [...colorDB];

    document.getElementById('score').innerText = "0";
    document.getElementById('level').innerText = "1";
    document.getElementById('victory-modal').classList.add('hidden');
    document.getElementById('recognition-mode').classList.remove('hidden');

    initRound();
}

// Initial Boot
initRound();