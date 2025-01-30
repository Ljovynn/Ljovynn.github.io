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
const towersButtons = document.getElementsByClassName("towersMenuStageButton");
const warioCupButtonsDiv = document.getElementById("warioCupStageButtonsDiv");

const microgamesGridDocument = document.getElementById("microgamesGrid");
const levelTextDocument = document.getElementById("levelText");
const groupTextDocument = document.getElementById("groupText");
const quizTextDocument = document.getElementById("quizText");
const cycleTextDocument = document.getElementById("cycleText");
const exitButton = document.getElementById("exitButton");

const gameStates = 
{
    menu: 0,
    ingame: 1
}

var quizWarningBuffer = 2;

var stageDataJson;

var gameState = gameStates.menu;
var level = 1;
var levelInLoop = 1;

var levels = [];
var groupDefinitions = [];
var currentStageTitle = ''
var endPoint = 999;

document.addEventListener("keydown", (evt) => KeyPress(evt));
microgamesAreaDocument.addEventListener("mousedown", function(){
    NextGroup(1);
});

mainMenuStoryButton.addEventListener("mousedown", (evt) => {
    mainMenuDocument.classList.add("hidden");
    storyMenuDocument.classList.remove("hidden");
});
mainMenuTowersButton.addEventListener("mousedown", (evt) => {
    mainMenuDocument.classList.add("hidden");
    towersMenuDocument.classList.remove("hidden");
});
mainMenuWarioCupButton.addEventListener("mousedown", (evt) => {
    mainMenuDocument.classList.add("hidden");
    warioCupMenuDocument.classList.remove("hidden");
});

function AddMouseHoverOpacity(element){
    element.addEventListener("mouseenter", function(){
        element.classList.add("mouseOverElement");
    });
    element.addEventListener("mouseleave", function(){
        element.classList.remove("mouseOverElement");
    });
}

setup();
async function setup(){
    stageDataJson = await LoadJSON();

    AddMouseHoverOpacity(mainMenuStoryButton);
    AddMouseHoverOpacity(mainMenuTowersButton);
    AddMouseHoverOpacity(mainMenuWarioCupButton);

    for(let i = 0; i < 10; i++){
        storyButtons[i].addEventListener("mousedown", function(){
            EnterGame(stageDataJson[i])
        });
        AddMouseHoverOpacity(storyButtons[i]);
    }

    for(let i = 0; i < 5; i++){
        towersButtons[i].addEventListener("mousedown", function(){
            EnterGame(stageDataJson[i + 10])
        });
        AddMouseHoverOpacity(towersButtons[i]);
    }

    for (let i = 0; i < 48; i++){
        let container = document.createElement("div");
        let warioCupButton = document.createElement("img");
        let buttonTextElement = document.createElement("div");

        warioCupButton.src =  (stageDataJson[i + 15].type == "Score") ? "./images/menuIcons/ScoreChallenge.png" : "./images/menuIcons/TimedChallenge.png";
        warioCupButton.addEventListener("mousedown", function(){
            EnterGame(stageDataJson[i + 15])
        });
        warioCupButton.classList.add("warioCupButton");

        buttonTextElement.classList.add("warioCupButtonText");
        buttonTextElement.innerText = stageDataJson[i + 15].title;
        buttonTextElement.style.pointerEvents = "none";

        container.appendChild(warioCupButton);
        container.appendChild(buttonTextElement);
        AddMouseHoverOpacity(warioCupButton);
        warioCupButtonsDiv.appendChild(container);
    }

    for(let i = 0; i < backButtons.length; i++){
        backButtons[i].addEventListener("mousedown", ToMainMenu);
    }
    exitButton.addEventListener("mousedown", ExitGame);
}

async function LoadJSON() {
    const response = await fetch("./stages.json");
    const json = await response.json();
    return json;
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
            ResetWW();
        break;
        case 'Escape':
            ExitGame();
    }
}

function NextGroup(skipAmount = 1){
    if (gameState !== gameStates.ingame) return;

    if (level + skipAmount > endPoint) skipAmount = endPoint - level;
    level += skipAmount;
    levelInLoop += skipAmount;
    let loopsSkipped = Math.floor((levelInLoop - 1) / levels.length);
    levelInLoop -= levels.length * loopsSkipped;

    DisplayCurrentLevel();
}

function Back(){
    if (gameState !== gameStates.ingame) return;

    if (level < 1) return;
    level--;
    levelInLoop--;
    if (levelInLoop == 0) levelInLoop = levels.length;

    DisplayCurrentLevel();
}

function ResetWW(){
    if (gameState !== gameStates.ingame) return;

    level = 1;
    levelInLoop = 1;

    DisplayCurrentLevel();
}

function ExitGame(){
    if (gameState !== gameStates.ingame) return;
    ingameDocument.classList.add("hidden");
    menuDocument.classList.remove("hidden");
    ToMainMenu();
}

function DisplayCurrentLevel(){
    levelTextDocument.innerText = level;

    if (levels[levelInLoop - 1] === ""){
        groupTextDocument.innerText = "N/A";
        for (let i = 0; i < microgamesGridDocument.childElementCount; i++){
            microgamesGridDocument.children[i].classList.add("hidden");
        }
        return;
    }

    const group = groupDefinitions.find((item) => {
        return item.id == levels[levelInLoop - 1];
    });
    for (let i = 0; i < group.microgames.length; i++){
        microgamesGridDocument.children[i].src = "./images/microgames/" + group.microgames[i] + ".png";
        microgamesGridDocument.children[i].classList.remove("hidden");
    }
    for (let i = group.microgames.length; i < microgamesGridDocument.childElementCount; i++){
        microgamesGridDocument.children[i].classList.add("hidden");
    }
    groupTextDocument.innerText = group.id;
    cycleTextDocument.innerText = (group.cycle) ? group.cycle : "";

    quizTextDocument.innerText = HandleQuizText(quizWarningBuffer);
}

function HandleQuizText(bufferSize){
    for (let i = 0; i < bufferSize; i++){
        if (level + i > endPoint) return "";

        let checkedLevelInLoop = levelInLoop + i;
        let loopsSkipped = Math.floor((checkedLevelInLoop - 1) / levels.length);
        checkedLevelInLoop -= levels.length * loopsSkipped;

        const group = groupDefinitions.find((item) => {
            return item.id == levels[checkedLevelInLoop - 1];
        });

        if (group.microgames.includes("AnswerMe")) return "Quiz in " + i;
    }
    return "";
}

function ToMainMenu(){
    mainMenuDocument.classList.remove("hidden");
    storyMenuDocument.classList.add("hidden");
    towersMenuDocument.classList.add("hidden");
    warioCupMenuDocument.classList.add("hidden");
    window.scrollTo(0, 0)
}

function EnterGame(stageData){
    gameState = gameStates.ingame;
    menuDocument.classList.add("hidden");
    ingameDocument.classList.remove("hidden");

    level = 1;
    levelInLoop = 1;
    levels = stageData.levels;
    groupDefinitions = stageData.groups;
    currentStageTitle = stageData.title;
    endPoint = stageData.endPoint;

    DisplayCurrentLevel();
}