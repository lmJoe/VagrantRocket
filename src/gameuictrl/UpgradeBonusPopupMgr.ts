import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import MergeUserData from "../merge/data/MergeUserData";
import MergeDefine from "../merge/data/MergeDefine";
import GameSave from "../data/GameSave";
import Util from "../utils/Util";
import { BonusGainType } from "../model/GameModel";
import VideoAd from "../wx/VideoAd";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import TipDialogMgr from "./TipDialogMgr";
import ZMGameConfig from "../ZMGameConfig";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import { ShipBoxType } from "../merge/data/MergeModel";
import WxAdConfig from "../wx/WxAdConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* UpgradeBonusPopupMgr;
*/
export default class UpgradeBonusPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:UpgradeBonusPopupMgr;
    public static get instance():UpgradeBonusPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new UpgradeBonusPopupMgr();
        }
        return this._instance;
    }

    private static DailyKey:string = "UpgradeBonusDailyKey";

    private _ui:ui.popup.UpgradeBonusPopupUI;
    private _bonusGainType:BonusGainType;
    private _bonusShipId:number;
    private _closeHandler:Laya.Handler;

    private init():void
    {
        this._ui = new ui.popup.UpgradeBonusPopupUI();
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
        this.setBgEft(false);
    }

    private setBgEft(enable:boolean):void
    {
        if(enable)
        {
            this._ui.imgLight.rotation = 0;
            this._ui.eftLight.visible = true;
            this._ui.imgLight.visible = true;
            this._ui.eftLight.play(0, true);
        }else{
            this._ui.eftLight.visible = false;
            this._ui.imgLight.visible = false;
            this._ui.eftLight.stop();
        }
    }
    
    public show(closeHandler:Laya.Handler=null):void
    {
        this._closeHandler = closeHandler;

        UIManager.instance.showPopup(this._ui);
        
        this.setPage();
        this.setBgEft(true);
        GameSave.setValue(UpgradeBonusPopupMgr.DailyKey, ""+Date.now());

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_UpgradeBonus);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_UpgradeBonus, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        this.setBgEft(false);
        UIManager.instance.removePopup(this._ui);

        if(this._closeHandler)
        {
            this._closeHandler.run();
            this._closeHandler = null;
        }

        zm.ad.removeAd(ZMGameConfig.AdPage_UpgradeBonus);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnBack:
                this.onClickBack();
                break;
            case this._ui.btnGain:
                this.onClickVideoGain();
                break;
        }
    }

    private setPage():void
    {
        let shipLevel:number = MergeUserData.instance.iMaxLockedShipId;
        this._ui.txtLevel.value = ""+shipLevel;

        // this._bonusShipId = PowerUpMgr.getFreeDropShipId(true)+1;
        //奖励火箭等级为 当前等级-4
        this._bonusShipId = shipLevel - 4;
        this._ui.txtBonusInfo.text = MergeDefine.UpgradeBonusNum+"架"+this._bonusShipId+"级";
        //领取按钮
        this.setBtn();
        //隐藏返回按钮
        this._ui.btnBack.visible = false;
        Laya.timer.once(1500, this, this.showBtn);
    }
    
    private showBtn():void
    {
        this._ui.btnBack.visible = true;
    }

    private setBtn():void
    {
        this._bonusGainType = this.getBonusState();
        let imgVideoTag:Laya.Image = this._ui.btnGain.getChildByName("imgVideoTag") as Laya.Image;
        let imgShareTag:Laya.Image = this._ui.btnGain.getChildByName("imgShareTag") as Laya.Image;
        imgVideoTag.visible = this._bonusGainType == BonusGainType.Video;
        imgShareTag.visible = this._bonusGainType == BonusGainType.Share;
    }

    private getBonusState():BonusGainType
    {
        if( this.hasSetDailyKey() )
        {
            return BonusGainType.Video;
        }else{
            //始终是视频
            return BonusGainType.Video;

            // if(zm.share.rewardShareEnable())
            // {
            //     return BonusGainType.Share;
            // }else{
            //     return BonusGainType.Video;
            // }
        }
    }

    private hasSetDailyKey():boolean
    {
        let valueStr:string = GameSave.getValue(UpgradeBonusPopupMgr.DailyKey);
        if(valueStr && valueStr.length > 0)
        {
            let timeMark = parseInt(valueStr);
            return Util.isToday(timeMark);
        }
        return false;
    }

    private onClickBack():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }

    private onClickVideoGain():void
    {
        if(this._bonusGainType == BonusGainType.Share)
        {
            this.shareGain();
        }else{
            this.videoGain();
        }
    }

    private videoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }
    
    private adSuccess():void
    {
        DataStatisticsMgr.instance.stat("广告视频—升级礼包");
        this.gainBonus();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private shareGain():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        zm.share.shareMessage(ZMGameConfig.UpgradeBonusShareTag, null, Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享成功—升级礼包");
            this.gainBonus();

        }),Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享失败—升级礼包");

        }));
    }

    private gainBonus():void
    {
        PowerUpMgr.createMultiCacheShipBox(this._bonusShipId, MergeDefine.UpgradeBonusNum, ShipBoxType.Type02);

        SoundManager.instance.playSound(MusicConfig.GetAward, false);
        this.close();
    }
}