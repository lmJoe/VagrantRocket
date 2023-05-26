import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import GameJsonConfig from "../config/GameJsonConfig";
import Mathf from "../utils/Mathf";
import MergeShipMgr from "../merge/ctrl/MergeShipMgr";
import FreeBonusData from "../merge/data/FreeBonusData";
import MergeUserData from "../merge/data/MergeUserData";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import MergeDefine from "../merge/data/MergeDefine";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import VideoAd from "../wx/VideoAd";
import TipDialogMgr from "./TipDialogMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* AirDropPopupMgr;
*/
export default class AirDropPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:AirDropPopupMgr;
    public static get instance():AirDropPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new AirDropPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.AirDropPopupUI;
    private _isGetReward:boolean;
    private _bonusData:FreeBonusData;

    private init():void
    {
        this._ui = new ui.popup.AirDropPopupUI();

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);

        MergeShipMgr.instance.isCanRefreshCacheData = false;
        this._isGetReward = false;
        this._bonusData = null;

        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_AirDrop);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_AirDrop, this._ui);

        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);
        
        MergeUserData.instance.FreeBonusTime = MergeDefine.FreeBonusTime;
        MergeShipMgr.instance.isCanRefreshCacheData = true;
        if(this._isGetReward)
        {
            this.getReward();
        }

        zm.ad.removeAd(ZMGameConfig.AdPage_AirDrop);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        let rewardId = this.getId();
        this._bonusData = GameJsonConfig.instance.getFreeBonusConfig(rewardId);
        this._ui.txtDesc.text = this._bonusData.desc;
        //隐藏返回按钮
        this._ui.btnBack.visible = false;
        Laya.timer.once(1500, this, this.showBtn);
    }
    
    private showBtn():void
    {
        this._ui.btnBack.visible = true;
    }

    private getId():number
    {
        let list = GameJsonConfig.instance.getFreeBonusConfigList();
        let totalWeight = 0;
        list.forEach(cfg => {
            totalWeight += cfg.weight;
        });
        let ran = Mathf.range(0, totalWeight);
        let weight = 0;
        for(var i=0; i<list.length; i++)
        {
            weight += list[i].weight;
            if(ran <= weight)
            {
                return list[i].id;
            }
        }
        return -1;
    }
    
	private getReward():void
	{
		if (this._bonusData.type == 1)
		{
            MergeUserData.instance.Money5Time += this._bonusData.time*1000;
            GameEventMgr.instance.Dispatch(GameEvent.Refresh_5_SpeedUp);
            DataStatisticsMgr.instance.stat("广告视频-领取空投",{"类型":"10倍加速"});
		}
		else
		{
            PowerUpMgr.createFreeDropShip(this._bonusData.num, true);
            DataStatisticsMgr.instance.stat("广告视频-领取空投",{"类型":"4架火箭"});
        }
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
	}

    private onMaskClick():void
    {
        this.close();
    }

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnBack:
                this.onClickBack();
                break;
            case this._ui.btnVideoGain:
                this.onClickVideoGain();
                break;
        }
    }

    private onClickBack():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }

    private onClickVideoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }
    
    private adSuccess():void
    {
        this._isGetReward = true;
        this.close();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }
}