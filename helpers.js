class Helpers {
  uuid() {
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

  randomInt(n) {
    return Math.floor(Math.random() * n);
  }

  difficultyBounds() {
    return {
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
  }
}

window.helpers = new Helpers();
