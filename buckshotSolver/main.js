var maxHealth = 4;
var carryoverRound = false;

var baseGamestate =

function CalculateWinPercentages(node){
    if (node.gamestate.playerHealth == 0){
        return new calculationData(0, 0, null, null)
    }
    if (node.gamestate.dealerHealth == 0){
        return new calculationData(1, 1, null, null)
    }
    if (node.gamestate.remainingLives == 0 && node.gamestate.remainingBlanks == 0){
        let totalPlayerItemPoints = 0;
        let alreadyCalculatedItems = [];
        for (let i = 0; i < node.gamestate.playerItems.length; i++){
            let itemData = items.find(x => x.id === node.gamestate.playerItems[i].id);
            let itemPoints = itemData.playerPoints;
            let itemFallof = itemData.playerPointsFalloff;

            for (let j = 0; j < alreadyCalculatedItems.length; j++){
                if (alreadyCalculatedItems[j] === node.gamestate.playerItems[i].id) itemPoints -= itemFallof;
            }
            if (itemPoints < 1) itemPoints = 1;
            alreadyCalculatedItems.push(node.gamestate.playerItems[i].id);
            
            totalPlayerItemPoints += itemPoints;
        }

        let totalDealerItemPoints = 0;
        alreadyCalculatedItems = [];
        for (let i = 0; i < node.gamestate.dealerItems.length; i++){
            let itemData = items.find(x => x.id === node.gamestate.dealerItems[i].id);
            let itemPoints = itemData.dealerPoints;
            let itemFallof = itemData.dealerPointsFalloff;
            
            for (let j = 0; j < alreadyCalculatedItems.length; j++){
                if (alreadyCalculatedItems[j] === node.gamestate.dealerItems[i].id) itemPoints -= itemFallof;
            }
            if (itemPoints < 1) itemPoints = 1;
            alreadyCalculatedItems.push(node.gamestate.dealerItems[i].id);
            
            totalDealerItemPoints += itemPoints;
        }
        return new calculationData(0, 1, totalPlayerItemPoints, totalDealerItemPoints);
    }
    //only account item points when neither dies (not null)
    if (!node.gamestate.actorActionable){
        //weighted probabiltiy
    } else if (node.gamestate.playersTurn){
        //get all player decisions then take best decision
    } else{
        //choose random option of dealerintelligence
    }
}

function StartCalculations(gamestate){
    var baseNode = new TreeNode(structuredClone(gamestate), null);
}
function ActionPlayerShootSelf(gamestate){

}

function ActionDealerShootPlayer(gamestate){

}

function ActionDealerShootSelf(gamestate){

}