const microgamesAreaDocument = document.getElementById("mainMicrogamesArea");

const menuDocument = document.getElementById("menu");
const ingameDocument = document.getElementById("ingame");
const backButtons = document.getElementsByClassName("backButtonMainMenu");

const mainMenuDocument = document.getElementById("mainMenu");
const storyMenuDocument = document.getElementById("storyMenu");
const towersMenuDocument = document.getElementById("towersMenu");
const warioCupMenuDocument = document.getElementById("warioCupMenu");

const mainMenuStoryButton = document.getElementById("mainMenuStoryButton");
const mainMenuTowersButton = document.getElementById("mainMenuTowersButton");
const mainMenuWarioCupButton = document.getElementById("mainMenuWarioCupButton");

const storyButtons = document.getElementsByClassName("storyMenuStageButton");

const gameStates = 
{
    menu: 0,
    ingame: 1
}

const stageDataJson = LoadJSON();

var gameState = gameStates.menu;
var level = 1;

var levels = [];
var groupDefinitions = [];
var currentStageTitle = ''
var repeatingGroups = false;
var endPoint = 999;

document.addEventListener("keydown", (evt) => KeyPress(evt));
microgamesAreaDocument.addEventListener("mousedown", NextGroup);

mainMenuStoryButton.addEventListener("mousedown", (evt) => {
    mainMenuDocument.classList.add("hidden");
    storyMenuDocument.classList.remove("hidden");
});

async function LoadJSON() {
    const response = await fetch("./stages.json");
    const json = await response.json();
    console.log(json);
}

for(let i = 0; i < 11; i++){
    storyButtons[i].addEventListener("mousedown", EnterGame(stageDataJson[i]));
}

function KeyPress(evt){
    if (evt.repeat) return;
    switch(evt.key){
        case ' ':
            NextGroup(1);
        break;
        case 'Enter':
            NextGroup(10);
        break;
        case 'Backspace':
            Back();
        break;
        case 'r':
        case 'R':
            Reset();
        break;
        case 'Escape':
            ExitGame();
    }
    console.log(evt.key);
}

function NextGroup(skipAmount = 1){
    console.log("next");
    if (gameState !== gameStates.ingame) return;
}

function Back(){
    if (gameState !== gameStates.ingame) return;
}

function Reset(){
    if (gameState !== gameStates.ingame) return;
}

function ExitGame(){
    if (gameState !== gameStates.ingame) return;
    ingameDocument.classList.add("hidden");
    menuDocument.classList.remove("hidden");
    ToMainMenu();
}

function ToMainMenu(){
    mainMenuDocument.classList.remove("hidden");
    storyMenuDocument.classList.add("hidden");
    towersMenuDocument.classList.add("hidden");
    warioCupMenuDocument.classList.add("hidden");
}

function EnterGame(stageTitle){
    console.log(stageTitle);
}