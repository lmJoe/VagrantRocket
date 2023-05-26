
/*
* 火箭等级属性;
*/
export default class RocketLvData
{
    private _level:number;
    private _headId:number;
    private _podList:Array<number>;
    
    private _power:number;
    private _clipNum:number;

    // "1": {
    //     "id": 1,
    //     "level": "1",
    //     "head": 101,
    //     "podList": [
    //       1001,
    //       1005,
    //       1007,
    //       1002
    //     ],
    //     "distance": 1,
    //     "power": 1
    //   },

    constructor(data:any)
    {
        this._level = data.level;
        this._headId = data.head;
        this._podList = data.podList;

        this._power = data.power;
        this._clipNum = data.clipNum;
    }

    public get level():number
    {
        return this._level;
    }

    public get headId():number
    {
        return this._headId;
    }

    public get podList():Array<number>
    {
        return this._podList;
    }

    public get power():number
    {
        return this._power;
    }

    public get clipNum():number
    {
        return this._clipNum;
    }

    //总节数 = 头 + 推进节数
    public get totalPodNum():number
    {
        return this._podList.length + 1;
    }
}