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
       typeWriter("You shouldn't've done that."); // kanye reference
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