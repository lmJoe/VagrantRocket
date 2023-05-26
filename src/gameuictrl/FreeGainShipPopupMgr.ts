import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import GameJsonConfig from "../config/GameJsonConfig";
import MergeDefine from "../merge/data/MergeDefine";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import VideoAd from "../wx/VideoAd";
import TipDialogMgr from "./TipDialogMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import Util from "../utils/Util";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* FreeGainShipPopupMgr;
*/
export default class FreeGainShipPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:FreeGainShipPopupMgr;
    public static get instance():FreeGainShipPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new FreeGainShipPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.FreeGainShipPopupUI;
    private _freeShipId:number;
    private _leftTime:number;

    private init():void
    {
        this._ui = new ui.popup.FreeGainShipPopupUI();

        // GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);

        this.setBgEft(false);
    }

    private setBgEft(enable:boolean):void
    {
        if(enable)
        {
            this._ui.imgBg.rotation = 0;
            this._ui.eftBg.visible = true;
            this._ui.imgBg.visible = true;
            this._ui.eftBg.play(0, true);
        }else{
            this._ui.eftBg.visible = false;
            this._ui.imgBg.visible = false;
            this._ui.eftBg.stop();
        }
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);

        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_FreeGain);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_FreeGain, this._ui);
        BannerAdCustomManager.instance.show();
        //
        this._ui.btnVideoGain.visible = false;
        Laya.timer.once(350, this, this.onTimer);
    }

    private onTimer():void
    {
        this._ui.btnVideoGain.visible = true;
        this._ui.btnVideoGain.scale(1, 1);
        this._ui.btnVideoGain.bottom = 200;
        this._ui.btnVideoGain.centerX = 0;
        Laya.Tween.from(this._ui.btnVideoGain, {scaleX:0, scaleY:0}, 200, Laya.Ease.backOut, Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(this._ui.btnVideoGain);
        }), 0, false, true);
    }

    public close():void
    {
        Laya.timer.clear(this, this.onTimer);
        Laya.Tween.clearTween(this._ui.btnVideoGain);
        this.setBgEft(false);
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_FreeGain);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        //根据配置当前等级可掉落的
        // this._freeShipId = PowerUpMgr.getFreeDropShipId(true);
        //给当前性价比最高的
        this._freeShipId = PowerUpMgr.getMostCostEffectiveShipId()
        //等级
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig(this._freeShipId);
        this._ui.txtLevel.value = shipInfo.level+"";
        //图
        this._ui.imgBonus.skin = shipInfo.skinUrl;
        //剩余次数
        this._leftTime = this.getLeftTime();
        this._ui.txtLeftCount.text = this._leftTime + "次";
        //
        this.setBgEft(true);
    }   

    private getLeftTime():number
    {
        let count:number = 0;
        let valueStr = Laya.LocalStorage.getItem("AdFreeShipDailyCount");
        if(!valueStr || valueStr.length==0)
        {
            count = MergeDefine.AdFreeShipDailyCount;
            this.setLeftTime(count);
        }else{
            let arr = valueStr.split("#");
            let saveTime = parseInt( arr[1] );
            if( Util.isToday(saveTime) )
            {
                count = parseInt( arr[0] );
            }else{
                count = MergeDefine.AdFreeShipDailyCount;
                this.setLeftTime(count);
            }
        }
        return count;
    }

    private setLeftTime(count:number):void
    {
        let valueStr:string = count + "#" + Date.now();
        Laya.LocalStorage.setItem("AdFreeShipDailyCount", valueStr);
    }
    
	private getReward():void
	{
        this._leftTime = Math.max(0, this._leftTime-1);
        this.setLeftTime(this._leftTime);

        PowerUpMgr.createVideoFreeShop(this._freeShipId);
        DataStatisticsMgr.instance.stat("广告视频—免费获取火箭",{"等级":this._freeShipId.toString()});
        TipDialogMgr.instance.show("领取火箭成功");
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
                this.onClickBack();
                break;
            case this._ui.btnVideoGain:
                this.onClickVideoGain();
                break;
        }
    }

    private onClickBack():void
    {
        this.close();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickVideoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }

    private adSuccess():void
    {
        this.getReward();
        this.close();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }
}