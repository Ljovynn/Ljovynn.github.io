const cardInput = document.getElementById('cardInput');
const dropdown = document.getElementById('dropdownList');
const guessArea = document.querySelector('.guess-area');
const inputButton = document.getElementById('inputButton')
const closePopupButton = document.getElementById('closePopupButton')
const shareButton = document.getElementById('shareButton')
const winPopup = document.querySelector('.win-popup');
const infoPopup = document.querySelector('.info-popup');
const cornerShareButton = document.getElementById('corner-share-button');

var options = [];

var won = false;

var gameStateHistory = [];
var guessedCardHistory = [];

const guessConditions = {
    wrong: 0,
    close: 1,
    correct: 2,
}

var idCloseThreshold = 25;
var sizeCloseThreshold = 2;
var spendCloseThreshold = 1;

const uniqueCards = 266;

//alphabetically sorted
var cards = [];

var dailyCard;

FullSetup();

async function FullSetup(){
    await SetupCards();
    RestoreGameHistory();
}

function RestoreGameHistory(){
    let currentDateString = GetCurrentDate();
    let storedLatestValue = localStorage['latestDate'] || currentDateString;
    localStorage['latestDate'] = currentDateString;
    //delete history if new day
    if (storedLatestValue != currentDateString){
        localStorage['guessHistory'] = JSON.stringify([]);
        return;
    }
    let storedGameHistory = JSON.parse(localStorage['guessHistory'] || '[]');
    for (let i = 0; i < storedGameHistory.length; i++){
        const card = GetCardById(storedGameHistory[i])
        AddNewGuess(card);
    }
}

function showDropdown(items) {
    dropdown.innerHTML = '';
    const limitedItems = items.slice(0, 5);

    limitedItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        div.textContent = item;
        div.onclick = () => {
            cardInput.value = item;
            dropdown.style.display = 'none';
        };
        dropdown.appendChild(div);
    });

    dropdown.style.display = limitedItems.length > 0 ? 'block' : 'none';
}

cardInput.addEventListener('focus', () => {
    showDropdown(FilterOptions(cardInput.value));
});

cardInput.addEventListener('input', () => {
    showDropdown(FilterOptions(cardInput.value));
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

function AddNewGuess(guessedCard){
    let newGuess = document.createElement('div');
    newGuess.className = 'guess';
    gameStateHistory.push([]);
    guessedCardHistory.push(guessedCard.id);

    //add all unique sections
    let nameSection = document.createElement('div');
    nameSection.className = 'guess-section';
    AddTextToGuessSection(nameSection, guessedCard.name);
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

    let categorySection = document.createElement('div');
    categorySection.className = 'guess-section';
    AddTextToGuessSection(categorySection, guessedCard.category);
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
    let copyValue = "🟨 TABLETURFLE 🟦\nGuessed in " + gameStateHistory.length;
    if (gameStateHistory.length == 1){
        copyValue += " try!\n";
    } else{
        copyValue += " tries!\n";
    }
    for (let i = 0; i < gameStateHistory.length; i++){
        copyValue += '\n'
        for (let j = 0; j < gameStateHistory[i].length; j++){
            switch (gameStateHistory[i][j]){
                case guessConditions.correct:
                    copyValue += "🟩"
                    break;
                case guessConditions.close:
                    copyValue += "🟨"
                    break;
                default:
                    copyValue += "🟥"
                    break;
            }
        }
    }
    copyValue += "\n\nPlay at: https://ljovynn.github.io/tableturfle/main.html"
    navigator.clipboard.writeText(copyValue);
    //confirm("Copied!");
}

closePopupButton.addEventListener('click', () => {
    winPopup.classList.remove('open-popup')
    infoPopup.classList.remove('open-popup')
});

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
    let guessText = "You won with " + gameStateHistory.length;
    document.getElementById('guessTotalText').innerText = "You won with " + gameStateHistory.length;
    if (gameStateHistory.length == 1){
        guessText += " guess! Nice!";
    } else{
        guessText += " guesses!";
    }
    document.getElementById('guessTotalText').innerText = guessText;

    const utcDateString = GetCurrentDate();
    document.getElementById('dateText').innerText = utcDateString;
}

// "YYYY-MM-DD"
function GetCurrentDate(){
    const now = new Date();
    const utcDateString = now.toISOString().split("T")[0];
    return utcDateString;
}

function FilterOptions(input, max = 5){
    const sanitizedInput = SanitizeString(input);
    let filteredChoices = [];
    if (sanitizedInput == ""){
        for (let i = 0; i < max; i++){
            filteredChoices.push(cards[i].name);
        }
        return filteredChoices;
    }

    for (let i = 0; i < cards.length; i++){
        if (cards[i].sanitizedName.includes(sanitizedInput)){
            filteredChoices.push(cards[i].name);
        }
    }
    filteredChoices = filteredChoices.slice(0, max);
    return filteredChoices;
}

function GetDailyNumber() {
    const utcDateString = GetCurrentDate();

    // FNV-1a hash (32-bit)
    let hash = 0x811c9dc5;
    for (let i = 0; i < utcDateString.length; i++) {
        hash ^= utcDateString.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0;
    }

    const number = (hash % uniqueCards) + 1;
    return number;
}

async function SetupCards(){
    let cardsJSON = await LoadJSON();
    /*let cardsJSON = [
        {
		"id": 193,
		"name": "Fred Crumbs",
		"size": 11,
		"spend": 4,
		"category": "NPC",
		"date": "2023-03-01"
	},
	{
		"id": 194,
		"name": "Spyke",
		"size": 13,
		"spend": 5,
		"category": "NPC",
		"date": "2023-03-01"
	},
	{
		"id": 195,
		"name": "The Eel Deal - Frye",
		"size": 14,
		"spend": 5,
		"category": "NPC",
		"date": "2023-03-01"
	},
	{
		"id": 196,
		"name": "The Cold-Blooded Bandit - Shiver",
		"size": 14,
		"spend": 5,
		"category": "NPC",
		"date": "2023-03-01"
	},
	{
		"id": 197,
		"name": "Manta Storm - Big Man",
		"size": 14,
		"spend": 5,
		"category": "NPC",
		"date": "2023-03-01"
	},
	{
		"id": 198,
		"name": "Z+F",
		"size": 11,
		"spend": 4,
		"category": "Brand",
		"date": "2023-03-01"
	}
    ]*/

    let i = GetDailyNumber() - 1;
    //let i = 1;
    dailyCard = {
        id: cardsJSON[i].id,
        name: cardsJSON[i].name,
        sanitizedName: SanitizeString(cardsJSON[i].name),
        size: cardsJSON[i].size,
        spend: cardsJSON[i].spend,
        category: cardsJSON[i].category,
        date: cardsJSON[i].date,
    }

    cardsJSON.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < cardsJSON.length; i++){
        cards.push({
            id: parseInt(cardsJSON[i].id),
            name: cardsJSON[i].name,
            sanitizedName: SanitizeString(cardsJSON[i].name),
            size: cardsJSON[i].size,
            spend: cardsJSON[i].spend,
            category: cardsJSON[i].category,
            date: cardsJSON[i].date,
        })
    }
    inputButton.disabled = false;
}

async function LoadJSON() {
    const response = await fetch("./cardData.json");
    const json = await response.json();
    return json;
}

function GetCardByName(inputName){
    let sanitizedInput = SanitizeString(inputName);
    for (let i = 0; i < cards.length; i++){
        if (cards[i].sanitizedName === sanitizedInput){
            return cards[i];
        }
    }
}

function GetCardById(id){
    for (let i = 0; i < cards.length; i++){
        if (cards[i].id === id){
            return cards[i];
        }
    }
}

//lowercase, remove special characters
function SanitizeString(string){
    let result;
    result = string.toLowerCase();
    result = result.replace(/\s|-|\'|\.|#/g, '');
    return result;
}