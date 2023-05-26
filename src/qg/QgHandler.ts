import UserData from "../data/UserData";
import QgConfig from "./QgConfig";
import TipDialogMgr from "../gameuictrl/TipDialogMgr";

/*
* 一些快游戏的处理方法
*/
export default class QgHandler
{
    private static PkgName:string = "com.zmcrowdearth.kyx.nearme.gamecenter";
    private static bannerAdMap:Object = {}; //banner广告缓存
    private static bannerAdCloseMap:Object = {}; //banner广告关闭次数缓存
    private static videoAdMap:Object = {}; //激励视频广告缓存

    public static get qg() {
        return Laya.Browser.window.qg;
    }

    public static get isQg():boolean 
    {
        return Laya.Browser.window.qg != undefined;
    }

    public static init():void
    {
        //debug
        // QgHandler.setEnableDebug();
        //ad
        QgHandler.initAd();
    }

    public static setEnableDebug():void
    {
        if(!QgHandler.isQg){
            return;
        }
        QgHandler.qg.setEnableDebug({
            enableDebug: true, // true 为打开，false 为关闭
            success: function () {
                // 以下语句将会在 vConsole 面板输出 
                console.log("test consol log");
                console.info("test console info");
                console.warn("test consol warn");
                console.debug("test consol debug");
                console.error("test consol error");
            },
            complete: function () {
            },
            fail: function () {
            }
        });
    }

    public static onHide(callback:Laya.Handler):void
    {
        if(!QgHandler.isQg){
            return;
        }
        QgHandler.qg.onHide(function()
        {
            if(callback){
                callback.run();
            }
        });
    }

    public static onShow(callback:Laya.Handler):void
    {
        if(!QgHandler.isQg){
            return;
        }
        QgHandler.qg.onShow(function()
        {
            if(callback){
                callback.run();
            }
        });
    }

    /*oppo登录*/
    public static qgLogin(success:Laya.Handler, fail:Laya.Handler):void
    {
        if(!QgHandler.isQg)
        {
            if(fail){
                fail.run();
            }
            return;
        }
        QgHandler.qg.login({
            pkgName: QgHandler.PkgName,
            success: function(res)
            {
                console.log("qgLogin success", JSON.stringify(res));
                /*获取用户信息*/
                // UserData.instance.getData(res);
                if(success){
                    success.runWith([res]);
                    // success.run();
                }
            },
            fail: function(res){
                console.log("qgLogin fail", JSON.stringify(res));
                if(fail){
                    fail.run();
                }
            }
        });
    }

    /*oppo下载文件*/
    public static downloadFile(url: string, successHandler:Laya.Handler, failHandler:Laya.Handler):void
    {
        if(!QgHandler.isQg)
        {
            if(failHandler){
                failHandler.run();
            }
            return;
        }
        QgHandler.qg.downloadFile({
            url: url,
            success: function(res)
            {
                if(successHandler){
                    successHandler.runWith([res]);
                }
            },
            fail: function(res){
                console.log("downloadFile fail", JSON.stringify(res));
                if(failHandler){
                    failHandler.run();
                }
            }
        });
    }

    
    /*创建桌面图标*/
    public static installShortcut(uccessHandler?:Laya.Handler, failHandler?:Laya.Handler):void
    {
        if(!QgHandler.isQg)
        {
            if(failHandler){
                failHandler.run();
            }
            return;
        }
        QgHandler.qg.hasShortcutInstalled(
            {
                success: function(res) {
                    // 判断图标未存在时，创建图标
                    if(res == false){
                        QgHandler.qg.installShortcut({
                            success: function() {
                                // 执行用户创建图标奖励
                                TipDialogMgr.instance.show("创建桌面图标成功");
                                if(uccessHandler){
                                    uccessHandler.run();
                                }
                            },
                            fail: function(err) {},
                            complete: function() {}
                        })
                    }else{
                        TipDialogMgr.instance.show("已经存在桌面图标");
                        if(failHandler){
                            failHandler.run();
                        }
                    }
                },
                fail: function(err) {
                    console.log("installShortcut", err);
                    if(failHandler){
                        failHandler.run();
                    }
                },
                complete: function() {}
            });
    }

    // oppo广告初始化
    public static initAd():void
    {
        if (!QgHandler.isQg){
            return;
        }
        QgHandler.qg.initAdService({
            appId: QgConfig.adAppId,
            isDebug: true,
            success: function(res) {
                console.log("oppo ad success");
                console.log(res);
            },
            fail: function(res) {
                console.log("oppo ad fail:" + res.code + res.msg);
            },
            complete: function(res) {
                console.log("oppo ad complete");
            }
        })
    }

    //获取banner广告对象
    public static getBannerAdInstance(posId:number):any
    {
        if (!QgHandler.isQg) {
            return null;
        }

        //自己多缓存一次
        if (QgHandler.bannerAdMap[posId] != undefined && QgHandler.bannerAdMap[posId] != null) {
            return QgHandler.bannerAdMap[posId];
        }

        //创建对象
        let bannerAd = QgHandler.qg.createBannerAd({
            posId: posId
        });

        //初始化关闭次数
        if (QgHandler.bannerAdCloseMap[posId] == undefined) {
            QgHandler.bannerAdCloseMap[posId] = 0;
        }

        bannerAd.onShow(() => {
            console.log("banner ad " + posId + " show");
            if(QgHandler._showBanner == false){
                bannerAd.hide();
            }
        });

        //关闭时增加关闭次数
        bannerAd.onHide(() => {
            if(QgHandler._showBanner == true)
            {
                QgHandler._showBanner = false;
                QgHandler.bannerAdCloseMap[posId] ++;
                console.log("banner ad " + posId + " hide, now hide times " + QgHandler.bannerAdCloseMap[posId]);
            }
        });

        bannerAd.onError((err) => {
            console.log("banner ad " + posId + " error", JSON.stringify(err));
            bannerAd.offError();
            bannerAd.offHide();
            bannerAd.offShow();
            bannerAd.hide();
            bannerAd.destroy();
            bannerAd = null;
            QgHandler.bannerAdMap[posId] = null;
            QgHandler._showBanner = false;
        });

        return QgHandler.bannerAdMap[posId] = bannerAd;
    }

    private static _showBanner:boolean = false;
    //显示banner广告
    public static showBannerAd(posId:number):void
    {
        if (!QgHandler.isQg){
            return;
        }

        //关闭次数超了，不再展示
        if (QgHandler.bannerAdCloseMap[posId] != undefined && QgHandler.bannerAdCloseMap[posId] >= QgConfig.bannerAdShowLimit)
        {
            return;
        }

        let bannerAd = QgHandler.getBannerAdInstance(posId);
        if (bannerAd) {
            QgHandler._showBanner = true;
            bannerAd.show();
        }
    }

    //主动关闭banner广告
    public static hideBannerAd(posId:number):void
    {
        if (!QgHandler.isQg){
            return;
        }

        if(QgHandler._showBanner == false){
            return;
        }

        //初始化关闭次数
        if (QgHandler.bannerAdCloseMap[posId] == undefined) {
            QgHandler.bannerAdCloseMap[posId] = 0;
        }
        
        let bannerAd = QgHandler.getBannerAdInstance(posId);
        if (bannerAd) {
            //主动关闭，因此关闭次数减1
            QgHandler.bannerAdCloseMap[posId]--;
            bannerAd.hide();
            console.log("hideBannerAd" + posId + ", now hide times " + QgHandler.bannerAdCloseMap[posId]);
        }
    }

    //获取激励视频对象
    public static getVideoAdInstance(posId:number):any
    {
        if (!QgHandler.isQg){
            return;
        }

        //自己多缓存一次
        if (QgHandler.videoAdMap[posId] != undefined) {
            return QgHandler.videoAdMap[posId];
        }

        //创建对象
        let videoAd = QgHandler.qg.createRewardedVideoAd({ 
            posId: posId 
        })

        return QgHandler.videoAdMap[posId] = videoAd;
    }

    //展示激励视频
    public static showVideoAd(success:Laya.Handler, fail:Laya.Handler):void
    {
        if (!QgHandler.isQg){ 
            //不是快游戏，默认成功
            if (success != null){
                success.run();
            }
            return;
        }
        
        let videoAd = QgHandler.getVideoAdInstance(QgConfig.rewardPosId);

        if (videoAd == null) { //获取不到，认为失败
            if (fail != null){
                fail.run();
            }
            return;
        }

        //移除之前的监听事件
        videoAd.offClose();
        videoAd.offLoad();
        videoAd.offError();

        //加载完成，直接展示
        videoAd.onLoad(() => {
            console.log("oppo激励视频加载成功");
            videoAd.show();
        });

        //视频关闭
        videoAd.onClose((res) => {
            if(res.isEnded){
                console.log('激励视频广告完成，发放奖励')
                if (success != null){
                    UserData.instance.updateAdCount();
                    success.run();
                }
            }else{
                console.log('激励视频广告取消关闭，不发放奖励')
                if (fail != null){
                    fail.run();
                }
            }
        });

        //出错
        videoAd.onError((err) => {
            console.log("oppo激励视频广告出错", JSON.stringify(err));
            if (fail != null){
                fail.run();
            }
        })
        //加载
        videoAd.load();
    }
}