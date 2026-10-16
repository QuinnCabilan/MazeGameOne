
const map = document.getElementById("map");
const cellSize = 24;

const columns = Math.floor(map.clientWidth / cellSize);
const rows = Math.floor(map.clientHeight / cellSize);

// Create a grid filled with paths (0).
const grid = Array.from(
    { length: rows },
    () => Array(columns).fill(0)
);

const startRow = 1;
const startCol = 1;

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
]

const newRow = row + dr;
const newCol = col + dc;

const frontier = [];
frontier.push([row, col])//.push moves elements of an array to the end of the array and returns the new length of the array.

const randomIndex = Math.floor(
    Math.random() * frontier.length
);

const [wallRow, wallCol] = frontier.splice(
    randomINdex, 1
)[0];

/*

// Add three test walls.
grid.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
        if (Math.random() < 0.1) { //0.x changes the % of walls filled in by x0% ie. 0.5=50%
            grid[rowIndex][columnIndex] = 1;
        }
    });
});

// Create the container for all cells.
const gridElement = document.createElement("div");
gridElement.id = "gridElement";

// Loop through every row.
grid.forEach((row, rowIndex) => {

    // Loop through every cell in that row.
    row.forEach((value, columnIndex) => {
        const cell = document.createElement("div");

        cell.className = "maze-cell";

        // Turn cells with a value of 1 into walls.
        if (value === 1) {
            cell.classList.add("wall");
        }

        // Position the cell within the map.
        cell.style.left = `${columnIndex * cellSize}px`;
        cell.style.top = `${rowIndex * cellSize}px`;

        gridElement.appendChild(cell);
    });
});

// Add the completed grid to the map.
map.prepend(gridElement);