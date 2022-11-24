'use strict'
const MINE = `<img src="image/mine.png" alt="mine">`
const ONE = `<img src="image/1.png" alt="mine">`
const TWO = `<img src="image/2.png" alt="mine">`
const TREE = `<img src="image/3.png" alt="mine">`
const FOUR = `<img src="image/4.png" alt="mine">`
const FIVE = `<img src="image/5.png" alt="mine">`
const SIX = `<img src="image/6.png" alt="mine">`
const SEVEN = `<img src="image/7.png" alt="mine">`
const EIGHT = `<img src="image/8.png" alt="mine">`
const FLAG = `<img style="background-color: gainsboro;" src="image/flag.png" alt="mine">`

var reset = false
var leftClick = true
var gBoard
var gFirstCell = true

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
    secsPassed: 0,
    lives: 3
}

//!.....................................................






function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
}


function restart() {
    reset = false
    leftClick = true
    gBoard
    gFirstCell = true
    gLevel = {
        SIZE: 4,
        MINES: 2,
        levelPassed: false,
        isTimerOn: false
    }
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3
    }

    document.querySelector('.status').innerHTML = '<img src="image/normal.png" alt="status"></img>'
    document.querySelector('.lives').innerText = '❤️❤️❤️'
    document.querySelector('.lives').classList.remove('game-over')
    document.querySelector('table').style.display = 'table'
    document.querySelector('.timer').innerText = '00:00'


    initGame()

}

function buildBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isChecked: false
            }
        }
    }
    return board
}

function setMines(board, mines, rowIdx, colIdx) {
    for (var i = 0; i < mines; i++) {
        var col = getRandomIntInclusive(0, board.length - 1)
        var row = getRandomIntInclusive(0, board.length - 1)
        if (rowIdx == row && colIdx == col ||  board[row][col].isMine) { //ignore first cell and a cell that is already a mine
            i--
        }
        else {
            board[row][col].isMine = true
        }
    }
    document.querySelector('.mines').innerText = (gLevel.MINES > 10) ? gLevel.MINES : '0' + gLevel.MINES
}

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

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `\t<td  class="cell hiden fancy i-${i}j-${j}"  onclick="cellClicked(this,${i},${j})" oncontextmenu="flagToggle(this,event,${i},${j})">  </td>\n `

        }

        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    new Audio('sound/step.wav').play()
    if (gGame.lives === 0) return
    if (gFirstCell) {
        renderCell(elCell, "", true)
        setMines(gBoard, gLevel.MINES, i, j)
        setMinesNegsCount(gBoard)
        gFirstCell = false
    }
    var currCell = gBoard[i][j]
    if (!gLevel.isTimerOn) {
        startTimer()
        gLevel.isTimerOn = true
    }

    if (currCell.isMine) {
        renderCell(elCell, MINE, true)
        gGame.lives--
        checkGameOver()
    } else {
        renderAcordingToNumberOfMines(currCell, elCell, i, j)
        checkLevelVictory()
    }

}

function flagToggle(elCell, ev, i, j) {
    ev.preventDefault();
    if (!gLevel.isTimerOn) {
        startTimer()
        gLevel.isTimerOn = true
    }
    if (!gBoard[i][j].isMarked) {
        renderCell(elCell, FLAG, false)
        if (gBoard[i][j].isMine) {
            gGame.markedCount++
            checkLevelVictory()
        }
    } else {
        renderCell(elCell, "", false)
        if (gBoard[i][j].isMine) {
            gGame.markedCount--
        }
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    return false
}

function renderAcordingToNumberOfMines(currCell, elCell, i, j) {
    switch (currCell.minesAroundCount) {
        case 1:
            renderCell(elCell, ONE, true)
            break;
        case 2:
            renderCell(elCell, TWO, true)
            break
        case 3:
            renderCell(elCell, TREE, true)
            break
        case 4:
            renderCell(elCell, FOUR, true)
            break
        case 5:
            renderCell(elCell, FIVE, true)
            break
        case 6:
            renderCell(elCell, SIX, true)
            break
        case 7:
            renderCell(elCell, SEVEN, true)
            break
        case 8:
            renderCell(elCell, EIGHT, true)
            break
        default:
            expandShown(gBoard, elCell, i, j)
    }
    if (!currCell.isShown) {
        currCell.isShown = true
        gGame.shownCount++
    }
}

function checkGameOver() {
    var strHTML = ''
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += '❤️'
    }
    if (gGame.lives === 2) {
        document.querySelector('.status').innerHTML = '<img src="image/hited.png" alt="status"></img>'
    }

    var elLives = document.querySelector('.lives')
    elLives.innerText = strHTML
    if (gGame.lives === 0) {
        new Audio('sound/lose.wav').play()
        document.querySelector('.status').innerHTML = '<img src="image/lose.png" alt="status"></img>'
        gLevel.isTimerOn = false
        document.querySelector('table').style.display = 'none'
        elLives.classList.add('game-over')
        elLives.innerHTML = 'Game Over!'
    }
}

function checkLevelVictory() {
    if (gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        gLevel.isTimerOn = false
        new Audio('sound/win.wav').play()
        document.querySelector('.status').innerHTML = '<img src="image/win.png" alt="status"></img>'
    }
}

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
    renderCell(elCell, "", true)
}

function selectLevel(num) {
    gLevel.SIZE = num
    switch (num) {
        case 4:
            gLevel.MINES = 2
            break
        case 8:
            gLevel.MINES = 14
            break
        case 12:
            gLevel.MINES = 32
            break

    }
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
}

function renderCell(elCell, symbol, showContent) {
    elCell.innerHTML = symbol
    if (showContent) {
        elCell.style.backgroundColor = 'silver'
        elCell.style.border = 'none'
        elCell.style.width = '34px'
        elCell.style.height = '34px'
    }
}


