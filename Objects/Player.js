import Element from './Element.js';

class Player {
    constructor(name) {
        this.name = name;
        this.lvl = 1;
        this.exp = 0;
        this.hp = 50;
        this.maxHP = 50;
        this.coins = 500;
        this.hpRegenerate = 0.05;
        this.elementDmg = {
            'fire': 10,
            'water': 8,
            'grass': 5
        }

        this.weapon = null;
        this.shield = null;

        console.log('Initiated ' + name + ', lvl ' + this.lvl + ' with ' + this.exp + ' exp');
    }

    wieldWeapon(weapon) {
        this.weapon = weapon;
    }

    wieldShield(shield) {
        this.shield = shield;
    }

    getHit(enemy) {
        var DMG;
        if (enemy.element) {
            if (this.shield && this.shield.element) {
                DMG = enemy.points * enemy.element.enchant(this.shield.element);
            } else {
                DMG = enemy.points;
            }
        }

        if (this.shield) {
            if (this.shield.hasAvoid()) {
                console.log('blocked the hit!');
                DMG -= this.shield.points;
            } else {
                const shieldPrev = this.shield.points;
                this.shield.points = this.shield.points - DMG > 0 ? this.shield.points - DMG : 0;

                console.log('shield hit by ' + (this.shield.points - DMG));
                DMG -= shieldPrev;
            }

            if (DMG > 0) {
                console.log('got hit by ' + DMG);
                this.hp -= DMG;
            }
            else {
                this.exp += enemy.exp;
                enemy.dead();
            }
        } else {
            console.log('got hit by ' + DMG);
            this.hp -= DMG;
        }
    }

    attackEnemy(enemy) {
        if (!this.weapon)
            return;

        const DMG = this.weapon.element ? this.weapon.points * this.weapon.element.enchant(enemy.element) : this.weapon.points;
        console.log("Dealt " + DMG + " points");

        if (DMG >= enemy.points) {
            this.exp += enemy.exp;
            enemy.dead();
        } else {
            enemy.points -= DMG;
        }

        this.weapon.turns--;
        if (this.weapon.turns <= 0)
            this.removeWeapon();

    }

    removeWeapon() {
        this.weapon = null;
    }

    removeShield() {
        this.shield = null;
    }
}

export default Player;