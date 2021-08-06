function startgame() {
  document.getElementsByClassName("homepage")[0].style.display = "none";
  document.getElementsByClassName("gamescreen")[0].style.display = "block";
}

function restartGame() {
  location.reload();
}

let gameWrapperEl = document.getElementById("gamescreen");

// TILE
const TILE_WIDTH = 72;
const TILE_HEIGHT = 72;

const TIME_INTERVAL = 100;

const TILES_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 5, 1, 2, 0, 2, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 6, 7],
  [1, 0, 0, 0, 0, 0, 8, 9],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 2, 1],
  [1, 1, 2, 1, 1, 2, 1, 1],
];

const FRAME_WIDTH = TILES_MAP[0].length * TILE_WIDTH;
const FRAME_HEIGHT = TILES_MAP.length * TILE_HEIGHT;

function Tile({
  width = TILE_WIDTH,
  height = TILE_HEIGHT,
  xIndex,
  yIndex,
  bgType,
}) {
  this.width = width;
  this.height = height;
  this.backgroundType = bgType;
  this.xIndex = xIndex;
  this.yIndex = yIndex;

  this.getElement = function () {
    const el = document.createElement("div");

    el.className = `tile tile-${this.backgroundType}`;
    el.style.top = `${this.yIndex * TILE_HEIGHT}px`;
    el.style.left = `${this.xIndex * TILE_WIDTH}px`;

    return el;
  };
}

function PrepareTiles(gameWrapperEl) {
  for (let i = 0; i < TILES_MAP.length; i++) {
    for (let j = 0; j < TILES_MAP[i].length; j++) {
      let tileObj = new Tile({
        xIndex: j,
        yIndex: i,
        bgType: TILES_MAP[i][j],
      });
      const tileEl = tileObj.getElement();

      gameWrapperEl.appendChild(tileEl);
    }
  }
}

// PLAYER
let player = document.getElementById("player");
let playerPosition = {
  x: 72,
  y: 0,
};

function Player() {
  playermovement();
}

function playermovement() {
  let instruction = document.getElementsByClassName("instruction")[0];
  document.addEventListener("keydown", handleKeyDown);
  function handleKeyDown(e) {
    e.preventDefault();

    switch (e.which) {
      case 37:
        move("left");
        break;
      case 38:
        move("up");
        break;
      case 39:
        move("right");
        break;
      case 40:
        move("down");
        break;
      case 88:
        instruction.style.display = "block";
        break;
      case 65:
        instruction.style.display = "none";
        break;
      default:
        break;
    }
  }
}

function move(direction) {
  let bgY = 0;

  let bgIndex = 0;
  let xIncrement = 1;
  let yIncrement = 0;
  let xInc = TILE_WIDTH / 4;
  let yInc = TILE_HEIGHT / 4;

  // Find current tile index of where the player is
  const playerTileIndexX = playerPosition.x / TILE_WIDTH;
  const playerTileIndexY = playerPosition.y / TILE_HEIGHT;

  if (direction == "left") {
    // check the tile type
    const isCollisionAhead = checkCollision(
      playerTileIndexX - 1,
      playerTileIndexY
    );
    if (isCollisionAhead) {
      return;
    }
    beamListener();
    bgY = 3 * TILE_HEIGHT;
    xInc = -xInc;
    yInc = 0;
  }

  if (direction == "right") {
    // check the tile type
    const isCollisionAhead = checkCollision(
      playerTileIndexX + 1,
      playerTileIndexY
    );
    if (isCollisionAhead) {
      return;
    }
    beamListener();
    bgY = 2 * TILE_HEIGHT;
    yInc = 0;
  }

  if (direction == "up") {
    // check the tile type
    const isCollisionAhead = checkCollision(
      playerTileIndexX,
      playerTileIndexY - 1
    );
    if (isCollisionAhead) {
      return;
    }
    beamListener();
    bgY = 1 * TILE_HEIGHT;
    xInc = 0;
    yInc = -yInc;
  }

  if (direction == "down") {
    // check the tile type
    const isCollisionAhead = checkCollision(
      playerTileIndexX,
      playerTileIndexY + 1
    );
    if (isCollisionAhead) {
      return;
    }
    beamListener();
    bgY = 0;
    xInc = 0;
  }

  player.lastDirection = direction;
  player.style.backgroundPositionY = `${bgY}px`;

  let ti = setInterval(function () {
    let nextXPosition = playerPosition.x + xInc;
    let nextYPosition = playerPosition.y + yInc;

    if (
      nextXPosition + TILE_WIDTH > FRAME_WIDTH ||
      nextYPosition + TILE_HEIGHT > FRAME_HEIGHT ||
      nextXPosition < 0 ||
      nextYPosition < 0 ||
      xIncrement >= TILE_WIDTH ||
      yIncrement >= TILE_HEIGHT
    ) {
      xIncrement = 0;
      yIncrement = 0;
      nextXPosition = playerPosition.x;
      nextYPosition = playerPosition.y;

      clearInterval(ti);

      return;
    }

    if (bgIndex >= 4) {
      bgIndex = 0;
    }

    updatePlayerPosition(nextXPosition, nextYPosition);
    player.style.backgroundPositionX = `${TILE_WIDTH * bgIndex}px`;
    bgIndex++;
    xIncrement += Math.abs(xInc);
    yIncrement += Math.abs(yInc);
  }, TIME_INTERVAL);
}

function updatePlayerPosition(x, y) {
  playerPosition.x = x;
  playerPosition.y = y;
  player.style.top = `${playerPosition.y}px`;
  player.style.left = `${playerPosition.x}px`;
}

// COINS
const coins = document.getElementsByClassName("coins")[0];
const score = document.getElementsByClassName("score")[0];
let coinCount = 0;

function CoinInitialization() {
  let coin1 = new Coin(1, coins, { x: 3, y: 0 });
  InitialCoinActions(coin1);
  let coin2 = new Coin(2, coins, { x: 6, y: 0 });
  InitialCoinActions(coin2);
  let coin3 = new Coin(3, coins, { x: 7, y: 0 });
  InitialCoinActions(coin3);
  let coin4 = new Coin(4, coins, { x: 1, y: 2 });
  InitialCoinActions(coin4);
  let coin5 = new Coin(5, coins, { x: 7, y: 2 });
  InitialCoinActions(coin5);
  let coin6 = new Coin(6, coins, { x: 1, y: 3 });
  InitialCoinActions(coin6);
  let coin7 = new Coin(7, coins, { x: 1, y: 4 });
  InitialCoinActions(coin7);
  let coin8 = new Coin(8, coins, { x: 7, y: 5 });
  InitialCoinActions(coin8);
  let coin9 = new Coin(9, coins, { x: 4, y: 6 });
  InitialCoinActions(coin9);
  let coin10 = new Coin(10, coins, { x: 5, y: 6 });
  InitialCoinActions(coin10);
}

function InitialCoinActions(coin) {
  coin.init();
  setInterval(function () {
    coin.checkPlayerCollision();
  }, 1000);
}

function Coin(id, parent, coinPosition) {
  this.id = id;
  this.parent = parent;
  this.coinPosition = coinPosition;

  this.init = function () {
    this.element = document.createElement("div");

    this.element.setAttribute("class", "coin coin-" + id);
    this.parent.appendChild(this.element);

    this.element.style.left = this.coinPosition.x * TILE_WIDTH + "px";
    this.element.style.top = this.coinPosition.y * TILE_WIDTH + "px";
  };

  this.checkPlayerCollision = function () {
    if (
      !(
        playerPosition.y + TILE_HEIGHT < this.coinPosition.y * TILE_HEIGHT ||
        playerPosition.y > this.coinPosition.y * TILE_HEIGHT + 50 ||
        playerPosition.x + TILE_WIDTH < this.coinPosition.x * TILE_WIDTH ||
        playerPosition.x > this.coinPosition.x * TILE_WIDTH + 50
      )
    ) {
      console.log("Coin collected");
      for (let i = 0; i < 1; i++) {
        coinCollect(this.element);
      }
    }
  };
}

function coinCollect(coin) {
  coin.style.display = "none";
  coin.remove();
  coinCount++;
  updateCoinCount();
}

function updateCoinCount() {
  //   coinCount += 1;
  score.innerHTML = coinCount;
}

// BEAM
let beamPosition = {
  x: 0,
  y: 0,
};

function beamListener() {
  document.addEventListener("keydown", beamFire);
  function beamFire(e) {
    attack(e);
  }
}

function attack(e) {
  e.preventDefault();
  if (e.which == 90) {
    const beam = document.createElement("div");
    beam.className = "beam";
    gameWrapperEl.appendChild(beam);
    showBeam(beam, player.lastDirection);
  }
}

function showBeam(beam, beamDirection) {
  beamPosition.x = playerPosition.x;
  beamPosition.y = playerPosition.y;
  const beamInterval = setInterval(function () {
    beam.style.display = "none";

    if (beamDirection == "left") {
      beamPosition.x = beamPosition.x - TILE_WIDTH;
    }
    if (beamDirection == "right") {
      beamPosition.x = beamPosition.x + TILE_WIDTH;
    }
    if (beamDirection == "up") {
      beamPosition.y = beamPosition.y - TILE_HEIGHT;
      beam.style.transform = "rotate(90deg)";
    }
    if (beamDirection == "down") {
      beamPosition.y = beamPosition.y + TILE_HEIGHT;
      beam.style.transform = "rotate(90deg)";
    }

    if (
      beamPosition.x > FRAME_WIDTH ||
      beamPosition.x < 0 ||
      beamPosition.y > FRAME_HEIGHT ||
      beamPosition.y < 0
    ) {
      clearInterval(beamInterval);

      beam.remove();
      return;
    }

    beam.style.left = beamPosition.x + "px";
    beam.style.top = beamPosition.y + "px";
    beam.style.display = "block";
  }, 200);
}

// ENEMY
const enemies = document.getElementsByClassName("enemies")[0];

function EnemyInitialization() {
  let enemy1 = new Enemy(1, enemies, { x: 4, y: 5 });
  enemy1.init();
  setInterval(function () {
    enemy1.updatePosition();
    enemy1.checkPlayerCollision();
    enemy1.checkBeamHit();
  }, 500);
  let enemy2 = new Enemy(2, enemies, { x: 4, y: 0 });
  enemy2.init();
  setInterval(function () {
    enemy2.updatePosition();
    enemy2.checkPlayerCollision();
    enemy2.checkBeamHit();
  }, 800);
  let enemy3 = new Enemy(3, enemies, { x: 2, y: 2 });
  enemy3.init();
  setInterval(function () {
    enemy3.updatePosition();
    enemy3.checkPlayerCollision();
    enemy3.checkBeamHit();
  }, 600);
}

function Enemy(id, parent, initialPosition) {
  this.id = id;
  this.parent = parent;
  this.enemyPosition = initialPosition;
  this.numberOfStepsRemaining = 3;
  this.forward = true;

  this.init = function () {
    this.element = document.createElement("div");

    this.element.setAttribute("class", "enemy enemy-" + id);
    this.parent.appendChild(this.element);

    this.element.style.left = this.enemyPosition.x * TILE_WIDTH + "px";
    this.element.style.top = this.enemyPosition.y * TILE_WIDTH + "px";
  };

  this.updatePosition = function () {
    if (this.numberOfStepsRemaining == 0) {
      this.forward = !this.forward;
      this.numberOfStepsRemaining = 3;
    }
    if (this.forward) {
      this.enemyPosition.x = this.enemyPosition.x + 1;
    } else {
      this.enemyPosition.x = this.enemyPosition.x - 1;
    }
    this.element.style.left = this.enemyPosition.x * TILE_WIDTH + "px";
    this.element.style.top = this.enemyPosition.y * TILE_WIDTH + "px";

    this.numberOfStepsRemaining -= 1;
  };

  this.checkPlayerCollision = function () {
    if (
      !(
        playerPosition.y + TILE_HEIGHT < this.enemyPosition.y * TILE_HEIGHT ||
        playerPosition.y > this.enemyPosition.y * TILE_HEIGHT + 50 ||
        playerPosition.x + TILE_WIDTH < this.enemyPosition.x * TILE_WIDTH ||
        playerPosition.x > this.enemyPosition.x * TILE_WIDTH + 50
      )
    ) {
      console.log("Enemy collided");
      Explosion(this.element);
    }
  };

  this.checkBeamHit = function () {
    if (
      !(
        beamPosition.y + TILE_HEIGHT < this.enemyPosition.y * TILE_HEIGHT ||
        beamPosition.y > this.enemyPosition.y * TILE_HEIGHT + 50 ||
        beamPosition.x + TILE_WIDTH < this.enemyPosition.x * TILE_WIDTH ||
        beamPosition.x > this.enemyPosition.x * TILE_WIDTH + 50
      )
    ) {
      console.log("Enemy collided with Beam");
    }
    ExplosionByBeam(this.element);
  };
}

function Explosion(enemy) {
  console.log("In explosion");
  player.remove();
  enemy.style.backgroundImage = "url(../Images/explosion_sprite.gif)";
  setInterval(function () {
    enemy.remove();
    gameOver();
  }, 500);
}

function ExplosionByBeam(enemy) {
  console.log("Beam explosion");
  enemy.style.backgroundImage = "url(../Images/explosion_sprite.gif)";
  setInterval(function () {
    enemy.remove();
  }, 500);
}

// COLLISION
function checkCollision(nextXIndex, nextYIndex) {
  const xIndex = Math.round(nextXIndex);
  const yIndex = Math.round(nextYIndex);
  let nextTileType = TILES_MAP[yIndex][xIndex];
  return nextTileType !== 0;
}

// GAME-OVER
function gameOver() {
  const gameover = document.getElementsByClassName("gameover")[0];
  gameover.style.display = "block";
}

//-----------------GAME-PLAY---------------------------
function GamePlay() {
  this.init = function () {
    PrepareTiles(gameWrapperEl);
    Player();
    EnemyInitialization();
    CoinInitialization();
  };
}

let gamePlay = new GamePlay();

gamePlay.init();
