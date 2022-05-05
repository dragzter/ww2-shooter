define("modules/assets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tanks = exports.sound = exports.enemySelectionTeamsLibrary = exports.enemySelectionLibrary = exports.enemyDivisionNames = exports.defeatBackgrounds = exports.roundBg = void 0;
    // Enemy troopers
    const enemySelectionLibrary = [
        "src/assets/german1-green.png",
        "src/assets/german3-green.png",
        "src/assets/german4-gray.png",
        "src/assets/german6-gray.png",
        "src/assets/german7-gray.png",
        "src/assets/german7-gray.png",
        "src/assets/german8-gray.png",
        "src/assets/german9-green.png",
        "src/assets/german10-green.png",
        "src/assets/german11-green.png",
    ];
    exports.enemySelectionLibrary = enemySelectionLibrary;
    const enemySelectionTeamsLibrary = [
        "src/assets/mg-team-1-green.png",
        "src/assets/panzerschreck-1-grey.png",
    ];
    exports.enemySelectionTeamsLibrary = enemySelectionTeamsLibrary;
    const tanks = ["src/assets/jagtpanther-1.png", "src/assets/tiger-one-web.png"];
    exports.tanks = tanks;
    const roundBg = [
        "src/assets/endofround2.jpg",
        "src/assets/endofround3.png",
        "src/assets/endofround4.jpg",
        "src/assets/endofround5.jpg",
        "src/assets/endofround6.jpg",
        "src/assets/endofround7.jpg",
        "src/assets/endofround8.jpg",
        "src/assets/endofround9.jpg",
        "src/assets/endofround10.jpg",
        "src/assets/endofround11.jpg",
        "src/assets/endofround12.jpg",
        "src/assets/endofround13.jpg",
        "src/assets/endofround14.jpg",
        "src/assets/endofround15.jpg",
        "src/assets/endofround16.jpg",
        "src/assets/endofround17.jpg",
        "src/assets/endofround18.jpg",
        "src/assets/endofroundimg.jpg",
    ];
    exports.roundBg = roundBg;
    const enemyDivisionNames = [
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
    exports.enemyDivisionNames = enemyDivisionNames;
    const defeatBackgrounds = [
        "src/assets/defeat1.jpg",
        "src/assets/defeat2.jpg",
        "src/assets/defeat3.jpg",
    ];
    exports.defeatBackgrounds = defeatBackgrounds;
    const sound = {
        rifle1: new Audio("src/assets/gun-gunshot-01.wav"),
        battleSound: new Audio("src/assets/battle.mp3"),
        garand: new Audio("src/assets/m1garand.wav"),
        enfield: new Audio("src/assets/leeenfield.wav"),
        whack: new Audio("src/assets/whack.wav"),
        thud: new Audio("src/assets/woodthud.wav"),
        reloadSound: new Audio("src/assets/rifle-reload.wav"),
        empty: new Audio("src/assets/gunempty.wav"),
        deathmoan: new Audio("src/assets/dying-sound.wav"),
        defeatedSound: new Audio("src/assets/defeat.wav"),
        victorySound: new Audio("src/assets/victory.wav"),
        introMusic: new Audio("src/assets/intro.mp3"),
    };
    exports.sound = sound;
});
define("types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("modules/helpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Helpers {
        uuid() {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            };
            return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        }
        randomInt(n) {
            return Math.floor(Math.random() * n);
        }
        woundTable(key) {
            let wounds = {
                trooper: 1,
                team: 2,
                tank: 10,
            };
            return wounds[key];
        }
        difficultyBounds() {
            return {
                teasy: {
                    speed: 2,
                    spawnRate: 1800,
                    count: 70,
                    teams: 0,
                },
                easy: {
                    speed: 3,
                    spawnRate: 1400,
                    count: 90,
                    teams: 2,
                },
                medium: {
                    speed: 4,
                    spawnRate: 1200,
                    count: 110,
                    teams: 4,
                },
                hard: {
                    speed: 5,
                    spawnRate: 1000,
                    count: 130,
                    teams: 8,
                },
                epic: {
                    speed: 6,
                    spawnRate: 800,
                    count: 170,
                    teams: 16,
                },
            };
        }
        logTest() {
            console.log("You are importing logTest() from helpers.js");
        }
        /**
         *
         * @param {node} object - The node being appended to the base
         * @param {string} identifier - string identifier
         * @returns base - the composed html element.
         */
        generateItem(object, identifier) {
            const id = this.uuid();
            let base = document.createElement("div");
            base.setAttribute.draggable = false;
            base.id = `base-${identifier}-${id}`;
            base.classList.add("unselectable", identifier);
            object.id = `${identifier}-${id}`;
            object.dataset.wounds = this.woundTable(identifier);
            base.appendChild(object);
            return base;
        }
        // Randown spawn location for enemy
        generateSpawnLocation() {
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
            let choice = this.randomInt(zones.length);
            return {
                top: "0px",
                left: zones[choice],
            };
        }
        getValidTargets() {
            return ["battlefield", "target", "bullet", "enemy", "trooper"];
        }
        isValidTarget(target) {
            const valTar = this.getValidTargets();
            return valTar.some((validTarget) => {
                return target.indexOf(validTarget) > -1;
            });
        }
    }
    exports.default = Helpers;
});
define("modules/icons", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Icon {
        make(classes) {
            const i = document.createElement("i");
            const css = classes.split(" ");
            i.classList.add(...css);
            return i;
        }
        getAll() {
            return {
                plus: "far fa-plus-square",
                eraser: "fas fa-eraser",
                folder: "fas fa-folder-plus",
                stop_watch: "fas fa-stopwatch",
                redo: "fas fa-redo",
                coins: "fas fa-coins",
                skull: "fas fa-skull-crossbones",
                stack: "fab fa-stack-overflow",
                play: "fas fa-play",
                medal: "fas fa-medal",
            };
        }
    }
    exports.default = Icon;
});
define("modules/upgrade", ["require", "exports", "modules/helpers", "modules/icons"], function (require, exports, helpers_js_1, icons_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Upgrade {
        constructor() {
            this._helper = new helpers_js_1.default();
            this._icon = new icons_js_1.default();
        }
        getUpgradeCard(upgradeConfig) {
            const { type, description, cost, level, max_level, value } = upgradeConfig;
            // Build html
            const card = this.getWrapperHtml();
            const coinsIcon = this._icon.make("fas fa-coins");
            const levelsIcon = this._icon.make("far fa-plus-square");
            const cardHeader = document.createElement("div");
            const cardBody = document.createElement("div");
            const descriptEl = document.createElement("p");
            const costEl = document.createElement("p");
            const levelEl = document.createElement("p");
            let upgradeIcon = this._icon.make("fas fa-question-circle");
            // Specific data
            card.dataset.level = level;
            card.dataset.type = type;
            card.dataset.cost = cost;
            card.dataset.description = description;
            card.dataset.value = value;
            switch (type) {
                case "speed":
                    upgradeIcon = this._icon.make("fas fa-stopwatch");
                    break;
                case "capacity":
                    upgradeIcon = this._icon.make("fas fa-folder-plus");
                    break;
                case "reload":
                    upgradeIcon = this._icon.make("fas fa-redo");
                    break;
            }
            // Card header - holding the main icon
            cardHeader.classList.add("c-header", `${type}-up`);
            descriptEl.classList.add("desc");
            cardHeader.appendChild(upgradeIcon);
            // Sub elements of header and body
            costEl.classList.add("cost");
            levelEl.classList.add("level");
            descriptEl.textContent = description;
            costEl.textContent = ` ${cost}`;
            levelEl.textContent = ` ${level}/${max_level}`;
            costEl.prepend(coinsIcon);
            levelEl.prepend(levelsIcon);
            // Bundle all the elements
            const cardElements = [descriptEl, costEl, levelEl];
            cardBody.classList.add("c-body");
            cardElements.forEach((el) => {
                cardBody.appendChild(el);
            });
            card.appendChild(cardHeader);
            card.appendChild(cardBody);
            return card;
        }
        getWrapperHtml() {
            const html = document.createElement("div");
            const id = this._helper.uuid();
            html.classList.add("shop-item", "card");
            html.setAttribute.id = id;
            return html;
        }
    }
    exports.default = Upgrade;
});
define("modules/memory", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Memory {
        constructor() {
            this.id = "gameState";
        }
        read() {
            if (localStorage.getItem(this.id)) {
                const state = localStorage.getItem(this.id);
                return JSON.parse(state);
            }
            return null;
        }
        save(state) {
            const memory = this.read();
            let cache = {};
            if (memory) {
                cache = Object.assign(memory, state);
            }
            else {
                cache = state;
            }
            localStorage.setItem(this.id, JSON.stringify(cache));
        }
    }
    exports.default = Memory;
});
define("script", ["require", "exports", "modules/assets", "modules/helpers", "modules/upgrade", "modules/memory"], function (require, exports, assets_1, helpers_1, upgrade_1, memory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = () => {
        // Init Classes
        const _ups = new upgrade_1.default();
        const _helpers = new helpers_1.default();
        const state = new memory_1.default();
        document.documentElement.style.setProperty("--animate-duration", ".5s");
        // DOM
        let shopModal = document.getElementById("shop-modal");
        let shopContainerDiv = document.getElementById("shop-container");
        let pointDiv = document.querySelector("#points");
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
        //let gameModeSelect = document.querySelector("#game-mode") as HTMLElement;
        let uiMessage = document.querySelector("#messages");
        let killsScoredIndicator = document.querySelector("#kills");
        let totalKillsScoredIndicator = document.querySelector("#tkills");
        let playerCover = document.querySelector("#cover");
        let modal = document.querySelector("#modal-screen");
        let introText = document.querySelector("#intro");
        //let roundSummary = document.querySelector("#roundSummary") as HTMLElement;
        let summarySpeed = document.querySelector("#e-speed");
        let summarySpawnRate = document.querySelector("#e-spawnrate");
        let summaryEnemyCount = document.querySelector("#e-count");
        let enemyNameElement = document.querySelector("#opponent-name");
        let restartGameButton = document.querySelector("#restart");
        let shopButton = document.getElementById("go-shop");
        let shopPointsDiv = document.getElementById("shop-points");
        let backToMenuBtn = document.getElementById("back-to-menu");
        let hpLabel = document.getElementById("hp-label");
        let notifyWindowTooShort = document.getElementById("notify-window-too-short");
        // Player stat html
        let hitpointsDiv = document.querySelector("#hp");
        let playerMaxAmmoDiv = document.querySelector("#maxAmmo");
        let playerShootSpeedDiv = document.getElementById("shootSpeed");
        let playerReloadSpeedDiv = document.querySelector("#reloadTime");
        let gameRoundDiv = document.querySelectorAll(".round");
        // Player Stats
        let reloadSpeed = 4000;
        let maxPlayerAmmo = 10;
        let maxPlayerHitpoints = 100;
        let playerShootSpeed = 1000;
        // Upgrade levels config
        let upgradeConfig = {
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
        const spawnConfig = {
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
        let currentPlayerAmmo = maxPlayerAmmo;
        let currentPlayerHitpoints = maxPlayerHitpoints;
        let difficultyLevel = "teasy";
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
        let battleSound = assets_1.sound.battleSound;
        let enfield = assets_1.sound.enfield;
        let thud = assets_1.sound.thud;
        let reloadSound = assets_1.sound.reloadSound;
        let empty = assets_1.sound.empty;
        let defeatedSound = assets_1.sound.defeatedSound;
        let victorySound = assets_1.sound.victorySound;
        let introMusic = assets_1.sound.introMusic;
        introMusic.autoplay = true;
        introMusic.volume = 0.3;
        battleSound.loop = true;
        battleSound.volume = 0.1;
        let playerWeapon = enfield;
        const playerCenter = getCenter(player);
        // Assets
        let enemySelection = assets_1.enemySelectionLibrary;
        let enemyTeamsSelection = assets_1.enemySelectionTeamsLibrary;
        let endOfRoundBg = assets_1.roundBg;
        let enemyDivision = assets_1.enemyDivisionNames;
        let defeatBg = assets_1.defeatBackgrounds;
        /**
         * [0]================[0]
         *  |      HELPERS     |
         * [0]================[0]
         */
        function setInitialState() {
            state.save({ points, gameRound, totalKills });
            state.save(upgradeConfig);
        }
        // If the window is not tlal enough , we do not play.
        function checkWindowHeight() {
            if (window.innerHeight < 950) {
                alert("Your browser window is not tall enough.  The recommended minimum height is 950px.");
                battlefield.remove();
                modal.remove();
                windowTooShort = true;
                notifyWindowTooShort.style.display = "block";
            }
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
            if (e.target.classList.contains("target") || e.target.classList.contains("trooper")) {
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
            points += pointsEarned + gameRound;
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
            if (enemySpeed < maxEnemyValues[difficultyLevel].speed) {
                enemySpeed += 0.1;
            }
            else {
                enemySpeed = maxEnemyValues[difficultyLevel].speed;
                enemySpeedMaxed = true;
            }
            if (waveCount < maxEnemyValues[difficultyLevel].count) {
                waveCount += 1;
            }
            else {
                waveCount = maxEnemyValues[difficultyLevel].count;
                enemyWaveCountMaxed = true;
            }
            if (enemySpawnFrequency > maxEnemyValues[difficultyLevel].spawnRate) {
                enemySpawnFrequency -= 100;
            }
            else {
                enemySpawnFrequency = maxEnemyValues[difficultyLevel].spawnRate;
                enemySpawnRateMaxed = true;
            }
        }
        // When the target dies
        function killTarget(targetElement) {
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
        function fireOrReload() {
            return currentPlayerAmmo >= 0;
        }
        // Move Target
        function moveEnemy(el) {
            let pos = 1;
            let interval = setInterval(() => {
                if (pos < 900) {
                    pos += enemySpeed;
                }
                else {
                    window.clearInterval(interval);
                    damagePlayer();
                }
                el.style.top = pos + "px";
            }, 15 - enemySpeed);
            el.dataset.interval = interval; // save the interval number so we can cancel later
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
        function generateEnemy(type) {
            let choice = _helpers.randomInt(enemySelection.length);
            let trooper = document.createElement("img");
            let camoColor = enemySelection[choice].indexOf("gray") > -1 ? "gray" : "green";
            trooper.src = enemySelection[choice];
            trooper.dataset.camo = camoColor;
            return _helpers.generateItem(trooper, type);
        }
        // Create a dead model when a target is killed
        function makeCasualty(camoColor) {
            let casualty = document.createElement("img");
            if (camoColor === "gray") {
                casualty.src = "src/assets/casualty-gray.png";
            }
            else {
                casualty.src = "src/assets/casualty-green.png";
            }
            return _helpers.generateItem(casualty, "casualty");
        }
        function spawnEnemy() {
            enemyCount++;
            let target = generateEnemy("trooper");
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
        function placeBullet(bulletEl, e) {
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
            gameRoundDiv.forEach((div) => {
                div.textContent = "Round: " + gameRound;
            });
            totalKillsScoredIndicator.textContent = "Total Kills: " + totalKills;
            state.save({ points, totalKills, gameRound });
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
                    spawnEnemy();
                }
                else {
                    clearInterval(gameInterval);
                }
            }, enemySpawnFrequency);
        }
        function isRoundCompleted() {
            return kills + enemyBrokenThrough === waveCount;
        }
        function setEnemyStats() {
            if (enemyStatsSet) {
                return;
            }
            enemyStatsSet = true;
            enemySpeed = spawnConfig[difficultyLevel].enemySpeed;
            waveCount = spawnConfig[difficultyLevel].waveCount;
            enemySpawnFrequency = spawnConfig[difficultyLevel].enemySpawnFrequency;
            playerDamageTaken = spawnConfig[difficultyLevel].playerDamageTaken;
            pointsEarned = spawnConfig[difficultyLevel].pointsEarned;
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
            cards.forEach((card) => {
                let cost = +card.dataset?.cost;
                if (cost > points) {
                    card.classList.add("disabled");
                }
                else {
                    card.classList.remove("disabled");
                }
                onUpgradeCardClick(card);
            });
        }
        function onUpgradeCardClick(card) {
            card.addEventListener("click", (e) => {
                const purchaseUpgrade = confirm(`Are you sure you want to purchase ${card.dataset.description} for ${card.dataset.cost} points.`);
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
        function upgradePlayerStats(card) {
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
        function incrementUpgradeState(type) {
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
        addEventListener("mousemove", (e) => {
            const angle = Math.atan2(e.clientY - playerCenter.y, e.clientX - playerCenter.x);
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
                console.log("fired");
                // Handle hits
                if (fireOrReload()) {
                    playSound("garand");
                    isAHit(id, e);
                }
                else {
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
            if (reloading)
                return;
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
        });
        // Have to interacting with the app to play intro music
        function canPlayIntro() {
            document.addEventListener("click", () => {
                if (!introHasPlayed && !windowTooShort) {
                    introHasPlayed = true;
                    //startIntroMusic();
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
            checkWindowHeight();
            if (isDebug()) {
                debugMode();
            }
            else {
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
});
//# sourceMappingURL=bundle.js.map