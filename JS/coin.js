// coins initialization
const coins = document.getElementsByClassName("coins");

console.log("Tile length: " + TILES_MAP.length);
let coinpos = {
  x: 0,
  y: 0,
};

// Check Coin Scored
function checkCoinGot(playerX, playerY) {
  for (let i = 1; i <= 10; i++) {
    let coin = document.getElementsByClassName("coins")[i];
    coinpos.x = coin.style.left;
    coinpos.y = coin.style.top;
    let coinX = coinpos.x / TILE_WIDTH;
    let playerCoinPositionX = playerX + 22 + "px";
    let playerCoinPositionY = playerY + 20 + "px";
    if (playerCoinPositionY == coinpos.y && playerCoinPositionX == coinpos.x) {
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
