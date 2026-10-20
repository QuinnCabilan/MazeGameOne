
const map = document.getElementById("map");
const cellSize = 24;

const columns = Math.floor(map.clientWidth / cellSize);
const rows = Math.floor(map.clientHeight / cellSize);

// Create a grid filled with paths (0).
const grid = Array.from(
    { length: rows },
    () => Array(columns).fill(1)
);

const startRow = 1;
const startCol = 1;
//based off of prims algorithm
const directions = [ //1 represents a wall, 0 represents a path/empty cell, by going 2 at a time it leaves paths open between walls
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
]

grid[startRow][startCol] = 0;
const stack = [[startRow, startCol]];

while (stack.length > 0) {
    const [row, col] = stack[stack.length - 1];

    const choices = directions.filter(([dr, dc]) => {
        const nextRow = row + dr;
        const nextCol = col + dc;

        return nextRow > 0 &&
            nextRow < rows - 1 &&
            nextCol > 0 &&
            nextCol < columns - 1 &&
            grid[nextRow][nextCol] === 1;
    });

    if (choices.length === 0) {
        stack.pop();
        continue
    }

    const [dr, dc] = choices[Math.floor(Math.random() * choices.length)];
    const nextRow = row + dr;
    const nextCol = col + dc;

    grid[row + dr / 2][col + dc / 2] = 0;
    grid[nextRow][nextCol] = 0;
    stack.push([nextRow, nextCol])
}

let exitRow = rows - 2;
let exitCol = columns - 2;

if (exitRow % 2 ===0) exitRow--;
if (exitCol % 2 ===0) exitCol--;

grid[0][startCol] = 0;
grid[rows - 1][exitCol] = 0;


/*
const newRow = row + dr;
const newCol = col + dc;

const frontier = [];
frontier.push([row, col])//.push moves elements of an array to the end of the array and returns the new length of the array (Q).

const randomIndex = Math.floor(
    Math.random() * frontier.length
);

const [wallRow, wallCol] = frontier.splice(
    randomINdex, 1
)[0];



grid.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
        if (Math.random() < 0.1) { //0.x changes the % of walls filled in by x0% ie. 0.5=50%
            grid[rowIndex][columnIndex] = 1;
        }
    });
});
*/
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

        
        cell.style.left = `${columnIndex * cellSize}px`;
        cell.style.top = `${rowIndex * cellSize}px`;

        gridElement.appendChild(cell);
    });
});

map.prepend(gridElement)

function wallRightThereBro(x, y) {
    const size = inGamePlayer.offsetWidth;

    const corners = [ //corners = the four corners of the player not the maze
        [x, y]
        [x + size - 1, y],
        [x, y + size - 1],
        [x + size - 1, y + size - 1]
    ];

    return corners.some(([pageXOffset, py]) => {
        const col = Math.floor(px / cellsize); 
        const row = Math.floor(py / cellsize); //basically turns pixels into grid coordinates

        return grid[row]?.[col] !== 0;
    })
}