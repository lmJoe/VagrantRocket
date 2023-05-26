import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import MergeDefine from "../merge/data/MergeDefine";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import MergeUserData from "../merge/data/MergeUserData";
import Util from "../utils/Util";
import TipDialogMgr from "./TipDialogMgr";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import VideoAd from "../wx/VideoAd";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import GameSave from "../data/GameSave";
import DTime from "../utils/DTime";
import SignManager from "../ctrl/SignManager";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* SpeedUpPopupMgr;
*/
export default class SpeedUpPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SpeedUpPopupMgr;
    public static get instance():SpeedUpPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SpeedUpPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.SpeedUpPopupUI;
    private _leftCount:number;
    private _totalTimeNode:number;
    private _imgTimeNodeList:Array<Laya.Image>;

    private static readonly FirstShowSpeedUpKey:string = "FirstShowSpeedUpKey";

    private init():void
    {
        this._ui = new ui.popup.SpeedUpPopupUI();
        this._ui.mouseThrough = true;

        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
        this.countAllTimeNodeImg();
        
        // GameSave.clearValue(SpeedUpPopupMgr.FirstShowSpeedUpKey);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        GameEventMgr.instance.addListener(GameEvent.SpeedUpTimeCount, this, this.setSpeedCountTime);

        this.setPage();
        this.setFirstShowSpeedUp();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_SpeedUp);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_SpeedUp, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        GameEventMgr.instance.removeListener(GameEvent.SpeedUpTimeCount, this, this.setSpeedCountTime);
        UIManager.instance.removePopup(this._ui);
        Laya.timer.clear(this, this.onScrollLable);
        SoundManager.instance.playSound(MusicConfig.Click, false);

        zm.ad.removeAd(ZMGameConfig.AdPage_SpeedUp);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        //次数
        this.setLeftCount();
        //按钮效果
        this.setBtn();
        //文字滚动
        this.setScrollLable();

        this.setSpeedCountTime();
    } 

    private setLeftCount():void
    {
        this._leftCount = this.getLeftCount();
        this._ui.txtLeftCount.text = "剩余次数："+ this._leftCount + "次";
    }

    private setScrollLable():void
    {
        this._ui.txtDesc.pos(480, 0);
        Laya.timer.frameLoop(1, this, this.onScrollLable);
    }

    private onScrollLable():void
    {
        let deltaTime:number = DTime.deltaTimeMs;
        let moveDis:number = this._ui.txtDesc.x - deltaTime*0.08;
        if(moveDis < (-this._ui.txtDesc.width))
        {
            this._ui.txtDesc.x = 480;
        }else{
            this._ui.txtDesc.x = moveDis;
        }
    }

    private setBtn():void
    {
        let imgReddot:Laya.Image = this._ui.btnVideoGain.getChildByName("imgReddot") as Laya.Image;
        let imgVideoTag:Laya.Image = this._ui.btnVideoGain.getChildByName("imgVideoTag") as Laya.Image;
        if(SignManager.instance.getCanSpeedUp())
        {
            imgReddot.visible = true;
            imgVideoTag.visible = false;
        }else
        {
            imgVideoTag.visible = true;
            imgReddot.visible = !this.hasShowSpeedUpReddot;
        }
    }
    
    private countAllTimeNodeImg():void
    {   
        this._totalTimeNode = 0;
        this._imgTimeNodeList = [];
        let idx = 0;
        while(true)
        {
            let imgTimeNode = this._ui.boxTimeNode.getChildByName("imgTimeNode"+idx) as Laya.Image;
            if(imgTimeNode != null)
            {
                imgTimeNode.size(54, 29);
                imgTimeNode.scale(1, 1);
                this._imgTimeNodeList.push(imgTimeNode);
                this._totalTimeNode ++;
            }else{
                break;
            }
            idx ++;
        }
    }
    
    private setSpeedCountTime():void
    {
        let speedUpTime = Math.ceil(MergeUserData.instance.speedUpTime);
        this._ui.txtSpeedUpTime.value = Util.formatGameTime(speedUpTime);
        this._ui.txtSpeedUpTime.visible = speedUpTime > 0;

        let nodeNum:number = Math.ceil( speedUpTime/MergeDefine.SpeedUpTime );
        for(var i=0; i<this._imgTimeNodeList.length; i++)
        {
            let imgTimeNode = this._imgTimeNodeList[i];
            if(i < nodeNum-1)
            {
                imgTimeNode.scale(1, 1);
                imgTimeNode.visible = true;
            }else if(i == nodeNum-1)
            {   
                let thisNodeTime = speedUpTime - (nodeNum-1)*MergeDefine.SpeedUpTime;
                let scalx = thisNodeTime / MergeDefine.SpeedUpTime;
                imgTimeNode.scaleX = scalx;
                imgTimeNode.visible = true;
            }else{
                imgTimeNode.visible = false;
            }
        }
    }

    private getLeftCount():number
    {
        let count:number = 0;
        let valueStr = Laya.LocalStorage.getItem("AdSpeedUpDailyCount");
        if(!valueStr || valueStr.length==0)
        {
            count = MergeDefine.AdSpeedUpDailyCount;
            this.saveLeftCount(count);
        }else{
            let arr = valueStr.split("#");

            let saveTime = parseInt( arr[1] );
            if(Util.isToday(saveTime))
            {
                count = parseInt( arr[0] );
            }else{
                count = MergeDefine.AdSpeedUpDailyCount;
                this.saveLeftCount(count);
            }
        }
        return count;
    }

    private saveLeftCount(count:number):void
    {
        let valueStr:string = count + "#" + Date.now();
        Laya.LocalStorage.setItem("AdSpeedUpDailyCount", valueStr);
    }
    
	private getReward(isFree:boolean):void
	{
        this._leftCount = Math.max(0, this._leftCount-1);
        this.saveLeftCount(this._leftCount);
        this.setLeftCount();

        MergeUserData.instance.changeSpeedUp(MergeDefine.SpeedUpTime);
        this.setSpeedCountTime();

        if(isFree)
        {
            DataStatisticsMgr.instance.stat("加速奖励-时间5倍加速");
        }else{
            DataStatisticsMgr.instance.stat("广告视频-时间5倍加速");
        }
        TipDialogMgr.instance.show("已开启5倍加速");
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
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
            case this._ui.btnBack:
                this.close();
                break;
            case this._ui.btnVideoGain:
                this.onClickVideoGain();
                break;
        }
    }

    private onClickVideoGain():void
    {
        if(SignManager.instance.getCanSpeedUp())
        {
            this.freeGain();
        }else{
            this.videoGain();
        }
    }

    private freeGain():void
    {
        SignManager.instance.useSpeedUpCard();
        this.getReward(true);
        this.setBtn();
        GameEventMgr.instance.Dispatch(GameEvent.RefreshSpeedUpBtnReddot);
    }

    private videoGain():void
    {
        let speedUpTime = Math.ceil(MergeUserData.instance.speedUpTime);
        let nodeNum:number = Math.ceil( speedUpTime/MergeDefine.SpeedUpTime );
        if(nodeNum >= this._totalTimeNode)
        {
            TipDialogMgr.instance.show("加速节点已满");
            SoundManager.instance.playSound(MusicConfig.NoCoin, false);
        }else{
            VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
        }
    }
    
    private adSuccess():void
    {
        this.getReward(false);
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private setFirstShowSpeedUp():void
    {
        if(this.hasShowSpeedUpReddot == false)
        {
            GameSave.setValue(SpeedUpPopupMgr.FirstShowSpeedUpKey, "yes");
            GameEventMgr.instance.Dispatch(GameEvent.RefreshSpeedUpBtnReddot);
        }
    }

    public get hasShowSpeedUpReddot():boolean
    {
        return GameSave.getValue(SpeedUpPopupMgr.FirstShowSpeedUpKey) == "yes";
    }

    public get showSpeedUpReddot():boolean
    {
        return !this.hasShowSpeedUpReddot || SignManager.instance.getCanSpeedUp();
    }
}