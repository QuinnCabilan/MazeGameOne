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

button.addEventListener("click", function() {
    title.textContent = "You shouldn't've done that."; //kanye reference
});

customize.addEventListener("click", function() {
    window.location.href = "http://127.0.0.1:3000/customize.html?vscode-livepreview=true"
});

options.addEventListener("click", function() {
    console.log("OPTIONS CLICKED");
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});