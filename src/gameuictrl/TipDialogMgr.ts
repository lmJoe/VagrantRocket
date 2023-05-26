import { ui } from "./../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameLayerMgr from "../scene/GameLayerMgr";

/*
* TipDialogMgr;
*/
export default class TipDialogMgr
{
    constructor(){
        this.init();
    }

    private static _instance:TipDialogMgr;
    public static get instance():TipDialogMgr
    {
        if(!this._instance)
        {
            this._instance = new TipDialogMgr();
        }
        return this._instance;
    }

    private _ui:ui.component.TipDialogUI;

    private init():void
    {
        this._ui = new ui.component.TipDialogUI();
        // this._ui.boxBg.graphics.clear();
        // this._ui.boxBg.graphics.drawRect(0,0,this._ui.width,this._ui.height,"#000000");
        // this._ui.boxBg.alpha = 0.9;
    }

    public show(msg:string):void
    {
        this.setMsg(msg);
        //加载方式特殊
        GameLayerMgr.instance.systemLayer.addChild(this._ui);
        this._ui.centerX = 0;
        this._ui.centerY = 0;
        this._ui.boxDialog.alpha = 1;
        this._ui.boxDialog.scale(1,1);

        Laya.timer.clear(this, this.hide);

        this._ui.aniShow.play(0, false);
        Laya.timer.once(1500, this, this.hide);
    }

    private setMsg(msg:string):void
    {
        this._ui.alpha = 1;
        this._ui.visible = true;
        this._ui.txtTips.text = msg;

        if(msg == "金币不足")
        {
            this._ui.txtTips.visible = false;
            this._ui.imgNoCoin.visible = true;
        }else
        {
            this._ui.txtTips.visible = true;
            this._ui.imgNoCoin.visible = false;
        }
    }

    private hide():void
    {
        Laya.timer.clear(this, this.close);

        this._ui.aniHide.play(0, false);
        Laya.timer.once(500, this, this.close);
    }
    
    public close():void
    {
        this._ui.removeSelf();
    }
}