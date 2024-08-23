var liveCount = 3;
var blankCount = 3;
var phoneCount = 1;
var shellCountWhenPhoneUsed = 7;
let startingKnowsShellChance = 1 - Math.pow((shellCountWhenPhoneUsed - 2) / (shellCountWhenPhoneUsed - 1), phoneCount);

let futureShellChance = Calculate(startingKnowsShellChance);

blankCount--;

function Calculate(knowsShellChance){
    console.log(`\nStart of calculation: ${liveCount} lives, ${blankCount} blanks, ${phoneCount} phones used at ${shellCountWhenPhoneUsed} shells left`);
    console.log('This is just a test function, and will always assume the dealer is in a true 50/50, then shoots himself with a blank.')
    console.log("Chance of knowing random shell: " + knowsShellChance);
    //assume even shells
    let guessShootSelfLiveChance = (1 - knowsShellChance) * ((liveCount / (blankCount + liveCount)) / 2);
    let guessShootSelfBlankChance = (1 - knowsShellChance) * ((blankCount / (blankCount + liveCount)) / 2);
    let guessShootPlayerLiveChance = (1 - knowsShellChance) * ((liveCount / (blankCount + liveCount)) / 2);
    let guessShootPlayerBlankChance = (1 - knowsShellChance) * ((liveCount / (blankCount + liveCount)) / 2);
    let knowShootSelfBlankChance = knowsShellChance * (blankCount / (blankCount + liveCount));
    let knowShootPlayerLiveChance = knowsShellChance * (liveCount / (blankCount + liveCount));
    console.log("Guess shoot self blank chance: " + guessShootSelfBlankChance);
    console.log("Know Shoot self blank chance: " + knowShootSelfBlankChance);
    let knowWhenCorrectGuessChance =  (knowShootSelfBlankChance + knowShootPlayerLiveChance) /
    (guessShootSelfBlankChance + guessShootPlayerLiveChance + knowShootSelfBlankChance + knowShootPlayerLiveChance);
    console.log("Know when correct guess chance: " + knowWhenCorrectGuessChance);
    let sumOfShellChancesBeforeShoot = knowsShellChance * (blankCount + liveCount);
    let sumOfShellChancesAfterShoot = sumOfShellChancesBeforeShoot - knowWhenCorrectGuessChance;
    let knowsFutureShellChance = sumOfShellChancesAfterShoot / (blankCount + liveCount - 1);
    console.log("Chance he knows a future shot: " + knowsFutureShellChance);
    return knowsFutureShellChance;
}