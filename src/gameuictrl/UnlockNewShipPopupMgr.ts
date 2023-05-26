import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameJsonConfig from "../config/GameJsonConfig";
import MergeUserData from "../merge/data/MergeUserData";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ZMGameConfig from "../ZMGameConfig";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* UnlockNewShipPopupMgr;
*/
export default class UnlockNewShipPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:UnlockNewShipPopupMgr;
    public static get instance():UnlockNewShipPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new UnlockNewShipPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.UnlockNewShipPopupUI;

    private init():void
    {
        this._ui = new ui.popup.UnlockNewShipPopupUI();
        this._ui.btnShare.visible = false;
        this._ui.btnGain.bottom = 280;

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        SoundManager.instance.playSound(MusicConfig.NewLevel, false);
        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Unlock);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Unlock, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        this._ui.eftBg.stop();
        UIManager.instance.removePopup(this._ui);
        
        zm.ad.removeAd(ZMGameConfig.AdPage_Unlock);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();

        GameEventMgr.instance.Dispatch(GameEvent.OnUnlockNewShipPageClose);
    }

    private setPage():void
    {
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig( MergeUserData.instance.iMaxLockedShipId );
        this._ui.imgShipIcon.skin = shipInfo.skinUrl;
        this._ui.eftBg.play(0, true);
        this._ui.txtShipName.text = shipInfo.shipDisplayName;

        let rocketLvData =MergeUserData.instance.rocketInfo;
        this._ui.txtShipEffect.text = "火箭动力提升至" + (rocketLvData.power*100).toFixed(0) + "%";

        this._ui.imgRedTag.visible = shipInfo.icon % 5 == 0
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
            case this._ui.btnGain:
                this.onClickGain();
                break;
            case this._ui.btnShare:
                this.onClickShare();
                break;
        }
    }

    private onClickGain():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }

    private onClickShare():void
    {
        zm.share.shareMessage(ZMGameConfig.UnlockShareTag, null, Laya.Handler.create(this, function():void
        {
            console.log("分享成功");
        }),Laya.Handler.create(this, function():void
        {
            console.log("分享失败");
        }));
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
}