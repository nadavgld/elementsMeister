import { PotionType } from './Enum.js'

export class Card {
    constructor(name, image, type) {
        this.name = name;
        this.image = image;
        this.type = type;
    }
}

export class EnemyCard extends Card {
    constructor(name, image, enemy, type) {
        super(name, image, type);
        this.enemy = enemy;
    }
}

export class ElementCard extends Card {
    constructor(name, image, element, type) {
        super(name, image, type)
        this.element = element;
    }
}

export class WeaponCard extends Card {
    constructor(name, image, weapon, type) {
        super(name, image, type);
        this.weapon = weapon;
    }
}

export class ShieldCard extends Card {
    constructor(name, image, shield, type) {
        super(name, image, type);
        this.shield = shield;
    }
}

export class PotionCard extends Card {
    constructor(name, image, elementsArray, type) {
        super(name, image, type);
        this.elements = elementsArray;

        this.background = this.generateColor();
        this.text = this.generateCardText();
    }

    generateColor() {
        var color = `linear-gradient(`;
        for (var i = 0; i < this.elements.length; i++) {
            color += this.elements[i].element.color + ','
        }

        color = color.substr(0, color.length - 1)
        return color + ', #33333340)'
    }

    generateCardText() {
        var txt = '';
        for (var i = 0; i < this.elements.length; i++) {
            txt += PotionType[this.elements[i].element.type] + ' | '
        }

        return txt.substr(0, txt.length - 2);
    }
}