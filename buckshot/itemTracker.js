var itemTrackerMainDiv = document.getElementById("itemTrackerMainDiv");

function gridItem(element, textElement, spawnOrder)
{
    this.element = element;
    this.textElement = textElement;
    this.spawnOrder = spawnOrder;
}

var playerGridItems = [];
var dealerGridItems = [];

var playerItemAmount = 0;
var currentDealerGroup = 1;

var dealerCurrentGroupElement = document.getElementById("dealerGroupCurrentColor");
var dealerNextGroupElement = document.getElementById("dealerGroupNextColor");

const divBackgroundColor = '#3f3f3f';
//0 = unassigned
const colors = 
[
    '#565656',
    '#B2FBFF',
    '#7FFF94',
    '#F6FF5E',
    '#FF9C1C',
    '#FF3200',
    '#72002B',
    '#8600D3',
    '#4D007C'
]

var resetTrackerButton = document.getElementById("resetItemsButton");
var openButton = document.getElementById("openItemTrackerButton");
var closeButton = document.getElementById("closeItemTracker");
var nextGroupButton = document.getElementById("nextGroup");

Setup();

function Setup(){
    let playerGridItemsElements = document.getElementById("playerGridContainer").getElementsByClassName("gridItem");
    let dealerGridItemsElements = document.getElementById("dealerGridContainer").getElementsByClassName("gridItem");

    resetTrackerButton.addEventListener("mousedown", ResetItemTracker);
    openButton.addEventListener("mousedown", OpenItemTracker);
    closeButton.addEventListener("mousedown", CloseItemTracker);
    nextGroupButton.addEventListener("mousedown", AdvanceDealerGroup);

    for (let i = 0; i < playerGridItemsElements.length; i++){
    let playerGI = new gridItem(playerGridItemsElements[i], playerGridItemsElements[i].firstChild, 0);
    playerGridItems.push(playerGI);

    let dealerGI = new gridItem(dealerGridItemsElements[i], dealerGridItemsElements[i].firstChild, 0);
    dealerGridItems.push(dealerGI);

    AddMouseHoverOpacity(playerGridItems[i].element);
    AddMouseHoverOpacity(dealerGridItems[i].element);
    playerGridItems[i].element.addEventListener("mousedown", (evt) => PlayerItemClicked(i));
    dealerGridItems[i].element.addEventListener("mousedown", (evt) => DealerItemClicked(i));
    }

    ResetItemTracker();

    let storedOpenTracker = localStorage['trackerOpen'] || '0'; 
    if (+storedOpenTracker == '1'){
        openButton.classList.add("hideElement");
    } else{
        itemTrackerMainDiv.classList.add("hideElement");
    }
}

function AddMouseHoverOpacity(element){
    element.addEventListener("mouseenter", function(){
        element.classList.add("mouseOverElement");
    });
    element.addEventListener("mouseleave", function(){
        element.classList.remove("mouseOverElement");
    });
}

function PlayerItemClicked(index){
    if (playerGridItems[index].spawnOrder == 0){
        playerItemAmount++;
        AddItem(playerGridItems[index], playerItemAmount);
    } else{
        let spawnOrder = playerGridItems[index].spawnOrder;
        RemoveItem(playerGridItems[index]);
        playerItemAmount--;
        CheckNewSpawnOrders(playerGridItems, spawnOrder, false);
    }
}

function DealerItemClicked(index){
    if (dealerGridItems[index].spawnOrder == 0){
        AddItem(dealerGridItems[index], currentDealerGroup);
    } else{
        let group = dealerGridItems[index].spawnOrder;
        RemoveItem(dealerGridItems[index]);
        CheckNewSpawnOrders(dealerGridItems, group, true);
    }
    CheckIfNextGroupAllowed();
}

function RemoveItem(gridItem){
    gridItem.element.style.backgroundColor = colors[0];
    gridItem.textElement.innerText = "";
    gridItem.spawnOrder = 0;
}

function AddItem(gridItem, spawnOrder){
    gridItem.element.style.backgroundColor = colors[spawnOrder];
    gridItem.textElement.innerText = spawnOrder;
    gridItem.spawnOrder = spawnOrder;
}

function CheckNewSpawnOrders(itemArray, removedItemSpawnOrder, shouldCheckDealerGroups){
    if (shouldCheckDealerGroups){
        if (CheckIfDealerHasItemsInGroup(removedItemSpawnOrder)){
            return;
        }
        if (currentDealerGroup != 1){
            currentDealerGroup--;
            SetDealerGroupElements();
        }
    }
    for (let i = 0; i < itemArray.length; i++){
        if (itemArray[i].spawnOrder > removedItemSpawnOrder){
            AddItem(itemArray[i], itemArray[i].spawnOrder - 1);
        }
    }
}

function OpenItemTracker(){
    itemTrackerMainDiv.classList.remove("hideElement");
    openButton.classList.add("hideElement");
    localStorage['trackerOpen'] = '1';
}

function CloseItemTracker(){
    itemTrackerMainDiv.classList.add("hideElement");
    openButton.classList.remove("hideElement");
    localStorage['trackerOpen'] = '0';
}

function AdvanceDealerGroup(){
    currentDealerGroup++;
    SetDealerGroupElements();
    nextGroupButton.disabled = true;
}

function CheckIfNextGroupAllowed(){
    if (CheckIfDealerHasItemsInGroup(currentDealerGroup) && currentDealerGroup < 8){
        nextGroupButton.disabled = false;
    } else{
        nextGroupButton.disabled = true;
    }
}

function CheckIfDealerHasItemsInGroup(group){
    for (let i = 0; i < dealerGridItems.length; i++){
        if (dealerGridItems[i].spawnOrder == group){
            return true;
        }
    }
    return false;
}

function SetDealerGroupElements(){
    dealerCurrentGroupElement.style.backgroundColor = colors[currentDealerGroup];
    if (currentDealerGroup == 8){
        dealerNextGroupElement.style.backgroundColor = divBackgroundColor
    } else{
        dealerNextGroupElement.style.backgroundColor = colors[currentDealerGroup + 1]
    }
}

function ResetItemTracker(){
    for (let i = 0; i < playerGridItems.length; i++){
        RemoveItem(playerGridItems[i]);
        RemoveItem(dealerGridItems[i]);
    }

    playerItemAmount = 0;
    currentDealerGroup = 1;

    nextGroupButton.disabled = true;
    SetDealerGroupElements();
}