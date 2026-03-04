const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const levelSelect = document.getElementById("level");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = "easy";

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});

levelSelect.addEventListener("change", (e) => {
    difficulty = e.target.value;
    restartGame();
});

function handleClick() {
    const index = this.dataset.index;

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, "X");

    if (gameActive) {
        setTimeout(aiMove, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    checkWinner();
}

function aiMove() {
    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } 
    else if (difficulty === "medium") {
        move = Math.random() < 0.5 ? randomMove() : bestMove();
    } 
    else {
        move = bestMove();
    }

    if (move !== undefined) {
        makeMove(move, "O");
    }
}

function randomMove() {
    const emptyCells = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (emptyCells.length === 0) return;

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = evaluateBoard();
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function evaluateBoard() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === "O" ? 1 : -1;
        }
    }

    if (!board.includes("")) return 0;
    return null;
}

function checkWinner() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusText.textContent = board[a] + " Wins!";
            gameActive = false;
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "";
    cells.forEach(cell => cell.textContent = "");
        }
