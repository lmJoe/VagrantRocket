import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import SignBonusConfig from "../config/SignBonusConfig";
import SignManager from "../ctrl/SignManager";
import { SignBonusType } from "../model/GameModel";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import MergeDefine from "../merge/data/MergeDefine";
import Util from "../utils/Util";

/*
* SignBonusPopupMgr;
*/
export default class SignBonusPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SignBonusPopupMgr;
    public static get instance():SignBonusPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SignBonusPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.SignBonusPopupUI;
    private _signBonusConfig:SignBonusConfig;

    private init():void
    {
        this._ui = new ui.popup.SignBonusPopupUI();
        this._ui.mouseThrough = true;

        this.setBgEft(false);
    }

    private setBgEft(enable:boolean):void
    {
        if(enable)
        {
            this._ui.imgLight.rotation = 0;
            this._ui.eftBg.visible = true;
            this._ui.imgLight.visible = true;
            this._ui.eftBg.play(0, true);
        }else{
            this._ui.eftBg.visible = false;
            this._ui.imgLight.visible = false;
            this._ui.eftBg.stop();
        }
    }
    
    public show(signBonusConfig:SignBonusConfig):void
    {
        UIManager.instance.showPopup(this._ui);
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
        
        this._signBonusConfig = signBonusConfig;
        this.setPage();
        this.setBgEft(true);
        
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }

    public close():void
    {
        this.setBgEft(false);
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        if(this._signBonusConfig)
        {
            SignManager.instance.getSignBonus(this._signBonusConfig);
        }
        this._signBonusConfig = null;
    }

    private setPage():void
    {
        this._ui.imgBonus.skin = "imgRes2/sign/imgBonus"+this._signBonusConfig.day+".png";
        this._ui.txtBonusName.text = this._signBonusConfig.bonusName;
        if(this._signBonusConfig.bonusType == SignBonusType.Coin)
        {
            let bonusShipId:number = PowerUpMgr.getFreeDropShipId(true);
            bonusShipId = Math.min(MergeDefine.MaxShipLevel, bonusShipId+this._signBonusConfig.bonusValue);
            let bonusCoin:number = PowerUpMgr.getShopPirceWithDiscountBuff(bonusShipId);
            this._ui.txtBonusDesc.text = this._signBonusConfig.bonusDesc+Util.moneyFormat(bonusCoin);
        }else
        {
            this._ui.txtBonusDesc.text = this._signBonusConfig.bonusDesc;
        }
    }

    private onMaskClick():void
    {
        this.close();
    }
}