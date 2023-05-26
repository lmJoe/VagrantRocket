import { ui } from "../ui/layaMaxUI";
import GameLayerMgr from "../scene/GameLayerMgr";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import CommentLike from "../model/CommentLike";
import Constants from "../model/Constants";
import CommentMgr from "../ctrl/CommentMgr";
import CommentLikePopupMgr from "./CommentLikePopupMgr";
import SpaceshipManager from "../ship/SpaceshipManager";
import GalaxyManager from "../galaxy/GalaxyManager";
import RobotConfig from "../config/RobotConfig";

/*
* CommentNoticeMgr;
*/
export default class CommentNoticeMgr
{
    constructor(){
        this.init();
    }

    private static _instance:CommentNoticeMgr;
    public static get instance():CommentNoticeMgr
    {
        if(!this._instance)
        {
            this._instance = new CommentNoticeMgr();
        }
        return this._instance;
    }

    private _ui:ui.view.CommentNoticePageUI;

    private _showTime:number;

    private init():void
    {
        this._ui = new ui.view.CommentNoticePageUI();
        this._ui.mouseThrough = true;

        this._showTime = 0;

        GameEventMgr.instance.addListener(GameEvent.OnMyCommentLikeNotice, this, this.onNotice);
        GameEventMgr.instance.addListener(GameEvent.OnLaunched, this, this.onLaunched);
        GameEventMgr.instance.addListener(GameEvent.OnUnlockSolarStart, this, this.onUnlockSolarStart);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }

    public show():void
    {
        //加载方式特殊
        GameLayerMgr.instance.systemLayer.addChild(this._ui);
        if(CommentMgr.instance.unSeeNum > 0)
        {
            this.onNotice(CommentMgr.instance.lastLike);
        }else{
            this.setEnable(false);
        }
    }

    public close():void
    {
        this._ui.removeSelf();
        GameLayerMgr.instance.systemLayer.removeChildren();
    }

    private onLaunched():void
    {
        this.setEnable(false);
    }

    private onUnlockSolarStart():void
    {
        this.setEnable(false);
    }

    public setEnable(enble:boolean):void
    {
        this._ui.visible = enble;
        if(enble == false)
        {
            this._showTime = 0;
        }
    }

    private onUIClick(evt:Laya.Event):void
    {
        if(evt.target == this._ui.boxNotice)
        {
            this.setEnable(false);
            CommentLikePopupMgr.instance.show();
        }
    }

    public update(delatTime:number):void
    {
        if(this._showTime > 0)
        {
            this._showTime -= delatTime;
            if(this._showTime <= 0)
            {
                this.hide();
            }
        }
    }

    private onNotice(commentLike:CommentLike):void
    {
        //火箭飞行中 不显示
        if(Constants.AccessingSolarSystem==true && SpaceshipManager.instance.flightOnGoing)
        {
            return;
        }
        //星系解锁动画中 不显示
        if(Constants.AccessingSolarSystem==false && GalaxyManager.instance.inUnlockSolarMovie)
        {
            return;
        }

        this.setEnable(true);
        this._showTime = Constants.CommentNoticeShowTime;
        this.setPage(commentLike);
        //
        SoundManager.instance.playSound(MusicConfig.CommentLike, false);
        //
        this._ui.boxNotice.centerX = 0;
        this._ui.boxNotice.top = 120;
        this._ui.boxNotice.alpha = 1;
        this._ui.boxNotice.scale(1,1);

        this._ui.aniHide.stop();
        Laya.timer.clear(this, this.setEnable);
        this._ui.aniShow.play(0, false);
    }

    private hide():void
    {
        Laya.timer.clear(this, this.setEnable);
        this._ui.aniHide.play(0, false);

        Laya.timer.once(300, this, this.setEnable, [false]);
    }

    private setPage(commentLike:CommentLike):void
    {
        let headUrl = RobotConfig.getRobotAvatarUrl(commentLike.avatarId);
        if(headUrl){
            this._ui.imgAvatar.skin = headUrl;
        }
        this._ui.txtNotice.text = commentLike.likeMsg;
    }
}