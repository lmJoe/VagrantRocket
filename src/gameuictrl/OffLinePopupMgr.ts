import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import MergeUserData from "../merge/data/MergeUserData";
import SolarManager from "../solar/SolarManager";
import UserData from "../data/UserData";
import GameJsonConfig from "../config/GameJsonConfig";
import Util from "../utils/Util";
import VideoAd from "../wx/VideoAd";
import TipDialogMgr from "./TipDialogMgr";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxUserInfo from "../wx/WxUserInfo";
import ZMGameConfig from "../ZMGameConfig";
import WxAdConfig from "../wx/WxAdConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* OffLinePopupMgr;
*/
export default class OffLinePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:OffLinePopupMgr;
    public static get instance():OffLinePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new OffLinePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.OffLinePopupUI;

    private _coinNum:number;

    private init():void
    {
        this._ui = new ui.popup.OffLinePopupUI();

        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show(coinNum:number):void
    {
        UIManager.instance.showPopup(this._ui);

        this._coinNum = Math.max(0, coinNum);
        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_OffLine);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_OffLine, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_OffLine);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        this._ui.txtCoin.value = Util.moneyFormat(this._coinNum);
        //火箭等级
        this._ui.txtShipLevel.text = MergeUserData.instance.iMaxLockedShipId+"级火箭";
        //星系名称  
        let curSolarData = SolarManager.instance.getSolarDataByDiscoverIndex( UserData.instance.curDiscoverIndex );
        let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(curSolarData.index);
        this._ui.txtSolarName.text = solarInfoCfg.solarName;
        //个人信息
        if(WxUserInfo.instance.hasUserInfo())
        {
            this._ui.imgAvatar.skin = WxUserInfo.instance.getUserAvatarUrl();
            this._ui.txtMyName.text = WxUserInfo.instance.getUserNickName();
        }
        //分享切换
        this._ui.imgShareTag.visible = zm.share.rewardShareEnable();
        this._ui.imgVideoTag.visible = !zm.share.rewardShareEnable();
    }   

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnGain:
                this.onClickGain();
                break;
            case this._ui.btn5Gain:
                this.onClick5Gain();
                break;
        }
    }

    private onClickGain():void
    {
        this.gainCoin(false);
        this.close();
    }
    
    private onClick5Gain():void
    {
        if( zm.share.rewardShareEnable() )
        {
            this.shareGain();
        }else
        {
            this.videoGain();
        }
    }

    private shareGain():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        zm.share.shareMessage(ZMGameConfig.OfflineShareTag, null, Laya.Handler.create(this, function():void
        {
            DataStatisticsMgr.instance.stat("分享成功—5倍离线奖励");
            this.gainCoin(true);
            this.close();

        }),Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享失败—5倍离线奖励");

        }));
    }
    
    private videoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }

    private adSuccess():void
    {
        DataStatisticsMgr.instance.stat("广告视频-5倍离线奖励");
        this.gainCoin(true);
        this.close();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private gainCoin(isVideo:boolean):void
    {
        let num:number = isVideo ? this._coinNum*5 : this._coinNum;
        MergeUserData.instance.changeMoney(num);

        TipDialogMgr.instance.show("离线奖励领取成功");
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
    }   
}