var liveCount = 1;
var blankCount = 2;
var phoneCount = 1;
var shellCountWhenPhoneUsed = 7;
let startingKnowsShellChance = 1 - Math.pow((shellCountWhenPhoneUsed - 2) / (shellCountWhenPhoneUsed - 1), phoneCount);

//let futureShellChance = Calculate(startingKnowsShellChance);

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

function CalculateKnowsLoadoutChance(knowsShellChance){
    console.log("Chance of knowing random shell: " + knowsShellChance);

}

//nuxify("I Am grohk yeah I reall. GROOT I AM  |  I wanna kissiy ou - no i dont. i am grateful");

function nuxify(oldTitle){
    let sentences = oldTitle.split(/([\.]|[\b-]|[\b\|])+/g);
    for (let i = 0; i < sentences.length; ++i){
        console.log(sentences[i]);
        const uppercase = (!sentences[i].match(/[a-z]/));
        if (uppercase){
            sentences[i] = sentences[i].replace(/\bI\b/g, 'WE');
        } else{
            //if first word of the sentence
            let firstWordPos = sentences[i].search(/[a-zA-Z]/)
            console.log(sentences[i][firstWordPos + 1]);
            if (firstWordPos !== -1 && sentences[i][firstWordPos + 1] != /\w/){
                if (sentences[i][firstWordPos] == 'I'){
                    if (firstWordPos != 0) sentences[i] = sentences[i].slice(0, firstWordPos - 1);
                    sentences[i] = 'We' + sentences[i].slice(firstWordPos + 1, sentences[i].length)
                    console.log("Hej");
                } else if (sentences[i][firstWordPos] == 'i'){
                    if (firstWordPos != 0) sentences[i] = sentences[i].slice(0, firstWordPos - 1);
                    sentences[i] = 'we' + sentences[i].slice(firstWordPos + 1, sentences[i].length);
                }
                console.log(sentences[i]);
            }
        }
    }
    let newTitle = "";
    for (let i = 0; i < sentences.length; ++i){
        newTitle += sentences[i];
    }
    //newTitle = newTitle.replace(/\bi\b/gi, "we");

    console.log(newTitle);
}