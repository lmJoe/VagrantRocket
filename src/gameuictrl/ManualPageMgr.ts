import GameEvent from "../event/GameEvent";
import ManualPageUI from "../gameui/ManualPageUI";
import GameEventMgr from "../event/GameEventMgr";
import UIManager from "../ctrl/UIManager";
import UserData from "../data/UserData";
import { DiaryType } from "../model/GameModel";
import GalaxyPageMgr from "./GalaxyPageMgr";
import TipDialogMgr from "./TipDialogMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import WxInputHandler from "../wx/WxInputHandler";
import CommentLikePopupMgr from "./CommentLikePopupMgr";
import WxHandler from "../wx/WxHandler";
import SolarManager from "../solar/SolarManager";
import CommentMgr from "../ctrl/CommentMgr";
import WxUserInfo from "../wx/WxUserInfo";
import CommentGuidePopupMgr from "./CommentGuidePopupMgr";
import GameSceneMgr from "../ctrl/GameSceneMgr";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* ManualPage;
*/
export default class ManualPageMgr
{
    constructor(){
        this.init();
    }

    private static _instance:ManualPageMgr;
    public static get instance():ManualPageMgr
    {
        if(!this._instance)
        {
            this._instance = new ManualPageMgr();
        }
        return this._instance;
    }

    private _ui:ManualPageUI;
    private _showDiscoverIdx:number;

    private init():void
    {
        this._ui = new ManualPageUI();
        GameEventMgr.instance.addListener(GameEvent.onManual_ClickEvent, this, this.onManualClick);
        GameEventMgr.instance.addListener(GameEvent.OnMyCommentLikeNumUpdate, this, this.onCommentLikeNumUpdate);
    }

    public show(discoverIdx:number=-1):void
    {
        UIManager.instance.showUI(this._ui);
        this._ui.createWxUseInfoBtn();

        GameEventMgr.instance.Dispatch(GameEvent.GalaxyUIEnable, [false]);

        if(discoverIdx == -1)
        {
            this._showDiscoverIdx = UserData.instance.curDiscoverIndex;
        }else{
            this._showDiscoverIdx = discoverIdx;
        }
        this.initPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Diary);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Diary, this._ui);
        BannerAdCustomManager.instance.show();

        this.setInputCallback();
    }

    public close():void
    {
        this._ui.showWxUserInfoBtn(false);
        UIManager.instance.removeUI();
        GameEventMgr.instance.Dispatch(GameEvent.GalaxyUIEnable, [true]);

        zm.ad.removeAd(ZMGameConfig.AdPage_Diary);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private initPage():void
    {
        this._ui.setPage(DiaryType.Galaxy, this._showDiscoverIdx);
    }

    private onCommentLikeNumUpdate(num:number):void
    {
        this._ui.setCommentReddot();
    }

    private onManualClick(clkTarget):void
    {
        switch(clkTarget)
        {
            case this._ui.btnBack:
                this.onClickBack();
                break;
            case this._ui.btnLeft:
                this.onClickBtnLeft();
                break;
            case this._ui.btnRight:
                this.onClickBtnRight();
                break;
            case this._ui.btnTabGalaxy:
                this.showGalaxy();
                break;
            case this._ui.btnTabManual:
                this.showManual();
                break;
            case this._ui.btnInput:
            case this._ui.imgCommentBg:
                this.onClickInput();
                break;
            case this._ui.btnHorn:
                this.onClickHorn();
                break;
        }
    }

    private onClickHorn():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        CommentLikePopupMgr.instance.show();
    }

    private onClickBack():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        this.close();
        GalaxyPageMgr.instance.show();

        // if(CommentMgr.instance.hasComment || CommentGuidePopupMgr.instance.getHasShow)
        // {
        //     this.close();
        //     GalaxyPageMgr.instance.show();
        // }else{
        //     CommentGuidePopupMgr.instance.show(Laya.Handler.create(this, this.inputGuide), Laya.Handler.create(this, this.backHome));
        // }
    }

    private backHome():void
    {
        this.close();
        GameSceneMgr.instance.gotoSolar();
    }

    private inputGuide():void
    {
        this.showGalaxy();
        this.onClickInput();
    }

    private onClickInput():void
    {
        TipDialogMgr.instance.show("留言窗口暂时被前100名到访者占领！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
        return;

        // if(WxHandler.isWx && WxUserInfo.instance.hasUserInfo() == false)
        // {
        //     TipDialogMgr.instance.show("请点击 <留言> 按钮，进行留言！");
        //     SoundManager.instance.playSound(MusicConfig.NoCoin, false);
        //     return;
        // }

        // let solarData = SolarManager.instance.getSolarDataByDiscoverIndex(this._ui.curShowSolarDiscoverIndex);
        // if(CommentMgr.instance.checkSolarHasBeenComment(solarData.index) == true)
        // {
        //     TipDialogMgr.instance.show("您已留过言啦！快去下一星系吧");
        //     SoundManager.instance.playSound(MusicConfig.NoCoin, false);
        //     return;
        // }

        // DataStatisticsMgr.instance.stat("点击评论");
        // SoundManager.instance.playSound(MusicConfig.Click, false);

        // if(WxHandler.isWx)
        // {
        //     WxInputHandler.instance.showKeyboard();
        //     GameEventMgr.instance.removeListener(GameEvent.InputConfirm, this, this.onInputConfirm);
        //     GameEventMgr.instance.addListener(GameEvent.InputConfirm, this, this.onInputConfirm);
        // }else{
        //     let ran = Math.floor(Math.random() * 100);
        //     this.onInputConfirm("web 测试留言！"+ran);
        // }

        // this.setInputCallback();
    }

    private onInputConfirm(msg:string):void
    {
        // DataStatisticsMgr.instance.stat("留言成功",{"内容":msg});
        // TipDialogMgr.instance.show("留言成功！");

        // this._ui.onInputConfirm(msg);
        this.msgCheck(msg);
    }

    private msgCheck(msg:string):void
    {
        zm.api.msgSecCheck(msg, Laya.Handler.create(this, function(res):void
        {   

            console.log("msg check suc", res);
            DataStatisticsMgr.instance.stat("留言成功",{"内容":msg});
            TipDialogMgr.instance.show("留言成功！");
            SoundManager.instance.playSound(MusicConfig.GetAward, false);

            this._ui.onInputConfirm(msg);

        }), Laya.Handler.create(this, function(res):void
        {

            console.log("msg check fail", res);
            TipDialogMgr.instance.show("内容包含敏感词汇，请重新输入！");
            SoundManager.instance.playSound(MusicConfig.NoCoin, false);

        }));
    }

    private showGalaxy():void
    {
        this._ui.changeTab(DiaryType.Galaxy);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private showManual():void
    {
        this._ui.changeTab(DiaryType.Manual);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickBtnLeft():void
    {
        this._ui.prevSolar();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private onClickBtnRight():void
    {
        this._ui.nextSolar();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private setInputCallback():void
    {
        if(WxHandler.isWx && WxUserInfo.instance.hasUserInfo() == false)
        {
            WxUserInfo.instance.setUserInfoSuccess(Laya.Handler.create(this, this.onClickInput));
        }
    }

}