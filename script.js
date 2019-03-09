import GameManager from './Objects/GameManager.js';
import { ItemType, PotionType } from './Objects/Enum.js';

import Enemy from './Objects/Enemy.js';
import Weapon from './Objects/Weapon.js';
import Shield from './Objects/Shield.js';
import { Card, ElementCard, ShieldCard, WeaponCard, EnemyCard, PotionCard } from './Objects/Card.js';

const WITHTIMER = false;
var draggedCard;
var potionCounter = 0;

// UI
const UI_Inventory = document.getElementById('inventory');
const UI_Interface_Inventory = document.getElementById('iinventory');
const UI_Level_Span = document.getElementById('level');
const UI_Turn_Span = document.getElementById('turn');
const UI_Time_Span = document.getElementById('time');
const UI_Name_Span = document.getElementById('name');
const UI_Exp_Span = document.getElementById('exp');
const UI_HP_Span = document.getElementById('hp');
const UI_HPINNER_Span = document.getElementById('hp-inner-bar');
const UI_Inventory_Slots = document.getElementsByClassName('inventory-slot');
const UI_Brew_Button = document.getElementById('brewBtn');
const UI_EndTurn_Button = document.getElementById('endTurnBtn');
const UI_Potions_Holders = document.getElementsByClassName('potion-holder');
const UI_Brewed_Potion = document.getElementById('brewed-potion');
const UI_Shield = document.getElementById('ishield')
const UI_Weapon = document.getElementById('iattack')

var timeInterval;

UI_Brew_Button.setAttribute('disabled', true);
UI_EndTurn_Button.addEventListener('click', nextTurn);
UI_Interface_Inventory.addEventListener('click', toggleInvetory)
UI_Brew_Button.addEventListener('click', brewPotion)

UI_Shield.addEventListener('dragover', onDragOver)
UI_Weapon.addEventListener('dragover', onDragOver)
for (var i = 0; i < UI_Inventory_Slots.length; i++) {
    UI_Inventory_Slots[i].addEventListener('dragover', onDragOver)
}

for (var i = 0; i < UI_Potions_Holders.length; i++) {
    UI_Potions_Holders[i].addEventListener('dragover', onDragOver)
}

// Logic
var GM = new GameManager();
window.GM = GM;
startGame()

function toggleInvetory() {
    GM.toggleInventory();

    if (GM.showInventory) {
        UI_Inventory.style.opacity = '1';
    } else {
        UI_Inventory.style.opacity = '0';
    }
}

function onDragOver(e) {
    e.preventDefault()
}

function updateUI() {
    UI_Name_Span.innerHTML = GM.player.name;
    UI_Exp_Span.innerHTML = GM.player.exp;
    UI_Level_Span.innerHTML = GM.player.lvl;
    UI_Turn_Span.innerHTML = GM.turn;
    updateHP();
}

function updateHP() {
    UI_HP_Span.innerHTML = GM.player.hp + '/' + GM.player.maxHP;
    UI_HPINNER_Span.style.width = calculateHP(GM.player);
}

function clearPotionDeck() {
    var cardsHolders = document.getElementsByClassName('potion-holder');

    for (var i = 0; i < cardsHolders.length; i++) {
        var cardHolder = cardsHolders[i];

        if (cardHolder.id == 'brewed-potion') continue;

        cardHolder.innerHTML = '';
    }
    UI_Brew_Button.setAttribute('disabled', true);

}

function updateCards(cards) {
    var cardsHolders = document.getElementsByClassName('card-container');

    for (var i = 0; i < cards.length; i++) {
        const currentCard = cards[i];
        var cardHolder = cardsHolders[i];
        cardHolder.innerHTML = '';

        var _newDiv = document.createElement("div");

        _newDiv.className = 'action-card';
        _newDiv.id = 'ac' + i;
        _newDiv.setAttribute('draggable', true)
        _newDiv.appendChild(createActionCardByType(currentCard));

        _newDiv.ondragstart = onDragCardStart;
        _newDiv.ondragend = onDragCardEnd;

        cardHolder.appendChild(_newDiv)
    }
}

function updateEnemies(enemies) {
    for (var i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        var UI_enemy = document.getElementById('ec' + i)
        UI_enemy.innerHTML = '';

        if (enemies[i] == undefined) {
            UI_enemy.style.opacity = .3;
            continue;
        }

        var _newDiv = document.createElement("div");

        _newDiv.className = 'action-card';
        _newDiv.id = 'ae' + i;
        _newDiv.setAttribute('draggable', true)
        _newDiv.appendChild(createActionCardByType(enemy));

        _newDiv.ondragstart = onDragCardStart;
        _newDiv.ondragend = onDragCardEnd;
        _newDiv.onDragOver = onDragOver;

        UI_enemy.appendChild(_newDiv)
        UI_enemy.style.opacity = 1;
    }
}

function onDragCardStart(e) {
    e.target.className += ' dragged-card'
    draggedCard = e.target;

    setTimeout(() => {
        e.target.style.opacity = .05;
    }, 1);
}

function onDragCardEnd(e) {
    e.target.className = 'action-card'
    draggedCard = null;

    setTimeout(() => {
        try {
            e.target.style.opacity = 1;
        } catch (e) { }
    }, 1);
}

function createActionCardByType(card) {
    const type = card.type;
    var _newElement = document.createElement("div");

    switch (type) {
        case ItemType.ELEMENT:
            _newElement.className = 'element-card'
            _newElement.style.background = `linear-gradient(${card.element.color}, #33333340)`;

            _newElement.innerHTML = createUIElementCard(card);
            break;

        case ItemType.EQUIPMENT:
            var _c = {
                color: '#c0c0c0',
                element: typeOfObject(card) === 'ShieldCard' ? card.shield.element : card.weapon.element
            };
            _newElement.className = typeOfObject(card) === 'ShieldCard' ? 'shield-card' : 'weapon-card'
            _newElement.style.background = `linear-gradient(${_c.element.color}, ${_c.color})`;


            _newElement.innerHTML = createUIEquipmentCard(typeOfObject(card), card);
            break;

        case ItemType.POTION:
            _newElement.className = 'potion-card'
            _newElement.style.background = card.background;

            _newElement.innerHTML = createUIPotionCard(card);
            break;

        case ItemType.ENEMY:
            _newElement.className = 'enemy-card'
            _newElement.style.background = `linear-gradient(#000, ${card.enemy.element.color})`;

            _newElement.innerHTML = createUIEnemyCard(card);
            break;
    }

    return _newElement;
}

function createUIEnemyCard(card) {
    return `
        <div class="inner-card-header"> ${firstLetterUpper(card.name)} [${card.enemy.exp}xp] </div>
        <div class="inner-card-symbol"> ${card.enemy.points} </div>        
    `;
}

function createUIPotionCard(card) {
    var symbol = '';
    for (var i = 0; i < card.elements.length; i++)
        symbol += card.elements[i].element.symbol

    return `
        <div class="inner-card-header"> ${card.text.toLowerCase()} Potion </div>
        <div class="inner-card-symbol"> ${symbol} </div>        
    `;
}

function createUIElementCard(card) {
    return `
        <div class="inner-card-header"> ${firstLetterUpper(card.element.type)} Element </div>
        <div class="inner-card-symbol"> ${card.element.symbol} </div>        
    `;
}

function createUIEquipmentCard(type, card) {
    //${firstLetterUpper(card.name)}

    const item = type === 'WeaponCard' ? card.weapon : card.shield;
    const weaponTurns = type === 'WeaponCard' ? `<br>${item.turns} Turns` : '';
    return `
        <div class="inner-card-header"> [ ${type.substring(0, 6)} ] ${weaponTurns} </div>
        <div class="inner-card-symbol"> ${item.points} </div>        
    `;
}

function calculateHP(player) {
    return parseInt(player.hp * 100 / player.maxHP) + '%';
}

function startGame() {
    GM.startGame()

    updateCards(GM.cards)
    updateEnemies(GM.enemies)
    clearPotionDeck()
    updateUI()
}

function nextTurn() {
    if (GM.enemies.filter(e => e != undefined).length == 9) {
        alert('You LOST!');

        setTimeout(() => {
            startGame();
        }, 1000);

        return;
    }
    GM.nextTurn()

    updateCards(GM.cards)
    updateEnemies(GM.enemies)
    clearPotionDeck()
    updateUI()

    UI_Brew_Button.setAttribute('disabled', true);
}

function typeOfObject(obj) {
    return obj.constructor.name
}

function firstLetterUpper(str) {
    str = str.toLowerCase();

    return str[0].toUpperCase() + str.substring(1);
}

timeInterval = setInterval(() => {
    if (!WITHTIMER) return;

    GM.updateTime();
    UI_Time_Span.innerHTML = GM.time;
}, 1000);

document.addEventListener("drop", function (event) {
    event.preventDefault();

    // Wield Shield
    if (event.target.id.indexOf('ishield') >= 0 || isAShieldHolder(event)) {
        handleWieldShield(event);

        return;
    }

    // Wield Weapon
    if (event.target.id.indexOf('iattack') >= 0 || isAWeaponHolder(event)) {
        handleWieldWeapon(event);

        return;
    }

    // Attack
    if (draggedCard.id.indexOf('ae') >= 0) {
        handleEnemyDrag(event);

        updateEnemies(GM.enemies)
        updateUI()
        return;
    }

    // Potions Effects
    if (event.target.id == 'brewed-potion') {
        draggedCard = null;
        return;
    }

    // Insert To Inventory
    if (event.target.className.indexOf("inventory-slot") >= 0 && draggedCard !== null) {
        moveCardLocation(event);
    }
    // Insert To Brew Section
    else if (event.target.className.indexOf('potion-holder') >= 0 && draggedCard !== null) {
        moveCardToPotionDeck(event);
    }

    draggedCard = null;
    return;
});

function hasAWeapon(event) {
    return (event.target.className.indexOf('weapon-card') >= 0 ||
        event.target.parentElement.className.indexOf('weapon-card') >= 0);
}

function isAWeaponHolder(event) {
    return hasAWeapon(event) && draggedCard.parentElement.className.indexOf('inventory-slot') >= 0
}

function hasAShield(event) {
    return (event.target.className.indexOf('shield-card') >= 0 ||
        event.target.parentElement.className.indexOf('shield-card') >= 0);
}

function isAShieldHolder(event) {
    return hasAShield(event) && draggedCard.parentElement.className.indexOf('inventory-slot') >= 0
}

function handleWieldWeapon(event) {
    var parent = draggedCard.parentElement
    const cardIndex = parseInt(parent.id.substr(2))
    var card;
    try {
        card = (GM.inventory.itemList[cardIndex]);
    } catch (e) { return; }

    var type;
    try {
        type = typeOfObject(card);
    } catch (e) { return; }

    if (type != "WeaponCard") return;

    GM.player.wieldWeapon(card.weapon);
    parent.removeChild(draggedCard)

    var _t = event.target;
    while (_t.id != 'iattack')
        _t = _t.parentElement

    draggedCard.setAttribute('draggable', false)
    _t.innerHTML = '';
    _t.appendChild(draggedCard)
    draggedCard.id = 'weapon';

    GM.inventory.removeItem(card);
}

function handleWieldShield(event) {
    var parent = draggedCard.parentElement
    const cardIndex = parseInt(parent.id.substr(2))
    var card;
    try {
        card = (GM.inventory.itemList[cardIndex]);
    } catch (e) { return; }

    var type;
    try {
        type = typeOfObject(card);
    } catch (e) { return; }

    if (type != "ShieldCard") return;

    GM.player.wieldShield(card.shield);
    parent.removeChild(draggedCard)

    var _t = event.target;
    while (_t.id != 'ishield')
        _t = _t.parentElement

    draggedCard.setAttribute('draggable', false)
    _t.innerHTML = '';
    _t.appendChild(draggedCard)
    draggedCard.id = 'shield';
    draggedCard.setAttribute('draggable', false)

    GM.inventory.removeItem(card);
}

function handleEnemyDrag(event) {
    //Attack player/shield
    const cardIndex = parseInt(draggedCard.id.substr(2))
    var enemy;

    try {
        enemy = (GM.enemies[cardIndex]);
    } catch (e) { return; }

    if (hasAWeapon(event) && !GM.hasAttackedThisTurn) {
        attack(enemy)
        GM.hasAttackedThisTurn = true;
    } else if (hasAShield(event) && !GM.hasBlockedThisTurn) {
        defend(enemy)
        GM.hasBlockedThisTurn = true;
    }

    if (enemy.enemy.points <= 0) {
        GM.enemies[cardIndex] = undefined;
        checkIfLvlUP()
    }
}

function checkIfLvlUP() {
    var lvl = GM.player.lvl;
    const currentEXP = GM.player.exp;

    while (GM.expProgress[lvl] <= currentEXP) {
        GM.player.levelUp();

        lvl = GM.player.lvl;
    }
}

function attack(enemy) {
    GM.player.attackEnemy(enemy.enemy);

    if (GM.player.weapon == null) {
        document.getElementById('weapon').parentNode.innerHTML = ''
    } else {
        updateWeaponCard()
    }
}

function updateWeaponCard() {
    var weaponParent = document.getElementById('weapon').parentNode;
    const playerWeapon = GM.player.weapon;
    const weaponCard = new WeaponCard(GM.randomName(), 'aaa', playerWeapon, ItemType.EQUIPMENT)

    var _newDiv = document.createElement("div");

    _newDiv.className = 'action-card';
    _newDiv.id = 'weapon';
    _newDiv.appendChild(createActionCardByType(weaponCard));

    _newDiv.ondragstart = onDragCardStart;
    _newDiv.ondragend = onDragCardEnd;

    weaponParent.innerHTML = '';
    weaponParent.appendChild(_newDiv)
}

function defend(enemy) {
    GM.player.getHit(enemy.enemy)

    if (GM.player.shield == null) {
        document.getElementById('shield').parentNode.innerHTML = ''
    } else {
        updateShieldCard()
    }
}

function updateShieldCard() {
    var shieldParent = document.getElementById('shield').parentNode;
    const playerShield = GM.player.shield;
    const shieldCard = new ShieldCard(GM.randomName(), 'aaa', playerShield, ItemType.EQUIPMENT)

    var _newDiv = document.createElement("div");

    _newDiv.className = 'action-card';
    _newDiv.id = 'shield';
    _newDiv.appendChild(createActionCardByType(shieldCard));

    _newDiv.ondragstart = onDragCardStart;
    _newDiv.ondragend = onDragCardEnd;

    shieldParent.innerHTML = '';
    shieldParent.appendChild(_newDiv)
}

function moveCardToPotionDeck(event) {
    var parent = draggedCard.parentElement
    var destinationIdx = parseInt(event.target.id.substr(2))

    // Inventory -> Potions
    if (parent.className.indexOf('inventory-slot') >= 0) {
        const cardIndex = parseInt(parent.id.substr(2))
        var card;
        try {
            card = (GM.inventory.itemList[cardIndex]);
        } catch (e) { return; }

        if (card.type === ItemType.ELEMENT) {

            if (GM.inventory.addElement(card, destinationIdx)) {
                parent.removeChild(draggedCard)
                event.target.appendChild(draggedCard)

                GM.inventory.removeItem(card);

                if (GM.inventory.elementsList.filter(e => e != undefined).length > 0) {
                    UI_Brew_Button.setAttribute('disabled', false);
                } else {
                    UI_Brew_Button.setAttribute('disabled', true);
                }
            }
        }
    }
}

function moveCardLocation(event) {
    var parent = draggedCard.parentElement
    var destinationIdx = parseInt(event.target.id.substr(2))

    //Deck -> Inventory
    if (parent.className.indexOf('card-container') >= 0 && event.target.className.indexOf('inventory-slot') >= 0) {
        if (!removeCardFromDeckToInventory(draggedCard, destinationIdx)) {
            alert('cannot mount this card to inventory')
            return;
        }
    }

    //PotionDeck -> Inventory
    if (parent.className.indexOf('potion-holder') >= 0 && event.target.className.indexOf('inventory-slot') >= 0) {
        if (parent.id == 'brewed-potion') {
            if (!moveBrewedPotionToInventory(destinationIdx)) {
                alert('cannot mount this card to inventory')
                return;
            }
        }
        else if (!removeCardFromPotionDeckToInventory(draggedCard, destinationIdx)) {
            alert('cannot mount this card to inventory')
            return;
        }

        if (GM.inventory.elementsList.filter(e => e != undefined).length > 0) {
            UI_Brew_Button.setAttribute('disabled', false);
        } else {
            UI_Brew_Button.setAttribute('disabled', true);
        }
    }

    // Inventory -> Inventory
    else if (parent.className.indexOf('inventory-slot') >= 0 && event.target.className.indexOf('inventory-slot') >= 0) {
        const currentIdx = parseInt(draggedCard.parentElement.id.substr(2))
        GM.inventory.relocateItemInInventory(currentIdx, destinationIdx)
    }

    parent.removeChild(draggedCard)
    event.target.appendChild(draggedCard)
}

function moveBrewedPotionToInventory(inventorySlotIdx) {
    const card = (GM.inventory.brewedPotion);
    GM.inventory.addPotion(card, inventorySlotIdx)

    var hasInserted = GM.inventory.addItem(card, inventorySlotIdx)

    if (!hasInserted) return false;

    GM.inventory.removePotion()
    return true;
}

function removeCardFromPotionDeckToInventory(UIcard, inventorySlotIdx) {
    const cardIndex = parseInt(UIcard.parentElement.id.substr(2))
    const card = (GM.inventory.elementsList[cardIndex]);

    var hasInserted = GM.inventory.addItem(card, inventorySlotIdx)

    if (!hasInserted) return false;

    GM.inventory.removeElementByIdx(cardIndex)
    return true;
}

function removeCardFromDeckToInventory(UIcard, inventorySlotIdx) {
    const cardIndex = parseInt(UIcard.id.substr(2))
    const card = (GM.cards[cardIndex]);

    var hasInserted = GM.inventory.addItem(card, inventorySlotIdx)

    if (!hasInserted) return false;

    GM.cards[cardIndex] = null;
    return true;
}

function brewPotion() {
    var elements = [...GM.inventory.elementsList].filter(e => e != undefined);

    if (elements.length == 0) return;

    var potion = new PotionCard(GM.randomName(), 'aaa', elements, ItemType.POTION);

    elements.forEach(elem => {
        GM.inventory.removeElement(elem);
    })

    GM.inventory.addPotion(potion);

    UI_Brewed_Potion.innerHTML = '';

    var _newDiv = document.createElement("div");

    _newDiv.className = 'action-card';
    _newDiv.id = 'pt' + (potionCounter++);
    _newDiv.setAttribute('draggable', true)
    _newDiv.appendChild(createActionCardByType(potion));

    _newDiv.ondragstart = onDragCardStart;
    _newDiv.ondragend = onDragCardEnd;

    UI_Brewed_Potion.appendChild(_newDiv)
    clearPotionDeck();
}