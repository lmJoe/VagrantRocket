import UIManager from "../ctrl/UIManager";
import GalaxyPageUI from "../gameui/GalaxyPageUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GameSceneMgr from "../ctrl/GameSceneMgr";
import ManualPageMgr from "./ManualPageMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import CommentMgr from "../ctrl/CommentMgr";

/*
* GalaxyPage;
*/
export default class GalaxyPageMgr
{
    constructor(){
        this.init();
    }

    private static _instance:GalaxyPageMgr;
    public static get instance():GalaxyPageMgr
    {
        if(!this._instance)
        {
            this._instance = new GalaxyPageMgr();
        }
        return this._instance;
    }

    private _ui:GalaxyPageUI;

    private init():void
    {
        this._ui = new GalaxyPageUI();
        GameEventMgr.instance.addListener(GameEvent.OnGalaxy_ClickEvent, this, this.onGalaxyClick);
        GameEventMgr.instance.addListener(GameEvent.OnMyCommentLikeNumUpdate, this, this.onCommentLikeNumUpdate);
    }

    public show():void
    {
        UIManager.instance.showUI(this._ui);
        this.setUIEnable(true);
        this.setNoticeEnable(false);
        this._ui.setCommentReddot();
    }

    public close():void
    {
        UIManager.instance.removeUI();
    }

    public setUIEnable(enable:boolean):void
    {
        this._ui.setUIEnable(enable);
    }

    public setNoticeEnable(enable:boolean):void
    {
        this._ui.showNotice(enable);
    }

    private onGalaxyClick(clkTarget):void
    {
        switch(clkTarget)
        {
            // case this._ui.btnExplore:
            //     this.onClickExplore();
            //     break;
            case this._ui.btnBack:
                this.onClickBack();
                break;
            case this._ui.btnDiary:
                this.onClickDiary();
                break;
        }
    }

    // private onClickExplore():void
    // {
    //     GalaxyManager.instance.exploreNewSolar();
    // }   

    private onClickBack():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        GameSceneMgr.instance.gotoSolar();
    }

    private onClickDiary():void
    {
        ManualPageMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onCommentLikeNumUpdate(num:number):void
    {
        this._ui.setCommentReddot();
    }

}