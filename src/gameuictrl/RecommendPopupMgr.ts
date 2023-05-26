import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import GameSave from "../data/GameSave";
import Util from "../utils/Util";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";

/*
* RecommendPopupMgr;
*/
export default class RecommendPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:RecommendPopupMgr;
    public static get instance():RecommendPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new RecommendPopupMgr();
        }
        return this._instance;
    }

    private static readonly DailyKey:string = "RecommendDailyKey";

    private _ui:ui.popup.RecommendPopupUI;
    private _closeHandler:Laya.Handler;

    private init():void
    {
        this._ui = new ui.popup.RecommendPopupUI();
        this._ui.mouseThrough = true;
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(closeHandler:Laya.Handler=null):void
    {
        this._closeHandler = closeHandler;
        this.setPage();
        UIManager.instance.showPopup(this._ui);
        // zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Recommend);
        zm.ad.setAdCustomData(
            {pos:{x:0, y:200}, newVersion:true},
            {            
                pos: {x:0, y:0},
                verticalCon: this._ui.boxCon,
                guessType: 1,
                containerWidth: this._ui.boxCon.width,
                containerHeight: this._ui.boxCon.height,
                itemWidth: 140,
                itemHeight: 140,
                spaceY: 20,
                scrollType: 0,
                autoScroll: true,
                needBorder: false,
                needName: true,
                fontColor: "#FFFFFF"
            }
        );
        zm.ad.addAd(ZMGameConfig.AdPage_Recommend, this._ui);
        DataStatisticsMgr.instance.stat("推荐广告页面显示");
    }
    
    public close():void
    {
        this._ui.eftClose.stop();
        UIManager.instance.removePopup(this._ui);
        Laya.timer.clear(this, this.showBtn);
        if(this._closeHandler)
        {
            this._closeHandler.run();
            this._closeHandler = null;
        }

        if( this._ui.imgDoSelect.visible )
        {
            DataStatisticsMgr.instance.stat("推荐广告页面—今日可见",{"操作":"勾选"});
        }else{
            DataStatisticsMgr.instance.stat("推荐广告页面—今日可见",{"操作":"不勾选"});
        }

        zm.ad.removeAd(ZMGameConfig.AdPage_Recommend);
        // zm.ad.hideBanner();
    }

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.boxSelect:
                this.onClickBtnTodaySelect();
                break;
            case this._ui.btnClose:
                this.onClickClose();
                break;
        }
    }

    private onClickClose():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
    }

    private setPage():void
    {
        this._ui.imgDoSelect.visible = this.hasSetDailyKey();

        this._ui.btnClose.visible = false;
        this._ui.eftClose.visible = false;
        Laya.timer.once(1200, this, this.showBtn);
    }
    
    private showBtn():void
    {
        this._ui.btnClose.visible = true;
        this._ui.eftClose.visible = true;
        this._ui.eftClose.play(0, false);
    }

    private onClickBtnTodaySelect():void
    {
        if( this.hasSetDailyKey() )
        {
            GameSave.clearValue(RecommendPopupMgr.DailyKey);
            this._ui.imgDoSelect.visible = false;
        }else{
            GameSave.setValue(RecommendPopupMgr.DailyKey, ""+Date.now());
            this._ui.imgDoSelect.visible = true;
        }
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }   

    public hasSetDailyKey():boolean
    {
        let valueStr:string = GameSave.getValue(RecommendPopupMgr.DailyKey);
        if(valueStr && valueStr.length > 0)
        {
            let timeMark = parseInt(valueStr);
            return Util.isToday(timeMark);
        }
        return false;
    }
}