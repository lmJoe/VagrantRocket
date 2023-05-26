import { SkinUnlockType, SkinType } from "./GameModel";

/*
* 星系信息
*/
export default class SkinData
{

    public readonly skinId:number;
    public readonly skinName:string;
    public readonly skinType:SkinType;
    public readonly headId:number;
    public readonly desc:string;
    public readonly colorList:Array<number>;

    public readonly unlockType:SkinUnlockType;
    public readonly unlockValue:number;
    private readonly _icon:string;

    // "1": {
    //     "skinId": "1",
    //     "skinName": "太空探索器",
    //     "skinType": 1,
    //     "headId": 111,
    //     "desc": "承载着祖国的荣誉，去遥远的外太空流浪",
    //     "colorList": [
    //       1,
    //       2,
    //       4
    //     ],
    //     "unlockType": 0,
    //     "unlockValue": 7
    //   },

    constructor(data:any)
    {
        this.skinId = data.skinId;
        this.skinName = data.skinName;
        this.skinType = data.skinType;
        this.headId = data.headId;
        this.desc = data.desc == -1 ? "" : data.desc;
        this.colorList = data.colorList;
        this.unlockType = data.unlockType;
        this.unlockValue = data.unlockValue;
        this._icon = ""+data.icon;
    }

    public get skinIcon():string
    {
        return this.getDisplaySkin();
    }

    public getDisplaySkin(colorId:number=-1):string
    {
        let defaultColorId = this.colorList[0];
        if(colorId == -1)
        {
            colorId = defaultColorId;
        }
        if(this.skinType == SkinType.Normal)
        {
            let icon = parseInt(this._icon)+colorId;
            return "imgRes2/shipicon/"+icon+".png";
        }else{

            if(colorId == defaultColorId)
            {
                return "imgRes2/skindisplay/first/skinDisplay_"+this.headId+"_"+colorId+".png";
            }else{
                return "imgRes2/skindisplay/other/skinDisplay_"+this.headId+"_"+colorId+".png";
            }
        }
    }
}