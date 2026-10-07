/*
let health = 100;
let random = Math.floor(Math.random() * 100) + 1;
let totalHealth = health - random;

console.log(`You took ${random} damage!`);

if (totalHealth>=70){
    console.log(`Your health is ${totalHealth}: You are healthy.`)
}
else if (totalHealth>=40){
    console.log(`Your health is ${totalHealth}: Health is low.`)
}
else{
    console.log(`Your health is ${totalHealth}: Situation dire. Heal immediately.`)
} 
*/
    let button = document.getElementById("startButton");
let title = document.getElementById("titleOne");

button.addEventListener("click", function() {
    title.textContent = "You shouldn't've done that.";
});