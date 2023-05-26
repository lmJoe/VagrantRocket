/*
* 到访星系顺序;
*/
export default class ExplorerData
{
    private _id:number;
    private _rankMin:number;
    private _rankMax:number;


    // "1": {
    //     "id": "1",
    //     "rankMin": 150000,
    //     "rankMax": 200000
    //   },

    constructor(data:any)
    {
        this._id = data.id;
        this._rankMin = data.rankMin;
        this._rankMax = data.rankMax;
    }

    public get id():number
    {
        return this._id;
    }

    public get sequence():number
    {
        return Math.ceil((this._rankMax-this._rankMin)*Math.random()) + this._rankMin;
    }

}