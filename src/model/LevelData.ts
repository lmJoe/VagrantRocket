/*
* 游戏关卡配置;
*/
export default class LevelData
{
    private static readonly BaseDistance:number = 4000;//1250

    private _level:number;
    private _distance:number;
    private _originPlanetId:number;
    private _planetList:Array<number>;

    // "1": {
    //     "id": 1,
    //     "level": "1",
    //     "distance": 6,
    //     "originPlanetId": 43,
    //     "planetList": [
    //       68,
    //       39,
    //       89,
    //       11,
    //       103,
    //       4,
    //       32,
    //       54,
    //       61,
    //       25
    //     ]
    //   },

    constructor(data:any)
    {
        this._level = data.level;
        this._distance = data.distance;
        this._originPlanetId = data.originPlanetId;
        this._planetList = data.planetList;
    }

    public get level():number
    {
        return this._level;
    }

    public get distance():number
    {
        return Math.floor(this._distance * LevelData.BaseDistance);
    }

    public get originPlanetId():number
    {
        return this._originPlanetId;
    }

    public get planetList():Array<number>
    {
        return this._planetList;
    }

}