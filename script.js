// Constants
const MAX_AMMO = 25;
const VALID_TARGETS = ["gallery", "target", "bullet", "enemy"];
const RELOAD_SPEED = 3000;
document.documentElement.style.setProperty("--animate-duration", ".5s");

// DOM
let pointDiv = document.querySelector("#points");
let crosshair = document.querySelector("#crosshair");
let player = document.querySelector("#player");
let gallery = document.querySelector("#gallery");
let clearBullets = document.querySelector("#clear");
let reload = document.querySelector("#reload");
let begin = document.querySelector("#begin");
let stop = document.querySelector("#stop");
let bulletCountDiv = document.querySelector("#bullet-count");
let magazine = document.querySelector("#magazine");

// Variables
let bulletsFired = 0;
let moveTargetInterval;
let targetIsMoving = false;
let playerAmmo = MAX_AMMO;
let reloading = false;
let targetStoppedPosition = 10;
let targetSpeed = 3;
let intervalSpeed = 1;
let points = 0;

// SOUNDS
let rifle1 = new Audio("assets/gun-gunshot-01.wav");
let garand = new Audio("assets/m1garand.wav");
let whack = new Audio("assets/whack.wav");
let thud = new Audio("assets/woodthud.wav");
let reloadSound = new Audio("assets/rifle-reload.wav");
let empty = new Audio("assets/gunempty.wav");

// Enemy troopers
let enemySelection = [
  "assets/german1.png",
  "assets/german3.png",
  "assets/german4.png",
  "assets/german4.png",
  "assets/german6.png",
  "assets/german7.png",
  "assets/german8.png",
  "assets/german9.png",
  "assets/german10.png",
];

// TODO ANIMATIONS
// const element = document.querySelector("#messages");
// element.classList.add("animate__animated", "animate__bounceOutLeft");
// element.addEventListener("animationend", () => {});

/**
 * -------------
 *    HELPERS
 * -------------
 */

function getCenter(element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 };
}

function uuid() {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

function randomInt(n) {
  return Math.floor(Math.random() * n);
}

// PLay sound files
function playSound(sound) {
  switch (sound) {
    case "garand":
      garand.pause();
      garand.currentTime = 0;
      garand.play();
      break;
    case "hit":
      thud.pause();
      thud.currentTime = 0;
      thud.play();
      break;
    case "reload":
      reloadSound.currentTime = 0;
      reloadSound.volume = 0.6;
      reloadSound.playbackRate = 3;
      reloadSound.play();
      break;
    case "empty":
      empty.currentTime = 0;
      empty.play();
      break;
  }
}

const playerCenter = getCenter(player);
addEventListener("mousemove", (e) => {
  const angle = Math.atan2(
    e.clientY - playerCenter.y,
    e.clientX - playerCenter.x
  );
  player.style.transform = `rotate(${angle + 1.5}rad)`;
});

// // Crosshair tracking
// document.addEventListener("mousemove", (e) => {
//   crosshair.style.left = e.pageX + "px";
//   crosshair.style.top = e.pageY + "px";
// });

// Make bullet holes - SHOOT
document.addEventListener("click", (e) => {
  let id = e.target.id;
  console.log(id);
  if (isValidTarget(id) && !reloading) {
    console.log("valid target");
    playerAmmo--;
    // Handle hits
    if (fireOrReload()) {
      isAHit(id, e);
    } else {
      playSound("empty");
      playerAmmo = 0;
    }
    // Update Bullet count
    updateBulletCount();

    // Update player ui
    updateUi();
  } else {
    // TODO - update ui
    console.log("reloading");
  }
});

// Reload
reload.addEventListener("click", () => {
  reloading = true;
  playSound("reload");
  setTimeout(() => {
    reloading = false;
    reloadSound.loop = false;
  }, RELOAD_SPEED);
  loadWeapon();
  playerAmmo = MAX_AMMO;
});

// Set bullet count
function updateBulletCount() {
  loadWeapon(playerAmmo);
}

function reloadReminder() {}

// Hit occured, create bullet hole and play sound
function isAHit(target, e) {
  playSound("garand");
  bulletsFired++;
  let container = document.querySelector("#" + target);
  let bulletHole = createBulletHole();
  container.appendChild(bulletHole);
  console.log(container);

  if (e.target.classList.contains("target")) {
    playSound("hit");
    points += 10;
  }
  placeBullet(bulletHole, e);
}

function fireOrReload() {
  return playerAmmo >= 0;
}

// What we hit is a valid target, or not
function isValidTarget(target) {
  return VALID_TARGETS.some((validTarget) => {
    return target.indexOf(validTarget) > -1;
  });
}

// Position bullet hole
function placeBullet(bulletEl, e) {
  bulletEl.style.left = e.offsetX - 2.5 + "px";
  bulletEl.style.top = e.offsetY - 2.5 + "px";
}

// Communicate state in ui - ammo count, reload etc.
function updateUi() {
  pointDiv.textContent = "Points: " + points;
  bulletCountDiv.textContent = "Rounds Fired: " + bulletsFired;
}

// Create bullet hole element and return it
function createBulletHole() {
  let bulletHole = document.createElement("div");
  bulletHole.classList.add(
    "bullet-hole",
    "animate__animated",
    "animate__pulse"
  );
  bulletHole.id = "bullet-hole-" + bulletsFired;
  return bulletHole;
}

// Load weapon
function loadWeapon(rounds = MAX_AMMO) {
  resetMag();
  for (let i = 0; i < rounds; i++) {
    let img = document.createElement("img");
    img.classList.add("rifle-round");
    img.style.setProperty("--animate-duration", `.${i}1s`);
    img.src = "assets/bullet.png";
    magazine.appendChild(img);
  }
}

// Move Target
function moveTarget() {
  if (targetIsMoving) {
    return;
  }
  const elem = document.getElementById("target-1");
  let pos = targetStoppedPosition;
  let dir = targetSpeed;
  moveTargetInterval = setInterval(frame, intervalSpeed);

  function frame() {
    targetIsMoving = true;
    if (pos >= 300) {
      dir = -targetSpeed;
    } else if (pos <= 0) {
      dir = targetSpeed;
    }
    pos += dir;
    elem.style.left = pos + "px";
  }
}
// Move Target
function moveEnemy(el) {
  const elem = el;
  let pos = 1;
  let id = setInterval(frame, 20);

  function frame() {
    if (pos < 300) {
      pos++;
    }
    elem.style.top = pos + "px";
  }
}

function stopTargetMove() {
  window.clearInterval(moveTargetInterval);
  targetIsMoving = false;
  targetStoppedPosition = document.getElementById("target-1").offsetLeft;
}

// Clear magazine
function resetMag() {
  magazine.querySelectorAll("img").forEach((bullet) => {
    bullet.remove();
  });
}

function generateEnemy() {
  const id = uuid();
  let choice = randomInt(enemySelection.length);
  let base = document.createElement("div");
  let trooper = document.createElement("img");
  trooper.src = enemySelection[choice];
  trooper.id = "enemy-trooper-" + id;

  base.classList.add("enemy-trooper", "unselectable", "enemy");
  base.id = "enemy-" + id;

  base.appendChild(trooper);
  return base;
}

function generateTarget() {
  // Practice targets
  const id = uuid();
  let fullTarget = document.createElement("div");
  let targetInnerRing = document.createElement("div");
  let targetBullsEye = document.createElement("div");

  fullTarget.id = "target-o-" + id;
  fullTarget.classList.add("target-outer-ring");

  targetInnerRing.id = "target-i-" + id;
  targetInnerRing.classList.add("target-inner-ring");

  targetBullsEye.id = "target-b-" + id;
  targetBullsEye.classList.add("target-bullseye");

  fullTarget.appendChild(targetInnerRing);
  targetInnerRing.appendChild(targetBullsEye);

  return fullTarget;
}

function generateStartLocation() {
  let zones = [
    "0",
    "100px",
    "200px",
    "300px",
    "400px",
    "500px",
    "600px",
    "700px",
    "800px",
    "900px",
  ];
  let choice = randomInt(zones.length);
  return {
    top: "0px",
    left: zones[choice],
  };
}

function placeTarget() {
  let target = generateEnemy();
  let targetPosition = generateStartLocation();
  gallery.appendChild(target);
  target.style.top = targetPosition.top;
  target.style.left = targetPosition.left;
  moveEnemy(target);
}

/**
 * *************
 *    EVENTS   *
 * *************
 */

// Clear bullets
clearBullets.addEventListener("click", () => {
  let bullets = document.querySelectorAll(".bullet-hole");
  bullets.forEach((hole) => {
    hole.remove();
  });
  //bulletsFired = 0;
  //bulletCountDiv.textContent = "Rounds Fired: " + bulletsFired;
});

begin.addEventListener("click", () => {
  moveTarget();
});

stop.addEventListener("click", () => {
  stopTargetMove();
});

document.addEventListener("keydown", function (event) {
  if (event.code == "KeyR") {
    reload.click();
  }
  if (event.code == "KeyC") {
    clearBullets.click();
  }
});

function init() {
  loadWeapon(MAX_AMMO);
  let i = 0;
  let interval = setInterval(() => {
    console.log("running ", i);
    if (i < 2) {
      i++;
      placeTarget();
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

window.onload = () => {
  init();
};
