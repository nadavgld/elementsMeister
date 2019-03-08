import { ElementCycle } from './Enum.js'

class Element {
    constructor(symbol, color, type) {
        this.symbol = symbol;
        this.color = color;
        this.type = type;
    }

    enchant(element) {
        const COMPARED = this.compareTo(element);

        if (COMPARED === 0)
            return 1;
        if (COMPARED === 1)
            return 2;

        return 0.5;
    }

    compareTo(element) {
        if (!element) return 0;

        if (this.isEven(element))
            return 0;
        if (this.isStronger(element))
            return 1;

        return -1;
    }

    isStronger(element) {
        var playerIndex = ElementCycle.indexOf(this.type);
        var enemyIndex = ElementCycle.indexOf(element.type);

        if (playerIndex > enemyIndex)
            return true;

        if (playerIndex === 0 && enemyIndex === ElementCycle.length - 1)
            return true;

        return false;
    }

    isEven(element) {
        return element.type === this.type;
    }
}

export default Element;