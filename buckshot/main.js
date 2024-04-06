var countShellRow = document.getElementById("countShellRow");
var roundShellRow = document.getElementById("roundShellRow");

var countShellElements = countShellRow.getElementsByTagName("*");
var roundShellElements = roundShellRow.getElementsByTagName("*");

var mainText = document.getElementById("mainText");
var secondaryText = document.getElementById("secondaryText");
var secondarySelectors = document.getElementById("secondarySelectors");
var secondaryDiv = document.getElementById("secondaryDiv");

var liveSelector = document.getElementById("liveSelector");
var blankSelector = document.getElementById("blankSelector");

var liveBurnerPhoneSelector = document.getElementById("liveBurnerPhoneSelector");
var blankBurnerPhoneSelector = document.getElementById("blankBurnerPhoneSelector");

var draggedShellType = "";

var resetButton = document.getElementById("resetButton");

var shellsHovered = 0;

var shellOrder = [];

var totalShellCount = 0;


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

resetButton.addEventListener("click", (evt) => Reset());

liveSelector.addEventListener("click", (evt) => SetNextShellType(true));
blankSelector.addEventListener("click", (evt) => SetNextShellType(false));
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

Reset();

for (let i = 0; i < roundShellElements.length; i++){
    roundShellElements[i].addEventListener("dragover", (evt) => {
            evt.preventDefault();
        },
        false,
    );
    roundShellElements[i].addEventListener("drop", (evt) => Drop(evt, i));
}

for (let i = 1; i < countShellElements.length; i++){
    countShellElements[i].addEventListener("click",(evt) => ChooseShellCount(i + 1));
    countShellElements[i].addEventListener("mouseenter", (evt) => HoverShellCount(i + 1));
    countShellElements[i].addEventListener("mouseleave", (evt) => HoverLeaveShellCount());
    AddMouseHoverOpacity(countShellElements[i]);
    roundShellElements[i].addEventListener("dragover", (evt) => {
            evt.preventDefault();
        },
        false,
    );
    roundShellElements[i].addEventListener("drop", (evt) => Drop(evt, i));
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
    totalShellCount = hoveredShellCount;
    for (let i = 0; i < roundShellElements.length; i++){
        roundShellElements[i].src = "images/undefined.png";

        if (i >= totalShellCount){
            roundShellElements[i].classList.add("hideElement");
        }
    }
    shellOrder = []
    for (let i = 0; i < totalShellCount; i++){
        shellOrder[i] = "undefined";
    }
    countShellRow.classList.add("hideElement");
    roundShellRow.classList.remove("hideElement");

    secondarySelectors.classList.remove("hideElement");
    secondaryText.textContent = "";

    if (totalShellCount % 2 == 0){
        shellTypeDatas.liveShellData.shellCount = totalShellCount / 2;
        shellTypeDatas.blankShellData.shellCount = shellTypeDatas.liveShellData.shellCount;
    } else{
        shellTypeDatas.liveShellData.shellCount = Math.floor(totalShellCount / 2);
        shellTypeDatas.blankShellData.shellCount = shellTypeDatas.liveShellData.shellCount + 1;
    }

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
    shellsHovered++;
    for (let i = 0; i < countShellElements.length; i++){
        if (i < hoveredShellCount){
            countShellElements[i].src = "images/live.png";
        } else{
            countShellElements[i].src = "images/undefined.png";
        }
    }
    secondaryText.textContent = hoveredShellCount.toString();
}

function HoverLeaveShellCount(){
    shellsHovered--;
    if (shellsHovered > 0){
        return;
    }
    for (let i = 0; i < countShellElements.length; i++){
        countShellElements[i].src = "images/undefined.png";
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
        roundShellElements[totalShellCount - CurrentShellCount() - 1].src = currentShellTypeData.imageSrc;
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

    CheckIfRoomForMoreShells();

    CheckIfNextShellKnown();
}

function SetShellBorder(index){
    if (index != 0){
        roundShellElements[index - 1].classList.remove("currentRoundShell");
    } 
    if (index < totalShellCount){
        roundShellElements[index].classList.add("currentRoundShell");
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
    SetBurnerPhoneShell(shellIndex);
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
        roundShellElements[shellIndex].src = currentShellTypeData.imageSrc;
    } 
    else if (shellOrder[shellIndex] == otherShellTypeData.shellType)
    {
        currentShellTypeData.burnerPhoneCount++;
        shellOrder[shellIndex] = currentShellTypeData.shellType;
        roundShellElements[shellIndex].src = currentShellTypeData.imageSrc;
        otherShellTypeData.burnerPhoneCount--;
    }

    CheckNextMoveLegality();

    DisplayShellCountMainText();
}


function Reset(){
    for (let i = 0; i < countShellElements.length; i++){
        roundShellElements[i].classList.remove("hideElement");
        countShellElements[i].src = "images/undefined.png";
        countShellElements[i].classList.remove("hideElement");
        roundShellElements[i].classList.remove("currentRoundShell");
    }
    roundShellElements[0].classList.add("currentRoundShell");

    countShellRow.classList.remove("hideElement");
    roundShellRow.classList.add("hideElement");

    secondaryText.innerText = "";
    secondarySelectors.classList.add("hideElement");
    secondaryDiv.classList.remove("hideElement");

    liveSelector.classList.remove("unselectable");
    blankSelector.classList.remove("unselectable");
    liveBurnerPhoneSelector.classList.remove("unselectable");
    blankBurnerPhoneSelector.classList.remove("unselectable");

    shellOrder = [];

    totalShellCount = 0;
    shellsHovered = 0;
    
    shellTypeDatas.liveShellData.shellCount = 0;
    shellTypeDatas.blankShellData.shellCount = 0;

    shellTypeDatas.liveShellData.burnerPhoneCount = 0;
    shellTypeDatas.blankShellData.burnerPhoneCount = 0;

    mainText.innerText = "How many shells?";
}