class Weapon{
    constructor(name, points, element, turns){
        this.name = name;
        this.points = points;
        this.element = element;
        this.turns = turns;
        this.criticalHitRate = 0.15;
    }
}

export default Weapon;