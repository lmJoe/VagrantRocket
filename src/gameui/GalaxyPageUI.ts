import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SolarManager from "../solar/SolarManager";
import Util from "../utils/Util";
import CommentMgr from "../ctrl/CommentMgr";
import UserData from "../data/UserData";
/*
* 星际界面;
*/
export default class GalaxyPageUI extends ui.view.GalaxyPageUI
{
    constructor(){
        super();
        this.mouseThrough = true;
    }

    private static readonly NoticeNum:number = 4;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }   

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnGalaxy_ClickEvent, [clickTarget]);
    }

    public setUIEnable(enable:boolean):void
    {
        this.btnBack.visible = enable;
        this.btnDiary.visible = enable;
    }

    public showNotice(enable:boolean):void
    {
        this.hideNotice();
        if(enable)
        {
            // let solarData = SolarManager.instance.getSolarDataByDiscoverIndex(0);
            // let discoverDay = Util.getDayNum( solarData.discoverTime );
            // let today = Util.getDayNum( Date.now() );
            // this.txtDay.value = "" + (today-discoverDay+1);

            this.txtSolarNum.value = ""+UserData.instance.totalDiscoverIndex;

            this.playNoticeAni();
        }
    }

    private hideNotice():void
    {
        for(var i=0; i<GalaxyPageUI.NoticeNum; i++)
        {
            let box = this.getChildByName("boxNotice_"+i) as Laya.Box;
            box.visible = false;
        }
    }

    private _noticeCount:number;
    private _aniBox:Laya.Box;
    private playNoticeAni():void
    {
        this._noticeCount = 0;
        this._aniBox = null;

        this.playNoticeTw0();
    }

    private playNoticeTw0():void
    {
        this._aniBox = this.getChildByName("boxNotice_"+this._noticeCount) as Laya.Box;
        this._aniBox.visible = true;
        this._aniBox.alpha = 0;
        Laya.Tween.to(this._aniBox, { alpha:1 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, this.playNoticeTw1));
    }

    private playNoticeTw1(box:Laya.Box):void
    {
        this._aniBox.alpha = 1;
        Laya.Tween.to(this._aniBox, { alpha:0 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, this.onNoticeEnd), 1000);
    }

    private onNoticeEnd():void
    {
        this._noticeCount ++;
        Laya.Tween.clearTween(this._aniBox);
        this._aniBox.visible = false;
        this._aniBox = null;

        if(this._noticeCount < GalaxyPageUI.NoticeNum)
        {
            this.playNoticeTw0();
        }else{
            this.hideNotice();
        }
    }

    public setCommentReddot():void
    {
        let unSeeNum = CommentMgr.instance.unSeeNum;
        if(unSeeNum > 0)
        {
            this.imgReddot.visible = true;
            this.txtNum.visible = true;
            this.txtNum.text = ""+unSeeNum;
        }else{
            this.imgReddot.visible = false;
            this.txtNum.visible = false;
            this.txtNum.text = ""+0; 
        }
    }
}