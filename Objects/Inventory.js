import { ItemType } from './Enum.js';

class Inventory {
    constructor() {
        this.size = 20;
        this.potionAmount = 3;
        this.itemList = new Array(this.size);
        this.elementsList = new Array(this.potionAmount);
        this.brewedPotion;

        this.isFull = this.isFull();

        this.LIMITATIONS = {
            'potion': 3,
            'equipment': 2,
            'element': 7
        }
    }

    addPotion(potion) {
        this.brewedPotion = (potion);

        return true;
    }

    removePotion() {
        this.brewedPotion = null;

        return true;
    }

    isFull() {
        for (var i = 0; i < this.size; i++) {
            if (this.itemList[i] === undefined)
                return false;
        }

        return true;
    }

    addElement(item, idx) {
        if (item.type !== ItemType.ELEMENT) return false;

        if (this.elementsList[idx] == undefined) {
            this.elementsList[idx] = item;
            return true;
        }

        return false;
    }

    addItem(item, idx) {
        if (item == undefined || idx < 0) return false;

        if (this.canInsertType(item.type)) {
            this.itemList[idx] = item;

            return true;
        }

        return false;
    }

    removeElementByIdx(idx) {
        const item = this.elementsList[idx];

        if (item == undefined || idx < 0)
            return undefined;

        this.elementsList[idx] = undefined;

        return item;
    }

    removeElement(item) {
        for (var i = 0; i < this.elementsList.length; i++) {
            if (this.elementsList[i] && this.elementsList[i].name === item.name && this.elementsList[i].type === item.type) {
                this.elementsList[i] = undefined;

                return true;
            }
        }

        return false;
    }

    removeItemByIdx(idx) {
        const item = this.itemList[idx];

        if (item == undefined || idx < 0)
            return undefined;

        this.itemList[idx] = undefined;

        return item;
    }

    removeItem(item) {
        for (var i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i] && this.itemList[i].name === item.name && this.itemList[i].type === item.type) {
                this.itemList[i] = undefined;

                return true;
            }
        }

        return false;
    }

    relocateItemInInventory(prevIdx, nextIdx) {
        const tmp = this.itemList[prevIdx];
        this.itemList[nextIdx] = tmp;
        this.itemList[prevIdx] = undefined;
    }

    canInsertType(type) {
        const LIMIT = this.LIMITATIONS[type];
        var CURRENTAmount;

        try {
            var _filtered = this.itemList.filter(i => {
                if (i === undefined || i.type === undefined) return false;
                return i.type == type;
            });

            if (_filtered === undefined) return true;
            else if (_filtered !== undefined && _filtered.length === undefined) CURRENTAmount = 1;
            else CURRENTAmount = _filtered.length;
        } catch (e) {
            return true;
        }

        if (LIMIT >= CURRENTAmount + 1)
            return true;

        return false;
    }
}

export default Inventory;