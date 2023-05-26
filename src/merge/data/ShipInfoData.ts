
/*
* 火箭信息 id起始为1
*/
export default class ShipInfoData
{
    private _id:number;
    private _name:string;
    private _displayName:string;
    private _level:number;
    private _icon:number;

    private _output_gold:number;
    private _gold_interval:number;
    private _output_gold_second:number;
    private _bonusShip_level:number;
    private _unlock_buy_gold_level:number;
    private _buy_gold:number;
    private _add_gold:number;
    private _sell_gold:number;

    // "1": {
    //     "id": "1",
    //     "name": "Ship0001",
    //     "displayname": "方舟1号",
    //     "level": 1,
    //     "icon": 1,
    //     "output_gold": 25,
    //     "gold_interval": 5800,
    //     "output_gold_second": 4,
    //     "bonusShip_level": -1,
    //     "unlock_buy_gold_level": 1,
    //     "buy_gold": 100,
    //     "add_gold": 1.07,
    //     "sell_gold": 80
    //   },

    constructor(data:any)
    {
        this._id = parseInt(data.id);
        this._name = data.name;
        this._displayName = ""+data.displayname;
        this._level = data.level;
        this._icon = data.icon;

        this._output_gold = data.output_gold;
        this._gold_interval = data.gold_interval;
        this._output_gold_second = data.output_gold_second;
        this._bonusShip_level = data.bonusShip_level;
        this._unlock_buy_gold_level = data.unlock_buy_gold_level;
        this._buy_gold = data.buy_gold;
        this._add_gold = data.add_gold;
        this._sell_gold = data.sell_gold;
    }

    public get id():number
    {
        return this._id;
    }

    public get level():number
    {
        return this._level;
    }

    // public get shipName():string
    // {
    //     return this._name;
    // }

    public get shipDisplayName():string
    {
        return this._displayName;
    }

    public get skinUrl():string
    {
        return "imgRes2/shipicon/"+this._icon+".png";
    }

    public get icon():number
    {
        return this._icon;
    }

    public get output_gold():number
    {
        return this._output_gold;
    }

    public get gold_interval():number
    {
        return this._gold_interval;
    }

    public get output_gold_second():number
    {
        return this._output_gold_second;
    }

    public get bonusShip_level():number
    {
        return this._bonusShip_level;
    }

    public get unlock_buy_gold_level():number
    {
        return this._unlock_buy_gold_level;
    }

    public get buy_gold():number
    {
        return this._buy_gold;
    }

    public get sell_gold():number
    {
        return this._sell_gold;
    }

    public get add_gold():number
    {
        return this._add_gold;
    }
}