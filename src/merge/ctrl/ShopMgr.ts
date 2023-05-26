import ShipInfoData from "../data/ShipInfoData";
import GameJsonConfig from "../../config/GameJsonConfig";
import MergeUserData from "../data/MergeUserData";
import { ShopUnLockEnum, PrivilegeType } from "../data/MergeModel";
import PrivilegeData from "../data/PrivilegeData";
import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import UserData from "../../data/UserData";
import ShopPopupMgr from "../../gameuictrl/ShopPopupMgr";

/*
* 商店
*/
export default class ShopMgr
{
    private static _instance:ShopMgr;
    public static get instance():ShopMgr
    {
        if(!this._instance)
        {
            this._instance = new ShopMgr();
        }
        return this._instance;
    }

    private _shopShipList:Array<ShipInfoData>;

    constructor()
    {
    }

    private _canUpdateProfit:boolean;
    private _canUpdateDiscount:boolean;

    public get canUpdatePrivilege():boolean
    {
        let firstShowPrivilegeTabReddot:boolean = ShopPopupMgr.instance.firstShowPrivilegeTabReddot;
        return this._canUpdateProfit || this._canUpdateDiscount || firstShowPrivilegeTabReddot;
    }

    public start():void
    {
        this._canUpdateProfit = false;
        this._canUpdateDiscount = false;
        GameEventMgr.instance.addListener(GameEvent.OnVideoAdUpdate, this, this.onVideoAdUpdate);

        this.checkPrivilege();
    }

    private onVideoAdUpdate():void
    {
        this.checkPrivilege();
    }

    public checkPrivilege():void
    {
        //检查增益
        let profitNum:number = MergeUserData.instance.getPrivilegeLevel(PrivilegeType.Profit);
        let cfg0:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Profit, profitNum+1);
        if(cfg0 == null)
        {
            this._canUpdateProfit = false;
            return;
        }
        if( UserData.instance.adVideoCount >= cfg0.price )
        {
            this._canUpdateProfit = true;
            GameEventMgr.instance.Dispatch(GameEvent.OnPrivilegeUpdate);
        }else{
            this._canUpdateProfit = false;
        }

        //检查折扣
        let discountNum:number = MergeUserData.instance.getPrivilegeLevel(PrivilegeType.Discount);
        let cfg1:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Discount, discountNum+1);
        if(cfg1 == null)
        {
            this._canUpdateDiscount = false;
            return;
        }
        if( UserData.instance.adVideoCount >= cfg1.price )
        {
            this._canUpdateDiscount = true;
            GameEventMgr.instance.Dispatch(GameEvent.OnPrivilegeUpdate);
        }else{
            this._canUpdateDiscount = false;
        }
    }

    public isShopUnLock(shipId:number):ShopUnLockEnum
	{
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig(MergeUserData.instance.iMaxLockedShipId);
        if(shipId <= shipInfo.unlock_buy_gold_level)
        {
            return ShopUnLockEnum.Coin;
        }
        return ShopUnLockEnum.Locked;
    }
    
    public getOtherShopBuff(type:PrivilegeType):number
	{
		let buffLevel:number = MergeUserData.instance.getPrivilegeLevel(type);
		if(buffLevel <= 0)
		{
			return 0;
		}
        let buffData:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(type, buffLevel);
		return buffData.value / 100;
    }
    
    public get canShopRed():boolean
    {
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig(MergeUserData.instance.iMaxLockedShipId);
        let shopCanVideo:boolean = shipInfo.bonusShip_level > 0 && MergeUserData.instance.ShopVideoGetShipTime == 0;
        let firstShowShopTabReddot:boolean = ShopPopupMgr.instance.firstShowShopTabReddot;
        return shopCanVideo || firstShowShopTabReddot;
    }

}