
/*
* 星系信息
*/
export default class SolarInfoData
{
    private _solarIndex:number;
    private _solarName:string;
    private _solarDesc:string;

/*     "1": {
        "id": "1",
        "name": "太阳系",
        "desc": "我们的家园，也是我开始流浪的第一站"
      }, */

    constructor(data:any)
    {
        this._solarIndex = parseInt(data.id)-1;
        this._solarName = data.name;
        this._solarDesc = data.desc;
    }

    public get solarIndex():number
    {
        return this._solarIndex;
    }

    public get solarName():string
    {
        return this._solarName;
    }

    public get solarDesc():string
    {
        return this._solarDesc;
    }
}