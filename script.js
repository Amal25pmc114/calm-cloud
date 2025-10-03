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
let selectedBefore = 3; 
let selectedAfter = 3;

// Simple scenarios
const scenarios = [
  { text: "Feeling anxious during a disaster", tip: "Take deep breaths and focus on the present moment." },
  { text: "Feeling isolated and alone", tip: "Reach out to a friend or family member to talk." },
  { text: "Feeling overwhelmed by news", tip: "Limit your media exposure and do something calming." }
];

// Create star rating
function createStarRating(containerId, callback, initial=3) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const span = document.createElement("span");
    span.textContent = "★";
    if (i <= initial) span.classList.add("selected");
    span.addEventListener("click", () => {
      [...container.children].forEach((s, idx) => s.classList.toggle("selected", idx < i));
      callback(i);
    });
    container.appendChild(span);
  }
}

// Initial happiness stars
createStarRating("happinessBefore", (rating)=>{ selectedBefore = rating; }, 3);

// Start game
function startGame() {
  playerName = document.getElementById("playerName").value || "Player";
  happinessBefore = selectedBefore;

  startScreen.style.display = "none";
  gameArea.style.display = "block";
  gameRunning = true;

  timer = setInterval(createRaindrop, 1500);
}

// Quit game
function quitGame() {
  endGame();
}

// End game
function endGame() {
  gameRunning = false;
  clearInterval(timer);
  gameArea.style.display = "none";
  resultScreen.style.display = "flex";
  createStarRating("happinessAfter", (rating)=>{ selectedAfter = rating; }, 3);
}

// Show results
function showFinalResults() {
  happinessAfter = selectedAfter || 3;
  results.innerHTML = `
    <b>Name:</b> ${playerName}<br>
    <b>Happiness before:</b> ${happinessBefore}/5<br>
    <b>Happiness after:</b> ${happinessAfter}/5<br>
    <b>Stars collected:</b> ${score}
  `;
}

// Move cloud
document.addEventListener("keydown", (e)=>{
  if(!gameRunning) return;
  if(e.key === "ArrowLeft" && cloudX > 0) cloudX -= 20;
  if(e.key === "ArrowRight" && cloudX < 340) cloudX += 20;
  cloud.style.left = cloudX + "px";
});

// Create raindrops
function createRaindrop() {
  if(!gameRunning) return;
  const raindrop = document.createElement("div");
  raindrop.classList.add("raindrop");
  raindrop.style.left = Math.random()*380 + "px";
  raindrop.style.top = "0px";
  game.appendChild(raindrop);

  const fall = setInterval(()=>{
    let top = parseInt(raindrop.style.top);
    raindrop.style.top = (top+5) + "px";

    let cloudRect = cloud.getBoundingClientRect();
    let dropRect = raindrop.getBoundingClientRect();

    if(dropRect.bottom >= cloudRect.top && dropRect.left < cloudRect.right && dropRect.right > cloudRect.left){
      raindrop.remove();
      clearInterval(fall);
      score++;
      scoreDisplay.textContent = `Stars: ${score}`;
      showAwareness();
    }

    if(top > 480){ raindrop.remove(); clearInterval(fall); }
  }, 30);
}

// Show awareness
function showAwareness() {
  gameRunning = false;
  gameArea.style.display = "none";
  awarenessPage.style.display = "flex";
  const scenario = scenarios[Math.floor(Math.random()*scenarios.length)];
  scenarioText.textContent = scenario.text;
  awarenessText.textContent = scenario.tip;
}

// Continue game
function continueGame() {
  awarenessPage.style.display = "none";
  gameArea.style.display = "block";
  gameRunning = true;
}

