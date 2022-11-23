'use strict'
const MINE = `<img src="image/mine.png" alt="mine">`
const ONE = `<img src="image/1.png" alt="mine">`
const TWO = `<img src="image/2.png" alt="mine">`
const TREE = `<img src="image/3.png" alt="mine">`
const FLAG = `<img src="image/flag.png" alt="mine">`
const EMPTY = `<img style=" width: 40px; height: 40px;" src="image/empty.png" alt="mine">`

var reset = false
var leftClick = true
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2,
    levelPassed: false,
    isTimerOn: false
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

//!.....................................................





//todo initGame
function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    setMines(gBoard, gLevel.MINES)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.log(gBoard)
}


//!done buildBoard() 
function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false,
                isChecked: false
            }
        }
    }
    return board
}

function setMines(board, mines) {
    for (var i = 0; i < mines; i++) {
        var col = getRandomIntInclusive(0, board.length - 1)
        var row = getRandomIntInclusive(0, board.length - 1)
        board[col][row].isMine = true
    }
    document.querySelector('.mines').innerText = (gLevel.MINES > 10) ? gLevel.MINES : '0' + gLevel.MINES
}


//todo setMinesNegsCount(board) 
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                for (var x = i - 1; x <= i + 1; x++) {
                    for (var y = j - 1; y <= j + 1; y++) {
                        if (x < 0 || y < 0 || x > gBoard.length - 1 || y > gBoard.length - 1) continue
                        if (x === i && y === j) continue
                        gBoard[x][y].minesAroundCount++
                    }
                }
            }
        }
    }
}


//todo renderBoard(board) 
function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `\t<td  class="cell hiden i-${i}j-${j}"  onclick="cellClicked(this,${i},${j})" oncontextmenu="rightClick(this,event,${i},${j})">  </td>\n `

        }

        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}


//todo cellClicked(elCell, i, j) 
function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (!gLevel.isTimerOn) {
        startTimer()
        gLevel.isTimerOn = true
    }

    if (currCell.isMine) {
        renderCell(elCell, MINE)
        console.log('mine!')
    } else {
        renderAcordingToNumberOfMines(currCell,elCell,i,j)
    }

}
function rightClick(elCell, ev, i, j) {
    ev.preventDefault();
    if (!gBoard[i][j].isMarked) {
        renderCell(elCell, FLAG)
         
    } else {
        renderCell(elCell, "")
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    return false
}
function renderAcordingToNumberOfMines(currCell, elCell, i, j) {
    switch (currCell.minesAroundCount) {
        case 1:
            renderCell(elCell, ONE)
            break;
        case 2:
            renderCell(elCell, TWO)
            break
        case 3:
            renderCell(elCell, TREE)
            break
        default:
            expandShown(gBoard, elCell, i, j)
    }
}



//todo checkGameOver()
function checkGameOver() {


}

//todo expandShown(board, elCell,i, j)
function expandShown(board, elCell, i, j) {
    board[i][j].isChecked = true
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x < 0 || y < 0 || x > gBoard.length - 1 || y > gBoard.length - 1) continue
            if (board[x][y].isChecked || x === i && y === j) continue
            if (!board[x][y].isMine) {
                var currElCell = document.querySelector(`.i-${x}j-${y}`)
                renderAcordingToNumberOfMines(board[x][y], currElCell, x, y)
            }
        }
    }
    renderCell(elCell, "")
}

//console.log(startTimer())
function selectLevel(num) {
    gLevel.SIZE = num
    switch (num) {
        case 4:
            gLevel.MINES = 2
            break
        case 8:
            gLevel.MINES = 8
            break
        case 12:
            gLevel.MINES = 32
            break

    }
    gBoard = buildBoard(gLevel.SIZE)
    setMines(gBoard, gLevel.MINES)
    UpDateMinesAroundKey(gBoard)
    renderBoard(gBoard)
}


function renderCell(elCell, symbol) {
    elCell.innerHTML = symbol
    elCell.style.backgroundColor = 'silver'
    elCell.style.border = 'none'
}



function UpDateMinesAroundKey(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            minesAround(i, j)
        }
    }
}


function minesAround(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i < (rowIdx + 1); i++) {
        for (var j = colIdx - 1; j < colIdx + 1; j++) {
            if (i < 0 || j < 0 || i > gBoard.length || j > gBoard.length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isMine) {
                gBoard[rowIdx][colIdx].minesAroundCount++
            }
        }
    }
}

