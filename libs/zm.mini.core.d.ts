declare namespace zm {
    interface ShareHelper {
        /**
         * 微信无法获取分享结果，默认都分享成功
         * @param title
         * @param imageUrl
         * @param query
         * @param success
         * @param fail
         */
        shareAppMessage(title: string, imageUrl: string, query: Object, success: Laya.Handler, fail: Laya.Handler): any;
        shareScreenShot(container: Laya.Sprite, rect: Rect, title: string, query: Object, success: Laya.Handler, fail: Laya.Handler): any;
        rewardShareEnable(): boolean;
        zmGameTriggerState(triggerKey: string): boolean;
    }
    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
}
declare module zm {
    interface DeviceHelper {
        /**
         * 短震动 15ms
         * @param success
         * @param fail
         */
        vibrateShort(success?: Laya.Handler, fail?: Laya.Handler): any;
        /**
         * 长震动 400ms
         * @param success
         * @param fail
         */
        vibrateLong(success?: Laya.Handler, fail?: Laya.Handler): any;
        /**
         * 设置是否开启震动
         * @param allow
         */
        setVibrateAllow(allow: boolean): any;
        /**
         * 返回当前震动开关
         * @return boolean
         */
        getVibrateAllow(): boolean;
    }
}
declare namespace zm {
    interface SystemHelper {
        readonly runtimePlatform: RuntimePlatform;
        getLaunchOptions(): LaunchOptions;
        /**
         * 0：等于，1：大于SDK版本，-1：小于SDK版本
         * @param version 版本号
         */
        compareSDKVersion(version: any): number;
        /**
         * 监听用户点击右上角菜单的“转发”按钮时触发的事件
         * @param callback 返回值: title: string, imageUrl: string, query: object
         */
        onShareAppMessage(tag: string): any;
        exit(): any;
    }
    interface IShareReturnInfo {
        title: string;
        imageUrl: string;
        query?: object;
    }
    interface ShareCallBack {
        (): IShareReturnInfo;
    }
    interface LaunchOptions {
        groupID?: string;
        scene?: number;
        shareQuery?: object;
        extraData?: object;
        appID?: string;
        path?: string;
    }
    const enum LaunchScene {
    }
    const enum RuntimePlatform {
        MiniGame = 0,
        Web = 1,
        QQGame = 2,
        TTGame = 3,
        App = 4
    }
    const enum NetType {
        None = 0,
        Unknown = 1,
        Wifi = 2,
        M2g = 3,
        M3g = 4,
        M4g = 5
    }
}
declare module zm {
    const enum StatEvents {
        /**分享事件 */
        Share = 1000,
        /**跳转事件 */
        Navigation = 1001,
        Bootup = 1002,
        Duration = 1003,
        NavigationConfirm = 1004
    }
    const StatEventNames: {
        Share: string;
        Navigation: string;
        Bootup: string;
        Duration: string;
        NavigationConfirm: string;
    };
    enum LocationID {
        More = 1,
        Vip = 2
    }
    const LocationNames: any[];
}
declare module zm.utils {
    /**
     * 生成统计平台的ID
     * @param gameid 后台的游戏id
     */
    function adaptStatID(gameid: number, offset: number): number;
    /**
     * object to xx=xx&yy=yy
     * @param obj
     */
    function obj2query(obj: any): string;
    function compareVersion(version1: string, version2: string): 1 | 0 | -1;
}
declare namespace zm.http {
    /**
     * 数据格式: Json
     */
    interface Request {
        (method: string, url: string, params: string, success: Laya.Handler, fail: Laya.Handler, header?: {}): void;
    }
    interface Method {
        (url: string, params: object, success?: Laya.Handler, fail?: Laya.Handler): void;
    }
    const enum MethodType {
        GET = 0,
        POST = 1
    }
    let request: Request;
    function POST(url: string, params: object, success?: Laya.Handler, fail?: Laya.Handler, header?: {}, retryCnt?: number): void;
    function GET(url: string, params?: object, success?: Laya.Handler, fail?: Laya.Handler, header?: {}, retryCnt?: number): void;
}
/**
 * 广告内容特效类型
 */
declare enum EffectType {
    None = 0,
    Reddot = 1
}
declare module zm {
    const enum OS_TYPE {
        Android = 1,
        iOS = 2
    }
    abstract class YokaStat {
        protected static Yoka_App_Id: string;
        protected static Yoka_Url: string;
        protected static NetTypeKey: string;
        protected static UUIDKey: string;
        protected inited: boolean;
        protected booted: boolean;
        protected loaded: boolean;
        private showTime;
        private bootEvent;
        private initLoginEvent;
        private customEvents;
        /**设备ID */
        protected deviceID: string;
        protected userName: string;
        protected userID: string;
        /**游戏id-名称--必须传 */
        protected gameIDName: string;
        protected gameID: number;
        protected gameName: string;
        protected appVersion: string;
        protected userType: string;
        protected deviceModel: string;
        protected osType: OS_TYPE;
        protected osVersion: string;
        protected loginWay: number;
        protected locationID: string;
        protected subgameid: string;
        protected subuid: string;
        protected channel: string;
        protected plan: string;
        protected ad_page_id: string;
        protected advid: string;
        protected adid: string;
        protected sharepid: string;
        protected shareid: string;
        protected shareuid: string;
        /**
         * @param openId
         * @param uid
         * @param gameId 在平台的注册的id
         * @param gameName 平台中游戏的名字
         * @param version 游戏版本
         */
        init(openId: string, uid: string, gameId: number, gameName: string, version: string): void;
        initUserInfo(openID: string, uid: string): void;
        sendLoaded(): void;
        private sendBootupEvent;
        private getBootupEvent;
        private onBootup;
        private onBootupFail;
        private onInited;
        private onInitFail;
        private sendInitLogin;
        private checkCustomEvents;
        /**
         * 点击分享按钮
         * @param sharepid 分享点ID
         * @param shareid 分享内容ID
         */
        shareStat(sharepid: number, shareid: number): void;
        /**
         * 点击跳转广告
         * @param locationID
         * @param ad_page_id 广告页面ID
         * @param advid 广告位ID
         * @param adid 广告内容ID
         */
        navigationStat(locationID: LocationID, ad_page_id: number, advid: number, adid: number, order_num?: number, effect_type?: number, gameID?: number): void;
        /**
         * 点击跳转广告的确定按钮
         * @param locationID
         * @param ad_page_id 广告页面ID
         * @param advid 广告位ID
         * @param adid 广告内容ID
         */
        navigationConfirmStat(locationID: LocationID, ad_page_id: number, advid: number, adid: number, order_num?: number, effect_type?: number, gameID?: number): void;
        sendAdShowTimeEvents(gameID: number, ads: {
            adPageId: number;
            advid: number;
            adid: number;
            effectType: EffectType;
            order: number;
            duration: number;
        }[]): void;
        /**
         *
         * @param id 事件ID
         * @param name 事件名称
         */
        addYokaStat(id: number, name: string, params?: object): void;
        protected getPostData(events: object[]): any;
        /**
         * 获取网络类型：2g、3g、4g、wifi、unkown、none
         */
        protected abstract netType(): string;
        /**
         * 根据平台初始化特定的参数
         */
        protected abstract initParams(): any;
        /**
         * 根据平台发送事件内容
         * @param event
         */
        protected onShow(): void;
        protected onHide(): void;
        private getNetType;
        /**
         * 启动事件与登录事件参数相同。启动事件没有UID， 登录事件有UID
         * @param uid
         */
        private getLoginEvent;
        private getInitParams;
        protected sendCustomEvent(parameters: any, force?: boolean, success?: Laya.Handler, fail?: Laya.Handler): void;
        /**
         * 根据平台发送事件内容
         * @param event
         */
        protected sendEvent(events: object[], success?: Laya.Handler, fail?: Laya.Handler): void;
        protected getRandom(): string;
    }
}
declare module zm {
    class YokaShare {
        constructor(share: ShareHelper, shareConfig: ShareConfig);
        private share;
        private shareConfig;
        init(gameID: number, uid?: string): void;
        UID: string;
        shareTipsRes(bg: string, button: string, stateNum?: number): void;
        shareStatus(shareTag: string): ShareStauts;
        /**
         *
         * @param shareTag 分享点标签
         * @param query 分享参数
         * @param success 分享成功回调
         * @param fail 分享失败回调
         * @param title 强制使用标题
         * @param image 强制使用图片url
         */
        shareMessage(shareTag: string, query?: any, success?: Laya.Handler, fail?: Laya.Handler, title?: string, image?: string): void;
        shareScreenShot(shareTag: string, title: string, container: Laya.Sprite, rect: Rect, query?: any, success?: Laya.Handler, fail?: Laya.Handler): void;
        defaultShareConfig(title: string, img: string): void;
        rewardShareEnable(): boolean;
        zmGameTriggerState(triggerKey: string): boolean;
    }
}
declare namespace CustomAdConfig {
    /**
     * 自定义广告配置地址
     */
    let CustomAdHost: string;
    let HOST: string;
    /**
     * 获取最新配置间隔
     */
    let INTERVAL_TIME: number;
    /**
     * 游戏平台id
     * 各个游戏自定义
     */
    let PlatformId: number;
    let UID: string;
    /**
     * 必须定义各自游戏的pages映射
     */
    function getPages(): {
        "StartView": number;
        "ReviveView": number;
        "SummaryView": number;
    };
    /**
     * 吊坠每毫秒转动角度
     */
    let PendantShakeAnglePerMs: number;
    /**
     * 吊坠摇摆角度限制
     */
    let PendantShakeAngleLimit: number;
    /**
     * 摇摆角度限制
     */
    let ShakeAngleLimit: number;
    /**
     * 暂停摇摆时间
     */
    let ShakeBreakTime: number;
    /**
     * 一轮摇摆次数
     */
    let ShakeTurn: number;
    /**
     * 每毫秒转动角度
     */
    let ShakeAnglePerMs: number;
    /**
     * 每毫秒透明度变化
     */
    let BlinkPerMs: number;
    /**
     * 暂停闪烁时间
     */
    let BlinkBreakTime: number;
    /**
     * 闪烁最低透明度
     */
    let BlinkMinAlpha: number;
    /**
     * 一轮闪烁次数
     */
    let BlinkTurn: number;
    /**
     * guess类广告switch时间间隔
     */
    let AdSwitchTime: number;
    /**
     * guess类广告每毫秒Roll幅度
     */
    let AdRollPerMs: number;
}
/**
 * 展示类型
 */
declare enum AdImgType {
    PNG = 0,
    JPG = 1,
    GIF = 2
}
/**
 * 响应类型
 */
declare enum AdRespondType {
    Jump = 1,
    JumpTwice = 2,
    QRCode = 3,
    Link = 4
}
/**
 * 广告位坐标类型
 */
declare enum AdPosType {
    Normal = 1,
    Center = 2,
    LRTB = 3,
    None = 4
}
/**
 * 广告位动画类型
 */
declare enum AnimationType {
    Normal = 0,
    Shake = 1,
    Blink = 2
}
/**
 * 广告位展示类型
 */
declare enum AdContainType {
    Single = 0,
    Menu = 4,
    Guess = 5,
    PlayGame = 6,
    More = 7,
    BannerGuess = 8,
    Box = 9,
    Backup = 10,
    Pendant = 11,
    VideoAd = 12,
    FullScreen = 13,
    CustomizedBanner = 14
}
/**
 * 猜你喜欢类型
 */
declare enum GuessType {
    Horizontal = 0,
    Vertical = 1
}
/**
 * 抽屉类型
 */
declare enum DrawerType {
    Menu_Top = 0,
    Menu_Bottom = 1,
    Menu_Left = 2,
    Menu_Right = 3,
    Menu_All = 4
}
/**
 * 好友在玩/banner猜你喜欢 动画类型
 */
declare enum AdGuessAnimationType {
    Switch = 0,
    Roll = 1
}
declare class AdContent {
    private _adId;
    private _adName;
    private _gameName;
    private _imgType;
    private _respondType;
    private _linkValue;
    private _system;
    private _online;
    private _resUrl;
    private _resUrlPrefix;
    private _iconType;
    private _effectType;
    private _param;
    private _path;
    private _order;
    private _showTime;
    private _frameLength;
    private _interval;
    private constructor();
    static parseData(data: any, order: number): AdContent;
    private checkResType;
    /**
     * 广告资源图（gif取第一张）
     */
    readonly resUrl: string;
    readonly adId: number;
    readonly adName: string;
    readonly gameName: string;
    readonly respondType: AdRespondType;
    readonly linkValue: string;
    readonly param: string;
    readonly system: string;
    readonly online: boolean;
    readonly iconType: string;
    readonly showTime: number;
    readonly frameLength: number;
    readonly interval: number;
    readonly effectType: EffectType;
    readonly path: string;
    readonly order: number;
    /**
     * 创建一组动画的url数组（美术资源地址数组）
     */
    readonly aniUrls: any;
    /**
      * 广告内容资源
      */
    readonly resUrls: Array<any>;
}
declare class AdContainer {
    private _containerId;
    private _containName;
    private _conWidth;
    private _conHeight;
    private _posType;
    private _effectType;
    private _containerType;
    private _conX;
    private _conY;
    private _conLeft;
    private _conRight;
    private _conTop;
    private _conBottom;
    private _conCenterX;
    private _conCenterY;
    private _contents;
    private constructor();
    static parseData(list: Array<any>): Array<AdContainer>;
    static parseOne(data: any): AdContainer;
    /**
     * @param contents 广告位的绑定内容
     */
    private parseContent;
    readonly contents: Array<AdContent>;
    readonly containerId: number;
    readonly containName: string;
    readonly conWidth: number;
    readonly conHeight: number;
    readonly posType: AdPosType;
    readonly effectType: AnimationType;
    readonly containerType: AdContainType;
    readonly conX: number;
    readonly conY: number;
    readonly conLeft: number;
    readonly conRight: number;
    readonly conTop: number;
    readonly conBottom: number;
    readonly conCenterX: number;
    readonly conCenterY: number;
    readonly allAdIconRes: Array<any>;
}
declare class AdLoader {
    private static cache;
    static load(url: any, complete?: laya.utils.Handler, progress?: laya.utils.Handler): Laya.LoaderManager;
}
declare class AdIcon extends Laya.Sprite {
    constructor();
    private _iconImg;
    private _interval;
    private _iconUrils;
    private _isLoop;
    private _inPlay;
    private _playIndex;
    readonly iconImg: Laya.Image;
    private init;
    clear(): void;
    /**
     * 设置icon属性
     */
    setIcon(iconWidth: number, iconHeight: number, interval?: number): void;
    /**
     * 加载图片资源，支持 单张/多张，默认显示第一张
     * @param urls 图片资源数组
     */
    loadImages(urls: Array<string>): void;
    private setSkin;
    /**
     * 播放图片
     * @param loop 默认循环播放
     */
    play(loop?: boolean): void;
    private startLoop;
    private stopLoop;
    private onLoop;
    stop(): void;
}
declare class AdClickHandler {
    static jumpApp(jumpAppId: string, pageId: number, containerId: number, adcontent: AdContent, success?: laya.utils.Handler, fail?: laya.utils.Handler): void;
    private static checkAdParam;
    private static parseAdParam;
    static showQRCode(qrcodeUrl: string): void;
    static openAd(ad: AdContent, pageId: number, adContainerId: number, success?: laya.utils.Handler, fail?: laya.utils.Handler): void;
}
declare class AdReddotHelper {
    private static AdIconReddotKey;
    private static Reddot_Show;
    private static Reddot_Hide;
    private static ReddotPool;
    private static ReddotList;
    static addReddot(container: any, pageId: number, containerId: number, content: AdContent): void;
    static updateReddotState(pageId: number, containerId: number, content: AdContent): void;
    private static getIconReddotState;
    private static saveIconReddotState;
    private static getDotImg;
    private static saveDotImg;
    private static getKey;
    private static readonly dotUrl;
}
declare class AdElement {
    private constructor();
    private static _adElementPool;
    private _icon;
    private _pageId;
    private _containerId;
    private _content;
    private _clickCallback;
    private _canClick;
    private initIcon;
    destroy(): void;
    readonly icon: AdIcon;
    readonly adId: number;
    readonly effectType: EffectType;
    readonly order: number;
    /**
     * 设置广告元件数据
     */
    setData(content: AdContent, iconWidth: number, iconHeight: number, pageId: number, containerId: number, canClick?: boolean, clickCallback?: laya.utils.Handler): void;
    private onClick;
    play(): void;
    stop(): void;
    static creatAdElement(): AdElement;
    static recoverAdElement(element: AdElement): void;
}
declare class AdLantern extends Laya.View {
    constructor();
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _contentIdx;
    private _curContentData;
    private _adElement;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private setUnitPos;
    private onClick;
    private loadAndShow;
    private onLoadRes;
    private onAdEnd;
    private stopAnimation;
    private direction;
    private turn;
    private shake;
    private stopShake;
    private onShakeFrame;
    private blink;
    private stopBlink;
    private onBlinkFrame;
}
declare class AdMenu extends Laya.View {
    constructor();
    static CustomData: any;
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconTxtHeight;
    private static AdIconSpaceW;
    private static AdIconSpaceH;
    private static BorderDiff;
    private static TitleWidth;
    private static TitleHeight;
    private static MoreName;
    private static MaskName;
    private static NeedSlide;
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _isShow;
    private _inMove;
    private _bg;
    private _more;
    private _title;
    private _dot;
    private _panel;
    private _mask;
    private _iconPanel;
    private _curElements;
    private _drawerType;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private showAndHide;
    private movePos;
    private adTimeShow;
    private adTimeHide;
    private dotEffect;
    private setMenuLayout;
    private setUnitPos;
    private onClick;
    private loadAndShow;
    private loadBg;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private clearElements;
    private getDrawerType;
    private readonly moreBtnDown;
    private readonly btnSizePt;
    private readonly btnOutUrl;
    private readonly btnInUrl;
    private readonly dotUrl;
    private readonly titleUrl;
    private readonly bgUrl;
    private readonly bgSizeGrid;
    private readonly layoutStyle;
    readonly isHorizontal: boolean;
}
declare class AdMenuNew extends Laya.View {
    constructor();
    static CustomData: any;
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconTxtHeight;
    private static AdIconSpaceW;
    private static AdIconSpaceH;
    private static BorderDiff;
    private static MoreName;
    private static MaskName;
    private static NeedSlide;
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _isShow;
    private _inMove;
    private _bg;
    private _more;
    private _dot;
    private _panel;
    private _mask;
    private _iconPanel;
    private _curElements;
    private _drawerType;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private showAndHide;
    private movePos;
    private adTimeShow;
    private adTimeHide;
    private dotEffect;
    private setMenuLayout;
    private setUnitPos;
    private onClick;
    private loadAndShow;
    private loadBg;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private clearElements;
    private getDrawerType;
    private readonly moreBtnDown;
    private readonly btnSizePt;
    private readonly btnOutUrl;
    private readonly btnInUrl;
    private readonly dotUrl;
    private readonly bgUrl;
    private readonly bgSizeGrid;
    private readonly layoutStyle;
    readonly isHorizontal: boolean;
}
interface IAdGuess {
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any, DesignData: any): any;
    clear(): any;
    guessType: GuessType;
    pageId: number;
}
declare class AdGuess extends Laya.View implements IAdGuess {
    constructor();
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconTxtHeight;
    private static readonly AdIconSpaceW;
    private static readonly AdIconSpaceH;
    private static readonly BorderDiffWidth;
    private static readonly BorderDiffHeight;
    private static AdAnimationType;
    private CustomeData;
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _curContents;
    private _bg;
    private _iconPanel;
    private _realSpaceW;
    private _realSpaceH;
    private _showCount;
    private _rollValue;
    private _rollInterval;
    private _rollValueMax;
    private _curElements;
    readonly pageId: number;
    readonly guessType: GuessType;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any, DesignData?: any): void;
    clear(): void;
    private setMenuLayout;
    private setUnitPos;
    private loadAndShow;
    private loadBg;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private showRollAd;
    private MouseDown;
    private MouseUp;
    private onRollChange;
    private startRoll;
    private stopRoll;
    private onAdRoll;
    private showSwitchAd;
    private adIconLayout;
    private onAdSwitch;
    private getShowContents;
    private clearElements;
    private readonly isDefauleBg;
    private readonly needName;
    private readonly borderDiffWidth;
    private readonly borderDiffHeight;
    private readonly bgUrl;
    private readonly bgSizeGrid;
    private readonly iconNum;
    private readonly containerWidth;
    private readonly containerHeight;
    private readonly offSetLeft;
    private readonly offSetTop;
    private readonly fontColor;
    private readonly autoScroll;
}
declare class AdGuessScroll extends Laya.View implements IAdGuess {
    private static RollValue;
    private static AdIconTxtHeight;
    private _conData;
    private isVertical;
    private itemWidth;
    private itemHeight;
    private spaceX;
    private spaceY;
    private CustomeData;
    private panel;
    private scrollBar;
    private realItemHeight;
    private totalOffset;
    private offset;
    private tempValue;
    private contents;
    constructor();
    private _pageId;
    readonly pageId: number;
    readonly guessType: GuessType;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any, DesignData?: any): void;
    clear(): void;
    private clearContents;
    private onLoadAdIcons;
    private addItem;
    private setRollState;
    private onLoop;
    private onMouseDown;
    private onMouseUp;
    private readonly needName;
    private readonly fontColor;
    private readonly autoScroll;
    private readonly needBorder;
    private readonly skinBgItem;
    private readonly itemBgSizeGrid;
    private readonly itemBgContentWidthOffset;
    private readonly itemBgContentHeightOffset;
}
declare class AdFactory {
    static getAdGuess(type: GuessType): IAdGuess;
}
declare class AdPendant extends Laya.View {
    constructor();
    static CustomData: any;
    static PendantNum: number;
    private static PendantCount;
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _pendantWidth;
    private _pendantHeight;
    private _curContentData;
    private _adElement;
    private _lineImg;
    static clearPageData(): void;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private setUnitPos;
    private readonly lineUrl;
    private readonly lineWidth;
    private readonly lineLength;
    private readonly swingRange;
    private readonly swingAnglePerMs;
    private loadAndShow;
    private loadLine;
    private onLoadLineRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private stopAnimation;
    private direction;
    private shake;
    private stopShake;
    private onShakeFrame;
}
declare class CustomAdData {
    static GuessCustomeData: any;
    private _adLanternPool;
    private _curLanterns;
    private _adMenuPool;
    private _curMenus;
    private _adMenuNewPool;
    private _curMenuNews;
    private _adGuessPool;
    private _curGuesss;
    private _adPendantPool;
    private _curPendants;
    private _pageData;
    constructor();
    getPageConfig(pageId: number): Array<AdContainer>;
    parseServerData(pageId: number, data: any): void;
    creatAdLantern(): AdLantern;
    removeAllAdLanternByPage(pageId: number): void;
    creatAdMenu(): AdMenu;
    removeAllAdMenuByPage(pageId: number): void;
    creatAdMenuNew(): AdMenuNew;
    removeAllAdMenuNewByPage(pageId: number): void;
    creatAdGuess(type: GuessType): IAdGuess;
    removeAllAdGuessByPage(pageId: number): void;
    creatAdPendant(): AdPendant;
    removeAdPendantByPage(pageId: number): void;
    getCurPageAdContainerByType(pageId: number, type: AdContainType): Array<AdContainer>;
}
declare module ui.customad {
    class AdTaskItemUIUI extends Laya.View {
        bg: Laya.Image;
        txtName: Laya.Label;
        btnAd: Laya.Button;
        iconBox: Laya.Box;
        static uiView: any;
        constructor();
        createChildren(): void;
    }
}
declare class AdTask extends Laya.View {
    private static _instance;
    static readonly instance: AdTask;
    constructor();
    static CustomData: any;
    private static AdTaskey;
    private static NeedSlide;
    private static AdItemWidth;
    private static AdItemHeight;
    private static AdItemSpaceW;
    private static AdItemSpaceH;
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconSpaceH;
    private static TaskCheckLevel;
    private _pageId;
    private _parentCon;
    private _conData;
    private _contents;
    private _filterContents;
    private _taskData;
    private _startTaskTimeMark;
    private _startTaskAppId;
    private _iconPanel;
    private _itemList;
    private _curElements;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private onGameShow;
    private doCallback;
    private getTaskData;
    private getTaskInfoByAppId;
    private saveTaskData;
    private setMenuLayout;
    private setUnitPos;
    private onClick;
    private clickIcon;
    private jumpSuccess;
    private loadAndShow;
    private loadBg;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private filterContents;
    private refreshItem;
    private clearElements;
    private readonly itemBgUrl;
    private readonly btnGoUrl;
    private readonly btnGainUrl;
    private readonly itemBgSizeGrid;
    private readonly itemNameFontSize;
    private readonly iconNum;
    private readonly containerWidth;
    private readonly containerHeight;
    private readonly fontColor;
    private readonly font;
    private readonly btnStateNum;
}
declare class AdTaskInfo {
    static creatInfo(appId: string): AdTaskInfo;
    static parseInfo(valueStr: string): AdTaskInfo;
    private constructor();
    private static everyday;
    private _appId;
    private _taskState;
    private _timeMark;
    readonly appId: string;
    readonly canGain: boolean;
    finishTask(): void;
    gainReward(): void;
    private taskState;
    readonly valueStr: string;
}
declare class AdBox extends Laya.View {
    private static _instance;
    static readonly instance: AdBox;
    constructor();
    static CustomData: any;
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconTxtHeight;
    private static AdIconSpaceW;
    private static AdIconSpaceH;
    private static BorderDiff;
    private static MaskName;
    private static CloseBtnName;
    private _pageId;
    private _conData;
    private _contents;
    private _isShow;
    private _bg;
    private _title;
    private _closeImg;
    private _panel;
    private _mask;
    private _iconPanel;
    private _curElements;
    readonly pageId: number;
    setUnit(pageId: number, adContainer: AdContainer, parentCon?: any): void;
    private doCallback;
    clear(): void;
    private setMenuLayout;
    private setUnitPos;
    private onClick;
    showAdBox(): void;
    private onShow;
    private adTimeShow;
    private adTimeHide;
    private closeAdBox;
    private onClose;
    private loadAndShow;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private setAdIcons;
    private clearElements;
    private readonly containerWidth;
    private readonly containerHeight;
    private readonly titleUrl;
    private readonly closeUrl;
    private readonly bgUrl;
    private readonly bgSizeGrid;
    private readonly layoutStyle;
    private readonly itemNameFontSize;
    private readonly fontColor;
    private readonly font;
    private readonly titleDiff;
    private readonly closeBtnDiff;
    private readonly offSetTop;
    private bgRes;
    preload(adContainer: AdContainer): void;
    private preloadSuc;
}
declare class AdFullScreen extends Laya.View {
    private static _instance;
    static readonly instance: AdFullScreen;
    constructor();
    static CustomData: any;
    private static CloseBtnName;
    private _pageId;
    private _hotData;
    private _friendData;
    private _isShow;
    private _bgScreen;
    private _maskScrll;
    private _panel;
    private _boxFriend;
    private _boxHot;
    private _titleFriend;
    private _titleHot;
    private _closeImg;
    private _adFriend;
    private _adHot;
    readonly pageId: number;
    readonly hasAdGuess: boolean;
    setUnit(pageId: number, hotCon: AdContainer, friendCon: AdContainer, adFriend?: IAdGuess, adHot?: IAdGuess): void;
    private doCallback;
    clear(): void;
    private getMinScale;
    private setMenuLayout;
    private setUnitBox;
    private onClick;
    showAdFullScreen(): void;
    private onShow;
    private onMouseOver;
    private onMouseOut;
    private closeAdFullScreen;
    private onClose;
    private loadAndShow;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private readonly skinBgScreen;
    private readonly skinScrollMask;
    private readonly skinTitleFriend;
    private readonly skinBgFriend;
    private readonly skinTitleHot;
    private readonly skinBtnCloseDown;
    private readonly skinBtnCloseUp;
    private readonly skinBgHotItem;
    private bgRes;
    preload(adContainer: AdContainer): void;
    private preloadSuc;
}
declare class BannerGuess extends Laya.View {
    constructor();
    static CustomData: any;
    private static AdIconWidth;
    private static AdIconHeight;
    private static AdIconTxtHeight;
    private static AdIconSpaceW;
    private static AdIconSpaceH;
    private static BorderDiff;
    private static AdAnimationType;
    private _pageId;
    private _conData;
    private _contents;
    private _curContents;
    private _bg;
    private _iconPanel;
    private _showCount;
    private _rollValue;
    private _rollInterval;
    private _rollValueMax;
    private _showGuess;
    private _loadGuess;
    private _curElements;
    readonly pageId: number;
    show(): void;
    hide(): void;
    dispose(): void;
    private doShowGuess;
    setUnit(pageId: number, adContainer: AdContainer, parentCon: any): void;
    clear(): void;
    private setMenuLayout;
    private setUnitPos;
    private loadAndShow;
    private loadBg;
    private onLoadBgRes;
    private loadAdIcons;
    private onLoadAdIcons;
    private showRollAd;
    private MouseDown;
    private MouseUp;
    private onRollChange;
    private startRoll;
    private stopRoll;
    private onAdRoll;
    private showSwitchAd;
    private adIconLayout;
    private onAdSwitch;
    private getShowContents;
    private clearElements;
    private readonly isDefauleBg;
    private readonly needName;
    private readonly bgUrl;
    private readonly bgSizeGrid;
    private readonly iconNum;
    private readonly containerWidth;
    private readonly containerHeight;
    private readonly offSetLeft;
    private readonly offSetTop;
    private readonly fontColor;
}
declare class BannerAd {
    private _adUnitId;
    private _bannerAd;
    private _loaded;
    constructor(adUnitId: string);
    static bannerLoadCallback: laya.utils.Handler;
    readonly adUnitId: string;
    readonly loaded: boolean;
    create(designWidth: number, designHeight: number, left?: number, top?: number, maxHeight?: number, designStyle?: Laya.Point): void;
    show(): void;
    hide(): void;
    destroy(): void;
}
declare class CustomizedBanner extends Laya.View {
    constructor();
    private _pageId;
    private _conData;
    private _contents;
    private _contentIdx;
    private _curContentData;
    private _adElement;
    private _showFlag;
    private _loadFlag;
    readonly pageId: number;
    show(): void;
    hide(): void;
    private checkShow;
    dispose(): void;
    setUnit(pageId: number, adContainer: AdContainer, designStyle: Laya.Point, designHeight: number, left?: number, top?: number): void;
    private clear;
    private setUnitPos;
    private onClick;
    private loadAndShow;
    private onLoadRes;
    private onAdEnd;
}
declare class BannerAdManager {
    private _bannerShowFlag;
    private _iphoneXEnable;
    private _curPageId;
    private _curAdUnitId;
    private _curAd;
    private _pageInstance;
    private _hasZmBannerData;
    private _curGuessData;
    private _curGuess;
    private _curBackupData;
    private _curBackup;
    private _curCustomBannerData;
    private _curCustomBanner;
    private _interval;
    private _styleWidth;
    private _styleHeight;
    private _styleLeft;
    private _styleTop;
    private _fixedHeight;
    private _designStyle;
    /**
     * @param width         广告宽度
     * @param height        广告高度
     * @param left          广告左上角横坐标
     * @param top           广告左上角纵坐标
     * @param interval      广告刷新时间
     * @param fixedHeight   广告绝对高度，不管怎么适配都是这么高
     * @param designStyle   游戏设计宽高  默认720*1440
     * @param customProperty banner型猜你喜欢 自定义属性[宽，高，字号，颜色，个数，样式，偏移等]
     * @param iphoneXEnable iphoneX的banner广告是否开启（猜你喜欢类自定义广告始终开启）
     */
    initBanner(width?: number, height?: number, left?: number, top?: number, interval?: number, fixedHeight?: number, designStyle?: Laya.Point, customProperty?: any, iphoneXEnable?: boolean): void;
    private bannerCallback;
    setPageBanner(adUnitId?: string, pageId?: number, pageInstance?: Laya.Sprite, interval?: number): void;
    updateGuess(adContainerData: AdContainer): void;
    updateBackup(adContainerData: AdContainer): void;
    updateCustomBanner(adContainerData: AdContainer): void;
    showBanner(): void;
    showBannerAfterLoaded(pageId: number): void;
    private doShow;
    hideBanner(): void;
    private showZmBannerAd;
    private removeZmBannerAd;
    private showCustomBanner;
    private removeCustomBanner;
    private showGuess;
    private removeGuess;
    private showBackup;
    private removeBackup;
    private showWxBanner;
    private removeWxBanner;
    private updateBanner;
    private creatNewAd;
    removeBanner(): void;
    private checkPhoneWxBannerEnable;
    private checkIphoneX;
    private checkPhoneScreenOverWidth;
}
interface adTime {
    adPageId: number;
    advid: number;
    adid: number;
    order: number;
    effectType: EffectType;
    start: number;
    duration: number;
}
declare namespace zm {
    class AdShowTime {
        private adInfoes;
        private onShowTime;
        private currentPageId;
        private eventQueue;
        private lastStatTime;
        private static _instance;
        static readonly instance: AdShowTime;
        constructor();
        adShow(adPageId: number, advid: number, adid: number, order: number, effectType: EffectType): void;
        adHide(adPageId: number, advid: number, adid: number, order: number, effectType: EffectType, isShow?: boolean): void;
        private pushEvent;
        private checkQueueLength;
        showPage(adPageId: number): void;
        /**
         * 移除页面的时候发送事件，广告的show标志置为false
         * @param adPageId
         */
        hidePage(adPageId: number): void;
        private stat;
        private getAd;
        private getOrCreateAd;
        /**
         * 切后台后发送统计事件，但是广告的show标志仍然是true,但是清掉start时间
         */
        private onHide;
        private onShow;
    }
}
declare class CustomAdMgr {
    private _bannerMgr;
    private _adDataMgr;
    private _useMenuNew;
    private static _curPageId;
    private static AdEnable;
    private _adShowFlag;
    constructor();
    static readonly curPageId: number;
    platformID: number;
    uid: string;
    /**
     * 设置自定义广告是否启用
     * @param enable
     */
    setAdEnable(enable?: boolean): void;
    /**
     * 跳转配置的更多游戏
     * @param pageid 页面的id
     */
    jumpMoreByPage(pageId: number): void;
    /**
     * 显示聚合页广告
     * @param pageid 页面的id
     * @param posterProperty 聚合页广告容器属性
     * {
    *      *containerWidth:number  宽
    *      *containerHeight:number 高
    *      *pos:any
    *          *{
    *              *x?:number
    *              *y?:number
    *              *left?:number
    *              *top?:number
    *              *right?:number
    *              *bottom?:number
    *              *centerX?:number
    *              *centerY?:number
    *          *}
    *   *bgSkin:string          item背景图 尺寸按九宫格缩放
    *   *bgSizeGrid:string      九宫格
    *   *titleSkin:string        标题图片资源
    *   *titleDiff:number        标题图片偏移
    *   *closeBtnSkin:string        关闭按钮资源
    *   *closeBtnDiff:number        关闭按钮偏移
    *
    *   *fontColor:string  字体颜色 默认 #1A1C28
    *   *font:string  字体 默认 SimHei
    *   *fontSize:number  字体大小 默认 16
    *
    *   *layoutStyle 布局 列*行，默认 new Laya.Point(3,3)三列三行
    *   *offSetTop  布局顶部偏移
    *
    *   *callback:function      关闭回调，无参数
    */
    showAdPoster(pageId: number, posterProperty?: any): void;
    /**
     * 全屏广告
     * @param property 广告容器属性
     * {
     *   *callback:function      关闭回调，无参数
     *   ** 其他属性设置详见代码 AdFullScreen
     * }
     */
    showAdFullScreen(pageId: number, property?: any): void;
    /**
     * 在指定页面上添加广告
     * @param pageid 页面的id
     * @param pageInstance 页面
     */
    addAd(pageid: number, pageInstance: Laya.Sprite): void;
    /**
     * 设置各广告位自定义属性
     * property 自定义广告位-公共属性
     *      *containerWidth:number  宽
     *      *containerHeight:number 高
     *      *bgSkin:string          背景图 尺寸按九宫格缩放
     *      *bgSizeGrid:string      九宫格
     *      *pos:any
     *          *{
     *              *x?:number
     *              *y?:number
     *              *left?:number
     *              *top?:number
     *              *right?:number
     *              *bottom?:number
     *              *centerX?:number
     *              *centerY?:number
     *          *}
     *
     * @param menuProperty 菜单类广告(抽屉类)容器属性
     * {
     *   *layoutStyle 菜单布局 列*行，默认 new Laya.Point(3,4)三列四行
     *   *drawerType?:DrawerType 抽屉类型DrawerType 默认DrawerType.left
     *   *btnOutSkin:string 拉出按钮图  (默认 左->右 其他手动修改btn朝向)
     *   *btnInSkin:string 收起按钮图
     *   *btnSizePt:Laya.Point 抽屉按钮布局(宽,高) 默认(90,75)
     *   *dotSkin:string 红点图
     *   *titleSkin:string 抽屉标题图
     *   *moreBtnDown:boolean 抽拉按钮是否在菜单布局下方
     *   *newVersion:boolean 是否新版本
     *
     *  --ps:
     *      containerHeight 抽屉类广告的高——按照宽度和布局计算出来
     *      pos 默认{left:0, centerY:0}
     * }
     *
     * @param guessProperty 好友在玩 - 广告容器属性
     * {
     *   *iconNum:number 一排显示的数量 3-4
     *   *borderDiffWidth:number 边宽度，设计背景的边宽度，默认5
     *   *borderDiffeight:number 边高度，设计背景的边高度，默认15
     *   *offSetLeft:number 左侧设计偏移，如‘猜你喜欢’标题引起的icon偏移
     *   *offSetTop:number 顶部设计偏移，如‘猜你喜欢’标题引起的icon偏移
     *
     *   *needName:boolean 显示游戏名字,默认false
     *   *guessType:number 猜你喜欢类型,0:单列横向,1多行/列滑动。默认0
     *   *scrollType: number 0:纵向滑动, 1:横向滑动, 默认0
     *   *itemWidth:number 120
     *   *itemHeight:number 120
     *   *spaceX:number 20
     *   *spaceY:number 20
     *   *verticalCon 容器
     *
     *  --ps:
     *      pos 默认{centerY:0, centerY:300}
     * }
     * @param denpantProperty 吊坠广告属性
     * {
     *   *lineUrl:string  吊坠线的资源
     *   *lineWidth:number 线宽度 默认7
     *   *lineLength:number 线长度 默认110
     *   *swingRange:number 摇摆幅度(最大角度值 默认25°)
     *   *swingAnglePerMs:number 没毫秒摆动角度,默认0.02°
     *
     *  --ps:
     *      pos 默认{top:10, centerX:0}
     * }
     */
    setAdCustomData(menuProperty?: any, guessProperty?: any, denpantProperty?: any): void;
    /**
     * @param width         广告宽度
     * @param height        广告高度
     * @param left          广告左上角横坐标
     * @param top           广告左上角纵坐标
     * @param interval      广告刷新时间
     * @param fixedHeight   广告绝对高度，不管怎么适配都是这么高
     * @param designStyle   游戏设计宽高  默认720*1440
     * @param customProperty banner型猜你喜欢 自定义属性[宽，高，字号，颜色，个数，样式，偏移等]
     * @param iphoneXEnable iphoneX的banner广告是否开启（猜你喜欢类自定义广告始终开启）
     *
     *  -- left=0 && top=0 ，默认底部居中
     */
    initBanner(width?: number, height?: number, left?: number, top?: number, interval?: number, fixedHeight?: number, designStyle?: Laya.Point, customProperty?: any, iphoneXEnable?: boolean): void;
    /**
     * 添加banner或者banner型猜你喜欢
     * @param adUnitId banner广告uid
     * @param pageid 页面的id —— 如果只要求显示banner，pageId传0，移除时调用hideBanner即可
     * @param pageInstance 页面容器<可以不用，已经废弃，现在banner强制贴在laya.stage最上层>
     * @param interval banner刷新间隔时间，可以根据页面具体配置，单位ms
     */
    setPageBanner(adUnitId?: string, pageId?: number, pageInstance?: Laya.Sprite, interval?: number): void;
    /**
     * 显示banner,需先setPageBanner
     */
    showBanner(): void;
    /**
     * 隐藏banner,需先setPageBanner
     */
    hideBanner(): void;
    /**
      * 显示任务型广告
      * @param pageId 页面的ID
      *
      * @param taskProperty 任务类广告容器属性
      * {
     *      *containerWidth:number   宽
     *      *containerHeight:number  高
     *      *pos:any
     *          *{
     *              *x?:number
     *              *y?:number
     *              *left?:number
     *              *top?:number
     *              *right?:number
     *              *bottom?:number
     *              *centerX?:number
     *              *centerY?:number
     *          *}
      *   *iconNum:number        一屏显示的数量 3-5
      *   *bgSkin:string         item背景图 尺寸按九宫格缩放
      *   *bgSizeGrid:string     九宫格
      *   *btnGainSkin:string    立即试玩 按钮图 231*96;
      *   *btnGoSkin:string      开始游戏  按钮图 231*96;
      *   *fontColor:string      字体颜色 默认 #ffffe3
      *   *font:string           字体 默认 SimHei
      *   *fontSize:number       字体大小 默认 28
      *   *btnStateNum:number    按钮态  默认 1
      *
      *   *everyday:boolean      任务奖励是否每日可领 默认true
      *   *callback:function     领奖回调 返回参数res.result true/false
      *
      * }
      */
    showTaskAd(pageId: number, container: Laya.Sprite, taskProperty?: any): void;
    removeTaskAd(pageId: number): void;
    /**
      * 移除页面的自定义广告
      * @param pageid 页面的ID
      */
    removeAd(pageid: number): void;
    /**
     * 移除最近添加的广告页
     */
    removeLatestAdPage(): void;
    /**
     * 加载每页的自定义广告
     * @param pageid 页面名字。跟游戏自定义页面映射对应
     * @param pageInstance 页面实例，作为广告容器
     */
    setAdByPage(pageid: number, pageInstance: Laya.Sprite): void;
    private loadConfigByPage;
    private onLoadSuc;
    private onLoadFail;
    private showCurPageAd;
    private _adTypes;
    private creatAd;
    private showLantern;
    private showMenu;
    private showGuess;
    private showPendant;
}
declare module zm {
    class RemoteConfig {
        private configURL;
        private config;
        private failure;
        static UpdateInterval: number;
        // static readonly MaxRetryCnt = 3;
        URL: string;
        private onLogin;
        private fetch;
        private onFetchSuccess;
        private onFetchFail;
        getItem(key: string): any;
    }
}
declare module zm {
    interface SharePointContent {
        share_id: number;
        share_tag: string;
        status: ShareStauts;
        remark: string;
        total: number;
        count_weight: number;
        share_contents: ShareContent[];
    }
    interface ShareContent {
        share_content_id: number;
        share_name: string;
        share_content: string;
        share_img: string;
        share_weight: number;
    }
    interface shareObject {
        title: string;
        imageUrl: string;
        query: string;
        sharepid: number;
        shareid: number;
    }
    const enum ShareStauts {
        Enable = 1,
        Disable = 2
    }
    class ShareConfig {
        static ShareCfgHost: string;
        // static readonly ShareCfgUrl = "/api/v1.1/share";
        // static readonly DefaultShareID = -1;
        // static readonly DefaultSharePointID = -1;
        private defaultTitle;
        private defaultImg;
        protected gameID: number;
        protected uid: string;
        protected sharePointContents: {
            [index: string]: SharePointContent;
        };
        private retryCnt;
        init(gameID: number, uid?: string): void;
        UID: string;
        shareStatus(shareTag: string): ShareStauts;
        getSharePointCfg(shareTag: string, title?: string, image?: string, query?: any): shareObject;
        defaultShareConfig(title: string, img: string): void;
        getDefaultConfig(shareTag: string, title?: string, image?: string, query?: any): shareObject;
        private fetchShareCfg;
        private onFetchSuccess;
        private onFetchFail;
        private retryFetchConfig;
    }
}
declare module zm {
    interface StatisticsInfomation {
        br: string;
        md: string;
        pr: number;
        sw: number;
        sh: number;
        ww: number;
        wh: number;
        lang: string;
        sv: string;
        wvv: string;
        fs: number;
        lng: number;
        lat: number;
        spd: number;
        nt: string;
        uu: string;
        ufo: string;
        v: string;
        ts: number;
        rnd: number;
        ev: string;
        ct: string;
        ak: string;
        wv: string;
        wsdk: string;
    }
    abstract class Statistics {
        protected Server: string;
        protected isInit: boolean;
        protected info: StatisticsInfomation;
        init(appId: string, appVersion: string): boolean;
        send(ev: string, ct: string): void;
        protected abstract initDeviceInfo(): boolean;
        protected abstract setUpOnErrorHandler(): void;
        protected abstract upload(info: StatisticsInfomation): void;
    }
}
declare module zm {
    let eventCenter: Laya.EventDispatcher;
    let shareConfig: ShareConfig;
    let shareHelper: ShareHelper;
    let share: YokaShare;
    let system: SystemHelper;
    let statistics: YokaStat;
    let opendata: OpenUtils;
    let submitter: SubmitActionManager;
    let ad: CustomAdMgr;
    let update: UpdateHelper;
    let remoteConfig: RemoteConfig;
    let device: DeviceHelper;
    let login: LoginHandler;
    let api: API;
    let stat: Statistics;
    let appId: string;
    let shouldSendStat: boolean;
    const Stat_Offset = 1000;
    function gameID(): number;
    function gameName(): string;
    function version(): string;
    function openID(): string;
    function userID(): string;
    function init(appid: string, gameID: number, gameName: string, version?: string): void;
    function onLogin(rep: LoginRep): void;
}
declare module zm {
    class MiniYokaStat extends YokaStat {
        constructor();
        // protected onMiniShow(res: wx.LaunchOptions): void;
        protected initParams(): void;
        protected initSystemInfo(): void;
        private str2ostype;
        // protected initLaunchOptions(ops: wx.LaunchOptions): void;
        // protected initShareQuery(ops: wx.LaunchOptions): void;
        /**
         * 打开方式
         * @param scene  场景值
         */
        private getSceneType;
        protected netType(): string;
        private initDeviceID;
    }
}
declare module zm.events {
    const EventLogin = "EventLogin";
    const EventNetTypeChanged = "EventNetTypeChanged ";
    const EventAppShow = "EventAppShow";
    const EventAppHide = "EventAppHide";
    const EventRemoteCfgLoaded = "EventRemoteCfgLoaded";
    const EventCustomAdLoaded = "EventCustomAdLoaded";
    const EventJumpAppSuccess = "EventJumpAppSuccess";
    const EventJumpAppFail = "EventJumpAppFail";
}
declare module zm {
    const enum LoginStatus {
        Unlogined = 0,
        Logining = 1,
        Logined = 2,
        Failed = 3
    }
    interface LoginRep {
        UID: string;
        Created: string;
        Data: string;
        First: boolean;
        IP: string;
        Message: string;
        OpenID: string;
        Score: number;
        Session: {
            Expire: number;
            ID: string;
        };
        Status: number;
        ActivityID: string;
    }
    abstract class LoginHandler {
        private _loginUrl;
        private openid;
        private sessionId;
        private sessionTime;
        private validityTime;
        private retryCnt;
        private readonly MaxRetry;
        private _status;
        loginUrl: string;
        relogin(): void;
        private login;
        protected abstract doLogin(): any;
        protected loginServer(res: any): void;
        private onLoginServer;
        protected thirdLoginFail(): void;
        protected loginFail(): void;
        private failThenLogin;
        protected loginSuccess(res: LoginRep): void;
        private onNetTypeChanged;
        readonly loginStatus: LoginStatus;
        readonly openID: string;
        updateSessionTime(): void;
        readonly sessionEndTime: number;
        readonly session: string;
    }
}
declare module zm {
    module MiniDevicer {
        function vibrateShort(success?: Laya.Handler, fail?: Laya.Handler): void;
        function vibrateLong(success?: Laya.Handler, fail?: Laya.Handler): void;
        function setVibrateAllow(allow: boolean): void;
        function getVibrateAllow(): boolean;
    }
}
declare module zm.remote {
    const GameVersion = "game_version";
    const ShareEnable = "share_enable";
    const GameTrigger = "game_trigger";
}
declare module zm {
    module MiniShare {
        let shareTipsBg: string;
        let shareTipsBtn: string;
        let shareBtnState: number;
        /**
         * 主动拉起转发，进入选择通讯录界面。
         * @param title
         * @param imageUrl
         * @param query  格式 key1=val1&key2=val2
         */
        function shareAppMessage(title: string, imageUrl: string, query: Object, success: Laya.Handler, fail: Laya.Handler): void;
        function shareScreenShot(container: Laya.Sprite, rect: Rect, title: string, query: Object, success: Laya.Handler, fail: Laya.Handler): void;
        function rewardShareEnable(): boolean;
        function zmGameTriggerState(triggerKey: string): boolean;
    }
}
declare namespace zm {
    // class MiniSystemHelper implements SystemHelper {
    //     readonly runtimePlatform = RuntimePlatform.MiniGame;
    //     private options;
    //     private _sdkVersion;
    //     constructor();
    //     readonly SDKVersion: string;
    //     getLaunchOptions(): LaunchOptions;
    //     private onShow;
    //     private onHide;
    //     onShareAppMessage(tag: string): void;
    //     compareSDKVersion(version: any): 1 | 0 | -1;
    //     exit(): void;
    //     private formatLaunchOptions;
    // }
}
declare module zm {
    interface OpenUtils {
        onLogin(openid: string): any;
        postMessage(cmd: string, data?: any): any;
        /**
         * 默认不刷新纹理
         * @param width
         * @param height
         * @param delay 开始画纹理的时间 单位：ms
         * @param duration 纹理绘制持续时间 -1: 只画一次 0:无限时间 单位：ms
         * @param interval 纹理绘制间隔时间 单位：ms
         */
        refreshSharedSprite(width: number, height: number, delay?: number, duration?: number, interval?: number): Laya.Sprite;
        destroySharedSprite(): any;
    }
}
declare namespace zm {
    const enum SubmitOrder {
        Descend = 1,
        Ascend = 2,
        Accumulate = 3,
        Override = 4
    }
    const enum RankType {
        Friends = 0,
        Group = 1,
        TalkingGroup = 2,
        C2C = 3,
        World = 4
    }
    interface WorldRankRep {
        OpenID: string;
        Score: number;
        Name?: string;
        Avatar?: string;
        Created: string;
    }
    const enum RankPeriod {
        Never = 0,
        Day = 1,
        Week = 2,
        Month = 3,
        Year = 4
    }
    interface Command {
        cmd: string;
        data?: object;
    }
    interface SubmitScoreCommand {
        key: string;
        order: SubmitOrder;
        score: number;
        period: RankPeriod;
    }
    interface MatchUserRep {
        openid: string;
        seatid: number;
        isMaster: boolean;
        avatar?: string;
        nickname?: string;
        score?: number;
        reward?: number;
    }
    interface RankCommand {
        key: string;
        order: SubmitOrder;
        gid?: string;
        score?: number;
    }
}
declare module zm {
    class MiniOpenUtils implements OpenUtils {
        private readonly ResizeShared;
        private readonly UserInfo;
        private openSprite;
        private sharedTexture;
        private wxSharedCanvas;
        onLogin(openid: string): void;
        postMessage(cmd: string, data?: any): void;
        /**
         * 默认不刷新纹理
         * @param width
         * @param height
         * @param delay 开始画纹理的时间 单位：ms
         * @param duration 纹理绘制持续时间 -1: 只画一次 0:无限时间 单位：ms
         * @param interval 纹理绘制间隔时间 单位：ms
         */
        refreshSharedSprite(width: number, height: number, delay?: number, duration?: number, interval?: number): Laya.Sprite;
        destroySharedSprite(): void;
        private resizeSharedSprite;
        private drawSharedTexture;
        private updateSharedTexture;
        private readonly sharedCanvas;
        private destroySharedTexture;
        private clearTimer;
        private isOpenSpriteValid;
    }
}
declare module zm {
    abstract class SubmitAction {
        private static MaxRetryCnt;
        private _isSubmitting;
        private retryCnt;
        private complete;
        protected score: number;
        protected key: string;
        protected startMs: number;
        protected endMs: number;
        protected order: SubmitOrder;
        // protected data: wx.KVData | any;
        toResubmit: boolean;
        readonly isSubmitting: boolean;
        reset(key: string, score: number, startMs: number, endMs: number, order: SubmitOrder): void;
        private resubmit;
        protected submitSuccess(): void;
        protected submitFail(): void;
        submit(complete?: Laya.Handler): void;
        protected doSubmit(): void;
    }
}
declare module zm {
    class MiniSubmitAction extends SubmitAction {
        protected doSubmit(): void;
    }
}
declare module zm {
    class SubmitActionManager {
        constructor(action: {
            new (): SubmitAction;
        });
        private submitAction;
        private actions;
        private queue;
        private addAction;
        private removeAction;
        private getAction;
        private onSubmitComplete;
        submit(key: string, score: number, startMs: number, endMs: any, order: SubmitOrder): void;
    }
}
declare module zm.http {
    function wxRequest(method: string, url: string, params: any, success: Laya.Handler, fail: Laya.Handler, header: Object): void;
}
declare module zm {
    class MiniLoginHandler extends LoginHandler {
        protected doLogin(): void;
    }
}
declare class Base64 {
    constructor();
    private static _keyStr;
    /** 加密 */
    static encode(msg: string): string;
    /** 解密 */
    static decode(base64Str: string): string;
    private static _utf8_encode;
    private static _utf8_decode;
    /** 判断是否是Base64 */
    static isBase64(str: string): boolean;
}
declare module zm {
    const enum APIStatus {
        Online = 0,
        Offline = 1
    }
    abstract class API {
        private apiBase;
        private session;
        private sessionValidity;
        private sessionExpire;
        private openid;
        private status;
        private retryCnt;
        private readonly MaxRetry;
        init(apiBase: string): void;
        private onNetTypeChanged;
        private updateSession;
        readonly OpenID: string;
        readonly Status: APIStatus;
        readonly Session: string;
        abstract login(success?: Laya.Handler, fail?: Laya.Handler): void;
        loginZmServer(params: object, success?: Laya.Handler, fail?: Laya.Handler): void;
        protected loginServer(params: object, success?: Laya.Handler, fail?: Laya.Handler): void;
        protected loginFailed(success?: Laya.Handler, fail?: Laya.Handler): void;
        private doGET;
        private GET;
        private doPOST;
        private POST;
        getScore(type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        setScore(score: number, type: number, currency: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        setScoreForce(score: number, type: number, currency: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        setUserInfo(nickname: string, avatar: string, success?: Laya.Handler, fail?: Laya.Handler): void;
        uploadEncodeUserInfo(nickname: string, avatar: string, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRank(type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankList(type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankListLimit(type: number, limit: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankListWithInfo(type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankListWithInfoLimit(type: number, limit: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankListWithDecodeInfo(type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getRankListWithDecodeInfoLimit(type: number, limit: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getCurrency(success?: Laya.Handler, fail?: Laya.Handler): void;
        setCurrency(currency: number, type: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        getItemList(success?: Laya.Handler, fail?: Laya.Handler): void;
        setItem(itemid: number, count: number, success?: Laya.Handler, fail?: Laya.Handler): void;
        setData(data: object, success?: Laya.Handler, fail?: Laya.Handler): void;
        getSign(success?: Laya.Handler, fail?: Laya.Handler): void;
        setSign(success?: Laya.Handler, fail?: Laya.Handler): void;
        getInviteList(success?: Laya.Handler, fail?: Laya.Handler): void;
        completeInvite(openid: string, success?: Laya.Handler, fail?: Laya.Handler): void;
        finishInvite(taskid: number, reset: boolean, success?: Laya.Handler, fail?: Laya.Handler): void;
        msgSecCheck(content: string, success?: Laya.Handler, fail?: Laya.Handler): void;
        subscribeMessage(templateId: string, data: string, delaySecond: number, page?: string, success?: Laya.Handler, fail?: Laya.Handler): void;
    }
}
declare module zm {
    class MiniAPI extends API {
        login(success?: Laya.Handler, fail?: Laya.Handler): void;
    }
}
declare namespace zm {
    interface UpdateHelper {
        checkUpdate(callback: Laya.Handler): any;
    }
}
declare namespace zm {
    const enum UpdateStatus {
        unchecked = 0,
        none = 1,
        hasUpdate = 2,
        UpdateReady = 3,
        UpdateFailed = 4
    }
}
declare namespace zm {
    class MiniUpdate implements UpdateHelper {
        private static readonly FailInterval;
        private updateManager;
        private updateStatus;
        private callback;
        checkUpdate(callback: Laya.Handler): void;
        applyUpdate(): void;
        private showUpdateProgress;
        private updateFail;
        private updateSuccess;
        private invokeCallback;
    }
}
declare module zm {
    class MiniStatistics extends Statistics {
        protected setUpOnErrorHandler(): void;
        protected upload(info: StatisticsInfomation): void;
        protected initDeviceInfo(): boolean;
    }
}
declare module zm {
    function initMini(shareConfig: ShareConfig): void;
}
//# sourceMappingURL=zm.mini.core.d.ts.map