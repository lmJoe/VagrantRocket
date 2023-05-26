import QgHandler from "../qg/QgHandler";
import QgConfig from "../qg/QgConfig";

// import WxAdConfig from "./WxAdConfig";

export default class BannerAdCustomManager 
{
    private static _instance: BannerAdCustomManager;
    // private _bannerAd: any;
    // private _bannerAdUpdateTime: number = 60000;//banner广告刷新时间
    public static get instance(): BannerAdCustomManager {
        if (!this._instance)
            this._instance = new BannerAdCustomManager();
        return this._instance;
    }
    
    public create(): void 
    {
        // if (zm.RuntimePlatform.QQGame != zm.system.runtimePlatform) {
        //     //自定义广告必须针对qq平台
        //     return;
        // }
        // var _this = this;
        // var designStyle = new Laya.Point(640, 1136);
        // var designHeight = 200;
        // var designWidth = 600;
        // var maxHeight = 200;
        // var left = 0;
        // var top = 0;
        // var info = wx.getSystemInfoSync();
        // console.log("--------",info);
        // var isResize:boolean = false;
        // var realDesignWidth = designWidth / designStyle.x * info.screenWidth;
        // var realDesignHeight = designHeight / designStyle.y * info.screenHeight;
        // maxHeight = maxHeight / Laya.stage.height * info.screenHeight;
        // this._bannerAd = wx.createBannerAd(
        //     {
        //         adUnitId: WxAdConfig.BannerAdUnitId,
        //         style: {
        //             left:0,
        //             top: info.screenHeight*0.86,
        //             width: realDesignWidth,
        //             height: info.screenHeight*0.14
        //         }
        // });
        // this._bannerAd.onError(res => {
        //     console.log('bannerAd onError', res)
        // })
        // this._bannerAd.onLoad(res => {
        //     console.log('bannerAd onLoad', res)
        // })

        // this._bannerAd.onResize(function (res) {
        //     console.log("onResize--res------",res);
        //     if (isResize==false) {
        //         isResize = true;
        //         _this._bannerAd.style.left = (info.screenWidth - res.width) / 2;
        //         _this._bannerAd.style.top = info.screenHeight - res.height;
        //     }
        //     console.log("top  ,  left------",_this._bannerAd.style.top,_this._bannerAd.style.left);
        // });
    }
    public show(): void 
    {
        QgHandler.showBannerAd(QgConfig.footBannerPosId);
        // Laya.timer.clear(this, this.onTimer);
        // if (zm.RuntimePlatform.QQGame != zm.system.runtimePlatform) {
        //     //自定义广告必须针对qq平台
        //     return;
        // }
        // if (!this._bannerAd) {
        //     this.create();
        // }
        // Laya.timer.loop(this._bannerAdUpdateTime, this, this.onTimer)
        // this._bannerAd.show();
    }

    public hide(): void 
    {
        QgHandler.hideBannerAd(QgConfig.footBannerPosId);
        // Laya.timer.clear(this, this.onTimer);
        // if (zm.RuntimePlatform.QQGame != zm.system.runtimePlatform) {
        //     //自定义广告必须针对qq平台
        //     return;
        // }
        // if (this._bannerAd) {
        //     this._bannerAd.hide();
        // }
    }

    private onTimer(): void 
    {
        // if (this._bannerAd) {
        //     this._bannerAd.destroy();
        //     this._bannerAd = null;
        // }
        // this.create();
        // this._bannerAd.show().then(() => {
        //     console.log('bannerAd show ok')
        // }).catch((res) => {
        //     console.log('bannerAd show error', res)
        // });
    }
}