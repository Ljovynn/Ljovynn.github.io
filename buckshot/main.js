var shellElements = document.getElementById("shellRow").getElementsByTagName("*");
var modeSwitchButton = document.getElementById("modeSwitchButton");

var mainText = document.getElementById("mainText");
var secondaryText = document.getElementById("secondaryText");
var secondarySelectors = document.getElementById("secondarySelectors");
var secondaryDiv = document.getElementById("secondaryDiv");

var liveSelector = document.getElementById("liveSelector");
var blankSelector = document.getElementById("blankSelector");

var liveBurnerPhoneSelector = document.getElementById("liveBurnerPhoneSelector");
var blankBurnerPhoneSelector = document.getElementById("blankBurnerPhoneSelector");

var draggedShellType = "";

var shellOrder = [];

var singleplayerMaxTotalShells = 8;
var multiplayerMaxShellsOfOneType = 5;

var totalShellCount = 0;

const states = {
    shellChoosing: 1,
    liveChoosing: 2,
    blankChoosing: 3,
    ingame: 4,
}
var state = states.shellChoosing;

const modes = {
    singleplayer: 1,
    multiplayer: 2,
}
var mode = modes.singleplayer;

function ShellTypeData(shellType, selector, burnerPhone, shellCount, burnerPhoneCount, imageSrc)
{
    this.shellType = shellType;
    this.selector = selector;
    this.burnerPhone = burnerPhone;
    this.shellCount = shellCount;
    this.burnerPhoneCount = burnerPhoneCount;
    this.imageSrc = imageSrc;
}

const liveShellData = new ShellTypeData("live", liveSelector, liveBurnerPhoneSelector, 0, 0, "images/live.png");
const blankShellData = new ShellTypeData("blank", blankSelector, blankBurnerPhoneSelector, 0, 0, "images/blank.png")
const shellTypeDatas = 
{
    liveShellData,
    blankShellData
}

var currentShellTypeData;
var otherShellTypeData;

function CurrentShellCount()
{
    return shellTypeDatas.liveShellData.shellCount + shellTypeDatas.blankShellData.shellCount;
}

const Reset = () => {
    console.log("yeasss");
    let visibleShellCount = (mode == modes.multiplayer) ? multiplayerMaxShellsOfOneType : singleplayerMaxTotalShells;
    for (let i = 0; i < visibleShellCount; i++){
        console.log("yeah");
        shellElements[i].classList.remove("hideElement");
        shellElements[i].src = "images/undefined.png";
        shellElements[i].classList.remove("currentRoundShell");
    }
    for (let i = visibleShellCount; i < shellElements.length; i++){
        console.log("oof");
        shellElements[i].classList.add("hideElement");
        shellElements[i].src = "images/undefined.png";
        shellElements[i].classList.remove("currentRoundShell");
    }

    if (mode == modes.multiplayer){
        state = states.liveChoosing;
        mainText.innerText = "How many live shells?";
    } else{
        state = states.shellChoosing;
        mainText.innerText = "How many shells?";
    }

    secondaryText.innerText = "";
    secondarySelectors.classList.add("hideElement");
    secondaryDiv.classList.remove("hideElement");

    liveSelector.classList.remove("unselectable");
    blankSelector.classList.remove("unselectable");
    liveBurnerPhoneSelector.classList.remove("unselectable");
    blankBurnerPhoneSelector.classList.remove("unselectable");

    shellOrder = [];

    totalShellCount = 0;
    
    shellTypeDatas.liveShellData.shellCount = 0;
    shellTypeDatas.blankShellData.shellCount = 0;

    shellTypeDatas.liveShellData.burnerPhoneCount = 0;
    shellTypeDatas.blankShellData.burnerPhoneCount = 0;
}

Setup();

function Setup(){
    document.getElementById("resetButton").addEventListener("mousedown", Reset);
    modeSwitchButton.addEventListener("mousedown", ChangeMode);

    liveSelector.addEventListener("mousedown", () => SetNextShellType(true));
    blankSelector.addEventListener("mousedown", () => SetNextShellType(false));
    AddMouseHoverOpacity(liveSelector);
    AddMouseHoverOpacity(blankSelector);
    AddMouseHoverSecondaryText(liveSelector, "-1 Live round");
    AddMouseHoverSecondaryText(blankSelector, "-1 Blank");

    AddMouseHoverOpacity(liveBurnerPhoneSelector);
    AddMouseHoverOpacity(blankBurnerPhoneSelector);
    AddMouseHoverSecondaryText(liveBurnerPhoneSelector, "Drag to the correct shell (live round)");
    AddMouseHoverSecondaryText(blankBurnerPhoneSelector, "Drag to the correct shell (blank)");
    AddPhoneMovementFunctionality(liveBurnerPhoneSelector, "live");
    AddPhoneMovementFunctionality(blankBurnerPhoneSelector, "blank");


    for (let i = 0; i < shellElements.length; i++){
        shellElements[i].addEventListener("mousedown",() => ChooseShellCount(i + 1));
        shellElements[i].addEventListener("mouseenter", () => HoverShellCount(i + 1));
        shellElements[i].addEventListener("mouseleave", () => HoverLeaveShellCount());
        shellElements[i].addEventListener("drop", (evt) => Drop(evt, i));
        shellElements[i].addEventListener("dragover", (evt) => {
                evt.preventDefault();
                },
            false,
        );
    }

    Reset();
}

function AddMouseHoverOpacity(element){
    element.addEventListener("mouseenter", function(){
        element.classList.add("mouseOverElement");
    });
    element.addEventListener("mouseleave", function(){
        element.classList.remove("mouseOverElement");
    });
}

function AddMouseHoverSecondaryText(element, textContent){
    element.addEventListener("mouseenter",  function(){
        secondaryText.innerText = textContent;
    });
    element.addEventListener("mouseleave", function(){
        secondaryText.innerText = "";
    });
}

function AddPhoneMovementFunctionality(element, shellType){
    element.addEventListener("dragstart", (evt) => Drag(shellType));
    element.addEventListener("dragend", Dragend);
}

function ChooseShellCount(hoveredShellCount){
    switch (state){
        case states.shellChoosing:
            if (hoveredShellCount == 1) return;
            totalShellCount = hoveredShellCount;
            if (totalShellCount % 2 == 0){
                shellTypeDatas.liveShellData.shellCount = totalShellCount / 2;
                shellTypeDatas.blankShellData.shellCount = shellTypeDatas.liveShellData.shellCount;
            } else{
                shellTypeDatas.liveShellData.shellCount = Math.floor(totalShellCount / 2);
                shellTypeDatas.blankShellData.shellCount = shellTypeDatas.liveShellData.shellCount + 1;
            }
            StartRound();
            break;
        case states.liveChoosing:
            shellTypeDatas.liveShellData.shellCount = hoveredShellCount;
            state = states.blankChoosing;
            mainText.innerText = "How many blanks?";
            for (let i = 0; i < multiplayerMaxShellsOfOneType; i++){
                if (i < hoveredShellCount){
                    shellElements[i].src = "images/blank.png";
                } else{
                    shellElements[i].src = "images/undefined.png";
                }
            }
            break;
        case states.blankChoosing:
            shellTypeDatas.blankShellData.shellCount = hoveredShellCount;
            totalShellCount = shellTypeDatas.liveShellData.shellCount + shellTypeDatas.blankShellData.shellCount;
            StartRound();
            break;
        default:
            return;
    }
}

function StartRound(){
    state = states.ingame;

    for (let i = 0; i < totalShellCount; i++){
        shellElements[i].src = "images/undefined.png";
        shellElements[i].classList.remove("hideElement");
    }
    for (let i = totalShellCount; i < shellElements.length; i++){
        shellElements[i].src = "images/undefined.png";
        shellElements[i].classList.add("hideElement");
    }

    shellElements[0].classList.add("currentRoundShell");

    shellOrder = []
    for (let i = 0; i < totalShellCount; i++){
        shellOrder[i] = "undefined";
    }

    secondarySelectors.classList.remove("hideElement");
    secondaryText.textContent = "";

    DisplayShellCountMainText();
}

function DisplayShellCountMainText(){
    var result = shellTypeDatas.liveShellData.shellCount.toString();
    if (shellTypeDatas.liveShellData.burnerPhoneCount > 0)
    {
        result += " (" + -shellTypeDatas.liveShellData.burnerPhoneCount.toString() + ")";
    }
    if (shellTypeDatas.liveShellData.shellCount == 1){
        result += " live round, ";
    }
    else{
        result += " live rounds, ";
    }
    result += shellTypeDatas.blankShellData.shellCount.toString();
    if (shellTypeDatas.blankShellData.burnerPhoneCount > 0)
    {
        result += " (" + -shellTypeDatas.blankShellData.burnerPhoneCount.toString() + ")";
    }
    if (shellTypeDatas.blankShellData.shellCount == 1){
        result += " blank";
    }
    else{
        result += " blanks";
    }
    mainText.innerText = result;
}

function HoverShellCount(hoveredShellCount){
    switch (state){
        case states.shellChoosing:
            if (hoveredShellCount == 1) return;
            for (let i = 0; i < singleplayerMaxTotalShells; i++){
                if (i < hoveredShellCount){
                    if (i >= hoveredShellCount / 2){
                        shellElements[i].src = "images/live.png";
                    } else {
                        shellElements[i].src = "images/blank.png";
                    }
                } else{
                    shellElements[i].src = "images/undefined.png";
                }
            }
            break;
        case states.liveChoosing:
            for (let i = 0; i < multiplayerMaxShellsOfOneType; i++){
                if (i < hoveredShellCount){
                    shellElements[i].src = "images/live.png";
                } else{
                    shellElements[i].src = "images/undefined.png";
                }
            }
            break;
        case states.blankChoosing:
            for (let i = 0; i < multiplayerMaxShellsOfOneType; i++){
                if (i < hoveredShellCount){
                    shellElements[i].src = "images/blank.png";
                } else{
                    shellElements[i].src = "images/undefined.png";
                }
            }
            break;
        default:
            return;
    }
    secondaryText.textContent = hoveredShellCount.toString();
}

function HoverLeaveShellCount(){
    if (state == states.ingame){
        return;
    }
    for (let i = 0; i < shellElements.length; i++){
        shellElements[i].src = "images/undefined.png";
    }
    secondaryText.textContent = "";
}

function SetNextShellType(isLive)
{
    if (isLive){
        currentShellTypeData = shellTypeDatas.liveShellData;
        otherShellTypeData = shellTypeDatas.blankShellData;
    } 
    else{
        currentShellTypeData = shellTypeDatas.blankShellData;
        otherShellTypeData = shellTypeDatas.liveShellData;
    }
    if (currentShellTypeData.selector.classList.contains("unselectable")){
        return;
    }
    if (shellOrder[totalShellCount - CurrentShellCount()] == currentShellTypeData.shellType){
        currentShellTypeData.shellCount--;
        currentShellTypeData.burnerPhoneCount--;
    } 
    else{
        shellOrder[totalShellCount - CurrentShellCount()] = currentShellTypeData.shellType;
        currentShellTypeData.shellCount--;
        shellElements[totalShellCount - CurrentShellCount() - 1].src = currentShellTypeData.imageSrc;
    }

    CheckNextMoveLegality();

    if (CurrentShellCount() <= 0){
        secondaryDiv.classList.add("hideElement");
    }

    DisplayShellCountMainText();
    SetShellBorder(totalShellCount - CurrentShellCount());
}

function CheckNextMoveLegality(){
    liveSelector.classList.remove("unselectable");
    blankSelector.classList.remove("unselectable");
    liveBurnerPhoneSelector.classList.remove("unselectable");
    blankBurnerPhoneSelector.classList.remove("unselectable");

    CheckIfRoomForMoreShells();

    CheckIfNextShellKnown();
}

function SetShellBorder(index){
    if (index != 0){
        shellElements[index - 1].classList.remove("currentRoundShell");
    } 
    if (index < totalShellCount){
        shellElements[index].classList.add("currentRoundShell");
    }
}

function CheckIfRoomForMoreShells(){
    if (shellTypeDatas.liveShellData.shellCount <= 0){
        liveSelector.classList.add("unselectable");
    }
    if (shellTypeDatas.blankShellData.shellCount <= 0){
        blankSelector.classList.add("unselectable");
    }

    if (shellTypeDatas.liveShellData.shellCount <= shellTypeDatas.liveShellData.burnerPhoneCount){
        liveSelector.classList.add("unselectable");
        liveBurnerPhoneSelector.classList.add("unselectable");
    }
    if (shellTypeDatas.blankShellData.shellCount <= shellTypeDatas.blankShellData.burnerPhoneCount){
        blankSelector.classList.add("unselectable");
        blankBurnerPhoneSelector.classList.add("unselectable");
    }
}

function CheckIfNextShellKnown(){
    if (CurrentShellCount() <= 0){
        return;
    }
    if (shellOrder[totalShellCount - CurrentShellCount()] == "live"){
        liveSelector.classList.remove("unselectable");
        blankSelector.classList.add("unselectable");
    } 
    else if (shellOrder[totalShellCount - CurrentShellCount()] == "blank"){
        blankSelector.classList.remove("unselectable");
        liveSelector.classList.add("unselectable");
    }
}

function Drag(shellType) {
    draggedShellType = shellType;
}

function Dragend(){
    draggedShellType = "";
}

function Drop(evt, shellIndex) {
    evt.preventDefault();
    if (state == states.ingame){
        SetBurnerPhoneShell(shellIndex);
    }
}

function SetBurnerPhoneShell(shellIndex){
    if (totalShellCount - CurrentShellCount() >= shellIndex){
        return;
    }
    if (draggedShellType == "live"){
        currentShellTypeData = shellTypeDatas.liveShellData;
        otherShellTypeData = shellTypeDatas.blankShellData;
    } 
    else if (draggedShellType == "blank"){
        currentShellTypeData = shellTypeDatas.blankShellData;
        otherShellTypeData = shellTypeDatas.liveShellData;
    } 
    else{
    return;
    }
    if (currentShellTypeData.burnerPhone.classList.contains("unselectable")){
        return;
    }

    if (shellOrder[shellIndex] == "undefined"){
        currentShellTypeData.burnerPhoneCount++;
        shellOrder[shellIndex] = currentShellTypeData.shellType;
        shellElements[shellIndex].src = currentShellTypeData.imageSrc;
    } 
    else if (shellOrder[shellIndex] == otherShellTypeData.shellType){
        currentShellTypeData.burnerPhoneCount++;
        shellOrder[shellIndex] = currentShellTypeData.shellType;
        shellElements[shellIndex].src = currentShellTypeData.imageSrc;
        otherShellTypeData.burnerPhoneCount--;
    }

    CheckNextMoveLegality();

    DisplayShellCountMainText();
}

function ChangeMode(){
    if (mode == modes.singleplayer){
        mode = modes.multiplayer;
        modeSwitchButton.innerText = "Singleplayer mode";
    } else if (mode == modes.multiplayer){
        mode = modes.singleplayer;
        modeSwitchButton.innerText = "Multiplayer mode";
    }
    Reset();
}