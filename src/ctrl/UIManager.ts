import GameLayerMgr from "../scene/GameLayerMgr";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import { PopupEftType } from "../model/GameModel";

/*
* UI控制;
*/
export default class UIManager{
    constructor(){
    }

    private static _instance:UIManager;
    public static get instance():UIManager
    {
        if(!this._instance)
        {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    //同时只能有一个ui，叠加弹窗是popup
    private _ui:Laya.View;
    private _popupList:Array<Laya.View>;

    private _mask:Laya.View;

    public start():void
    {
        this._ui = null;
        this._popupList = [];

        this.creatMask();
    }
    
    private creatMask():void
    {
        this._mask = new Laya.View();
        this._mask.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        this._mask.graphics.drawRect(-5, -5, GameLayerMgr.StageWidth+10, GameLayerMgr.StageHeight+10, "#000000");
        this._mask.alpha = 0.85;

        this._mask.mouseEnabled = true;
        this._mask.mouseThrough = false;

        this._mask.on(Laya.Event.CLICK, this, this.onClickMask);
    }

    private onClickMask():void
    {
        console.log("点击uimask");
        GameEventMgr.instance.Dispatch(GameEvent.OnPopupMaskClick);
    }

    private updateMask():void
    {
        this._mask.removeSelf();
        if(this._popupList.length > 0)
        {
            let lastPopIndex = GameLayerMgr.instance.uiLayer.getChildIndex( this._popupList[this._popupList.length-1] );
            if(lastPopIndex >= 0)
            {
                GameLayerMgr.instance.uiLayer.addChildAt(this._mask, lastPopIndex);
            }
        }
    }

    public showUI(ui:Laya.View):void
    {
        this.removeUI();
        this._ui = ui;
        this._ui.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        GameLayerMgr.instance.uiLayer.addChild(this._ui);
    }

    public removeUI():void
    {
        if(this._ui)
        {   
            this._ui.removeSelf();
            this._ui = null;
        }
    }

    public showPopup(popup:Laya.View, needMask:boolean=true, needEffect:boolean=true, popupEftType:PopupEftType=PopupEftType.Normal):void
    {
        popup.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        //动画
        GameLayerMgr.instance.uiLayer.addChild(popup);
        this._popupList.push(popup);
        //加mask
        if(needMask)
        {
            this.updateMask();
        }
        //动效
        popup.scale(1, 1);
        popup.pos(0, 0);
        if( needEffect )
        {
            if(popupEftType == PopupEftType.Normal)
            {
                Laya.Tween.from(popup, {x:GameLayerMgr.StageWidth/2, y:GameLayerMgr.StageHeight/2, scaleX:0, scaleY:0}, 300, Laya.Ease.backOut, Laya.Handler.create(this, function():void
                {
                    Laya.Tween.clearTween(popup);
                }), 0, false, true);
            }
            else if(popupEftType == PopupEftType.Dialog)
            {
                Laya.Tween.from(popup, {x:GameLayerMgr.StageWidth/2, y:GameLayerMgr.StageHeight/2, scaleX:0, scaleY:0}, 300, Laya.Ease.sineInOut, Laya.Handler.create(this, function():void
                {
                    Laya.Tween.clearTween(popup);
                }), 0, false, true);
            }
        }
    }

    public removePopup(popup:Laya.View):void
    {
        GameLayerMgr.instance.uiLayer.removeChild(popup);
        for(var i=this._popupList.length-1; i>=0; i--)
        {
            if(this._popupList[i] == popup)
            {
                this._popupList.splice(i,1);
                break;
            }
        }
        this.updateMask();

        Laya.Tween.clearTween(popup);
        popup.scale(1, 1);
        //当前无弹窗
        if(this._popupList && this._popupList.length == 0)
        {
            GameEventMgr.instance.Dispatch(GameEvent.OnRemoveAllPopup);
        }
    }

    public get hasPopup():boolean
    {
        return this._popupList.length > 0;
    }

}