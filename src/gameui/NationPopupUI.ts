import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import Constants from "../model/Constants";
import UserData from "../data/UserData";
import NationConfig from "../config/NationConfig";
import NationManager from "../ctrl/NationManager";
    
export default class NationPopupUI extends ui.popup.NationPopupUI
{
    constructor() 
    { 
        super(); 
        this.init();
    }

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnNation_ClickEvent, [clickTarget]);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }

    private _curSelectNationCfg:NationConfig;

    private init():void
    {
        this.mouseThrough = true;
    }
    
    public showPage():void
    {
        this._curSelectNationCfg = NationManager.instance.nationConfig;
        this.refreshPage();
        //分享切换
        this.imgShareTag.visible = zm.share.rewardShareEnable();
        this.imgVideoTag.visible = !zm.share.rewardShareEnable();
    }

    private refreshPage():void
    {
        this.setSelectNationInfo();
        this.setNationItem();
        this.setBtn();
    }

    private setSelectNationInfo():void
    {
        this.txtSelectNationName.text = this._curSelectNationCfg.nationName;
        this.txtNationDesc.text = this._curSelectNationCfg.nationDesc;
        this.txtBonusDesc.text = this._curSelectNationCfg.extraBonusDesc;
        //
        this.imgSelectNation.skin = null;
        this.imgSelectNation.skin = this._curSelectNationCfg.icon;
    }

    private setNationItem():void
    {
        for(var i=1; i<=3; i++)
        {
            let nationCfg:NationConfig = NationConfig.getNationConfig(i);
            let nationItem:Laya.Box = this.boxPanel.getChildByName("boxNation"+i) as Laya.Box;

            let btn:Laya.Button = nationItem.getChildByName("btnNation") as Laya.Button;
            btn.skin = null;
            btn.skin = nationCfg.icon;

            let txt:Laya.Label = nationItem.getChildByName("txtNationName") as Laya.Label;
            txt.text = nationCfg.nationName;

            let img:Laya.Image = nationItem.getChildByName("imgSelected") as Laya.Image;
            img.visible = nationCfg.nationId == this._curSelectNationCfg.nationId;
        }
    }

    private setBtn():void
    {
        if(NationManager.instance.hasSelectNation == false)
        {
            this.btnChange.visible = false;
            this.btnSelected.visible = false;
            this.btnConfirm.visible = true;
        }
        else
        {
            if(this._curSelectNationCfg.nationId == NationManager.instance.nationConfig.nationId)
            {
                this.btnChange.visible = false;
                this.btnSelected.visible = true;
                this.btnConfirm.visible = false;
            }else
            {
                this.btnChange.visible = true;
                this.btnSelected.visible = false;
                this.btnConfirm.visible = false;
            }
        }
    }

    public selectNation(nationId:number):void
    {
        if(this._curSelectNationCfg.nationId == nationId)
        {
            return;
        }
        this._curSelectNationCfg = NationConfig.getNationConfig(nationId);
        this.refreshPage();
    }

    public changeNation():void
    {
        NationManager.instance.changeNation(this._curSelectNationCfg.nationId);
        this.refreshPage();
    }
}