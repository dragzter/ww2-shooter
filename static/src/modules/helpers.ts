import { DifficultyBounds } from "src/types";

class Helpers {
  uuid() {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  randomInt(n: number) {
    return Math.floor(Math.random() * n);
  }

  woundTable(key: string) {
    let wounds: any = {
      trooper: 1,
      team: 2,
      tank: 10,
    };
    return wounds[key];
  }

  difficultyBounds(): DifficultyBounds {
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
  generateItem(object: any, identifier: any): HTMLElement {
    const id = this.uuid();
    let base: HTMLElement = document.createElement("div");
    (base.setAttribute as { [key: string]: any }).draggable = false;
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

  isValidTarget(target: any) {
    const valTar = this.getValidTargets();
    return valTar.some((validTarget) => {
      return target.indexOf(validTarget) > -1;
    });
  }
}

export default Helpers;
