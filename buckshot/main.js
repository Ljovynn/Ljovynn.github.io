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
liveSelector.addEventListener("click", (evt) => SetNextShellType(true));
blankSelector.addEventListener("click", (evt) => SetNextShellType(false));
AddMouseHoverOpacity(liveSelector);
AddMouseHoverOpacity(blankSelector);
AddMouseHoverSecondaryText(liveSelector, "-1 Live round");
AddMouseHoverSecondaryText(blankSelector, "-1 Blank");

var liveBurnerPhoneSelector = document.getElementById("liveBurnerPhoneSelector");
var blankBurnerPhoneSelector = document.getElementById("blankBurnerPhoneSelector");
AddMouseHoverOpacity(liveBurnerPhoneSelector);
AddMouseHoverOpacity(blankBurnerPhoneSelector);
AddMouseHoverSecondaryText(liveBurnerPhoneSelector, "Drag to the correct shell (live round)");
AddMouseHoverSecondaryText(blankBurnerPhoneSelector, "Drag to the correct shell (blank)");
AddPhoneMovementFunctionality(liveBurnerPhoneSelector, "live");
AddPhoneMovementFunctionality(blankBurnerPhoneSelector, "blank");

var burnerPhoneTouchDraggable = document.getElementById("burnerPhoneTouchDraggable");
burnerPhoneTouchDraggable.addEventListener('touchmove', function(evt) {
    // grab the location of touch
    var touchLocation = evt.targetTouches[0];
    
    // assign box new coordinates based on the touch.
    box.style.left = touchLocation.pageX + 'px';
    box.style.top = touchLocation.pageY + 'px';
  })

burnerPhoneTouchDraggable.addEventListener('touchend', function(evt) {
    
    for (let i = 0; i < totalShellCount; i++){
        if (detectOverlap(burnerPhoneTouchDraggable, roundShellElements[i])){
            SetBurnerPhoneShell(i);
            break;
        }
    }
    burnerPhoneTouchDraggable.classList.add("hideElement");
});

var draggedShellType = "";

var resetButtons = document.getElementsByClassName("resetButton");
for (let i = 0; i < resetButtons.length; i++){
    resetButtons[i].addEventListener("click", (evt) => Reset());
}
Reset();

var shellsHovered = 0;

var shellOrder = [];

var totalShellCount = 0;

var liveCount = 0;
var blankCount = 0;
function CurrentShellCount()
{
    return liveCount + blankCount;
}

var burnerPhoneLiveCount = 0;
var burnerPhoneBlankCount = 0;
var burnerPhoneLivePositions = []
var burnerPhoneBlankPositions = []

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

    element.addEventListener('touchstart', function(e) {

    draggedShellType = shellType;
    var touchLocation = e.targetTouches[0];
    burnerPhoneTouchDraggable.classList.remove("hideElement");

    burnerPhoneTouchDraggable.style.left = touchLocation.pageX + 'px';
    burnerPhoneTouchDraggable.style.top = touchLocation.pageY + 'px';
    })
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
        liveCount = totalShellCount / 2;
        blankCount = liveCount;
    } else{
        liveCount = Math.floor(totalShellCount / 2);
        blankCount = liveCount + 1;
    }

    DisplayShellCountMainText();
}

function DisplayShellCountMainText(){
    var result = liveCount.toString();
    if (burnerPhoneLiveCount > 0)
    {
        result += " (" + -burnerPhoneLiveCount.toString() + ")";
    }
    result += " live rounds, " + blankCount.toString();
    if (burnerPhoneBlankCount > 0)
    {
        result += " (" + -burnerPhoneBlankCount.toString() + ")";
    }
    result += " blanks.";
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
    if (isLive == true){
        if (liveSelector.classList.contains("unselectable")){
            return;
        }
        if (shellOrder[totalShellCount - CurrentShellCount()] == "live"){
            liveCount--;
            burnerPhoneLiveCount--;
        } 
        else{
            shellOrder[totalShellCount - CurrentShellCount()] = "live";
            liveCount--;
            roundShellElements[totalShellCount - CurrentShellCount() - 1].src = "images/live.png";
        }
    } 
    else{
        if (blankSelector.classList.contains("unselectable")){
            return;
        }

        if (shellOrder[totalShellCount - CurrentShellCount()] == "blank"){
            blankCount--;
            burnerPhoneBlankCount--;
        } 
        else{
            shellOrder[totalShellCount - CurrentShellCount()] = "blank";
            blankCount--;
            roundShellElements[totalShellCount - CurrentShellCount() - 1].src = "images/blank.png";
        }
    }

    liveSelector.classList.remove("unselectable");
    blankSelector.classList.remove("unselectable");

    CheckIfRoomForMoreShells();

    CheckIfNextShellKnown();

    if (CurrentShellCount() <= 0){
        secondaryDiv.classList.add("hideElement");
    }

    DisplayShellCountMainText();
    SetShellBorder(totalShellCount - CurrentShellCount());
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
    if (liveCount <= 0){
        liveSelector.classList.add("unselectable");
    }
    if (blankCount <= 0){
        blankSelector.classList.add("unselectable");
    }

    if (liveCount <= burnerPhoneLiveCount){
        liveSelector.classList.add("unselectable");
        liveBurnerPhoneSelector.classList.add("unselectable");
    }
    if (blankCount <= burnerPhoneBlankCount){
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
    switch (draggedShellType){
    case "live":
        if (liveBurnerPhoneSelector.classList.contains("unselectable")){
            return;
        }

        if (shellOrder[shellIndex] == "undefined"){
            burnerPhoneLiveCount++;
            shellOrder[shellIndex] = "live";
            roundShellElements[shellIndex].src = "images/live.png";
        } 
        else if (shellOrder[shellIndex] == "blank")
        {
            burnerPhoneLiveCount++;
            shellOrder[shellIndex] = "live";
            roundShellElements[shellIndex].src = "images/live.png";
            burnerPhoneBlankCount--;
            blankBurnerPhoneSelector.classList.remove("unselectable");
        }
        break;
    case "blank":
        if (blankBurnerPhoneSelector.classList.contains("unselectable")){
            return;
        }
        
        if (shellOrder[shellIndex] == "undefined"){
            burnerPhoneBlankCount++;
            shellOrder[shellIndex] = "blank";
            roundShellElements[shellIndex].src = "images/blank.png";
        } 
        else if (shellOrder[shellIndex] == "live")
        {
            burnerPhoneBlankCount++;
            shellOrder[shellIndex] = "blank";
            roundShellElements[shellIndex].src = "images/blank.png";
            burnerPhoneLiveCount--;
            liveBurnerPhoneSelector.classList.remove("unselectable");
        }
        break;
    }

    CheckIfRoomForMoreShells();

    CheckIfNextShellKnown();

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
    
    liveCount = 0;
    blankCount = 0;

    burnerPhoneLiveCount = 0;
    burnerPhoneBlankCount = 0;

    mainText.innerText = "How many shells?";
}

var detectOverlap = (function () {
    function getPositions(elem) {
        var pos = elem.getBoundingClientRect();
        return [[pos.left, pos.right], [pos.top, pos.bottom]];
    }

    function comparePositions(p1, p2) {
        var r1, r2;
        if (p1[0] < p2[0]) {
          r1 = p1;
          r2 = p2;
        } else {
          r1 = p2;
          r2 = p1;
        }
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (a, b) {
        var pos1 = getPositions(a),
            pos2 = getPositions(b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();