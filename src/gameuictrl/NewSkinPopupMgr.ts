import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SkinPopupMgr from "./SkinPopupMgr";
import SkinData from "../model/SkinData";
import { SkinType, SkinUnlockType } from "../model/GameModel";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";

/*
* NewSkinPopupMgr;
*/
export default class NewSkinPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:NewSkinPopupMgr;
    public static get instance():NewSkinPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new NewSkinPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.NewSkinPopupUI;
    private _skinData:SkinData;

    private init():void
    {
        this._ui = new ui.popup.NewSkinPopupUI();
        this._ui.mouseThrough = true;

        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(skinData:SkinData):void
    {
        this._skinData = skinData;
        
        UIManager.instance.showPopup(this._ui);
        this.setPage();
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        this._ui.aniBgEft.stop();
    }

    private setPage():void
    {
        this._ui.imgSkin.skin = null;
        this._ui.imgSkin.skin = this._skinData.getDisplaySkin();
        if(this._skinData.skinType == SkinType.Special)
        {
            this._ui.imgSkin.size(400, 400);
        }else{
            this._ui.imgSkin.size(256, 256);
        }
        this._ui.imgSkin.centerX = 0;
        this._ui.imgSkin.centerY = -60;

        this._ui.txtSkinName.text = this._skinData.skinName;

        switch(this._skinData.unlockType)
        {
            case SkinUnlockType.ShipLevel:
                this._ui.txtSkinCondition.text = "火箭等级达到"+this._skinData.unlockValue+"级解锁";
                break;
            case SkinUnlockType.Sign:
                this._ui.txtSkinCondition.text = "签到解锁";
                break;
            case SkinUnlockType.SolarIndex:
            case SkinUnlockType.SolarNum:
                this._ui.txtSkinCondition.text = "抵达新星系解锁";
                break;
        }

        this._ui.aniBgEft.play(0,true);
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
            case this._ui.btnOpenSkin:
                this.onClickBtnOpenSkin();
                break;
        }
    }

    private onClickBtnOpenSkin():void
    {
        SkinPopupMgr.instance.show(this._skinData);
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }
}