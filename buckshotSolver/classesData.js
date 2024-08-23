for (let i = 0; i < items.length; i++){
    ApplyLocalStorage(items[i]);
}

function ApplyLocalStorage(item){
    let storedPlayerPoints = localStorage.getItem("player" + item.id + "points");
    let storedPlayerFalloff = localStorage.getItem("player" + item.id + "falloff");
    let storedDealerPoints = localStorage.getItem("dealer" + item.id + "points");
    let storedDealerFalloff = localStorage.getItem("dealer" + item.id + "falloff");
    if (storedPlayerPoints){
        item.playerPoints = storedPlayerPoints;
    } else{
        localStorage.setItem("player" + item.id + "points", item.playerPoints);
    }
    if (storedPlayerFalloff){
        item.playerPointsFalloff = storedPlayerFalloff;
    } else{
        localStorage.setItem("player" + item.id + "falloff", item.playerPointsFalloff);
    }
    if (storedDealerPoints){
        item.dealerPoints = storedDealerPoints;
    } else{
        localStorage.setItem("dealer" + item.id + "points", item.dealerPoints);
    }
    if (storedDealerFalloff){
        item.dealerPointsFalloff = storedDealerFalloff;
    } else{
        localStorage.setItem("dealer" + item.id + "falloff", item.dealerPointsFalloff);
    }
}

var items = [
    new ItemData("adrenaline", 10, 1, 8, 1),
    new ItemData("beer", 5, 1, 2, 1),
    new ItemData("burner phone", 6, 2, 6, 1),
    new ItemData("cigarettes", 7, 1, 7, 0),
    new ItemData("expired medicine", 1, 0, 2, 0),
    new ItemData("handsaw", 7, 3, 8, 3),
    new ItemData("handcuffs", 8, 4, 8, 4),
    new ItemData("inverter", 5, 3, 3, 2),
    new ItemData("magnifying glass", 8, 0, 8, 1),
]

//make sure to order item arrays by spawn order
//todo: dealer knows shell chance
function Gamestate(playersTurn, remainingLives, remainingBlanks, playerHealth, dealerHealth, playerKnownShells, dealerKnownShells, playerItems, dealerItems, sawUsed, cuffsUsed, inverterUsed, dealerMedsUsed,
    dealerTarget, dealersFirstAction){
    this.playersTurn = playersTurn;
    this.remainingLives = remainingLives;
    this.remainingBlanks = remainingBlanks;
    this.playerHealth = Math.max(playerHealth, 0);
    this.dealerHealth = Math.max(dealerHealth, 0);
    this.playerKnownShells = playerKnownShells;
    this.dealerKnownShells = dealerKnownShells;
    this.playerItems = playerItems;
    this.dealerItems = dealerItems;
    this.sawUsed = sawUsed;
    this.cuffsUsed = cuffsUsed;
    this.inverterUsed = inverterUsed;
    this.dealerMedsUsed = dealerMedsUsed;
    this.dealerTarget = dealerTarget;
    this.dealersFirstAction = dealersFirstAction;
}

function ItemData(id, playerPoints, playerPointsFalloff, dealerPoints, dealerPointsFalloff){
    this.id = id;
    this.playerPoints = playerPoints;
    this.playerPointsFalloff = playerPointsFalloff;
    this.dealerPoints = dealerPoints;
    this.dealerPointsFalloff = dealerPointsFalloff;
}

function Item(id, spawnOrder){
    this.id = id;
    this.spawnOrder = spawnOrder;
}

function TreeNode(gamestate, action, actorActionable, weight = null){
    this.children = [];
    this.gamestate = gamestate;
    this.actions = action;
    this.parameters = parameters;
    this.actorActionable = actorActionable;
    this.weight = weight;
    if (action !== null) action(this);
}

//todo: add health data
function calculationData(winChance, survivalChance, playerItemPointsChance, dealerItemPointsChance){
    this.winChance = winChance;
    this.survivalChance = survivalChance;
    this.playerItemPointsChance = playerItemPoi1ntsChance;
    this.dealerItemPointChances = dealerItemPointsChance;
}