import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import StarInfo from "../model/StarInfo";
import GameJsonConfig from "../config/GameJsonConfig";

/*
* StarPopupMgr;
*/
export default class StarPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:StarPopupMgr;
    public static get instance():StarPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new StarPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.StarPopupUI;
    private _starId:number;
    private _closeHandler:Laya.Handler;

    private init():void
    {
        this._ui = new ui.popup.StarPopupUI();
        this._ui.mouseThrough = true;
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(starId:number, closeHandler:Laya.Handler=null):void
    {
        this._starId = starId;
        this._closeHandler = closeHandler;
        this.setStarInfo();
        UIManager.instance.showPopup(this._ui);
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }
    
    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        if(this._closeHandler)
        {
            this._closeHandler.run();
            this._closeHandler = null;
        }
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
            case this._ui.btnOK:
                this.onClickOK();
                break;
        }
    }

    private onClickOK():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }

    private setStarInfo():void
    {
        let starInfo:StarInfo = GameJsonConfig.instance.getStarInfoById(this._starId);
        //描述
        this._ui.txtStarName.text = starInfo.starName;
        this._ui.txtStarDesc.text = starInfo.starDesc;
        //图
        this._ui.imgStar.skin = starInfo.iconImg;
        this._ui.imgStar.size(280, 280);
        //相似度
        this._ui.txtSimilar.text = starInfo.similar+".00%";
        //属性
        this.setBox(this._ui.boxRadius, "半径", starInfo.radius, 0, 9999, "");
        this.setBox(this._ui.boxTemperature, "温度", starInfo.temperature, -232, 1100, "℃");
        this.setBox(this._ui.boxMass, "质量", starInfo.mass, 0, 99999, "");
        this.setBox(this._ui.boxWater, "水分", starInfo.water, 0, 100, "%");
    }

    private setBox(box:Laya.Box, title:string, value:number, min:number, max:number, valueDesc:string):void
    {
        let txtTitle:Laya.Label = box.getChildByName("txtTitle") as Laya.Label;
        txtTitle.text = title;

        let txtValue:Laya.Label = box.getChildByName("txtValue") as Laya.Label;
        txtValue.text = value+valueDesc;
        
        let bar:Laya.ProgressBar = box.getChildByName("bar") as Laya.ProgressBar;
        bar.value = Math.ceil(1000*(value-min)/(max-min))/1000;
    }
}