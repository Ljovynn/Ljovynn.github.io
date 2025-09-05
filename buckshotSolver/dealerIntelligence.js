function DealerMakeDecision(gamestate){
    var treeNodes = [];
    let dealerHasSaw = false;
    let shellIndex = 8 - gameState.remainingLives - gameState.remainingBlanks;

    for (let i = 0; i < gamestate.dealerItems.length; i++){
        //todo use items
    }
    //already knows phone and knows 

    if (gamestate.dealerTarget == 'player' ||
        (gameState.dealerKnownShells[shellIndex] === 'live' && !gamestate.inverterUsed) || (gamestate.dealerKnownShells[shellIndex] === 'blank' && gamestate.inverterUsed)){
        //todo check saw
        //add two actions for shoot player
        treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootPlayer, false));
        return;
    }
    if (gamestate.dealerTarget == 'self' ||
        (gameState.dealerKnownShells[shellIndex] === 'blank' && !gamestate.inverterUsed) || (gamestate.dealerKnownShells[shellIndex] === 'live' && gamestate.inverterUsed)){
        treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootSelf, false));
        return;
    }

    if (gamestate.remainingLives > gamestate.remainingBlanks){
        //todo check saw
        treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootPlayer, false));
        return;
    }
    if (gamestate.remainingBlanks > gamestate.remainingLives){
        treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootSelf, false));
        return;
    }
    treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootSelf, false));
    treeNodes.push(new TreeNode(structuredClone(gamestate), ActionDealerShootPlayer, false));
    return treeNodes;
}

//todo: turn actions into 4 different ones
function ActionDealerShootPlayer(node){
    let shellIndex = 8 - node.gameState.remainingLives - node.gameState.remainingBlanks;
    if (node.gameState.playerKnownShells[shellIndex] !== 'blank' && node.gameState.dealerKnownShells[shellIndex] !== 'blank' && node.gameState.remainingLives > 0){
        let childGamestate = structuredClone(node.gameState);
        childGamestate.remainingLives--;
        PlayerCheckCuffs(childGamestate);
        if (node.gameState.inverterUsed){
            childGamestate.inverterUsed = false;
        } else{
            childGamestate.playerHealth -= PlayerCheckSaw(childGamestate);
        }
        node.children.push(new TreeNode(childGamestate, null, true, node.gameState.remainingLives))
    }
    if (node.gameState.playerKnownShells[shellIndex] !== 'live' && node.gameState.dealerKnownShells[shellIndex] !== 'live' && node.gameState.remainingBlanks > 0){
        let childGamestate = structuredClone(node.gameState);
        childGamestate.remainingBlanks--;
        PlayerCheckCuffs(childGamestate);
        if (node.gameState.inverterUsed){
            childGamestate.inverterUsed = false;
            childGamestate.playerHealth -= PlayerCheckSaw(childGamestate);
        }
        node.children.push(new TreeNode(childGamestate, null, true, node.gameState.remainingBlanks))
    }
}

function ActionDealerShootSelf(node){

}

function DealerCheckCuffs(gamestate){
    if (gamestate.cuffsUsed){
        gamestate.cuffsUsed = false;
    } else{
        gamestate.playersTurn = true;
    }
}