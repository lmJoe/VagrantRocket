import GameSave from "../data/GameSave";
import Constants from "../model/Constants";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SignBonusConfig from "../config/SignBonusConfig";
import { SignBonusType } from "../model/GameModel";
import MergeUserData from "../merge/data/MergeUserData";
import SignBonusPopupMgr from "../gameuictrl/SignBonusPopupMgr";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import MergeDefine from "../merge/data/MergeDefine";
import { ShipBoxType } from "../merge/data/MergeModel";
import SkinManager from "./SkinManager";
import NewSkinPopupMgr from "../gameuictrl/NewSkinPopupMgr";
import LoginManager from "./LoginManager";
import Util from "../utils/Util";
import DataStatisticsMgr from "./DataStatisticsMgr";
import GuideManager from "../gameuictrl/GuideManager";
import MergeGuideManager from "../merge/ctrl/MergeGuideManager";

/*
* 签到数据管理;
*/
export default class SignManager{
    constructor(){
    }

    private static _instance:SignManager;
    public static get instance():SignManager
    {
        if(!this._instance)
        {
            this._instance = new SignManager();
        }
        return this._instance;
    }

    private static readonly SignKey:string = "SignKey";

    private _signData:any;

    private _showTimemark:number;
    private _signDay:number;
    private _signTimemark:number;
    private _speedUpNum:number;

    public get signDay():number
    {
        return this._signDay;
    }

    public get signTimemark():number
    {
        return this._signTimemark;
    }

    public get speedUpNum():number
    {
        return this._speedUpNum;
    }

    public clearData():void
    {
        GameSave.clearValue(SignManager.SignKey);
    }

    public initData():void
    {
        let saveStr = GameSave.getValue(SignManager.SignKey);
        if(!saveStr)
        {
            this._signData = {};
            this._signData.day = 0;
            this._signData.timemark = 0;
            this._signData.speedUpNum = 0;
            this._signData.showTimemark = 0;
        }else{
            this._signData = JSON.parse(saveStr);
        }
        this._signDay = this._signData.day;
        this._signTimemark = this._signData.timemark;
        this._speedUpNum = this._signData.speedUpNum;
        this._showTimemark = this._signData.showTimemark;
    }

    private saveData():void
    {
        this._signData.day = this._signDay;
        this._signData.timemark = this._signTimemark;
        this._signData.speedUpNum = this._speedUpNum;
        this._signData.showTimemark = this._showTimemark;
        GameSave.setValue(SignManager.SignKey, JSON.stringify(this._signData));
    }

    public getCanForceShowSign():boolean
    {
        if( this.getGainAllBonus() )
        {//已经领取全部签到奖励
            return false;
        }
        if( this.getTodayHasShow() )
        {//今日已经打开过
            return false;
        }
        if( LoginManager.isNewPlayer )
        {//新手第一次打开
            return false;
        }
        if( GuideManager.instance.hasFinish==false )
        {//飞行引导未结束
            return false;
        }
        if( MergeGuideManager.instance.hasFinish==false )
        {//合成引导未结束
            return false;
        }
        return true;
    }

    public getTodayHasShow():boolean
    {
        return Util.isToday(this._showTimemark);
    }

    public getTodayHasSign():boolean
    {
        return Util.isToday(this._signTimemark);
    }

    public getGainAllBonus():boolean
    {
        return this._signDay >= Constants.SignTotalDay;
    } 

    public getCanSpeedUp():boolean
    {
        return this._speedUpNum > 0;
    } 

    public useSpeedUpCard():void
    {
        this._speedUpNum = Math.max(0, this._speedUpNum-1);
        this.saveData();
    }
    
    public setTodayHasShow():void
    {
        this._showTimemark = Date.now();
        this.saveData();
    }

    public sign():void
    {
        if(this.getTodayHasSign())
        {
            return;
        }
        //更新签到日期
        this._signDay = this._signDay +1;
        this._signTimemark = Date.now();
        GameEventMgr.instance.Dispatch(GameEvent.OnSign);
        this.saveData();
        DataStatisticsMgr.instance.stat("签到成功",{"天数":this._signDay.toString()});
        //显示奖励(但是未领取，关闭奖励界面才是真的领取)
        let signBonusConfig:SignBonusConfig = SignBonusConfig.getSignBonusConfig(this._signDay);
        if(signBonusConfig.bonusType == SignBonusType.Skin)
        {
            this.getSignBonus(signBonusConfig);
        }else{
            this.showSignBonus(signBonusConfig);
        }
    }

    private showSignBonus(signBonusConfig:SignBonusConfig):void
    {
        SignBonusPopupMgr.instance.show(signBonusConfig);
    }

    public getSignBonus(signBonusConfig:SignBonusConfig):void
    {
        switch(signBonusConfig.bonusType)
        {
            case SignBonusType.Coin:
                this.gainCoinBonus(signBonusConfig);
                break;
            case SignBonusType.Ship:
                this.gainShipBonus(signBonusConfig);
                break;
            case SignBonusType.SpeedUp:
                this.gainSpeedUpBonus(signBonusConfig);
                break;
            case SignBonusType.Skin:
                this.gainSkinBonus(signBonusConfig);
                break;
        }
    }

    private gainCoinBonus(config:SignBonusConfig):void
    {   
        let bonusShipId:number = PowerUpMgr.getFreeDropShipId(true);
        bonusShipId = Math.min(MergeDefine.MaxShipLevel, bonusShipId+config.bonusValue);
        let bonusCoin:number = PowerUpMgr.getShopPirceWithDiscountBuff(bonusShipId);
        MergeUserData.instance.changeMoney(bonusCoin);
    }

    private gainShipBonus(config:SignBonusConfig):void
    {
        let bonusShipId:number = PowerUpMgr.getFreeDropShipId(true);
        let boxType:ShipBoxType = config.bonusValue>10 ? ShipBoxType.Type02 : ShipBoxType.Type03;
        PowerUpMgr.createMultiCacheShipBox(bonusShipId, config.bonusValue, boxType);
    }

    private gainSpeedUpBonus(config:SignBonusConfig):void
    {
        this._speedUpNum += config.bonusValue;
        this.saveData();
        GameEventMgr.instance.Dispatch(GameEvent.RefreshSpeedUpBtnReddot);
    }

    private gainSkinBonus(config:SignBonusConfig):void
    {
        let skinData = SkinManager.instance.getSkinDataByHeadId(config.bonusValue);
        SkinManager.instance.unlockNewSkin(skinData);
        NewSkinPopupMgr.instance.show(skinData);
    }
}