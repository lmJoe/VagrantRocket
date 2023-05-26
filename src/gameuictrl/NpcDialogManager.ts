import { ui } from "../ui/layaMaxUI";
import NpcDialog from "../model/NpcDialog";
import GameJsonConfig from "../config/GameJsonConfig";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import { DialogType } from "../model/GameModel";
import StarPopupMgr from "./StarPopupMgr";
import ResourceConfig from "../config/ResourceConfig";
import NationManager from "../ctrl/NationManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";

/*
* npc对话管理(逻辑和弹窗);
*/
export default class NpcDialogManager
{
    constructor()
    {
        this.init();
    }

    private static _instance:NpcDialogManager;
    public static get instance():NpcDialogManager
    {
        if(!this._instance)
        {
            this._instance = new NpcDialogManager();
        }
        return this._instance;
    }

    private _ui:ui.popup.NpcDialogPopupUI;
    private _htmlDiv:Laya.HTMLDivElement;

    private _startDialogId:number;
    private _dialogConfig:NpcDialog;

    private _closeHandler:Laya.Handler;

    private init():void
    {
        this._ui = new ui.popup.NpcDialogPopupUI();

        this._htmlDiv = new Laya.HTMLDivElement();
        this._ui.boxDialog.addChild(this._htmlDiv);
        
        this.clickEnable(false);
    }

    //是否可以点击切换下一页
    private clickEnable(enbale:boolean):void
    {
        this._ui.mouseEnabled = !enbale;
        this._ui.mouseThrough = enbale;
    }

    public showNpcDialog(dialogId:number, closeHandler:Laya.Handler=null):void
    {
        this._startDialogId = dialogId;
        this._closeHandler = closeHandler;
        this.parseDialog(this._startDialogId);
    }

    public closeNpcDialog():void
    {
        this.closeDialogPopup();
        StarPopupMgr.instance.close();
        if(this._closeHandler)
        {
            this._closeHandler.run();
            this._closeHandler = null;
        }
    }

    private getConfig(dialogId:number):void
    {
        this._dialogConfig = GameJsonConfig.instance.getNpcDialogById(dialogId);
    }

    private setDialogUI():void
    {
        if(this._dialogConfig.isStar)
        {
            this._ui.imgFullScreen.skin = ResourceConfig.StarBg;
            this._ui.imgSmallScreen.skin = this._dialogConfig.tvImg;
        }else
        {
            this._ui.imgFullScreen.skin = this._dialogConfig.tvImg;
            this._ui.imgSmallScreen.skin = null;
        }
        this._ui.imgFullScreen.size(510, 310);
        this._ui.imgSmallScreen.size(280, 280);

        this._ui.imgNpcIcon.skin = this._dialogConfig.npcIconImg;
        this.updateDialogContext();

        this.resetClickEnable();
    }

    private resetClickEnable():void
    {
        //重置
        Laya.timer.clear(this, this.clickEnable);
        this.clickEnable(false);
        //延时后开放
        Laya.timer.once(300, this, this.clickEnable, [true]);
    }

    private onMaskClick():void
    {
        this.showNextDialog();
    }   

    private showNextDialog():void
    {   
        if(this._dialogConfig.hasNext == false)
        {
            this.closeNpcDialog();
            return;
        }
        this.parseDialog(this._dialogConfig.nextId);
    }

    private parseDialog(dialogId:number):void
    {
        this.getConfig(dialogId);
        if(this._dialogConfig.type == DialogType.Dialog)
        {   
            this.showDialogPopup();
        }else{
            this.closeDialogPopup();
            this.showStarPopup();
        }
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private showDialogPopup():void
    {
        if(this._ui.parent == null)
        {
            UIManager.instance.showPopup(this._ui, true, false);
            GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
            this._ui.eftTap.play(0,true);
            this._ui.eftPanel.play(0,false);
        }
        this.setDialogUI();
    }

    private closeDialogPopup():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        this._ui.eftTap.stop();
        this._ui.eftPanel.stop();
    }

    private showStarPopup():void
    {
        StarPopupMgr.instance.show(this._dialogConfig.starId, Laya.Handler.create(this, this.onStarPopupClose));
    }

    private onStarPopupClose():void
    {
        this.showNextDialog();
    }

    private updateDialogContext():void
    {
		this._htmlDiv.style.width = this._ui.txtDialog.width;
		this._htmlDiv.style.height = this._ui.txtDialog.height;
        // this._htmlDiv.style.font = "Microsoft YaHei";
        this._htmlDiv.style.family = "Microsoft YaHei";
		this._htmlDiv.style.fontSize = this._ui.txtDialog.fontSize;
		this._htmlDiv.style.leading = this._ui.txtDialog.leading;
		this._htmlDiv.style.valign = this._ui.txtDialog.valign;
		this._htmlDiv.style.color = this._ui.txtDialog.color;
        this._htmlDiv.style.wordWrap = true;
        this._htmlDiv.pos(this._ui.txtDialog.x, this._ui.txtDialog.y);
        this._ui.txtDialog.visible = false;
        
        let context:string = this._dialogConfig.dialog;
        context = context.replace("{NationName}", NationManager.instance.nationConfig.nationName);
        context = context.replace("{NationDesc}", NationManager.instance.nationConfig.nationDesc);
        this._htmlDiv.innerHTML = context;
    }
}