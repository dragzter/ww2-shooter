class Icon {
  icon(classes) {
    return `<i class="${classes}"></i>`;
  }
  getAll() {
    return {
      plus: "far fa-plus-square",
      eraser: "fas fa-eraser",
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
