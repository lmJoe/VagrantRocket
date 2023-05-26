import { BoosterType } from "./GameModel";

/*
* 推进器属性;
*/
export default class ShipPodData
{
    private _boosterId:number;
    private _boosterPath:string;
    private _startPosZ:number;
    private _height:number;
    private _scaleNum:number;
    private _boosterType:BoosterType;

    // "101": {
    //     "id": 63,
    //     "boosterId": "101",
    //     "path": "head_201",
    //     "startPosZ": -0.2,
    //     "high": 1.58285,
    //     "scaleNum": 2.6,
    //     "type": 0
    //   },

    constructor(data:any)
    {
        this._boosterId = parseInt(data.boosterId+"");
        this._boosterPath = data.path;
        this._startPosZ = data.startPosZ;
        this._height = data.high;
        this._scaleNum = data.scaleNum;
        this._boosterType = data.type;
    }

    public get boosterId():number
    {
        return this._boosterId;
    }

    public get startPosZ():number
    {
        return this._startPosZ*this._scaleNum;
    }

    public get height():number
    {
        return this._height*this._scaleNum;
    }

    public get scaleNum():number
    {
        return this._scaleNum;
    }

    // public get boosterPath():string
    // {
    //     return this._boosterPath;
    // }

    public get boosterType():BoosterType
    {
        return this._boosterType;
    }

    public getBoosterPath(colorId:number):string
    {
        switch(this._boosterType)
        {
            case BoosterType.Single:
                return this._boosterPath;
            case BoosterType.Multi:
                return this._boosterPath+"_"+colorId;
        }
    }
}