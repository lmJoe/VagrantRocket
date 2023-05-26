import ResourceManager from "../ctrl/ResourceManager";
import { DialogType } from "./GameModel";

/*
* 探索星球配置;
*/
export default class StarInfo
{

    public readonly id:number;

    public readonly starName:string;
    public readonly starDesc:string;
    private readonly _icon:string;

    public readonly order:number;
    public readonly similar:number;
    public readonly radius:number;
    public readonly temperature:number;
    public readonly mass:number;
    public readonly water:number;

    public readonly dialogId:number;
    public readonly dialogType:DialogType;

    // "1": {
    //     "id": "1",
    //     "starName": "Methuselah",
    //     "starDesc": "此行星的引力太强，人体可能无法负荷。",
    //     "icon": "Star1",

    //     "similar": 21,
    //     "radius": 7241,
    //     "temperature": 357,
    //     "mass": 3870,
    //     "water": 0,

    //     "order": 1,
    //     "dialogId": 101
    //   },

    constructor(data:any)
    {
        this.id = parseInt( data.id );

        this.starName = data.starName;
        this.starDesc = data.starDesc;
        this._icon = data.icon;

        this.order = data.order;
        this.similar = data.similar;
        this.radius = data.radius;
        this.temperature = data.temperature;
        this.mass = data.mass;
        this.water = data.water;

        this.dialogId = data.dialogId;
        this.dialogType = data.dialogId == -1 ? DialogType.Star : DialogType.Dialog;
    }

    public get iconImg():string
    {
        return ResourceManager.StarPrefix+this._icon+".png";
    }
}