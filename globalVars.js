const PLAYER_COLOR_KEY = "mazePlayerColor";
const PLAYER_TOGGLE_SPRINT_KEY = "toggleSprint";

let player = {
    x: 24,
    y: 24, //changed spawn positions to match maze point
    size: "30",
    speed: "180",
    r: 255,
    g: 255,
    b: 255,
    color: "rgb(255, 255, 255)",
    toggleSprint: false
};

function saveToggleSprint() {
    localStorage.setItem(PLAYER_TOGGLE_SPRINT_KEY, JSON.stringify(player.toggleSprint));
}

function loadToggleSprint() {
    const savedToggle = localStorage.getItem(PLAYER_TOGGLE_SPRINT_KEY);
    player.toggleSprint = savedToggle === null ? false : JSON.parse(savedToggle);
    return player.toggleSprint;
}

function updatePlayerColor() {
    player.color = `rgb(${player.r}, ${player.g}, ${player.b})`;
    return player.color;
}

function savePlayerColor() {
    const savedColor = {
        r: player.r,
        g: player.g,
        b: player.b
    };

    localStorage.setItem(PLAYER_COLOR_KEY, JSON.stringify(savedColor));
}

function loadPlayerColor() {
    const savedColor = JSON.parse(localStorage.getItem(PLAYER_COLOR_KEY) || "null");

    if (!savedColor) {
        return;
    }
player.r = Number.isFinite(savedColor.r) ? savedColor.r : 255;
player.g = Number.isFinite(savedColor.g) ? savedColor.g : 255;
player.b = Number.isFinite(savedColor.b) ? savedColor.b : 255;
    updatePlayerColor();
}
