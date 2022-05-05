"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_js_1 = tslib_1.__importDefault(require("./helpers.js"));
const icons_js_1 = tslib_1.__importDefault(require("./icons.js"));
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
//# sourceMappingURL=upgrade.js.map