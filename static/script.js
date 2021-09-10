import {
  roundBg,
  enemyDivisionNames,
  defeatBackgrounds,
  enemySelectionLibrary,
  sound,
} from "./modules/assets.js";
import Helpers from "./modules/helpers.js";
import Upgrade from "./modules/upgrade.js";
import Memory from "./modules/memory.js";

window.onload = () => {
  // Init Classes
  const _ups = new Upgrade();
  const _helpers = new Helpers();
  const state = new Memory();

  // =============================== DEV TESTING

  // TODO - modifying player state based on upgrade selected
  /**
   * UPgrades - how they work
   *
   * 1. Player can access shop on victory screen if they have some number of points
   * 2. Clicking shop opens modal to reveal upgrades.
   * 3. If the player has the coins, they can buy a permamanenet stat boost from the available options.
   * 4. Selecting an upgrade opens confirmation dialog.
   * 5. If the player confirms, player stats are updated - points are subtracted, player is returned to previous victory screen.
   * >> Speed, reload and capacity upgrade levels are saved to state and next rank is offered next time.  Each rank costs more, there will be a maximum upgrade rank for each type of upgrade
   * 6. Player then starts next round.
   *
   */

  // upConfig.forEach((cfg) => {
  //   let upCard = _ups.getUpgradeCard(cfg);
  //   shopContainerDiv.appendChild(upCard);
  // });

  // async function getData() {
  //   return await fetch("./sample-data/sample.json");
  // }

  // async function retrieveData() {
  //   let promise = await getData();
  //   return await promise.json();
  // }

  // async function postData() {
  //   return await fetch("https://jsonplaceholder.typicode.com/posts", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       title: "foo",
  //       body: "bar",
  //       userId: 1,
  //     }),
  //     headers: {
  //       "Content-type": "application/json; charset=UTF-8",
  //     },
  //   });
  // }

  // (async () => {
  //   let promise = await postData();
  //   const data = await promise.json();
  //   console.log(data);
  // })();

  // =============================== DEV TESTING
  document.documentElement.style.setProperty("--animate-duration", ".5s");

  // DOM
  let shopModal = document.getElementById("shop-modal");
  let shopContainerDiv = document.getElementById("shop-container");
  let pointDiv = document.querySelector("#points");
  let crosshair = document.querySelector("#crosshair");
  let player = document.querySelector("#player");
  let battlefield = document.querySelector("#battlefield");
  let clearBullets = document.querySelector("#clear");
  let reload = document.querySelector("#reload");
  let start = document.querySelector("#start");
  //let stop = document.querySelector("#stop");
  let toolsContainer = document.querySelector("#tools");
  let roundsFiredIndicator = document.querySelector("#bullet-count");
  let magazine = document.querySelector("#magazine");
  let difficultySelect = document.querySelector("#game-difficulty");
  let gameModeSelect = document.querySelector("#game-mode");
  let uiMessage = document.querySelector("#messages");
  let killsScoredIndicator = document.querySelector("#kills");
  let totalKillsScoredIndicator = document.querySelector("#tkills");
  let playerCover = document.querySelector("#cover");
  let modal = document.querySelector("#modal-screen");
  let introText = document.querySelector("#intro");
  let roundSummary = document.querySelector("#roundSummary");
  let summarySpeed = document.querySelector("#e-speed");
  let summarySpawnRate = document.querySelector("#e-spawnrate");
  let summaryEnemyCount = document.querySelector("#e-count");
  let enemyNameElement = document.querySelector("#opponent-name");
  let restartGameButton = document.querySelector("#restart");
  let shopButton = document.getElementById("go-shop");

  // Player stat html
  let hitpointsDiv = document.querySelector("#hp");
  let maxAmmoDiv = document.querySelector("#maxAmmo");
  let reloadTimeDiv = document.querySelector("#reloadTime");
  let gameRoundDiv = document.querySelectorAll(".round");

  // Player Stats
  let reloadSpeed = 3000;
  let maxPlayerAmmo = 10;
  let maxPlayerHitpoints = 100;
  let playerShootSpeed = 1000;

  // Upgrade levels config
  let upgradeConfig = {
    reloadUpgrade: {
      level: 1,
      cost: 280,
      max_level: 20,
    },
    speedUpgrade: {
      level: 1,
      cost: 240,
      max_level: 15,
    },
    capacityUpgrade: {
      level: 1,
      cost: 320,
      max_level: 20,
    },
  };

  // Variables
  let currentPlayerAmmo = maxPlayerAmmo;
  let currentPlayerHitpoints = maxPlayerHitpoints;
  let difficultyLevel = "teasy";
  let gameMode = "survival";
  let gameInterval;
  let msgInterval;

  // Base enemy stats
  let enemySpeed = 1;
  let waveCount = 20;
  let enemySpawnFrequency = 2400;
  let playerDamageTaken = 5;
  let pointsEarned = 10;

  // Get difficulty max difficulty ramp up values
  let maxEnemyValues = _helpers.difficultyBounds();

  // Trackers
  let points = 0;
  let bulletsFired = 0;
  let gameRound = 1;
  let kills = 0;
  let totalKills = 0;
  let enemyCount = 0;
  let enemyBrokenThrough = 0;

  // State vars
  let justFired = false;
  let reloading = false;
  let targetIsMoving = false;
  let playerDefeated = false;
  let introHasPlayed = false;
  let enemyStatsSet = false;
  let enemySpeedMaxed = false;
  let enemySpawnRateMaxed = false;
  let enemyWaveCountMaxed = false;

  // DEV vars
  let targetStoppedPosition = 10;
  let targetSpeed = 3;
  let intervalSpeed = 1;
  let moveTargetInterval;

  // SOUNDS
  let rifle1 = sound.rifle1;
  let battleSound = sound.battleSound;
  let garand = sound.garand;
  let enfield = sound.enfield;
  let whack = sound.whack;
  let thud = sound.thud;
  let reloadSound = sound.reloadSound;
  let empty = sound.empty;
  let deathmoan = sound.deathmoan;
  let defeatedSound = sound.defeatedSound;
  let victorySound = sound.victorySound;
  let introMusic = sound.introMusic;
  introMusic.autoplay = true;
  introMusic.volume = 0.3;
  battleSound.loop = true;
  battleSound.volume = 0.1;

  let playerWeapon = enfield;
  const playerCenter = getCenter(player);

  // Assets
  let enemySelection = enemySelectionLibrary;
  let endOfRoundBg = roundBg;
  let enemyDivision = enemyDivisionNames;
  let defeatBg = defeatBackgrounds;

  /**
   * [0]================[0]
   *  |      HELPERS     |
   * [0]================[0]
   */
  function setInitialState() {
    state.save({ points, gameRound });
    state.save(upgradeConfig);
  }

  function getCenter(element) {
    const { left, top, width, height } = element.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2 };
  }

  // PLay sound files
  function playSound(sound) {
    switch (sound) {
      case "garand":
        playerWeapon.pause();
        playerWeapon.currentTime = 0.02;
        playerWeapon.play();
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

  /**
   * [0]================[0]
   *  |    GAME LOGIC    |
   * [0]================[0]
   */

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

      killTarget(container);
      incrementKills();
      incrementPoints();
      checkRoundComplete();
    }
    placeBullet(bulletHole, e);
  }

  function winRound() {
    stopBattleMusic();
    announce("Round " + gameRound + " is completed!");
    playSound("victory");
  }

  function incrementKills() {
    kills++;
    totalKills++;
    state.save({ totalKills });
  }

  function incrementPoints() {
    points += pointsEarned;
    state.save({ points });
  }

  // Take all the steps to start next round
  function advanceToNextRound() {
    gameRound++;
    resetGame();
    stepUpDifficulty();
    hideUiElements();
    updateUi();
    updateSummary();
    showGameModal();
    showShopButton();
    state.save({ gameRound });
  }

  function stepUpDifficulty() {
    console.log(maxEnemyValues[difficultyLevel].speed);
    if (enemySpeed < maxEnemyValues[difficultyLevel].speed) {
      enemySpeed += 0.1;
    } else {
      enemySpeed = maxEnemyValues[difficultyLevel].speed;
      enemySpeedMaxed = true;
    }

    if (waveCount < maxEnemyValues[difficultyLevel].count) {
      waveCount += 1;
    } else {
      waveCount = maxEnemyValues[difficultyLevel].count;
      enemyWaveCountMaxed = true;
    }

    if (enemySpawnFrequency > maxEnemyValues[difficultyLevel].spawnRate) {
      enemySpawnFrequency -= 100;
    } else {
      enemySpawnFrequency = maxEnemyValues[difficultyLevel].spawnRate;
      enemySpawnRateMaxed = true;
    }
  }

  // When the target dies
  function killTarget(targetElement) {
    // Get some data
    let hitPosition = targetElement.getBoundingClientRect();
    let camoColor = targetElement.querySelector("img").dataset.camo;
    let targetInterval = targetElement.dataset.interval;

    // Create a dead body to place
    let casualty = makeCasualty(camoColor);
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

  // Move Target
  function moveEnemy(el) {
    let pos = 1;
    let interval = setInterval(() => {
      if (pos < 900) {
        pos += enemySpeed;
      } else {
        window.clearInterval(interval);
        damagePlayer();
      }
      el.style.top = pos + "px";
    }, 15 - enemySpeed);
    el.dataset.interval = interval; // save the interval number so we can cancel later
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

  // Clear magazine
  function resetMag() {
    magazine.querySelectorAll("img").forEach((bullet) => {
      bullet.remove();
    });
  }

  function resetGame() {
    enemyCount = 0;
    enemyBrokenThrough = 0;
    kills = 0;
    reloading = false;
    currentPlayerAmmo = maxPlayerAmmo;
    loadWeapon();
    clearBullets.click();
    removeTargets();
    clearInterval(gameInterval);
  }

  /**
   * [0]================[0]
   *  |     PRACTICE     |
   * [0]================[0]
   */

  // Create a target to shoot at
  // TODO - code up practice mode
  function generateTarget() {
    // Practice targets
    const id = _helpers.uuid();
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
   * [0]================[0]
   *  |    GAME LOOP     |
   * [0]================[0]
   */

  function startGame() {
    startBattleMusic();
    setEnemyStats();
    stopIntroMusic();
    hideDefeatUi();
    hideGameModal();
    initializeStartValues();
    showUiElements();
    logStartGame();
    startEnemeyWave();
  }

  function debugMode() {
    setEnemyStats();
    stopIntroMusic();
    hideDefeatUi();
    hideGameModal();
    initializeStartValues();
    showUiElements();
  }

  function isDebug() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const debug = urlParams.get("debug");
    if (Boolean(debug)) {
      return true;
    }
    return false;
  }

  // Generate enemy trooper
  function makeEnemy() {
    let choice = _helpers.randomInt(enemySelection.length);
    let trooper = document.createElement("img");
    let camoColor =
      enemySelection[choice].indexOf("gray") > -1 ? "gray" : "green";
    trooper.src = enemySelection[choice];
    trooper.dataset.camo = camoColor;
    return _helpers.generateItem(trooper, "trooper");
  }

  // Create a dead model when a target is killed
  function makeCasualty(camoColor) {
    let casualty = document.createElement("img");
    if (camoColor === "gray") {
      casualty.src = "assets/casualty-gray.png";
    } else {
      casualty.src = "assets/casualty-green.png";
    }
    return _helpers.generateItem(casualty, "casualty");
  }

  function createAndSpawnEnemy() {
    enemyCount++;
    let target = makeEnemy();
    let targetPosition = _helpers.generateSpawnLocation();
    battlefield.appendChild(target);
    target.style.top = targetPosition.top;
    target.style.left = targetPosition.left;
    target.dataset.left = parseInt(targetPosition.left);
    moveEnemy(target);
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

  function startBattleMusic() {
    battleSound.currentTime = 0;
    battleSound.play();
  }

  function stopBattleMusic() {
    battleSound.pause();
    battleSound.currentTime = 0;
  }

  function initializeStartValues() {
    playerDefeated = false;
    updateSummary();
    updateUi();
  }

  // Check is the player is still alive
  function playerIsOutOfHp() {
    return currentPlayerHitpoints <= 0;
  }

  function damagePlayer() {
    enemyBrokenThrough++;
    announce("A enemy has broken through!");
    currentPlayerHitpoints -= playerDamageTaken;
    if (playerIsOutOfHp()) {
      currentPlayerHitpoints = 0;
      defeat();
    }
    checkRoundComplete();
    updateUi();
  }

  function checkRoundComplete() {
    if (isRoundCompleted()) {
      winRound();
      setTimeout(() => {
        advanceToNextRound();
      }, 1500);
    }
  }

  // The player is dead
  function defeat() {
    announce("You have been overrun!");
    resetGame();
    currentPlayerAmmo = 0;
    playerDefeated = true;
    points = 0;
    playSound("defeat");
    hideUiElements();
    showDefeatUi();
    showGameModal();
  }

  function stopIntroMusic() {
    if (!introMusic) {
      return;
    }
    introMusic.pause();
    introMusic.currentTime = 0;
  }

  function startIntroMusic() {
    if (!introMusic) {
      return;
    }
    introMusic.muted = false;
    introMusic.currentTime = 0;
    introMusic.play();
  }

  function logStartGame() {
    console.log("Starting game: ", {
      enemySpeed,
      enemySpawnFrequency,
      waveCount,
      gameRound,
    });
  }

  /**
   * [0]================[0]
   *  |        UI        |
   * [0]================[0]
   */

  // Sets a random enemy name at the beginning of the game
  function setEnemyName() {
    let choice = _helpers.randomInt(enemyDivision.length);
    enemyNameElement.innerHTML = `<i class="fas fa-compress"></i>  ${enemyDivision[choice]}`;
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
    gameRoundDiv.forEach((div) => {
      div.textContent = "Round: " + gameRound;
    });
    totalKillsScoredIndicator.textContent = "Total Kills: " + totalKills;
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

  function updateSummary() {
    summarySpeed.innerHTML =
      "Speed: " +
      "<span>" +
      enemySpeed.toFixed(2) +
      (enemySpeedMaxed ? " (Maxed)" : "") +
      "</span>";
    summarySpawnRate.innerHTML =
      "Reinforcement Frequency: " +
      "<span>" +
      enemySpawnFrequency +
      "ms" +
      (enemySpawnRateMaxed ? " (Maxed)" : "") +
      "</span>";
    summaryEnemyCount.innerHTML =
      "Attacking Troops: " +
      "<span>" +
      waveCount +
      (enemyWaveCountMaxed ? " (Maxed)" : "") +
      "</span>";
  }

  function hideGameModal() {
    if (introText) {
      introText.style.display = "none";
    }
    modal.style.display = "none";
  }

  function showGameModal() {
    setRandomModalBG();
    modal.style.display = "block";
  }

  function showShopModal() {
    shopModal.style.display = "block";
  }

  function hideShopModal() {
    shopModal.style.display = "none";
  }

  function setRandomModalBG() {
    let choiceLibrary = playerDefeated ? defeatBg : endOfRoundBg;
    let choice = _helpers.randomInt(choiceLibrary.length);
    modal.querySelector("#gameModal").style.backgroundImage =
      "url(" + choiceLibrary[choice] + ")";
  }

  function hideUiElements() {
    battlefield.classList.add("no-interact");
    playerCover.style.display = "none";
    magazine.style.display = "none";
    player.classList.add("invisible");
  }

  function showShopButton() {
    if (gameRound > 1) {
      shopButton.style.display = "inline-block";
    }
  }

  function showUiElements() {
    if (gameRound === 1) {
      battlefield.style.visibility = "visible";
      toolsContainer.style.visibility = "visible";
    }
    battlefield.classList.remove("no-interact");
    playerCover.style.display = "block";
    magazine.style.display = "block";
    gameRoundDiv.forEach((div) => {
      div.style.display = "inline-block";
    });
    player.classList.remove("invisible");
  }

  function showDefeatUi() {
    modal.querySelector("#intro").style.display = "none";
    modal.querySelector(".round-menu").style.display = "none";
    modal.querySelector("#defeat-content").style.display = "block";
  }

  function hideDefeatUi() {
    modal.querySelector("#intro").style.display = "block";
    modal.querySelector(".round-menu").style.display = "block";
    modal.querySelector("#defeat-content").style.display = "none";
  }

  // Begin spawning enemy targets when a round begins
  function startEnemeyWave() {
    let i = 0;
    gameInterval = setInterval(() => {
      if (i < waveCount) {
        i++;
        createAndSpawnEnemy();
      } else {
        clearInterval(gameInterval);
      }
    }, enemySpawnFrequency);
  }

  function isRoundCompleted() {
    return kills + enemyBrokenThrough === waveCount;
  }

  function resetRound() {
    rounds = 0;
  }

  function setEnemyStats() {
    if (enemyStatsSet) {
      return;
    }
    enemyStatsSet = true;
    switch (difficultyLevel) {
      case "teasy":
        enemySpeed = 1;
        waveCount = 1;
        enemySpawnFrequency = 2400;
        playerDamageTaken = 5;
        pointsEarned = 10;
        break;
      case "easy":
        enemySpeed = 1.1;
        waveCount = 22;
        enemySpawnFrequency = 2300;
        playerDamageTaken = 8;
        pointsEarned = 12;
        break;
      case "medium":
        enemySpeed = 1.2;
        waveCount = 28;
        enemySpawnFrequency = 2100;
        playerDamageTaken = 10;
        pointsEarned = 14;
        break;
      case "hard":
        enemySpeed = 1.3;
        waveCount = 34;
        enemySpawnFrequency = 1900;
        playerDamageTaken = 12;
        pointsEarned = 16;
        break;
      case "epic":
        enemySpeed = 1.4;
        waveCount = 40;
        enemySpawnFrequency = 1500;
        playerDamageTaken = 16;
        pointsEarned = 18;
        break;
    }
  }
  /**
   * [0]================[0]
   *  |     UPGRADES     |
   * [0]================[0]
   */
  // TODO -- Build an upgrade system where the player can purchase upgrade with points earned
  function createAndRenderUpgrades() {
    const { capacityUpgrade, reloadUpgrade, speedUpgrade } = state.read();
    // There are only 3 types of upgrades, speed, capacity and reload.
    const capacityUp = {
      type: "capacity",
      description: "+2 Magazine Capacity",
      cost: capacityUpgrade.cost,
      level: capacityUpgrade.level,
    };
    const speedUp = {
      type: "speed",
      description: "-50ms Firing Speed",
      cost: speedUpgrade.cost,
      level: speedUpgrade.level,
    };
    const reloadUp = {
      type: "reload",
      description: "-200ms Realod Time",
      cost: reloadUpgrade.cost,
      level: reloadUpgrade.level,
    };

    const upConfig = [];
    if (capacityUpgrade.level < capacityUpgrade.max_level) {
      upConfig.push(capacityUp);
    }
    if (speedUpgrade.level < speedUpgrade.max_level) {
      upConfig.push(speedUp);
    }
    if (reloadUpgrade.level < reloadUpgrade.max_level) {
      upConfig.push(reloadUp);
    }

    upConfig.forEach((cfg) => {
      let upCard = _ups.getUpgradeCard(cfg);
      shopContainerDiv.appendChild(upCard);
    });
  }

  function showUpgradePurchaseAbility() {}
  /**
   * [0]================[0]
   *  |      EVENTS      |
   * [0]================[0]
   */

  shopButton.addEventListener("click", () => {
    hideGameModal();
    showShopModal();
    createAndRenderUpgrades();
  });

  addEventListener("mousemove", (e) => {
    const angle = Math.atan2(
      e.clientY - playerCenter.y,
      e.clientX - playerCenter.x
    );
    player.style.transform = `rotate(${angle + 1.5}rad)`;
  });

  // Make bullet holes - SHOOT
  document.addEventListener("click", (e) => {
    if (justFired || playerDefeated) {
      return;
    }
    justFired = true;
    let id = e.target.id;
    if (_helpers.isValidTarget(id) && !reloading) {
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
    resetGame();
    startGame();
  });

  restartGameButton.addEventListener("click", () => {
    // TODO - go back to main menu instead - not just restart
    resetGame();
    startGame();
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

  // Have to interacting with the app to play intro music
  function canPlayIntro() {
    document.addEventListener("click", () => {
      if (!introHasPlayed) {
        introHasPlayed = true;
        startIntroMusic();
      }
    });
  }

  // Set game properties
  difficultySelect.addEventListener("change", (e) => {
    difficultyLevel = e.target.value;
    enemyStatsSet = false; // This is only available at the beginning so we want to be able to change the stats
    setEnemyStats();
    setTimeout(() => {
      updateSummary();
    });
  });

  /**
   * [0]==========================================================[0]
   */

  // Initialize Game
  function init() {
    if (isDebug()) {
      debugMode();
    } else {
      setInitialState();
      setEnemyStats();
      setEnemyName();
      canPlayIntro();
      updateSummary();
      loadWeapon(maxPlayerAmmo);
    }
  }

  init();
};
