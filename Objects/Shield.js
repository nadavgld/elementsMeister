class Shield{
    constructor(name, points, element){
        this.name = name;
        this.points = points;
        this.element = element;
        this.blockRate = 0.2;
    }

    hasAvoid(){
        return Math.random() <= this.blockRate;
    }
}

export default Shield;