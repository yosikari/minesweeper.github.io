'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}
// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    //console.log('elCell', elCell);
    elCell.innerHTML = value
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        // Swap
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function startTimer() {
    var counter = setInterval(timer, 1); //1000 will  run it every 1 second
    var date = Date.now();
    function timer() {
        var delta = Date.now() - date;
        var ms = delta % 1000
        var s = Math.floor(delta / 1000)
        var sc = s % 60
        var min = Math.floor((s / 60))
        if (reset) {
            min = 0
            sc = 0
            ms = 0
        }
        var elTimer = document.querySelector('.timer')
        elTimer.innerHTML = (min > 9 ? '' : '0') + min + ':' + (sc > 9 ? '' : '0') + sc
        if (gLevel.levelPassed || reset) {
            clearInterval(counter);
            reset = false
        }
    }
}