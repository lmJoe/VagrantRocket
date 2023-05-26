import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import GameSave from "../data/GameSave";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";

/*
* CommentGuidePopupMgr;
*/
export default class CommentGuidePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:CommentGuidePopupMgr;
    public static get instance():CommentGuidePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new CommentGuidePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.CommentGuidePopupUI;
    private _commentHandler:Laya.Handler;
    private _backHomeHandler:Laya.Handler;

    private init():void
    {
        this._ui = new ui.popup.CommentGuidePopupUI();
        this._ui.mouseThrough = true;

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(commentHandler:Laya.Handler, backHomeHandler:Laya.Handler):void
    {
        UIManager.instance.showPopup(this._ui);
        this.saveHasShow();

        this._commentHandler = commentHandler;
        this._backHomeHandler = backHomeHandler;

        DataStatisticsMgr.instance.stat("留言-引导出现");
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);
    }

    private clearHandler():void
    {
        this._commentHandler = null;
        this._backHomeHandler = null;
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
            case this._ui.btnComment:
                this.onClickBtnComment();
                break;
            case this._ui.btnBackHome:
                this.onClickBtnBackHome();
                break;
        }
    }

    private onClickBtnComment():void
    {
        DataStatisticsMgr.instance.stat("留言-引导界面点击留言");
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();

        if(this._commentHandler)
        {
            this._commentHandler.run();
            this.clearHandler();
        }
    }

    private onClickBtnBackHome():void
    {
        DataStatisticsMgr.instance.stat("留言-引导界面点击返回");
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();

        if(this._backHomeHandler)
        {
            this._backHomeHandler.run();
            this.clearHandler();
        }
    }

    public get getHasShow():boolean
    {
        let valueStr = GameSave.getValue("CommentGuide");
        return valueStr == "yes";
    }

    private saveHasShow():void
    {
        GameSave.setValue("CommentGuide", "yes");
    }
}