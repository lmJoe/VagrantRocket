import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import VideoAd from "../wx/VideoAd";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import MergeDefine from "../merge/data/MergeDefine";
import TipDialogMgr from "./TipDialogMgr";
import ShipItem from "../merge/item/ShipItem";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import { ShipBoxType } from "../merge/data/MergeModel";
import { BonusGainType } from "../model/GameModel";
import GameSave from "../data/GameSave";
import Util from "../utils/Util";

/*
* VideoBoxPopupMgr;
*/
export default class VideoBoxPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:VideoBoxPopupMgr;
    public static get instance():VideoBoxPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new VideoBoxPopupMgr();
        }
        return this._instance;
    }

    private static readonly SaveKey:string = "VideoBoxPopup_SaveKey";
    private static readonly ShareShowCount:number = 2;//分享做多显示两次，若点击过分享，则切换视频

    private _ui:ui.popup.VideoBoxPopupUI;

    private _shipItem:ShipItem;
    private _bonusGainType:BonusGainType;

    private init():void
    {
        this._ui = new ui.popup.VideoBoxPopupUI();
        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);

        this._bonusGainType = BonusGainType.Share;
    }
    
    public show(item:ShipItem):void
    {
        UIManager.instance.showPopup(this._ui);
    
        this._shipItem = item;
        this.setPage();

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_VideoBox);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_VideoBox, this._ui);
    }

    public close():void
    {
        this._ui.eftBg.stop();
        UIManager.instance.removePopup(this._ui);

        zm.ad.removeAd(ZMGameConfig.AdPage_VideoBox);
        zm.ad.hideBanner();
    }

    private setPage():void
    {
        //获取状态
        this.setBonusGainType();
        //
        this._ui.eftBg.play();
        //隐藏返回按钮
        this._ui.btnBack.visible = false;
        Laya.timer.once(1500, this, this.showBtn);
    }
    
    private showBtn():void
    {
        this._ui.btnBack.visible = true;
    } 

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnBack:
                this.onClickBack();
                break;
            case this._ui.btnGain:
                this.onClickGain();
                break;
        }
    }

    private onClickBack():void
    {
        this.close();
        this._shipItem.openShipBoxWithEffect();
    }

    private onClickGain():void
    {
        if(this._bonusGainType == BonusGainType.Video)
        {
            this.videoGain();
        }else{
            this.shareGain();
        }
    }

    private videoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }

    private adSuccess():void
    {
        DataStatisticsMgr.instance.stat("广告视频—领取高级宝箱");
        this.gainBonus();
        this.close();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private shareGain():void
    {
        this.setSaveValue( VideoBoxPopupMgr.ShareShowCount );
        SoundManager.instance.playSound(MusicConfig.Click, false);
        zm.share.shareMessage(ZMGameConfig.VideoBoxShareTag, null, Laya.Handler.create(this, function():void
        {
            DataStatisticsMgr.instance.stat("分享成功—视频宝箱");
            this.gainBonus();
            this.close();

        }),Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享失败—视频宝箱");
            SoundManager.instance.playSound(MusicConfig.NoCoin, false);

        }));
    }

    private gainBonus():void
    {
        PowerUpMgr.createMultiCacheShipBox(this._shipItem.shipId, MergeDefine.DropVideoBoxBonusNum, ShipBoxType.Type02);
        this._shipItem.destroyItem();
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
    }

    private setBonusGainType():void
    {
        if(this._bonusGainType == BonusGainType.Video)
        {
            return;
        }
        this._bonusGainType = this.getSaveValue();
        let imgVideoTag:Laya.Image = this._ui.btnGain.getChildByName("imgVideoTag") as Laya.Image;
        let imgShareTag:Laya.Image = this._ui.btnGain.getChildByName("imgShareTag") as Laya.Image;
        imgVideoTag.visible = this._bonusGainType == BonusGainType.Video;
        imgShareTag.visible = this._bonusGainType == BonusGainType.Share;
    }

    private getSaveValue():BonusGainType
    {
        let dataStr:string = GameSave.getValue(VideoBoxPopupMgr.SaveKey);
        if(dataStr && dataStr.length>0)
        {
            let arr = dataStr.split("#");
            let timemark:number = parseInt(arr[0]);
            let showcount:number = parseInt(arr[1]);

            if(Util.isToday(timemark))
            {
                this.setSaveValue(showcount+1);
                if(showcount < VideoBoxPopupMgr.ShareShowCount)
                {
                    return this.returnShare();
                }
                return BonusGainType.Video;
            }else{
                this.setSaveValue(1);
                return this.returnShare();
            }
        }
        else
        {
            this.setSaveValue(1);
            return this.returnShare();
        }
    }

    private returnShare():BonusGainType
    {
        if(zm.share.rewardShareEnable())
        {
            return BonusGainType.Share;
        }else{
            return BonusGainType.Video;
        }
        // return BonusGainType.Share;
    }

    private setSaveValue(showcount:number):void
    {
        let dataStr:string = Date.now() + "#" + showcount;
        GameSave.setValue(VideoBoxPopupMgr.SaveKey, dataStr);
    }
}