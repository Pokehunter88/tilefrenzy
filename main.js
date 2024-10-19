console.log("start");
var canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
//ctx.canvas.width  = window.innerWidth;
//ctx.canvas.height = window.innerHeight;

const scale = 2;
const sizeX = 6;
const sizeY = 10;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 400, 400);

ctx.fillStyle = "#FFD047FF";
//ctx.fillRect(0, 0, scale, scale);

var position = new Array(sizeY);

for (var k = 0; k < sizeY; k++) {
  position[k] = new Array(sizeX);
}

for (var x = 0; x < sizeX; x++) {
  for (var y = 0; y < sizeY; y++) {
    position[y][x] = Math.floor(Math.random() * 5) + 1;
  }
}

// position[3][3] = 2;
// position[4][3] = 3;
// position[4][2] = 1;
// position[5][3] = 1;

// position[3][0] = 4;
// position[4][0] = 5;

// var canvas2 = document.getElementById("pixelCanvas2");
// const ctx2 = canvas2.getContext("2d");

// ctx2.fillStyle = "black";
// ctx2.fillRect(0, 0, 400, 200);

// ctx2.fillStyle = "grey";
/*for (var x = 0; x < 80; x++) {
  for (var y = 0; y < 40; y++) {
    if (buttons[y][x] == 1) {
      ctx2.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}*/

// ctx2.fillRect(200, 0, 2, 200);

// for (var x = 0; x < 200; x++) {
//   ctx2.fillRect(x, x, 2, 2);
// }

// for (var x = 0; x < 200; x++) {
//   ctx2.fillRect(200 - x, x, 2, 2);
// }

var height = 0;
var targetX = 0;
var targetY = 1;

var running = true;
var endFrame = 1;

var pausePosition = [0, 0, 0, 0, 0, 0];
var pauseType = 0;
var pauseFrame = 0;
var pause = false;

var scoreText = document.getElementById("score");
var score = 0;

var canRestart = false;
var onTitle = true;
var starting = false;
var startingFrame = 0;

var loadedCount = 0;

function clearLine() {
  scoreAudio.play();
  scoreAudio.currentTime = 0;

  score += 3;
  scoreText.innerText = "Score: " + score;
}

async function gameOverSound() {
  gameOverAudio.play();
}

function updatePhysics() {
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      if (position[y][x] != 0) {
        if (
          y > 0 &&
          x > 1 &&
          position[y][x - 1] == position[y][x] &&
          position[y][x] == position[y][x - 2] &&
          position[y - 1][x] != 0 &&
          position[y - 1][x - 1] != 0 &&
          position[y - 1][x - 2] != 0
        ) {
          pausePosition = [x, y, x - 1, y, x - 2, y];
          pauseType = position[y][x];
          pauseFrame = 0;
          pause = true;

          position[y][x] = 0;
          position[y][x - 1] = 0;
          position[y][x - 2] = 0;

          clearLine();
        } else if (
          y > 2 &&
          position[y - 1][x] == position[y][x] &&
          position[y][x] == position[y - 2][x] &&
          position[y - 3] != 0
        ) {
          pausePosition = [x, y, x, y - 1, x, y - 2];
          pauseType = position[y][x];
          pauseFrame = 0;
          pause = true;

          position[y][x] = 0;
          position[y - 1][x] = 0;
          position[y - 2][x] = 0;

          clearLine();
        }
      }
    }
  }

  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      if (
        position[y][x] != 0 &&
        y > 0 &&
        position[y - 1][x] == 0 &&
        ((pause &&
          (pausePosition[0] != x || pausePosition[1] != y - 1) &&
          (pausePosition[2] != x || pausePosition[3] != y - 1) &&
          (pausePosition[4] != x || pausePosition[5] != y - 1)) ||
          !pause)
      ) {
        position[y - 1][x] = position[y][x];
        position[y][x] = 0;
      }
    }
  }

  if (height == -20 && targetY > 7) {
    targetY = 7;
  }

  updateLimit();

  if (height >= -18) {
    for (var x = 0; x < sizeX; x++) {
      if (position[8][x] != 0) {
        console.log("game over score: " + score);

        gameOverSound();
        song2Audio.pause();

        running = false;
        endFrame = 0;
        endCycle();
        break;
      }
    }
  }
}

function updateLimit() {
  if (height > -2) {
    height = -43;
    targetY++;

    var newPosition = new Array(sizeY);

    for (var k = 0; k < sizeY; k++) {
      newPosition[k] = new Array(sizeX);
    }

    for (var x = 0; x < sizeX; x++) {
      for (var y = 0; y < sizeY; y++) {
        newPosition[y][x] = 0;
      }
    }

    for (var x = 0; x < sizeX; x++) {
      newPosition[0][x] = Math.floor(Math.random() * 5) + 1;
      for (var y = 0; y < sizeY; y++) {
        if (position[y][x] != 0 && y < 9) {
          newPosition[y + 1][x] = position[y][x];
        }
      }
    }

    position = newPosition;
  }
}

function drawShape(shape, xPos, yPos, color, secondColor) {
  for (var x = 0; x < shape[0].length; x++) {
    for (var y = 0; y < shape.length; y++) {
      if (shape[y][x] != 0) {
        ctx.fillStyle = shape[y][x] == 1 ? color : secondColor;

        ctx.fillRect(
          x * scale + xPos,
          356 - (y * scale + yPos + height),
          scale,
          scale
        );
      }
    }
  }
}

function drawShape2(shape, xPos, yPos) {
  for (var x = 0; x < shape[0].length; x++) {
    for (var y = 0; y < shape.length; y++) {
      if (shape[y][x] != 0) {
        if (shape[y][x] == 1) {
          ctx.fillStyle = "white";
        } else if (shape[y][x] == 2) {
          ctx.fillStyle = "grey";
        }

        ctx.fillRect(
          x * scale + xPos,
          356 - (y * scale + yPos + height),
          scale,
          scale
        );
      }
    }
  }
}

function getShape(type) {
  if (type == 1) {
    color = "#A800FF";
    secondColor = "#540080";
    shape = [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];
  } else if (type == 2) {
    color = "#00F11D";
    secondColor = "#00790f";
    shape = [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];
  } else if (type == 3) {
    color = "#0079FF";
    secondColor = "#003d80";
    shape = [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];
  } else if (type == 4) {
    color = "#FFEF00";
    secondColor = "#807800";
    shape = [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];
  } else {
    color = "#FF0900";
    secondColor = "#800500";
    shape = [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    ];
  }
}

var color = "white";
var secondColor = "white";
var shape;

function updateCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      if (position[y][x] != 0) {
        //ctx.fillRect(x * scale, y * scale, 1, 1);

        getShape(position[y][x]);

        drawShape(
          shape,
          75 + x * scale * 20 + x * scale,
          y * scale * 20 + y * scale,
          !running && endFrame > 10 && 19 - endFrame <= y
            ? "black"
            : !running && 10 - endFrame <= y
              ? "grey"
              : y < 1 && !onTitle
                ? "grey"
                : color,
          !running && endFrame > 10 && 19 - endFrame <= y
            ? "black"
            : !running && 10 - endFrame <= y
              ? "black"
              : y < 1 && !onTitle
                ? "black"
                : secondColor
        );
      }
    }
  }

  if (pause && running) {
    if (pauseFrame < 1) {
      var x = pausePosition[0];
      var y = pausePosition[1];

      getShape(pauseType);
      color = "white";

      drawShape(
        shape,
        x * scale * 20 + x * scale + 75,
        y * scale * 20 + y * scale,
        y < 1 ? "grey" : color
      );
    }
    if (pauseFrame < 2) {
      var x = pausePosition[2];
      var y = pausePosition[3];

      getShape(pauseType);
      color = "white";

      drawShape(
        shape,
        x * scale * 20 + x * scale + 75,
        y * scale * 20 + y * scale,
        y < 1 ? "grey" : color
      );
    }
    if (pauseFrame < 3) {
      var x = pausePosition[4];
      var y = pausePosition[5];

      getShape(pauseType);
      color = "white";

      drawShape(
        shape,
        x * scale * 20 + x * scale + 75,
        y * scale * 20 + y * scale,
        y < 1 ? "grey" : color
      );
    }
  }

  ctx.fillStyle = "grey";

  if (running && !onTitle)
    drawShape2(
      [
        [
          0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
        ],
        [
          0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0,
        ],
        [
          0, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1,
        ],
        [
          0, 1, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 1, 0,
        ],
        [
          0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0,
        ],
        [
          0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
        ],
      ],
      targetX * scale * 20 + targetX * scale - 2 + 75,
      targetY * scale * 20 + targetY * scale - 2
    );

  ctx.fillStyle = "black";
  ctx.fillRect(0, 360, 400, 100);

  ctx.drawImage(onTitle ? gameBorder1 : gameBorder2, 0, 0);
}

function restart() {
  onTitle = false;
  canRestart = false;
  height = 0;
  targetX = 0;
  targetY = 1;
  running = true;
  endFrame = 1;
  pausePosition = [0, 0, 0, 0, 0, 0];
  pauseType = 0;
  pauseFrame = 0;
  pause = false;
  document.getElementById("score").innerText = "Score: 0";
  score = 0;
  for (var k = 0; k < sizeY; k++) {
    position[k] = new Array(sizeX);
  }
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      position[y][x] = 0;
    }
  }
  cycle();

  var music = new URLSearchParams(window.location.search).get("music");

  if (music == "true" || !music) {
    song2Audio.stop();
    song2Audio.play();
    song2Audio.currentTime = 0;
    song2Audio.loop = true;
    song2Audio.volume = 0;
  }
}

var gameBorder1 = document.createElement("img");
gameBorder1.src = "gameBorder1.png";
var gameBorder2 = document.createElement("img");
gameBorder2.src = "gameBorder2.png";

function cycle() {
  setTimeout(
    function () {
      height += 1;

      updatePhysics();
      updateCanvas();

      if (pause) frameCycle();

      if (running && !pause) cycle();

      // if (!running && !pause)
      //   setTimeout(function () {
      //     if (!running) canRestart = true;
      //   }, 4000);
    },
    speed == 1 ? 160 : speed == 2 ? 80 : 50
  );
}

function frameCycle() {
  setTimeout(function () {
    updatePhysics();
    updateCanvas();

    pauseFrame++;

    if (pauseFrame > 3) {
      pause = false;
    }

    if (pause) frameCycle();
    else cycle();
  }, 240);
}

// TODO

var gameOverImage = document.createElement("img");
gameOverImage.src = "gameOver.png";

function endCycle() {
  setTimeout(
    function () {
      if (endFrame < 20) {
        updateCanvas();
      } else if (endFrame < 90) {
        ctx.drawImage(gameOverImage, 75, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(75, 50 + endFrame * 2, 250, (90 - endFrame) * 2);
      } else if (endFrame > 140) {
        ctx.drawImage(gameOverImage, 75, 0);
        ctx.fillStyle = "black";
        ctx.fillRect(75, 90, 250, (endFrame - 140) * 2);
      }

      endFrame++;

      if (endFrame < 250 && !running) endCycle();
      else {
        canRestart = false;
        height = 0;
        targetX = 0;
        targetY = 1;
        running = false;
        endFrame = 0;
        pausePosition = [0, 0, 0, 0, 0, 0];
        pauseType = 0;
        pauseFrame = 0;
        pause = false;
        for (var k = 0; k < sizeY; k++) {
          position[k] = new Array(sizeX);
        }
        for (var x = 0; x < sizeX; x++) {
          for (var y = 0; y < sizeY; y++) {
            position[y][x] = Math.floor(Math.random() * 5) + 1;
          }
        }
        onTitle = true;
        starting = false;
        startingFrame = 0;
        titleCycle();

        var music = new URLSearchParams(window.location.search).get("music");
        if (music == "true" || !music) {
          startMusic(0);
        }
      }
    },
    endFrame < 20 ? 120 : 10
  );
}

// TODO

var titleImage1 = document.createElement("img");
titleImage1.src = "title1.png";
var titleImage2 = document.createElement("img");
titleImage2.src = "title2.png";
var titleImage3 = document.createElement("img");
titleImage3.src = "title3.png";

var speed = 1;

function drawTitle() {
  ctx.drawImage(
    speed == 1 ? titleImage1 : speed == 2 ? titleImage2 : titleImage3,
    75,
    0
  );
}

function titleCycle() {
  setTimeout(
    function () {
      if (!starting) {
        height++;

        updateLimit();
        updateCanvas();
        drawTitle();
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(75, startingFrame, 250, 3);

        startingFrame += 3;

        if (startingFrame > 360) {
          restart();
          return;
        }
      }

      if (onTitle) titleCycle();
    },
    starting ? 1 : 20
  );
}

async function startMusic(volume) {
  var music = new URLSearchParams(window.location.search).get("music");
  if (music == "true" || !music) {
    songAudio.stop();
    songAudio.play();
    songAudio.currentTime = 0;
    songAudio.loop = true;
    songAudio.volume = volume;
  }
}

async function changeMusicVolume(volume) {
  songAudio.volume = volume;
}

async function changeMusic2Volume(volume) {
  song2Audio.volume = volume;
}

function checkIfLoaded() {
  if (loadedCount < 7) {
    document.getElementById("loading").innerText =
      "Loading: " + loadedCount + "/7";
  } else {
    document.getElementById("loading").innerText = "Click to Start.";
  }
}

// TODO

function moveUp() {
  moveAudio.play();
  moveAudio.currentTime = 0;

  if (onTitle) {
    speed = speed == 1 ? 3 : speed == 2 ? 1 : 2;
    return;
  }

  if ((targetY < 7 && height >= -20) || (targetY < 8 && height < -20))
    targetY += 1;

  if (onTitle && !starting) drawTitle();
}

function moveDown() {
  moveAudio.play();
  moveAudio.currentTime = 0;

  if (onTitle) {
    speed = speed == 1 ? 2 : speed == 2 ? 3 : 1;
    return;
  }

  if (targetY > 1) targetY -= 1;

  if (onTitle && !starting) drawTitle();
}

function moveLeft() {
  moveAudio.play();
  moveAudio.currentTime = 0;

  if (targetX > 0) targetX -= 1;

  if (onTitle && !starting) drawTitle();
}

function moveRight() {
  moveAudio.play();
  moveAudio.currentTime = 0;

  if (targetX < 4) targetX += 1;

  if (onTitle && !starting) drawTitle();
}

function moveSwap() {
  if (canRestart) restart();
  if (onTitle) {
    starting = true;

    songAudio.pause();

    startAudio.play();
    startAudio.currentTime = 0;
    return;
  }
  if (position[targetY][targetX] != 0 || position[targetY][targetX + 1] != 0) {
    swapAudio.play();

    var block1 = position[targetY][targetX];
    var block2 = position[targetY][targetX + 1];

    position[targetY][targetX] = block2;
    position[targetY][targetX + 1] = block1;
  }
}

canvas.addEventListener("click", (e) => {
  if (!loaded) return;

  var rect = canvas.getBoundingClientRect();
  // var x = e.clientX - (canvas.offsetLeft + canvas.offsetWidth / 2 - 200);
  // var y = e.clientY - canvas.offsetTop;

  // console.log(x, y, canvas.offsetWidth, canvas.offsetLeft, canvas.offsetLeft * (400 / canvas.offsetWidth)
  // );


  // Adjust mouse click position relative to the canvas
  const scaleX = canvas.width / rect.width;   // Scale factor for X
  const scaleY = canvas.height / rect.height; // Scale factor for Y

  // Calculate the mouse position on the canvas (adjusted for scaling)
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  console.log('Mouse X: ' + x + ', Mouse Y: ' + y);

  if (x < 200 && x > 0 && y < 600 && y > 400) {
    if (x > 100 && y - 400 > 200 - x && 200 - (y - 400) > 200 - x) {
      moveRight();
    } else if (x < 100 && y - 400 > x && 200 - (y - 400) > x) {
      moveLeft();
    } else if (y > 100 && x > y - 400 && 200 - x > y - 400) {
      moveUp();
    } else if (y > 100 && x > 200 - (y - 400) && 200 - x > 200 - (y - 400)) {
      moveDown();
    }
  }

  if (x < 400 && x > 200 && y < 630 && y > 430) {
    moveSwap();
  }

  if (running && !onTitle) updateCanvas();
});

document.addEventListener("click", (e) => {
  if (!loading) {
    loading = true;

    document.getElementById("loading").innerText = "Loading: 0";

    scoreAudio = new Howl({
      src: ["score.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    gameOverAudio = new Howl({
      src: ["gameOver.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    songAudio = new Howl({
      src: ["song.wav"],
      loop: true,
      volume: 0.3,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    song2Audio = new Howl({
      src: ["song2.wav"],
      loop: true,
      volume: 0.3,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    moveAudio = new Howl({
      src: ["move.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    swapAudio = new Howl({
      src: ["swap.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    startAudio = new Howl({
      src: ["start.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
  } else if (!loaded && loadedCount >= 7) {
    document.getElementById("loading").style.display = "none";

    titleCycle();

    startMusic(0.5);

    swapAudio.play();

    loaded = true;
  }
});

document.onkeypress = function (e) {
  if (!loading) {
    loading = true;

    document.getElementById("loading").innerText = "Loading: 0";

    scoreAudio = new Howl({
      src: ["score.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    gameOverAudio = new Howl({
      src: ["gameOver.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    songAudio = new Howl({
      src: ["song.wav"],
      loop: true,
      volume: 0.5,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    song2Audio = new Howl({
      src: ["song2.wav"],
      loop: true,
      volume: 0.5,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    moveAudio = new Howl({
      src: ["move.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    swapAudio = new Howl({
      src: ["swap.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });
    startAudio = new Howl({
      src: ["start.wav"],
      volume: 1,
      html5: true,
      onload: function () {
        loadedCount++;
        checkIfLoaded();
      },
    });

    return;
  }
  else if (!loaded && loadedCount >= 7) {
    document.getElementById("loading").style.display = "none";

    titleCycle();

    startMusic(0.5);

    swapAudio.play();

    loaded = true;

    return;
  } else if (!loaded) {
    return;
  }

  e = e || window.event;

  if (e.keyCode == 97) {
    moveLeft();
  } else if (e.keyCode == 100) {
    moveRight();
  } else if (e.keyCode == 119) {
    moveUp();
  } else if (e.keyCode == 115) {
    moveDown();
  } else if (e.keyCode == 32) {
    moveSwap();
  }

  if (running && !onTitle) updateCanvas();
  if (canRestart) restart();
};

var loaded = false;
var loading = false;

var scoreAudio;
var gameOverAudio;
var songAudio;
var song2Audio;
var moveAudio;
var swapAudio;
var startAudio;

document.addEventListener("DOMContentLoaded", (event) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 600);
});
