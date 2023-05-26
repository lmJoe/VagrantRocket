import { DialogType } from "./GameModel";
import ResourceManager from "../ctrl/ResourceManager";

/*
* npc对话配置;
*/
export default class NpcDialog
{

    public readonly id:number;
    
    public readonly type:DialogType;
    public readonly npcIcon:number;
    private readonly _content:string;
    private readonly _tvImg:string;
    public readonly isStar:boolean;

    public readonly nextId:number;
    public readonly hasNext:boolean;

    // "101": {
    //     "id": "101",
    //     "type": 1,
    //     "npcIcon": 1,
    //     "content": "对话内容101",
    //     "tvImg": "tvImg1",
    //     "nextId": 102
    //   },

    constructor(data:any)
    {
        this.id = parseInt( data.id );

        this.type = data.type;
        this.npcIcon = data.npcIcon;
        this._content = ""+data.content;
        this._tvImg = ""+data.tvImg;
        this.isStar = this.checkIsStar();

        this.nextId = data.nextId;
        this.hasNext = this.nextId != -1;
    }

    private checkIsStar():boolean
    {
        return this._tvImg.indexOf("Star") != -1;
    }

    public get tvImg():string
    {
        if(this.isStar)
        {
            return ResourceManager.StarPrefix+this._tvImg+".png";
        }
        return "npcdialog/tvimg/"+this._tvImg+".jpg";
    }

    public get npcIconImg():string
    {
        return "npcdialog/dialog/npcIcon_"+this.npcIcon+".png"
    }

    public get dialog():string
    {
        if(this.type == DialogType.Dialog)
        {
            return this._content;
        }
        return "";
    }

    public get starId():number
    {
        if(this.type == DialogType.Star)
        {
            return parseInt(this._content);
        }
        return -1;
    }
}