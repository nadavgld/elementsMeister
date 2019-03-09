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
            'fire': 1,
            'water': 1,
            'grass': 1,
            'normal': 0
        }

        this.weapon = null;
        this.shield = null;

        console.log('Initiated ' + name + ', lvl ' + this.lvl + ' with ' + this.exp + ' exp');
    }

    levelUp() {
        this.lvl++;

        Object.keys(this.elementDmg).forEach(element => {
            const current = this.elementDmg[element];
            const rnd = Math.random() + 1.1;

            const upgraded = Math.round(current * rnd);
            console.log(`${element} dmg: ${current} -> ${upgraded}`);

            this.elementDmg[element] = upgraded;
        })

        this.hpRegenerate += 0.01;
        this.maxHP = Math.ceil(this.maxHP * (Math.random() + 1));

        this.hp = this.maxHP;
    }

    regenerateHP() {
        this.hp = Math.ceil(this.hp * (1 + this.hpRegenerate));

        if (this.hp > this.maxHP) this.hp = this.maxHP;
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
                DMG = parseInt(enemy.points * enemy.element.enchant(this.shield.element));
            } else {
                DMG = enemy.points;
            }
        }

        if (this.shield) {
            const shieldPrev = this.shield.points;

            if (this.shield.hasAvoid()) {
                console.log('blocked the hit!');
                DMG -= this.shield.points;
            } else {
                this.shield.points = this.shield.points - DMG > 0 ? this.shield.points - DMG : 0;

                console.log('shield was hit by ' + (this.shield.points - DMG));
                DMG -= shieldPrev;
            }

            if (enemy.points - shieldPrev > 0 && DMG > 0) {
                console.log('got hit by ' + (enemy.points - shieldPrev));

                this.hp -= (enemy.points - shieldPrev);
                enemy.points -= shieldPrev;
            }
            else {
                this.exp += enemy.exp;
                enemy.dead();
            }

            if (this.shield.points <= 0) {
                this.removeShield();
            }
        } else {
            console.log('got hit by ' + DMG);
            this.hp -= DMG;
        }
    }

    elementalDmg() {
        return this.elementDmg[this.weapon.element.type];
    }

    attackEnemy(enemy) {
        if (!this.weapon)
            return;

        var DMG = this.weapon.element ? ((this.weapon.points + this.elementalDmg()) * this.weapon.element.enchant(enemy.element)) : this.weapon.points;
        DMG = parseInt(DMG);

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