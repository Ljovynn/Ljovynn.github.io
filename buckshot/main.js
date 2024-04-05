var shellElements = document.getElementById("shellRow").body.children;

var secondaryText = document.getElementById("secondaryText");
var secondarySelectors = document.getElementById("secondarySelectors");

var liveSelector = document.getElementById("liveSelector");
var blankSelector = document.getElementById("blankSelector");
liveSelector.addEventListener("click",(evt) => SetNextShellType(true));
blankSelector.addEventListener("click",(evt) => SetNextShellType(false));

var liveBurnerPhoneSelector = getElementById("liveBurnerPhoneSelector");
var blankBurnerPhoneSelector = getElementById("blankBurnerPhoneSelector");

var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click",(evt) => Reset());

var shellsHovered = 0;

var totalShellCount = 0;

var liveCount = 0;
var blankCount = 0;
function GetCurrentShellCount()
{
    return liveCount + blankCount;
}

var burnerPhoneLiveCount = 0;
var burnerPhoneBlankCount = 0;

Reset();

document.getElementById("resetButton").addEventListener("click",(evt) => Reset());

function ChooseShellCount(hoveredShellCount){
    totalShellCount = hoveredShellCount;
    currentShellCount = totalShellCount;
    for (let i = 0; i < shellElements.length; i++){
        shellElements[i].removeEventListener("click",(evt) => ChooseShellCount(i + 1));
        shellElements[i].removeEventListener("mouseenter",(evt) => HoverShellCount(i + 1));
        shellElements[i].removeEventListener("mouseleave",(evt) => HoverLeaveShellCount());
        shellElements[i].src = "images/undefined.png";

        if (i >= totalShellCount){
            shellElements[i].classList.add("hideElement");
        }
    }
    secondaryText.classList.add("hideElement");
    secondarySelectors.classList.remove("hideElement");
    secondaryText.textContent = "";

    DisplayShellCountMainText();
}

function DisplayShellCountMainText(){
    var s = liveCount.toString();
    if (burnerPhoneLiveCount > 0)
    {
        s += " (" + -burnerPhoneLiveCount.toString() + ")";
    }
    s += " live rounds, " + blankCount.toString();
    if (burnerPhoneBlankCount > 0)
    {
        s += " (" + -burnerPhoneBlankCount.toString() + ")";
    }
    s += " blanks.";
}

function HoverShellCount(hoveredShellCount){
    shellsHovered++;
    for (let i = 0; i < shellElements; i++){
        if (i < hoveredShellCount){
            shellElements[i].src = "images/live.png";
        } else{
            shellElements[i].src = "images/undefined.png";
        }
    }
    secondaryText.textContent = hoveredShellCount.toString();
}

function HoverLeaveShellCount(){
    shellsHovered--;
    if (shellsHovered > 0){
        return;
    }
    for (let i = 0; i < shellElements.length; i++){
        shellElements[i].src = "images/undefined.png";
    }
}

function SetNextShellType(isLive)
{
    if (isLive == true){
        liveCount++;
        shellElements[GetCurrentShellCount() - 1].src = "images/live.png";
    } else{
        blankCount++;
        shellElements[GetCurrentShellCount() - 1].src = "images/blank.png";
    }

    var stoppedLookingForNextShell = false;
    while (stoppedLookingForNextShell == false){
        if (GetCurrentShellCount() < totalShellCount){
            if (shellElements[GetCurrentShellCount()].src == "images/live.png"){
            burnerPhoneLiveCount--;
            liveCount++;
            } 
            else if(shellElements[GetCurrentShellCount()].src == "images/blank.png"){
            burnerPhoneBlankCount--;
            blankCount++;
            } else{
                stoppedLookingForNextShell = true;
            }
        } else{
            stoppedLookingForNextShell = true;
        }
    }

    DisplayShellCountMainText();
}

function Reset(){
    for (let i = 0; i < shellElements.length; i++){
        shellElements[i].addEventListener("click",(evt) => ChooseShellCount(i + 1));
        shellElements[i].addEventListener("mouseenter",(evt) => HoverShellCount(i + 1));
        shellElements[i].addEventListener("mouseleave",(evt) => HoverLeaveShellCount());
        shellElements[i].src = "images/undefined.png";
    }
    secondaryText.classList.remove("hideElement");
    secondarySelectors.classList.add("hideElement");

    totalShellCount = 0;
    shellsHovered = 0;
    
    liveCount = 0;
    blankCount = 0;

    burnerPhoneLiveCount = 0;
    burnerPhoneBlankCount = 0;
}