// Enemy troopers
const enemySelectionLibrary = [
  "assets/german1-green.png",
  "assets/german3-green.png",
  "assets/german4-gray.png",
  "assets/german6-gray.png",
  "assets/german7-gray.png",
  "assets/german7-gray.png",
  "assets/german8-gray.png",
  "assets/german9-green.png",
  "assets/german10-green.png",
  "assets/german11-green.png",
];

const enemySelectionTeamsLibrary = [
  "assets/mg-team-1-green.png",
  "assets/panzerschreck-1-grey.png",
];

const tanks = ["assets/jagtpanther-1.png", "assets/tiger-one-web.png"];

const roundBg = [
  "assets/endofround2.jpg",
  "assets/endofround3.png",
  "assets/endofround4.jpg",
  "assets/endofround5.jpg",
  "assets/endofround6.jpg",
  "assets/endofround7.jpg",
  "assets/endofround8.jpg",
  "assets/endofround9.jpg",
  "assets/endofround10.jpg",
  "assets/endofround11.jpg",
  "assets/endofround12.jpg",
  "assets/endofround13.jpg",
  "assets/endofround14.jpg",
  "assets/endofround15.jpg",
  "assets/endofround16.jpg",
  "assets/endofround17.jpg",
  "assets/endofround18.jpg",
  "assets/endofroundimg.jpg",
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

const defeatBackgrounds = ["assets/defeat1.jpg", "assets/defeat2.jpg", "assets/defeat3.jpg"];

const sound = {
  rifle1: new Audio("assets/gun-gunshot-01.wav"),
  battleSound: new Audio("assets/battle.mp3"),
  garand: new Audio("assets/m1garand.wav"),
  enfield: new Audio("assets/leeenfield.wav"),
  whack: new Audio("assets/whack.wav"),
  thud: new Audio("assets/woodthud.wav"),
  reloadSound: new Audio("assets/rifle-reload.wav"),
  empty: new Audio("assets/gunempty.wav"),
  deathmoan: new Audio("assets/dying-sound.wav"),
  defeatedSound: new Audio("assets/defeat.wav"),
  victorySound: new Audio("assets/victory.wav"),
  introMusic: new Audio("assets/intro.mp3"),
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
