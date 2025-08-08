const cardInput = document.getElementById('cardInput');
const dropdown = document.getElementById('dropdownList');
const guessArea = document.querySelector('.guess-area');
const inputButton = document.getElementById('inputButton')
const shareButton = document.getElementById('shareButton')
const winPopup = document.querySelector('.win-popup');
const infoPopup = document.querySelector('.info-popup');
const cornerShareButton = document.getElementById('cornerShareButton');
const infoButton = document.getElementById('infoButton');
const closePopupButtons = document.getElementsByClassName('close-popup-button');

var won = false;

var gameStateHistory = [];
var guessedCardHistory = [];

const guessConditions = {
    wrong: 0,
    close: 1,
    correct: 2,
}

const cardAttributeOrder = {
    name: 0,
    ID: 1,
    size: 2,
    SPSpend: 3,
    length: 4,
    width: 5,
    category: 6,
    releaseDate: 7
}

const idCloseThreshold = 20;
const sizeCloseThreshold = 2;
const spendCloseThreshold = 1;
const lengthWidthThreshold = 1;

const uniqueCards = 266;

//id sorted
var cards = [];

//alphabetically sorted
var enCardList = [];
var jpCardList = [];
var currentCardList;

const today = GetCurrentDate();
document.getElementById('dateText').innerText = today;

var dailyCard;

var language = localStorage['language'] || 'en';
document.getElementById('langInput').addEventListener('click', () => {
    language = (language === 'en') ? 'ja' : 'en';
    localStorage['language'] = language;
    ApplyLanguage();
});

var langData = {};

FullSetup();

async function FullSetup(){
    await SetupCards();
    await SetupLangData();
    RestoreGameHistory();
}

function RestoreGameHistory(){
    let storedLatestDate = localStorage['latestDate'] || today;
    localStorage['latestDate'] = today;
    //delete history if new day
    if (storedLatestDate != today){
        localStorage['guessHistory'] = JSON.stringify([]);
        return;
    }
    let storedGameHistory = JSON.parse(localStorage['guessHistory'] || '[]');
    for (let i = 0; i < storedGameHistory.length; i++){
        const card = GetCardById(storedGameHistory[i])
        AddNewGuess(card);
    }
}

async function SetupLangData(){
    //const response = await fetch("./langData.json");
    const response = await fetch("https://ljovynn.github.io/tableturfle/langData.json");
    const langJSON = await response.json();
    langData = langJSON;
    ApplyLanguage();
}

function ApplyLanguage(){
    //buttons and popups and input
    cardInput.placeholder = langData[language].input.prompt;
    inputButton.innerText = langData[language].input.guess;
    infoButton.innerText = langData[language].input.info;
    shareButton.innerText = langData[language].input.share;
    cornerShareButton.innerText = langData[language].input.share;
    for (let i = 0; i < closePopupButtons.length; i++){
        closePopupButtons[i].innerText = langData[language].input.close;
    }
    //change in first guess-area
    guessArea.children[0].children[cardAttributeOrder.name].childNodes[0].innerText = langData[language].attributes.name;
    guessArea.children[0].children[cardAttributeOrder.ID].childNodes[0].innerText = langData[language].attributes.ID;
    guessArea.children[0].children[cardAttributeOrder.size].childNodes[0].innerText = langData[language].attributes.size;
    guessArea.children[0].children[cardAttributeOrder.SPSpend].childNodes[0].innerText = langData[language].attributes.SPSpend;
    guessArea.children[0].children[cardAttributeOrder.length].childNodes[0].innerText = langData[language].attributes.length;
    guessArea.children[0].children[cardAttributeOrder.width].childNodes[0].innerText = langData[language].attributes.width;
    guessArea.children[0].children[cardAttributeOrder.category].childNodes[0].innerText = langData[language].attributes.category;
    guessArea.children[0].children[cardAttributeOrder.releaseDate].childNodes[0].innerText = langData[language].attributes.releaseDate;
    //for each card in guessedCardHistory, change first in each guess-area
    for (let i = 1; i < guessArea.children.length; ++i){
        let card = GetCardById(guessedCardHistory[i - 1]);
        switch (language){
            case 'ja':
                guessArea.children[i].children[cardAttributeOrder.name].childNodes[0].innerText = card.jpName;
                break;
            default:
                guessArea.children[i].children[cardAttributeOrder.name].childNodes[0].innerText = card.name;
                break;
        }
        guessArea.children[i].children[cardAttributeOrder.category].childNodes[0].innerText = langData[language].categories[card.category];
    }
    switch (language){
        case 'ja':
            currentCardList = jpCardList.slice();
            break;
        default:
            currentCardList = enCardList.slice();
            break;
    }
    if (won){
        UpdateWinPopup();
    } else{
        //ShowDropdown(FilterInputOptions(cardInput.value));
    }
}

function ShowDropdown(items) {
    dropdown.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        div.textContent = item;
        div.onclick = () => {
            cardInput.value = item;
            dropdown.style.display = 'none';
        };
        dropdown.appendChild(div);
    });

    dropdown.style.display = items.length > 0 ? 'block' : 'none';
}

cardInput.addEventListener('focus', () => {
    ShowDropdown(FilterInputOptions(cardInput.value));
});

cardInput.addEventListener('input', () => {
    ShowDropdown(FilterInputOptions(cardInput.value));
});

document.addEventListener('click', (e) => {
if (!e.target.closest('.dropdown-container')) {
    dropdown.style.display = 'none';
}
});

inputButton.addEventListener('click', () => {
    const guessedCard = GetCardByName(cardInput.value);
    if (!guessedCard) return; //TODO: UI feedback confirm

    AddNewGuess(guessedCard);
    localStorage['guessHistory'] = JSON.stringify(guessedCardHistory);
});

infoButton.addEventListener('click', () => {
    infoPopup.classList.add('open-popup');
    infoButton.disabled = true;
});

function AddNewGuess(guessedCard){
    let newGuess = document.createElement('div');
    newGuess.className = 'guess';
    gameStateHistory.push([]);
    guessedCardHistory.push(guessedCard.id);

    //add all unique sections
    let nameSection = document.createElement('div');
    nameSection.className = 'guess-section';
    switch (language){
        case 'ja':
            AddTextToGuessSection(nameSection, guessedCard.jpName);
            break;
        default:
            AddTextToGuessSection(nameSection, guessedCard.name);
            break;
    }
    newGuess.appendChild(nameSection);

    let idSection = document.createElement('div');
    idSection.className = 'guess-section';
    AddTextToGuessSection(idSection, guessedCard.id);
    if (guessedCard.id == dailyCard.id){
        idSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
        WinGame();
    } else if (guessedCard.id >= dailyCard.id - idCloseThreshold && guessedCard.id <= dailyCard.id + idCloseThreshold){
        idSection.classList.add('close-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.close);
    } else{
        idSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(idSection);

    let sizeSection = document.createElement('div');
    sizeSection.className = 'guess-section';
    AddTextToGuessSection(sizeSection, guessedCard.size);
    if (guessedCard.size == dailyCard.size){
        sizeSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else if (guessedCard.size >= dailyCard.size - sizeCloseThreshold && guessedCard.size <= dailyCard.size + sizeCloseThreshold){
        sizeSection.classList.add('close-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.close);
    } else{
        sizeSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(sizeSection);

    let spendSection = document.createElement('div');
    spendSection.className = 'guess-section';
    AddTextToGuessSection(spendSection, guessedCard.spend);
    if (guessedCard.spend == dailyCard.spend){
        spendSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else if (guessedCard.spend >= dailyCard.spend - spendCloseThreshold && guessedCard.spend <= dailyCard.spend + spendCloseThreshold){
        spendSection.classList.add('close-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.close);
    } else{
        spendSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(spendSection);

    let lengthSection = document.createElement('div');
    lengthSection.className = 'guess-section';
    AddTextToGuessSection(lengthSection, guessedCard.length);
    if (guessedCard.length == dailyCard.length){
        lengthSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else if (guessedCard.length >= dailyCard.length - lengthWidthThreshold && guessedCard.length <= dailyCard.length + lengthWidthThreshold){
        lengthSection.classList.add('close-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.close);
    } else{
        lengthSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(lengthSection);

    let widthSection = document.createElement('div');
    widthSection.className = 'guess-section';
    AddTextToGuessSection(widthSection, guessedCard.width);
    if (guessedCard.width == dailyCard.width){
        widthSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else if (guessedCard.width >= dailyCard.width - lengthWidthThreshold && guessedCard.width <= dailyCard.width + lengthWidthThreshold){
        widthSection.classList.add('close-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.close);
    } else{
        widthSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(widthSection);

    let categorySection = document.createElement('div');
    categorySection.className = 'guess-section';
    AddTextToGuessSection(categorySection, langData[language].categories[guessedCard.category]);
    if (guessedCard.category == dailyCard.category){
        categorySection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else{
        categorySection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(categorySection);

    let dateSection = document.createElement('div');
    dateSection.className = 'guess-section';
    AddTextToGuessSection(dateSection, guessedCard.date);
    if (guessedCard.date == dailyCard.date){
        dateSection.classList.add('correct-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.correct);
    } else{
        dateSection.classList.add('wrong-value');
        gameStateHistory[gameStateHistory.length - 1].push(guessConditions.wrong);
    }
    newGuess.appendChild(dateSection);

    guessArea.appendChild(newGuess);

    cardInput.value = "";
}

shareButton.addEventListener('click', () => {
    CopyGameToClipboard();
});

cornerShareButton.addEventListener('click', () => {
    CopyGameToClipboard();
});

function CopyGameToClipboard(){
    let copyValue = "🟨 TABLETURFLE 🟦\n" + langData[language].copyText.triesText1 + gameStateHistory.length;
    if (gameStateHistory.length == 1){
        copyValue += langData[language].copyText.triesText2Singular;
    } else{
        copyValue += langData[language].copyText.triesText2Plural;
    }
    copyValue += "\n";
    for (let i = 0; i < gameStateHistory.length; i++){
        copyValue += '\n';
        for (let j = 0; j < gameStateHistory[i].length; j++){
            switch (gameStateHistory[i][j]){
                case guessConditions.correct:
                    copyValue += "🟩";
                    break;
                case guessConditions.close:
                    copyValue += "🟨";
                    break;
                default:
                    copyValue += "🟥";
                    break;
            }
        }
    }
    copyValue += "\n\n(" + today + ")\n" + langData[language].copyText.playAt + "https://ljovynn.github.io/tableturfle/main.html";
    navigator.clipboard.writeText(copyValue);
    //confirm("Copied!");
}

for (let i = 0; i < closePopupButtons.length; i++){
    closePopupButtons[i].addEventListener('click', () => {
        winPopup.classList.remove('open-popup')
        infoPopup.classList.remove('open-popup')
        infoButton.disabled = false;
    });
}

function AddTextToGuessSection(section, text){
    let header = document.createElement('h3');
    header.textContent = text;
    section.appendChild(header);
}

function WinGame(){
    won = true;
    cardInput.disabled = true;
    inputButton.disabled = true;
    cornerShareButton.classList.add('open-popup');
    winPopup.classList.add('open-popup');
    infoButton.disabled = true;
    UpdateWinPopup();
}

function UpdateWinPopup(){
    document.getElementById('winCongratsText').innerText = langData[language].winPopup.congratulations;
    let guessText = langData[language].winPopup.winText1 + gameStateHistory.length;
     if (gameStateHistory.length == 1){
        guessText += langData[language].winPopup.winText2Singular;
    } else{
        guessText += langData[language].winPopup.winText2Plural;
    }
    document.getElementById('guessTotalText').innerText = guessText;
}

// "YYYY-MM-DD"
function GetCurrentDate(){
    const now = new Date();
    const utcDateString = now.toISOString().split("T")[0];
    return utcDateString;
}

function FilterInputOptions(input, max = uniqueCards){
    const sanitizedInput = SanitizeString(input);
    let filteredChoices = [];
    if (sanitizedInput == ""){
        for (let i = 0; i < max; i++){
            filteredChoices.push(currentCardList[i].name);
        }
        return filteredChoices;
    }

    for (let i = 0; i < currentCardList.length; i++){
        if (currentCardList[i].sanitizedName.includes(sanitizedInput)){
            filteredChoices.push(currentCardList[i].name);
        }
    }
    filteredChoices = filteredChoices.slice(0, max);
    return filteredChoices;
}

function GetDailyNumber() {
    // FNV-1a hash (32-bit)
    let hash = 0x811c9dc5;
    for (let i = 0; i < today.length; i++) {
        hash ^= today.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }

    const number = (hash % uniqueCards) + 1;
    return number;
}
//TODO: one ID sorted list, other language lists with just name and id
async function SetupCards(){
    //const response = await fetch("./cardData.json");
    const response = await fetch("https://ljovynn.github.io/tableturfle/cardData.json");
    const cardsJSON = await response.json();

    let i = GetDailyNumber() - 1;
    dailyCard = cardsJSON[i];

    for (let i = 0; i < cardsJSON.length; i++){
        cards.push({
            id: i + 1,
            name: cardsJSON[i].name,
            jpName: cardsJSON[i].jpName,
            sanitizedName: SanitizeString(cardsJSON[i].name),
            sanitizedJpName: SanitizeString(cardsJSON[i].jpName),
            size: cardsJSON[i].size,
            spend: cardsJSON[i].spend,
            length: cardsJSON[i].length,
            width: cardsJSON[i].width,
            category: cardsJSON[i].category,
            date: cardsJSON[i].date,
        });
        enCardList.push({
            id: i + 1,
            name: cardsJSON[i].name,
            sanitizedName: SanitizeString(cardsJSON[i].name),
        });
        jpCardList.push({
            id: i + 1,
            name: cardsJSON[i].jpName,
            sanitizedName: SanitizeString(cardsJSON[i].jpName),
        });
    }

    enCardList.sort((a, b) => a.name.localeCompare(b.name));
    jpCardList.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
    inputButton.disabled = false;
}

function GetCardByName(inputName){
    let sanitizedInput = SanitizeString(inputName);
    for (let i = 0; i < currentCardList.length; i++){
        if (currentCardList[i].sanitizedName === sanitizedInput){
            return GetCardById(currentCardList[i].id);
        }
    }
}

function GetCardById(id){
    return cards[id - 1];
}

//lowercase, remove special characters
function SanitizeString(string){
    let result;
    result = string.toLowerCase();
    result = result.replace(/\s|-|\'|\.|#/g, '');
    return result;
}