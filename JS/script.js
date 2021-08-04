function startgame() {
  document.getElementsByClassName("homepage")[0].style.display = "none";
  document.getElementsByClassName("gamescreen")[0].style.display = "block";
}

function restartGame() {
  location.reload();
}

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
  [1, 1, 0, 0, 0, 2, 1, 1],
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

//timer
function timer(start) {
  let endTime = start.getMinute + 500;
  for (start; start <= endTime; start++) {
    document.getElementsByClassName("time").innerHTML(start.getSeconds());
    if (start == endTime) {
      gameover();
    }
  }
}

// enemy initialization
const moveme = document.getElementById("moveMe");
const circle1 = document.createElement("div");
circle1.setAttribute("id", "circle1");
moveme.appendChild(circle1);
// const circle2 = document.createElement("div");
// circle2.setAttribute("id", "circle2");
// moveme.appendChild(circle2);
// const circle3 = document.createElement("div");
// circle3.setAttribute("id", "circle3");
// moveme.appendChild(circle3);

function GamePlay() {
  this.init = function () {
    let instruction = document.getElementsByClassName("instruction")[0];
    let gameWrapperEl = document.getElementById("gamescreen");
    let player = document.getElementById("player");
    let playerPosition = {
      x: 72,
      y: 0,
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prepare tiles
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

    // TIMER
    let currentTime = new Date();
    let startTime = currentTime;
    timer(startTime);

    function updatePlayerPosition(x, y) {
      playerPosition.x = x;
      playerPosition.y = y;

      player.style.top = `${playerPosition.y}px`;
      player.style.left = `${playerPosition.x}px`;
    }

    function handleKeyDown(e) {
      e.preventDefault();

      switch (e.which) {
        case 37:
          console.log("Key left pressed");
          move("left");
          break;
        case 38:
          console.log("Key up pressed");
          move("up");
          break;
        case 39:
          console.log("Key right pressed");
          move("right");
          break;
        case 40:
          console.log("Key down pressed");
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

    function resetPlayerBg() {
      player.style.backgroundPositionX = "0px";
      player.style.backgroundPositionY = "0px";
    }

    // Beam
    document.addEventListener("keydown", attack);

    function attack(e) {
      e.preventDefault();
      if (e.which == 90) {
        const beam = document.createElement("div");
        beam.className = "beam";

        gameWrapperEl.appendChild(beam);

        // resetPlayerBg();

        showBeam(beam, player.lastDirection);
        return;
      }

      function showBeam(beam, beamDirection) {
        let beamPositionX = playerPosition.x;
        let beamPositionY = playerPosition.y;
        const beamInterval = setInterval(function () {
          beam.style.display = "none";

          if (beamDirection == "left") {
            beamPositionX -= TILE_WIDTH;
          } else if (beamDirection == "right") {
            beamPositionX += TILE_WIDTH;
          } else if (beamDirection == "up") {
            beamPositionY -= TILE_HEIGHT;
            beam.style.transform = "rotate(90deg)";
          } else {
            beamPositionY += TILE_HEIGHT;
            beam.style.transform = "rotate(90deg)";
          }

          if (
            beamPositionX > FRAME_WIDTH ||
            beamPositionX < 0 ||
            beamPositionY > FRAME_HEIGHT ||
            beamPositionY < 0
          ) {
            clearInterval(beamInterval);
            // beam.hide();

            beam.remove();
            return;
          }

          function checkCollisonWithBeam() {
            // const beam = document.getElementsByClassName("beam")[0];
            // // for (let i = 0; i < beam.length; i++) {
            // let beamPositionX = beam.style.left;
            // let beamPositionY = beam.style.top;

            if (
              !(
                beamPositionY + TILE_HEIGHT < 335 ||
                beamPositionY > 335 + 50 ||
                beamPositionX + TILE_WIDTH < 135 ||
                beamPositionX > 135 + 50
              )
            ) {
              console.log("Enemy collided");
              Explosion("moveme", "circle1");
              return true;

              // console.log("Beam position X" + beamPositionX + "Beam i= " + beam[i]);
              // console.log("Beam position Y" + beamPositionY);

              // if (beamPositionX+ >= enemyX || beamPositionY >= enemyY) {
              //   console.log("Enemy collided");
              //   return true;
              // }
            }
            return false;
          }

          function Explosion(el, id) {
            console.log("In explosion");
            stop(id);
            console.log("id" + document.getElementById(id));
            document.getElementById(id).style.backgroundImage =
              "url(/Images/explosion_sprite.gif)";
            setInterval(function () {
              document.getElementById(id).remove();
            }, 2000);
          }

          checkCollisonWithBeam();
          console.log({ beamPositionX, beamPositionY });
          beam.style.left = beamPositionX + "px";
          beam.style.top = beamPositionY + "px";
          beam.style.display = "block";
        }, 200);

        // resetBeamPosition();
        // beam.style.display = "none";
        // return;
      }
    }

    // Player collision with Env
    function checkCollision(nextXIndex, nextYIndex) {
      const xIndex = Math.round(nextXIndex);
      const yIndex = Math.round(nextYIndex);
      let nextTileType = TILES_MAP[yIndex][xIndex];
      console.log({ nextXIndex, nextYIndex, xIndex, yIndex, nextTileType });
      return nextTileType !== 0;
    }

    //Player collision with Enemy
    function checkCollisonWithEnemy(enemyX, enemyY) {
      if (
        !(
          playerPosition.y + TILE_HEIGHT < enemyY ||
          playerPosition.y > enemyY + 50 ||
          playerPosition.x + TILE_WIDTH < enemyX ||
          playerPosition.x > enemyX + 50
        )
      ) {
        console.log("Enemy collided");
        return true;
      }
      return false;
    }

    //coins initialization
    const coins = document.getElementsByClassName("coins")[0];

    console.log("Tile length: " + TILES_MAP.length);
    let coinpos = {
      x: 0,
      y: 0,
    };

    // Check Coin Scored
    function checkCoinGot(playerX, playerY) {
      for (let i = 1; i <= 10; i++) {
        let coin = document.getElementsByClassName("coin" + i)[0];
        coinpos.x = coin.style.left;
        coinpos.y = coin.style.top;
        let coinX = coinpos.x / TILE_WIDTH;
        let playerCoinPositionX = playerX + 22 + "px";
        let playerCoinPositionY = playerY + 20 + "px";
        if (
          playerCoinPositionY == coinpos.y &&
          playerCoinPositionX == coinpos.x
        ) {
          console.log("Coin Got");
          getCoins(coin);
          coinCount++;
          if (coinCount < 10) {
            totalCoinCount++;
            console.log("total coin count = " + totalCoinCount);
            let score = document.getElementsByClassName("score")[0];
            score.innerHTML = totalCoinCount;
          }
        }
      }
    }

    // Counting Coins
    let coinCount = 0;
    let totalCoinCount = 0;

    function getCoins(coin) {
      console.log("Coin added");
      coin.style.display = "none";
      return;
    }

    // Making Coins
    for (let i = 1; i <= 10; i++) {
      let coin = document.createElement("div");
      coin.setAttribute("class", "coin" + i);
      coins.appendChild(coin);

      if (i == 1 || i == 2 || i == 3) {
        let coinIncX = coinpos.x + 4 * TILE_WIDTH + i * TILE_WIDTH + 22;
        let coinIncY = coinpos.y + 20;
        coin.style.left = coinIncX + "px";
        coin.style.top = coinIncY + "px";
      }
      if (i == 4 || i == 5) {
        let coinIncX = coinpos.x + (i - 3) * TILE_WIDTH + 22;
        let coinIncY = coinpos.y + 2 * TILE_HEIGHT + 20;
        coin.style.left = coinIncX + "px";
        coin.style.top = coinIncY + "px";
      }
      if (i == 6 || i == 7) {
        let coinIncX = coinpos.x + (i - 1) * TILE_WIDTH + 22;
        let coinIncY = coinpos.y + 5 * TILE_HEIGHT + 20;
        coin.style.left = coinIncX + "px";
        coin.style.top = coinIncY + "px";
      }

      if (i == 8 || i == 9) {
        let coinIncX = coinpos.x + (i - 7) * TILE_WIDTH + 22;
        let coinIncY = coinpos.y + 6 * TILE_HEIGHT + 20;
        coin.style.left = coinIncX + "px";
        coin.style.top = coinIncY + "px";
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

      console.log({
        playerTileIndexX,
        playerTileIndexY,
      });

      if (direction == "left") {
        // check the tile type
        const isCollisionAhead = checkCollision(
          playerTileIndexX - 1,
          playerTileIndexY
        );

        if (isCollisionAhead) {
          return;
        }

        checkCoinGot(playerPosition.x, playerPosition.y);

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

        checkCoinGot(playerPosition.x, playerPosition.y);

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

        checkCoinGot(playerPosition.x, playerPosition.y);

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

        checkCoinGot(playerPosition.x, playerPosition.y);

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
          // resetPlayerBg();

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

      // Enemy Movement
      var ElementRevolver = (function () {
        function getPosition(settings, ellapsedTime) {
          var angle = getAngle(settings, ellapsedTime);
          return {
            x: Math.round(
              settings.center.x + settings.radius * Math.cos(angle)
            ),
            y: Math.round(
              settings.center.y + settings.radius * Math.sin(angle)
            ),
          };
        }

        function getAngle(settings, ellapsedTime) {
          return (
            (ellapsedTime / settings.interval) *
              2 *
              Math.PI *
              settings.direction -
            settings.startPositionRad
          );
        }

        function start(id, settings) {
          var el = document.getElementById("circle1"),
            startTime = new Date().getTime(),
            width = el.offsetWidth,
            height = el.offsetHeight;
          el.style.display = "block";
          var pos = getPosition(settings, new Date().getTime() - startTime);
          if (el["#rev:tm"] !== null) stop(id);
          el.style.position = settings.cssPosition || "absolute";
          if (!settings.startPositionRad)
            settings.startPositionRad =
              (settings.startPositionDeg / 180) * Math.PI;

          el["#rev:tm"] = setInterval(function () {
            var pos = getPosition(settings, new Date().getTime() - startTime);
            el.style.left = pos.x - Math.round(width / 2) + "px";
            el.style.top = pos.y - Math.round(height / 2) + "px";

            const enemycol = checkCollisonWithEnemy(
              pos.x - Math.round(width / 2),
              pos.y - Math.round(height / 2)
            );

            // const enemybeamcol = checkCollisonWithBeam(
            //   pos.x - Math.round(width / 2),
            //   pos.y - Math.round(height / 2)
            // );

            console.log({ enemycol, el });
            if (enemycol) {
              Explosion(el, id);
              if (enemycol) {
                player.remove();
                setInterval(function () {
                  gameover();
                }, 900);
              }
            }
          }, settings.updateInterval);
          if (settings.iterations > -1)
            setTimeout(function () {
              stop(id);
            }, settings.iterations * settings.interval);

          function stop(id) {
            var el = document.getElementById(id);
            if (el["#rev:tm"] === null) return;
            clearInterval(el["#rev:tm"]);
            el["#rev:tm"] = null;
          }

          function Explosion(el, id) {
            console.log("In explosion");
            stop(id);
            console.log("id" + document.getElementById(id));
            document.getElementById(id).style.backgroundImage =
              "url(/Images/explosion_sprite.gif)";
            setInterval(function () {
              document.getElementById(id).remove();
            }, 2000);
          }
        }

        function gameover() {
          let youLoose = document.getElementsByClassName("gameover")[0];
          let youLooseBG =
            document.getElementsByClassName("gameoverOverlay")[0];
          youLoose.style.display = "block";
          youLooseBG.style.display = "block";

          moveme.remove();
        }

        return {
          start: start,
          stop: stop,
        };
      })();

      ElementRevolver.start("circle1", {
        radius: 0,
        center: { x: 160, y: 360 },
        // time in milliseconds for one revolution
        interval: 1000,
        // direction = 1 for clockwise, -1 for counterclockwise
        direction: 1,
        // number of times to animate the revolution (-1 for infinite)
        iterations: -1,
        // startPosition can be a degree angle
        // (0 = right, 90 = top, 180 = left, 270 = bottom)
        startPositionDeg: 90,
        // how often (in milliseconds) the position of the
        // circle should be attempted to be updated
        updateInterval: 60,
        startPositionRad: 0.5 * Math.PI,
      });

      ElementRevolver.start("circle2", {
        radius: 0,
        center: { x: 350, y: 360 },
        interval: 1000,
        direction: -1,
        iterations: -1,
        startPositionDeg: 10,
        updateInterval: 80,
        startPositionRad: (10 / 180) * Math.PI,
      });

      ElementRevolver.start("circle3", {
        radius: 0,
        center: { x: 150, y: 190 },
        interval: 1000,
        direction: -1,
        iterations: -1,
        startPositionDeg: 10,
        updateInterval: 50,
        startPositionRad: (10 / 180) * Math.PI,
      });
    }
  };
}

let gamePlay = new GamePlay();

gamePlay.init();
