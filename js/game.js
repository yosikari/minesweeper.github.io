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
    minesLeft: 2,
    levelPassed: false,
    isTimerOn: false,
    currLvl: 0
}

var gGame = {
    isOn: false,
    isDarkMode: false,
    isSoundOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isHint: false,
    numOfHints: 3,
    numberOfSafeClicks: 3
}

//!.....................................................



function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard)
    var elBestScoreValue = document.querySelector('.best-score-vaule')
    switch (gLevel.currLvl) {
        case 0:
            if (localStorage.bestScoreLow) {
                elBestScoreValue.innerText = localStorage.bestScoreLow
            }
            break

        case 1:
            if (localStorage.bestScoreMed) {
                elBestScoreValue.innerText = localStorage.bestScoreMed
            }
            else {
                elBestScoreValue.innerText = "______"
            }
            break
        case 2:
            if (localStorage.bestScoreHigh) {
                elBestScoreValue.innerText = localStorage.bestScoreHigh
            }
            else {
                elBestScoreValue.innerText = "______"
            }
            break
    }
}

function restart(currLvl, size, mines) {
    reset = false
    leftClick = true
    gBoard
    gFirstCell = true
    if (currLvl === undefined) {
        size = gLevel.SIZE
        mines = gLevel.MINES
        currLvl = gLevel.currLvl
    }
    gLevel = {
        SIZE: size,
        MINES: mines,
        minesLeft: mines,
        levelPassed: false,
        isTimerOn: false,
        currLvl: currLvl
    }
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        isHint: false,
        numOfHints: 3,
        numberOfSafeClicks: 3
    }

    document.querySelector('.status').innerHTML = '<img src="image/normal.png" alt="status"></img>'
    document.querySelector('.lives').innerText = '❤️❤️❤️'
    document.querySelector('.lives').classList.remove('game-over')
    document.querySelector('footer').style.marginTop = 'auto'
    document.querySelector('table').style.display = 'table'
    document.querySelector('.timer').innerText = '00:00'
    document.querySelector('.mines').innerText = (mines > 10) ? mines : '0' + mines
    document.querySelector('.hint').style.display = 'block'
    document.querySelector('.hint button').innerText = '💡💡💡'
    document.querySelector('.safe-click').style.display = 'block'
    document.querySelector('.safe-click button').innerText = '🔍🔍🔍'
    
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
        if (rowIdx == row && colIdx == col || board[row][col].isMine) { //ignore first cell and a cell that is already a mine
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
            strHTML += `\t<td  class="cell hiden fancy i-${i}j-${j}"  onclick="cellClicked(this,${i},${j})" oncontextmenu="toggleFlag(this,event,${i},${j})">  </td>\n `

        }

        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {
    if (gBoard[i][j].isShown) {
        elCell.style.cursor = "not-allowed"
        return
    }
    if (gGame.isSoundOn) {
        playSound(i, j)
    }
    if (gGame.lives === 0) return

    if (gGame.isHint) {
        handleHint(i, j)
        return
    }
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
    renderAccordingToType(currCell, elCell, i, j, false)
    checkLevelVictory()
}

function toggleFlag(elCell, ev, i, j) {
    if (ev) {
        ev.preventDefault();
    }
    if (!gLevel.isTimerOn) {
        startTimer()
        gLevel.isTimerOn = true
    }
    if (gBoard[i][j].isShown) {
        elCell.style.cursor = "not-allowed"
        return
    }
    if (gLevel.minesLeft === 0 && !gBoard[i][j].isMarked) {
        return
    }
    if (!gBoard[i][j].isMarked) {
        renderCell(elCell, FLAG, false)
        if (gBoard[i][j].isMine) {
            gGame.markedCount++
            checkLevelVictory()
        }
        gLevel.minesLeft--
    } else {
        renderCell(elCell, "", false)
        if (gBoard[i][j].isMine) {
            gGame.markedCount--
        }
        gLevel.minesLeft++
    }
    document.querySelector('.mines').innerText = gLevel.minesLeft;
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    return false
}

function renderAccordingToType(currCell, elCell, i, j, isHint) {
    if (currCell.isMarked) {
        toggleFlag(elCell, null, i, j, isHint)
    }
    if (currCell.isMine) {
        renderCell(elCell, MINE, true)
        if (!isHint) {
            gGame.markedCount++
            gLevel.minesLeft--
            document.querySelector('.mines').innerText = gLevel.minesLeft;
            gGame.lives--
            checkGameOver()
            currCell.isShown = true
        }
    } else {
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
                if (!isHint) {
                    expandShown(gBoard, elCell, i, j)
                }
                else { //open just the current cell for a hint
                    renderCell(elCell, "", true)
                }
        }

    }
    if (!currCell.isShown && !isHint) {
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
        if (gGame.isSoundOn) {
            new Audio('sound/lose.wav').play()
        }
        document.querySelector('.status').innerHTML = '<img src="image/lose.png" alt="status"></img>'
        gLevel.isTimerOn = false
        document.querySelector('table').style.display = 'none'
        elLives.classList.add('game-over')
        elLives.innerHTML = `Game Over!`
        document.querySelector('footer').style.marginTop = '170px'
        document.querySelector('.hint').style.display = 'none'
        document.querySelector('.safe-click').style.display = 'none'

    }
}

function checkLevelVictory() {
    var currScore = document.querySelector('.timer').innerText
    if (gGame.markedCount === gLevel.MINES &&
        gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {

        if (gLevel.currLvl === 0 &&
            (localStorage.bestScoreLow === undefined || currScore < localStorage.bestScoreLow)) {
            localStorage.setItem("bestScoreLow", currScore)
        }
        else if (gLevel.currLvl === 1 &&
            (localStorage.bestScoreMed === undefined || currScore < localStorage.bestScoreMed)) {
            localStorage.setItem("bestScoreMed", currScore)
        }
        else if (gLevel.currLvl === 2 && (localStorage.bestScoreHigh === undefined || currScore < localStorage.bestScoreHigh)) {
            localStorage.setItem("bestScoreHigh", currScore)
        }
        gLevel.isTimerOn = false
        if (gGame.isSoundOn) {
            new Audio('sound/win.wav').play()
        }
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
                renderAccordingToType(board[x][y], currElCell, x, y, false)
            }
        }
    }
    renderCell(elCell, "", true)
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

function renderClosedCell(elCell) {
    elCell.innerHTML = ""
    elCell.style.backgroundColor = 'gainsboro'
    elCell.style.borderTop = '3px solid white'
    elCell.style.borderLeft = '3px solid white'
    elCell.style.borderRight = '3px solid rgb(124, 124, 124)'
    elCell.style.borderBottom = '3px solid rgb(124, 124, 124)'
    elCell.style.width = '28px'
    elCell.style.height = '29px'
}

function hint(elHint) {
    if (!gFirstCell && gGame.numOfHints > 0) {
        gGame.isHint = true
        gGame.numOfHints--
        var strHtml = ''
        for (var i = 0; i < gGame.numOfHints; i++) {
            strHtml += '💡'
        }
        elHint.innerText = strHtml
    }
}

function getNotReviledNeighbors(i, j) {
    var NBHs = []
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x < 0 || y < 0 || x > gBoard.length - 1 || y > gBoard.length - 1) continue
            if (gBoard[x][y].isShown) continue
            var currElCell = document.querySelector(`.i-${x}j-${y}`)
            NBHs.push({ elCell: currElCell, location: { i: x, j: y } })
        }
    }
    return NBHs
}

function getNotReviledSafeCell(element) {
    if (gGame.numberOfSafeClicks > 0) {
        var safeCellsArr = []
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isShown || gBoard[i][j].isMine) continue
                safeCellsArr.push({ i, j })
            }
        }
        if (safeCellsArr.length > 0) {
            shuffle(safeCellsArr)
            var safeCell = safeCellsArr.pop()
            var safeELCell = document.querySelector(`.i-${safeCell.i}j-${safeCell.j}`)
            safeELCell.innerText = '🔍'
            gGame.numberOfSafeClicks--
            var strHtml = ''
            for (var i = 0; i < gGame.numberOfSafeClicks; i++) {
                strHtml += '🔍'
            }
            element.innerText = strHtml

            setTimeout(() => {
                if (!gBoard[safeCell.i][safeCell.j].isShown)
                    safeELCell.innerText = ''
            }, 1000)
        }
    }
}

function handleHint(i, j) {
    var noShownNBHs = getNotReviledNeighbors(i, j)
    for (var i = 0; i < noShownNBHs.length; i++) {
        var x = noShownNBHs[i].location.i
        var y = noShownNBHs[i].location.j
        renderAccordingToType(gBoard[x][y], noShownNBHs[i].elCell, x, y, true)
    }
    setTimeout(() => {
        for (var i = 0; i < noShownNBHs.length; i++) {
            renderClosedCell(noShownNBHs[i].elCell)
        }
    }, 1000)
    gGame.isHint = false
}

function playSound(i, j) {
    if (!gBoard[i][j].isMine) {
        new Audio('sound/step.wav').play()
    } else if (gGame.lives !== 1 && !gGame.isHint) {
        new Audio('sound/mine.wav').play()
    }
}

function toggleDarkMode(elBtn) {
    if (gGame.isDarkMode) {
        // return normal mode
        elBtn.innerText = '🌙'
        document.querySelector('body').style.backgroundImage = 'url("../image/background.jpg")'
        document.querySelector('body').style.opacity = '1.0'
        document.querySelector('.page-body').style.backgroundColor = 'rgb(187, 187, 187)'
        document.querySelector('.page-body').style.color = 'rgb(0,0,0)'
    } else {
        // return d.mode
        elBtn.innerText = '☀️'
        document.querySelector('body').style.backgroundImage = 'url("../image/darkModeBackground.jpg")'
        document.querySelector('body').style.opacity = '0.8'
        document.querySelector('.page-body').style.backgroundColor = 'rgb(27, 27, 27)'
        document.querySelector('.page-body').style.color = 'whitesmoke'
    }
    gGame.isDarkMode = !gGame.isDarkMode
}

function toggleSound(elBtn) {
    if (gGame.isSoundOn) {
        elBtn.innerText = '🔇'
    } else {
        elBtn.innerText = '🔊'
    }
    gGame.isSoundOn = !gGame.isSoundOn
}

function undo(){


    
}