import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import { WeakGuideType } from "../model/GameModel";
import ShipItem from "../merge/item/ShipItem";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* WeakGuidePopupMgr;
*/
export default class WeakGuidePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:WeakGuidePopupMgr;
    public static get instance():WeakGuidePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new WeakGuidePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.WeakGuidePopupUI;

    private _weakGuideType:WeakGuideType;
    private _data:any;
    private _inShow:boolean;

    private init():void
    {
        this._ui = new ui.popup.WeakGuidePopupUI();
        this._ui.mouseThrough = true;
        this._ui.mouseEnabled = false;

        this._inShow = false;

        this._ui.boxMask.size(Laya.stage.width, Laya.stage.height);
        this._ui.boxMask.graphics.drawRect(-5, -5, Laya.stage.width+10, Laya.stage.height+10, "#000000");
        this._ui.boxMask.alpha = 0;
        this._ui.boxMask.mouseEnabled = false;
        this._ui.boxMask.mouseThrough = true;

        Laya.stage.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick():void
    {
        if(this._inShow)
        {
            GameEventMgr.instance.Dispatch(GameEvent.OnWeakGuideClickClose);
        }
    }

    public show(type:WeakGuideType, data?:any):void
    {
        this._weakGuideType = type;
        this._data = data;
        this._inShow = true;

        UIManager.instance.showPopup(this._ui, false);
        this.setPage();
    }

    public close():void
    {
        this.hideAll();
        this._inShow = false;
        UIManager.instance.removePopup(this._ui);
    }

    private setPage():void
    {
        this.hideAll();
        switch(this._weakGuideType)
        {
            case WeakGuideType.Fly:
                this._ui.boxGuide_0.visible = true;
                this._ui.aniGuide_0.visible = true;
                this._ui.aniGuide_0.play();
                break;
            case WeakGuideType.Buy:
                this._ui.boxGuide_1.visible = true;
                this._ui.aniGuide_1.visible = true;
                this._ui.aniGuide_1.play();
                break;
            case WeakGuideType.Merge:
                this._ui.boxGuide_2.visible = true;
                this.setGuide2();
                break;
        }
    }

    private hideAll():void
    {
        this._ui.boxGuide_0.visible = false;
        this._ui.boxGuide_1.visible = false;
        this._ui.boxGuide_2.visible = false;

        this._ui.aniGuide_0.stop();
        this._ui.aniGuide_0.visible = false;
        this._ui.aniGuide_1.stop();
        this._ui.aniGuide_1.visible = false;
        Laya.Tween.clearTween(this._ui.imgHand);
    }

    private setGuide2():void
    {   
        let fromItem:ShipItem = this._data.List[0];
        let toItem:ShipItem = this._data.List[1];
        this.moveHand(fromItem.x+0.5*fromItem.width, fromItem.y+0.5*fromItem.width, toItem.x+0.5*toItem.width, toItem.y+0.5*toItem.width);
    }
    
    private moveHand(fromX:number, fromY:number, toX:number, toY:number):void
    {
        this._ui.imgHand.pos(fromX, fromY);
        Laya.Tween.to(this._ui.imgHand, {x:toX, y:toY}, 1500, Laya.Ease.linearNone, Laya.Handler.create(this, function()
        {

            Laya.Tween.clearTween(this._ui.imgHand);
            this.moveHand(fromX, fromY, toX, toY);

        }));
    }
}