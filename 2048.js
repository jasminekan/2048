var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
};

function setGame() {
    resetGame();
}

function resetGame() {
    score = 0; // Reset score
    document.getElementById("score").innerText = "Score: " + score;

    // Initialize board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Clear existing tiles
    document.getElementById("board").innerHTML = '';

    // Create new tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile"); // Add the base tile class here
            document.getElementById("board").append(tile);
        }
    }

    // Add two starting tiles
    setTwo();
    setTwo();

    // Hide the game over overlay
    document.getElementById('overlay').style.display = 'none';
}

function hasEmptyTile() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2); 
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code === "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code === "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code === "ArrowDown") {
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = "Score: " + score;

    if (isGameOver()) {
        showGameOver();
    }
});

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    // Slide and merge
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }

    row = filterZero(row);

    // Add zeros
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function isGameOver() {
    // Check for empty tiles
    if (hasEmptyTile()) {
        return false;
    }

    // Check for possible moves
    for (let r = 0; r< rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                return false; // Move right
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return false; // Move down
            }
        }
    }

    return true; // No moves left
}

document.getElementById("resetButton").addEventListener("click", resetGame);
