import stagesJson from './stages.json' assert { type: 'json' };
console.log(stagesJson);

const microgamesAreaDocument = document.getElementById("mainMicrogamesArea");

const menuDocument = document.getElementById("menu");
const ingameDocument = document.getElementById("ingame");

const mainMenuDocument = document.getElementById("mainMenu");
const storyMenuDocument = document.getElementById("storyMenu");
const towersMenuDocument = document.getElementById("towersMenu");
const warioCupMenuDocument = document.getElementById("warioCupMenu");

const gameStates = 
{
    menu: 0,
    ingame: 1
}

const stages =
{
    introGames: 'Intro Games',
    thatsLife: 'That\'s Life',
    fantasy: 'Fantasy',
    highTech: 'High Tech',
    nintendoClassics: 'Nintendo Classics',
    nature: 'Nature',
    sports: 'Sports',
    food: 'Food',
    culture: 'Culture',
    anythingGoes: 'Anything Goes',
    remix: 'Remix',
    remix2: 'Remix 2.0',
    allMixedUp: 'All Mixed Up',
    superHard: 'Super Hard / Thrill Ride',
    pennysMix: 'Penny\'s Mix',
}

var gameState = gameStates.menu;
var level = 1;

var levels = [];
var groupDefinitions = [];
var currentStageTitle = ''
var repeatingGroups = false;
var endPoint = 999;

document.addEventListener("keydown", (evt) => KeyPress(evt));
microgamesAreaDocument.addEventListener("mousedown", NextGroup);

LoadJSON();

function LoadJSON(){
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

function EnterGame(stageId){

}