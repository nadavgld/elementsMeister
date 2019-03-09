class Enemy{
    constructor(points, exp, element){
        this.points = points;
        this.exp = exp;
        this.element = element;
    }

    dead(){
        this.points = 0;
        console.log('enemy died');
    }

    isDead(){
        return this.points <= 0;
    }
}

export default Enemy;