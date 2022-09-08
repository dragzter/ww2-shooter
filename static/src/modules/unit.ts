import { SpawnLocation } from "src/types";
import Helpers from "./helpers";

export default class Unit {
  private _helper;
  private _teamSpawnLocations;
  private _singleSpawnLocations;
  constructor() {
    this._helper = new Helpers();
    this._singleSpawnLocations = [
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

    this._teamSpawnLocations = ["0", "450px", "900px"];
  }

  /**
   *
   * @param {node} object - The node being appended to the base
   * @param {string} identifier - string identifier
   * @returns base - the composed html element.
   */
  generateItem(object: any, identifier: any): HTMLElement {
    const id = this._helper.uuid();
    let base: HTMLElement = document.createElement("div");
    (base.setAttribute as { [key: string]: any }).draggable = false;
    base.id = `base-${identifier}-${id}`;
    base.classList.add("unselectable", identifier);

    object.id = `${identifier}-${id}`;
    object.dataset.wounds = this.woundTable(identifier);
    base.appendChild(object);
    return base;
  }

  woundTable(key: string) {
    let wounds: any = {
      trooper: 1,
      team: 2,
      tank: 10,
    };
    return wounds[key];
  }

  // Randown spawn location for enemy
  generateSpawnLocation(locations: string[]) {
    let choice = this._helper.randomInt(locations.length);
    return {
      top: "0px",
      left: locations[choice],
    };
  }

  generateCasualty(camoColor: string) {
    let casualty: HTMLImageElement = this._helper.create("img") as HTMLImageElement;
    if (camoColor === "gray") {
      casualty.src = "src/assets/casualty-gray.png";
    } else {
      casualty.src = "src/assets/casualty-green.png";
    }
    return this.generateItem(casualty, "casualty");
  }

  generateEnemy(type: any, enemySelection: string[]): [HTMLElement, SpawnLocation] {
    let spawnLocations: { [key: string]: string[] } = {
      trooper: this._singleSpawnLocations,
      team: this._teamSpawnLocations,
    };

    let choice = this._helper.randomInt(enemySelection.length);
    let enemyUnit = document.createElement("img");
    let camoColor = enemySelection[choice].indexOf("gray") > -1 ? "gray" : "green";
    enemyUnit.src = enemySelection[choice];
    enemyUnit.dataset.camo = camoColor;
    return [this.generateItem(enemyUnit, type), this.generateSpawnLocation(spawnLocations[type])];
  }

  spawnTrooper() {}
  spawnTeam() {}

  spawnEnemy() {}
}
