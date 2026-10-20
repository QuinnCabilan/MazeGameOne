/*
let health = 100;
let random = Math.floor(Math.random() * 100) + 1;
let totalHealth = health - random;

console.log(`You took ${random} damage!`);

if (totalHealth>=70){
    console.log(`Your health is ${totalHealth}: You are healthy.`)
}
else if (totalHealthS>=40){
    console.log(`Your health is ${totalHealth}: Health is low.`)
}
else{
    console.log(`Your health is ${totalHealth}: Situation dire. Heal immediately.`)
} 
*/
let button = document.getElementById("startButton");
let title = document.getElementById("titleOne");
let customize = document.getElementById("customize");
let options = document.getElementById("options");
let playerR = document.getElementById("color-slide-r");
let playerG = document.getElementById("color-slide-g");
let playerB = document.getElementById("color-slide-b");
let playerDivPreview = document.getElementById("preview-player");
let inGamePlayer = document.getElementById("player");
let fog = document.getElementById("fog")
let sprintToggle = document.getElementById("toggleSprint");
const pressedKeys = [];
const movementKeys = ["w", "a", "s", "d"];
const otherKeys = ["shift","f"]
let visionMeter = 100;
const meterDrainPerSecond = 4;
const maxVisionRadius = 70;
const visionMeterElement = document.getElementById("visionMeter");

loadToggleSprint();

if (sprintToggle) {
    sprintToggle.checked = player.toggleSprint;
    sprintToggle.addEventListener("change", function() {
        player.toggleSprint = sprintToggle.checked;
        saveToggleSprint();
    });
}

const fadeEffect = document.getElementById("fadeEffect");

function applyPlayerColorToDom() {
    const colorTargets = [playerDivPreview, inGamePlayer].filter(Boolean);

    colorTargets.forEach((element) => {
        element.style.backgroundColor = player.color;
    });
}

function updatePreviewColor() {
    if (!playerR || !playerG || !playerB) {
        return;
    }

    player.r = Number(playerR.value);
    player.g = Number(playerG.value);
    player.b = Number(playerB.value);
    updatePlayerColor();
    applyPlayerColorToDom();
    savePlayerColor();
}

function syncSlidersFromPlayer() {
    if (!playerR || !playerG || !playerB) {
        return;
    }

    playerR.value = player.r;
    playerG.value = player.g;
    playerB.value = player.b;
    updatePreviewColor();
}

if (button && title) {
    button.addEventListener("click", function() {
        
    fadeEffect.classList.add("active");
       typeWriter("You shouldn't've done that."); // kanye reference
       setTimeout(function() {
        window.location.href = "game.html";
    }, 3500);
    });
}


if (playerR && playerG && playerB && playerDivPreview) {
    loadPlayerColor();
    syncSlidersFromPlayer();

    [playerR, playerG, playerB].forEach((slider) => {
        slider.addEventListener("input", updatePreviewColor);
    });
}

const speed = 50;

let currentAnimationId = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeWriter(text) {
  if (!title) {
    return;
  }

  currentAnimationId++;
  const myAnimationId = currentAnimationId;

  title.textContent = "";

  for (let i = 0; i < text.length; i++) {
    if (myAnimationId !== currentAnimationId) {
      return;
    }

    title.textContent += text[i];
    await sleep(speed);
  }
}

const callHome = document.getElementById("callHome");

callHome.addEventListener("click", function() {
        window.location.href = "index.html";  
    
});
let fogX = player.x +(player.size/2)
let fogY = player.y +(player.size/2)
fog.style.setProperty('--x', `${fogX}px`);
fog.style.setProperty('--y', `${fogY}px`);

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if(!movementKeys.includes(key) && (!otherKeys.includes(key))) return;
  event.preventDefault();
  if(!pressedKeys.includes(key)){

      pressedKeys.push(key)  
    }
})
window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    const index = pressedKeys.indexOf(key);
    if (index !== -1) {
        pressedKeys.splice(index, 1);
    }
});
let previousFrameTime
function gameLoop(timestamp){
    
    const deltaSeconds = previousFrameTime === undefined
        ? 0
        : (timestamp - previousFrameTime) / 1000;
    
        previousFrameTime = timestamp;
        let directionX=0;
        let directionY=0;
       
        const upIndex = pressedKeys.indexOf("w");
const downIndex = pressedKeys.indexOf("s");
const baseSpeed = player.speed;
const sprintMultiplier = 1.5;
const currentSpeed = pressedKeys.includes("shift")
    ? baseSpeed * sprintMultiplier
    : baseSpeed;
const lightFlash = pressedKeys.includes("f")
    ? fog.style.visibility =  hidden
    : fog.style.visibility =  visible;
if (upIndex !== -1 && downIndex !== -1) {
    directionY = upIndex > downIndex ? -1 : 1;
} else if (upIndex !== -1) {
    directionY = -1;
} else if (downIndex !== -1) {
    directionY = 1;
}
     const leftIndex = pressedKeys.indexOf("a");
const rightIndex = pressedKeys.indexOf("d");

if (leftIndex !== -1 && rightIndex !== -1) {
    directionX = leftIndex > rightIndex ? -1 : 1;
} else if (leftIndex !== -1) {
    directionX = -1;
} else if (rightIndex !== -1) {
    directionX = 1;
}
        const directionLength = Math.hypot(directionX, directionY);
        if(directionLength >0){
            const isSprinting = directionLength > 0 && pressedKeys.includes("shift");
const currentSpeed = isSprinting
    ? player.speed * 1.5
    : player.speed;

fog.style.setProperty("--radius", isSprinting ? "50px" : "70px");
            directionX /= directionLength
            directionY /= directionLength;
            player.x += directionX * currentSpeed * deltaSeconds;
            player.y += directionY * currentSpeed * deltaSeconds;
            const maxX = fog.clientWidth - inGamePlayer.offsetWidth;
            const maxY = fog.clientHeight - inGamePlayer.offsetHeight;
            player.x = Math.max(0, Math.min(maxX, player.x));
            player.y = Math.max(0, Math.min(maxY, player.y));
        }
        inGamePlayer.style.left = `${player.x}px`;
        inGamePlayer.style.top = `${player.y}px`;
        
        fog.style.setProperty("--x", `${player.x + inGamePlayer.offsetWidth / 2}px`);
        fog.style.setProperty("--y", `${player.y + inGamePlayer.offsetHeight / 2}px`);
        requestAnimationFrame(gameLoop)
        visionMeter = Math.max(
    0,
    visionMeter - meterDrainPerSecond * (deltaSeconds)
);

visionMeterElement.value = visionMeter;

const meterRatio = visionMeter / 100;
const baseRadius = maxVisionRadius * meterRatio;
const radius = pressedKeys.includes("shift")
    ? baseRadius * 0.6
    : baseRadius;

fog.style.setProperty("--radius", `${radius}px`);
    }
    requestAnimationFrame(gameLoop)
    applyPlayerColorToDom();
    window.addEventListener("blur", () => {
    pressedKeys.length = 0;
});