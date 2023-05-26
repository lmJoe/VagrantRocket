import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SignPopupUI from "../gameui/SignPopupUI";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import SignManager from "../ctrl/SignManager";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* SignPopupMgr;
*/
export default class SignPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SignPopupMgr;
    public static get instance():SignPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SignPopupMgr();
        }
        return this._instance;
    }

    private _ui:SignPopupUI;

    private init():void
    {
        this._ui = new SignPopupUI();

        GameEventMgr.instance.addListener(GameEvent.OnSign_ClickEvent, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        this._ui.showPage();
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        SignManager.instance.setTodayHasShow();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Sign);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Sign, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        zm.ad.removeAd(ZMGameConfig.AdPage_Sign);
        zm.ad.hideBanner();

        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        BannerAdCustomManager.instance.hide();
    }

    private onMaskClick():void
    {
        this.close();
    }

    private onUIClick(clkTarget):void
    {
        switch(clkTarget)
        {
            case this._ui.btnGain:
                this.onClickGain();
                break;
        }
    }

    private onClickGain():void
    {
        this._ui.trySign();
        this.close();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
}