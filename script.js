// Constants
const VALID_TARGETS = ["battlefield", "target", "bullet", "enemy", "trooper"];
document.documentElement.style.setProperty("--animate-duration", ".5s");

// DOM
let pointDiv = document.querySelector("#points");
let crosshair = document.querySelector("#crosshair");
let player = document.querySelector("#player");
let battlefield = document.querySelector("#battlefield");
let clearBullets = document.querySelector("#clear");
let reload = document.querySelector("#reload");
let start = document.querySelector("#start");
let stop = document.querySelector("#stop");
let roundsFiredIndicator = document.querySelector("#bullet-count");
let magazine = document.querySelector("#magazine");
let difficultySelect = document.querySelector("#game-difficulty");
let gameModeSelect = document.querySelector("#game-mode");
let uiMessage = document.querySelector("#messages");
let killsScoredIndicator = document.querySelector("#kills");
let hitpointsDiv = document.querySelector("#hp");
let maxAmmoDiv = document.querySelector("#maxAmmo");
let gameRoundDiv = document.querySelector("#round");
let playerCover = document.querySelector("#cover");

// Player Stats
let reloadSpeed = 3000;
let maxPlayerAmmo = 10;
let maxPlayerHitpoints = 100;
let playerShootSpeed = 500;

// Variables
let currentPlayerAmmo = maxPlayerAmmo;
let currentPlayerHitpoints = maxPlayerHitpoints;
let difficultyLevel = "teasy";
let gameMode = "survival";
let gameInterval;
let msgInterval;
let playerDamageTaken = 10;

// Trackers
let points = 0;
let bulletsFired = 0;
let gameRound = 1;
let kills = 0;
let enemyCount = 0;

// State vars
let justFired = false;
let reloading = false;
let targetIsMoving = false;
let playerDefeated = false;

// DEV vars
let targetStoppedPosition = 10;
let targetSpeed = 3;
let intervalSpeed = 1;
let moveTargetInterval;

// SOUNDS
let rifle1 = new Audio("assets/gun-gunshot-01.wav");
let garand = new Audio("assets/m1garand.wav");
let whack = new Audio("assets/whack.wav");
let thud = new Audio("assets/woodthud.wav");
let reloadSound = new Audio("assets/rifle-reload.wav");
let empty = new Audio("assets/gunempty.wav");
let deathmoan = new Audio("assets/dying-sound.wav");
let defeatedSound = new Audio("assets/defeat.wav");
let victorySound = new Audio("assets/victory.wav");

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
      garand.currentTime = 0.02;
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
      empty.volume = 0.6;
      empty.play();
      break;
    case "deathmoan":
      // deathmoan.currentTime = 0;
      // deathmoan.volume = 0.5;
      // deathmoan.playbackRate = 2;
      // deathmoan.play();
      break;
    case "defeat":
      defeatedSound.currentTime = 0;
      defeatedSound.volume = 0.8;
      defeatedSound.play();
      break;
    case "victory":
      victorySound.currentTime = 0;
      victorySound.volume = 0.8;
      victorySound.play();
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

function reloadReminder() {
  if (currentPlayerAmmo < 5) {
    announce("You need to reload soon!");
  }
}

// Hit occured, create bullet hole and play sound
function isAHit(target, e) {
  bulletsFired++;
  let container = document.querySelector("#" + target);
  let bulletHole = createBulletHole();
  container.appendChild(bulletHole);

  if (
    e.target.classList.contains("target") ||
    e.target.classList.contains("trooper")
  ) {
    playSound("hit");
    points += 10;
    killTarget(container);
    kills++;
    if (isRoundCompleted()) {
      winRound();
    }
  }
  placeBullet(bulletHole, e);
}

function nextRoundCountDown() {
  // TODO
  // Create a 3 second timer to show a countdown to the next round based on the selected difficulty.
}

function winRound() {
  announce("Round " + gameRound + " is completed!");
  playSound("victory");
  advanceToNextRound();
}

function advanceToNextRound() {
  gameRound++;
  resetGame();
  updateUi();
}

function killTarget(targetElement) {
  // Get some data
  let hitPosition = targetElement.getBoundingClientRect();
  let targetInterval = targetElement.dataset.interval;

  // Create a dead body to place
  let casualty = makeCasualty();
  battlefield.appendChild(casualty);
  //playSound("deathmoan");

  // Stop the affected interval
  clearInterval(targetInterval);

  // Calculate where the dead body should be placed
  let casualtyTop = hitPosition.y - 35;
  let casualtyLeft = targetElement.dataset.left - hitPosition.width / 2;
  casualty.style.top = casualtyTop + "px";
  casualty.style.left = casualtyLeft + "px";

  // Remove the target that was hit
  targetElement.remove();
}

function fireOrReload() {
  return currentPlayerAmmo >= 0;
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
  roundsFiredIndicator.textContent = "Rounds Fired: " + bulletsFired;
  killsScoredIndicator.textContent = "Kills: " + kills;
  hitpointsDiv.textContent = "Hitpoints: " + currentPlayerHitpoints;
  gameRoundDiv.textContent = "Round: " + gameRound;
}

/**
 * Game announcement for various events
 * @param {string} message
 */
function announce(message = "Unknown event") {
  window.clearInterval(msgInterval);
  uiMessage.textContent = message;
  uiMessage.style.visibility = "visible";
  uiMessage.classList.add("animate__animated", "animate__slideInLeft");

  uiMessage.addEventListener("animationend", () => {
    uiMessage.classList.remove("animate__slideInLeft");
    msgInterval = setTimeout(() => {
      uiMessage.style.visibility = "hidden";
    }, 4000);
  });
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
function loadWeapon(rounds = maxPlayerAmmo) {
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
// function moveTarget() {
//   if (targetIsMoving) {
//     return;
//   }
//   const elem = document.getElementById("target-1");
//   let pos = targetStoppedPosition;
//   let dir = targetSpeed;
//   moveTargetInterval = setInterval(frame, intervalSpeed);

//   function frame() {
//     targetIsMoving = true;
//     if (pos >= 300) {
//       dir = -targetSpeed;
//     } else if (pos <= 0) {
//       dir = targetSpeed;
//     }
//     pos += dir;
//     elem.style.left = pos + "px";
//   }
// }
// Move Target
function moveEnemy(el) {
  let enemyStat = getEnemyStats();
  let pos = 1;
  let interval = setInterval(() => {
    if (pos < 900) {
      pos++;
    } else {
      window.clearInterval(interval);
      damagePlayer();
    }
    el.style.top = pos + "px";
  }, enemyStat.speed);
  el.dataset.interval = interval; // save the interval number so we can cancel later
}

function playerIsOutOfHp() {
  return currentPlayerHitpoints <= 0;
}

function damagePlayer() {
  announce("A enemy has broken through!");
  currentPlayerHitpoints -= playerDamageTaken;
  console.log("taking " + playerDamageTaken + " damage!");

  if (playerIsOutOfHp()) {
    currentPlayerHitpoints = 0;
    defeat();
  }

  updateUi();
}

function defeat() {
  announce("You have died!");
  resetGame();
  currentPlayerAmmo = 0;
  playerDefeated = true;
  kills = 0;
  points = 0;
  playSound("defeat");
  hideUiElements();
}

// Stop target movement
function stopTargetMove(id) {
  window.clearInterval(moveTargetInterval);
  targetIsMoving = false;
  targetStoppedPosition = document.getElementById("target-1").offsetLeft;
}

function removeTargets() {
  document.querySelectorAll(".trooper, .casualty").forEach((trooper) => {
    clearInterval(trooper.dataset.interval);
    trooper.remove();
  });
}

function gameStatus() {}

// Clear magazine
function resetMag() {
  magazine.querySelectorAll("img").forEach((bullet) => {
    bullet.remove();
  });
}

function resetGame() {
  enemyCount = 0;
  reloading = false;
  currentPlayerAmmo = maxPlayerAmmo;
  loadWeapon();
  clearBullets.click();
  removeTargets();
  clearInterval(gameInterval);
}

/**
 * ====================
 *      PRACTICE
 * ====================
 */
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

/**
 * ====================
 *      SURVIVAL
 * ====================
 */

/**
 *
 * @param {node} object - The node being appended to the base
 * @param {string} identifier - string identifier
 * @returns base - the composed html element.
 */
function generateItem(object, identifier) {
  const id = uuid();
  let base = document.createElement("div");
  base.setAttribute.draggable = false;
  base.id = `base-${identifier}-${id}`;
  base.classList.add("unselectable", identifier);

  object.id = `${identifier}-${id}`;
  base.appendChild(object);
  return base;
}

// Generate enemy trooper
function makeEnemy() {
  let choice = randomInt(enemySelection.length);
  let trooper = document.createElement("img");
  trooper.src = enemySelection[choice];
  return generateItem(trooper, "trooper");
}

// Create a casualty
function makeCasualty() {
  let casualty = document.createElement("img");
  casualty.src = "assets/casualty-green.png";
  return generateItem(casualty, "casualty");
}

// Randown spawn location for enemy
function generateSpawnLocation() {
  let zones = [
    "0",
    "80px",
    "160px",
    "240px",
    "320px",
    "380px",
    "460px",
    "540px",
    "620px",
    "700px",
    "780px",
    "860px",
    "940px",
  ];
  let choice = randomInt(zones.length);
  return {
    top: "0px",
    left: zones[choice],
  };
}

function createAndSpawnEnemy() {
  enemyCount++;
  let target = makeEnemy();
  let targetPosition = generateSpawnLocation();
  battlefield.appendChild(target);
  target.style.top = targetPosition.top;
  target.style.left = targetPosition.left;
  target.dataset.left = parseInt(targetPosition.left);
  moveEnemy(target);
}

function startGame() {
  initializeStartValues();
  showUiElements();
  logStartGame();
  startEnemeyWave();
}

function initializeStartValues() {
  currentPlayerHitpoints = maxPlayerHitpoints;
  playerDefeated = false;
  updateUi();
}

function logStartGame() {
  let enemyStat = getEnemyStats();
  console.log("Starting game: ", { ...enemyStat });
}

function hideUiElements() {
  playerCover.style.display = "none";
  player.style.display = "none";
  magazine.style.display = "none";
  gameRoundDiv.style.display = "none";
}

function showUiElements() {
  playerCover.style.display = "block";
  player.style.display = "block";
  magazine.style.display = "block";
  gameRoundDiv.style.display = "inline-block";
}

function startEnemeyWave() {
  let waveProperties = getEnemyStats();
  let i = 0;
  gameInterval = setInterval(() => {
    if (i < waveProperties.count) {
      i++;
      createAndSpawnEnemy();
    } else {
      clearInterval(gameInterval);
    }
  }, waveProperties.spawnRate);
}

function isRoundCompleted() {
  let waveProperties = getEnemyStats();
  return kills === waveProperties.count;
}

function resetRound() {
  rounds = 0;
}

function getEnemyStats() {
  let speed, count, spawnRate;

  switch (difficultyLevel) {
    case "teasy":
      speed = 20;
      spawnRate = 2400;
      playerDamageTaken = 8;
      count = 2;
      break;
    case "easy":
      speed = 18;
      spawnRate = 2000;
      playerDamageTaken = 10;
      count = 30;
      break;
    case "medium":
      speed = 16;
      spawnRate = 1600;
      playerDamageTaken = 15;
      count = 45;
      break;
    case "hard":
      speed = 12;
      spawnRate = 1400;
      playerDamageTaken = 18;
      count = 55;
      break;
    case "hardcore":
      speed = 8;
      spawnRate = 1200;
      playerDamageTaken = 25;
      count = 65;
      break;
    case "impossible":
      speed = 4;
      spawnRate = 900;
      playerDamageTaken = 30;
      count = 100;
      break;
  }

  return {
    speed,
    count,
    spawnRate,
  };
}

/**
 * *************
 *    EVENTS   *
 * *************
 */
// Make bullet holes - SHOOT
document.addEventListener("click", (e) => {
  if (justFired || playerDefeated) {
    return;
  }
  justFired = true;
  let id = e.target.id;
  if (isValidTarget(id) && !reloading) {
    currentPlayerAmmo--;

    // Handle hits
    if (fireOrReload()) {
      playSound("garand");
      isAHit(id, e);
    } else {
      playSound("empty");
      currentPlayerAmmo = 0;
    }
    // Update Bullet count
    loadWeapon(currentPlayerAmmo);

    // Update player ui
    updateUi();
  }
  setTimeout(() => {
    justFired = false;
  }, playerShootSpeed);
});

// Reload
reload.addEventListener("click", () => {
  if (reloading) return;
  if (currentPlayerAmmo === maxPlayerAmmo) {
    announce("Your magazine is full!");
    return;
  }
  reloading = true;
  announce("Realoading!");

  playSound("reload");
  setTimeout(() => {
    reloading = false;
    reloadSound.loop = false;
    loadWeapon();
    currentPlayerAmmo = maxPlayerAmmo;
  }, reloadSpeed);
});

// Clear bullets
clearBullets.addEventListener("click", () => {
  let bullets = document.querySelectorAll(".bullet-hole");
  bullets.forEach((hole) => {
    hole.remove();
  });
});

start.addEventListener("click", () => {
  let selectedDifficulty = difficultySelect.value;
  let selectedMode = gameModeSelect.value;
  resetGame();

  startGame(selectedDifficulty, selectedMode);
});

// Stop game
stop.addEventListener("click", () => {
  let endgame = confirm("Are you sure you want to end the game?");

  if (endgame) {
    resetGame();
  }
});

// Handle some key binds
document.addEventListener("keydown", function (event) {
  if (event.code == "KeyR") {
    reload.click();
  }
  if (event.code == "KeyC") {
    clearBullets.click();
  }
});

// Set game properties
difficultySelect.addEventListener("change", (e) => {
  difficultyLevel = e.target.value;
});

gameModeSelect.addEventListener("change", (e) => {
  gameMode = e.target.value;
});

function init() {
  loadWeapon(maxPlayerAmmo);
}

window.onload = () => {
  init();
};
