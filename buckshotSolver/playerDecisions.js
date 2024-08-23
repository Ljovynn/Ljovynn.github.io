function GetAllPossiblePlayerDecisions(gamestate){
    var treeNodes = [];
    treeNodes.push(new TreeNode(structuredClone(gamestate), ActionPlayerShootDealer, false));
    treeNodes.push(new TreeNode(structuredClone(gamestate), ActionPlayerShootSelf, false));
    for (let i = 0; i < gamestate.playerItems.length; i++){
        //todo item logic
    }
    return treeNodes;
}

//todo: apply remaining unknown shells as weight
function ActionPlayerShootDealer(node){
    let shellIndex = 8 - node.gameState.remainingLives - node.gameState.remainingBlanks;
    let unknownLiveCount = node.gameState.remainingLives;
    let unknownBlankCount = node.gameState.remainingBlanks;
    for ( let i = shellIndex; i < 8; i++){
        if (node.gameState.playerKnownShells[i] === 'live' || node.gameState.dealerKnownShells[i] === 'live') unknownLiveCount--;
        if (node.gameState.playerKnownShells[i] === 'blank' || node.gameState.dealerKnownShells[i] === 'blank') unknownBlankCount--;
    }
    if (node.gameState.playerKnownShells[shellIndex] !== 'live' && node.gameState.dealerKnownShells[shellIndex] !== 'blank' && node.gameState.remainingLives > 0){
        let childGamestate = structuredClone(node.gameState);
        childGamestate.remainingLives--;
        PlayerCheckCuffs(childGamestate);
        if (node.gameState.inverterUsed){
            childGamestate.inverterUsed = false;
        } else{
            childGamestate.dealerHealth -= PlayerCheckSaw(childGamestate);
        }
        node.children.push(new TreeNode(childGamestate, null, true, node.gameState.remainingLives))
    }
    if (node.gameState.playerKnownShells[shellIndex] !== 'blank' && node.gameState.dealerKnownShells[shellIndex] !== 'live' && node.gameState.remainingBlanks > 0){
        let childGamestate = structuredClone(node.gameState);
        childGamestate.remainingBlanks--;
        PlayerCheckCuffs(childGamestate);
        if (node.gameState.inverterUsed){
            childGamestate.inverterUsed = false;
            childGamestate.dealerHealth -= PlayerCheckSaw(childGamestate);
        }
        node.children.push(new TreeNode(childGamestate, null, true, node.gameState.remainingBlanks))
    }
}

function ActionPlayerShootSelf(node){
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

function PlayerCheckCuffs(gamestate){
    if (gamestate.cuffsUsed){
        gamestate.cuffsUsed = false;
    } else{
        gamestate.playersTurn = false;
    }
}

function PlayerCheckSaw(gamestate){
    if (gamestate.sawUsed){
        gamestate.sawUsed = false;
        return 2;
    } else{
        return 1;
    }
}