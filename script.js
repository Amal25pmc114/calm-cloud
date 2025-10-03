// Elements
const game = document.getElementById("game");
const cloud = document.getElementById("cloud");
const scoreDisplay = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const gameArea = document.getElementById("gameArea");
const awarenessPage = document.getElementById("awarenessPage");
const resultScreen = document.getElementById("resultScreen");

const scenarioText = document.getElementById("scenarioText");
const awarenessText = document.getElementById("awarenessText");
const results = document.getElementById("results");

let playerName = "";
let happinessBefore = 0;
let happinessAfter = 0;
let cloudX = 170;
let score = 0;
let gameRunning = false;
let timer;
let selectedBefore = 0;

// Simple scenarios with awareness
const scenarios = [
  { text: "You feel anxious during a disaster.", tip: "Take deep breaths and remind yourself you are safe in this moment." },
  { text: "You are feeling isolated and alone.", tip: "Reach out to someone you trust – sharing helps lighten the load." },
  { text: "You feel overwhelmed by constant news.", tip: "Limit your media exposure and focus on calming activities." }
];

// Create star rating
function createStarRating(containerId, callback) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const span = document.createElement("span");
    span.textContent = "★";
    span.addEventListener("click", () => {
      [...container.children].forEach((s, idx) => {
        s.classList.toggle("selected", idx < i);
      });
      callback(i);
    });
    container.appendChild(span);
  }
}

// Start game
function startGame() {
  playerName = document.getElementById("playerName").value || "Player";
  happinessBefore = selectedBefore || 3;

  startScreen.style.display = "none";
  gameArea.style.display = "block";
  gameRunning = true;

  timer = setInterval(createRaindrop, 2500);

  // Auto end after 5 min
  setTimeout(endGame, 5 * 60 * 1000);
}

// Quit
function quitGame() {
  endGame();
}

// End game
function endGame() {
  gameRunning = false;
  clearInterval(timer);

  happinessAfter = prompt("Rate your happiness now (1-5):") || 3;

  gameArea.style.display = "none";
  resultScreen.style.display = "block";

  results.innerHTML = `
    <b>Name:</b> ${playerName}<br>
    <b>Happiness before:</b> ${happinessBefore}/5<br>
    <b>Happiness after:</b> ${happinessAfter}/5<br>
    <b>Stars collected:</b> ${score}
  `;
}

// Move cloud
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && cloudX > 0) {
    cloudX -= 20;
  } else if (e.key === "ArrowRight" && cloudX < 340) {
    cloudX += 20;
  }
  cloud.style.left = cloudX + "px";
});

// Raindrops
function createRaindrop() {
  if (!gameRunning) return;

  const raindrop = document.createElement("div");
  raindrop.classList.add("raindrop");
  raindrop.style.left = Math.random() * 380 + "px";
  game.appendChild(raindrop);

  let fall = setInterval(() => {
    let top = parseInt(raindrop.style.top || 0);
    raindrop.style.top = top + 5 + "px";

    let cloudRect = cloud.getBoundingClientRect();
    let dropRect = raindrop.getBoundingClientRect();

    if (
      dropRect.bottom >= cloudRect.top &&
      dropRect.left < cloudRect.right &&
      dropRect.right > cloudRect.left
    ) {
      raindrop.remove();
      clearInterval(fall);

      // ⭐ Add score
      score++;
      scoreDisplay.textContent = `Stars: ${score}`;

      showAwareness();
    }

    if (top > 480) {
      raindrop.remove();
      clearInterval(fall);
    }
  }, 30);
}

// Show awareness scenario
function showAwareness() {
  gameRunning = false;
  gameArea.style.display = "none";
  awarenessPage.style.display = "flex";

  let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenarioText.textContent = scenario.text;
  awarenessText.textContent = scenario.tip;
}

// Continue game
function continueGame() {
  awarenessPage.style.display = "none";
  gameArea.style.display = "block";
  gameRunning = true;
}

// Setup initial star rating
createStarRating("happinessBefore", (rating) => {
  selectedBefore = rating;
});
