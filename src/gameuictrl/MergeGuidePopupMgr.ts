import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import { MergeGuideType } from "../model/GameModel";
import MergeGuideManager from "../merge/ctrl/MergeGuideManager";

/*
* MergeGuidePopupMgr;
*/
export default class MergeGuidePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:MergeGuidePopupMgr;
    public static get instance():MergeGuidePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new MergeGuidePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.MergeGuidePopupUI;

    private _mergeGuideStep:MergeGuideType;

    private init():void
    {
        this._ui = new ui.popup.MergeGuidePopupUI();
        this._ui.mouseThrough = true;
        this._ui.boxGuide_3.mouseEnabled = true;
        this._ui.boxGuide_3.mouseThrough = true;

        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(mergeGuideStep:MergeGuideType):void
    {
        this._mergeGuideStep = mergeGuideStep;
        if(this._mergeGuideStep == MergeGuideType.MergeShip)
        {
            UIManager.instance.showPopup(this._ui, false);
        }else{
            UIManager.instance.showPopup(this._ui);
        }
        this.setPage();
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);
    }

    private setPage():void
    {
        this.hideAll();
        switch(this._mergeGuideStep)
        {
            case MergeGuideType.StartGame:
                this._ui.boxGuide_0.visible = true;
                this._ui.aniGuide_0.visible = true;
                this._ui.aniGuide_0.play();
                break;
            case MergeGuideType.BuyShip:
                this._ui.boxGuide_1.visible = true;
                this._ui.aniGuide_1.visible = true;
                this._ui.aniGuide_1.play();
                break;
            case MergeGuideType.MergeShip:
                this._ui.boxGuide_2.visible = true;
                this._ui.aniGuide_2.visible = true;
                this._ui.aniGuide_2.play();
                this.setGuide2();
                break;
            case MergeGuideType.EndGuide:
                this._ui.boxGuide_3.visible = true;
                break;
        }
    }

    private hideAll():void
    {
        this._ui.boxGuide_0.visible = false;
        this._ui.boxGuide_1.visible = false;
        this._ui.boxGuide_2.visible = false;
        this._ui.boxGuide_3.visible = false;

        this._ui.aniGuide_0.stop();
        this._ui.aniGuide_0.visible = false;
        this._ui.aniGuide_1.stop();
        this._ui.aniGuide_1.visible = false;
        this._ui.aniGuide_2.stop();
        this._ui.aniGuide_2.visible = false;
    }

    private setGuide2():void
    {
        this._ui.imgTop.height = Laya.stage.height - this._ui.boxJust.y - 25;
        this._ui.imgTop.width = Laya.stage.width;
        this._ui.imgTop.centerX = 0;
        this._ui.imgTop.top = 0;

        this._ui.imgBottom.height = Laya.stage.height - (Laya.stage.height-this._ui.boxJust.y) - 135 + 25;
        this._ui.imgBottom.width = Laya.stage.width;
        this._ui.imgBottom.centerX = 0;
        this._ui.imgBottom.bottom = 0;
    }

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnFly:
                this.onClickBtnFly();
                break;
            case this._ui.btnBuy:
                this.onClickBtnBuy();
                break;
            case this._ui.btnEndGuide:
                this.onClickBtnEndGuide();
                break;
        }
    }

    private onClickBtnFly():void
    {
        this.close();
        MergeGuideManager.instance.mergeStepFinish();
        GameEventMgr.instance.Dispatch(GameEvent.MergeGuideFinish, [MergeGuideType.StartGame]);
    }
    
    private onClickBtnBuy():void
    {
        this.close();
        MergeGuideManager.instance.mergeStepFinish();
        GameEventMgr.instance.Dispatch(GameEvent.MergeGuideFinish, [MergeGuideType.BuyShip]);
    }

    private onClickBtnEndGuide():void
    {
        this.close();
        MergeGuideManager.instance.mergeStepFinish();
        GameEventMgr.instance.Dispatch(GameEvent.MergeGuideFinish, [MergeGuideType.EndGuide]);
    }
}