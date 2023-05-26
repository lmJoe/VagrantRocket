import { ui } from "../ui/layaMaxUI";
import ShipInfoData from "../merge/data/ShipInfoData";
import { ShopUnLockEnum, PrivilegeType, ShipBoxType } from "../merge/data/MergeModel";
import ShopMgr from "../merge/ctrl/ShopMgr";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import Util from "../utils/Util";
import MergeUserData from "../merge/data/MergeUserData";
import GameJsonConfig from "../config/GameJsonConfig";
import CacheShipData from "../merge/data/CacheShipData";
import MergeShipMgr from "../merge/ctrl/MergeShipMgr";
import ShipItem from "../merge/item/ShipItem";
import TipDialogMgr from "../gameuictrl/TipDialogMgr";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import MergeDefine from "../merge/data/MergeDefine";
import Constants from "../model/Constants";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import VideoAd from "../wx/VideoAd";

/*
* 商店组件;
*/
export default class ShopItem extends ui.component.ShopItemUI
{
    constructor(){
        super();
    }

    private _index:number;
	private _shipInfoData:ShipInfoData;

	onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClickItem);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClickItem);
    }
	
	private setBlackFilter(img:Laya.Image, isBlack:boolean):void
	{
		if(isBlack)
		{
			var mat: Array<number> = 
			[
				0, 0, 0, 0, 0, 
				0, 0, 0, 0, 0, 
				0, 0, 0, 0, 0, 
				0, 0, 0, 1, 0
			];
			var filter:Laya.ColorFilter = new Laya.ColorFilter(mat);
			img.filters = [filter];
		}else{
			img.filters = null;
		}
	}

    public setInfo(info:ShipInfoData, index:number):void
    {
        this._index = index;
        this._shipInfoData = info;

        this.txtIndex.value = "" + info.id;
		this.imgShipIcon.skin = info.skinUrl;
		this.setBlackFilter(this.imgShipIcon, false);
        this.txtShipName.text = info.shipDisplayName;

        let carState:ShopUnLockEnum = ShopMgr.instance.isShopUnLock(info.id);
        if(carState == ShopUnLockEnum.Coin)
        {
            this.btnBuy.visible = true;
            this.btnUnlock.visible = false;
            this.btnVideoGain.visible = false;
            this.imgReddot.visible = false;
            
            let shipCost = PowerUpMgr.getShopPirceWithDiscountBuff(info.id);
			this.txtPrice.value = Util.moneyFormat(shipCost);

			let isEnough = MergeUserData.instance.judgeMoneyIsFull(shipCost);
			this.btnBuy.gray = !isEnough;
			this.btnBuy.mouseEnabled = isEnough;
		}
		else if(carState == ShopUnLockEnum.Locked)
		{
			this.btnBuy.visible = false;
			this.btnVideoGain.visible = false;
			this.imgReddot.visible = false;
			this.btnUnlock.visible = true;
			this.btnUnlock.mouseEnabled = false;
			if(info.id > MergeUserData.instance.iMaxLockedShipId)
			{
				this.setBlackFilter(this.imgShipIcon, true);
			}
		}
		//视频按钮
		let freeGetShipTime = MergeUserData.instance.ShopVideoGetShipTime;
		if(freeGetShipTime == 0)
		{
			let maxUnlockShipInfo = GameJsonConfig.instance.getShipInfoConfig( MergeUserData.instance.iMaxLockedShipId );
			if(maxUnlockShipInfo.bonusShip_level > 0 && info.level == maxUnlockShipInfo.bonusShip_level)
			{
				this.btnBuy.visible = false;
				this.btnUnlock.visible = false;
				//可以看视频
				this.btnVideoGain.visible = true;
				this.imgReddot.visible = true;
			}	
		}
	}
	
	private onClickItem(evt:Laya.Event):void
    {
		let clickTarget = evt.target;
		if(clickTarget == this.btnBuy)
		{
			this.onClickBuy();
		}
		else if(clickTarget == this.btnVideoGain)
		{
			this.onClickVideoGain();
		}
	}
	
	private onClickBuy():void
	{
		let shipCost = PowerUpMgr.getShopPirceWithDiscountBuff(this._shipInfoData.id); 
		let isEnough = MergeUserData.instance.judgeMoneyIsFull(shipCost);
		if(isEnough)
		{
			let cacheShipData = new CacheShipData();
			cacheShipData.init(this._shipInfoData.id, ShipBoxType.Type01);
			MergeShipMgr.instance.createBoxItem(cacheShipData, Laya.Handler.create(this, function(item:ShipItem):void
            {
                if(item != null)
                {
                    MergeUserData.instance.consumeMoney(shipCost);
					MergeUserData.instance.buyShip(this._shipInfoData.id);
					
					GameEventMgr.instance.Dispatch(GameEvent.RefreshBuyShipBtn, [PowerUpMgr.getMostCostEffectiveShipId()]);
					GameEventMgr.instance.Dispatch(GameEvent.RefreshShopShipPage);

					SoundManager.instance.playSound(MusicConfig.BuyShip, false);

					DataStatisticsMgr.instance.stat("商店购买火箭",{"等级":this._shipInfoData.level.toString()});

					PowerUpMgr.CheckNeedShowShipFreeLevelUp(item);

                }else{
					TipDialogMgr.instance.show("格子满了");
					SoundManager.instance.playSound(MusicConfig.NoCoin, false);
                }
            }));
		}
	}	
	
    private onClickVideoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.onVideoSuccess), Laya.Handler.create(this, this.adFail));
    }
    
    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }
	
	private onVideoSuccess():void
	{
		SoundManager.instance.playSound(MusicConfig.GetAward, false);
		PowerUpMgr.createVideoFreeShop(this._shipInfoData.level);
		
		MergeUserData.instance.ShopVideoGetShipTime = MergeDefine.ShopVideoGetShipTime;
		GameEventMgr.instance.Dispatch(GameEvent.RefreshShopShipPage);
		GameEventMgr.instance.Dispatch(GameEvent.RefreshShopRedPoint);//UI

		DataStatisticsMgr.instance.stat("广告视频—商店购买火箭",{"等级":this._shipInfoData.bonusShip_level.toString()});
	}
}