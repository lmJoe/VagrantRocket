import UserData from "../data/UserData";
import GameJsonConfig from "./GameJsonConfig";
import MergeUserData from "../merge/data/MergeUserData";

export default class LevelColor{
    constructor(){
    }

    private static Colors:Array<Laya.Vector4> = 
    [
        new Laya.Vector4(255/255,223/255,45/255,1),//黄
        new Laya.Vector4(38/255,202/255,175/255,1),//绿
        new Laya.Vector4(157/255,237/255,65/255,1),//青
        new Laya.Vector4(96/255,218/255,252/255,1),//蓝
        new Laya.Vector4(126/255,82/255,218/255,1),//紫
        new Laya.Vector4(215/255,48/255,60/255,1),//红
        new Laya.Vector4(223/255,97/255,59/255,1),//橙
    ];

    public static getPlanetColor(colorType:number):Laya.Vector4
    {
        return LevelColor.Colors[colorType-1];
    }

    public static getLevelColorType():number
    {
        let originPlanetId =  UserData.instance.levelData.originPlanetId;
        let planetCfg = GameJsonConfig.instance.getPlanetConfig( originPlanetId );
        return planetCfg.planetColor;
    }

    public static getShipColorByShipId(shipId:number):number
    {
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig( shipId );
        return ((shipInfo.icon-1) % 5) + 1;
    }
}   