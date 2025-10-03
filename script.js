## ⚙️ script.js
playerName=document.getElementById('playerName').value;
document.getElementById('startScreen').classList.add('hidden');
gameStarted=true;
startTimestamp=performance.now();
spawnIntervalId=setInterval(()=>{ if(!gamePaused) spawnRaindrop(); },RAINDROP_SPAWN_MS);
requestAnimationFrame(loop);
};


function spawnRaindrop(){ raindrops.push({x:randInt(20,GAME_WIDTH-20),y:-10,vy:randInt(2,5)}); }


function drawCloud(){ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cloud.x,cloud.y,30,0,Math.PI*2); ctx.fill(); }


function drawRaindrops(){ ctx.fillStyle='#7fb3d5'; raindrops.forEach(r=>{ ctx.beginPath(); ctx.arc(r.x,r.y,8,0,Math.PI*2); ctx.fill();}); }


function update(){
for(let i=raindrops.length-1;i>=0;i--){
let r=raindrops[i]; r.y+=r.vy;
if(r.y>=cloud.y-20 && r.x>=cloud.x-40 && r.x<=cloud.x+40){
raindrops.splice(i,1);
starsCollected++;
document.getElementById('starsCount').textContent=starsCollected;
handleCatch();
}
}
}


function loop(){
if(!gameStarted)return;
if(!gamePaused){ update(); }
ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
drawRaindrops(); drawCloud();
animationId=requestAnimationFrame(loop);
}


function moveCloud(dx){ cloud.x=Math.max(40,Math.min(GAME_WIDTH-40,cloud.x+dx)); }


document.getElementById('leftBtn').onclick=()=>moveCloud(-50);
document.getElementById('rightBtn').onclick=()=>moveCloud(50);
document.getElementById('quitBtn').onclick=()=> endGame();
document.getElementById('restartBtn').onclick=()=>location.reload();


function handleCatch(){
const pair=SCENARIOS[randInt(0,SCENARIOS.length-1)];
showPopup(`<p>${pair.s}</p><button id='next'>Next</button>`);
document.getElementById('next').onclick=()=>{
document.getElementById('popupPanel').innerHTML=`<p>How are you handling this stress?</p><div id='rating'></div><button id='ok'>OK</button>`;
createStarWidget(document.getElementById('rating'),()=>{});
document.getElementById('ok').onclick=()=>{
document.getElementById('popupPanel').innerHTML=`<p>${pair.tip}</p><button id='close'>Close</button>`;
document.getElementById('close').onclick=()=>closePopup();
};
};
}


function endGame(){
showPopup(`<p>Are you happy now?</p><div id='after'></div><button id='done'>Done</button>`);
createStarWidget(document.getElementById('after'),(v)=>afterMood=v);
document.getElementById('done').onclick=()=>{
document.getElementById('popup').classList.add('hidden');
document.getElementById('resName').textContent=playerName;
document.getElementById('resBefore').textContent=beforeMood+"★";
document.getElementById('resAfter').textContent=afterMood+"★";
document.getElementById('resStars').textContent=starsCollected;
document.getElementById('resultScreen').classList.remove('hidden');
};
}


// Initialize start screen stars
createStarWidget(document.getElementById('startStars'),(v)=>beforeMood=v);
