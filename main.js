
let health = 100;
let random = Math.floor(Math.random() * 100) + 1;
let totalHealth = health - random;

console.log(`You took ${random} damage!`);

if (totalHealth>=70){
    console.log(`Your health is ${totalHealth}: You are healthy.`)
}
else if (totalHealth >= 40){
    console.log(`Your health is ${totalHealth}: Health is low.`)
}
else{
    console.log(`Your health is ${totalHealth}: Situation dire. Heal immediately.`)
}
let button = document.getElementById("startButton");
let title = document.getElementById("titleOne");
let customize = document.getElementById("customize");
let options = document.getElementById("options");
let playerR = document.getElementById("color-slide-r");
let playerG = document.getElementById("color-slide-g");
let playerB = document.getElementById("color-slide-b");
let playerDivPreview = document.getElementById("preview-player");
let inGamePlayer = document.getElementById("player");

const keys = {};
const mazeConfig = { cols: 15, rows: 15, cellSize: 32 };
let PLAYER_SIZE = 24;
let maze = [];
let mazeOrigin = { x: 0, y: 0 };

function resizeMazeToViewport() {
    const maxMazePx = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
    mazeConfig.cellSize = Math.max(24, Math.floor(maxMazePx / mazeConfig.cols));
    PLAYER_SIZE = Math.max(18, Math.round(mazeConfig.cellSize * 0.72));

    const canvas = document.getElementById("maze-canvas");
    if (!canvas) return;

    canvas.width = mazeConfig.cols * mazeConfig.cellSize;
    canvas.height = mazeConfig.rows * mazeConfig.cellSize;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;

    if (player && typeof player.gridX === "number" && typeof player.gridY === "number") {
        setPlayerPositionFromGrid();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createMazeGrid() {
    return Array.from({ length: mazeConfig.rows }, (_, y) =>
        Array.from({ length: mazeConfig.cols }, (_, x) => ({
            x,
            y,
            visited: false,
            walls: {
                top: true,
                right: true,
                bottom: true,
                left: true
            }
        }))
    );
}

function inBounds(x, y) {
    return x >= 0 && x < mazeConfig.cols && y >= 0 && y < mazeConfig.rows;
}

function generateMaze() {
    maze = createMazeGrid();

    function carve(x, y) {
        maze[y][x].visited = true;
        const directions = shuffle([
            { dx: 1, dy: 0, wall: "right", opposite: "left" },
            { dx: -1, dy: 0, wall: "left", opposite: "right" },
            { dx: 0, dy: 1, wall: "bottom", opposite: "top" },
            { dx: 0, dy: -1, wall: "top", opposite: "bottom" }
        ]);

        for (const direction of directions) {
            const nx = x + direction.dx;
            const ny = y + direction.dy;

            if (!inBounds(nx, ny) || maze[ny][nx].visited) {
                continue;
            }

            maze[y][x].walls[direction.wall] = false;
            maze[ny][nx].walls[direction.opposite] = false;
            carve(nx, ny);
        }
    }

    carve(0, 0);

    const borderCells = [];
    for (let y = 0; y < mazeConfig.rows; y++) {
        for (let x = 0; x < mazeConfig.cols; x++) {
            if (x === 0 || y === 0 || x === mazeConfig.cols - 1 || y === mazeConfig.rows - 1) {
                borderCells.push({ x, y });
            }
        }
    }

    const startCell = borderCells[Math.floor(Math.random() * borderCells.length)];
    let exitCell = null;

    for (let attempt = 0; attempt < 100; attempt++) {
        const candidate = borderCells[Math.floor(Math.random() * borderCells.length)];
        const sameCell = candidate.x === startCell.x && candidate.y === startCell.y;
        const farEnough = Math.abs(candidate.x - startCell.x) + Math.abs(candidate.y - startCell.y) >= 6;
        const differentSide =
            (candidate.x === 0 && startCell.x !== 0) ||
            (candidate.x === mazeConfig.cols - 1 && startCell.x !== mazeConfig.cols - 1) ||
            (candidate.y === 0 && startCell.y !== 0) ||
            (candidate.y === mazeConfig.rows - 1 && startCell.y !== mazeConfig.rows - 1);

        if (!sameCell && farEnough && differentSide) {
            exitCell = candidate;
            break;
        }
    }

    if (!exitCell) {
        exitCell = borderCells.find((cell) => !(cell.x === startCell.x && cell.y === startCell.y)) || startCell;
    }

    const startWall = startCell.x === 0 ? "left" : startCell.x === mazeConfig.cols - 1 ? "right" : startCell.y === 0 ? "top" : "bottom";
    const exitWall = exitCell.x === 0 ? "left" : exitCell.x === mazeConfig.cols - 1 ? "right" : exitCell.y === 0 ? "top" : "bottom";

    maze[startCell.y][startCell.x].walls[startWall] = false;
    maze[exitCell.y][exitCell.x].walls[exitWall] = false;

    const queue = [{ x: startCell.x, y: startCell.y }];
    const visited = Array.from({ length: mazeConfig.rows }, () => Array(mazeConfig.cols).fill(false));
    const distance = Array.from({ length: mazeConfig.rows }, () => Array(mazeConfig.cols).fill(0));
    visited[startCell.y][startCell.x] = true;

    let farthestCell = { x: startCell.x, y: startCell.y };

    while (queue.length > 0) {
        const current = queue.shift();
        const currentCell = maze[current.y][current.x];
        const currentDistance = distance[current.y][current.x];

        if (currentDistance > distance[farthestCell.y][farthestCell.x]) {
            farthestCell = { x: current.x, y: current.y };
        }

        const directions = [
            { dx: 1, dy: 0, wall: "right" },
            { dx: -1, dy: 0, wall: "left" },
            { dx: 0, dy: 1, wall: "bottom" },
            { dx: 0, dy: -1, wall: "top" }
        ];

        for (const direction of directions) {
            const nx = current.x + direction.dx;
            const ny = current.y + direction.dy;

            if (!inBounds(nx, ny) || visited[ny][nx]) {
                continue;
            }

            if (!currentCell.walls[direction.wall]) {
                visited[ny][nx] = true;
                distance[ny][nx] = currentDistance + 1;
                queue.push({ x: nx, y: ny });
            }
        }
    }

    maze.start = startCell;
    maze.exit = exitCell;
}

function drawMaze() {
    const canvas = document.getElementById("maze-canvas");
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    canvas.width = mazeConfig.cols * mazeConfig.cellSize;
    canvas.height = mazeConfig.rows * mazeConfig.cellSize;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tile = document.createElement("canvas");
    tile.width = 32;
    tile.height = 32;
    const tctx = tile.getContext("2d");
    tctx.fillStyle = "#0a1016";
    tctx.fillRect(0, 0, 32, 32);
    tctx.strokeStyle = "rgba(255,255,255,0.03)";
    tctx.lineWidth = 1;
    for (let y = 0; y < 32; y += 8) {
        for (let x = 0; x < 32; x += 8) {
            tctx.strokeRect(x + 0.5, y + 0.5, 7, 7);
        }
    }
    ctx.fillStyle = ctx.createPattern(tile, "repeat");
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    ctx.fillStyle = "#dfe6ea";

    for (let y = 0; y < mazeConfig.rows; y++) {
        for (let x = 0; x < mazeConfig.cols; x++) {
            const cell = maze[y][x];
            const px = x * mazeConfig.cellSize;
            const py = y * mazeConfig.cellSize;

            if (cell.walls.top) {
                ctx.fillStyle = "#e9f0f3";
                ctx.fillRect(px, py, mazeConfig.cellSize, 2);
            }
            if (cell.walls.right) {
                ctx.fillStyle = "#e9f0f3";
                ctx.fillRect(px + mazeConfig.cellSize - 2, py, 2, mazeConfig.cellSize);
            }
            if (cell.walls.bottom) {
                ctx.fillStyle = "#e9f0f3";
                ctx.fillRect(px, py + mazeConfig.cellSize - 2, mazeConfig.cellSize, 2);
            }
            if (cell.walls.left) {
                ctx.fillStyle = "#e9f0f3";
                ctx.fillRect(px, py, 2, mazeConfig.cellSize);
            }
        }
    }

    if (maze.start) {
        const startX = maze.start.x * mazeConfig.cellSize + mazeConfig.cellSize / 2;
        const startY = maze.start.y * mazeConfig.cellSize + mazeConfig.cellSize / 2;
        ctx.fillStyle = "#31d17a";
        ctx.beginPath();
        ctx.arc(startX, startY, mazeConfig.cellSize * 0.18, 0, Math.PI * 2);
        ctx.fill();
    }

    if (maze.exit) {
        const exitX = maze.exit.x * mazeConfig.cellSize + mazeConfig.cellSize / 2;
        const exitY = maze.exit.y * mazeConfig.cellSize + mazeConfig.cellSize / 2;
        ctx.fillStyle = "#ffb703";
        ctx.beginPath();
        ctx.arc(exitX, exitY, mazeConfig.cellSize * 0.18, 0, Math.PI * 2);
        ctx.fill();
    }
}

function setPlayerPositionFromGrid() {
    const margin = (mazeConfig.cellSize - PLAYER_SIZE) / 2;
    player.x = player.gridX * mazeConfig.cellSize + margin;
    player.y = player.gridY * mazeConfig.cellSize + margin;
    player.x = Math.min(Math.max(player.x, 0), mazeConfig.cols * mazeConfig.cellSize - PLAYER_SIZE);
    player.y = Math.min(Math.max(player.y, 0), mazeConfig.rows * mazeConfig.cellSize - PLAYER_SIZE);
}

function canMoveTo(nextGridX, nextGridY) {
    if (!inBounds(nextGridX, nextGridY)) {
        return false;
    }

    const currentCell = maze[player.gridY][player.gridX];
    const dx = nextGridX - player.gridX;
    const dy = nextGridY - player.gridY;

    if (dx === 1 && currentCell.walls.right) return false;
    if (dx === -1 && currentCell.walls.left) return false;
    if (dy === 1 && currentCell.walls.bottom) return false;
    if (dy === -1 && currentCell.walls.top) return false;

    if (dx !== 0 && dy !== 0) {
        const xCell = maze[player.gridY][nextGridX];
        const yCell = maze[nextGridY][player.gridX];
        return !((xCell && xCell.walls.left && xCell.walls.right) || (yCell && yCell.walls.top && yCell.walls.bottom));
    }

    return true;
}

function collidesAt(x, y) {
    const left = x + 1;
    const right = x + PLAYER_SIZE - 1;
    const top = y + 1;
    const bottom = y + PLAYER_SIZE - 1;

    const minCellX = Math.floor(left / mazeConfig.cellSize);
    const maxCellX = Math.floor(right / mazeConfig.cellSize);
    const minCellY = Math.floor(top / mazeConfig.cellSize);
    const maxCellY = Math.floor(bottom / mazeConfig.cellSize);

    for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
            const cell = maze[cellY]?.[cellX];
            if (!cell) continue;

            const cellLeft = cellX * mazeConfig.cellSize;
            const cellRight = cellLeft + mazeConfig.cellSize;
            const cellTop = cellY * mazeConfig.cellSize;
            const cellBottom = cellTop + mazeConfig.cellSize;

            if (cell.walls.left && right > cellLeft && left <= cellLeft && bottom > cellTop && top < cellBottom) {
                return true;
            }
            if (cell.walls.right && left < cellRight && right >= cellRight && bottom > cellTop && top < cellBottom) {
                return true;
            }
            if (cell.walls.top && bottom > cellTop && top <= cellTop && right > cellLeft && left < cellRight) {
                return true;
            }
            if (cell.walls.bottom && top < cellBottom && bottom >= cellBottom && right > cellLeft && left < cellRight) {
                return true;
            }
        }
    }

    return false;
}

function findSpawnCell() {
    if (maze.start) {
        return maze.start;
    }

    const centerX = Math.floor(mazeConfig.cols / 2);
    const centerY = Math.floor(mazeConfig.rows / 2);
    let bestCell = { x: centerX, y: centerY };
    let bestScore = Infinity;

    for (let y = 0; y < mazeConfig.rows; y++) {
        for (let x = 0; x < mazeConfig.cols; x++) {
            const cell = maze[y][x];
            const openCount = Object.values(cell.walls).filter((wall) => !wall).length;
            const distanceFromCenter = Math.abs(x - centerX) + Math.abs(y - centerY);
            const score = distanceFromCenter - openCount * 0.5;

            if (score < bestScore) {
                bestScore = score;
                bestCell = { x, y };
            }
        }
    }

    return bestCell;
}

function movePlayerByGrid(dx, dy) {
    const nextGridX = player.gridX + dx;
    const nextGridY = player.gridY + dy;

    if (!canMoveTo(nextGridX, nextGridY)) {
        return;
    }

    player.gridX = nextGridX;
    player.gridY = nextGridY;
    setPlayerPositionFromGrid();
}

function applyPlayerColorToDom() {
    const colorTargets = [playerDivPreview, inGamePlayer].filter(Boolean);

    colorTargets.forEach((element) => {
        element.style.backgroundColor = player.color;
    });
}

function updateMazeOrigin() {
    const canvas = document.getElementById("maze-canvas");
    const gameScreen = document.getElementById("game-screen");

    if (!canvas || !gameScreen) {
        mazeOrigin = { x: 0, y: 0 };
        return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const screenRect = gameScreen.getBoundingClientRect();
    mazeOrigin.x = canvasRect.left - screenRect.left;
    mazeOrigin.y = canvasRect.top - screenRect.top;
}

function updateFogPosition() {
    const fog = document.getElementById("fog");
    const screenX = player.x + mazeOrigin.x;
    const screenY = player.y + mazeOrigin.y;

    if (!fog) return;

    fog.style.setProperty("--view-x", `${screenX + 15}px`);
    fog.style.setProperty("--view-y", `${screenY + 15}px`);

    if (inGamePlayer) {
        inGamePlayer.style.left = `${screenX}px`;
        inGamePlayer.style.top = `${screenY}px`;
        inGamePlayer.style.transform = `rotate(${player.rotation || 0}deg)`;
    }
}

function updatePreviewColor() {
    if (!playerR || !playerG || !playerB) return;

    player.r = Number(playerR.value);
    player.g = Number(playerG.value);
    player.b = Number(playerB.value);
    updatePlayerColor();
    applyPlayerColorToDom();
    savePlayerColor();
}

function syncSlidersFromPlayer() {
    if (!playerR || !playerG || !playerB) return;

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
    applyPlayerColorToDom();
    updateFogPosition();

    [playerR, playerG, playerB].forEach((slider) => {
        slider.addEventListener("input", updatePreviewColor);
    });
}

const speed = 50;

let currentAnimationId = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeWriter(text) {
  if (!title) return;

  currentAnimationId++;
  const myAnimationId = currentAnimationId;
  title.textContent = "";

  for (let i = 0; i < text.length; i++) {
    if (myAnimationId !== currentAnimationId) return;
    title.textContent += text[i];
    await sleep(speed);
  }
}

const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {
  const gameScreen = document.getElementById("game-screen");
  if (!gameScreen) return;

  const rect = gameScreen.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
});

function updatePlayerFacing() {
  const playerEl = document.getElementById("player");
  if (!playerEl) return;

  const screenX = player.x + mazeOrigin.x;
  const screenY = player.y + mazeOrigin.y;
  const dx = mouse.x - (screenX + 15);
  const dy = mouse.y - (screenY + 15);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  player.rotation = angle;
  playerEl.style.transform = `rotate(${angle}deg)`;
  playerEl.style.left = `${screenX}px`;
  playerEl.style.top = `${screenY}px`;
}

function movePlayerFromInput(deltaTime = 1 / 60) {
  const horizontal = Number(!!keys.d) - Number(!!keys.a);
  const vertical = Number(!!keys.s) - Number(!!keys.w);

  if (horizontal === 0 && vertical === 0) {
    return;
  }

  const moveSpeed = keys.shift ? 180 : 120;
  const length = Math.hypot(horizontal, vertical) || 1;
  const deltaX = (horizontal / length) * moveSpeed * deltaTime;
  const deltaY = (vertical / length) * moveSpeed * deltaTime;

  const nextX = player.x + deltaX;
  const nextY = player.y + deltaY;

  const minX = 0;
  const maxX = mazeConfig.cols * mazeConfig.cellSize - PLAYER_SIZE;
  const minY = 0;
  const maxY = mazeConfig.rows * mazeConfig.cellSize - PLAYER_SIZE;

  const canMoveX = nextX >= minX && nextX <= maxX && !collidesAt(nextX, player.y);
  const canMoveY = nextY >= minY && nextY <= maxY && !collidesAt(player.x, nextY);

  if (canMoveX) {
    player.x = nextX;
  } else if (nextX < minX) {
    player.x = minX;
  } else if (nextX > maxX) {
    player.x = maxX;
  }

  if (canMoveY) {
    player.y = nextY;
  } else if (nextY < minY) {
    player.y = minY;
  } else if (nextY > maxY) {
    player.y = maxY;
  }

  player.gridX = Math.max(0, Math.min(mazeConfig.cols - 1, Math.floor((player.x + PLAYER_SIZE / 2) / mazeConfig.cellSize)));
  player.gridY = Math.max(0, Math.min(mazeConfig.rows - 1, Math.floor((player.y + PLAYER_SIZE / 2) / mazeConfig.cellSize)));

  updateFogPosition();
  updatePlayerFacing();
}

let lastFrameTime = 0;

function gameLoop(timestamp) {
  if (document.getElementById("game-screen")) {
    const deltaTime = Math.min((timestamp - lastFrameTime) / 1000 || 1 / 60, 0.05);
    lastFrameTime = timestamp;

    updateMazeOrigin();
    movePlayerFromInput(deltaTime);
    updateFogPosition();
    updatePlayerFacing();
  }

  requestAnimationFrame(gameLoop);
}

const gameScreen = document.getElementById("game-screen");
if (gameScreen) {
    loadPlayerColor();
    player.rotation = 0;
    resizeMazeToViewport();
    generateMaze();
    drawMaze();
    const spawnCell = findSpawnCell();
    player.gridX = spawnCell.x;
    player.gridY = spawnCell.y;
    setPlayerPositionFromGrid();
    updateMazeOrigin();
    applyPlayerColorToDom();
    updateFogPosition();

    if (maze.exit && player.gridX === maze.exit.x && player.gridY === maze.exit.y) {
        console.log("You are at the exit.");
    }

    window.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d", "shift"].includes(key)) {
            keys[key] = true;
            event.preventDefault();
        }
    });

    window.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();
        if (["w", "a", "s", "d", "shift"].includes(key)) {
            keys[key] = false;
        }
    });

    window.addEventListener("resize", () => {
        resizeMazeToViewport();
        drawMaze();
        updateMazeOrigin();
        updateFogPosition();
        updatePlayerFacing();
    });
}

requestAnimationFrame(gameLoop);