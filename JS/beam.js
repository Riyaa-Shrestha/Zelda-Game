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

      // function checkCollisonWithBeam() {
      //   if (
      //     !(
      //       beamPositionY + TILE_HEIGHT < 335 ||
      //       beamPositionY > 335 + 50 ||
      //       beamPositionX + TILE_WIDTH < 135 ||
      //       beamPositionX > 135 + 50
      //     )
      //   ) {
      //     console.log("Enemy collided");
      //     Explosion("moveme", "circle1");
      //     return true;
      //   }
      //   return false;
      // }

      // checkCollisonWithBeam();
      // console.log({ beamPositionX, beamPositionY });
      // beam.style.left = beamPositionX + "px";
      // beam.style.top = beamPositionY + "px";
      // beam.style.display = "block";
    }, 200);
  }
}
