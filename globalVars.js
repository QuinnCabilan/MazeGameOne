const PLAYER_COLOR_KEY = "mazePlayerColor";

let player = {
    x: 300,
    y: 300,
    size: "30px",
    speed: "6px",
    rotation: 0,
    r: 255,
    g: 255,
    b: 255,
    color: "rgb(255, 255, 255)",
    canMove:true
};

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

function clampColorChannel(value, fallback = 255) {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return fallback;
    }

    return Math.min(255, Math.max(0, numericValue));
}

function loadPlayerColor() {
    const savedColor = JSON.parse(localStorage.getItem(PLAYER_COLOR_KEY) || "null");

    if (!savedColor) {
        return;
    }

    player.r = clampColorChannel(savedColor.r, 255);
    player.g = clampColorChannel(savedColor.g, 255);
    player.b = clampColorChannel(savedColor.b, 255);
    updatePlayerColor();
}
