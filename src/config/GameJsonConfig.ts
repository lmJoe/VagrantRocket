import ResourceConfig from "./ResourceConfig";
import ShipPodData from "../model/ShipPodData";
import LevelData from "../model/LevelData";
import SolarInfoData from "../model/SolarInfoData";
import ShipInfoData from "../merge/data/ShipInfoData";
import MergeUserLevelData from "../merge/data/MergeUserLevelData";
import FreeShipsLevelUpData from "../merge/data/FreeShipsLevelUpData";
import AdShipData from "../merge/data/AdShipData";
import FreeShipData from "../merge/data/FreeShipData";
import FreeBonusData from "../merge/data/FreeBonusData";
import PrivilegeData from "../merge/data/PrivilegeData";
import { PrivilegeType } from "../merge/data/MergeModel";
import RocketLvData from "../model/RocketLvData";
import ExplorerData from "../model/ExplorerData";
import SolarComment from "../model/SolarComment";
import Constants from "../model/Constants";
import PlanetConfig from "../model/PlanetConfig";
import OfflineData from "../model/OfflineData";
import FreeShipLevelUpData from "../model/FreeShipLevelUpData";
import SkinData from "../model/SkinData";
import NpcDialog from "../model/NpcDialog";
import StarInfo from "../model/StarInfo";

/*
* 游戏配置;
*/
export default class GameJsonConfig{
    constructor(){
    }

    private static _instance:GameJsonConfig;
    public static get instance():GameJsonConfig
    {
        if(!this._instance)
        {
            this._instance = new GameJsonConfig();
        }
        return this._instance;
    }

    //关卡火箭配置
    private _rokectLvConfig:any;
    //推进器参数配置
    private _boosterConfig:any;
    //关卡经济配置
    private _levelConfig:any;
    //星系信息配置
    private _solarInfoConfig:any;
    //星球配置
    private _planetConfig:any;
    //火箭信息配置
    private _shipInfoConfig:any;
    //探索顺序配置
    private _explorerConfig:any;
    //星系评论配置
    private _solarCommentConfig:any;

    //合成玩家等级配置
    private _userLevelConfig:any;
    //广告赠送火箭配置
    private _adShipCfg:any;
    //免费赠送火箭配置
    private _freeShipCfg:any;
    //空投配置
    private _freeBonusCfg:any;
    //特权配置
    private _privilegeCfg:any;
    //离线奖励配置
    private _offlineCfg:any;
    //免费升级配置
    private _freeShipLevelUpCfg:any;
    //皮肤配置
    private _skinCfg:any;
    //模型配置
    private _meshCfg:any;
    //npc对话配置
    private _npcDialogCfg:any;
    //探索星球配置
    private _starInfoCfg:any;

    public initConfig():void
    {
        this._rokectLvConfig = Laya.loader.getRes(ResourceConfig.RokectlvCfg);//加载界面
        this._boosterConfig = Laya.loader.getRes(ResourceConfig.BoosterCfg);
        this._levelConfig = Laya.loader.getRes(ResourceConfig.LevelCfg);
        this._solarInfoConfig = Laya.loader.getRes(ResourceConfig.SolarInfoCfg);
        this._shipInfoConfig = Laya.loader.getRes(ResourceConfig.ShipInfoCfg);
        this._userLevelConfig = Laya.loader.getRes(ResourceConfig.UserLevelCfg);
        this._explorerConfig = Laya.loader.getRes(ResourceConfig.ExplorerCfg);
        this._solarCommentConfig = Laya.loader.getRes(ResourceConfig.SolarCommentCfg);
        this._planetConfig = Laya.loader.getRes(ResourceConfig.PlanetCfg);

        this._adShipCfg = Laya.loader.getRes(ResourceConfig.ADShipsCfg);
        this._freeShipCfg = Laya.loader.getRes(ResourceConfig.FreeShipsCfg);
        this._freeBonusCfg = Laya.loader.getRes(ResourceConfig.FreeBonusCfg);
        this._privilegeCfg = Laya.loader.getRes(ResourceConfig.PrivilegeCfg);
        this._offlineCfg = Laya.loader.getRes(ResourceConfig.OfflineCfg);
        this._freeShipLevelUpCfg = Laya.loader.getRes(ResourceConfig.FreeShipLevelUpCfg);

        this._skinCfg = Laya.loader.getRes(ResourceConfig.SkinCfg);
        this._meshCfg = Laya.loader.getRes(ResourceConfig.MeshCfg);

        this._npcDialogCfg = Laya.loader.getRes(ResourceConfig.NpcDialogCfg);
        this._starInfoCfg = Laya.loader.getRes(ResourceConfig.StarInfoCfg);
    }

    public getLevelConfig(level:number):LevelData
    {
        let nm = ""+level;
        let cfg = this._levelConfig[nm];
        return new LevelData(cfg);
    }

    public getRokectConfigByLevel(level:number):RocketLvData
    {
        let nm = ""+level;
        let cfg = this._rokectLvConfig[nm];
        return new RocketLvData(cfg);
    }

    public getBoosterConfig(boosterId:number):ShipPodData
    {
        let nm = ""+boosterId;
        let cfg = this._boosterConfig[nm];
        return new ShipPodData(cfg);
    }

    public getSolarInfoConfig(solarIdx:number):SolarInfoData
    {
        let nm = ""+(solarIdx+1);
        let cfg = this._solarInfoConfig[nm];
        return new SolarInfoData(cfg);
    }

    public getShipInfoConfig(shipIdx:number):ShipInfoData
    {
        let nm = ""+(shipIdx);
        let cfg = this._shipInfoConfig[nm];
        if(!cfg)
        {
            cfg = this._shipInfoConfig["1"];
        }
        return new ShipInfoData(cfg);
    }

    public getAllShipInfoConfig():Array<ShipInfoData>
    {
        let list:Array<ShipInfoData> = [];
        for (var key in this._shipInfoConfig) 
        {
            if (this._shipInfoConfig.hasOwnProperty(key)) 
            {
                var cfg = this._shipInfoConfig[key];
                list.push(new ShipInfoData(cfg))
            }
        }
        return list;
    }

    public getMergeUserLevelConfig(userLv:number):MergeUserLevelData
    {
        let nm = ""+(userLv);
        let cfg = this._userLevelConfig[nm];
        return new MergeUserLevelData(cfg);
    }

    public getAdShipConfig(id:number):AdShipData
    {
        let nm = ""+(id);
        let cfg = this._adShipCfg[nm];
        return new AdShipData(cfg);
    }

    public getFreeShipConfig(id:number):FreeShipData
    {
        let nm = ""+(id);
        let cfg = this._freeShipCfg[nm];
        return new FreeShipData(cfg);
    }

    public getFreeBonusConfig(id:number):FreeBonusData
    {
        let nm = ""+(id);
        let cfg = this._freeBonusCfg[nm];
        return new FreeBonusData(cfg);
    }

    public getFreeBonusConfigList():Array<FreeBonusData>
    {
        let list:Array<FreeBonusData> = [];
        for (var key in this._freeBonusCfg) 
        {
            if (this._freeBonusCfg.hasOwnProperty(key)) 
            {
                var cfg = this._freeBonusCfg[key];
                list.push(new FreeBonusData(cfg))
            }
        }
        return list;
    }

    public getPrivilegeConfigByTypeLevel(type:PrivilegeType, level:number):PrivilegeData
    {
        for (var key in this._privilegeCfg) 
        {
            if (this._privilegeCfg.hasOwnProperty(key)) 
            {
                var cfg = this._privilegeCfg[key];
                if(cfg.type == type && cfg.level == level)
                {
                    return new PrivilegeData(cfg);
                }
            }
        }
        return null;
    }

    public getPlanetConfig(id:number):PlanetConfig
    {
        let nm = ""+id;
        let cfg = this._planetConfig[nm];
        return new PlanetConfig(cfg);
    }

    public getExplorerConfig(idx:number):ExplorerData
    {
        let nm = ""+(idx+1);
        let cfg = this._explorerConfig[nm];
        return new ExplorerData(cfg);
    }

    public getOfflineConfig():Array<OfflineData>
    {
        let list:Array<OfflineData> = [];
        for (var key in this._offlineCfg) 
        {
            if (this._offlineCfg.hasOwnProperty(key)) 
            {
                var cfg = this._offlineCfg[key];
                list.push(new OfflineData(cfg))
            }
        }
        return list;
    }

    public getFreeShipLevelUpCfg(idx:number):FreeShipLevelUpData
    {
        let nm = ""+idx;
        let cfg = this._freeShipLevelUpCfg[nm];
        if(cfg)
        {
            return new FreeShipLevelUpData(cfg);
        }
        return null;
    }

    public getSolarComments(solarIdx:number):Array<SolarComment>
    {
        let arr = [];
        for(var i=0; i<Constants.MaxSolarCommentNum; i++)
        {
            let nm = "playercomment" + (solarIdx+1) + (i+1);
            let cfg = this._solarCommentConfig[nm];
            if(cfg)
            {
                arr.push(cfg);
            }
        }
        return arr;
    }

    public getAllSkinConfig():Array<SkinData>
    {
        let list:Array<SkinData> = [];
        for (var key in this._skinCfg) 
        {
            if (this._skinCfg.hasOwnProperty(key)) 
            {
                var cfg = this._skinCfg[key];
                list.push(new SkinData(cfg))
            }
        }
        return list;
    }

    public getMeshSkinName(meshName:string):string
    {
        for (var key in this._meshCfg) 
        {
            if (this._meshCfg.hasOwnProperty(key)) 
            {
                let cfg = this._meshCfg[key];
                if(cfg.meshName == meshName)
                {
                    return cfg.meshSkinName;
                }
            }
        }
        return "";
    }

    public getNpcDialogById(dialogId:number):NpcDialog
    {
        let nm = ""+dialogId;
        let cfg = this._npcDialogCfg[nm];
        return new NpcDialog(cfg);
    }

    public getStarInfoById(starId:number):StarInfo
    {
        let nm = ""+starId;
        let cfg = this._starInfoCfg[nm];
        return new StarInfo(cfg);
    }
    
    public getAllStarInfo():Array<StarInfo>
    {
        let list:Array<StarInfo> = [];
        for (var key in this._starInfoCfg) 
        {
            if (this._starInfoCfg.hasOwnProperty(key)) 
            {
                var cfg = this._starInfoCfg[key];
                list.push(new StarInfo(cfg))
            }
        }
        return list;
    }
}