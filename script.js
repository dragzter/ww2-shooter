window.onload = () => {
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
  //let stop = document.querySelector("#stop");
  let toolsCoontainer = document.querySelector("#tools");
  let roundsFiredIndicator = document.querySelector("#bullet-count");
  let magazine = document.querySelector("#magazine");
  let difficultySelect = document.querySelector("#game-difficulty");
  let gameModeSelect = document.querySelector("#game-mode");
  let uiMessage = document.querySelector("#messages");
  let killsScoredIndicator = document.querySelector("#kills");
  let totalKillsScoredIndicator = document.querySelector("#tkills");
  let hitpointsDiv = document.querySelector("#hp");
  let maxAmmoDiv = document.querySelector("#maxAmmo");
  let gameRoundDiv = document.querySelectorAll(".round");
  let playerCover = document.querySelector("#cover");
  let modal = document.querySelector("#modal-screen");
  let introText = document.querySelector("#intro");
  let roundSummary = document.querySelector("#roundSummary");
  let summarySpeed = document.querySelector("#e-speed");
  let summarySpawnRate = document.querySelector("#e-spawnrate");
  let summaryEnemyCount = document.querySelector("#e-count");
  let enemyNameElement = document.querySelector("#opponent-name");
  let restartGameButton = document.querySelector("#restart");

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

  // Base enemy stats
  let enemySpeed = 1;
  let waveCount = 20;
  let enemySpawnFrequency = 2400;
  let playerDamageTaken = 5;
  let pointsEarned = 10;

  let maxEnemyValues = {
    teasy: {
      speed: 2,
      spawnRate: 1800,
      count: 70,
    },
    easy: {
      speed: 3,
      spawnRate: 1400,
      count: 90,
    },
    medium: {
      speed: 4,
      spawnRate: 1200,
      count: 110,
    },
    hard: {
      speed: 5,
      spawnRate: 1000,
      count: 130,
    },
    epic: {
      speed: 6,
      spawnRate: 800,
      count: 170,
    },
  };

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
  let rifle1 = new Audio("assets/gun-gunshot-01.wav");
  let garand = new Audio("assets/m1garand.wav");
  let whack = new Audio("assets/whack.wav");
  let thud = new Audio("assets/woodthud.wav");
  let reloadSound = new Audio("assets/rifle-reload.wav");
  let empty = new Audio("assets/gunempty.wav");
  let deathmoan = new Audio("assets/dying-sound.wav");
  let defeatedSound = new Audio("assets/defeat.wav");
  let victorySound = new Audio("assets/victory.wav");
  let introMusic = new Audio("assets/intro.mp3");
  introMusic.autoplay = true;
  introMusic.volume = 0.1;

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

  let endOfRoundBg = [
    "assets/endofround2.jpg",
    "assets/endofround3.png",
    "assets/endofround4.jpg",
    "assets/endofround5.jpg",
    "assets/endofround6.jpg",
    "assets/endofround7.jpg",
    "assets/endofround8.jpg",
    "assets/endofround9.jpg",
    "assets/endofround10.jpg",
    "assets/endofround11.jpg",
    "assets/endofround12.jpg",
    "assets/endofround13.jpg",
    "assets/endofround14.jpg",
    "assets/endofround15.jpg",
    "assets/endofround16.jpg",
    "assets/endofround17.jpg",
    "assets/endofround18.jpg",
    "assets/endofroundimg.jpg",
  ];

  let enemyDivisons = [
    "Panzer Division Müncheberg",
    "12th Volksgrenadier Division",
    "15th Panzergrenadier Division",
    "22nd Volksgrenadier Division",
    "36th Volksgrenadier Division",
    "62nd Volksgrenadier Division",
    "117th Jäger Division",
    "183rd Volksgrenadier Division",
    "538th Frontier Guard Division",
    "104th Jäger Division",
    "4th Mountain Division",
    "6th Mountain Division",
    "233rd Panzergrenadier Division",
    "156th Field Replacement Division",
    "100th Light Infantry Division",
    "20th Motorized Infantry Division",
  ];

  let defeatBg = [
    "assets/defeat1.jpg",
    "assets/defeat2.jpg",
    "assets/defeat3.jpg",
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
      points += pointsEarned;
      killTarget(container);
      kills++;
      totalKills++;
      checkRoundComplete();
    }
    placeBullet(bulletHole, e);
  }

  function setEnemyName() {
    let choice = randomInt(enemyDivisons.length);
    enemyNameElement.innerHTML = `<i class="fas fa-compress"></i>  ${enemyDivisons[choice]}`;
  }

  function winRound() {
    announce("Round " + gameRound + " is completed!");
    playSound("victory");
  }

  function advanceToNextRound() {
    gameRound++;
    resetGame();
    stepUpDifficulty();
    hideUiElements();
    updateUi();
    updateSummary();
    showGameModal();
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
    setEnemyStats();
    hideDefeatUi();
    stopIntroMusic();
    hideGameModal();
    initializeStartValues();
    showUiElements();
    logStartGame();
    startEnemeyWave();
  }

  function initializeStartValues() {
    playerDefeated = false;
    updateSummary();
    updateUi();
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
    let choiceLibrary = playerDefeated ? defeatBg : endOfRoundBg;
    let choice = randomInt(choiceLibrary.length);
    modal.querySelector("#gameModal").style.backgroundImage =
      "url(" + choiceLibrary[choice] + ")";
    modal.style.display = "block";
  }

  function logStartGame() {
    console.log("Starting game: ", {
      enemySpeed,
      enemySpawnFrequency,
      waveCount,
    });
  }

  function hideUiElements() {
    battlefield.classList.add("no-interact");
    playerCover.style.display = "none";
    magazine.style.display = "none";
    player.classList.add("invisible");
  }

  function showUiElements() {
    if (gameRound === 1) {
      battlefield.style.visibility = "visible";
      toolsCoontainer.style.visibility = "visible";
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
        waveCount = 18;
        enemySpawnFrequency = 2400;
        playerDamageTaken = 100;
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
        playerDamageTaken = 14;
        pointsEarned = 18;
        break;
    }
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
    resetGame();
    startGame();
  });

  restartGameButton.addEventListener("click", () => {
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

  document.addEventListener("click", () => {
    if (!introHasPlayed) {
      introHasPlayed = true;
      startIntroMusic();
    }
  });

  // Set game properties
  difficultySelect.addEventListener("change", (e) => {
    difficultyLevel = e.target.value;
    enemyStatsSet = false; // This is only available at the beginning so we want to be able to change the stats
    setEnemyStats();
    setTimeout(() => {
      updateSummary();
    });
  });

  function init() {
    setEnemyName();
    updateSummary();
    loadWeapon(maxPlayerAmmo);
  }

  init();
};
