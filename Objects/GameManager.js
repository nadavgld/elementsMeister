import Element from './Element.js';
import Player from './Player.js';
import { ItemType } from './Enum.js';
import Enemy from './Enemy.js';
import { ElementCard, ShieldCard, WeaponCard, EnemyCard } from './Card.js';
import Weapon from './Weapon.js';
import Shield from './Shield.js';
import Inventory from './Inventory.js';

class GameManager {
    constructor() {
        this.turn = 0;
        this.time = 60;
        this.isGameOver = false;
        this.showInventory = true;
        this.inventory = new Inventory();
        this.enemies = new Array(9)

        this.elements = [
            new Element('⚙', '#fefefe', 'normal'),
            new Element('🔥', '#ee4628', 'fire'),
            new Element('💦', '#289fee', 'water'),
            new Element('🌴', '#1bb607', 'grass')
        ]

        this.cardsList = this.generateCards(60);
        this.cards = [];
    }

    addEnemy() {
        if (this.enemies.filter(e => e != undefined).length == 9) return;

        var rnd = this.randomFloored(9);

        while (this.enemies[rnd] != undefined)
            rnd = this.randomFloored(9);

        const rndPoints = this.randomFloored(15) + 1;
        const rndExp = Math.round(rndPoints * (Math.random() + 0.1).toFixed(1));

        const enemy = new Enemy(rndPoints, rndExp, this.randomElement(true))

        this.enemies[rnd] = new EnemyCard(this.randomName(), 'aaa', enemy, ItemType.ENEMY);
    }

    dealCards(amount) {
        var _cards = [];

        for (var i = 0; i < amount; i++) {
            if (this.cardsList.length > 0) {
                var card = this.cardsList.pop()
                _cards.push(card);
            } else {
                this.cardsList = this.generateCards(61);
                var card = this.cardsList.pop();
                _cards.push(card);
            }
        }

        return _cards;
    }

    generateCards(amount) {
        var cardList = [];
        for (var i = 0; i < amount; i++) {
            const rnd = Math.random();
            var newCard;
            if (rnd < 0.75) {
                newCard = new ElementCard(this.randomName(), 'aaa', this.randomElement(false), ItemType.ELEMENT)
            } else if (rnd < 0.9) {
                newCard = new WeaponCard(this.randomName(), 'aaa', new Weapon(this.randomName(), this.randomFloored(10) + 1, this.randomElement(true), this.randomFloored(3) + 1), ItemType.EQUIPMENT)
            } else {
                newCard = new ShieldCard(this.randomName(), 'aaa', new Shield(this.randomName(), this.randomFloored(30) + 1, this.randomElement(true)), ItemType.EQUIPMENT)
            }

            cardList.push(newCard)
        }

        return cardList;
    }

    randomFloored(n) {
        return Math.floor(Math.random() * n);
    }

    randomElement(normalIncluded) {
        var elementDeck = [...this.elements];

        if (!normalIncluded) elementDeck.shift()

        const rnd = this.randomFloored(elementDeck.length);

        return elementDeck[rnd];
    }

    randomName() {
        var number = Math.random();
        number.toString(36);

        return number.toString(36).substr(2, 9);
    }

    updateTime() {
        this.time--;
    }

    toggleInventory() {
        this.showInventory = !this.showInventory;
    }

    startGame() {
        this.player = new Player('John');
        this.enemies = new Array(9);
        this.turn = 0;

        this.nextTurn();
    }

    nextTurn() {
        this.turn++;
        this.time = 60;
        this.isGameOver = false;
        this.inventory.elementsList = new Array(this.inventory.potionAmount);
        this.addEnemy()

        // const currentAmountOfCards = this.cards.filter(c => c != null).length;
        const newCards = this.dealCards(3);

        this.cards = [...newCards].filter(c => c != null);
    }

    gameOver() {
        this.isGameOver = true;
        alert('GAME OVER!')
    }
}

export default GameManager;