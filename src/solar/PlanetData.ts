import Constants from "../model/Constants";

export default class PlanetData
{
    constructor(){
    }

    private _population:number;
    private _buildingLevel:number;

    public parseData(numStr:string):void
    {
        this._population = parseInt(numStr);
        this.calcBuildingLevel();
    }
    
    private calcBuildingLevel():void
    {
        this._buildingLevel = Math.floor(this._population/10);
        this._buildingLevel = Math.min(this._buildingLevel, 4);
    }

    public addPeople(num:number):void
    {
        this._population += num;
        this.calcBuildingLevel();
    }

    public toStr():string
    {
        return this._population+"";
    }

    public get population():number
    {
        return this._population;
    }

    public get buildingLevel():number
    {
        return this._buildingLevel;
    }
}