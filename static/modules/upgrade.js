import Helpers from "./helpers";
class Upgrade {
  _helper = new Helpers();
  reloadSpeedIncrement = 100;
  magazineSizeIncrement = 2;
  shootingSpeedIncrement = 30;

  constructor(config) {
    this.reloadSpeedIncrement = config.reloadSpeedIncrement;
    this.magazineSizeIncrement = config.magazineSizeIncrement;
    this.shootingSpeedIncrement = config.shootingSpeedIncrement;
  }
  reloadSpeedUpgrade() {
    // Build html
  }
  getWrapperHtml() {
    const html = document.createElement("div");
    const id = this._helper.uuid();
  }
}

export default Upgrade;
