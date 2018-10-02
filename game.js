let turn;
let playerCount;
let player1Piece;
let player2Piece;
let boardRows;
let boardColumns;
let placeInWinningCombo;
let gameOver;
let board = {};
let gameName = "";
let needToWin = {
    "tictactoe": 3,
    "connectfour": 4
}
let DOMgameBoard = document.getElementById("gameboard");
let DOMscoreBoard = document.getElementById("scoreboard");

document.getElementById("startTicTacToe").addEventListener("click", () => startGame("tictactoe"));
document.getElementById("startConnectFour").addEventListener("click", () => startGame("connectfour"));

function clearBoard() {
    DOMgameBoard.innerHTML = "";
}
function startGame(game) {
    gameName = game;
    gameOver = false;
    switch(game) {
        case "tictactoe":
        boardColumns = 3;
        boardRows = 3;
        player1Piece = "<span>X</span>"
        player2Piece = "<span>O</span>"
        playerCount = 2;
        break;
        case "connectfour":
        boardColumns = 7;
        boardRows = 6;
        player1Piece = "<span style=\"color: #ff0000\">@</span>"
        player2Piece = "<span style=\"color: #000000\">@</span>"
        playerCount = 2;
        break;
        default:
    }
    drawBoard(boardRows, boardColumns);
    DOMscoreBoard.innerHTML = `Player 1: ${player1Piece} - Player 2: ${player2Piece}`
    turn = 1;
    initBoardEventListeners();
}

function drawBoard(rows, columns) {
    clearBoard();
    for (let r = 1; r <= rows; r++) {
    for(let c = 1; c <= columns; c++) {
        DOMgameBoard.innerHTML+= `<div id="r${r}c${c}" class="board-cell"><span class="piece" style="color: #ffffff">_</span></div>`
        board[`r${r}c${c}`] = 0;
        if (c === columns) { DOMgameBoard.innerHTML+= "<br>"}
        }
    }
}

function initBoardEventListeners() {
    for (let r = 1; r <= boardRows; r++) {
        for(let c = 1; c <= boardColumns; c++) {
            document.getElementById(`r${r}c${c}`).addEventListener("click", () => {
                placePiece(eval(r), eval(c), turn, gameName);
            });
            }
        }
}

function changeTurn(currentTurn) {
    if (currentTurn < playerCount) { turn++ } else { turn = 1}
}
function placePiece(row, column, player, game) {
    if (gameOver === true) { return }
    let piece;
    let openSpotFound = false;
    switch(game) {
        case "tictactoe":
        if (board[`r${row}c${column}`] != 0) { alert("spot already taken") }
        else { openSpotFound = true }
        break;
        case "connectfour":
        for (let i = boardRows; i > 0; i--) {
            if (board[`r${i}c${column}`] == 0 && openSpotFound != true) { 
                row = i; 
                openSpotFound = true;
            }
        }
        default:
    }
    switch (player) {
        case 1:
        piece = player1Piece;
        break;
        case 2:
        piece = player2Piece;
        break;
    }
    if (openSpotFound === true) {
        board[`r${row}c${column}`] = turn;
        document.getElementById(`r${row}c${column}`).innerHTML = `<span class="piece">${piece}</span>`;
        checkForWin(row, column);
        changeTurn(turn);
    }
}

function checkForWin(row, column) {
    let evalSet;
    let waysToWin = ["horizontal", "vertical", "diagonal left", "diagonal right"];

    for (let i = 0; i < needToWin[gameName]; i++) {
        placeInWinningCombo = i + 1;
        for(let j = 0; j < waysToWin.length; j++) {
            evalSet = new Set;
            evalSet.add(board[`r${row}c${column}`]);
            for (let r = 1; r <= (needToWin[gameName] - placeInWinningCombo); r++) {
                switch(waysToWin[j]) {
                    case "horizontal":
                    evalSet.add(board[`r${row}c${column+r}`]);
                    break;
                    case "vertical":
                    evalSet.add(board[`r${row+r}c${column}`]);
                    break;
                    case "diagonal left":
                    evalSet.add(board[`r${row-r}c${column-r}`]);
                    break;
                    case "diagonal right":
                    evalSet.add(board[`r${row-r}c${column+r}`]);
                    break;
                }
            }
            for (let l = 1; l <= (placeInWinningCombo - 1); l++) {
                switch(waysToWin[j]) {
                    case "horizontal":
                    evalSet.add(board[`r${row}c${column-l}`]);
                    break;
                    case "vertical":
                    evalSet.add(board[`r${row-l}c${column}`]);
                    break;
                    case "diagonal left":
                    evalSet.add(board[`r${row+l}c${column+l}`]);
                    break;
                    case "diagonal right":
                    evalSet.add(board[`r${row+l}c${column-l}`]);
                    break;
                }
            }
            if (evalSet.size === 1) { 
                console.log("WINNER!");
                DOMscoreBoard.innerHTML = `Player ${turn} wins!`;
                gameOver = true; 
            }
        }
    }
}
    //     ORIGINAL (WET) WIN LOGIC BEFORE REFACTORING:

    //     //horizontal
    //     evalHoriz = new Set;
    //     evalHoriz.add(board[`r${row}c${column}`]);
        
    //     for (let r = 1; r <= (needToWin[gameName] - placeInWinningCombo); r++) {
    //         evalHoriz.add(board[`r${row}c${column+r}`]);
    //     }
    //     for (let l = 1; l <= (placeInWinningCombo - 1); l++) {
    //         evalHoriz.add(board[`r${row}c${column-l}`]);
    //     }
    //     if (evalHoriz.size === 1) { console.log("WINNER! (by horizontal)") }

    //     //vertical
    //     evalVert = new Set;
    //     evalVert.add(board[`r${row}c${column}`]);
        
    //     for (let r = 1; r <= (needToWin[gameName] - placeInWinningCombo); r++) {
    //         evalVert.add(board[`r${row+r}c${column}`]);
    //     }
    //     for (let l = 1; l <= (placeInWinningCombo - 1); l++) {
    //         evalVert.add(board[`r${row-l}c${column}`]);
    //     }
    //     if (evalVert.size === 1) { console.log("WINNER! (by vertical)") }

    //     //diagonal left
    //     evalDiagLeft = new Set;
    //     evalDiagLeft.add(board[`r${row}c${column}`]);
        
    //     for (let r = 1; r <= (needToWin[gameName] - placeInWinningCombo); r++) {
    //         evalDiagLeft.add(board[`r${row-r}c${column-r}`]);
    //     }
    //     for (let l = 1; l <= (placeInWinningCombo - 1); l++) {
    //         evalDiagLeft.add(board[`r${row+l}c${column+l}`]);
    //     }
    //     if (evalDiagLeft.size === 1) { console.log("WINNER! (by diagonal left)") }

    //     //diagonal right
    //     evalDiagRight = new Set;
    //     evalDiagRight.add(board[`r${row}c${column}`]);
        
    //     for (let r = 1; r <= (needToWin[gameName] - placeInWinningCombo); r++) {
    //         evalDiagRight.add(board[`r${row-r}c${column+r}`]);
    //     }
    //     for (let l = 1; l <= (placeInWinningCombo - 1); l++) {
    //         evalDiagRight.add(board[`r${row+l}c${column-l}`]);
    //     }
    //     if (evalDiagRight.size === 1) { console.log("WINNER! (by diagonal right)") }
    //     if (evalHoriz.size === 1 ||
    //         evalVert.size === 1 ||
    //         evalDiagLeft.size === 1 ||
    //         evalDiagRight.size === 1) {
    //             DOMscoreBoard.innerHTML = `Player ${turn} wins!`;
    //             gameOver = true;
    //         }
    //     }
    // }