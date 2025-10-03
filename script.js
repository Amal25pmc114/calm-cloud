// Global Variables
let playerName = "";
let initialHappiness = 0;
let finalHappiness = 0;
let score = 0;
let cloud = { x: 350, y: 300, width: 100, height: 60 };
const cloudSpeed = 20;
let currentScenario = 0;

// Sample Scenarios & Quotes
const scenarios = [
    { text: "You feel overwhelmed with work.", quote: "Take a deep breath and tackle one task at a time." },
    { text: "Someone upset you today.", quote: "Remember, emotions pass; respond calmly." },
    { text: "You are worried about the future.", quote: "Focus on what you can control today." }
];

// --- Initial Happiness Selection ---
const initialStars = document.querySelectorAll("#initialHappiness span");
initialStars.forEach(star => {
    star.addEventListener("click", () => {
        initialHappiness = parseInt(star.dataset.value);
        initialStars.forEach(s => s.classList.remove("selected"));
        for (let i = 0; i < initialHappiness; i++) initialStars[i].classList.add("selected");
    });
});

// --- Handling Stars Selection ---
const handlingStars = document.querySelectorAll("#handlingStars span");
let handlingRating = 0;
handlingStars.forEach(star => {
    star.addEventListener("click", () => {
        handlingRating = parseInt(star.dataset.value);
        handlingStars.forEach(s => s.classList.remove("selected"));
        for (let i = 0; i < handlingRating; i++) handlingStars[i].classList.add("selected");
    });
});

// --- Start Game ---
document.getElementById("startBtn").addEventListener("click", () => {
    playerName = document.getElementById("playerName").value || "Player";
    if (initialHappiness === 0) {
        alert("Please select your happiness rating!");
        return;
    }
    document.getElementById("startPage").style.display = "none";
    document.getElementById("gamePage").style.display = "block";
    drawCloud();
});

// --- Cloud Drawing ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function drawCloud() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#90caf9";
    ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
}

// --- Move Cloud Buttons ---
document.getElementById("moveLeft").addEventListener("click", () => {
    cloud.x -= cloudSpeed;
    if (cloud.x < 0) cloud.x = 0;
    drawCloud();
});
document.getElementById("moveRight").addEventListener("click", () => {
    cloud.x += cloudSpeed;
    if (cloud.x > canvas.width - cloud.width) cloud.x = canvas.width - cloud.width;
    drawCloud();
});

// --- Game Logic ---
function nextScenario() {
    if (currentScenario >= scenarios.length) {
        endGame();
        return;
    }
    const scenario = scenarios[currentScenario];
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("reflectionPage").style.display = "block";
    document.getElementById("scenarioText").innerText = scenario.text;
    document.getElementById("awarenessQuote").innerText = "";
    handlingStars.forEach(s => s.classList.remove("selected"));
    handlingRating = 0;
}

document.getElementById("continueBtn").addEventListener("click", () => {
    if (handlingRating === 0) {
        alert("Please rate how you handled this scenario!");
        return;
    }
    // Add score
    score += handlingRating;
    document.getElementById("scoreDisplay").innerText = `Stars Collected: ${score}`;
    document.getElementById("awarenessQuote").innerText = scenarios[currentScenario].quote;
    currentScenario++;
    setTimeout(() => {
        document.getElementById("reflectionPage").style.display = "none";
        document.getElementById("gamePage").style.display = "block";
        nextScenario();
    }, 2000); // Show quote for 2 sec
});

// --- End Game ---
function endGame() {
    document.getElementById("gamePage").style.display = "none";
    document.getElementById("reflectionPage").style.display = "none";
    document.getElementById("resultPage").style.display = "block";
    document.getElementById("finalScore").innerText = `Stars Collected: ${score}`;
    document.getElementById("initialHappinessResult").innerText = "★".repeat(initialHappiness);
    finalHappiness = initialHappiness + Math.round(score / scenarios.length);
    if(finalHappiness > 5) finalHappiness = 5;
    document.getElementById("finalHappinessResult").innerText = "★".repeat(finalHappiness);
}

// --- Restart Game ---
document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

// Start first scenario automatically after game starts
canvas.addEventListener("click", () => {
    nextScenario();
});


