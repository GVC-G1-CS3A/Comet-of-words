var debugFlag = false;
var debugDrawFlag = false;

var asteroid1 = new Image(25, 25);
var asteroid2 = new Image(25, 25);
var asteroid3 = new Image(25, 25);
var asteroid4 = new Image(25, 25);
var asteroid5 = new Image(25, 25);
var asteroid6 = new Image(25, 25);

asteroid1.src = "./images/asteroid-1.png";
asteroid2.src = "./images/asteroid-2.png";
asteroid3.src = "./images/asteroid-3.png";
asteroid4.src = "./images/asteroid-4.png";
asteroid5.src = "./images/asteroid-5.png";
asteroid6.src = "./images/asteroid-6.png";

//DOM ELEMENTS
const start_play = document.getElementById("start_play");
const scoreElementID = document.getElementById('Score');
const scoreElementClass = document.getElementsByClassName('score');
const pointingElementID = document.getElementById('Pointing');
const pointingElementClass = document.getElementsByClassName('pointing');
const inputElementID = document.getElementById('InputWord');
const livesLeft = document.getElementById('Lives');

function debugLog() {
    console.log("Debug Logged!");
}

function setupCanvas() {
    var canvas = document.getElementById("canvas");
    return canvas;
}

function gameController(canvas) {
    this.gameRunning = true;
    this.canvas = canvas;
    this.wpm = 30;
    this.wordContainer = []; //format of wordObj {text: 'fat', value: 3, x: 596, y: 30, speed: 1}
    this.wordTextContainer = []; //text only
    this.currentWord = '';
    //this.buffer = '';
    this.score = 0;
    this.health = 5;
    this.clears = 0;
    this.clearChance = 5;
    this.modChance = 5;
    this.scoreMultiplier = 1;
}

function wordObj(text, x, y) {
    this.text = text;
    this.value = text.length;
    this.x = x;
    this.y = y;
    this.speed = (Math.random() * (controller.score / 100)) + 1; //Using globals again... (Laziness > desire for good practice) : True
}

gameController.prototype.addWord = function () {
    if (this == window) {
        var that = controller; //SUPER HOKEY way to avoid setTimeout from using global window context...
    } else {
        var that = this;
    }

    var timeUntilNextWord = ((60 / that.wpm) * 1000)


    var lengthOfArr = fullWordListArr.length;
    var text = fullWordListArr[Math.floor(Math.random() * lengthOfArr)]; //Grab a random word from wordlist in words.js

    var x = Math.floor(Math.random() * (that.canvas.width - 300)); //Grab random x coordinate within canvas

    var word = new wordObj(text.toLowerCase(), x, 30);

    that.wordContainer.push(word); //format of wordObj {text: 'fat', value: 3, x: 596, y: 30, speed: 1}
    that.wordTextContainer.push(word.text); //push ONLY the text properties of the object
    //console.log(that.wordTextContainer.toString());

    //Override time if not special
    timeUntilNextWord = ((60 / that.wpm) * 1000) + (100 * word.text.length); //In milliseconds, so 60 seconds / words per minute, * 1000 milliseconds/sec

    if (that.gameRunning) {
        window.setTimeout(that.addWord, timeUntilNextWord); //Break our timer if game is over
    }

    if (debugFlag) { console.log("Pushing word: " + word.text + " to gameController.") }
    return word;
}

/* -------------- Game Logic ---------------- */

//Main program loop
function mainLoop() {
    requestAnimationFrame(mainLoop);
    now = Date.now();
    elapsed = now - then; // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        4
        // Get ready for next frame by setting then=now, but also adjust for 
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        updatePositions(controller); //Update all word locations!
        draw(controller); //Draw to the screen!
        if (controller.health <= 0) { gameOver(); } //Run game over if health is 0

        if (controller.gameRunning) {
            requestAnimationFrame(mainLoop); //Loop again when browser is ready. 60FPS if possible
            start_play.innerText = "";
        }
    }
}

function updatePositions(gameController) {
    var wordsArr = gameController.wordContainer;
    var wordsArrText = gameController.wordTextContainer;
    var multiplier = 1.0;

    for (var i = 0; i < wordsArr.length; i++) {
        var currentWord = wordsArr[i];
        if (currentWord === undefined) { //Catch errors
            return;
        }

        currentWord.y += currentWord.speed * multiplier;

        // word if it reaches the bottom
        if (currentWord.y >= gameController.canvas.height - 10) {
            gameController.health -= 1;
            wordsArr.splice(i, 1);
            wordsArrText.splice(i, 1);
            if (currentWord.text.startsWith(gameController.buffer)) { gameController.buffer = ''; } //Only reset buffer if it is current word
            // Decrease Life
            if (gameController.health >= 0) {   lives(gameController.health);   }
        }
    }
}

function draw(gameController) {
    var canvas = gameController.canvas;
    clear(canvas, '#111111'); //Clear the canvas

    var ctx = canvas.getContext('2d');
    ctx.font = "30px Arial";
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = 'white';

    var wordsArr = gameController.wordContainer;
    for (var i = 0; i < wordsArr.length; i++) {
        var currentWord = wordsArr[i];
        if (currentWord === undefined) { //Catch errors
            return;
        }
        var text = currentWord.text;

        ctx.strokeText(currentWord.text, currentWord.x, currentWord.y);

        if (currentWord.text.startsWith(gameController.buffer)) { //Fill characters of words matching buffer...
            ctx.fillText(gameController.buffer, currentWord.x, currentWord.y);
        }

        if (debugDrawFlag) {
            console.log("Drawing " + currentWord.text + " @ " + currentWord.x + " , " + currentWord.y)
        }

    }

    ctx.fillStyle = "#111111"; //Set back for clearing screen? Doesn't work if we dont do this...
    if (debugDrawFlag) { console.log("Draw Complete.") }

}

function updateScore(wordLength, status) {
    const addPoints = [3, 4, 5];
    const lossPoints = [1, 2, 3];

    if (wordLength >= 1 && wordLength <= 4) {
        index = 0;
    } else if (wordLength >= 5 && wordLength <= 8) {
        index = 1;
    } else {
        index = 2;
    }
    console.log(wordLength);
    var pointingStatus;
    //0=incorrect, 1=correct
    if (status == 1) {
        controller.score += addPoints[index];
        //console.log('Wordlength: ' + wordLength + ' = Add ' + addPoints[index] + ' pts');
        console.log('Add ' + addPoints[index]);
        pointingStatus = `+${addPoints[index]} points`;
    } else {
        controller.score -= lossPoints[index];
        //console.log('Wordlength: ' + wordLength + ' = Loss ' + lossPoints[index] + ' pts');
        console.log('Loss ' + lossPoints[index]);
        pointingStatus = `-${lossPoints[index]} points`;
    }

    pointingElementID.innerHTML = `<p>${pointingStatus}</p>`;
    scoreElementID.innerHTML = `<p>Score: ${controller.score}</p>`;
}

function lives(livesLeft) {
    document.getElementById(`heart-` + `${livesLeft}`).remove();
}

function gameOver() {
    clear(controller.canvas, '#111111');
    var canvas = controller.canvas;
    clear(canvas, '#111111'); //Clear the canvas

    var ctx = canvas.getContext('2d');
    ctx.font = "50px Arial";
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#BBBBBB';

    var xCenter = (canvas.width / 2) - 50;
    var yCenter = canvas.height / 2;
    ctx.fillText("Game Over!", xCenter, yCenter)
    ctx.fillText("Press <Spacebar> to continue", xCenter - 250, yCenter + 150)

    controller.gameRunning = false;

}

function resetGame() {
    controller = new gameController(canvas);

    setTimeout(controller.addWord, 1000);
    requestAnimationFrame(mainLoop);

    var temp = document.getElementsByClassName("menu-text");
    for (var i = 0; i < temp.length; i++) {
        temp[i].className = "menu-text text-center fadeOut";
    }
}


/* =========== Start of Code ==================*/
var fps, fpsInterval, startTime, now, then, elapsed;
fps = 60;
var canvas = setupCanvas();
var controller = new gameController(canvas);
controller.gameRunning = false;

fpsInterval = 1000 / fps;
then = Date.now();
startTime = then;

mainLoop();

function clear(canvas, fillstyle) {
    var ctx = canvas.getContext("2d");
    ctx.fillstyle = fillstyle;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


document.onkeypress = function (evt) { // This function will run when any k ey is pressed!
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);

    if (debugFlag) { console.log("Key pressed: " + charStr); }

    addKeyToBuffer(charStr);

    if ((!controller.gameRunning) && charCode == 32) { //spacebar
        resetGame();
    }

    if ((controller.gameRunning) && charCode == 32 && controller.clears > 0) { //spacebar
        useClear(controller);
    }

    if (evt.keyCode == 13) { //ENTER key
        getWord();
    }
};

function getWord() {
    var inputValue = inputElementID.value.toLowerCase();

    var wordsArrText = controller.wordTextContainer;
    var wordsArr = controller.wordContainer;

    console.log(JSON.stringify(wordsArrText));
    console.log(JSON.stringify(wordsArr));

    var pos = wordsArr.findIndex(i => i.text === inputValue);

    if (wordsArrText.includes(inputValue.trim())) { // If complete buffer word found in array
        wordsArrText.splice(wordsArrText.indexOf(inputValue), 1);
        wordsArr.splice(pos, 1);

        updateScore(inputValue.length, 1);
        inputElementID.value = '';
        return;
    } else {
        inputElementID.value = '';
        updateScore(inputValue.length, 0);
        return;
    }
}

function addKeyToBuffer(char) {
    var wordsArr = controller.wordContainer;
    for (var i = 0; i < wordsArr.length; i++) {
        var currentWord = wordsArr[i];
        if (currentWord.text.startsWith(controller.buffer + char)) { //If we drop in here, we have found a matching word to the buffer
            controller.buffer += char;
            if (debugFlag) { console.log("Adding: " + char + " to the buffer. Buffer now: " + controller.buffer); }
            return controller.buffer;
        }
    }

    if (debugFlag) { console.log("Not adding: " + char + " to the buffer;"); }
}