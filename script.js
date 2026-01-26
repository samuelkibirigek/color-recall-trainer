// 1. Data Structure
const colorDB = [
    { name: "Red", hex: "#FF0000", code: "114" },
    { name: "Blue", hex: "#0000FF", code: "332" },
    { name: "Black", hex: "#000000", code: "693" },
    { name: "White", hex: "#FFFFFF", code: "674" },
    { name: "Dark Grey", hex: "#A9A9A9", code: "816" },
    { name: "Light Grey", hex: "#D3D3D3", code: "309" },
    { name: "Navy Blue", hex: "#000080", code: "603" },
    { name: "Cream", hex: "#FFFDD0", code: "221" },
    { name: "Purple", hex: "#800080", code: "441" },
    { name: "Orange", hex: "#FFA500", code: "502" }
];

// 2. State Variables
let score = 0;
let currentLevel = 1;
let currentTarget = null;
let isProcessing = false;

// 3. Game Logic
function initRound() {
    if (isProcessing) return;

    // Pick random color
    currentTarget = colorDB[Math.floor(Math.random() * colorDB.length)];
    document.getElementById('color-display').style.backgroundColor = currentTarget.hex;

    if (currentLevel === 1) {
        setupLevel1();
    } else {
        setupLevel2();
    }
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
        // Apply faint green to the correct option
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
            input.style.borderColor = "var(--correct)";
            updateScore(10);
            setTimeout(() => { isProcessing = false; initRound(); }, 600);
        } else {
            input.style.borderColor = "var(--wrong)";
            document.getElementById('feedback-text').innerText = `Correct code: ${currentTarget.code}`;
            document.getElementById('feedback-text').style.color = "var(--wrong)";
            setTimeout(() => { isProcessing = false; initRound(); }, 1800);
        }
    }
}

function updateScore(pts) {
    score += pts;
    document.getElementById('score').innerText = score;

    if (score >= 50 && currentLevel === 1) {
        currentLevel = 2;
        document.getElementById('level').innerText = "2";
        document.getElementById('recognition-mode').classList.add('hidden');
        document.getElementById('manual-entry').classList.remove('hidden');
        alert("Goal Reached! Level 2 Unlocked: Manual Entry Mode.");
    }
}

// Start the first round
initRound();