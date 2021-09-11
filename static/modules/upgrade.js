import Helpers from "./helpers.js";
import Icon from "./icons.js";
class Upgrade {
  _helper = new Helpers();
  _icon = new Icon();

  getUpgradeCard(upgradeConfig) {
    const { type, description, cost, level, max_level } = upgradeConfig;
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
export default Upgrade;
