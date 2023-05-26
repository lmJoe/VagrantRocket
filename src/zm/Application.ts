import GameConfig from "../GameConfig";
import { AppConfig } from "./AppConfig";
// import { DownloadZipAction } from "./utils/ZipDownload";
import { Alert } from "./ui/Alert";
import ZMGameConfig from "../ZMGameConfig";
import WxHandler from "../wx/WxHandler";
import GameLayerMgr from "../scene/GameLayerMgr";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";
import QgHandler from "../qg/QgHandler";
import VideoAd from "../wx/VideoAd";

export abstract class Application {
    public static readonly CONFIG_APP = 'zmlocal/app.json';
    public static readonly CONFIG_OPPO = 'zmlocal/oppo.json';
    public static readonly ResourceVersion = 'version.json';
    public static readonly ZipVersionKey = 'ZipVersion';

    protected static readonly Alter_Interval = 5000;
    private lastAlterTime = 0;

    private _appCfg: AppConfig;
    private zipProgressHandler: Laya.Handler;

    constructor() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
        else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig.scaleMode;
        Laya.stage.screenMode = GameConfig.screenMode;
        //适配不同比例设备
        if(WxHandler.isWx)
        {
            let systemInfo = wx.getSystemInfoSync();
            if(systemInfo)
            {
                let rate:number = systemInfo.screenWidth/systemInfo.screenHeight;
                if(rate > (0.57))
                {
                    //ipad等宽屏
                    Laya.stage.scaleMode = "fixedheight";
                    Laya.stage.alignH = GameConfig.alignH;
                    let newWidth:number = (GameConfig.height/systemInfo.screenHeight)*systemInfo.screenWidth;
                    GameLayerMgr.initStage(newWidth, GameConfig.height);
                }else
                {
                    let newHeight:number = (GameConfig.width/systemInfo.screenWidth)*systemInfo.screenHeight;
                    GameLayerMgr.initStage(GameConfig.width, newHeight);
                }
                console.log("screen ",systemInfo.screenWidth, systemInfo.screenHeight);
                console.log("stage init",Laya.stage.width, Laya.stage.height);
                console.log("GameLayerMgr init", GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
            }else{
                GameLayerMgr.initStage(Laya.stage.width, Laya.stage.height);
            }
        }else{
            GameLayerMgr.initStage(Laya.stage.width, Laya.stage.height);
        }
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
        // Laya.stage.useRetinalCanvas = true;
        //初始化广告
        QgHandler.init();
        BannerAdCustomManager.instance.create();
        VideoAd.createAd();

        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
        if (GameConfig.stat) Laya.Stat.show();
        Laya.alertGlobalError = true;
        debugger
        this.loadAppConfig();
    }

    private loadAppConfig() {
        if(Laya.Browser.onQGMiniGame){
            Laya.loader.load(Application.CONFIG_OPPO, Laya.Handler.create(this, this.onAppConfigLoaded, [Application.CONFIG_OPPO]));
        }else{
            Laya.loader.load(Application.CONFIG_APP, Laya.Handler.create(this, this.onAppConfigLoaded, [Application.CONFIG_APP]));
        }
    }

    private onAppConfigLoaded(configUrl:string) {
        this._appCfg = Laya.loader.getRes(configUrl) as AppConfig;
        if (!this._appCfg) {
            Laya.timer.frameOnce(1, this, this.loadAppConfig);
            return;
        }

        //初始化zm
        zm.init(this._appCfg.appid, this._appCfg.yokaID, this._appCfg.yokaName, this._appCfg.version);
        zm.api.init( this._appCfg.apiHost );
        zm.share.defaultShareConfig(ZMGameConfig.DefaultShareMsg, ZMGameConfig.DefaultShareImg);
        zm.system.onShareAppMessage(ZMGameConfig.SystemShareTag);
        zm.ad.initBanner(600, 200, 0, 0, 60000, 200, new Laya.Point(640, 1136), {containerWidth:GameLayerMgr.StageWidth, containerHeight:180}, true);
        zm.ad.setAdEnable(false);
        //
        if (Laya.MiniAdpter) {
            let adpter = Laya.MiniAdpter as any;
            adpter._measureText = Laya.Browser.context.measureText;
            Laya.Browser.context.measureText = adpter.measureText;

            if (this._appCfg.nativeFiles) {
                Laya.MiniAdpter.nativefiles = this._appCfg.nativeFiles;
            }
        }

        this.loadLocalRes();
    }

    private onCheckUpdate() {
        let resHost = this._appCfg.resHost;
        if (resHost) {
            Laya.URL.basePath = resHost+this._appCfg.version+"/";
            if(Laya.Browser.onQGMiniGame){
                this.didLaunch(true);
                return;
            }
            // zm.remoteConfig.URL = resHost + "/shareConfig_QQ.json";
            let zipVer = Laya.LocalStorage.getItem(Application.ZipVersionKey)
            if (!zipVer || zm.utils.compareVersion(zipVer, this.appCfg.resVer || '0.0.0') < 0) {

                this.willDownloadZip();
                this.zipProgressHandler = Laya.Handler.create(this, this.onZipDownloadProgress, null, false);

                this.downloadZip();
            } else {
                this.onZipDownloaded(true);
            }
        } else {
            this.didLaunch(true);
        }
    }

    private onVersionLoaded(): void {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onFileConfigLoaded));
    }

    private onFileConfigLoaded(): void {
        this.willCheckUpdate();
        if (zm.system.runtimePlatform == zm.RuntimePlatform.QQGame) {
            this.onCheckUpdate();
        }else {
            zm.update.checkUpdate(Laya.Handler.create(this, this.onCheckUpdate))
        }
    }

    private downloadZip() {
        // new DownloadZipAction(this._appCfg.zipUrl,
        //     Laya.Handler.create(this, this.onZipDownloaded),
        //     this.zipProgressHandler)
    }

    private onZipDownloaded(success: boolean) {
        console.log('onZipDownloaded ', success);
        if (success) {
            this.downloadZipSuccess();
        } else {
            if ((Laya.Browser.now() - this.lastAlterTime) > Application.Alter_Interval) {
                this.showRetryDownloadAlert();
            } else {
                Laya.timer.once(1000, this, this.downloadZip);
            }
        }
    }

    private showRetryDownloadAlert() {
        Alert({
            content: "游戏资源包下载失败，是否重试？",
            callback: Laya.Handler.create(this, this.onDownloadZipFailAlert),
            confirmText: "确认",
        })
    }

    private onDownloadZipFailAlert() {
        this.lastAlterTime = Laya.Browser.now();
        this.downloadZip();
    }

    private downloadZipSuccess() {
        this.refreshFileslist();
        if (this.zipProgressHandler) {
            this.zipProgressHandler.recover();
            this.zipProgressHandler = null;
        }
        Laya.LocalStorage.setItem(Application.ZipVersionKey, this._appCfg.resVer);
        this.didLaunch(true);
    }

    private refreshFileslist() {
        // let win = window as any;
        // if (win.wx && win.wx.getFileSystemManager) {
        //     let MiniFileMgr = laya.wx.mini.MiniFileMgr;
        //     let fs = wx.getFileSystemManager();
        //     let retry = 3;
        //     let files: object;
        //     while (retry--) {
        //         try {
        //             let content = fs.readFileSync(MiniFileMgr.getFileNativePath(MiniFileMgr.fileListName), 'utf8').toString();
        //             files = JSON.parse(content);
        //             break;
        //         } catch (error) {
        //             files = {};
        //         }
        //     }
        //     MiniFileMgr.filesListObj = files;
        // }
    }

    protected abstract loadLocalRes();
    protected abstract didLaunch(success: boolean);

    protected onShowLoadView() {
        Laya.ResourceVersion.enable(Application.ResourceVersion, Laya.Handler.create(this, this.onVersionLoaded));
    }

    protected willCheckUpdate() {

    }

    protected willDownloadZip() {

    }

    protected onZipDownloadProgress(n: number) {

    }

    public get appCfg(): AppConfig {
        return this._appCfg;
    }

}