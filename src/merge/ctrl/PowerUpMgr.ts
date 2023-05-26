import GameJsonConfig from "../../config/GameJsonConfig";
import MergeUserData from "../data/MergeUserData";
import ShipItem from "../item/ShipItem";
import MergeDefine from "../data/MergeDefine";
import Mathf from "../../utils/Mathf";
import CacheShipData from "../data/CacheShipData";
import MergeShipMgr from "./MergeShipMgr";
import ShopMgr from "./ShopMgr";
import { PrivilegeType, ShipBoxType } from "../data/MergeModel";
import FreeUpgradeShipPopupMgr from "../../gameuictrl/FreeUpgradeShipPopupMgr";

/*
* 强力
*/
export default class PowerUpMgr
{

    private static BackgroundTimeList:Array<number>=[0,0,0,0,0,0,0,0,0,0,0,0];
    private static ShopBuff:number = 1;

    public static clearBackgroundEarningTime():void
    {
        this.BackgroundTimeList = [0,0,0,0,0,0,0,0,0,0,0,0];
    }

    public static getAstronautCost():number
    {
        let cfg = GameJsonConfig.instance.getShipInfoConfig( MergeUserData.instance.iMaxLockedShipId );
        return cfg.output_gold_second;
    }

    //当前可获得的最高等级
	public static getShopLockShipId():number
	{
        let cfg = GameJsonConfig.instance.getShipInfoConfig( MergeUserData.instance.iMaxLockedShipId );
        return cfg.unlock_buy_gold_level;
    }

    public static getMostCostEffectiveShipId():number
	{
        let shopLockShipId = this.getShopLockShipId();
        let num = Math.max(shopLockShipId-4, 1);
        let result = num;
        let dd = 9999999;
        for(var i=num; i<=shopLockShipId; i++)
        {
            let shopPrice = this.getShopPirce(i);
            let shipEarings = this.getShipEaringsPerSecond(i);
            let num2 = shopPrice / shipEarings;
            if(num2 < dd)
            {
                dd = num2;
                result = i;
            } 
        }
        return result;
    }
    
    public static getShipEaringsPerSecond(shipId:number):number
	{
        let cfg = GameJsonConfig.instance.getShipInfoConfig( shipId );
        return cfg.output_gold_second;
	}

	public static getShopPirce(shipId:number):number
	{
        let cfg = GameJsonConfig.instance.getShipInfoConfig( shipId );
        let value = Math.pow(cfg.add_gold, MergeUserData.instance.buyShipsNum[shipId-1]);
        return cfg.buy_gold * value;
    }
    
	public static getShopPirceWithDiscountBuff(shipId:number):number
	{
        let shopPrice:number = PowerUpMgr.getShopPirce(shipId);
        let shopDiscount = ShopMgr.instance.getOtherShopBuff(PrivilegeType.Discount);
        return shopPrice * (1-shopDiscount);
    }

    public static getAllEarningsPerSecond():number
	{   
        let arr = MergeShipMgr.instance.itemList;
        let allEarnings = 0;
        for(var i=0; i<arr.length; i++)
        {
            if(arr[i].shipId > 0 && arr[i].shipBoxIsOpen)
            {
                allEarnings += this.getShipEaringsPerSecond(arr[i].shipId);
            }
        }
        return allEarnings;
    }
    
    /**
     * 免费掉落 —— 普通掉落 或者 空投掉落
     */
    public static createFreeDropShip(num:number=4, isAD:boolean=true):void
	{
        for(var i=0; i<num; i++)
        {
            let freeDropShipId = this.getFreeDropShipId(isAD);
            if(freeDropShipId <= 0)
            {
                continue;
            }
            if(isAD)
            {
                let cacheShipData = new CacheShipData();
                cacheShipData.init(freeDropShipId, ShipBoxType.Type02);
                MergeShipMgr.instance.addCacheShipData(cacheShipData);
                continue;
            }
            let cacheShipData = new CacheShipData();
            cacheShipData.init(freeDropShipId, ShipBoxType.Type03);
            if (MergeShipMgr.instance.getNoHaveShipsLength() > 0)
            {
                MergeShipMgr.instance.createBoxItem(cacheShipData, null);
            }
        }
    }

    /**
     * 掉落视频箱子
     * 最终奖励是 1个视频火箭 / 4个视频火箭
     */
    public static createDropVideoBox():void
	{
        let freeDropShipId = this.getFreeDropShipId(true);
        let cacheShipData = new CacheShipData();
        cacheShipData.init(freeDropShipId, ShipBoxType.Type04, false, true);
        MergeShipMgr.instance.addCacheShipData(cacheShipData);
    }

    /**
     * 批量产生空投箱子奖励
     */
    public static createMultiCacheShipBox(shipId:number, num:number, boxType:ShipBoxType=ShipBoxType.Type02):void
	{
        for(var i=0; i<num; i++)
        {
            let cacheShipData = new CacheShipData();
            cacheShipData.init(shipId, boxType);
            MergeShipMgr.instance.addCacheShipData(cacheShipData);
        }
    }

    /**
     * 看视频掉落 —— 商店 或者 免费视频
     * 因为视频获得不受合成格子是否已满限制
     */
    public static createVideoFreeShop(shipId:number):void
	{
        let cacheShipData = new CacheShipData();
        cacheShipData.init(shipId, ShipBoxType.Type01);
        if (MergeShipMgr.instance.getNoHaveShipsLength() <= 0)
        {
            MergeShipMgr.instance.addCacheShipData(cacheShipData);
        }else{
            MergeShipMgr.instance.createBoxItem(cacheShipData, null);
        }
    }
    
	public static getFreeDropShipId(isAD:boolean):number
	{
        let list:Array<number> = [];
        let list2:Array<number> = [];
        let iMaxLockedShipId = MergeUserData.instance.iMaxLockedShipId;
        if(isAD)
        {
            let adShipData = GameJsonConfig.instance.getAdShipConfig(iMaxLockedShipId);
            list = adShipData.random_weightList;
            list2 = adShipData.random_levelList;
        }else
        {
            let freeShipData = GameJsonConfig.instance.getFreeShipConfig(iMaxLockedShipId);
            list = freeShipData.random_weightList;
            list2 = freeShipData.random_levelList;
        }
        let num = 0;
        for(var i=0; i<list.length; i++)
        {
            num += list[i];
        }
        let num2 = Mathf.range(0, num);
        let num3 =0;
        for(var j=0; j<list.length; j++)
        {
            num3 += list[j];
            if(num2 < num3)
            {
                return list2[j];
            }
        }
        return -1;
    }
    
    public static resetShopBuff():void
	{
        this.ShopBuff = 1 + ShopMgr.instance.getOtherShopBuff(PrivilegeType.Profit);
    }
    
	public static refreshAllShipEarnings(deltaTime:number):void
	{
        let curArrItem = MergeShipMgr.instance.itemList;
        let mult = MergeUserData.instance.speedUpTime > 0 ? MergeUserData.instance.speedUp.mult : 1;
        for(var i=0; i<curArrItem.length; i++)
        {
            let item = curArrItem[i];
            if(!item.isHaveShip || !item.shipBoxIsOpen)
            {
                continue;
            }
            let moneyRate = MergeUserData.instance.Money5Time <= 0 ? item.shipInfo.output_gold*this.ShopBuff : item.shipInfo.output_gold*this.ShopBuff*MergeDefine.AirDropMoneyRate;
            let goldInterval = item.shipInfo.gold_interval;
            if(mult > 0)
            {
                goldInterval = goldInterval/mult;
            }
            this.BackgroundTimeList[i] += deltaTime;
            if(this.BackgroundTimeList[i] >= goldInterval)
            {
                MergeUserData.instance.changeMoney(moneyRate);
                this.BackgroundTimeList[i] = 0;
            }
        }
    }
    
    //免费升级刚买的飞船
    public static CheckNeedShowShipFreeLevelUp(item:ShipItem):void
	{
        if(MergeUserData.instance.iMaxLockedShipId < MergeDefine.FreeUpGradeShipLevelLimit)
        {
            return;
        }
        let timeDiff = Date.now() - MergeUserData.instance.LastFreeUpgradeTime;
        if(timeDiff >= MergeDefine.FreeUpGradeShipTime)
        {
            let shopLockShipId = this.getShopLockShipId();
            let levelDiff = shopLockShipId - item.shipId;
            let freeShipLevelUpData = GameJsonConfig.instance.getFreeShipLevelUpCfg(levelDiff);
            if(freeShipLevelUpData)
            {
                let ran = Mathf.range(0, 10000);
                if(ran < freeShipLevelUpData.freelevelup_chance)
                {
                    FreeUpgradeShipPopupMgr.instance.show(item, freeShipLevelUpData.plus_level);
                }
            }
        }        
	}
}