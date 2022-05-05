class Icon {
  make(classes: string) {
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

export default Icon;
