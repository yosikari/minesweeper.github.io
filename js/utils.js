'use strict'


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
        var s = Math.floor(delta / 1000)
        var sc = s % 60
        var min = Math.floor((s / 60))
        var elTimer = document.querySelector('.timer')
        elTimer.innerHTML = (min > 9 ? '' : '0') + min + ':' + (sc > 9 ? '' : '0') + sc
        if (!gLevel.isTimerOn  ) {
            clearInterval(counter);
        }
    }
}