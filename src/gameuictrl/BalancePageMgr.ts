import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import BalancePageUI from "../gameui/BalancePageUI";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import GameSave from "../data/GameSave";
import VideoAd from "../wx/VideoAd";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import TipDialogMgr from "./TipDialogMgr";
import { BonusGainType } from "../model/GameModel";
import Util from "../utils/Util";
import UserData from "../data/UserData";
import RecommendPopupMgr from "./RecommendPopupMgr";
import Constants from "../model/Constants";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* BalancePageMgr;
*/
export default class BalancePageMgr
{
    constructor(){
        this.init();
    }

    private static _instance:BalancePageMgr;
    public static get instance():BalancePageMgr
    {
        if(!this._instance)
        {
            this._instance = new BalancePageMgr();
        }
        return this._instance;
    }

    private static readonly BalanceShowTimeKey:string = "BalanceShowTimeKey";

    private _ui:BalancePageUI;
    private _bonusGainType:BonusGainType;

    public get ui():BalancePageUI
    {
        return this._ui;
    }

    private init():void
    {
        this._ui = new BalancePageUI();
        GameEventMgr.instance.addListener(GameEvent.OnRevive_ClickEvent, this, this.onUIClick);
    }

    public show():void
    {
        UIManager.instance.showUI(this._ui);

        this._bonusGainType = this.getBonusState();
        this._ui.setPage(this._bonusGainType);

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Balance);
        zm.ad.setAdCustomData(
            {
                pos:{x:0, y:200}, 
                newVersion:true
            },
            {
                bgSkin:"gameend/imgGuessbg.png", 
                bgSizeGrid:"20,20,20,20,0", 
                iconNum:5, 
                containerWidth:this._ui.boxAd.width,
                containerHeight:this._ui.boxAd.height,
                pos:{x:this._ui.boxAd._x+this._ui.boxNationBonus._x, y:this._ui.boxAd._y+this._ui.boxNationBonus._y}
            }
        );
        zm.ad.addAd(ZMGameConfig.AdPage_Balance, this._ui);
        BannerAdCustomManager.instance.show();
    }
    
    public close():void
    {
        UIManager.instance.removeUI();
        GameEventMgr.instance.Dispatch(GameEvent.OnBalancePageClose);

        zm.ad.removeAd(ZMGameConfig.AdPage_Balance);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private getBonusState():BonusGainType
    {
        let dataStr:string = GameSave.getValue(BalancePageMgr.BalanceShowTimeKey);
        let nowTime:number = Date.now();
        GameSave.setValue(BalancePageMgr.BalanceShowTimeKey, ""+nowTime);
        if(dataStr && dataStr.length>0)
        {
            let showTimemark:number = parseInt(dataStr);
            if(Util.isToday(showTimemark))
            {
                return BonusGainType.Video;
            }else{
                if(zm.share.rewardShareEnable())
                {
                    return BonusGainType.Share;
                }else{
                    return BonusGainType.Video;
                }
            }
        }
        else
        {
            // return BonusGainType.None;
            if(zm.share.rewardShareEnable())
            {
                return BonusGainType.Share;
            }else{
                return BonusGainType.Video;
            }
        }
    }
    
    private onUIClick(clkTarget):void
    {
        switch(clkTarget)
        {
            case this._ui.btnGain:
                this.onClickGain();
                break;
            case this._ui.btnDoubleGain:
                this.onClickDoubleGain();
                break;
        }
    }

    private checkRestartGame():void
    {
        // if(UserData.instance.flySucCount >= Constants.RecommendShowCount)
        // {
        //     if(RecommendPopupMgr.instance.hasSetDailyKey() == false)
        //     {
        //         this.restartGame();
        //         RecommendPopupMgr.instance.show();
        //         return;
        //     }
        // }
        TipDialogMgr.instance.show("成功领取奖励");
        this.restartGame();
    }

    private restartGame():void
    {       
        this.close();
        GameEventMgr.instance.Dispatch(GameEvent.onRestartGame);
    }

    private gainBonus(double:boolean):void
    {
        // TipDialogMgr.instance.show("成功领取奖励");
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
        this._ui.gainBonus(double);
    }

    private onClickGain():void
    {
        this.gainBonus(false);
        this.checkRestartGame();
    }

    private onClickDoubleGain():void
    {
        switch(this._bonusGainType)
        {
            case BonusGainType.None:
                this.freeDoubleGain();
                break;
            case BonusGainType.Video:
                this.videoDoubleGain();
                break;
            case BonusGainType.Share:
                this.shareDoubleGain();
                break;
        }
    }
    
    private freeDoubleGain():void
    {
        DataStatisticsMgr.instance.stat("首次免费—结算双倍领取");
        this.gainBonus(true);
        this.checkRestartGame();
    }
    
    private videoDoubleGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }
    
    private adSuccess():void
    {
        DataStatisticsMgr.instance.stat("广告视频—结算双倍领取");
        this.gainBonus(true);
        this.checkRestartGame();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private shareDoubleGain():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        zm.share.shareMessage(ZMGameConfig.BalanceDoubleShareTag, null, Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享成功—结算双倍领取");
            this.gainBonus(true);
            this.checkRestartGame();

        }),Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享失败—结算双倍领取");

        }));
    }


}