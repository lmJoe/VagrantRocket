import SettingPopupUI from "../gameui/SettingPopupUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* SettingPopupMgr;
*/
export default class SettingPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SettingPopupMgr;
    public static get instance():SettingPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SettingPopupMgr();
        }
        return this._instance;
    }

    private _ui:SettingPopupUI;

    public get ui():SettingPopupUI
    {
        return this._ui;
    }

    private init():void
    {
        this._ui = new SettingPopupUI();

        GameEventMgr.instance.addListener(GameEvent.OnSetting_ClickEvent, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        
        zm.ad.addAd(ZMGameConfig.AdPage_Setting, this._ui);
        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Setting);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_Setting);
        zm.ad.hideBanner();
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
            case this._ui.btnMusicOff:
            case this._ui.btnMusicOn:
                this._ui.clickMusic();
                SoundManager.instance.playSound(MusicConfig.Click, false);
                break;
            case this._ui.btnSoundOff:
            case this._ui.btnSoundOn:
                this._ui.clickSound();
                SoundManager.instance.playSound(MusicConfig.Click, false);
                break;
            case this._ui.btnVibrateOff:
            case this._ui.btnVibrateOn:
                this._ui.clickVibrate();
                SoundManager.instance.playSound(MusicConfig.Click, false);
                break;
            case this._ui.btnKefu:
                break;
        }
    }
}