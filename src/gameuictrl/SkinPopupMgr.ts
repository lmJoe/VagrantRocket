import UIManager from "../ctrl/UIManager";
import GameEvent from "../event/GameEvent";
import GameEventMgr from "../event/GameEventMgr";
import SkinPopupUI from "../gameui/SkinPopupUI";
import { SkinType } from "../model/GameModel";
import Util from "../utils/Util";
import SkinData from "../model/SkinData";
import MergeUserData from "../merge/data/MergeUserData";
import TipDialogMgr from "./TipDialogMgr";
import SkinManager from "../ctrl/SkinManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* SkinPopupMgr;
*/
export default class SkinPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SkinPopupMgr;
    public static get instance():SkinPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SkinPopupMgr();
        }
        return this._instance;
    }

    private _ui:SkinPopupUI;

    private init():void
    {
        this._ui = new SkinPopupUI();

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        GameEventMgr.instance.addListener(GameEvent.OnSkin_ClickEvent, this, this.onUIClick);
        GameEventMgr.instance.addListener(GameEvent.RefreshSkinBtnReddot, this, this.refreshReddot);
    }
    
    public show(skinData:SkinData=null):void
    {
        UIManager.instance.showPopup(this._ui);
        this.setPage(skinData);
        if(SkinManager.instance.firstShowSkin == false)
        {
            SkinManager.instance.setFirstShowSkin();
        }

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Skin);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Skin, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_Skin);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage(skinData:SkinData):void
    {
        this._ui.setBg();
        this.refreshReddot();
        if(skinData)
        {
            this._ui.showSkinHead(skinData.headId);
            this._ui.showTab(skinData.skinType);
        }else{
            this._ui.showSkinHead(-1);
            this._ui.showTab(SkinType.Special);
        }
    }   

    private refreshReddot():void
    {
        this._ui.setReddot();
    }

    private onMaskClick():void
    {
        this.close();
    }

    private onUIClick(clkTarget):void
    {
        let clkName = clkTarget.name;

        if(clkName.indexOf("itemColor") != -1)
        {
            let colorIdx = Util.getNumFromStr(clkName);
            this.onClickItemColor(colorIdx);
            return;
        }

        switch(clkTarget)
        {
            case this._ui.btnBack:
                SoundManager.instance.playSound(MusicConfig.Click, false);
                this.close();
                break;
            case this._ui.btnSkinSpecial:
                this.onClickBtnSkinSpecial();
                break;
            case this._ui.btnSkinNormal:
                this.onClickBtnSkinNormal();
                break;
            case this._ui.btnUse:
                this.onClickUse();
                break;
            case this._ui.btnUnlock:
                this.onClickUnlock();
                break;
        }
    }

    private onClickBtnSkinSpecial():void
    {
        this._ui.showTab(SkinType.Special);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private onClickBtnSkinNormal():void
    {
        if(MergeUserData.instance.iMaxLockedShipId < 2)
        {
            return;
        }
        this._ui.showTab(SkinType.Normal);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickUse():void
    {
        this._ui.useSkin();
        this._ui.setGuideUse(false);
        TipDialogMgr.instance.show("成功使用新皮肤");
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickUnlock():void
    {
        this._ui.showUnlockDesc();
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }
    
    private onClickItemColor(colorIdx:number):void
    {
        this._ui.selectColor(colorIdx);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
}