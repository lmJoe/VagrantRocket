import SpeedUp from "./SpeedUp";
import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import MergeDefine from "./MergeDefine";
import CacheShipData from "./CacheShipData";
import PowerUpMgr from "../ctrl/PowerUpMgr";
import { PrivilegeType } from "./MergeModel";
import GameJsonConfig from "../../config/GameJsonConfig";
import PrivilegeData from "./PrivilegeData";
import GameSave from "../../data/GameSave";
import Constants from "../../model/Constants";
import SolarManager from "../../solar/SolarManager";
import RocketLvData from "../../model/RocketLvData";
import DataStatisticsMgr from "../../ctrl/DataStatisticsMgr";
import ServerData from "../../data/ServerData";
import UserData from "../../data/UserData";
import TipDialogMgr from "../../gameuictrl/TipDialogMgr";

export default class MergeUserData{
    constructor(){
    }

    private static _instance:MergeUserData;
    public static get instance():MergeUserData
    {
        if(!this._instance)
        {
            this._instance = new MergeUserData();
        }
        return this._instance;
    }

    private _playerLevel:number;//用户等级 —— 不显示，用于解锁功能
    private _ownMoney:number;
    private _saveMoneyTimeMark:number = Date.now();
    private _itemShipIds:Array<number>;//当前合成格子中的id
    private _buyShipsNum:Array<number>;//只统计购买的数量
    private _privilegeData:Array<number>;//购买特权数据

    private _rocketInfo:RocketLvData;//当前等级火箭信息

    public ShopVideoGetShipTime:number = 0;//显示广告免费获取的间隔
    public FreeBonusTime:number = -1;//宝箱刷新时间 -- 空投
    public ShowFreeBonusTime:number = 0;//宝箱展示时间
    public Money5Time:number = 0;//宝箱5倍加速时间
    public iMaxLockedShipId:number = 1;
    public speedUp:SpeedUp = null;
    public CacheShipDataList:Array<CacheShipData> = [];
    public LastOffLineTime:number = 0;
    public LastFreeUpgradeTime:number = 0;

    public initLoaclData():void
    {
        this.getOffLineTime( GameSave.getValue("OffLineTime") );
        this.getCoin( GameSave.getValue("CoinKey") );
        this.getMaxShipId( GameSave.getValue("MaxShipId") );
        this.getItemShipIds( GameSave.getValue("ItemShipIds") );
        this.getPrivilegeData( GameSave.getValue("PrivilegeData") );
        this.getBuyShipsNum( GameSave.getValue("BuyShipsNum") );

        this._playerLevel = this.iMaxLockedShipId;
        this._rocketInfo = GameJsonConfig.instance.getRokectConfigByLevel(this.iMaxLockedShipId);
    }

    public getServer(data:any):void
    {
        this.getOffLineTime( data.OffLineTime );
        this.getCoin( data.CoinKey );
        this.getMaxShipId( data.MaxShipId );
        this.getItemShipIds( data.ItemShipIds );
        this.getPrivilegeData( data.PrivilegeData );
        this.getBuyShipsNum( data.BuyShipsNum );

        this._playerLevel = this.iMaxLockedShipId;
        this._rocketInfo = GameJsonConfig.instance.getRokectConfigByLevel(this.iMaxLockedShipId);
    }

    public allMergeUserData():any
    {
        let data = {
            "OffLineTime":this.LastOffLineTime.toString(),
            "CoinKey":this._ownMoney.toString(),
            "MaxShipId":this.iMaxLockedShipId.toString(),
            "ItemShipIds":this._itemShipIds.join(),
            "PrivilegeData":this._privilegeData.join(),
            "BuyShipsNum":this._buyShipsNum.join(),
        }
        return data;
    }

    public clearData():void
    {
        GameSave.clearValue("OffLineTime");
        GameSave.clearValue("CoinKey");
        GameSave.clearValue("MaxShipId");
        GameSave.clearValue("ItemShipIds");
        GameSave.clearValue("PrivilegeData");
        GameSave.clearValue("BuyShipsNum");
    }

    //==离线时间====================================================
    private getOffLineTime(valueStr:string):void
    {
        valueStr += "";
        if(valueStr && valueStr.length>0)
        {
            this.LastOffLineTime = parseInt(valueStr);
        }else{
            this.LastOffLineTime = 0;
        }
    }
    public saveOffLineTime():void
    {
        this.LastOffLineTime = Date.now();
        GameSave.setValue("OffLineTime", this.LastOffLineTime+"");
    }

    //==金币====================================================
    private getCoin(valueStr:string):void
    {
        valueStr += "";
        if(valueStr == "null" || valueStr == "NaN")
        {
            valueStr = "";
        }
        if(valueStr && valueStr.length>0)
        {
            this._ownMoney = parseInt(valueStr);
        }else{
            this._ownMoney = Constants.DefaultCoin;
        }
        this.saveCoin();
    }
    private saveCoin():void
    {
        GameSave.setValue("CoinKey", this._ownMoney+"");
    }

    //==最大解锁飞船Id====================================================
    private getMaxShipId(valueStr:string):void
    {
        valueStr += "";
        if(valueStr == "null" || valueStr == "NaN")
        {
            valueStr = "";
        }
        if(valueStr && valueStr.length>0)
        {
            this.iMaxLockedShipId = parseInt(valueStr);
        }else{
            this.iMaxLockedShipId = Constants.DefaultShipId;
        }
        this.saveMaxShipId();
    }
    private saveMaxShipId():void
    {
        GameSave.setValue("MaxShipId", this.iMaxLockedShipId+"");
    }

    //==ItemShipIds====================================================
    private getItemShipIds(valueStr:string):void
    {
        this._itemShipIds = [];
        if(valueStr && valueStr.length>0)
        {
            let temp = valueStr.split(",");
            for(var i=0; i<temp.length; i++)
            {
                this._itemShipIds[i] = parseInt(temp[i]);
            }
        }else{
            this._itemShipIds = Constants.DefaultItemShipIds;
        }
        this.saveItemShipIds();
    }
    private saveItemShipIds():void
    {
        GameSave.setValue("ItemShipIds", this._itemShipIds.join());
    }

    //==PrivilegeData====================================================
    private getPrivilegeData(valueStr:string):void
    {
        this._privilegeData = [];
        if(valueStr && valueStr.length>0)
        {
            let temp = valueStr.split(",");
            for(var i=0; i<temp.length; i++)
            {
                this._privilegeData[i] = parseInt(temp[i]);
            }
        }else{
            this._privilegeData = Constants.DefaultPrivilegeData;
        }
        this.savePrivilegeData();
    }
    private savePrivilegeData():void
    {
        GameSave.setValue("PrivilegeData", this._privilegeData.join());
    }

    //==BuyShipsNum====================================================
    private getBuyShipsNum(valueStr:string):void
    {
        this._buyShipsNum = [];
        if(valueStr && valueStr.length>0)
        {
            let temp = valueStr.split(",");
            for(var i=0; i<temp.length; i++)
            {
                this._buyShipsNum[i] = parseInt(temp[i]);
            }
        }else{
            this._buyShipsNum = Constants.DefaultBuyShipsNum;
        }
        this.saveBuyShipsNum();
    }
    private saveBuyShipsNum():void
    {
        GameSave.setValue("BuyShipsNum", this._buyShipsNum.join());
    }

    //------------------------------------------------------------------------------

    public buyShip(shipId:number, num:number=1):void
    {
        this._buyShipsNum[shipId-1] += num;
        this.saveBuyShipsNum();
    }

    public upgradePrivilegel(type:PrivilegeType):void
    {
        //验证一遍
        let privilegeLevel:number = MergeUserData.instance.getPrivilegeLevel(type);
        let cfg:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(type, privilegeLevel+1);
        let videoCount:number = UserData.instance.adVideoCount;
        if(videoCount >= cfg.price)
        {
            this._privilegeData[type-1] ++;
            this.savePrivilegeData();
            
            GameEventMgr.instance.Dispatch(GameEvent.RefreshShopOtherList);
            GameEventMgr.instance.Dispatch(GameEvent.OnVideoAdUpdate);
            GameEventMgr.instance.Dispatch(GameEvent.OnPrivilegeUpdate);
            //
            ServerData.instance.uploadData();
            //
            DataStatisticsMgr.instance.stat("特权升级",{"type":type.toString(), "videoCount":videoCount.toString()});
            //
            let privilegelDesc:string = cfg.desc + " " + cfg.value + "%";
            TipDialogMgr.instance.show( privilegelDesc );
        }
    }

    public getPrivilegeLevel(type:PrivilegeType):number
    {
        return this._privilegeData[type-1];
    }

    public unlockNewShipLevel(newShipLevel:number):void
    {
        this.iMaxLockedShipId = newShipLevel;
        this._playerLevel = this.iMaxLockedShipId;
        this._rocketInfo = GameJsonConfig.instance.getRokectConfigByLevel(this.iMaxLockedShipId);

        GameEventMgr.instance.Dispatch(GameEvent.UnlockNewShipLevel);
        GameEventMgr.instance.Dispatch(GameEvent.RefreshBuyShipBtn, [PowerUpMgr.getMostCostEffectiveShipId()]);
        GameEventMgr.instance.Dispatch(GameEvent.StartShengjiEffect);

        this.saveMaxShipId();
        DataStatisticsMgr.instance.stat("升级火箭",{"等级":this.iMaxLockedShipId.toString()});
    }

    public setItemShipid(idx:number, shopId:number):void
    {
        this._itemShipIds[idx] = shopId;
        this.saveItemShipIds();
    }

    public get rocketInfo():RocketLvData
    {
        return this._rocketInfo;
    }

    public get playerLevel():number
    {
        return this._playerLevel;
    }

    public get ownMoney():number
    {
        return this._ownMoney;
    }

    public getItemShipIdByIdx(idx:number):number
    {
        return this._itemShipIds[idx];
    }

    public getItemShipLength():number
    {
        return this._itemShipIds.length;
    }

    public get buyShipsNum():Array<number>
    {
        return this._buyShipsNum;
    }

    public get speedUpTime():number
    {
        if (this.speedUp != null)
        {
            return this.speedUp.durationTime;
        }
        return 0;
    }

    public changeSpeedUp(time:number):void
	{
		if (this.speedUp == null)
		{
			this.speedUp = new SpeedUp(MergeDefine.SpeedUpMult, time);
		}
		else
		{
			this.speedUp.add(MergeDefine.SpeedUpMult, time);
        }
        GameEventMgr.instance.Dispatch(GameEvent.StartSpeedUp)
    }
    
    public changeMoney(money:number):void
	{
        if(this._ownMoney < Number.MAX_VALUE)
        {
            let oldMoney:number = this._ownMoney;
            let addNum:number = Number.MAX_VALUE - this._ownMoney;
            if(addNum < money)
            {
                this._ownMoney = Number.MAX_VALUE;
            }else{
                addNum = money;
                this._ownMoney += money;
            }
            //改变金钱
            GameEventMgr.instance.Dispatch(GameEvent.RefreshOwnMoneyText, [oldMoney, addNum]);
            //保存金钱
            let nowTime = Date.now();
            let diffTime = (nowTime - this._saveMoneyTimeMark);
            if( diffTime > 10000 )
            {
                //10秒一次
                this._saveMoneyTimeMark = nowTime;
                this.saveCoin();
            }
        }
    }
    
    public consumeMoney(money:number):void
	{
        let oldMoney:number = this._ownMoney;
        this._ownMoney -= money;
        this._ownMoney = Math.max(0, this._ownMoney);
        this.saveCoin();
        //改变金钱
        GameEventMgr.instance.Dispatch(GameEvent.RefreshOwnMoneyText, [oldMoney, -money]);
    }

    public judgeMoneyIsFull(consumeMoney:number):boolean
	{
        return this._ownMoney >= consumeMoney;
	}
}