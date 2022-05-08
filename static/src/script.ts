import {
  roundBg,
  enemyDivisionNames,
  defeatBackgrounds,
  enemySelectionLibrary,
  enemySelectionTeamsLibrary,
  sound,
} from "./modules/assets";
import Helpers from "./modules/helpers";
import Upgrade from "./modules/upgrade";
import Memory from "./modules/memory";
import { SpawnConfig, UpgradeConfig, CustomHTML } from "./types";

window.onload = () => {
  // Init Classes
  const _ups = new Upgrade();
  const _helpers = new Helpers();
  const state = new Memory();

  document.documentElement.style.setProperty("--animate-duration", ".5s");

  // DOM
  let shopModal: HTMLElement = document.getElementById("shop-modal") as HTMLElement;
  let shopContainerDiv: HTMLElement = document.getElementById("shop-container") as HTMLElement;
  let pointDiv: HTMLElement = document.querySelector("#points") as HTMLElement;
  let player: HTMLElement = document.querySelector("#player") as HTMLElement;
  let battlefield: HTMLElement = document.querySelector("#battlefield") as HTMLElement;
  let clearBullets: HTMLElement = document.querySelector("#clear") as HTMLElement;
  let reload: HTMLElement = document.querySelector("#reload") as HTMLElement;
  let start: HTMLElement = document.querySelector("#start") as HTMLElement;
  //let stop = document.querySelector("#stop");
  let toolsContainer: HTMLElement = document.querySelector("#tools") as HTMLElement;
  let roundsFiredIndicator: HTMLElement = document.querySelector("#bullet-count") as HTMLElement;
  let magazine: HTMLElement = document.querySelector("#magazine") as HTMLElement;
  let difficultySelect: HTMLElement = document.querySelector("#game-difficulty") as HTMLElement;
  //let gameModeSelect = document.querySelector("#game-mode") as HTMLElement;
  let uiMessage: HTMLElement = document.querySelector("#messages") as HTMLElement;
  let killsScoredIndicator: HTMLElement = document.querySelector("#kills") as HTMLElement;
  let totalKillsScoredIndicator: HTMLElement = document.querySelector("#tkills") as HTMLElement;
  let playerCover: HTMLElement = document.querySelector("#cover") as HTMLElement;
  let modal: CustomHTML = document.querySelector("#modal-screen") as CustomHTML;
  let introText: HTMLElement = document.querySelector("#intro") as HTMLElement;
  //let roundSummary = document.querySelector("#roundSummary") as HTMLElement;
  let summarySpeed: HTMLElement = document.querySelector("#e-speed") as HTMLElement;
  let summarySpawnRate: HTMLElement = document.querySelector("#e-spawnrate") as HTMLElement;
  let summaryEnemyCount: HTMLElement = document.querySelector("#e-count") as HTMLElement;
  let enemyNameElement: HTMLElement = document.querySelector("#opponent-name") as HTMLElement;
  let restartGameButton: HTMLElement = document.querySelector("#restart") as HTMLElement;
  let shopButton: HTMLElement = document.getElementById("go-shop") as HTMLElement;
  let shopPointsDiv: HTMLElement = document.getElementById("shop-points") as HTMLElement;
  let backToMenuBtn: HTMLElement = document.getElementById("back-to-menu") as HTMLElement;
  let hpLabel: HTMLElement = document.getElementById("hp-label") as HTMLElement;
  let notifyWindowTooShort: HTMLElement = document.getElementById(
    "notify-window-too-short"
  ) as HTMLElement;

  // Player stat html
  let hitpointsDiv: CustomHTML = document.querySelector("#hp");
  let playerMaxAmmoDiv: CustomHTML = document.querySelector("#maxAmmo");
  let playerShootSpeedDiv: HTMLElement = document.getElementById("shootSpeed");
  let playerReloadSpeedDiv: CustomHTML = document.querySelector("#reloadTime");
  let gameRoundDiv: NodeList = document.querySelectorAll(".round");

  // Player Stats
  let reloadSpeed: number = 4000;
  let maxPlayerAmmo: number = 10;
  let maxPlayerHitpoints: number = 100;
  let playerShootSpeed: number = 1000;

  // Upgrade levels config
  let upgradeConfig: UpgradeConfig = {
    reloadUpgrade: {
      level: 1,
      type: "reload",
      cost: 280,
      value: 180,
      max_level: 20,
    },
    speedUpgrade: {
      level: 1,
      type: "speed",
      cost: 240,
      value: 50,
      max_level: 15,
    },
    capacityUpgrade: {
      level: 1,
      type: "capacity",
      cost: 300,
      value: 2,
      max_level: 20,
    },
  };

  const spawnConfig: SpawnConfig = {
    teasy: {
      enemySpeed: 1,
      waveCount: 18,
      enemySpawnFrequency: 2400,
      playerDamageTaken: 5,
      pointsEarned: 10,
      troopers: 17,
      teams: 1,
    },
    easy: {
      enemySpeed: 1.1,
      waveCount: 22,
      enemySpawnFrequency: 2300,
      playerDamageTaken: 8,
      pointsEarned: 12,
      troopers: 20,
      teams: 2,
    },
    medium: {
      enemySpeed: 1.2,
      waveCount: 28,
      enemySpawnFrequency: 2100,
      playerDamageTaken: 10,
      pointsEarned: 14,
      troopers: 22,
      teams: 6,
    },
    hard: {
      enemySpeed: 1.3,
      waveCount: 34,
      enemySpawnFrequency: 1900,
      playerDamageTaken: 12,
      pointsEarned: 16,
      troopers: 26,
      teams: 8,
    },
    epic: {
      enemySpeed: 1.4,
      waveCount: 40,
      enemySpawnFrequency: 1500,
      playerDamageTaken: 16,
      pointsEarned: 18,
      troopers: 28,
      teams: 12,
    },
  };

  // Variables
  let currentPlayerAmmo: number = maxPlayerAmmo;
  let currentPlayerHitpoints: number = maxPlayerHitpoints;
  let difficultyLevel: string = "teasy";
  let gameInterval: number;
  let msgInterval: number;

  // Base enemy stats
  let enemySpeed: number = 1;
  let waveCount: number = 20;
  let enemySpawnFrequency: number = 2400;
  let playerDamageTaken: number = 5;
  let pointsEarned: number = 10;

  // Get difficulty max difficulty ramp up values
  let maxEnemyValues: any = _helpers.difficultyBounds();

  // Trackers
  let points = 0;
  let totalPoints = 0;
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
  let windowTooShort = false;

  // DEV vars
  let targetStoppedPosition = 10;
  let targetSpeed = 3;
  let intervalSpeed = 1;
  let moveTargetInterval;

  // SOUNDS
  let battleSound = sound.battleSound;
  let enfield = sound.enfield;
  let thud = sound.thud;
  let reloadSound = sound.reloadSound;
  let empty = sound.empty;
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
  let enemyTeamsSelection = enemySelectionTeamsLibrary;
  let endOfRoundBg = roundBg;
  let enemyDivision = enemyDivisionNames;
  let defeatBg = defeatBackgrounds;

  /**
   * [0]================[0]
   *  |      HELPERS     |
   * [0]================[0]
   */
  function setInitialState(): void {
    state.save({ points, gameRound, totalKills });
    state.save(upgradeConfig);
  }

  // If the window is not tlal enough , we do not play.
  function checkWindowHeight(): void {
    if (window.innerHeight < 950) {
      alert("Your browser window is not tall enough.  The recommended minimum height is 950px.");
      battlefield.remove();
      modal.remove();
      windowTooShort = true;
      notifyWindowTooShort.style.display = "block";
    }
  }

  function getCenter(element: any) {
    const { left, top, width, height } = element.getBoundingClientRect();
    return { x: left + width / 2, y: top + height / 2 };
  }

  // PLay sound files
  function playSound(sound: any) {
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
  function isAHit(target: any, e: any): void {
    bulletsFired++;
    let container: any = document.querySelector("#" + target);
    let bulletHole = createBulletHole();
    container.appendChild(bulletHole);

    if (e.target.classList.contains("target") || e.target.classList.contains("trooper")) {
      playSound("hit");

      killTarget(container);
      incrementKills();
      incrementPoints();
      checkRoundComplete();
    }
    placeBullet(bulletHole, e);
  }

  function winRound(): void {
    stopBattleMusic();
    announce("Round " + gameRound + " is completed!");
    playSound("victory");
  }

  function incrementKills(): void {
    kills++;
    totalKills++;
    state.save({ totalKills });
  }

  function incrementPoints(): void {
    points += pointsEarned + gameRound;
    state.save({ points });
  }

  // Take all the steps to start next round
  function advanceToNextRound(): void {
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

  function stepUpDifficulty(): void {
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
  function killTarget(targetElement: any): void {
    // Get some data
    let hitPosition = targetElement.getBoundingClientRect();
    let targetElementImage = targetElement.querySelector("img");
    let { camo, wounds } = targetElementImage.dataset;
    let targetInterval = targetElement.dataset.interval;
    targetElementImage.dataset.wounds = parseInt(wounds) - 1;
    // Create a dead body to place
    if (targetElementImage.dataset.wounds === "0") {
      let casualty = makeCasualty(camo);
      battlefield.appendChild(casualty);

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
  }

  function fireOrReload(): boolean {
    return currentPlayerAmmo >= 0;
  }

  // Move Target
  function moveEnemy(el: any): void {
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

  function removeTargets(): void {
    document.querySelectorAll(".trooper, .casualty").forEach((trooper: any) => {
      clearInterval(trooper.dataset.interval);
      trooper.remove();
    });
  }

  // Clear magazine
  function resetMag(): void {
    magazine.querySelectorAll("img").forEach((bullet: any) => {
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
   *  |    GAME LOOP     |
   * [0]================[0]
   */

  function startGame(): void {
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

  function debugMode(): void {
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
  function generateEnemy(type: any) {
    let choice = _helpers.randomInt(enemySelection.length);
    let trooper = document.createElement("img");
    let camoColor = enemySelection[choice].indexOf("gray") > -1 ? "gray" : "green";
    trooper.src = enemySelection[choice];
    trooper.dataset.camo = camoColor;
    return _helpers.generateItem(trooper, type);
  }

  // Create a dead model when a target is killed
  function makeCasualty(camoColor: any) {
    let casualty = document.createElement("img");
    if (camoColor === "gray") {
      casualty.src = "src/assets/casualty-gray.png";
    } else {
      casualty.src = "src/assets/casualty-green.png";
    }
    return _helpers.generateItem(casualty, "casualty");
  }

  function spawnEnemy(): void {
    enemyCount++;
    let target: HTMLElement = generateEnemy("trooper");
    let targetPosition = _helpers.generateSpawnLocation();
    battlefield.appendChild(target);
    target.style.top = targetPosition.top;
    target.style.left = targetPosition.left;
    target.dataset.left = parseInt(targetPosition.left).toString();
    moveEnemy(target);
  }

  // Create bullet hole element and return it
  function createBulletHole() {
    let bulletHole = document.createElement("div");
    bulletHole.classList.add("bullet-hole", "animate__animated", "animate__pulse");
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
      img.src = "src/assets/bullet.png";
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
    announce("An enemy has broken through!");
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
    //introMusic.play();
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
  function placeBullet(bulletEl: any, e: any) {
    bulletEl.style.left = e.offsetX - 2.5 + "px";
    bulletEl.style.top = e.offsetY - 2.5 + "px";
  }

  // Communicate state in ui - ammo count, reload etc.
  function updateUi() {
    playerMaxAmmoDiv.textContent = `Max Ammo: ${maxPlayerAmmo}`;
    playerShootSpeedDiv.textContent = `Shoot Speed: ${playerShootSpeed}ms`;
    playerReloadSpeedDiv.textContent = `Reaload Speed: ${reloadSpeed}ms`;
    shopPointsDiv.textContent = points + " points remaining.";
    pointDiv.textContent = "Points: " + points;
    roundsFiredIndicator.textContent = "Rounds Fired: " + bulletsFired;
    killsScoredIndicator.textContent = "Kills: " + kills;
    hitpointsDiv.value = currentPlayerHitpoints;
    hpLabel.textContent = `Health: ${currentPlayerHitpoints}%`;
    gameRoundDiv.forEach((div: any) => {
      div.textContent = "Round: " + gameRound;
    });
    totalKillsScoredIndicator.textContent = "Total Kills: " + totalKills;
    state.save({ points, totalKills, gameRound });
  }

  function movePlayer(arrow: string) {
    const currentPosition = getPlayerPosition();
    const maxLeft = 50;
    const maxRight = 950;
    const step = 50;
    let newPosition;
    if (arrow === "ArrowLeft") {
      // move player left
      newPosition = currentPosition - step;
    } else {
      // move player right
      newPosition = currentPosition + step;
    }
    player.style.left = newPosition + "px";
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

  function updateSummary(): void {
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

  function hideGameModal(): void {
    if (introText) {
      introText.style.display = "none";
    }
    modal.style.display = "none";
  }

  function showGameModal(): void {
    setRandomModalBG();
    modal.style.display = "block";
  }

  function showShopModal(): void {
    shopModal.style.display = "block";
  }

  function hideShopModal(): void {
    shopModal.style.display = "none";
  }

  function setRandomModalBG(): void {
    let choiceLibrary = playerDefeated ? defeatBg : endOfRoundBg;
    let choice = _helpers.randomInt(choiceLibrary.length);
    (modal.querySelector("#gameModal") as CustomHTML).style.backgroundImage =
      "url(" + choiceLibrary[choice] + ")";
  }

  function hideUiElements(): void {
    battlefield.classList.add("no-interact");
    playerCover.style.display = "none";
    magazine.style.display = "none";
    player.classList.add("invisible");
  }

  function showShopButton(): void {
    if (gameRound > 1) {
      shopButton.style.display = "inline-block";
    }
  }

  function showUiElements(): void {
    if (gameRound === 1) {
      battlefield.style.visibility = "visible";
      toolsContainer.style.visibility = "visible";
    }
    battlefield.classList.remove("no-interact");
    playerCover.style.display = "block";
    magazine.style.display = "block";
    gameRoundDiv.forEach((div: any) => {
      div.style.display = "inline-block";
    });
    player.classList.remove("invisible");
  }

  function showDefeatUi(): void {
    (modal.querySelector("#intro") as CustomHTML).style.display = "none";
    (modal.querySelector(".round-menu") as CustomHTML).style.display = "none";
    (modal.querySelector("#defeat-content") as CustomHTML).style.display = "block";
  }

  function hideDefeatUi(): void {
    (modal.querySelector("#intro") as CustomHTML).style.display = "block";
    (modal.querySelector(".round-menu") as CustomHTML).style.display = "block";
    (modal.querySelector("#defeat-content") as CustomHTML).style.display = "none";
  }

  // Begin spawning enemy targets when a round begins
  function startEnemeyWave(): void {
    let i = 0;
    gameInterval = setInterval(() => {
      if (i < waveCount) {
        i++;
        spawnEnemy();
      } else {
        clearInterval(gameInterval);
      }
    }, enemySpawnFrequency);
  }

  function isRoundCompleted(): boolean {
    return kills + enemyBrokenThrough === waveCount;
  }

  function setEnemyStats(): void {
    if (enemyStatsSet) {
      return;
    }
    enemyStatsSet = true;

    enemySpeed = spawnConfig[difficultyLevel as keyof SpawnConfig].enemySpeed;
    waveCount = spawnConfig[difficultyLevel as keyof SpawnConfig].waveCount;
    enemySpawnFrequency = spawnConfig[difficultyLevel as keyof SpawnConfig].enemySpawnFrequency;
    playerDamageTaken = spawnConfig[difficultyLevel as keyof SpawnConfig].playerDamageTaken;
    pointsEarned = spawnConfig[difficultyLevel as keyof SpawnConfig].pointsEarned;
  }
  /**
   * [0]================[0]
   *  |     UPGRADES     |
   * [0]================[0]
   */
  function createAndRenderUpgrades() {
    const { capacityUpgrade, reloadUpgrade, speedUpgrade } = state.read();
    clearCards();
    // There are only 3 types of upgrades, speed, capacity and reload.
    const capacityUp = {
      type: "capacity",
      description: `+${capacityUpgrade.value} Magazine Round Capacity`,
      cost: capacityUpgrade.cost,
      level: capacityUpgrade.level,
      max_level: capacityUpgrade.max_level,
      value: capacityUpgrade.value,
    };
    const speedUp = {
      type: "speed",
      description: `-${speedUpgrade.value}ms Firing Speed`,
      cost: speedUpgrade.cost,
      level: speedUpgrade.level,
      max_level: speedUpgrade.max_level,
      value: speedUpgrade.value,
    };
    const reloadUp = {
      type: "reload",
      description: `-${reloadUpgrade.value}ms Realod Time`,
      cost: reloadUpgrade.cost,
      level: reloadUpgrade.level,
      max_level: reloadUpgrade.max_level,
      value: reloadUpgrade.value,
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

    // Generate the upgrade card html
    upConfig.forEach((cfg) => {
      let upCard = _ups.getUpgradeCard(cfg);
      shopContainerDiv.appendChild(upCard);
    });
  }

  function clearCards() {
    const cards = document.querySelectorAll(".shop-item.card");
    cards.forEach((card) => {
      card.remove();
    });
  }

  function showUpgradePurchaseAbility() {
    const { points } = state.read();
    const cards = document.querySelectorAll(".shop-item.card");
    cards.forEach((card: any) => {
      let cost = +card.dataset?.cost;
      if (cost > points) {
        card.classList.add("disabled");
      } else {
        card.classList.remove("disabled");
      }
      onUpgradeCardClick(card);
    });
  }

  function onUpgradeCardClick(card: any) {
    card.addEventListener("click", (e: any) => {
      const purchaseUpgrade = confirm(
        `Are you sure you want to purchase ${card.dataset.description} for ${card.dataset.cost} points.`
      );
      if (purchaseUpgrade) {
        points -= card.dataset.cost;
        incrementUpgradeState(card.dataset.type);
        upgradePlayerStats(card);
        createAndRenderUpgrades();
        showUpgradePurchaseAbility();
        updateUi();
      }
    });
  }

  function upgradePlayerStats(card: any) {
    switch (card.dataset.type) {
      case "reload":
        reloadSpeed -= parseInt(card.dataset.value);
        break;
      case "speed":
        playerShootSpeed -= parseInt(card.dataset.value);
        break;
      case "capacity":
        maxPlayerAmmo += parseInt(card.dataset.value);
    }
    updateUi();
  }

  // Update level and costs upgrades.
  function incrementUpgradeState(type: any) {
    const { capacityUpgrade, reloadUpgrade, speedUpgrade } = state.read();
    switch (type) {
      case "reload":
        reloadUpgrade.level++;
        reloadUpgrade.cost += 140;
        break;
      case "speed":
        speedUpgrade.level++;
        speedUpgrade.cost += 110;
        break;
      case "capacity":
        capacityUpgrade.level++;
        capacityUpgrade.cost += 200;
        break;
    }
    // Save them in state to when the new upgrades are rendered, we have the latest info.
    state.save({ capacityUpgrade, reloadUpgrade, speedUpgrade });
  }

  /**
   * [0]================[0]
   *  |      EVENTS      |
   * [0]================[0]
   */
  backToMenuBtn.addEventListener("click", () => {
    hideShopModal();
    showGameModal();
  });

  shopButton.addEventListener("click", () => {
    hideGameModal();
    showShopModal();
    createAndRenderUpgrades();
    showUpgradePurchaseAbility();
  });

  function getPlayerPosition() {
    const { left } = window.getComputedStyle(player);
    return parseInt(left);
  }

  addEventListener("mousemove", (e) => {
    const angle = Math.atan2(e.clientY - playerCenter.y, e.clientX - playerCenter.x);
    console.log(angle);
    player.style.transform = `rotate(${angle + 1.5}rad)`;
  });

  // Make bullet holes - SHOOT
  document.addEventListener("click", (e: any) => {
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
    location.reload();
  });

  // Handle some key binds
  document.addEventListener("keydown", function (event) {
    if (event.code == "KeyR") {
      reload.click();
    }
    if (event.code == "KeyC") {
      clearBullets.click();
    }

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      movePlayer(event.code);
    }
  });

  // Have to interacting with the app to play intro music
  function canPlayIntro() {
    document.addEventListener("click", () => {
      if (!introHasPlayed && !windowTooShort) {
        introHasPlayed = true;
        startIntroMusic();
      }
    });
  }

  // Set game properties
  difficultySelect.addEventListener("change", (e: any) => {
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
    checkWindowHeight();
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
