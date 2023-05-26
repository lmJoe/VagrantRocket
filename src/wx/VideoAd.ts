import WxHandler from "./WxHandler";
import WxAdConfig from "./WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import Constants from "../model/Constants";
import UserData from "../data/UserData";
import QgHandler from "../qg/QgHandler";

export default class VideoAd
{
    // private static videoAd: wx.RewardedVideoAd;
    // private static _isCreateAd: boolean = false;
    // private static _viewVideoSucess:Laya.Handler;
    // private static _viewVideoFail:Laya.Handler;
    // private static _shareTag:string;

    // public static get isCreatedAd()
    // {
    //     return this._isCreateAd;
    // }

    public static createAd(success?: Laya.Handler, fail?: Laya.Handler)
    {
        // if (!WxHandler.isWx)
        // {
        //     if (fail != null)
        //     {
        //         fail.runWith("not wx");
        //     }
        //     this._isCreateAd = false;
        //     return;
        // }

        // this.videoAd = wx.createRewardedVideoAd(
        //     {
        //         adUnitId: WxAdConfig.VideoAdUnitId
        //     }
        // );

        // this.videoAd.onLoad(() =>
        // {
        //     console.log('激励视频 广告加载成功');
        //     if (success != null)
        //     {
        //         success.run();
        //     }
        //     this._isCreateAd = true;
        // });
        // this.videoAd.onError(err =>
        // {
        //     console.log('激励视频 广告加载失败', err);
        //     if (fail != null)
        //     {
        //         fail.run();
        //     }
        //     this._isCreateAd = false;
        // });

        //  this.videoAd.onClose(res =>
        // {
        //     // 用户点击了【关闭广告】按钮
        //     // 小于 2.1.0 的基础库版本，res 是一个 undefined
        //     if (res && res.isEnded || res === undefined)
        //     {
        //        //发放游戏奖励
        //        console.log("广告看完，可以发奖励了");
        //        UserData.instance.updateAdCount();
        //        if(this._viewVideoSucess)this._viewVideoSucess.run();
        //     }
        //     else
        //     {  
        //        //wx.showToast({ title: '需观看完整广告', icon: "none", duration: 2500 });
        //        if(this._viewVideoFail) this._viewVideoFail.run();
        //     }
        // });
    }

    public static showAd(success: Laya.Handler, fail: Laya.Handler, shareTag:string=null)
    {
        QgHandler.showVideoAd(success, fail);

        // //QQ广告未开放时
        // if(Constants.QQAdEnable == false)
        // {
        //     if (success != null)
        //     {
        //         success.run();
        //         UserData.instance.updateAdCount();
        //     }
        //     return 
        // }

        // if (!WxHandler.isWx)
        // {
        //     if(Constants.DebugState)
        //     {
        //         if (success != null)
        //         {
        //             success.run();
        //             UserData.instance.updateAdCount();
        //         }
        //     }else{
        //         if (fail != null)
        //         {
        //             fail.runWith("show video ad fail: not wx");
        //         }
        //     }
        //     return;
        // }
        // if (this.videoAd == null)
        // {
        //     return;
        // }

        // this._viewVideoSucess = success;
        // this._viewVideoFail = fail;
        // this._shareTag = shareTag;

        // this.videoAd.show()
        //     .catch(err =>
        //     {
        //         this.loadAd(fail);
        //     });
    }

    private static loadAd(fail: Laya.Handler)
    {
        // this.videoAd.load().then(() =>
        // {
        //     console.log("loadad success")
        //     this.videoAd.show();
        // });
        // this.videoAd.load().catch(err =>
        // {
        //     console.log("loadad fail:", err)
        //     if (err && err.errCode == 0)
        //     {
        //         //wx.showToast({ title: '看视频广告次数耗尽!', icon: "none", duration: 2500 });
        //         // zm.share.shareMessage(VideoAd._shareTag,{},VideoAd._viewVideoSucess,VideoAd._viewVideoFail);
        //         zm.share.shareMessage(ZMGameConfig.RankShareTag, null, VideoAd._viewVideoSucess, VideoAd._viewVideoFail);
        //         return;
        //     }
        //     else
        //     {
        //         wx.showToast({ title: '加载广告失败，请检查网络!', icon: "none", duration: 2500 });
        //     }
        //     if (fail != null)
        //     {
        //         fail.run();
        //     }
        // });
    }
}
