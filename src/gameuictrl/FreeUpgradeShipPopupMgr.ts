import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import GameJsonConfig from "../config/GameJsonConfig";
import MergeDefine from "../merge/data/MergeDefine";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import VideoAd from "../wx/VideoAd";
import TipDialogMgr from "./TipDialogMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import ShipItem from "../merge/item/ShipItem";
import MergeUserData from "../merge/data/MergeUserData";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* FreeUpgradeShipPopupMgr;
*/
export default class FreeUpgradeShipPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:FreeUpgradeShipPopupMgr;
    public static get instance():FreeUpgradeShipPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new FreeUpgradeShipPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.FreeUpgradeShipPopupUI;

    private _item:ShipItem;
    private _addLevel:number

    private init():void
    {
        this._ui = new ui.popup.FreeUpgradeShipPopupUI();

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.close);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(item:ShipItem, addLevel:number):void
    {
        UIManager.instance.showPopup(this._ui);

        this._item = item;
        this._addLevel = addLevel;

        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_LevelUp);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_LevelUp, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        MergeUserData.instance.LastFreeUpgradeTime = Date.now();
        this._ui.aniArrow.stop();
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_LevelUp);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        let oldShipInfo = GameJsonConfig.instance.getShipInfoConfig(this._item.shipId);
        this._ui.imgOldShipIcon.skin = oldShipInfo.skinUrl;
        this._ui.txtOldLevel.value = ""+oldShipInfo.level;
        let oldRocketLvData = GameJsonConfig.instance.getRokectConfigByLevel(oldShipInfo.level);
        this._ui.txtOldEffect.text = "+" + (oldRocketLvData.power*100).toFixed(0) + "%";

        let newShipInfo = GameJsonConfig.instance.getShipInfoConfig(this._item.shipId+this._addLevel);
        this._ui.imgNewShipIcon.skin = newShipInfo.skinUrl;
        this._ui.txtNewLevel.value = ""+newShipInfo.level;
        let newRocketLvData = GameJsonConfig.instance.getRokectConfigByLevel(newShipInfo.level);
        this._ui.txtNewEffect.text = "+" + (newRocketLvData.power*100).toFixed(0) + "%";

        this._ui.aniArrow.play(0, true);
    }   

    private getReward():void
	{
        this._item.upgradeShip(this._addLevel);

        let newLevel = this._item.shipId+this._addLevel;
        DataStatisticsMgr.instance.stat("广告视频-升级火箭",{"升级后等级":newLevel.toString()});
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
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
        this.close();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickVideoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }

    private adSuccess():void
    {
        this.getReward();
        this.close();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }
}