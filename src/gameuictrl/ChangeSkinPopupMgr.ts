import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SkinManager from "../ctrl/SkinManager";
import { SkinType } from "../model/GameModel";
import GameSave from "../data/GameSave";
import GameJsonConfig from "../config/GameJsonConfig";
import MergeUserData from "../merge/data/MergeUserData";
import SkinData from "../model/SkinData";
import LevelColor from "../config/LevelColor";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import Util from "../utils/Util";

/*
* ChangeSkinPopupMgr;
*/
export default class ChangeSkinPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:ChangeSkinPopupMgr;
    public static get instance():ChangeSkinPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new ChangeSkinPopupMgr();
        }
        return this._instance;
    }

    private static readonly DailyKey:string = "ChangeSkinDailyKey";

    private _ui:ui.popup.ChangeSkinPopupUI;
    private _useSpecial:boolean;


    private init():void
    {
        this._ui = new ui.popup.ChangeSkinPopupUI();
        this._ui.mouseThrough = true;

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);

        this._ui.imgSpecialSkin.skin = null;
        this._ui.imgNewSkin.skin = null;
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        this.setPage();
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);

        if(this._useSpecial == true)
        {
            let specialHeadId = SkinManager.instance.getLastSpecialSkinData().headId;
            let specialColorId = SkinManager.instance.getLastSpecialColorId();
            SkinManager.instance.changeSkin(specialHeadId, specialColorId);
        }
        SkinManager.instance.clearLastSpeicalSkin();
    }

    private setPage():void
    {
        this._useSpecial = true;

        this._ui.imgDoSelect.visible = this.hasSetDailyKey();

        let specialSkinData:SkinData = SkinManager.instance.getLastSpecialSkinData();
        let specialSkin:string = specialSkinData.getDisplaySkin(SkinManager.instance.getLastSpecialColorId());
        this._ui.imgSpecialSkin.skin = specialSkin;
        this._ui.imgSpecialSkinSelect.visible = true;
        this._ui.txtSpecialSkinName.text = specialSkinData.skinName;

        let newSkinData = SkinManager.instance.getShipDefaultSkinDataByShipId(MergeUserData.instance.iMaxLockedShipId);
        let colorId:number = LevelColor.getShipColorByShipId( MergeUserData.instance.iMaxLockedShipId )-1;
        this._ui.imgNewSkin.skin = newSkinData.getDisplaySkin(colorId);
        this._ui.imgNewSkinSelect.visible = false;
        this._ui.txtNewSkinName.text = newSkinData.skinName;
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
            case this._ui.btnConfirm:
                this.onClickBtnConfirm();
                break;
            case this._ui.btnTodaySelect:
                this.onClickBtnTodaySelect();
                break;
            case this._ui.btnSpecialSkin:
                this.onClickSpecialSkin();
                break;
            case this._ui.btnNewSkin:
                this.onClickNewSkin();
                break;
        }
    }

    private onClickSpecialSkin():void
    {
        this._ui.imgSpecialSkinSelect.visible = true;
        this._ui.imgNewSkinSelect.visible = false;
        this._useSpecial = true;
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickNewSkin():void
    {
        this._ui.imgSpecialSkinSelect.visible = false;
        this._ui.imgNewSkinSelect.visible = true;
        this._useSpecial = false;
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickBtnConfirm():void
    {
        this.close();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickBtnTodaySelect():void
    {
        if( this.hasSetDailyKey() )
        {
            GameSave.clearValue(ChangeSkinPopupMgr.DailyKey);
            this._ui.imgDoSelect.visible = false;
        }else{
            GameSave.setValue(ChangeSkinPopupMgr.DailyKey, ""+Date.now());
            this._ui.imgDoSelect.visible = true;
        }
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }   

    private hasSetDailyKey():boolean
    {
        let valueStr:string = GameSave.getValue(ChangeSkinPopupMgr.DailyKey);
        if(valueStr && valueStr.length > 0)
        {
            let timeMark = parseInt(valueStr);
            return Util.isToday(timeMark);
        }
        return false;
    }

    public canShow():boolean
    {
        if(SkinManager.instance.getLastSpecialSkinData() == null)
        {
            return;
        }
        if( this.hasSetDailyKey() )
        {   
            return false;
        }
        return true;
    }
}