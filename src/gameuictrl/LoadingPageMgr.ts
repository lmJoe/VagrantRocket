import LoadingPageUI from "../gameui/LoadingPageUI";
import UIManager from "../ctrl/UIManager";
import ResourceManager from "../ctrl/ResourceManager";
import GameEvent from "../event/GameEvent";
import GameEventMgr from "../event/GameEventMgr";
import ResourceConfig from "../config/ResourceConfig";

/*
* LoadingPage;
*/
export default class LoadingPageMgr
{
    constructor(){
        this.init();
    }

    private static _instance:LoadingPageMgr;
    public static get instance():LoadingPageMgr
    {
        if(!this._instance)
        {
            this._instance = new LoadingPageMgr();
        }
        return this._instance;
    }


    private _ui:LoadingPageUI;
    private _progressValue:number;
    private _d3progressValue:number;
    private _totalProgressValue:number;

    public get ui():LoadingPageUI
    {
        return this._ui;
    }

    private init():void
    {
        this._ui = new LoadingPageUI();
        this._progressValue = 0;
        this._d3progressValue = 0;
        this._totalProgressValue = 0;

        GameEventMgr.instance.addListener(GameEvent.onLoad3dResCompleted, this, this.onLoad3dResCompleted);
    }

    public show():void
    {
        UIManager.instance.showUI(this._ui);
    }

    public close():void
    {
        UIManager.instance.removeUI();
        ResourceConfig.clearLoadingRes();
    }

    public load(successHandler:Laya.Handler):void
    {
        ResourceManager.instance.loadRes( successHandler,  Laya.Handler.create(this, this.setProgress, null, false));	
    }

    public load3D(successHandler:Laya.Handler):void
    {
        ResourceManager.instance.load3DRes( successHandler,  Laya.Handler.create(this, this.set3dProgress, null, false));
        this._progressValue = 1;
        this._d3progressValue = 0;
        Laya.timer.clear(this, this.updateNormalProgress);
        Laya.timer.loop(1000*0.1, this, this.updateNormalProgress);
    }

    public setZipProgress(value:number):void
    {
        this._ui.setProgress(value, true);
    }

    private setProgress(value:number):void
    {
        this._progressValue = value;
        this.setRealProgress();
    }

    private set3dProgress(value:number):void
    {
        // console.log("set3dProgress--", value);
        // this._d3progressValue = value;
        // this.setRealProgress();
    }
    
    private setRealProgress():void
    {
        this._totalProgressValue = 0.3*this._progressValue + 0.7*(this._d3progressValue/100);
        this._ui.setProgress(this._totalProgressValue, false);
    }

    private updateNormalProgress():void
    {
        this._d3progressValue ++;
        this.setRealProgress();

        if(this._d3progressValue >= 70)
        {
            Laya.timer.clear(this, this.updateNormalProgress);
            Laya.timer.loop(1000*0.6, this, this.updateSlowProgress);
        }
    }

    private updateSlowProgress():void
    {
        this._d3progressValue ++;
        this.setRealProgress();

        if(this._d3progressValue >= 97)
        {
            Laya.timer.clear(this, this.updateSlowProgress);
            this.stopProgress();
        }
    }

    private stopProgress():void
    {
        this._d3progressValue = 97;
        this.setRealProgress();
    }

    private updateFastProgress():void
    {
        this._d3progressValue ++;
        this.setRealProgress();

        if(this._d3progressValue >= 100)
        {
            Laya.timer.clear(this, this.updateFastProgress);
            this.onLoadMovieEnd();
        }
    }

    private onLoad3dResCompleted():void
    {
        Laya.timer.clear(this, this.updateFastProgress);
        Laya.timer.loop(1000*0.02, this, this.updateFastProgress);
    }
    
    private onLoadMovieEnd():void
    {
        this._totalProgressValue = 1;
        this._ui.setProgress(this._totalProgressValue, false);

        GameEventMgr.instance.Dispatch(GameEvent.onLoadMovieEnd);
    }
}