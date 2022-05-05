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

const enemySelectionTeamsLibrary = [
  "src/assets/mg-team-1-green.png",
  "src/assets/panzerschreck-1-grey.png",
];

const tanks = ["src/assets/jagtpanther-1.png", "src/assets/tiger-one-web.png"];

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

const defeatBackgrounds = [
  "src/assets/defeat1.jpg",
  "src/assets/defeat2.jpg",
  "src/assets/defeat3.jpg",
];

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

export {
  roundBg,
  defeatBackgrounds,
  enemyDivisionNames,
  enemySelectionLibrary,
  enemySelectionTeamsLibrary,
  sound,
  tanks,
};
