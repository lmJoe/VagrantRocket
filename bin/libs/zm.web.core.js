var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var zm;
(function (zm) {
    zm.StatEventNames = {
        Share: "点击分享",
        Navigation: "点击游卡广告",
        Bootup: "启动",
        Duration: "单次时长",
        NavigationConfirm: "点击广告确定"
    };
    var LocationID;
    (function (LocationID) {
        LocationID[LocationID["More"] = 1] = "More";
        LocationID[LocationID["Vip"] = 2] = "Vip";
    })(LocationID = zm.LocationID || (zm.LocationID = {}));
    zm.LocationNames = [];
    zm.LocationNames[LocationID.More] = '更多游戏';
    zm.LocationNames[LocationID.Vip] = '精彩推荐';
})(zm || (zm = {}));
var zm;
(function (zm) {
    var utils;
    (function (utils) {
        /**
         * 生成统计平台的ID
         * @param gameid 后台的游戏id
         */
        function adaptStatID(gameid, offset) {
            if (offset == 1000) {
                if (gameid == 1) {
                    return 1002; //送你回家在统计里的ID
                }
                else if (gameid == 2) {
                    return 1001; //破拆专家在统计里的ID
                }
            }
            return offset + gameid;
        }
        utils.adaptStatID = adaptStatID;
        /**
         * object to xx=xx&yy=yy
         * @param obj
         */
        function obj2query(obj) {
            if (!obj) {
                return '';
            }
            var arr = [];
            for (var key in obj) {
                arr.push(key + '=' + obj[key]);
            }
            return arr.join('&');
        }
        utils.obj2query = obj2query;
        function compareVersion(version1, version2) {
            var v1 = version1.split('.');
            var v2 = version2.split('.');
            var len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (var i = 0; i < len; i++) {
                var num1 = parseInt(v1[i]);
                var num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
        utils.compareVersion = compareVersion;
    })(utils = zm.utils || (zm.utils = {}));
})(zm || (zm = {}));
/// <reference path="../utils.ts" />
var zm;
/// <reference path="../utils.ts" />
(function (zm) {
    var http;
    (function (http) {
        ;
        function POST(url, params, success, fail, header, retryCnt) {
            if (retryCnt === void 0) { retryCnt = 0; }
            if (!http.request) {
                if (fail) {
                    fail.run();
                }
                return;
            }
            var task = getRequestTask();
            task.init(url, 'post', JSON.stringify(params), success, fail, header, retryCnt);
        }
        http.POST = POST;
        function GET(url, params, success, fail, header, retryCnt) {
            if (retryCnt === void 0) { retryCnt = 0; }
            if (!http.request) {
                if (fail) {
                    fail.run();
                }
                return;
            }
            var query = zm.utils.obj2query(params);
            if (query) {
                url += '?' + query;
            }
            var task = getRequestTask();
            task.init(url, 'get', null, success, fail, header, retryCnt);
        }
        http.GET = GET;
        var tasks = [];
        function getRequestTask() {
            if (tasks.length == 0) {
                return new RequestTask;
            }
            else {
                return tasks.pop();
            }
        }
        var RequestTask = /** @class */ (function () {
            function RequestTask() {
            }
            RequestTask.prototype.init = function (url, method, params, success, fail, header, retryCnt) {
                if (retryCnt === void 0) { retryCnt = 0; }
                this.method = method;
                this.url = url;
                this.params = params;
                this.success = success;
                this.fail = fail;
                this.header = header;
                this.retryCnt = 0;
                this.maxRetryCnt = retryCnt;
                this.request();
            };
            RequestTask.prototype.request = function () {
                this.requestTime = Laya.Browser.now();
                http.request(this.method, this.url, this.params, Laya.Handler.create(this, this.onSuccess), Laya.Handler.create(this, this.onFail), this.header);
            };
            RequestTask.prototype.retry = function () {
                this.retryCnt++;
                this.request();
            };
            RequestTask.prototype.onSuccess = function (data) {
                var success = this.success;
                this.recover();
                if (success) {
                    success.runWith(data);
                }
            };
            RequestTask.prototype.onFail = function () {
                if (this.retryCnt < this.maxRetryCnt) {
                    var delay = this.calculateDelay();
                    Laya.timer.once(delay, this, this.retry);
                }
                else {
                    var fail = this.fail;
                    this.recover();
                    if (fail) {
                        fail.run();
                    }
                }
            };
            RequestTask.prototype.recover = function () {
                this.clear();
                tasks.push(this);
            };
            RequestTask.prototype.clear = function () {
                this.method = null;
                this.url = null;
                this.params = null;
                this.success = null;
                this.fail = null;
                this.header = null;
                this.retryCnt = 0;
                this.maxRetryCnt = 0;
            };
            RequestTask.prototype.calculateDelay = function () {
                var now = Date.now();
                var t = Math.pow(2, this.retryCnt) * 1000;
                var delay = t - now + this.requestTime;
                if (delay < 0) {
                    delay = 0;
                }
                if (delay > 5000) {
                    delay = 5000;
                }
                return delay;
            };
            return RequestTask;
        }());
    })(http = zm.http || (zm.http = {}));
})(zm || (zm = {}));
/**
 * 广告内容特效类型
 */
var EffectType;
/**
 * 广告内容特效类型
 */
(function (EffectType) {
    /*直接跳转*/
    EffectType[EffectType["None"] = 0] = "None";
    /*红点*/
    EffectType[EffectType["Reddot"] = 1] = "Reddot";
})(EffectType || (EffectType = {}));
/*
* 游卡数据统计
*/
/// <reference path="./StatEvents.ts" />
/// <reference path="../http/http.ts" />
/// <reference path="../ad/data/EffectType.ts" />
var zm;
/*
* 游卡数据统计
*/
/// <reference path="./StatEvents.ts" />
/// <reference path="../http/http.ts" />
/// <reference path="../ad/data/EffectType.ts" />
(function (zm) {
    var YokaStat = /** @class */ (function () {
        function YokaStat() {
            this.inited = false;
            this.booted = false;
            this.loaded = false;
            this.showTime = 0;
            this.customEvents = [];
        }
        /**
         * @param openId
         * @param uid
         * @param gameId 在平台的注册的id
         * @param gameName 平台中游戏的名字
         * @param version 游戏版本
         */
        YokaStat.prototype.init = function (openId, uid, gameId, gameName, version) {
            if (this.inited) {
                return;
            }
            this.userName = openId;
            this.userID = uid;
            this.gameIDName = gameId + "-" + gameName;
            this.gameID = gameId;
            this.gameName = gameName;
            this.appVersion = version;
            this.initParams();
            this.sendBootupEvent();
        };
        YokaStat.prototype.initUserInfo = function (openID, uid) {
            this.userName = openID;
            this.userID = uid;
            if (this.booted && this.loaded) {
                this.sendInitLogin();
            }
        };
        YokaStat.prototype.sendLoaded = function () {
            this.loaded = true;
            if (this.booted) {
                this.sendInitLogin();
            }
        };
        YokaStat.prototype.sendBootupEvent = function () {
            this.bootEvent = this.bootEvent || this.getBootupEvent();
            this.sendCustomEvent(this.bootEvent, true, Laya.Handler.create(this, this.onBootup), Laya.Handler.create(this, this.onBootupFail));
        };
        YokaStat.prototype.getBootupEvent = function () {
            var param = this.getInitParams();
            param.event_id = "event" + 1002 /* Bootup */;
            param.event_name = zm.StatEventNames.Bootup;
            return param;
        };
        YokaStat.prototype.onBootup = function () {
            this.booted = true;
            if (this.loaded) {
                this.sendInitLogin();
            }
        };
        YokaStat.prototype.onBootupFail = function () {
            //不是Laya引擎用原生的settimeout
            if (!Laya || !Laya.timer || !Laya.timer.once) {
                setTimeout(this.sendBootupEvent.bind(this), 3000);
            }
            else {
                Laya.timer.once(3000, this, this.sendBootupEvent);
            }
        };
        YokaStat.prototype.onInited = function (res) {
            this.inited = true;
            console.log('yoka stat inited');
            this.checkCustomEvents();
        };
        YokaStat.prototype.onInitFail = function () {
            //不是Laya引擎用原生的settimeout
            if (!Laya || !Laya.timer || !Laya.timer.once) {
                setTimeout(this.sendInitLogin.bind(this), 3000);
            }
            else {
                Laya.timer.once(3000, this, this.sendInitLogin);
            }
        };
        YokaStat.prototype.sendInitLogin = function () {
            if (!this.userName || !this.userID) {
                return;
            }
            this.initLoginEvent = this.initLoginEvent || this.getLoginEvent();
            this.sendEvent([this.initLoginEvent], Laya.Handler.create(this, this.onInited), Laya.Handler.create(this, this.onInitFail));
        };
        YokaStat.prototype.checkCustomEvents = function () {
            if (this.customEvents && this.customEvents.length > 0) {
                this.sendEvent(this.customEvents);
            }
        };
        /**
         * 点击分享按钮
         * @param sharepid 分享点ID
         * @param shareid 分享内容ID
         */
        YokaStat.prototype.shareStat = function (sharepid, shareid) {
            this.addYokaStat(1000 /* Share */, zm.StatEventNames.Share, {
                shareid: shareid,
                sharepid: sharepid
            });
        };
        /**
         * 点击跳转广告
         * @param locationID
         * @param ad_page_id 广告页面ID
         * @param advid 广告位ID
         * @param adid 广告内容ID
         */
        YokaStat.prototype.navigationStat = function (locationID, ad_page_id, advid, adid, order_num, effect_type, gameID) {
            var param = {
                location_id: locationID,
                ad_page_id: ad_page_id,
                advid: advid,
                adid: adid,
            };
            gameID && (param.plat_id = gameID);
            order_num && (param.order_num = order_num);
            effect_type && (param.effect_type = effect_type);
            this.addYokaStat(1001 /* Navigation */, zm.StatEventNames.Navigation, param);
        };
        /**
         * 点击跳转广告的确定按钮
         * @param locationID
         * @param ad_page_id 广告页面ID
         * @param advid 广告位ID
         * @param adid 广告内容ID
         */
        YokaStat.prototype.navigationConfirmStat = function (locationID, ad_page_id, advid, adid, order_num, effect_type, gameID) {
            var param = {
                location_id: locationID,
                ad_page_id: ad_page_id,
                advid: advid,
                adid: adid,
            };
            gameID && (param.plat_id = gameID);
            order_num && (param.order_num = order_num);
            effect_type && (param.effect_type = effect_type);
            this.addYokaStat(1004 /* NavigationConfirm */, zm.StatEventNames.NavigationConfirm, param);
        };
        YokaStat.prototype.sendAdShowTimeEvents = function (gameID, ads) {
            var _this = this;
            if (!ads || ads.length <= 0) {
                return;
            }
            var events = [];
            var parameters;
            var now = Math.floor(Date.now() / 1000);
            ads.forEach(function (ad) {
                parameters = {
                    "userName": _this.userName,
                    "user_id": _this.userID,
                    "user_type": _this.userType,
                    "device_model": _this.deviceModel,
                    "game_id": _this.gameID,
                    "game_name": _this.gameName,
                    "game_id_name": _this.gameIDName,
                    "os_version": _this.osVersion,
                    "app_version": _this.appVersion,
                    "device_id": _this.deviceID,
                    "event_id": '101',
                    "event_name": "广告展示",
                    "ad_page_id": ad.adPageId,
                    "advid": ad.advid,
                    "adid": ad.adid,
                    "order_num": ad.order,
                    "effect_type": ad.effectType,
                    "duration": ad.duration,
                    "net_type": _this.getNetType()
                };
                _this.osType && (parameters.os_type = _this.osType);
                _this.channel && (parameters.channel = _this.channel);
                _this.plan && (parameters.plan = _this.plan);
                gameID && (parameters.plat_id = gameID);
                events.push({
                    id: 4007,
                    label: "mini_game_platform_advertise",
                    start_time: now,
                    parameters: parameters
                });
            });
            this.sendEvent(events);
        };
        /**
         *
         * @param id 事件ID
         * @param name 事件名称
         */
        YokaStat.prototype.addYokaStat = function (id, name, params) {
            var parameters = {
                "userName": this.userName,
                "user_id": this.userID,
                "user_type": this.userType,
                "device_model": this.deviceModel,
                "game_id": this.gameID,
                "game_name": this.gameName,
                "game_id_name": this.gameIDName,
                "os_version": this.osVersion,
                "app_version": this.appVersion,
                "event_id": "event" + id,
                "event_name": name,
                "net_type": this.getNetType()
            };
            if (params) {
                for (var k in params) {
                    if (typeof params[k] === 'number' || typeof params[k] === 'string') {
                        parameters[k] = params[k];
                    }
                }
            }
            this.sendCustomEvent(parameters);
        };
        YokaStat.prototype.getPostData = function (events) {
            if (events && events.length > 0) {
                var data = {
                    "app_id": YokaStat.Yoka_App_Id,
                    "is_server": false,
                    "events": events
                };
                return data;
            }
        };
        /**
         * 根据平台发送事件内容
         * @param event
         */
        // protected abstract sendEvent(event: object);
        YokaStat.prototype.onShow = function () {
            var event = this.getLoginEvent();
            if (event) {
                this.sendEvent([event]);
            }
            this.showTime = Date.now();
        };
        YokaStat.prototype.onHide = function () {
            if (this.showTime > 0) {
                this.addYokaStat(1003 /* Duration */, zm.StatEventNames.Duration, {
                    duration: Date.now() - this.showTime
                });
            }
        };
        YokaStat.prototype.getNetType = function () {
            return this.netType() || "4g";
        };
        /**
         * 启动事件与登录事件参数相同。启动事件没有UID， 登录事件有UID
         * @param uid
         */
        YokaStat.prototype.getLoginEvent = function () {
            var parameters = this.getInitParams();
            var event = {
                id: 4002,
                label: "mini_game_platform_login",
                start_time: Math.floor(Date.now() / 1000),
                parameters: parameters
            };
            this.osType && (event.os_type = this.osType);
            this.channel && (event.channel = this.channel);
            this.plan && (parameters.plan = this.plan);
            return event;
        };
        YokaStat.prototype.getInitParams = function () {
            var parameters = {
                // "userName": this.userName,
                // "user_id": uid,
                "user_type": this.userType,
                "device_model": this.deviceModel,
                "game_id": this.gameID,
                "game_name": this.gameName,
                "game_id_name": this.gameIDName,
                "os_version": this.osVersion,
                "app_version": this.appVersion,
                "device_id": this.deviceID,
                "login_way": this.loginWay,
                "net_type": this.getNetType()
            };
            this.userID && (parameters.user_id = this.userID);
            this.userName && (parameters.userName = this.userName);
            this.locationID && (parameters.location_id = this.locationID);
            this.subgameid && (parameters.subgameid = this.subgameid);
            this.subuid && (parameters.subuid = this.subuid);
            this.ad_page_id && (parameters.ad_page_id = this.ad_page_id);
            this.advid && (parameters.advid = this.advid);
            this.adid && (parameters.adid = this.adid);
            this.sharepid && (parameters.sharepid = this.sharepid);
            this.shareid && (parameters.shareid = this.shareid);
            this.shareuid && (parameters.shareuid = this.shareuid);
            return parameters;
        };
        //②小游戏平台自定义事件
        YokaStat.prototype.sendCustomEvent = function (parameters, force, success, fail) {
            if (force === void 0) { force = false; }
            var event = {
                id: 4005,
                label: "mini_game_platform_times_event",
                start_time: Math.floor(Date.now() / 1000),
                parameters: parameters,
            };
            this.osType && (event.os_type = this.osType);
            this.channel && (event.channel = this.channel);
            this.plan && (parameters.plan = this.plan);
            if (!this.inited && !force) {
                this.customEvents.push(event);
            }
            else {
                this.sendEvent([event], success, fail);
            }
        };
        /**
         * 根据平台发送事件内容
         * @param event
         */
        YokaStat.prototype.sendEvent = function (events, success, fail) {
            console.log("[send event]", events);
            if (!zm.shouldSendStat) {
                return;
            }
            var data = this.getPostData(events);
            if (data) {
                zm.http.POST(YokaStat.Yoka_Url, data, success, fail);
            }
        };
        YokaStat.prototype.getRandom = function () {
            var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var rand;
            var temp;
            for (var i = 10; i > 1; i--) {
                rand = Math.floor(10 * Math.random()),
                    temp = nums[rand];
                nums[rand] = nums[i - 1];
                nums[i - 1] = temp;
            }
            temp = 0;
            for (var i = 0; i < 5; i++) {
                temp = 10 * temp + nums[i];
            }
            return temp + "" + Date.now();
        };
        /*小游戏平台在数据中心登记的产品ID*/
        YokaStat.Yoka_App_Id = "301_0";
        YokaStat.Yoka_Url = "https://ykdc.hzyoka.com/bfrd/json";
        YokaStat.NetTypeKey = "zmntdata";
        YokaStat.UUIDKey = "zmuuiddata";
        return YokaStat;
    }());
    zm.YokaStat = YokaStat;
})(zm || (zm = {}));
/// <reference path="../http/http.ts" />
/// <reference path="./ShareHelper.ts" />
var zm;
/// <reference path="../http/http.ts" />
/// <reference path="./ShareHelper.ts" />
(function (zm) {
    var YokaShare = /** @class */ (function () {
        function YokaShare(share, shareConfig) {
            this.share = share;
            this.shareConfig = shareConfig;
        }
        YokaShare.prototype.init = function (gameID, uid) {
            if (zm.system.runtimePlatform == 0 /* MiniGame */) {
                this.shareConfig.init(gameID, uid);
            }
        };
        Object.defineProperty(YokaShare.prototype, "UID", {
            set: function (uid) {
                this.shareConfig.UID = uid;
            },
            enumerable: true,
            configurable: true
        });
        YokaShare.prototype.shareTipsRes = function (bg, button, stateNum) {
            if (stateNum === void 0) { stateNum = 1; }
            var share = zm.MiniShare;
            if (share) {
                share.shareTipsBg = bg;
                share.shareTipsBtn = button;
                share.shareBtnState = stateNum;
            }
        };
        YokaShare.prototype.shareStatus = function (shareTag) {
            return this.shareConfig.shareStatus(shareTag);
        };
        /**
         *
         * @param shareTag 分享点标签
         * @param query 分享参数
         * @param success 分享成功回调
         * @param fail 分享失败回调
         * @param title 强制使用标题
         * @param image 强制使用图片url
         */
        YokaShare.prototype.shareMessage = function (shareTag, query, success, fail, title, image) {
            var shareObject;
            if (this.rewardShareEnable()) {
                shareObject = this.shareConfig.getSharePointCfg(shareTag, title, image, query);
            }
            else {
                shareObject = this.shareConfig.getDefaultConfig(shareTag, title, image, query);
            }
            shareObject.query['shareOpenid'] = zm.api.OpenID ? zm.api.OpenID : zm.login.openID;
            zm.statistics.shareStat(shareObject.sharepid, shareObject.shareid);
            this.share.shareAppMessage(shareObject.title, shareObject.imageUrl, shareObject.query, success, fail);
        };
        YokaShare.prototype.shareScreenShot = function (shareTag, title, container, rect, query, success, fail) {
            var shareObject = this.shareConfig.getSharePointCfg(shareTag, title, "", query);
            shareObject.query['shareOpenid'] = zm.api.OpenID ? zm.api.OpenID : zm.login.openID;
            zm.statistics.shareStat(shareObject.sharepid, zm.ShareConfig.DefaultShareID);
            this.share.shareScreenShot(container, rect, title, shareObject.query, success, fail);
        };
        YokaShare.prototype.defaultShareConfig = function (title, img) {
            this.shareConfig.defaultShareConfig(title, img);
        };
        YokaShare.prototype.rewardShareEnable = function () {
            return this.share.rewardShareEnable();
        };
        YokaShare.prototype.zmGameTriggerState = function (triggerKey) {
            return this.share.zmGameTriggerState(triggerKey);
        };
        return YokaShare;
    }());
    zm.YokaShare = YokaShare;
})(zm || (zm = {}));
/*
* 自定义动画配置
* 编译参数： tsc -d
*/
var CustomAdConfig;
/*
* 自定义动画配置
* 编译参数： tsc -d
*/
(function (CustomAdConfig) {
    /**
     * 自定义广告配置地址
     */
    CustomAdConfig.CustomAdHost = "https://adplatform.rzcdz2.com"; //正式
    CustomAdConfig.HOST = "https://zmddzapi.rzcdz2.com/adtest/";
    // export let HOST:string = "http://zmtest.rzcdz2.com/adtest/";
    /**
     * 获取最新配置间隔
     */
    CustomAdConfig.INTERVAL_TIME = 5; //5分钟一刷
    /**
     * 必须定义各自游戏的pages映射
     */
    function getPages() {
        var pages = {
            "StartView": 3,
            "ReviveView": 4,
            "SummaryView": 5
        };
        return pages;
    }
    CustomAdConfig.getPages = getPages;
    /**
     * 吊坠每毫秒转动角度
     */
    CustomAdConfig.PendantShakeAnglePerMs = 0.02;
    /**
     * 吊坠摇摆角度限制
     */
    CustomAdConfig.PendantShakeAngleLimit = 25;
    /**
     * 摇摆角度限制
     */
    CustomAdConfig.ShakeAngleLimit = 25;
    /**
     * 暂停摇摆时间
     */
    CustomAdConfig.ShakeBreakTime = 2000;
    /**
     * 一轮摇摆次数
     */
    CustomAdConfig.ShakeTurn = 4;
    /**
     * 每毫秒转动角度
     */
    CustomAdConfig.ShakeAnglePerMs = 0.15;
    /**
     * 每毫秒透明度变化
     */
    CustomAdConfig.BlinkPerMs = 0.005;
    /**
     * 暂停闪烁时间
     */
    CustomAdConfig.BlinkBreakTime = 2000;
    /**
     * 闪烁最低透明度
     */
    CustomAdConfig.BlinkMinAlpha = 0.1;
    /**
     * 一轮闪烁次数
     */
    CustomAdConfig.BlinkTurn = 3;
    /**
     * guess类广告switch时间间隔
     */
    CustomAdConfig.AdSwitchTime = 15000;
    /**
     * guess类广告每毫秒Roll幅度
     */
    CustomAdConfig.AdRollPerMs = 0.05;
})(CustomAdConfig || (CustomAdConfig = {}));
/// <reference path="./EffectType.ts" />
/**
 * 展示类型
 */
var AdImgType;
/// <reference path="./EffectType.ts" />
/**
 * 展示类型
 */
(function (AdImgType) {
    AdImgType[AdImgType["PNG"] = 0] = "PNG";
    AdImgType[AdImgType["JPG"] = 1] = "JPG";
    AdImgType[AdImgType["GIF"] = 2] = "GIF";
})(AdImgType || (AdImgType = {}));
/**
 * 响应类型
 */
var AdRespondType;
/**
 * 响应类型
 */
(function (AdRespondType) {
    /*直接跳转*/
    AdRespondType[AdRespondType["Jump"] = 1] = "Jump";
    /*二跳*/
    AdRespondType[AdRespondType["JumpTwice"] = 2] = "JumpTwice";
    /*二维码*/
    AdRespondType[AdRespondType["QRCode"] = 3] = "QRCode";
    /*其他链接*/
    AdRespondType[AdRespondType["Link"] = 4] = "Link";
})(AdRespondType || (AdRespondType = {}));
/**
 * 广告位坐标类型
 */
var AdPosType;
/**
 * 广告位坐标类型
 */
(function (AdPosType) {
    /*普通*/
    AdPosType[AdPosType["Normal"] = 1] = "Normal";
    /*中心*/
    AdPosType[AdPosType["Center"] = 2] = "Center";
    /*边距*/
    AdPosType[AdPosType["LRTB"] = 3] = "LRTB";
    /*不配置*/
    AdPosType[AdPosType["None"] = 4] = "None";
})(AdPosType || (AdPosType = {}));
/**
 * 广告位动画类型
 */
var AnimationType;
/**
 * 广告位动画类型
 */
(function (AnimationType) {
    /*普通*/
    AnimationType[AnimationType["Normal"] = 0] = "Normal";
    /*摇晃*/
    AnimationType[AnimationType["Shake"] = 1] = "Shake";
    /*闪烁*/
    AnimationType[AnimationType["Blink"] = 2] = "Blink";
})(AnimationType || (AnimationType = {}));
/**
 * 广告位展示类型
 */
var AdContainType;
/**
 * 广告位展示类型
 */
(function (AdContainType) {
    /*单个*/
    AdContainType[AdContainType["Single"] = 0] = "Single";
    /*菜单/抽屉*/
    AdContainType[AdContainType["Menu"] = 4] = "Menu";
    /*好友在玩*/
    AdContainType[AdContainType["Guess"] = 5] = "Guess";
    /*福利试玩*/
    AdContainType[AdContainType["PlayGame"] = 6] = "PlayGame";
    /*更多游戏*/
    AdContainType[AdContainType["More"] = 7] = "More";
    /*Banner猜你喜欢*/
    AdContainType[AdContainType["BannerGuess"] = 8] = "BannerGuess";
    /*广告盒子*/
    AdContainType[AdContainType["Box"] = 9] = "Box";
    /*备份-猜你喜欢，用作加载不出Banner的时候*/
    AdContainType[AdContainType["Backup"] = 10] = "Backup";
    /*吊坠广告*/
    AdContainType[AdContainType["Pendant"] = 11] = "Pendant";
    /*视频广告(未实现)*/
    AdContainType[AdContainType["VideoAd"] = 12] = "VideoAd";
    /*全屏广告*/
    AdContainType[AdContainType["FullScreen"] = 13] = "FullScreen";
    /*自定义Banner广告*/
    AdContainType[AdContainType["CustomizedBanner"] = 14] = "CustomizedBanner";
})(AdContainType || (AdContainType = {}));
/**
 * 猜你喜欢类型
 */
var GuessType;
/**
 * 猜你喜欢类型
 */
(function (GuessType) {
    GuessType[GuessType["Horizontal"] = 0] = "Horizontal";
    GuessType[GuessType["Vertical"] = 1] = "Vertical";
})(GuessType || (GuessType = {}));
/**
 * 抽屉类型
 */
var DrawerType;
/**
 * 抽屉类型
 */
(function (DrawerType) {
    /*竖直菜单--下拉*/
    DrawerType[DrawerType["Menu_Top"] = 0] = "Menu_Top";
    /*竖直菜单--上提*/
    DrawerType[DrawerType["Menu_Bottom"] = 1] = "Menu_Bottom";
    /*水平菜单--右拉*/
    DrawerType[DrawerType["Menu_Left"] = 2] = "Menu_Left";
    /*水平菜单--左拉*/
    DrawerType[DrawerType["Menu_Right"] = 3] = "Menu_Right";
    /*底部横条全显示*/
    DrawerType[DrawerType["Menu_All"] = 4] = "Menu_All";
})(DrawerType || (DrawerType = {}));
/**
 * 好友在玩/banner猜你喜欢 动画类型
 */
var AdGuessAnimationType;
/**
 * 好友在玩/banner猜你喜欢 动画类型
 */
(function (AdGuessAnimationType) {
    /*切换*/
    AdGuessAnimationType[AdGuessAnimationType["Switch"] = 0] = "Switch";
    /*滚动*/
    AdGuessAnimationType[AdGuessAnimationType["Roll"] = 1] = "Roll";
})(AdGuessAnimationType || (AdGuessAnimationType = {}));
/*
* 自定义广告内容  数据结构
*/
var AdContent = /** @class */ (function () {
    function AdContent() {
    }
    AdContent.parseData = function (data, order) {
        //过滤 自己的appid
        if (!data || data.link_value == zm.appId) {
            return null;
        }
        var content = new AdContent();
        content._adId = data.adv_id;
        content._adName = data.adv_name;
        content._gameName = "游戏名字";
        content._respondType = data.link_type;
        content._linkValue = data.link_value;
        content._param = data.param;
        // content._system = data.system;
        content._online = data.online == undefined ? true : data.online;
        content._resUrl = data.img;
        content.checkResType();
        content._effectType = data.effect_type == undefined ? EffectType.None : data.effect_type;
        content._iconType = data.show_type;
        content._showTime = data.show_time;
        content._frameLength = data.img_info.count;
        //默认一张图播放时间
        content._interval = data.img_info.delay == undefined ? 80 : data.img_info.delay;
        content._path = data.path;
        content._order = order;
        return content;
    };
    AdContent.prototype.checkResType = function () {
        var imgSuffix = this._resUrl.substr(this._resUrl.length - 3, 3);
        switch (imgSuffix) {
            case "png":
            case "PNG":
                this._imgType = AdImgType.PNG;
                break;
            case "jpg":
            case "JPG":
                this._imgType = AdImgType.JPG;
                break;
            case "gif":
            case "GIF":
                this._imgType = AdImgType.GIF;
                this._resUrlPrefix = this._resUrl.substr(0, this._resUrl.length - 4);
                break;
        }
    };
    Object.defineProperty(AdContent.prototype, "resUrl", {
        /**
         * 广告资源图（gif取第一张）
         */
        get: function () {
            if (this._imgType == AdImgType.GIF) {
                return this._resUrlPrefix + "_0.png";
            }
            else {
                return this._resUrl;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "adId", {
        get: function () {
            return this._adId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "adName", {
        get: function () {
            return this._adName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "gameName", {
        get: function () {
            return this._gameName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "respondType", {
        get: function () {
            return this._respondType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "linkValue", {
        /* appid 或者 图片地址 */
        get: function () {
            return this._linkValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "param", {
        /* 跳转参数 */
        get: function () {
            return this._param;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "system", {
        get: function () {
            return this._system;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "online", {
        get: function () {
            return this._online;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "iconType", {
        get: function () {
            return this._iconType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "showTime", {
        get: function () {
            return this._showTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "frameLength", {
        get: function () {
            return this._frameLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "interval", {
        get: function () {
            return this._interval;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "effectType", {
        get: function () {
            return this._effectType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "order", {
        get: function () {
            return this._order;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "aniUrls", {
        /**
         * 创建一组动画的url数组（美术资源地址数组）
         */
        get: function () {
            var urls = [];
            if (this._imgType == AdImgType.GIF) {
                for (var i = 0; i < this._frameLength; i++) {
                    urls.push(this._resUrlPrefix + "_" + i + ".png");
                }
            }
            else {
                urls.push(this._resUrl);
            }
            return urls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContent.prototype, "resUrls", {
        /**
          * 广告内容资源
          */
        get: function () {
            var urls = [];
            if (this._imgType == AdImgType.GIF) {
                for (var i = 0; i < this._frameLength; i++) {
                    urls.push({ url: (this._resUrlPrefix + "_" + i + ".png"), type: Laya.Loader.IMAGE });
                }
            }
            else {
                urls.push({ url: this._resUrl, type: Laya.Loader.IMAGE });
            }
            return urls;
        },
        enumerable: true,
        configurable: true
    });
    return AdContent;
}());
/*
* 自定义广告容器（广告位） 数据结构
*/
/// <reference path="./AdContent.ts" />
var AdContainer = /** @class */ (function () {
    function AdContainer() {
    }
    AdContainer.parseData = function (list) {
        var result = [];
        if (list && list.length > 0) {
            var conData = void 0;
            for (var i = 0; i < list.length; i++) {
                conData = AdContainer.parseOne(list[i]);
                if (conData) {
                    //为了保证 抽屉广告一直在最上面
                    if (conData.containerType == AdContainType.Menu) {
                        result.push(conData);
                    }
                    else {
                        result.unshift(conData);
                    }
                }
            }
        }
        return result;
    };
    AdContainer.parseOne = function (data) {
        if (!data) {
            return null;
        }
        var container = new AdContainer();
        container._containerId = data.position_id;
        container._containName = data.position_name;
        container._conWidth = data.position_info.width;
        container._conHeight = data.position_info.height;
        /* 动画，默认无动画 */
        container._effectType = data.effect_type == undefined ? AnimationType.Normal : data.effect_type;
        /* 位置类型 */
        container._posType = data.position_type <= AdPosType.LRTB ? data.position_type : AdPosType.None;
        /* 默认是单一广告 */
        container._containerType = data.position_type <= AdPosType.LRTB ? AdContainType.Single : data.position_type;
        container._conX = data.position_info.x == undefined ? data.position_info.x : parseInt(data.position_info.x);
        container._conY = data.position_info.y == undefined ? data.position_info.y : parseInt(data.position_info.y);
        container._conLeft = data.position_info.left == undefined ? data.position_info.left : parseInt(data.position_info.left);
        container._conRight = data.position_info.right == undefined ? data.position_info.right : parseInt(data.position_info.right);
        container._conTop = data.position_info.top == undefined ? data.position_info.top : parseInt(data.position_info.top);
        container._conBottom = data.position_info.bottom == undefined ? data.position_info.bottom : parseInt(data.position_info.bottom);
        container._conCenterX = data.position_info.center_x == undefined ? data.position_info.center_x : parseInt(data.position_info.center_x);
        container._conCenterY = data.position_info.center_y == undefined ? data.position_info.center_y : parseInt(data.position_info.center_y);
        container.parseContent(data.advs);
        return container;
    };
    /**
     * @param contents 广告位的绑定内容
     */
    AdContainer.prototype.parseContent = function (contents) {
        this._contents = [];
        if (contents && contents.length > 0) {
            var content = void 0;
            for (var i = 0; i < contents.length; i++) {
                content = AdContent.parseData(contents[i], i);
                if (content && content.online) {
                    this._contents.push(content);
                }
            }
        }
    };
    Object.defineProperty(AdContainer.prototype, "contents", {
        get: function () {
            return this._contents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "containerId", {
        get: function () {
            return this._containerId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "containName", {
        get: function () {
            return this._containName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conWidth", {
        get: function () {
            return this._conWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conHeight", {
        get: function () {
            return this._conHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "posType", {
        get: function () {
            return this._posType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "effectType", {
        get: function () {
            return this._effectType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "containerType", {
        get: function () {
            return this._containerType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conX", {
        get: function () {
            return this._conX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conY", {
        get: function () {
            return this._conY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conLeft", {
        get: function () {
            return this._conLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conRight", {
        get: function () {
            return this._conRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conTop", {
        get: function () {
            return this._conTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conBottom", {
        get: function () {
            return this._conBottom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conCenterX", {
        get: function () {
            return this._conCenterX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "conCenterY", {
        get: function () {
            return this._conCenterY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdContainer.prototype, "allAdIconRes", {
        get: function () {
            var iconRes = [];
            for (var i = 0; i < this._contents.length; i++) {
                if (this._contents[i] && this._contents[i].resUrl) {
                    // iconRes.push( { url: this._contents[i].resUrl, type: Laya.Loader.IMAGE } );
                    iconRes = iconRes.concat(this._contents[i].resUrls);
                }
            }
            return iconRes;
        },
        enumerable: true,
        configurable: true
    });
    return AdContainer;
}());
var AdLoader = /** @class */ (function () {
    function AdLoader() {
    }
    AdLoader.load = function (url, complete, progress) {
        return Laya.loader.load(url, complete, progress, null, 1, AdLoader.cache);
    };
    //内存cache
    AdLoader.cache = true;
    return AdLoader;
}());
/*
* 通用广告Icon容器
* 支持 静态，动态
*/
var AdIcon = /** @class */ (function (_super) {
    __extends(AdIcon, _super);
    function AdIcon() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Object.defineProperty(AdIcon.prototype, "iconImg", {
        get: function () {
            return this._iconImg;
        },
        enumerable: true,
        configurable: true
    });
    AdIcon.prototype.init = function () {
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this._iconImg = new Laya.Image();
        this.addChild(this._iconImg);
        this._iconImg.pos(0, 0);
        this.clear();
    };
    AdIcon.prototype.clear = function () {
        this._isLoop = false;
        this._playIndex = 0;
        this.stopLoop();
        this._iconImg.skin = "";
        this._iconUrils = [];
        this.removeSelf();
    };
    /**
     * 设置icon属性
     */
    AdIcon.prototype.setIcon = function (iconWidth, iconHeight, interval) {
        if (interval === void 0) { interval = 100; }
        this._iconImg.size(iconWidth, iconHeight);
        this.size(iconWidth, iconHeight);
        this._interval = interval;
    };
    /**
     * 加载图片资源，支持 单张/多张，默认显示第一张
     * @param urls 图片资源数组
     */
    AdIcon.prototype.loadImages = function (urls) {
        this._iconUrils = urls;
        if (this._iconUrils && this._iconUrils.length >= 1) {
            this.setSkin(this._iconUrils[0]);
        }
    };
    AdIcon.prototype.setSkin = function (url) {
        if (this._iconImg) {
            this._iconImg.skin = url;
        }
    };
    /**
     * 播放图片
     * @param loop 默认循环播放
     */
    AdIcon.prototype.play = function (loop) {
        if (loop === void 0) { loop = true; }
        if (!this._iconUrils || this._iconUrils.length <= 1 || this._inPlay) {
            return;
        }
        this._isLoop = loop;
        this.startLoop();
    };
    AdIcon.prototype.startLoop = function () {
        this._inPlay = true;
        this._playIndex = 0;
        Laya.timer.loop(this._interval, this, this.onLoop);
    };
    AdIcon.prototype.stopLoop = function () {
        this._inPlay = false;
        Laya.timer.clear(this, this.onLoop);
    };
    AdIcon.prototype.onLoop = function () {
        if (this._playIndex >= this._iconUrils.length) {
            if (this._isLoop) {
                this._playIndex = this._playIndex % this._iconUrils.length;
            }
            else {
                this.stopLoop();
            }
        }
        var url = this._iconUrils[this._playIndex];
        this.setSkin(url);
        this._playIndex++;
    };
    AdIcon.prototype.stop = function () {
        if (this._inPlay) {
            this.stopLoop();
        }
    };
    return AdIcon;
}(Laya.Sprite));
var AdClickHandler = /** @class */ (function () {
    function AdClickHandler() {
    }
    AdClickHandler.jumpApp = function (jumpAppId, pageId, containerId, adcontent, success, fail) {
        var data = {
            appId: jumpAppId,
            success: function () {
                console.log("跳转APP成功！");
                if (wx.aldSendEvent) {
                    wx.aldSendEvent("跳转小游戏成功", {
                        'appid': jumpAppId,
                        '广告位': containerId,
                        '广告': adcontent.adId
                    });
                }
                //数据统计
                zm.statistics.navigationConfirmStat(zm.LocationID.Vip, pageId, containerId, adcontent.adId, adcontent.order + 1, adcontent.effectType, zm.gameID());
                //通知跳转成功
                zm.eventCenter.event(zm.events.EventJumpAppSuccess, { pageId: pageId });
                if (success) {
                    success.run();
                }
            },
            fail: function () {
                console.log("跳转APP失败！");
                //通知跳转失败
                zm.eventCenter.event(zm.events.EventJumpAppFail, { pageId: pageId });
                if (fail) {
                    fail.run();
                }
            }
        };
        var adId = adcontent ? adcontent.adId : 0;
        var extra = {};
        //跳转填的gameid是统计平台的ID
        extra['subgameid'] = zm.utils.adaptStatID(CustomAdConfig.PlatformId, zm.Stat_Offset);
        extra['subuid'] = CustomAdConfig.UID;
        extra['location_id'] = zm.LocationID.Vip;
        extra['ad_page_id'] = pageId;
        extra['advid'] = containerId;
        extra['adid'] = adId;
        if (adcontent) {
            var adParam = AdClickHandler.checkAdParam(adcontent.param);
            AdClickHandler.parseAdParam(extra, adParam);
            // if(adParam && adParam.length>0){
            data["path"] = adcontent.path;
            // }
        }
        data["extraData"] = extra;
        console.log("custom ad jump app", data);
        if (Laya.Browser.window.wx) {
            Laya.Browser.window.wx.navigateToMiniProgram(data);
            // zm.statistics.navigationStat(zm.LocationID.Vip, pageId, containerId, adId);
            if (wx.aldSendEvent) {
                wx.aldSendEvent("跳转小游戏", {
                    'appid': jumpAppId,
                    '广告位': containerId,
                    '广告': adcontent.adId
                });
            }
        }
    };
    AdClickHandler.checkAdParam = function (param) {
        if (param && param.length > 0 && param[0] == "?") {
            return param.substr(1, param.length - 1);
        }
        return param;
    };
    AdClickHandler.parseAdParam = function (data, param) {
        if (param && param.length > 0) {
            var paramArr = param.split("&");
            for (var i = 0; i < paramArr.length; i++) {
                var paramStr = paramArr[i];
                if (paramStr && paramStr.length > 0) {
                    var temp = paramStr.split("=");
                    data[temp[0]] = temp[1];
                }
            }
        }
    };
    AdClickHandler.showQRCode = function (qrcodeUrl) {
        var urlll = [qrcodeUrl];
        var wwx = Laya.Browser.window.wx;
        if (wwx) {
            wwx.previewImage({
                urls: urlll,
                success: function () {
                    console.log("preview qrcode ok");
                },
            });
        }
        console.log("显示图片:", qrcodeUrl);
    };
    AdClickHandler.openAd = function (ad, pageId, adContainerId, success, fail) {
        if (ad) {
            switch (ad.respondType) {
                case AdRespondType.Jump:
                case AdRespondType.JumpTwice:
                case AdRespondType.Link:
                    AdClickHandler.jumpApp(ad.linkValue, pageId, adContainerId, ad, success, fail);
                    break;
                case AdRespondType.QRCode:
                    AdClickHandler.showQRCode(ad.linkValue);
                    break;
            }
            zm.statistics.navigationStat(zm.LocationID.Vip, pageId, adContainerId, ad.adId, ad.order + 1, ad.effectType, zm.gameID());
        }
    };
    return AdClickHandler;
}());
var AdReddotHelper = /** @class */ (function () {
    function AdReddotHelper() {
    }
    AdReddotHelper.addReddot = function (container, pageId, containerId, content) {
        if (!container || !container.parent) {
            return;
        }
        // if(!content || content.iconType != "hd_icon")
        if (!content || content.effectType != EffectType.Reddot) {
            return;
        }
        var reddotState = AdReddotHelper.getIconReddotState(pageId, containerId, content);
        if (reddotState == AdReddotHelper.Reddot_Show) {
            var dot = AdReddotHelper.getDotImg();
            dot.size(30, 30);
            dot.mouseEnabled = false;
            dot.skin = AdReddotHelper.dotUrl;
            dot.anchorX = 0.5;
            dot.anchorY = 0.5;
            // //右上角框外
            // dot.pos(parseInt(container.x)+parseInt(container.width), parseInt(container.y));
            //右上角框内
            dot.pos(parseInt(container.x) + parseInt(container.width) - 0.5 * dot.width, parseInt(container.y) + 0.5 * dot.height);
            container.parent.addChild(dot);
            var key = AdReddotHelper.getKey(pageId, containerId, content);
            AdReddotHelper.ReddotList[key] = dot;
        }
    };
    AdReddotHelper.updateReddotState = function (pageId, containerId, content) {
        // if(!content || content.iconType != "hd_icon")
        if (!content || content.effectType != EffectType.Reddot) {
            return;
        }
        var reddotState = AdReddotHelper.getIconReddotState(pageId, containerId, content);
        if (reddotState == AdReddotHelper.Reddot_Show) {
            //先保存状态
            AdReddotHelper.saveIconReddotState(pageId, containerId, content, AdReddotHelper.Reddot_Hide);
            //再清除红点
            var key = AdReddotHelper.getKey(pageId, containerId, content);
            var dot = AdReddotHelper.ReddotList[key];
            if (dot) {
                AdReddotHelper.saveDotImg(dot);
            }
            AdReddotHelper.ReddotList[key] = null;
        }
    };
    AdReddotHelper.getIconReddotState = function (pageId, containerId, content) {
        var key = AdReddotHelper.getKey(pageId, containerId, content);
        var saveStr = Laya.LocalStorage.getItem(key);
        if (saveStr && saveStr.length > 0) {
            var arr = saveStr.split(":");
            var saveState = parseInt(arr[0]);
            var timeMark = parseInt(arr[1]);
            var markDate = new Date(timeMark);
            var today = new Date();
            if (markDate.getDay() == today.getDay()) {
                return saveState;
            }
        }
        AdReddotHelper.saveIconReddotState(pageId, containerId, content, AdReddotHelper.Reddot_Show);
        return AdReddotHelper.Reddot_Show;
    };
    AdReddotHelper.saveIconReddotState = function (pageId, containerId, content, reddotState) {
        var key = AdReddotHelper.getKey(pageId, containerId, content);
        var saveStr = reddotState + ":" + Date.now();
        Laya.LocalStorage.setItem(key, saveStr);
    };
    AdReddotHelper.getDotImg = function () {
        if (AdReddotHelper.ReddotPool.length == 0) {
            AdReddotHelper.ReddotPool.push(new Laya.Image());
        }
        return AdReddotHelper.ReddotPool.pop();
    };
    AdReddotHelper.saveDotImg = function (dot) {
        if (dot) {
            dot.removeSelf();
            AdReddotHelper.ReddotPool.push(dot);
        }
    };
    AdReddotHelper.getKey = function (pageId, containerId, content) {
        return AdReddotHelper.AdIconReddotKey + "_" + pageId + "_" + containerId + "_" + content.adId;
    };
    Object.defineProperty(AdReddotHelper, "dotUrl", {
        get: function () {
            return CustomAdConfig.HOST + "reddot.png";
        },
        enumerable: true,
        configurable: true
    });
    AdReddotHelper.AdIconReddotKey = "AdIconReddotKey";
    AdReddotHelper.Reddot_Show = 0;
    AdReddotHelper.Reddot_Hide = 1;
    AdReddotHelper.ReddotPool = [];
    AdReddotHelper.ReddotList = {};
    return AdReddotHelper;
}());
/*
* 广告元件
* 广告内容的显示
*/
/// <reference path="./AdIcon.ts" />
/// <reference path="../utils/AdClickHandler.ts" />
/// <reference path="../utils/AdReddotHelper.ts" />
var AdElement = /** @class */ (function () {
    function AdElement() {
    }
    AdElement.prototype.initIcon = function () {
        this._icon = new AdIcon();
        this._icon.on(Laya.Event.CLICK, this, this.onClick);
    };
    AdElement.prototype.destroy = function () {
        if (this._icon) {
            this._icon.off(Laya.Event.CLICK, this, this.onClick);
            this._icon.clear();
            this._icon = null;
        }
        if (this._clickCallback) {
            this._clickCallback = null;
        }
        this._pageId = 0;
        this._containerId = 0;
        this._content = null;
    };
    Object.defineProperty(AdElement.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdElement.prototype, "adId", {
        get: function () {
            return this._content.adId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdElement.prototype, "effectType", {
        get: function () {
            return this._content.effectType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdElement.prototype, "order", {
        get: function () {
            return this._content.order;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置广告元件数据
     */
    AdElement.prototype.setData = function (content, iconWidth, iconHeight, pageId, containerId, canClick, clickCallback) {
        if (canClick === void 0) { canClick = true; }
        // this.destroy();
        if (!content) {
            return;
        }
        this._pageId = pageId;
        this._containerId = containerId;
        this._content = content;
        this._canClick = canClick;
        this._clickCallback = clickCallback;
        this.initIcon();
        this._icon.setIcon(iconWidth, iconHeight, this._content.interval);
        //加载图片
        this._icon.loadImages(this._content.aniUrls);
        //添加红点
        if (this._canClick) {
            AdReddotHelper.addReddot(this._icon.iconImg, this._pageId, this._containerId, this._content);
        }
    };
    AdElement.prototype.onClick = function () {
        if (this._content && this._canClick) {
            //取消红点
            AdReddotHelper.updateReddotState(this._pageId, this._containerId, this._content);
            //广告跳转
            AdClickHandler.openAd(this._content, this._pageId, this._containerId);
            //
            if (this._clickCallback) {
                this._clickCallback.run();
            }
        }
    };
    AdElement.prototype.play = function () {
        this._icon.play();
    };
    AdElement.prototype.stop = function () {
        this._icon.stop();
    };
    //==========================AdElement=================================
    AdElement.creatAdElement = function () {
        if (this._adElementPool.length == 0) {
            this._adElementPool[0] = new AdElement();
        }
        var element = this._adElementPool.pop();
        return element;
    };
    AdElement.recoverAdElement = function (element) {
        if (element) {
            element.destroy();
            // this._adElementPool.push(element);
        }
    };
    AdElement._adElementPool = [];
    return AdElement;
}());
/*
* 广告单位
* 固定广告位，广告位内轮播广告内容
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdLantern = /** @class */ (function (_super) {
    __extends(AdLantern, _super);
    function AdLantern() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdLantern.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdLantern.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!parentCon || !adContainer) {
            return;
        }
        this.clear();
        this._contentIdx = -1;
        this._pageId = pageId;
        this.visible = true;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        // this.setUnitPos();
        this.loadAndShow();
    };
    AdLantern.prototype.clear = function () {
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this.stopAnimation();
        if (this._adElement) {
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
            AdElement.recoverAdElement(this._adElement);
            this._adElement = null;
        }
        Laya.timer.clear(this, this.onAdEnd);
        this._conData = null;
        this._curContentData = null;
        this._contents = [];
        this.anchorX = 0;
        this.anchorY = 0;
    };
    AdLantern.prototype.setUnitPos = function () {
        this.width = this._conData.conWidth;
        this.height = this._conData.conHeight;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //重置一下
        this.x = undefined;
        this.y = undefined;
        this.centerX = undefined;
        this.centerY = undefined;
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        switch (this._conData.posType) {
            case AdPosType.Normal:
                {
                    this.x = this._conData.conX;
                    this.y = this._conData.conY;
                }
                break;
            case AdPosType.Center:
                {
                    this.centerX = this._conData.conCenterX;
                    this.centerY = this._conData.conCenterY;
                }
                break;
            case AdPosType.LRTB:
                {
                    if (this._conData.conLeft != undefined) {
                        this.left = this._conData.conLeft;
                    }
                    if (this._conData.conRight != undefined) {
                        this.right = this._conData.conRight;
                    }
                    if (this._conData.conTop != undefined) {
                        this.top = this._conData.conTop;
                    }
                    if (this._conData.conBottom != undefined) {
                        //this.bottom = this._conData.conBottom;
                        this.top = Laya.stage.height - this._conData.conBottom - this._conData.conHeight;
                    }
                }
                break;
        }
        this._x = this._x + 0.5 * this.width;
        this._y = this._y + 0.5 * this.height;
        // this.graphics.drawRect(0,0,this.width,this.height,"#FF0000");
    };
    AdLantern.prototype.onClick = function () {
        this.loadAndShow();
    };
    //==================================================================================================
    AdLantern.prototype.loadAndShow = function () {
        Laya.timer.clear(this, this.onAdEnd);
        var count = 0;
        var nextContent;
        while (count < this._contents.length) {
            this._contentIdx = (this._contentIdx + 1) % this._contents.length;
            nextContent = this._contents[this._contentIdx];
            if (nextContent) {
                break;
            }
            count++;
        }
        if (count < this._contents.length) {
            if (!this._curContentData || nextContent.adId != this._curContentData.adId) {
                this._curContentData = nextContent;
                AdLoader.load(this._curContentData.resUrls, laya.utils.Handler.create(this, this.onLoadRes));
            }
        }
    };
    AdLantern.prototype.onLoadRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        if (!this._adElement) {
            this._adElement = AdElement.creatAdElement();
            this.setUnitPos();
        }
        else {
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
        }
        this.removeChildren();
        this._adElement.setData(this._curContentData, this._conData.conWidth, this._conData.conHeight, this._pageId, this._conData.containerId, true, laya.utils.Handler.create(this, this.onClick, null, false));
        this.addChild(this._adElement.icon);
        this._adElement.play();
        zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
        switch (this._conData.effectType) {
            case AnimationType.Normal:
                break;
            case AnimationType.Shake:
                this.shake();
                break;
            case AnimationType.Blink:
                this.blink();
                break;
        }
        Laya.timer.once(this._curContentData.showTime * 1000, this, this.onAdEnd);
    };
    AdLantern.prototype.onAdEnd = function (e) {
        this.loadAndShow();
    };
    //=====================================动画特效=======================================
    AdLantern.prototype.stopAnimation = function () {
        this.stopShake();
        this.stopBlink();
    };
    AdLantern.prototype.shake = function () {
        this.stopShake();
        this.turn = 0;
        this.direction = 1;
        Laya.timer.frameLoop(1, this, this.onShakeFrame);
    };
    AdLantern.prototype.stopShake = function () {
        Laya.timer.clear(this, this.shake);
        Laya.timer.clear(this, this.onShakeFrame);
        this.rotation = 0;
    };
    AdLantern.prototype.onShakeFrame = function (e) {
        var diffRotation = this.direction * Math.min(5, CustomAdConfig.ShakeAnglePerMs * Laya.timer.delta);
        var nextRotation = this.rotation + diffRotation;
        //符号变化  表示跨过0
        if (nextRotation * this.rotation < 0) {
            this.turn++;
        }
        if (this.turn >= CustomAdConfig.ShakeTurn) {
            this.stopShake();
            Laya.timer.once(CustomAdConfig.ShakeBreakTime, this, this.shake);
        }
        else {
            this.rotation = nextRotation;
            if (Math.abs(this.rotation) > CustomAdConfig.ShakeAngleLimit) {
                this.direction = this.rotation - CustomAdConfig.ShakeAngleLimit > 0 ? -1 : 1;
            }
        }
    };
    //====================blink=========================
    AdLantern.prototype.blink = function () {
        this.stopBlink();
        this.direction = -1;
        this.turn = 0;
        Laya.timer.frameLoop(1, this, this.onBlinkFrame);
    };
    AdLantern.prototype.stopBlink = function () {
        Laya.timer.clear(this, this.onBlinkFrame);
        Laya.timer.clear(this, this.blink);
        this.alpha = 1;
    };
    AdLantern.prototype.onBlinkFrame = function (e) {
        var diffAlpha = this.direction * Math.min(0.1, CustomAdConfig.BlinkPerMs * Laya.timer.delta);
        console.log(CustomAdConfig.BlinkPerMs * Laya.timer.delta);
        var nextAlpha = this.alpha + diffAlpha;
        if (nextAlpha >= 1) {
            nextAlpha = 1;
            this.direction = -1;
            this.turn++;
            if (this.turn >= CustomAdConfig.BlinkTurn) {
                this.stopBlink();
                Laya.timer.once(CustomAdConfig.BlinkBreakTime, this, this.blink);
                return;
            }
        }
        else if (nextAlpha <= CustomAdConfig.BlinkMinAlpha) {
            nextAlpha = CustomAdConfig.BlinkMinAlpha;
            this.direction = 1;
        }
        this.alpha = nextAlpha;
    };
    return AdLantern;
}(Laya.View));
/*
* 广告单位
* 菜单广告位，展示所有包含的广告
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdMenu = /** @class */ (function (_super) {
    __extends(AdMenu, _super);
    function AdMenu() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdMenu.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdMenu.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!parentCon || !adContainer) {
            return;
        }
        this.clear();
        this._pageId = pageId;
        this.visible = false;
        this.mouseThrough = true;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this._drawerType = this.getDrawerType();
        this.loadAndShow();
    };
    AdMenu.prototype.clear = function () {
        if (this._conData && this._contents && this._contents.length > 0) {
            this.adTimeHide();
        }
        this._conData = null;
        this._contents = [];
        if (this._iconPanel) {
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._isShow = false;
        this._inMove = false;
        if (this._dot) {
            Laya.timer.clear(this, this.dotEffect);
        }
    };
    /* *
    * auto=true,默认自动判断显示隐藏
    * auto=false,强制收起
    */
    AdMenu.prototype.showAndHide = function (auto) {
        if (auto === void 0) { auto = true; }
        if (this._inMove) {
            return;
        }
        //去除 位置影响
        this._panel.centerX = undefined;
        this._panel.centerY = undefined;
        this._panel.left = undefined;
        this._panel.right = undefined;
        this._panel.top = undefined;
        this._panel.bottom = undefined;
        this._inMove = true;
        this._isShow = auto && !this._isShow;
        var forceHide = !auto;
        switch (this._drawerType) {
            case DrawerType.Menu_Top:
                this.movePos(forceHide, this._panel.x, this._isShow ? this._panel.y + this._bg.height : this._panel.y - this._bg.height);
                break;
            case DrawerType.Menu_Bottom:
                this.movePos(forceHide, this._panel.x, this._isShow ? this._panel.y - this._bg.height : this._panel.y + this._bg.height);
                break;
            case DrawerType.Menu_Left:
                // this.movePos(forceHide, this._isShow ? this._panel.x+this._bg.width : this._panel.x-this._bg.width, this._panel.y);
                this.movePos(forceHide, this._isShow ? 0 : -this._bg.width, this._panel.y);
                break;
            case DrawerType.Menu_Right:
                this.movePos(forceHide, this._isShow ? this._panel.x - this._bg.width : this._panel.x + this._bg.width, this._panel.y);
                break;
            case DrawerType.Menu_All:
                break;
        }
        this._dot.visible = !this._isShow;
        //是否要滑动
        if (AdMenu.NeedSlide && this._iconPanel) {
            if (this.isHorizontal) {
                this._iconPanel.hScrollBar.value = 0;
            }
            else {
                this._iconPanel.vScrollBar.value = 0;
            }
        }
        if (this._isShow) {
            this.adTimeShow();
        }
        else {
            this.adTimeHide();
        }
    };
    AdMenu.prototype.movePos = function (forceHide, newX, newY) {
        this._more.skin = this._isShow ? this.btnInUrl : this.btnOutUrl;
        this._mask.visible = this._isShow;
        if (forceHide) {
            this._panel.x = newX;
            this._panel.y = newY;
            this._inMove = false;
            this.visible = true;
        }
        else {
            var tw_1 = Laya.Tween.to(this._panel, { x: newX, y: newY }, 200, Laya.Ease.sineInOut, laya.utils.Handler.create(this, function () {
                this._inMove = false;
                this.visible = true;
                tw_1.clear();
                tw_1 = null;
            }));
        }
    };
    AdMenu.prototype.adTimeShow = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adShow(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdMenu.prototype.adTimeHide = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adHide(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdMenu.prototype.dotEffect = function () {
        if (this._dot) {
            this._dot.scale(2.3 - this._dot.scaleX, 2.3 - this._dot.scaleY);
        }
    };
    AdMenu.prototype.setMenuLayout = function () {
        this.size(Laya.stage.width + 10, Laya.stage.height + 10);
        this.pos(-5, -5);
        this._mask = new Laya.Sprite();
        this._mask.size(this.width, this.height);
        this._mask.pos(0, 0);
        this._mask.visible = true;
        this._mask.graphics.drawRect(0, 0, this._mask.width, this._mask.height, "#000000");
        this._mask.alpha = 0.1;
        this._mask.name = AdMenu.MaskName;
        this._mask.mouseEnabled = true;
        this._mask.mouseThrough = false;
        this.addChildAt(this._mask, 0);
        this._panel = new Laya.Box();
        this._panel.name = "containerBox";
        this._panel.mouseThrough = true;
        this.addChildAt(this._panel, 1);
        this._bg = new Laya.Image();
        this._bg.name = "menubg";
        this._bg.skin = this.bgUrl;
        this._bg.sizeGrid = this.bgSizeGrid;
        this._bg.pos(0, 0);
        this._panel.addChild(this._bg);
        this._title = new Laya.Image();
        this._title.mouseEnabled = false;
        this._title.skin = this.titleUrl;
        this._title.size(AdMenu.TitleWidth, AdMenu.TitleHeight);
        this._panel.addChild(this._title);
        var layoutPt = this.layoutStyle;
        //新的大小
        this._bg.width = AdMenu.CustomData.containerWidth ? AdMenu.CustomData.containerWidth : Laya.stage.width * (2 / 3);
        //根据面板大小设置icon大小
        AdMenu.AdIconWidth = (this._bg.width - 2 * AdMenu.BorderDiff - (layoutPt.x + 1) * AdMenu.AdIconSpaceW) / layoutPt.x;
        AdMenu.AdIconHeight = AdMenu.AdIconWidth;
        this._bg.height = (AdMenu.AdIconSpaceH + AdMenu.AdIconHeight + AdMenu.AdIconTxtHeight) * layoutPt.y + AdMenu.BorderDiff + AdMenu.AdIconSpaceH + this._title.height + AdMenu.AdIconSpaceH;
        if (this._drawerType != DrawerType.Menu_All) {
            this._more = new Laya.Button();
            this._more.stateNum = 1;
            this._more.mouseEnabled = true;
            this._more.mouseThrough = false;
            this._more.name = AdMenu.MoreName;
            var pt = this.btnSizePt;
            this._more.size(pt.x, pt.y);
            this._more.skin = this.btnOutUrl;
            // this.addChild(this._more);
            this._panel.addChild(this._more);
            this._dot = new Laya.Image();
            this._dot.mouseEnabled = false;
            this._dot.skin = this.dotUrl;
            this._dot.anchorX = 0.5;
            this._dot.anchorY = 0.5;
            this._dot.pos(0, 0);
            this._panel.addChild(this._dot);
            Laya.timer.loop(200, this, this.dotEffect);
        }
        switch (this._drawerType) {
            case DrawerType.Menu_Top:
                this._more.pos(0, this._bg.height);
                this._panel.size(this._bg.width, this._bg.height + this._more.height);
                break;
            case DrawerType.Menu_Bottom:
                this._more.pos(0, 0);
                this._bg.pos(0, this._more.height);
                this._panel.size(this._bg.width, this._bg.height + this._more.height);
                break;
            case DrawerType.Menu_Left:
                this._more.pos(this._bg.width, this.moreBtnDown ? this._bg.height - this._more.height - 20 : 20);
                this._panel.size(this._bg.width + this._more.width, this._bg.height);
                break;
            case DrawerType.Menu_Right:
                this._more.pos(0, this.moreBtnDown ? this._bg.height - this._more.height - 20 : 20);
                this._bg.pos(this._more.width, 0);
                this._panel.size(this._bg.width + this._more.width, this._bg.height);
                break;
            case DrawerType.Menu_All:
                this._panel.size(this._bg.width, this._bg.height);
                break;
        }
        this._title.pos(this._bg.width * 0.5 - this._title.width * 0.5, AdMenu.BorderDiff + AdMenu.AdIconSpaceH);
        this._dot.pos(this._more.x + this._more.width, this._more.y);
    };
    AdMenu.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //重置一下
        this._panel.centerX = undefined;
        this._panel.centerY = undefined;
        this._panel.left = undefined;
        this._panel.right = undefined;
        this._panel.top = undefined;
        this._panel.bottom = undefined;
        //设置位置
        if (AdMenu.CustomData.pos) {
            this._panel.x = AdMenu.CustomData.pos.x;
            this._panel.y = AdMenu.CustomData.pos.y;
            this._panel.left = AdMenu.CustomData.pos.left;
            this._panel.right = AdMenu.CustomData.pos.right;
            this._panel.top = AdMenu.CustomData.pos.top;
            this._panel.bottom = AdMenu.CustomData.pos.bottom;
            this._panel.centerX = AdMenu.CustomData.pos.centerX;
            this._panel.centerY = AdMenu.CustomData.pos.centerY;
        }
        else {
            this._panel.left = 0;
            this._panel.centerY = 0;
        }
        this.on(Laya.Event.CLICK, this, this.onClick);
    };
    AdMenu.prototype.onClick = function (evt) {
        var clickName = evt.target.name;
        if (this._conData) {
            if (clickName == AdMenu.MoreName || clickName == AdMenu.MaskName) {
                this.showAndHide();
            }
        }
    };
    //==================================================================================================
    AdMenu.prototype.loadAndShow = function () {
        this.loadBg();
    };
    AdMenu.prototype.loadBg = function () {
        var bgRes = [
            { url: this.bgUrl, type: Laya.Loader.IMAGE },
            { url: this.dotUrl, type: Laya.Loader.IMAGE },
            { url: this.titleUrl, type: Laya.Loader.IMAGE },
            { url: this.btnOutUrl, type: Laya.Loader.IMAGE },
            { url: this.btnInUrl, type: Laya.Loader.IMAGE }
        ];
        AdLoader.load(bgRes, laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdMenu.prototype.onLoadBgRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.showAndHide(false);
        //加载广告图标
        this.loadAdIcons();
    };
    AdMenu.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdMenu.prototype.onLoadAdIcons = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._parentCon == null || this._conData == null) {
            return;
        }
        this._iconPanel = new Laya.Panel();
        //icon容器大小
        this._iconPanel.pos(this._bg.x + AdMenu.BorderDiff, this._bg.y + this._title.y + this._title.height + AdMenu.BorderDiff);
        this._iconPanel.size(this._bg.width - 2 * AdMenu.BorderDiff, this._bg.height - this._title.y - this._title.height - AdMenu.BorderDiff);
        this._panel.addChild(this._iconPanel);
        this._iconPanel.removeChildren();
        this.clearElements();
        if (AdMenu.NeedSlide) {
            if (this.isHorizontal) {
                this._iconPanel.hScrollBarSkin = "";
                this._iconPanel.hScrollBar.elasticBackTime = 150;
                this._iconPanel.hScrollBar.elasticDistance = 100;
            }
            else {
                this._iconPanel.vScrollBarSkin = "";
                this._iconPanel.vScrollBar.elasticBackTime = 150;
                this._iconPanel.vScrollBar.elasticDistance = 100;
            }
        }
        //增加icon按钮
        var count = 0;
        var layoutPt = this.layoutStyle;
        var maxItem = Math.min(layoutPt.x * layoutPt.y, this._contents.length);
        for (var i = 0; i < maxItem; i++) {
            var adContent = this._contents[i];
            if (adContent && adContent.resUrl) {
                var btnSp = new Laya.Sprite;
                btnSp.mouseEnabled = true;
                //icon
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, AdMenu.AdIconWidth, AdMenu.AdIconHeight, this._pageId, this._conData.containerId);
                adElement.icon.pos(0, 0);
                btnSp.addChild(adElement.icon);
                adElement.play();
                //txt
                var txtBtnName = new Laya.Label();
                var extraW = 20;
                txtBtnName.font = "SimHei";
                txtBtnName.color = "#1A1C28";
                txtBtnName.fontSize = 16;
                txtBtnName.align = "center";
                txtBtnName.valign = "bottom";
                txtBtnName.size(AdMenu.AdIconWidth + extraW, AdMenu.AdIconTxtHeight);
                txtBtnName.pos((-0.5) * extraW, AdMenu.AdIconHeight);
                // txtBtnName.overflow = Laya.Text.HIDDEN;
                txtBtnName.text = adContent.adName;
                btnSp.addChild(txtBtnName);
                btnSp.size(AdMenu.AdIconWidth, AdMenu.AdIconHeight + AdMenu.AdIconTxtHeight);
                var row = this.isHorizontal ? count % layoutPt.y : Math.floor(count / layoutPt.x);
                var col = this.isHorizontal ? Math.floor(count / layoutPt.y) : count % layoutPt.x;
                btnSp.x = AdMenu.AdIconSpaceW + col * (AdMenu.AdIconSpaceW + btnSp.width);
                btnSp.y = AdMenu.AdIconSpaceH + row * (AdMenu.AdIconSpaceH + btnSp.height);
                this._iconPanel.addChild(btnSp);
                count++;
            }
        }
        // this.showAndHide(false);
    };
    AdMenu.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    //======↓设置默认属性↓==========================================================================================================
    AdMenu.prototype.getDrawerType = function () {
        return AdMenu.CustomData.drawerType ? AdMenu.CustomData.drawerType : DrawerType.Menu_Left;
    };
    Object.defineProperty(AdMenu.prototype, "moreBtnDown", {
        get: function () {
            return AdMenu.CustomData.moreBtnDown ? AdMenu.CustomData.moreBtnDown : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "btnSizePt", {
        /* 更多游戏图片 */
        get: function () {
            return AdMenu.CustomData.btnSizePt ? AdMenu.CustomData.btnSizePt : new Laya.Point(90, 75);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "btnOutUrl", {
        get: function () {
            return AdMenu.CustomData.btnOutSkin ? AdMenu.CustomData.btnOutSkin : CustomAdConfig.HOST + "moregame0.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "btnInUrl", {
        get: function () {
            return AdMenu.CustomData.btnInSkin ? AdMenu.CustomData.btnInSkin : CustomAdConfig.HOST + "moregame1.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "dotUrl", {
        get: function () {
            return AdMenu.CustomData.dotSkin ? AdMenu.CustomData.dotSkin : CustomAdConfig.HOST + "reddot.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "titleUrl", {
        get: function () {
            return AdMenu.CustomData.titleSkin ? AdMenu.CustomData.titleSkin : CustomAdConfig.HOST + "title.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "bgUrl", {
        get: function () {
            return AdMenu.CustomData.bgSkin ? AdMenu.CustomData.bgSkin : CustomAdConfig.HOST + "all.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "bgSizeGrid", {
        get: function () {
            return AdMenu.CustomData.bgSizeGrid ? AdMenu.CustomData.bgSizeGrid : "20,20,20,20,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "layoutStyle", {
        /* 默认显示数量 宽*高 = 3*4 */
        get: function () {
            return AdMenu.CustomData.layoutStyle ? AdMenu.CustomData.layoutStyle : new Laya.Point(3, 4);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenu.prototype, "isHorizontal", {
        /* 是不是水平布局 */
        get: function () {
            return this._drawerType == DrawerType.Menu_Top || this._drawerType == DrawerType.Menu_Bottom || this._drawerType == DrawerType.Menu_All;
        },
        enumerable: true,
        configurable: true
    });
    //游戏自定义设置
    AdMenu.CustomData = {};
    //icon 大小
    AdMenu.AdIconWidth = 80;
    AdMenu.AdIconHeight = 80;
    AdMenu.AdIconTxtHeight = 30;
    //icon 水平间距
    AdMenu.AdIconSpaceW = 30;
    //icon 竖直间距
    AdMenu.AdIconSpaceH = 30;
    //边界调整
    AdMenu.BorderDiff = 5;
    //标题宽高
    AdMenu.TitleWidth = 190;
    AdMenu.TitleHeight = 40;
    //more 按钮名字
    AdMenu.MoreName = "MoreImg";
    //more 阴影标签
    AdMenu.MaskName = "MaskBg";
    //是否要滑动
    AdMenu.NeedSlide = false;
    return AdMenu;
}(Laya.View));
/*
* 广告单位
* 菜单广告位，展示所有包含的广告
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdMenuNew = /** @class */ (function (_super) {
    __extends(AdMenuNew, _super);
    function AdMenuNew() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdMenuNew.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdMenuNew.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!parentCon || !adContainer) {
            return;
        }
        this.clear();
        this._pageId = pageId;
        this.visible = false;
        this.mouseThrough = true;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this._drawerType = this.getDrawerType();
        this.loadAndShow();
    };
    AdMenuNew.prototype.clear = function () {
        if (this._conData && this._contents && this._contents.length > 0) {
            this.adTimeHide();
        }
        this._conData = null;
        this._contents = [];
        if (this._iconPanel) {
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._isShow = false;
        this._inMove = false;
        if (this._dot) {
            Laya.timer.clear(this, this.dotEffect);
        }
    };
    /* *
    * auto=true,默认自动判断显示隐藏
    * auto=false,强制收起
    */
    AdMenuNew.prototype.showAndHide = function (auto) {
        if (auto === void 0) { auto = true; }
        if (this._inMove) {
            return;
        }
        //去除 位置影响
        this._panel.centerX = undefined;
        this._panel.centerY = undefined;
        this._panel.left = undefined;
        this._panel.right = undefined;
        this._panel.top = undefined;
        this._panel.bottom = undefined;
        this._inMove = true;
        this._isShow = auto && !this._isShow;
        var forceHide = !auto;
        switch (this._drawerType) {
            case DrawerType.Menu_Top:
                this.movePos(forceHide, this._panel.x, this._isShow ? this._panel.y + this._bg.height : this._panel.y - this._bg.height);
                break;
            case DrawerType.Menu_Bottom:
                this.movePos(forceHide, this._panel.x, this._isShow ? this._panel.y - this._bg.height : this._panel.y + this._bg.height);
                break;
            case DrawerType.Menu_Left:
                // this.movePos(forceHide, this._isShow ? this._panel.x+this._bg.width : this._panel.x-this._bg.width, this._panel.y);
                this.movePos(forceHide, this._isShow ? 0 : -this._bg.width, this._panel.y);
                break;
            case DrawerType.Menu_Right:
                this.movePos(forceHide, this._isShow ? this._panel.x - this._bg.width : this._panel.x + this._bg.width, this._panel.y);
                break;
            case DrawerType.Menu_All:
                break;
        }
        this._dot.visible = !this._isShow;
        //是否要滑动
        if (AdMenuNew.NeedSlide && this._iconPanel) {
            if (this.isHorizontal) {
                this._iconPanel.hScrollBar.value = 0;
            }
            else {
                this._iconPanel.vScrollBar.value = 0;
            }
        }
        if (this._isShow) {
            this.adTimeShow();
        }
        else {
            this.adTimeHide();
        }
    };
    AdMenuNew.prototype.movePos = function (forceHide, newX, newY) {
        this._more.skin = this._isShow ? this.btnInUrl : this.btnOutUrl;
        this._mask.visible = this._isShow;
        if (forceHide) {
            this._panel.x = newX;
            this._panel.y = newY;
            this._inMove = false;
            this.visible = true;
        }
        else {
            var tw_2 = Laya.Tween.to(this._panel, { x: newX, y: newY }, 200, Laya.Ease.sineInOut, laya.utils.Handler.create(this, function () {
                this._inMove = false;
                this.visible = true;
                tw_2.clear();
                tw_2 = null;
            }));
        }
    };
    AdMenuNew.prototype.adTimeShow = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adShow(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdMenuNew.prototype.adTimeHide = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adHide(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdMenuNew.prototype.dotEffect = function () {
        if (this._dot) {
            this._dot.scale(2.3 - this._dot.scaleX, 2.3 - this._dot.scaleY);
        }
    };
    AdMenuNew.prototype.setMenuLayout = function () {
        this.size(Laya.stage.width + 10, Laya.stage.height + 10);
        this.pos(-5, -5);
        this._mask = new Laya.Sprite();
        this._mask.size(this.width, this.height);
        this._mask.pos(0, 0);
        this._mask.visible = true;
        this._mask.graphics.drawRect(0, 0, this._mask.width, this._mask.height, "#000000");
        this._mask.alpha = 0.1;
        this._mask.name = AdMenuNew.MaskName;
        this._mask.mouseEnabled = true;
        this._mask.mouseThrough = false;
        this.addChildAt(this._mask, 0);
        this._panel = new Laya.Box();
        this._panel.name = "containerBox";
        this._panel.mouseThrough = true;
        this.addChildAt(this._panel, 1);
        this._bg = new Laya.Image();
        this._bg.name = "menubg";
        this._bg.skin = this.bgUrl;
        this._bg.sizeGrid = this.bgSizeGrid;
        this._bg.pos(0, 0);
        this._panel.addChild(this._bg);
        var layoutPt = this.layoutStyle;
        //新的大小
        this._bg.width = AdMenuNew.CustomData.containerWidth ? AdMenuNew.CustomData.containerWidth : Laya.stage.width - 80;
        //根据面板大小设置icon大小
        AdMenuNew.AdIconWidth = (this._bg.width - 2 * AdMenuNew.BorderDiff - (layoutPt.x + 1) * AdMenuNew.AdIconSpaceW) / layoutPt.x;
        AdMenuNew.AdIconHeight = AdMenuNew.AdIconWidth;
        this._bg.height = (AdMenuNew.AdIconSpaceH + AdMenuNew.AdIconHeight) * layoutPt.y + AdMenuNew.BorderDiff * 2 + AdMenuNew.AdIconSpaceH;
        // 漏半截↓↓↓
        // this._bg.height = this._bg.height + 0.5*(AdMenuNew.AdIconHeight+AdMenuNew.AdIconSpaceH);
        if (this._drawerType != DrawerType.Menu_All) {
            this._more = new Laya.Button();
            this._more.stateNum = 1;
            this._more.mouseEnabled = true;
            this._more.mouseThrough = false;
            this._more.name = AdMenuNew.MoreName;
            var pt = this.btnSizePt;
            this._more.size(pt.x, pt.y);
            this._more.skin = this.btnOutUrl;
            this._panel.addChild(this._more);
            this._dot = new Laya.Image();
            this._dot.mouseEnabled = false;
            this._dot.skin = this.dotUrl;
            this._dot.anchorX = 0.5;
            this._dot.anchorY = 0.5;
            this._dot.pos(0, 0);
            this._panel.addChild(this._dot);
            Laya.timer.loop(200, this, this.dotEffect);
        }
        switch (this._drawerType) {
            case DrawerType.Menu_Top:
                this._more.pos(0, this._bg.height);
                this._panel.size(this._bg.width, this._bg.height + this._more.height);
                break;
            case DrawerType.Menu_Bottom:
                this._more.pos(0, 0);
                this._bg.pos(0, this._more.height);
                this._panel.size(this._bg.width, this._bg.height + this._more.height);
                break;
            case DrawerType.Menu_Left:
                this._more.pos(this._bg.width, this.moreBtnDown ? this._bg.height - this._more.height - 20 : 20);
                this._panel.size(this._bg.width + this._more.width, this._bg.height);
                break;
            case DrawerType.Menu_Right:
                this._more.pos(0, this.moreBtnDown ? this._bg.height - this._more.height - 20 : 20);
                this._bg.pos(this._more.width, 0);
                this._panel.size(this._bg.width + this._more.width, this._bg.height);
                break;
            case DrawerType.Menu_All:
                this._panel.size(this._bg.width, this._bg.height);
                break;
        }
        this._dot.pos(this._more.x + this._more.width, this._more.y);
    };
    AdMenuNew.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //重置一下
        this._panel.centerX = undefined;
        this._panel.centerY = undefined;
        this._panel.left = undefined;
        this._panel.right = undefined;
        this._panel.top = undefined;
        this._panel.bottom = undefined;
        //设置位置
        if (AdMenuNew.CustomData.pos) {
            this._panel.x = AdMenuNew.CustomData.pos.x;
            this._panel.y = AdMenuNew.CustomData.pos.y;
            this._panel.left = AdMenuNew.CustomData.pos.left;
            this._panel.right = AdMenuNew.CustomData.pos.right;
            this._panel.top = AdMenuNew.CustomData.pos.top;
            this._panel.bottom = AdMenuNew.CustomData.pos.bottom;
            this._panel.centerX = AdMenuNew.CustomData.pos.centerX;
            this._panel.centerY = AdMenuNew.CustomData.pos.centerY;
        }
        else {
            this._panel.left = 0;
            this._panel.centerY = 0;
        }
        this.on(Laya.Event.CLICK, this, this.onClick);
    };
    AdMenuNew.prototype.onClick = function (evt) {
        var clickName = evt.target.name;
        if (this._conData) {
            if (clickName == AdMenuNew.MoreName || clickName == AdMenuNew.MaskName) {
                this.showAndHide();
            }
        }
    };
    //==================================================================================================
    AdMenuNew.prototype.loadAndShow = function () {
        this.loadBg();
    };
    AdMenuNew.prototype.loadBg = function () {
        var bgRes = [
            { url: this.bgUrl, type: Laya.Loader.IMAGE },
            { url: this.dotUrl, type: Laya.Loader.IMAGE },
            { url: this.btnOutUrl, type: Laya.Loader.IMAGE },
            { url: this.btnInUrl, type: Laya.Loader.IMAGE }
        ];
        AdLoader.load(bgRes, laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdMenuNew.prototype.onLoadBgRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.showAndHide(false);
        //加载广告图标
        this.loadAdIcons();
    };
    AdMenuNew.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdMenuNew.prototype.onLoadAdIcons = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._parentCon == null || this._conData == null) {
            return;
        }
        this._iconPanel = new Laya.Panel();
        //icon容器大小
        this._iconPanel.pos(this._bg.x + AdMenuNew.BorderDiff, this._bg.y + AdMenuNew.BorderDiff);
        this._iconPanel.size(this._bg.width - 2 * AdMenuNew.BorderDiff, this._bg.height - 2 * AdMenuNew.BorderDiff);
        this._panel.addChild(this._iconPanel);
        this._iconPanel.removeChildren();
        this.clearElements();
        if (AdMenuNew.NeedSlide) {
            if (this.isHorizontal) {
                this._iconPanel.hScrollBarSkin = "";
                this._iconPanel.hScrollBar.elasticBackTime = 150;
                this._iconPanel.hScrollBar.elasticDistance = 100;
            }
            else {
                this._iconPanel.vScrollBarSkin = "";
                this._iconPanel.vScrollBar.elasticBackTime = 150;
                this._iconPanel.vScrollBar.elasticDistance = 100;
            }
        }
        //增加icon按钮
        var count = 0;
        var layoutPt = this.layoutStyle;
        var maxItem = this._contents.length;
        for (var i = 0; i < maxItem; i++) {
            var adContent = this._contents[i];
            if (adContent && adContent.resUrl) {
                var btnSp = new Laya.Sprite;
                btnSp.mouseEnabled = true;
                //icon
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, AdMenuNew.AdIconWidth, AdMenuNew.AdIconHeight, this._pageId, this._conData.containerId);
                adElement.icon.pos(0, 0);
                btnSp.addChild(adElement.icon);
                adElement.play();
                // txtbg
                var txtBg = new Laya.Sprite();
                txtBg.size(AdMenuNew.AdIconWidth, AdMenuNew.AdIconTxtHeight + 5);
                txtBg.graphics.drawRect(0, 0, txtBg.width, txtBg.height, "#000000");
                txtBg.alpha = 0.5;
                txtBg.pos(0, AdMenuNew.AdIconHeight - txtBg.height);
                btnSp.addChild(txtBg);
                //txt
                var txtBtnName = new Laya.Label();
                var extraW = 20;
                txtBtnName.font = "SimHei";
                txtBtnName.color = "#FFFFFF";
                txtBtnName.fontSize = 20;
                txtBtnName.align = "center";
                txtBtnName.valign = "middle";
                txtBtnName.size(AdMenuNew.AdIconWidth + extraW, AdMenuNew.AdIconTxtHeight);
                txtBtnName.pos((-0.5) * extraW, AdMenuNew.AdIconHeight - AdMenuNew.AdIconTxtHeight);
                txtBtnName.text = adContent.adName;
                btnSp.addChild(txtBtnName);
                //
                btnSp.size(AdMenuNew.AdIconWidth, AdMenuNew.AdIconHeight);
                var row = this.isHorizontal ? count % layoutPt.y : Math.floor(count / layoutPt.x);
                var col = this.isHorizontal ? Math.floor(count / layoutPt.y) : count % layoutPt.x;
                btnSp.x = AdMenuNew.AdIconSpaceW + col * (AdMenuNew.AdIconSpaceW + btnSp.width);
                btnSp.y = AdMenuNew.AdIconSpaceH + row * (AdMenuNew.AdIconSpaceH + btnSp.height);
                this._iconPanel.addChild(btnSp);
                count++;
                //为了底部滑动显示完全
                if (i + 1 == maxItem) {
                    var extSp = new Laya.Sprite();
                    extSp.size(AdMenuNew.AdIconSpaceW, AdMenuNew.AdIconSpaceH);
                    extSp.pos(0, btnSp.y + btnSp.height);
                    this._iconPanel.addChild(extSp);
                }
            }
        }
        // this.showAndHide(false);
    };
    AdMenuNew.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    //======↓设置默认属性↓==========================================================================================================
    AdMenuNew.prototype.getDrawerType = function () {
        return AdMenuNew.CustomData.drawerType ? AdMenuNew.CustomData.drawerType : DrawerType.Menu_Left;
    };
    Object.defineProperty(AdMenuNew.prototype, "moreBtnDown", {
        get: function () {
            return AdMenuNew.CustomData.moreBtnDown ? AdMenuNew.CustomData.moreBtnDown : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "btnSizePt", {
        /* 更多游戏图片 */
        get: function () {
            return AdMenuNew.CustomData.btnSizePt ? AdMenuNew.CustomData.btnSizePt : new Laya.Point(55, 66);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "btnOutUrl", {
        get: function () {
            return AdMenuNew.CustomData.btnOutSkin ? AdMenuNew.CustomData.btnOutSkin : CustomAdConfig.HOST + "moregame_new00.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "btnInUrl", {
        get: function () {
            return AdMenuNew.CustomData.btnInSkin ? AdMenuNew.CustomData.btnInSkin : CustomAdConfig.HOST + "moregame_new01.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "dotUrl", {
        get: function () {
            return AdMenuNew.CustomData.dotSkin ? AdMenuNew.CustomData.dotSkin : CustomAdConfig.HOST + "reddot.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "bgUrl", {
        get: function () {
            return AdMenuNew.CustomData.bgSkin ? AdMenuNew.CustomData.bgSkin : CustomAdConfig.HOST + "all_new00.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "bgSizeGrid", {
        get: function () {
            return AdMenuNew.CustomData.bgSizeGrid ? AdMenuNew.CustomData.bgSizeGrid : "20,20,20,20,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "layoutStyle", {
        /* 默认显示数量 宽*高 = 3*3 */
        get: function () {
            return AdMenuNew.CustomData.layoutStyle ? AdMenuNew.CustomData.layoutStyle : new Laya.Point(3, 3);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdMenuNew.prototype, "isHorizontal", {
        /* 是不是水平布局 */
        get: function () {
            return this._drawerType == DrawerType.Menu_Top || this._drawerType == DrawerType.Menu_Bottom || this._drawerType == DrawerType.Menu_All;
        },
        enumerable: true,
        configurable: true
    });
    //游戏自定义设置
    AdMenuNew.CustomData = {};
    //icon 大小
    AdMenuNew.AdIconWidth = 80;
    AdMenuNew.AdIconHeight = 80;
    AdMenuNew.AdIconTxtHeight = 30;
    //icon 水平间距
    AdMenuNew.AdIconSpaceW = 25;
    //icon 竖直间距
    AdMenuNew.AdIconSpaceH = 25;
    //边界调整
    AdMenuNew.BorderDiff = 5;
    //more 按钮名字
    AdMenuNew.MoreName = "MoreImg";
    //more 阴影标签
    AdMenuNew.MaskName = "MaskBg";
    //是否要滑动
    AdMenuNew.NeedSlide = true;
    return AdMenuNew;
}(Laya.View));
/// <reference path="./data/AdContainer.ts" />
/*
* 广告单位
* 好友在玩广告位，展示一排并定时轮换
* 一排最多 3-5 个
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdGuess = /** @class */ (function (_super) {
    __extends(AdGuess, _super);
    function AdGuess() {
        var _this = _super.call(this) || this;
        _this.CustomeData = {};
        return _this;
    }
    Object.defineProperty(AdGuess.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "guessType", {
        get: function () {
            return GuessType.Horizontal;
        },
        enumerable: true,
        configurable: true
    });
    AdGuess.prototype.setUnit = function (pageId, adContainer, parentCon, DesignData) {
        if (DesignData === void 0) { DesignData = {}; }
        if (!parentCon || !adContainer) {
            return;
        }
        this.CustomeData = DesignData;
        this.clear();
        this._pageId = pageId;
        this.visible = false;
        this.mouseThrough = true;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this._showCount = 0;
        this._realSpaceW = AdGuess.AdIconSpaceW;
        this._realSpaceH = AdGuess.AdIconSpaceH;
        AdGuess.AdIconTxtHeight = this.needName ? AdGuess.AdIconTxtHeight : 0;
        this.loadAndShow();
    };
    AdGuess.prototype.clear = function () {
        if (this._iconPanel) {
            this._iconPanel.off(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
            this._iconPanel.off(Laya.Event.MOUSE_UP, this, this.MouseUp);
            this._iconPanel.off(Laya.Event.MOUSE_OUT, this, this.MouseUp);
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        this.stopRoll();
        Laya.timer.clear(this, this.onAdSwitch);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._conData = null;
        this._contents = [];
        this._curContents = [];
    };
    AdGuess.prototype.setMenuLayout = function () {
        this._bg = new Laya.Image();
        this._bg.name = "menubg";
        this._bg.skin = this.bgUrl;
        this._bg.sizeGrid = this.bgSizeGrid;
        this._bg.pos(0, 0);
        this.addChild(this._bg);
        //新的大小
        this._bg.width = this.containerWidth;
        this._bg.height = this.containerHeight;
        this.size(this._bg.width, this._bg.height);
        //根据面板大小设置icon大小
        AdGuess.AdIconWidth = (this._bg.width - 2 * this.borderDiffWidth - (this.iconNum + 1) * AdGuess.AdIconSpaceW - this.offSetLeft) / this.iconNum;
        AdGuess.AdIconHeight = (this._bg.height - 2 * this.borderDiffHeight - 2 * AdGuess.AdIconSpaceH - this.offSetTop - AdGuess.AdIconTxtHeight);
        var minLen = Math.min(AdGuess.AdIconWidth, AdGuess.AdIconHeight);
        var wDiff = AdGuess.AdIconWidth - minLen;
        AdGuess.AdIconWidth = AdGuess.AdIconHeight = minLen;
        //调整icon间距
        if (wDiff > 0) {
            this._realSpaceW = (this._bg.width - 2 * this.borderDiffWidth - this.offSetLeft - this.iconNum * AdGuess.AdIconWidth) / (this.iconNum + 1);
        }
        else {
            this._realSpaceH = (this._bg.height - 2 * this.borderDiffHeight - AdGuess.AdIconHeight - this.offSetTop - AdGuess.AdIconTxtHeight) / 2;
        }
    };
    AdGuess.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //重置一下
        this.centerX = undefined;
        this.centerY = undefined;
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        //设置位置
        if (this.CustomeData.pos) {
            this.x = this.CustomeData.pos.x;
            this.y = this.CustomeData.pos.y;
            this.left = this.CustomeData.pos.left;
            this.right = this.CustomeData.pos.right;
            this.top = this.CustomeData.pos.top;
            this.bottom = this.CustomeData.pos.bottom;
            this.centerX = this.CustomeData.pos.centerX;
            this.centerY = this.CustomeData.pos.centerY;
        }
        else {
            this.centerX = 0;
            this.centerY = 300;
        }
    };
    //==================================================================================================
    AdGuess.prototype.loadAndShow = function () {
        this.loadBg();
    };
    AdGuess.prototype.loadBg = function () {
        var bgRes = [
            { url: this.bgUrl, type: Laya.Loader.IMAGE }
        ];
        AdLoader.load(bgRes, laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdGuess.prototype.onLoadBgRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.loadAdIcons();
    };
    AdGuess.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdGuess.prototype.onLoadAdIcons = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._parentCon == null || this._conData == null) {
            return;
        }
        if (!this._iconPanel) {
            this._iconPanel = new Laya.Panel();
            //icon容器大小
            this._iconPanel.pos(this._bg.x + this.borderDiffWidth + this.offSetLeft, this._bg.y + this.borderDiffHeight + this.offSetTop);
            this._iconPanel.size(this._bg.width - 2 * this.borderDiffWidth - this.offSetLeft, this._bg.height - 2 * this.borderDiffHeight - this.offSetTop);
            this.addChild(this._iconPanel);
        }
        this._iconPanel.removeChildren();
        this.clearElements();
        if (this.autoScroll) {
            switch (AdGuess.AdAnimationType) {
                case AdGuessAnimationType.Switch:
                    this.showSwitchAd();
                    break;
                case AdGuessAnimationType.Roll:
                    this.showRollAd();
                    break;
            }
        }
    };
    AdGuess.prototype.showRollAd = function () {
        this._curContents = this._contents.concat();
        this.adIconLayout();
        if (this._curContents.length > this.iconNum) {
            //显示的最右
            var showRightAdSp = this._iconPanel.getChildAt(this.iconNum - 1);
            var showRightX = showRightAdSp.x + showRightAdSp.width;
            //实际的最右
            var realRightAdSp = this._iconPanel.getChildAt(this._curContents.length - 1);
            var realRightX = realRightAdSp.x + realRightAdSp.width;
            //最大移动距离
            this._rollValueMax = realRightX - showRightX + this._realSpaceW;
            this._rollValue = 0;
            this._iconPanel.hScrollBarSkin = "";
            this._iconPanel.hScrollBar.setScroll(0, this._rollValueMax, this._rollValue);
            this._iconPanel.hScrollBar.changeHandler = new Laya.Handler(this, this.onRollChange);
            this._iconPanel.on(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
            this._iconPanel.on(Laya.Event.MOUSE_UP, this, this.MouseUp);
            this._iconPanel.on(Laya.Event.MOUSE_OUT, this, this.MouseUp);
            this.startRoll();
        }
    };
    AdGuess.prototype.MouseDown = function () {
        this.stopRoll();
    };
    AdGuess.prototype.MouseUp = function () {
        this.startRoll();
        this._iconPanel.hScrollBar.stopScroll();
    };
    AdGuess.prototype.onRollChange = function (value) {
        this._rollValue = value;
    };
    AdGuess.prototype.startRoll = function () {
        Laya.timer.clear(this, this.onAdRoll);
        Laya.timer.frameLoop(1, this, this.onAdRoll);
    };
    AdGuess.prototype.stopRoll = function () {
        Laya.timer.clear(this, this.onAdRoll);
    };
    AdGuess.prototype.onAdRoll = function () {
        var value = Math.min(1, CustomAdConfig.AdRollPerMs * Laya.timer.delta);
        if (this._rollValue >= this._rollValueMax) {
            this._rollInterval = -1;
        }
        else if (this._rollValue <= 0) {
            this._rollInterval = 1;
        }
        value = this._rollInterval * value;
        this._rollValue = Math.min(this._rollValueMax, this._rollValue + value);
        this._rollValue = Math.max(0, this._rollValue);
        this._iconPanel.hScrollBar.setScroll(0, this._rollValueMax, this._rollValue);
    };
    AdGuess.prototype.showSwitchAd = function () {
        this._curContents = [];
        if (this._contents.length > this.iconNum) {
            //15秒轮换
            Laya.timer.once(CustomAdConfig.AdSwitchTime, this, this.onAdSwitch);
            this._curContents = this.getShowContents();
        }
        else {
            this._curContents = this._curContents.concat(this._contents);
        }
        this.adIconLayout();
    };
    AdGuess.prototype.adIconLayout = function () {
        for (var i = 0; i < this._curContents.length; i++) {
            var adContent = this._curContents[i];
            if (adContent && adContent.resUrl) {
                var btnSp = new Laya.Sprite;
                btnSp.mouseEnabled = true;
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, AdGuess.AdIconWidth, AdGuess.AdIconHeight, this._pageId, this._conData.containerId);
                adElement.icon.pos(0, 0);
                btnSp.addChild(adElement.icon);
                adElement.play();
                if (this.needName) {
                    var txtBtnName = new Laya.Label();
                    var extraW = this._realSpaceW * 0.7;
                    txtBtnName.font = "SimHei";
                    txtBtnName.color = this.fontColor;
                    // txtBtnName.fontSize = this.fontSize;
                    txtBtnName.align = "center";
                    txtBtnName.valign = "bottom";
                    txtBtnName.size(AdGuess.AdIconWidth + extraW, AdGuess.AdIconTxtHeight);
                    txtBtnName.fontSize = 20 * txtBtnName.width / 120;
                    txtBtnName.pos((-0.5) * extraW, AdGuess.AdIconHeight);
                    txtBtnName.overflow = Laya.Text.HIDDEN;
                    txtBtnName.text = adContent.adName;
                    btnSp.addChild(txtBtnName);
                }
                btnSp.size(AdGuess.AdIconWidth, AdGuess.AdIconHeight + AdGuess.AdIconTxtHeight);
                btnSp.x = this._realSpaceW + i * (this._realSpaceW + btnSp.width);
                btnSp.y = this._realSpaceH;
                this._iconPanel.addChild(btnSp);
                zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, adContent.adId, adContent.order, adContent.effectType);
                //为了右部滑动显示完全
                if (i + 1 == this._contents.length) {
                    var extSp = new Laya.Sprite();
                    extSp.size(this._realSpaceW, this._realSpaceH);
                    extSp.pos(btnSp.x + btnSp.width, btnSp.y);
                    this._iconPanel.addChild(extSp);
                }
            }
        }
        this.visible = true;
    };
    AdGuess.prototype.onAdSwitch = function () {
        Laya.timer.clear(this, this.onAdSwitch);
        this.onLoadAdIcons();
    };
    AdGuess.prototype.getShowContents = function () {
        var result = [];
        for (var i = 0; i < this.iconNum; i++) {
            result.push(this._contents[this._showCount]);
            this._showCount = (++this._showCount) % this._contents.length;
        }
        return result;
    };
    AdGuess.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, element.adId, element.order, element.effectType);
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    Object.defineProperty(AdGuess.prototype, "isDefauleBg", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return this.bgUrl == CustomAdConfig.HOST + "guessbg4.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "needName", {
        get: function () {
            return this.CustomeData.needName == undefined ? true : this.CustomeData.needName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "borderDiffWidth", {
        get: function () {
            return this.CustomeData.borderDiffWidth == undefined ? AdGuess.BorderDiffWidth : this.CustomeData.borderDiffWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "borderDiffHeight", {
        get: function () {
            return this.CustomeData.borderDiffHeight == undefined ? AdGuess.BorderDiffHeight : this.CustomeData.borderDiffHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "bgUrl", {
        get: function () {
            return this.CustomeData.bgSkin ? this.CustomeData.bgSkin : CustomAdConfig.HOST + "guessbg4.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "bgSizeGrid", {
        get: function () {
            return this.CustomeData.bgSizeGrid && this.CustomeData.bgSkin ? this.CustomeData.bgSizeGrid : "0,100,0,100,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "iconNum", {
        /* 默认显示数量 宽=5 */
        get: function () {
            if (this.isDefauleBg) {
                return 5;
            }
            return this.CustomeData.iconNum ? this.CustomeData.iconNum : 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "containerWidth", {
        /* 设计宽度 默认Laya.stage.width */
        get: function () {
            if (this.isDefauleBg) {
                return Laya.stage.width;
            }
            return this.CustomeData.containerWidth ? this.CustomeData.containerWidth : Laya.stage.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "containerHeight", {
        /* 设计高度 150 */
        get: function () {
            return this.CustomeData.containerHeight ? this.CustomeData.containerHeight : 150;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "offSetLeft", {
        /* 左侧偏移 */
        get: function () {
            return this.CustomeData.offSetLeft ? this.CustomeData.offSetLeft : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "offSetTop", {
        /* 顶部偏移 */
        get: function () {
            return this.CustomeData.offSetTop ? this.CustomeData.offSetTop : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "fontColor", {
        /* 字体颜色 */
        get: function () {
            return this.CustomeData.fontColor ? this.CustomeData.fontColor : "#f0f0f0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuess.prototype, "autoScroll", {
        /* 自动滚动 */
        get: function () {
            return this.CustomeData.autoScroll == undefined ? true : this.CustomeData.autoScroll;
        },
        enumerable: true,
        configurable: true
    });
    //icon 大小
    AdGuess.AdIconWidth = 80;
    AdGuess.AdIconHeight = 80;
    AdGuess.AdIconTxtHeight = 25;
    //icon 水平间距
    AdGuess.AdIconSpaceW = 15;
    //icon 竖直间距
    AdGuess.AdIconSpaceH = 1;
    //边界调整
    AdGuess.BorderDiffWidth = 15;
    AdGuess.BorderDiffHeight = 6;
    //广告类型
    AdGuess.AdAnimationType = AdGuessAnimationType.Roll;
    return AdGuess;
}(Laya.View));
/*
* 广告单位
* 好友在玩广告位
* 横向/纵向滑动
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/CustomAdData.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
/// <reference path="./data/CustomConst.ts" />
var AdGuessScroll = /** @class */ (function (_super) {
    __extends(AdGuessScroll, _super);
    function AdGuessScroll() {
        var _this = _super.call(this) || this;
        _this.CustomeData = {};
        return _this;
    }
    Object.defineProperty(AdGuessScroll.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "guessType", {
        get: function () {
            return GuessType.Vertical;
        },
        enumerable: true,
        configurable: true
    });
    AdGuessScroll.prototype.setUnit = function (pageId, adContainer, parentCon, DesignData) {
        if (DesignData === void 0) { DesignData = {}; }
        if (!adContainer) {
            return;
        }
        this.CustomeData = DesignData;
        var realParentCon = this.CustomeData.verticalCon;
        if (!realParentCon)
            realParentCon = parentCon;
        if (!realParentCon)
            return;
        var scrollType = this.CustomeData.scrollType ? this.CustomeData.scrollType : 0;
        this.isVertical = scrollType == 0;
        this.itemWidth = this.CustomeData.itemWidth ? this.CustomeData.itemWidth : 120;
        this.itemHeight = this.CustomeData.itemHeight ? this.CustomeData.itemHeight : 120;
        this.spaceX = this.CustomeData.spaceX ? this.CustomeData.spaceX : 5;
        this.spaceY = this.CustomeData.spaceY ? this.CustomeData.spaceY : 20;
        AdGuessScroll.AdIconTxtHeight = this.itemHeight / 6;
        this.realItemHeight = this.needName ? this.itemHeight + AdGuessScroll.AdIconTxtHeight : this.itemHeight;
        console.log("this.realItemHeight", this.realItemHeight);
        this.clear();
        this._pageId = pageId;
        this._conData = adContainer;
        this.panel = new Laya.Panel();
        this.panel.width = realParentCon.width;
        this.panel.height = realParentCon.height;
        this.addChild(this.panel);
        if (this.isVertical) {
            this.panel.vScrollBarSkin = "";
            this.scrollBar = this.panel.vScrollBar;
        }
        else {
            this.panel.hScrollBarSkin = "";
            this.scrollBar = this.panel.hScrollBar;
        }
        realParentCon.addChild(this);
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdGuessScroll.prototype.clear = function () {
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.timer.clear(this, this.setRollState);
        Laya.timer.clear(this, this.onLoop);
        this.clearContents();
        this.removeSelf();
        this.removeChildren();
        this.panel = null;
        this.graphics.clear();
    };
    AdGuessScroll.prototype.clearContents = function () {
        if (!this.contents) {
            return;
        }
        var length = this.contents.length;
        for (var i = 0; i < length; i++) {
            var content = this.contents[i];
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, content.adId, content.order, content.effectType);
        }
        this.contents = null;
    };
    AdGuessScroll.prototype.onLoadAdIcons = function () {
        if (!this.panel)
            return;
        var contents = [];
        this.contents = contents;
        for (var i = 0, n = this._conData.contents.length; i < n; i++) {
            var cont = this._conData.contents[i];
            if (cont && cont.resUrl)
                contents.push(cont);
        }
        var totalItemNum = contents.length;
        if (this.isVertical) {
            var colNum = Math.floor(this.width / this.itemWidth);
            colNum = Math.max(colNum, 1);
            var calcColNum = this.needBorder ? colNum + 1 : colNum - 1;
            var spaceX = colNum <= 1 ? 0 : (this.width - colNum * this.itemWidth) / (calcColNum);
            for (var i = 0; i < totalItemNum; i++) {
                var adContent = contents[i];
                var row = Math.floor(i / colNum);
                var col = i - row * colNum;
                var itemX = col * (this.itemWidth + spaceX) + (this.needBorder ? spaceX : 0);
                var itemY = (this.realItemHeight + this.spaceY) * row;
                this.addItem(adContent, itemX, itemY);
            }
            var maxRow = Math.ceil(totalItemNum / colNum);
            this.totalOffset = Math.max(0, maxRow * (this.realItemHeight + this.spaceY) - this.spaceY - this.height);
        }
        else {
            var rowNum = Math.floor(this.height / this.realItemHeight);
            rowNum = Math.max(rowNum, 1);
            var calcRowNum = this.needBorder ? rowNum + 1 : rowNum - 1;
            var spaceY = rowNum <= 1 ? 0 : (this.height - rowNum * this.realItemHeight) / (calcRowNum);
            for (var i = 0; i < totalItemNum; i++) {
                var adContent = contents[i];
                var col = Math.floor(i / rowNum);
                var row = i - col * rowNum;
                var itemX = (this.realItemHeight + this.spaceX) * col;
                var itemY = row * (this.realItemHeight + spaceY) + (this.needBorder ? spaceY : 0);
                this.addItem(adContent, itemX, itemY);
            }
            var maxCol = Math.ceil(totalItemNum / rowNum);
            this.totalOffset = Math.max(0, maxCol * (this.itemWidth + this.spaceX) - this.spaceX - this.width);
        }
        this.scrollBar.value = 0;
        this.offset = AdGuessScroll.RollValue;
        this.setRollState();
    };
    AdGuessScroll.prototype.addItem = function (adContent, itemX, itemY) {
        var btnSp = new Laya.Sprite;
        btnSp.mouseEnabled = true;
        btnSp.size(this.itemWidth, this.realItemHeight);
        btnSp.x = itemX;
        btnSp.y = itemY;
        this.panel.addChild(btnSp);
        var adElement = AdElement.creatAdElement();
        if (this.skinBgItem) {
            var itemBg = new Laya.Image();
            itemBg.size(this.itemWidth, this.realItemHeight);
            itemBg.sizeGrid = this.itemBgSizeGrid;
            itemBg.skin = this.skinBgItem;
            btnSp.addChildAt(itemBg, 0);
            adElement.setData(adContent, this.itemWidth - 2 * this.itemBgContentWidthOffset, this.itemHeight - 2 * this.itemBgContentHeightOffset, this._pageId, this._conData.containerId);
            adElement.icon.pos(this.itemBgContentWidthOffset, this.itemBgContentHeightOffset);
        }
        else {
            adElement.setData(adContent, this.itemWidth, this.itemHeight, this._pageId, this._conData.containerId);
            adElement.icon.pos(0, 0);
        }
        btnSp.addChild(adElement.icon);
        adElement.play();
        if (this.needName) {
            var txtBtnName = new Laya.Label();
            var extraW = Math.floor(this.itemWidth / 6);
            txtBtnName.font = "SimHei";
            txtBtnName.color = this.fontColor;
            txtBtnName.align = "center";
            txtBtnName.valign = "bottom";
            txtBtnName.size(this.itemWidth + extraW, AdGuessScroll.AdIconTxtHeight);
            txtBtnName.pos((-0.5) * extraW, this.itemHeight);
            txtBtnName.fontSize = Math.floor(txtBtnName.height);
            txtBtnName.overflow = Laya.Text.HIDDEN;
            txtBtnName.text = adContent.adName;
            btnSp.addChild(txtBtnName);
        }
        zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, adContent.adId, adContent.order, adContent.effectType);
    };
    AdGuessScroll.prototype.setRollState = function () {
        if (!this.autoScroll) {
            return;
        }
        if (this.totalOffset > 0) {
            this.tempValue = this.scrollBar.value;
            Laya.timer.clear(this, this.onLoop);
            Laya.timer.loop(25, this, this.onLoop);
        }
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    };
    AdGuessScroll.prototype.onLoop = function () {
        this.tempValue += this.offset;
        var nextValue = Math.floor(this.tempValue);
        if (this.offset < 0 && nextValue <= 0) {
            nextValue = 0;
            this.tempValue = 0;
            this.offset = AdGuessScroll.RollValue;
        }
        else if (this.offset > 0 && nextValue >= this.totalOffset) {
            nextValue = this.totalOffset;
            this.tempValue = this.totalOffset;
            this.offset = -AdGuessScroll.RollValue;
        }
        this.scrollBar.value = nextValue;
    };
    AdGuessScroll.prototype.onMouseDown = function () {
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.timer.clear(this, this.setRollState);
        Laya.timer.clear(this, this.onLoop);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
    };
    AdGuessScroll.prototype.onMouseUp = function () {
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.scrollBar.stopScroll();
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.timer.once(1000, this, this.setRollState);
    };
    Object.defineProperty(AdGuessScroll.prototype, "needName", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return this.CustomeData.needName == undefined ? false : this.CustomeData.needName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "fontColor", {
        get: function () {
            return this.CustomeData.fontColor == undefined ? "#1A1C28" : this.CustomeData.fontColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "autoScroll", {
        get: function () {
            return this.CustomeData.autoScroll == undefined ? true : this.CustomeData.autoScroll;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "needBorder", {
        get: function () {
            return this.CustomeData.needBorder == undefined ? true : this.CustomeData.needBorder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "skinBgItem", {
        //以下--为每个广告内容加背景的参数(为全屏广告增加)
        get: function () {
            return this.CustomeData.skinBgItem == undefined ? null : this.CustomeData.skinBgItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "itemBgSizeGrid", {
        get: function () {
            return this.CustomeData.itemBgSizeGrid == undefined ? "0,0,0,0,0" : this.CustomeData.itemBgSizeGrid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "itemBgContentWidthOffset", {
        get: function () {
            return this.CustomeData.itemBgContentWidthOffset == undefined ? 0 : this.CustomeData.itemBgContentWidthOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdGuessScroll.prototype, "itemBgContentHeightOffset", {
        get: function () {
            return this.CustomeData.itemBgContentHeightOffset == undefined ? 0 : this.CustomeData.itemBgContentHeightOffset;
        },
        enumerable: true,
        configurable: true
    });
    AdGuessScroll.RollValue = 0.4;
    AdGuessScroll.AdIconTxtHeight = 20;
    return AdGuessScroll;
}(Laya.View));
/*
* 自定义广告数据
*/
/// <reference path="./data/CustomConst.ts" />
/// <reference path="./IAdGuess.ts" />
/// <reference path="./AdGuess.ts" />
/// <reference path="./AdGuessScroll.ts" />
var AdFactory = /** @class */ (function () {
    function AdFactory() {
    }
    AdFactory.getAdGuess = function (type) {
        switch (type) {
            case GuessType.Horizontal: return new AdGuess();
            case GuessType.Vertical: return new AdGuessScroll();
            default:
                throw new Error("未知guess类型: " + type);
        }
    };
    return AdFactory;
}());
/*
* 广告单位
* 吊坠广告位
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdPendant = /** @class */ (function (_super) {
    __extends(AdPendant, _super);
    function AdPendant() {
        return _super.call(this) || this;
    }
    //为了给吊坠加默认值，需要统计每页吊坠数量
    AdPendant.clearPageData = function () {
        AdPendant.PendantNum = 0;
        AdPendant.PendantCount = 0;
    };
    Object.defineProperty(AdPendant.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdPendant.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!parentCon || !adContainer) {
            return;
        }
        this.clear();
        this._pageId = pageId;
        this.visible = true;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this.loadAndShow();
    };
    AdPendant.prototype.clear = function () {
        this._pendantWidth = 0;
        this._pendantHeight = 0;
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this.stopAnimation();
        if (this._adElement) {
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
            AdElement.recoverAdElement(this._adElement);
            this._adElement = null;
        }
        this._conData = null;
        this._curContentData = null;
        this._contents = [];
    };
    AdPendant.prototype.setUnitPos = function () {
        this._pendantWidth = this._conData.conWidth ? this._conData.conWidth : 100;
        this._pendantHeight = this._conData.conHeight ? this._conData.conHeight : 100;
        this.width = this._pendantWidth;
        this.height = this._pendantHeight + this.lineLength;
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //增加线
        this._lineImg = new Laya.Image(this.lineUrl);
        this.addChildAt(this._lineImg, 0);
        this._lineImg.size(this.lineWidth, this.lineLength + 30);
        this._lineImg.centerX = 0;
        this._lineImg.y = 0;
        //固定锚点
        this.pivot(this.width * 0.5, 0);
        //设置位置
        this.x = this._conData.conX;
        this.y = this._conData.conY;
        this.left = this._conData.conLeft;
        this.right = this._conData.conRight;
        this.top = this._conData.conTop;
        this.bottom = this._conData.conBottom;
        this.centerX = this._conData.conCenterX;
        this.centerY = this._conData.conCenterY;
        if (this.x == undefined && this.y == undefined) {
            this.top = 10;
            this.x = Laya.stage.width / (AdPendant.PendantNum + 1) * (AdPendant.PendantCount + 1);
        }
        AdPendant.PendantCount++;
        // if(AdPendant.CustomData.pos)
        // {
        //     this.x = AdPendant.CustomData.pos.x;
        //     this.y = AdPendant.CustomData.pos.y;
        //     this.left = AdPendant.CustomData.pos.left;
        //     this.right =  AdPendant.CustomData.pos.right;
        //     this.top =  AdPendant.CustomData.pos.top;
        //     this.bottom =  AdPendant.CustomData.pos.bottom;
        //     this.centerX =  AdPendant.CustomData.pos.centerX;
        //     this.centerY =  AdPendant.CustomData.pos.centerY;
        // }else{
        //     this.top = 10;
        //     this.centerX = 0;
        // }
    };
    Object.defineProperty(AdPendant.prototype, "lineUrl", {
        get: function () {
            return AdPendant.CustomData.lineUrl ? AdPendant.CustomData.lineUrl : CustomAdConfig.HOST + "imgPendantLine.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdPendant.prototype, "lineWidth", {
        get: function () {
            return AdPendant.CustomData.lineWidth ? AdPendant.CustomData.lineWidth : 7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdPendant.prototype, "lineLength", {
        get: function () {
            return AdPendant.CustomData.lineLength ? AdPendant.CustomData.lineLength : 110;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdPendant.prototype, "swingRange", {
        get: function () {
            return AdPendant.CustomData.swingRange ? AdPendant.CustomData.swingRange : CustomAdConfig.PendantShakeAngleLimit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdPendant.prototype, "swingAnglePerMs", {
        get: function () {
            return AdPendant.CustomData.swingAnglePerMs ? AdPendant.CustomData.swingAnglePerMs : CustomAdConfig.PendantShakeAnglePerMs;
        },
        enumerable: true,
        configurable: true
    });
    //==================================================================================================
    AdPendant.prototype.loadAndShow = function () {
        this.loadLine();
    };
    AdPendant.prototype.loadLine = function () {
        AdLoader.load([{ url: this.lineUrl, type: Laya.Loader.IMAGE }], laya.utils.Handler.create(this, this.onLoadLineRes));
    };
    AdPendant.prototype.onLoadLineRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.loadAdIcons();
    };
    AdPendant.prototype.loadAdIcons = function () {
        this._curContentData = this._contents[0];
        AdLoader.load(this._curContentData.resUrls, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdPendant.prototype.onLoadAdIcons = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._parentCon == null || this._conData == null) {
            return;
        }
        if (!this._adElement) {
            this._adElement = AdElement.creatAdElement();
        }
        this._adElement.setData(this._curContentData, this._pendantWidth, this._pendantHeight, this._pageId, this._conData.containerId, true);
        this.addChild(this._adElement.icon);
        this._adElement.icon.pos(0, this.lineLength);
        this._adElement.play();
        this.shake();
        zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, this._curContentData.adId, this._curContentData.order, this._curContentData.effectType);
    };
    //=====================================动画特效=======================================
    AdPendant.prototype.stopAnimation = function () {
        this.stopShake();
    };
    AdPendant.prototype.shake = function () {
        this.stopShake();
        this.direction = 1;
        Laya.timer.frameLoop(1, this, this.onShakeFrame);
    };
    AdPendant.prototype.stopShake = function () {
        Laya.timer.clear(this, this.shake);
        Laya.timer.clear(this, this.onShakeFrame);
        this.rotation = 0;
    };
    AdPendant.prototype.onShakeFrame = function (e) {
        var diffRotation = this.direction * Math.min(1, this.swingAnglePerMs * Laya.timer.delta);
        var nextRotation = this.rotation + diffRotation;
        this.rotation = nextRotation;
        if (Math.abs(this.rotation) > this.swingRange) {
            this.direction = this.rotation - this.swingRange > 0 ? -1 : 1;
        }
    };
    //游戏自定义设置
    AdPendant.CustomData = {};
    //吊坠广告本页数量
    AdPendant.PendantNum = 0;
    //吊坠广告本页计数
    AdPendant.PendantCount = 0;
    return AdPendant;
}(Laya.View));
/*
* 自定义广告数据
*/
/// <reference path="./AdContainer.ts" />
/// <reference path="../AdLantern.ts" />
/// <reference path="../AdMenu.ts" />
/// <reference path="../AdMenuNew.ts" />
/// <reference path="../IAdGuess.ts" />
/// <reference path="../AdFactory.ts" />
/// <reference path="../AdPendant.ts" />
var CustomAdData = /** @class */ (function () {
    function CustomAdData() {
        this._adLanternPool = [];
        this._curLanterns = [];
        this._adMenuPool = [];
        this._curMenus = [];
        this._adMenuNewPool = [];
        this._curMenuNews = [];
        this._adGuessPool = [];
        this._curGuesss = [];
        this._adPendantPool = [];
        this._curPendants = [];
        this._pageData = [];
    }
    CustomAdData.prototype.getPageConfig = function (pageId) {
        return this._pageData[pageId];
    };
    CustomAdData.prototype.parseServerData = function (pageId, data) {
        if (data) {
            this._pageData[pageId] = AdContainer.parseData(data.list);
        }
        else {
            this._pageData[pageId] = [];
        }
    };
    //==========================AdLantern=================================
    CustomAdData.prototype.creatAdLantern = function () {
        if (this._adLanternPool.length == 0) {
            this._adLanternPool[0] = new AdLantern();
        }
        var availableUnit = this._adLanternPool.pop();
        this._curLanterns.push(availableUnit);
        return availableUnit;
    };
    CustomAdData.prototype.removeAllAdLanternByPage = function (pageId) {
        var unit;
        for (var i = this._curLanterns.length; i >= 0; i--) {
            unit = this._curLanterns[i];
            if (unit && unit.pageId == pageId) {
                unit.clear();
                this._curLanterns.splice(i, 1);
                this._adLanternPool.push(unit);
            }
        }
    };
    //==========================AdMenu=================================
    CustomAdData.prototype.creatAdMenu = function () {
        if (this._adMenuPool.length == 0) {
            this._adMenuPool[0] = new AdMenu();
        }
        var availableMenu = this._adMenuPool.pop();
        this._curMenus.push(availableMenu);
        return availableMenu;
    };
    CustomAdData.prototype.removeAllAdMenuByPage = function (pageId) {
        var menu;
        for (var i = this._curMenus.length; i >= 0; i--) {
            menu = this._curMenus[i];
            if (menu && menu.pageId == pageId) {
                menu.clear();
                this._curMenus.splice(i, 1);
                this._adMenuPool.push(menu);
            }
        }
    };
    //==========================AdMenuNew=================================
    CustomAdData.prototype.creatAdMenuNew = function () {
        if (this._adMenuNewPool.length == 0) {
            this._adMenuNewPool[0] = new AdMenuNew();
        }
        var availableMenu = this._adMenuNewPool.pop();
        this._curMenuNews.push(availableMenu);
        return availableMenu;
    };
    CustomAdData.prototype.removeAllAdMenuNewByPage = function (pageId) {
        var menu;
        for (var i = this._curMenuNews.length; i >= 0; i--) {
            menu = this._curMenuNews[i];
            if (menu && menu.pageId == pageId) {
                menu.clear();
                this._curMenuNews.splice(i, 1);
                this._adMenuNewPool.push(menu);
            }
        }
    };
    //==========================AdGuess=================================
    CustomAdData.prototype.creatAdGuess = function (type) {
        var availableGuess;
        for (var i = this._adGuessPool.length - 1; i >= 0; i--) {
            if (this._adGuessPool[i].guessType == type) {
                availableGuess = this._adGuessPool[i];
                this._adGuessPool.splice(i, 1);
                break;
            }
        }
        if (!availableGuess) {
            availableGuess = AdFactory.getAdGuess(type);
        }
        this._curGuesss.push(availableGuess);
        return availableGuess;
    };
    CustomAdData.prototype.removeAllAdGuessByPage = function (pageId) {
        var guess;
        for (var i = this._curGuesss.length; i >= 0; i--) {
            guess = this._curGuesss[i];
            if (guess && guess.pageId == pageId) {
                guess.clear();
                this._curGuesss.splice(i, 1);
                this._adGuessPool.push(guess);
            }
        }
    };
    //==========================AdPendant=================================
    CustomAdData.prototype.creatAdPendant = function () {
        if (this._adPendantPool.length == 0) {
            this._adPendantPool[0] = new AdPendant();
        }
        var availablePendant = this._adPendantPool.pop();
        this._curPendants.push(availablePendant);
        return availablePendant;
    };
    CustomAdData.prototype.removeAdPendantByPage = function (pageId) {
        var adPendant;
        for (var i = this._curPendants.length; i >= 0; i--) {
            adPendant = this._curPendants[i];
            if (adPendant && adPendant.pageId == pageId) {
                adPendant.clear();
                this._curPendants.splice(i, 1);
                this._adPendantPool.push(adPendant);
            }
        }
    };
    //=================================================================
    CustomAdData.prototype.getCurPageAdContainerByType = function (pageId, type) {
        var pageConfig = this.getPageConfig(pageId);
        var containerList = [];
        if (pageConfig) {
            //查找type 广告 返回
            for (var i = 0; i < pageConfig.length; i++) {
                if (pageConfig[i] && pageConfig[i].containerType == type) {
                    containerList.push(pageConfig[i]);
                }
            }
        }
        return containerList;
    };
    CustomAdData.GuessCustomeData = {};
    return CustomAdData;
}());
var ui;
(function (ui) {
    var customad;
    (function (customad) {
        var AdTaskItemUIUI = /** @class */ (function (_super) {
            __extends(AdTaskItemUIUI, _super);
            function AdTaskItemUIUI() {
                return _super.call(this) || this;
            }
            AdTaskItemUIUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.customad.AdTaskItemUIUI.uiView);
            };
            AdTaskItemUIUI.uiView = { "type": "View", "props": { "width": 595, "height": 120 }, "child": [{ "type": "Image", "props": { "var": "bg", "top": 0, "right": 0, "left": 0, "bottom": 0 } }, { "type": "Label", "props": { "y": 35, "x": 130, "width": 200, "var": "txtName", "valign": "middle", "text": "游戏名称", "height": 50, "fontSize": 38, "font": "SimHei", "color": "#ffffe3", "centerY": 0, "align": "left" } }, { "type": "Button", "props": { "var": "btnAd", "stateNum": 1, "right": 20, "centerY": 0 } }, { "type": "Box", "props": { "width": 80, "var": "iconBox", "left": 20, "height": 80, "centerY": 0 } }] };
            return AdTaskItemUIUI;
        }(Laya.View));
        customad.AdTaskItemUIUI = AdTaskItemUIUI;
    })(customad = ui.customad || (ui.customad = {}));
})(ui || (ui = {}));
/*
* 广告单位
* 任务型广告，支持滚动显示所有广告内容
* 推荐一屏 3-5 个
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdClickHandler.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./ui/AdUI.ts" />
/// <reference path="./component/AdElement.ts" />
var AdTask = /** @class */ (function (_super) {
    __extends(AdTask, _super);
    function AdTask() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdTask, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new AdTask;
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdTask.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!parentCon || !adContainer) {
            return;
        }
        this.clear();
        this._pageId = pageId;
        this.visible = false;
        this.mouseThrough = true;
        this._parentCon = parentCon;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        zm.eventCenter.on(zm.events.EventAppShow, this, this.onGameShow);
        this.getTaskData();
        this.loadAndShow();
    };
    AdTask.prototype.clear = function () {
        if (this._iconPanel) {
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        zm.eventCenter.off(zm.events.EventAppShow, this, this.onGameShow);
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._conData = null;
        this._contents = [];
        this._filterContents = [];
        this._itemList = {};
        this._startTaskAppId = "";
    };
    AdTask.prototype.onGameShow = function (res) {
        if (!this._startTaskAppId || this._startTaskAppId.length == 0) {
            return;
        }
        var result = true;
        if (AdTask.TaskCheckLevel == 0) {
            this.doCallback(result);
            return;
        }
        result = (Date.now() - this._startTaskTimeMark) >= 10 * 1000;
        if (AdTask.TaskCheckLevel == 1) {
            this.doCallback(result);
            return;
        }
        result = result && (res.scene == 1038); //1089?
        if (AdTask.TaskCheckLevel == 2) {
            this.doCallback(result);
            return;
        }
        result = result && (res.appID == this._startTaskAppId); //二维码?
        this.doCallback(result);
    };
    AdTask.prototype.doCallback = function (result) {
        if (result) {
            var taskInfo = this.getTaskInfoByAppId(this._startTaskAppId);
            if (taskInfo && taskInfo.canGain) {
                taskInfo.gainReward();
                this.saveTaskData();
                this.refreshItem(taskInfo);
            }
        }
        else {
            wx.showToast({
                title: '请认真试玩游戏才可获得奖励哦！',
                icon: 'none',
                duration: 2000
            });
        }
        this._startTaskAppId = "";
        this._startTaskTimeMark = 0;
        if (AdTask.CustomData.callback) {
            AdTask.CustomData.callback({ "result": result });
        }
    };
    AdTask.prototype.getTaskData = function () {
        this._taskData = [];
        var saveStr = Laya.LocalStorage.getItem(AdTask.AdTaskey);
        if (saveStr && saveStr.length > 0) {
            // console.log("getTaskData",saveStr);
            var arr = saveStr.split(",");
            for (var i = 0; i < arr.length; i++) {
                //过滤之前错误存储的NaN
                if (arr[i] && arr[i].length > 10) {
                    this._taskData.push(AdTaskInfo.parseInfo(arr[i]));
                }
            }
        }
    };
    AdTask.prototype.getTaskInfoByAppId = function (appId) {
        for (var i = 0; i < this._taskData.length; i++) {
            if (this._taskData[i].appId == appId) {
                return this._taskData[i];
            }
        }
        var info = AdTaskInfo.creatInfo(appId);
        this._taskData.push(info);
        return info;
    };
    AdTask.prototype.saveTaskData = function () {
        var saveStr = "";
        for (var i = 0; i < this._taskData.length; i++) {
            saveStr = saveStr + "," + this._taskData[i].valueStr;
        }
        saveStr = saveStr.substring(1, saveStr.length);
        Laya.LocalStorage.setItem(AdTask.AdTaskey, saveStr);
    };
    AdTask.prototype.setMenuLayout = function () {
        this.size(this.containerWidth, this.containerHeight);
        //根据面板大小设置item大小
        AdTask.AdItemWidth = this.width - 2 * AdTask.AdItemSpaceW;
        AdTask.AdItemHeight = (this.height - this.iconNum * AdTask.AdItemSpaceH) / this.iconNum;
        //根据item大小设置icon大小
        AdTask.AdIconHeight = AdTask.AdItemHeight - 2 * AdTask.AdIconSpaceH;
        AdTask.AdIconWidth = AdTask.AdIconHeight;
    };
    AdTask.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        this._parentCon.addChildAt(this, this._parentCon.numChildren);
        //重置一下
        this.centerX = undefined;
        this.centerY = undefined;
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        //设置位置
        if (AdTask.CustomData.pos) {
            this.x = AdTask.CustomData.pos.x;
            this.y = AdTask.CustomData.pos.y;
            this.left = AdTask.CustomData.pos.left;
            this.right = AdTask.CustomData.pos.right;
            this.top = AdTask.CustomData.pos.top;
            this.bottom = AdTask.CustomData.pos.bottom;
            this.centerX = AdTask.CustomData.pos.centerX;
            this.centerY = AdTask.CustomData.pos.centerY;
        }
        else {
            this.centerX = 0;
            this.y = 100;
        }
        this.on(Laya.Event.CLICK, this, this.onClick);
    };
    AdTask.prototype.onClick = function (evt) {
        var clickName = evt.target.name;
        if (this._conData) {
            if (clickName.indexOf("btnAd_") != -1) {
                var clickIdx = parseInt(clickName.split("_")[1]);
                this.clickIcon(clickIdx);
            }
        }
    };
    AdTask.prototype.clickIcon = function (idx) {
        var curContent = this._filterContents[idx];
        var taskInfo = this.getTaskInfoByAppId(curContent.linkValue);
        //跳转
        AdClickHandler.openAd(curContent, this._pageId, this._conData.containerId, laya.utils.Handler.create(this, this.jumpSuccess, [taskInfo]));
    };
    AdTask.prototype.jumpSuccess = function (taskInfo) {
        if (taskInfo.canGain) {
            this._startTaskTimeMark = Date.now();
            this._startTaskAppId = taskInfo.appId;
        }
    };
    //==================================================================================================
    AdTask.prototype.loadAndShow = function () {
        this.loadBg();
    };
    AdTask.prototype.loadBg = function () {
        var bgRes = [
            { url: this.itemBgUrl, type: Laya.Loader.IMAGE },
            { url: this.btnGainUrl, type: Laya.Loader.IMAGE },
            { url: this.btnGoUrl, type: Laya.Loader.IMAGE }
        ];
        AdLoader.load(bgRes, laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdTask.prototype.onLoadBgRes = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.loadAdIcons();
    };
    AdTask.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdTask.prototype.onLoadAdIcons = function () {
        if (this._parentCon == null || this._conData == null) {
            return;
        }
        if (!this._iconPanel) {
            this._iconPanel = new Laya.Panel();
            //icon容器大小
            this._iconPanel.pos(0, 0);
            this._iconPanel.size(this.width, this.height);
            this.addChild(this._iconPanel);
            if (AdTask.NeedSlide) {
                this._iconPanel.vScrollBarSkin = "";
                this._iconPanel.vScrollBar.elasticBackTime = 150;
                this._iconPanel.vScrollBar.elasticDistance = 100;
                this._iconPanel.vScrollBar.scrollSize = AdTask.AdItemHeight + AdTask.AdIconSpaceH;
            }
        }
        this._iconPanel.removeChildren();
        this.clearElements();
        this._itemList = {};
        this._filterContents = this.filterContents(this._contents);
        for (var i = 0; i < this._filterContents.length; i++) {
            var adContent = this._filterContents[i];
            if (adContent && adContent.resUrl) {
                var item = new ui.customad.AdTaskItemUIUI();
                item.mouseEnabled = true;
                item.size(AdTask.AdItemWidth, AdTask.AdItemHeight);
                item.bg.skin = this.itemBgUrl;
                item.bg.sizeGrid = this.itemBgSizeGrid;
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, AdTask.AdIconWidth, AdTask.AdIconHeight, this._pageId, this._conData.containerId, false);
                adElement.icon.pos(0, 0);
                item.iconBox.addChild(adElement.icon);
                adElement.play();
                item.iconBox.size(AdTask.AdIconWidth, AdTask.AdIconHeight);
                var taskInfo = this.getTaskInfoByAppId(adContent.linkValue);
                item.btnAd.stateNum = taskInfo.canGain ? this.btnStateNum : 1;
                item.btnAd.skin = taskInfo.canGain ? this.btnGainUrl : this.btnGoUrl;
                item.btnAd.label = "";
                item.btnAd.scale(0.8, 0.8);
                item.btnAd.name = "btnAd_" + i;
                item.txtName.color = this.fontColor;
                item.txtName.fontSize = this.itemNameFontSize;
                item.txtName.font = this.font;
                item.txtName.text = adContent.adName;
                item.txtName.left = item.iconBox.left + item.iconBox.width + 10;
                item.x = AdTask.AdItemSpaceW;
                item.y = i * (AdTask.AdItemSpaceH + item.height);
                this._iconPanel.addChild(item);
                this._itemList["" + taskInfo.appId] = item;
                zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, adContent.adId, adContent.order, adContent.effectType);
            }
        }
        this.visible = true;
        this.saveTaskData();
    };
    AdTask.prototype.filterContents = function (lists) {
        var result = [];
        var temp = [];
        for (var i = 0; i < lists.length; i++) {
            var adContent = lists[i];
            if (adContent && adContent.resUrl) {
                var taskInfo = this.getTaskInfoByAppId(adContent.linkValue);
                if (taskInfo.canGain) {
                    result.push(adContent);
                }
                else {
                    temp.push(adContent);
                }
            }
        }
        return result.concat(temp);
    };
    AdTask.prototype.refreshItem = function (taskInfo) {
        var item = this._itemList[taskInfo.appId];
        if (item) {
            item.btnAd.skin = taskInfo.canGain ? this.btnGainUrl : this.btnGoUrl;
        }
    };
    AdTask.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, element.adId, element.order, element.effectType);
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    Object.defineProperty(AdTask.prototype, "itemBgUrl", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return AdTask.CustomData.bgSkin ? AdTask.CustomData.bgSkin : CustomAdConfig.HOST + "itemBg.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "btnGoUrl", {
        get: function () {
            return AdTask.CustomData.btnGoSkin ? AdTask.CustomData.btnGoSkin : CustomAdConfig.HOST + "btnGO.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "btnGainUrl", {
        get: function () {
            return AdTask.CustomData.btnGainSkin ? AdTask.CustomData.btnGainSkin : CustomAdConfig.HOST + "btnGain.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "itemBgSizeGrid", {
        get: function () {
            return AdTask.CustomData.bgSizeGrid && AdTask.CustomData.bgSkin ? AdTask.CustomData.bgSizeGrid : "20,20,20,20,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "itemNameFontSize", {
        get: function () {
            return AdTask.CustomData.fontSize ? AdTask.CustomData.fontSize : 28;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "iconNum", {
        /* 默认显示数量 宽=3 */
        get: function () {
            return AdTask.CustomData.iconNum ? AdTask.CustomData.iconNum : 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "containerWidth", {
        /* 设计宽度  */
        get: function () {
            return AdTask.CustomData.containerWidth ? AdTask.CustomData.containerWidth : 595;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "containerHeight", {
        /* 设计高度  */
        get: function () {
            return AdTask.CustomData.containerHeight ? AdTask.CustomData.containerHeight : 605;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "fontColor", {
        /* 字体颜色 */
        get: function () {
            return AdTask.CustomData.fontColor ? AdTask.CustomData.fontColor : "#FFFFE3";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "font", {
        /* 字体格式 */
        get: function () {
            return AdTask.CustomData.font ? AdTask.CustomData.font : "SimHei";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTask.prototype, "btnStateNum", {
        /* 按钮态 */
        get: function () {
            return AdTask.CustomData.btnStateNum ? AdTask.CustomData.btnStateNum : 1;
        },
        enumerable: true,
        configurable: true
    });
    //游戏自定义设置
    AdTask.CustomData = {};
    //
    AdTask.AdTaskey = "Custom_AdTask_Key";
    //是否要滑动
    AdTask.NeedSlide = true;
    //item 间距
    AdTask.AdItemSpaceW = 5;
    AdTask.AdItemSpaceH = 5;
    //icon 大小
    AdTask.AdIconWidth = 80;
    AdTask.AdIconHeight = 80;
    AdTask.AdIconSpaceH = 10;
    //任务检查等级
    //0 跳转出去再回来 [保证任务界面不被关]
    //1 10秒以上再回来
    //2 必须是scene=appid跳转
    //3 必须是跳出appid 再跳回
    AdTask.TaskCheckLevel = 1;
    return AdTask;
}(Laya.View));
var AdTaskInfo = /** @class */ (function () {
    function AdTaskInfo(valueStr) {
        var arr = valueStr.split("*"); //*当分隔符
        this._appId = arr[0];
        this._taskState = parseInt(arr[1]);
        this._timeMark = parseInt(arr[2]);
        var markDate = new Date(this._timeMark);
        var today = new Date();
        if (AdTaskInfo.everyday() && markDate.getDay() != today.getDay()) {
            this.taskState = 0;
        }
    }
    AdTaskInfo.creatInfo = function (appId) {
        return new AdTaskInfo(appId + "*0*0");
    };
    AdTaskInfo.parseInfo = function (valueStr) {
        return new AdTaskInfo(valueStr);
    };
    AdTaskInfo.everyday = function () {
        return AdTask.CustomData.everyday == undefined ? false : AdTask.CustomData.everyday;
    };
    Object.defineProperty(AdTaskInfo.prototype, "appId", {
        get: function () {
            return this._appId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTaskInfo.prototype, "canGain", {
        /* 是否可取领取 */
        get: function () {
            return this._taskState == 0;
        },
        enumerable: true,
        configurable: true
    });
    AdTaskInfo.prototype.finishTask = function () {
        if (this._taskState == 0) {
            this.taskState = 1;
        }
    };
    AdTaskInfo.prototype.gainReward = function () {
        this.taskState = 2;
    };
    Object.defineProperty(AdTaskInfo.prototype, "taskState", {
        set: function (state) {
            this._taskState = state;
            this._timeMark = Date.now();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdTaskInfo.prototype, "valueStr", {
        get: function () {
            return this._appId + "*" + this._taskState + "*" + this._timeMark;
        },
        enumerable: true,
        configurable: true
    });
    return AdTaskInfo;
}());
/*
* 广告单位
* 聚合推荐广告位，展示所有包含的广告
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdBox = /** @class */ (function (_super) {
    __extends(AdBox, _super);
    function AdBox() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdBox, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new AdBox;
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    AdBox.prototype.setUnit = function (pageId, adContainer, parentCon) {
        if (!adContainer) {
            this.doCallback();
            return;
        }
        this.clear();
        this._pageId = pageId;
        this.mouseThrough = true;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this.loadAndShow();
    };
    AdBox.prototype.doCallback = function () {
        if (AdBox.CustomData.callback) {
            AdBox.CustomData.callback();
        }
    };
    AdBox.prototype.clear = function () {
        if (this._isShow && this._contents && this._contents.length > 0) {
            this.adTimeHide();
        }
        this._conData = null;
        this._contents = [];
        if (this._iconPanel) {
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._isShow = false;
    };
    AdBox.prototype.setMenuLayout = function () {
        this.size(Laya.stage.width + 10, Laya.stage.height + 10);
        this.pos(-5, -5);
        this._mask = new Laya.Sprite();
        this._mask.size(this.width, this.height);
        this._mask.pos(0, 0);
        this._mask.visible = true;
        this._mask.graphics.drawRect(0, 0, this._mask.width, this._mask.height, "#000000");
        this._mask.alpha = 0.5;
        this._mask.name = AdBox.MaskName;
        this._mask.mouseEnabled = true;
        this._mask.mouseThrough = false;
        this.addChildAt(this._mask, 0);
        this._panel = new Laya.Box();
        this._panel.name = "containerBox";
        this._panel.mouseThrough = true;
        this.addChildAt(this._panel, 1);
        this._bg = new Laya.Image();
        this._bg.name = "menubg";
        this._bg.skin = this.bgUrl;
        this._bg.sizeGrid = this.bgSizeGrid;
        this._bg.size(this.containerWidth, this.containerHeight);
        this._bg.pos(0, 0);
        this._panel.addChild(this._bg);
        this._title = new Laya.Image();
        this._title.mouseEnabled = false;
        this._title.skin = this.titleUrl;
        this._title.centerX = 0;
        this._title.y = this.titleDiff;
        this._panel.addChild(this._title);
        this._closeImg = new Laya.Image();
        this._closeImg.name = AdBox.CloseBtnName;
        this._closeImg.skin = this.closeUrl;
        this._closeImg.mouseEnabled = true;
        this._closeImg.mouseThrough = false;
        this._closeImg.centerX = 0;
        this._closeImg.y = this._bg.height + this.closeBtnDiff;
        this._panel.addChild(this._closeImg);
        var layoutPt = this.layoutStyle;
        //根据面板大小设置icon大小
        AdBox.AdIconWidth = (this._bg.width - 2 * AdBox.BorderDiff - (layoutPt.x + 1) * AdBox.AdIconSpaceW) / layoutPt.x;
        AdBox.AdIconHeight = (this._bg.height - 2 * AdBox.BorderDiff - (layoutPt.y + 1) * AdBox.AdIconSpaceH - layoutPt.y * AdBox.AdIconTxtHeight - this.offSetTop) / layoutPt.y;
        //调整
        var minLen = Math.min(AdBox.AdIconWidth, AdBox.AdIconHeight);
        var wDiff = AdBox.AdIconWidth - minLen;
        AdBox.AdIconWidth = AdBox.AdIconHeight = minLen;
        //调整icon间距
        if (wDiff > 0) {
            AdBox.AdIconSpaceW = (this._bg.width - 2 * AdBox.BorderDiff - AdBox.AdIconWidth * layoutPt.x) / (layoutPt.x + 1);
        }
        else {
            AdBox.AdIconSpaceH = (this._bg.height - 2 * AdBox.BorderDiff - AdBox.AdIconHeight * layoutPt.y - layoutPt.y * AdBox.AdIconTxtHeight - this.offSetTop) / (layoutPt.y + 1);
        }
    };
    AdBox.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        //重置一下
        this._panel.anchorX = 0;
        this._panel.anchorY = 0;
        this._panel.scale(1, 1);
        this._panel.centerX = undefined;
        this._panel.centerY = undefined;
        this._panel.left = undefined;
        this._panel.right = undefined;
        this._panel.top = undefined;
        this._panel.bottom = undefined;
        //设置位置
        if (AdBox.CustomData.pos) {
            this._panel.x = AdBox.CustomData.pos.x;
            this._panel.y = AdBox.CustomData.pos.y;
            this._panel.left = AdBox.CustomData.pos.left;
            this._panel.right = AdBox.CustomData.pos.right;
            this._panel.top = AdBox.CustomData.pos.top;
            this._panel.bottom = AdBox.CustomData.pos.bottom;
            this._panel.centerX = AdBox.CustomData.pos.centerX;
            this._panel.centerY = AdBox.CustomData.pos.centerY;
        }
        else {
            this._panel.centerX = 0;
            this._panel.centerY = 0;
        }
    };
    AdBox.prototype.onClick = function (evt) {
        var clickName = evt.target.name;
        if (this._conData) {
            if (clickName == AdBox.CloseBtnName || clickName == AdBox.MaskName) {
                this.closeAdBox();
            }
        }
    };
    AdBox.prototype.showAdBox = function () {
        if (this._isShow) {
            return;
        }
        Laya.stage.addChild(this);
        this.zOrder = 50;
        this._isShow = true;
        this._panel.scaleX = 0.5;
        this._panel.scaleY = 0.5;
        this._panel.anchorX = 0.5;
        this._panel.anchorY = 0.5;
        Laya.Tween.to(this._panel, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.backOut, laya.utils.Handler.create(this, this.onShow));
    };
    AdBox.prototype.onShow = function () {
        this.adTimeShow();
        this.on(Laya.Event.CLICK, this, this.onClick);
    };
    AdBox.prototype.adTimeShow = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adShow(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdBox.prototype.adTimeHide = function () {
        var _this = this;
        var adshowTime = zm.AdShowTime.instance;
        var containerId = this._conData.containerId;
        this._contents.forEach(function (c) {
            adshowTime.adHide(_this._pageId, containerId, c.adId, c.order, c.effectType);
        });
    };
    AdBox.prototype.closeAdBox = function () {
        if (!this._isShow) {
            return;
        }
        Laya.Tween.to(this._panel, { scaleX: 0.1, scaleY: 0.1 }, 300, Laya.Ease.backIn, laya.utils.Handler.create(this, this.onClose));
    };
    AdBox.prototype.onClose = function () {
        this.clear();
        this.doCallback();
    };
    //==================================================================================================
    AdBox.prototype.loadAndShow = function () {
        AdLoader.load(this.bgRes(), laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdBox.prototype.onLoadBgRes = function () {
        if (this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.loadAdIcons();
    };
    AdBox.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdBox.prototype.onLoadAdIcons = function () {
        this.setAdIcons();
        this.showAdBox();
    };
    AdBox.prototype.setAdIcons = function () {
        if (this._conData == null) {
            return;
        }
        this._iconPanel = new Laya.Panel();
        //icon容器大小
        this._iconPanel.pos(this._bg.x + AdBox.BorderDiff, this._bg.y + AdBox.BorderDiff);
        this._iconPanel.size(this._bg.width - 2 * AdBox.BorderDiff, this._bg.height - 2 * AdBox.BorderDiff);
        this._panel.addChild(this._iconPanel);
        this._iconPanel.removeChildren();
        this.clearElements();
        //增加icon按钮
        var count = 0;
        var layoutPt = this.layoutStyle;
        var maxItem = Math.min(layoutPt.x * layoutPt.y, this._contents.length);
        for (var i = 0; i < maxItem; i++) {
            var adContent = this._contents[i];
            if (adContent && adContent.resUrl) {
                var btnSp = new Laya.Sprite;
                btnSp.mouseEnabled = true;
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, AdBox.AdIconWidth, AdBox.AdIconHeight, this._pageId, this._conData.containerId);
                adElement.icon.pos(0, 0);
                btnSp.addChild(adElement.icon);
                adElement.play();
                var txtBtnName = new Laya.Label();
                var extraW = 20;
                txtBtnName.font = this.font;
                txtBtnName.color = this.fontColor;
                txtBtnName.fontSize = this.itemNameFontSize;
                txtBtnName.align = "center";
                txtBtnName.valign = "bottom";
                txtBtnName.size(AdBox.AdIconWidth + extraW, AdBox.AdIconTxtHeight);
                txtBtnName.pos((-0.5) * extraW, AdBox.AdIconHeight);
                txtBtnName.text = adContent.adName;
                btnSp.addChild(txtBtnName);
                btnSp.size(AdBox.AdIconWidth, AdBox.AdIconHeight + AdBox.AdIconTxtHeight);
                var row = count % layoutPt.x;
                var col = Math.floor(count / layoutPt.x);
                btnSp.x = AdBox.AdIconSpaceW + row * (AdBox.AdIconSpaceW + btnSp.width);
                btnSp.y = AdBox.AdIconSpaceH + col * (AdBox.AdIconSpaceH + btnSp.height) + this.offSetTop;
                this._iconPanel.addChild(btnSp);
                count++;
            }
        }
    };
    AdBox.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    Object.defineProperty(AdBox.prototype, "containerWidth", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return AdBox.CustomData.containerWidth ? AdBox.CustomData.containerWidth : 644;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "containerHeight", {
        get: function () {
            return AdBox.CustomData.containerHeight ? AdBox.CustomData.containerHeight : 644;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "titleUrl", {
        get: function () {
            return AdBox.CustomData.titleSkin ? AdBox.CustomData.titleSkin : CustomAdConfig.HOST + "boxtitle.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "closeUrl", {
        get: function () {
            return AdBox.CustomData.closeBtnSkin ? AdBox.CustomData.closeBtnSkin : CustomAdConfig.HOST + "boxclose.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "bgUrl", {
        get: function () {
            return AdBox.CustomData.bgSkin ? AdBox.CustomData.bgSkin : CustomAdConfig.HOST + "boxbackground.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "bgSizeGrid", {
        get: function () {
            return AdBox.CustomData.bgSizeGrid ? AdBox.CustomData.bgSizeGrid : "20,20,20,20,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "layoutStyle", {
        /* 默认显示数量 宽*高 = 4*2 */
        get: function () {
            return AdBox.CustomData.layoutStyle ? AdBox.CustomData.layoutStyle : new Laya.Point(4, 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "itemNameFontSize", {
        /* 字体大小 */
        get: function () {
            return AdBox.CustomData.fontSize ? AdBox.CustomData.fontSize : 24;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "fontColor", {
        /* 字体颜色 */
        get: function () {
            return AdBox.CustomData.fontColor ? AdBox.CustomData.fontColor : "#795844";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "font", {
        /* 字体格式 */
        get: function () {
            return AdBox.CustomData.font ? AdBox.CustomData.font : "SimHei";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "titleDiff", {
        /* 标题Y位置 */
        get: function () {
            return AdBox.CustomData.titleDiff ? AdBox.CustomData.titleDiff : -133;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "closeBtnDiff", {
        /* 关闭按钮Y位置 */
        get: function () {
            return AdBox.CustomData.closeBtnDiff ? AdBox.CustomData.closeBtnDiff : 60;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdBox.prototype, "offSetTop", {
        /* 顶部偏移 */
        get: function () {
            return AdBox.CustomData.offSetTop ? AdBox.CustomData.offSetTop : 110; //128
        },
        enumerable: true,
        configurable: true
    });
    // ====================================预先加载资源=========================================
    /* 背景 按钮 资源 */
    AdBox.prototype.bgRes = function () {
        var res = [
            { url: this.bgUrl, type: Laya.Loader.IMAGE },
            { url: this.closeUrl, type: Laya.Loader.IMAGE },
            { url: this.titleUrl, type: Laya.Loader.IMAGE }
        ];
        return res;
    };
    /* 预加载所有资源，页面弹出式不用等待 */
    AdBox.prototype.preload = function (adContainer) {
        AdLoader.load(adContainer.allAdIconRes.concat(this.bgRes()), laya.utils.Handler.create(this, this.preloadSuc));
    };
    AdBox.prototype.preloadSuc = function () {
        console.log("adbox preload suc", this._pageId);
    };
    //游戏自定义设置
    AdBox.CustomData = {};
    //icon 大小
    AdBox.AdIconWidth = 80;
    AdBox.AdIconHeight = 80;
    AdBox.AdIconTxtHeight = 40;
    //icon 水平间距
    AdBox.AdIconSpaceW = 30;
    //icon 竖直间距
    AdBox.AdIconSpaceH = 30;
    //边界调整
    AdBox.BorderDiff = 5;
    //mask 阴影标签
    AdBox.MaskName = "MaskBg";
    //close 按钮标签
    AdBox.CloseBtnName = "CloseBtn";
    return AdBox;
}(Laya.View));
/*
* 广告单位
* 聚合推荐广告位，展示所有包含的广告
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/AdContent.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./utils/AdLoader.ts" />
/// <reference path="./component/AdElement.ts" />
var AdFullScreen = /** @class */ (function (_super) {
    __extends(AdFullScreen, _super);
    function AdFullScreen() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AdFullScreen, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new AdFullScreen;
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "hasAdGuess", {
        get: function () {
            return this._adFriend != null && this._adFriend != null;
        },
        enumerable: true,
        configurable: true
    });
    AdFullScreen.prototype.setUnit = function (pageId, hotCon, friendCon, adFriend, adHot) {
        if (adFriend === void 0) { adFriend = null; }
        if (adHot === void 0) { adHot = null; }
        if (!hotCon || !friendCon) {
            this.doCallback();
            return;
        }
        this.clear();
        this._pageId = pageId;
        this._hotData = hotCon;
        this._friendData = friendCon;
        if (adFriend) {
            this._adFriend = adFriend;
        }
        if (adHot) {
            this._adHot = adHot;
        }
        this.loadAndShow();
    };
    AdFullScreen.prototype.doCallback = function () {
        if (AdFullScreen.CustomData.callback) {
            AdFullScreen.CustomData.callback();
        }
    };
    AdFullScreen.prototype.clear = function () {
        this._hotData = null;
        this._friendData = null;
        if (this._adFriend) {
            this._adFriend.clear();
        }
        if (this._adHot) {
            this._adHot.clear();
        }
        if (this._boxFriend) {
            this._boxFriend.removeChildren();
            this._boxFriend.removeSelf();
            this._boxFriend = null;
        }
        if (this._boxHot) {
            this._boxHot.removeChildren();
            this._boxHot.removeSelf();
            this._boxHot = null;
        }
        this.off(Laya.Event.CLICK, this, this.onClick);
        if (this._closeImg) {
            this._closeImg.off(Laya.Event.MOUSE_OVER, this, this.onMouseOver);
            this._closeImg.off(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        }
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._isShow = false;
    };
    AdFullScreen.prototype.getMinScale = function () {
        var scaleWidth = Laya.stage.width / 720;
        var scaleHeight = Laya.stage.height / 1280;
        return Math.min(scaleWidth, scaleHeight);
    };
    AdFullScreen.prototype.setMenuLayout = function () {
        this.size(Laya.stage.width + 10, Laya.stage.height + 10);
        this.pos(-5, -5);
        //背景蒙版
        this._bgScreen = new Laya.Image();
        this._bgScreen.size(this.width, this.height);
        this._bgScreen.pos(0, 0);
        this._bgScreen.skin = this.skinBgScreen;
        this._bgScreen.sizeGrid = "10,10,10,10,0";
        this._bgScreen.visible = true;
        this._bgScreen.mouseEnabled = true;
        this._bgScreen.mouseThrough = false;
        this.addChildAt(this._bgScreen, 0);
        //全屏容器
        this._panel = new Laya.Box();
        this._panel.size(720, 1280);
        this._panel.scale(this.getMinScale(), this.getMinScale());
        this._panel.visible = true;
        this._panel.mouseThrough = true;
        this.addChildAt(this._panel, 1);
        //一下组件位置从上到下排布
        var boxWidth = 660;
        var boxBottom = 80;
        var leftX = (this._panel.width - boxWidth) / 2;
        //返回按钮
        this._closeImg = new Laya.Image();
        this._panel.addChild(this._closeImg);
        this._closeImg.name = AdFullScreen.CloseBtnName;
        this._closeImg.skin = this.skinBtnCloseUp;
        this._closeImg.mouseEnabled = true;
        this._closeImg.mouseThrough = false;
        this._closeImg.pos(leftX, 70);
        //好友在玩
        this._titleFriend = new Laya.Image();
        this._panel.addChild(this._titleFriend);
        this._titleFriend.mouseEnabled = false;
        this._titleFriend.skin = this.skinTitleFriend;
        this._titleFriend.pos(leftX, this._closeImg.y + this._closeImg.height + 25);
        this._boxFriend = new Laya.Box();
        this._panel.addChild(this._boxFriend);
        this._boxFriend.size(boxWidth, 140);
        this._boxFriend.name = "boxFriend";
        this._boxFriend.mouseThrough = true;
        this._boxFriend.pos(leftX, this._titleFriend.y + this._titleFriend.height);
        //热门游戏
        this._titleHot = new Laya.Image();
        this._panel.addChild(this._titleHot);
        this._titleHot.mouseEnabled = false;
        this._titleHot.skin = this.skinTitleHot;
        this._titleHot.pos(leftX, this._boxFriend.y + this._boxFriend.height + 10);
        this._boxHot = new Laya.Box();
        this._panel.addChild(this._boxHot);
        this._boxHot.name = "boxHot";
        this._boxHot.mouseThrough = true;
        this._boxHot.pos(leftX, this._titleHot.y + this._titleHot.height);
        this._boxHot.size(boxWidth, Laya.stage.height / this.getMinScale() - this._boxHot.y - boxBottom);
        //热门游戏滚动mask
        this._maskScrll = new Laya.Image();
        this._panel.addChild(this._maskScrll);
        this._maskScrll.mouseEnabled = false;
        this._maskScrll.skin = this.skinScrollMask;
        this._maskScrll.sizeGrid = "30,10,10,10,0";
        this._maskScrll.size(boxWidth, 20);
        this._maskScrll.pos(leftX, Laya.stage.height / this.getMinScale() - boxBottom - 20);
    };
    AdFullScreen.prototype.setUnitBox = function () {
        //好友在玩
        var friendCustomData = {
            pos: { x: 0, y: 0 },
            guessType: GuessType.Horizontal,
            containerWidth: this._boxFriend.width,
            containerHeight: this._boxFriend.height,
            borderDiffWidth: 20,
            borderDiffHeight: 10,
            bgSkin: this.skinBgFriend,
            bgSizeGrid: "40,40,40,40,0",
            needName: false
        };
        this._adFriend.setUnit(this._pageId, this._friendData, this._boxFriend, friendCustomData);
        //热门游戏
        ////因为素材图左右有空白偏移
        var hotCustomData = {
            pos: { x: 0, y: 0 },
            verticalCon: this._boxHot,
            guessType: GuessType.Vertical,
            containerWidth: this._boxHot.width,
            containerHeight: this._boxHot.height,
            itemWidth: 218,
            itemHeight: 247,
            skinBgItem: this.skinBgHotItem,
            itemBgSizeGrid: "20,25,30,25,0",
            itemBgContentWidthOffset: 23,
            itemBgContentHeightOffset: 25,
            spaceY: 1,
            scrollType: 0,
            autoScroll: true,
            needBorder: false,
            needName: false
        };
        this._adHot.setUnit(this._pageId, this._hotData, this._boxHot, hotCustomData);
    };
    AdFullScreen.prototype.onClick = function (evt) {
        var clickName = evt.target.name;
        if (this._hotData && this._friendData) {
            if (clickName == AdFullScreen.CloseBtnName) {
                this.closeAdFullScreen();
            }
        }
    };
    AdFullScreen.prototype.showAdFullScreen = function () {
        if (this._isShow) {
            return;
        }
        this._isShow = true;
        this.zOrder = 50;
        //
        var oldScale = this._panel.scaleX;
        this._panel.anchorX = 0.5;
        this._panel.anchorY = 0.5;
        Laya.stage.addChild(this);
        this._panel.centerX = 0;
        this._panel.top = 0;
        //
        Laya.timer.callLater(this, function () {
            this._panel.scaleX = 0.5;
            this._panel.scaleY = 0.5;
            Laya.Tween.to(this._panel, { scaleX: oldScale, scaleY: oldScale }, 300, Laya.Ease.backOut, laya.utils.Handler.create(this, this.onShow));
        }.bind(this));
    };
    AdFullScreen.prototype.onShow = function () {
        this.on(Laya.Event.CLICK, this, this.onClick);
        if (this._closeImg) {
            this._closeImg.on(Laya.Event.MOUSE_OVER, this, this.onMouseOver);
            this._closeImg.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        }
    };
    AdFullScreen.prototype.onMouseOver = function () {
        this._closeImg.skin = this.skinBtnCloseDown;
    };
    AdFullScreen.prototype.onMouseOut = function () {
        this._closeImg.skin = this.skinBtnCloseUp;
    };
    AdFullScreen.prototype.closeAdFullScreen = function () {
        if (!this._isShow) {
            return;
        }
        Laya.Tween.to(this._panel, { scaleX: 0.1, scaleY: 0.1 }, 300, Laya.Ease.backIn, laya.utils.Handler.create(this, this.onClose));
    };
    AdFullScreen.prototype.onClose = function () {
        this.clear();
        this.doCallback();
    };
    //==================================================================================================
    AdFullScreen.prototype.loadAndShow = function () {
        AdLoader.load(this.bgRes(), laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    AdFullScreen.prototype.onLoadBgRes = function () {
        if (this._hotData && this._friendData) {
            this.removeChildren();
            this.setMenuLayout();
            this.loadAdIcons();
        }
    };
    AdFullScreen.prototype.loadAdIcons = function () {
        AdLoader.load(this._hotData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    AdFullScreen.prototype.onLoadAdIcons = function () {
        this.setUnitBox();
        this.showAdFullScreen();
    };
    Object.defineProperty(AdFullScreen.prototype, "skinBgScreen", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return AdFullScreen.CustomData.skinBgScreen ? AdFullScreen.CustomData.skinBgScreen : CustomAdConfig.HOST + "fullscreen/imgScreenBg.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinScrollMask", {
        get: function () {
            return AdFullScreen.CustomData.skinScrollMask ? AdFullScreen.CustomData.skinScrollMask : CustomAdConfig.HOST + "fullscreen/imgScrollMask.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinTitleFriend", {
        get: function () {
            return AdFullScreen.CustomData.skinTitleFriend ? AdFullScreen.CustomData.skinTitleFriend : CustomAdConfig.HOST + "fullscreen/imgTitleFriend.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinBgFriend", {
        get: function () {
            return AdFullScreen.CustomData.skinBgFriend ? AdFullScreen.CustomData.skinBgFriend : CustomAdConfig.HOST + "fullscreen/imgFriendBg.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinTitleHot", {
        get: function () {
            return AdFullScreen.CustomData.skinTitleHot ? AdFullScreen.CustomData.skinTitleHot : CustomAdConfig.HOST + "fullscreen/imgTitleHot.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinBtnCloseDown", {
        get: function () {
            return AdFullScreen.CustomData.skinBtnCloseDown ? AdFullScreen.CustomData.skinBtnCloseDown : CustomAdConfig.HOST + "fullscreen/btnBack_down.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinBtnCloseUp", {
        get: function () {
            return AdFullScreen.CustomData.skinBtnCloseUp ? AdFullScreen.CustomData.skinBtnCloseUp : CustomAdConfig.HOST + "fullscreen/btnBack_up.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AdFullScreen.prototype, "skinBgHotItem", {
        get: function () {
            return AdFullScreen.CustomData.skinBgHotItem ? AdFullScreen.CustomData.skinBgHotItem : CustomAdConfig.HOST + "fullscreen/imgHotItemBg.png";
        },
        enumerable: true,
        configurable: true
    });
    // ====================================预先加载资源=========================================
    /* 背景 按钮 资源 */
    AdFullScreen.prototype.bgRes = function () {
        var res = [
            { url: this.skinBtnCloseDown, type: Laya.Loader.IMAGE },
            { url: this.skinBtnCloseUp, type: Laya.Loader.IMAGE },
            { url: this.skinTitleHot, type: Laya.Loader.IMAGE },
            { url: this.skinTitleFriend, type: Laya.Loader.IMAGE },
            { url: this.skinBgFriend, type: Laya.Loader.IMAGE },
            { url: this.skinBgScreen, type: Laya.Loader.IMAGE },
            { url: this.skinScrollMask, type: Laya.Loader.IMAGE },
            { url: this.skinBgHotItem, type: Laya.Loader.IMAGE }
        ];
        return res;
    };
    /* 预加载所有资源，页面弹出式不用等待 */
    AdFullScreen.prototype.preload = function (adContainer) {
        AdLoader.load(adContainer.allAdIconRes.concat(this.bgRes()), laya.utils.Handler.create(this, this.preloadSuc));
    };
    AdFullScreen.prototype.preloadSuc = function () {
        console.log("AdFullScreen preload suc", this._pageId);
    };
    //游戏自定义设置
    AdFullScreen.CustomData = {};
    //close 按钮标签
    AdFullScreen.CloseBtnName = "CloseBtn";
    return AdFullScreen;
}(Laya.View));
/*
* 广告单位
* banner类型猜你喜欢
*/
/// <reference path="../data/CustomAdConfig.ts" />
/// <reference path="../data/AdContent.ts" />
/// <reference path="../data/AdContainer.ts" />
/// <reference path="../utils/AdLoader.ts" />
/// <reference path="../component/AdElement.ts" />
var BannerGuess = /** @class */ (function (_super) {
    __extends(BannerGuess, _super);
    function BannerGuess() {
        return _super.call(this) || this;
    }
    Object.defineProperty(BannerGuess.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    BannerGuess.prototype.show = function () {
        if (this._showGuess) {
            return;
        }
        this._showGuess = true;
        this.doShowGuess();
    };
    BannerGuess.prototype.hide = function () {
        this._showGuess = false;
        this.doShowGuess();
    };
    BannerGuess.prototype.dispose = function () {
        this.clear();
        this.removeSelf();
    };
    BannerGuess.prototype.doShowGuess = function () {
        var _this = this;
        this.visible = this._showGuess && this._loadGuess;
        if (this.visible) {
            var adshowTime_1 = zm.AdShowTime.instance;
            this._curContents.forEach(function (c) {
                adshowTime_1.adShow(_this._pageId, _this._conData.containerId, c.adId, c.order, c.effectType);
            });
        }
    };
    BannerGuess.prototype.setUnit = function (pageId, adContainer, parentCon) {
        //banner直接加载stage上,不需要parentCon 
        if (!adContainer) {
            return;
        }
        this.clear();
        this._pageId = pageId;
        this._showGuess = false;
        this._loadGuess = false;
        this.visible = false;
        this.mouseThrough = true;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        this._showCount = 0;
        BannerGuess.AdIconTxtHeight = this.needName ? BannerGuess.AdIconTxtHeight : 0;
        this.loadAndShow();
    };
    BannerGuess.prototype.clear = function () {
        if (this._iconPanel) {
            this._iconPanel.off(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
            this._iconPanel.off(Laya.Event.MOUSE_UP, this, this.MouseUp);
            this._iconPanel.off(Laya.Event.MOUSE_OUT, this, this.MouseUp);
            this._iconPanel.removeChildren();
            this._iconPanel.removeSelf();
            this._iconPanel = null;
        }
        this.clearElements();
        this.stopRoll();
        Laya.timer.clear(this, this.onAdSwitch);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        this._conData = null;
        this._contents = [];
        this._curContents = [];
    };
    BannerGuess.prototype.setMenuLayout = function () {
        this._bg = new Laya.Image();
        this._bg.name = "menubg";
        this._bg.skin = this.bgUrl;
        this._bg.sizeGrid = this.bgSizeGrid;
        this._bg.pos(0, 0);
        this.addChild(this._bg);
        //新的大小
        this._bg.width = this.containerWidth;
        this._bg.height = this.containerHeight;
        this.size(this._bg.width, this._bg.height);
        //根据面板大小设置icon大小
        BannerGuess.AdIconWidth = (this._bg.width - 2 * BannerGuess.BorderDiff - (this.iconNum + 1) * BannerGuess.AdIconSpaceW - this.offSetLeft) / this.iconNum;
        BannerGuess.AdIconHeight = (this._bg.height - 2 * BannerGuess.BorderDiff - 2 * BannerGuess.AdIconSpaceH - this.offSetTop - BannerGuess.AdIconTxtHeight);
        var minLen = Math.min(BannerGuess.AdIconWidth, BannerGuess.AdIconHeight);
        var wDiff = BannerGuess.AdIconWidth - minLen;
        BannerGuess.AdIconWidth = BannerGuess.AdIconHeight = minLen;
        //调整icon间距
        if (wDiff > 0) {
            BannerGuess.AdIconSpaceW = (this._bg.width - 2 * BannerGuess.BorderDiff - this.offSetLeft - this.iconNum * BannerGuess.AdIconWidth) / (this.iconNum + 1);
        }
        else {
            BannerGuess.AdIconSpaceH = (this._bg.height - 2 * BannerGuess.BorderDiff - BannerGuess.AdIconHeight - this.offSetTop - BannerGuess.AdIconTxtHeight) / 2;
        }
    };
    BannerGuess.prototype.setUnitPos = function () {
        //TODO 先计算排版，和panel大小，然后摆位置，放置
        this.setMenuLayout();
        Laya.stage.addChild(this);
        this.zOrder = 1100;
        //重置一下
        this.centerX = undefined;
        this.centerY = undefined;
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        //设置位置
        if (BannerGuess.CustomData.pos) {
            this.left = BannerGuess.CustomData.pos.left;
            this.top = BannerGuess.CustomData.pos.top;
            this.centerX = BannerGuess.CustomData.pos.centerX;
            this.bottom = BannerGuess.CustomData.pos.bottom;
        }
        else {
            this.centerX = 0;
            this.bottom = 0;
        }
    };
    //==================================================================================================
    BannerGuess.prototype.loadAndShow = function () {
        this.loadBg();
    };
    BannerGuess.prototype.loadBg = function () {
        var bgRes = [
            { url: this.bgUrl, type: Laya.Loader.IMAGE }
        ];
        AdLoader.load(bgRes, laya.utils.Handler.create(this, this.onLoadBgRes));
    };
    BannerGuess.prototype.onLoadBgRes = function () {
        if (this._conData == null) {
            return;
        }
        this.removeChildren();
        this.setUnitPos();
        this.loadAdIcons();
    };
    BannerGuess.prototype.loadAdIcons = function () {
        AdLoader.load(this._conData.allAdIconRes, laya.utils.Handler.create(this, this.onLoadAdIcons));
    };
    BannerGuess.prototype.onLoadAdIcons = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._conData == null) {
            return;
        }
        if (!this._iconPanel) {
            this._iconPanel = new Laya.Panel();
            //icon容器大小
            this._iconPanel.pos(this._bg.x + BannerGuess.BorderDiff + this.offSetLeft, this._bg.y + BannerGuess.BorderDiff + this.offSetTop);
            this._iconPanel.size(this._bg.width - 2 * BannerGuess.BorderDiff - this.offSetLeft, this._bg.height - 2 * BannerGuess.BorderDiff - this.offSetTop);
            this.addChild(this._iconPanel);
        }
        this._iconPanel.removeChildren();
        this.clearElements();
        switch (BannerGuess.AdAnimationType) {
            case AdGuessAnimationType.Switch:
                this.showSwitchAd();
                break;
            case AdGuessAnimationType.Roll:
                this.showRollAd();
                break;
        }
    };
    BannerGuess.prototype.showRollAd = function () {
        this._curContents = this._contents.concat();
        this.adIconLayout();
        this._loadGuess = true;
        this.doShowGuess();
        if (this._curContents.length > this.iconNum) {
            //显示的最右
            var showRightAdSp = this._iconPanel.getChildAt(this.iconNum - 1);
            var showRightX = showRightAdSp.x + showRightAdSp.width;
            //实际的最右
            var realRightAdSp = this._iconPanel.getChildAt(this._curContents.length - 1);
            var realRightX = realRightAdSp.x + realRightAdSp.width;
            //最大移动距离
            this._rollValueMax = realRightX - showRightX + BannerGuess.AdIconSpaceW;
            this._rollValue = 0;
            this._iconPanel.hScrollBarSkin = "";
            this._iconPanel.hScrollBar.setScroll(0, this._rollValueMax, this._rollValue);
            this._iconPanel.hScrollBar.changeHandler = new Laya.Handler(this, this.onRollChange);
            this._iconPanel.on(Laya.Event.MOUSE_DOWN, this, this.MouseDown);
            this._iconPanel.on(Laya.Event.MOUSE_UP, this, this.MouseUp);
            this._iconPanel.on(Laya.Event.MOUSE_OUT, this, this.MouseUp);
            this.startRoll();
        }
    };
    BannerGuess.prototype.MouseDown = function () {
        this.stopRoll();
    };
    BannerGuess.prototype.MouseUp = function () {
        this.startRoll();
        this._iconPanel.hScrollBar.stopScroll();
    };
    BannerGuess.prototype.onRollChange = function (value) {
        this._rollValue = value;
    };
    BannerGuess.prototype.startRoll = function () {
        Laya.timer.clear(this, this.onAdRoll);
        Laya.timer.frameLoop(1, this, this.onAdRoll);
    };
    BannerGuess.prototype.stopRoll = function () {
        Laya.timer.clear(this, this.onAdRoll);
    };
    BannerGuess.prototype.onAdRoll = function () {
        var value = Math.min(1, CustomAdConfig.AdRollPerMs * Laya.timer.delta);
        if (this._rollValue >= this._rollValueMax) {
            this._rollInterval = -1;
        }
        else if (this._rollValue <= 0) {
            this._rollInterval = 1;
        }
        value = this._rollInterval * value;
        this._rollValue = Math.min(this._rollValueMax, this._rollValue + value);
        this._rollValue = Math.max(0, this._rollValue);
        this._iconPanel.hScrollBar.setScroll(0, this._rollValueMax, this._rollValue);
    };
    BannerGuess.prototype.showSwitchAd = function () {
        this._curContents = [];
        if (this._contents.length > this.iconNum) {
            //15秒轮换
            Laya.timer.once(CustomAdConfig.AdSwitchTime, this, this.onAdSwitch);
            this._curContents = this.getShowContents();
        }
        else {
            this._curContents = this._curContents.concat(this._contents);
        }
        this.adIconLayout();
        this._loadGuess = true;
        this.doShowGuess();
    };
    BannerGuess.prototype.adIconLayout = function () {
        for (var i = 0; i < this._curContents.length; i++) {
            var adContent = this._curContents[i];
            if (adContent && adContent.resUrl) {
                var btnSp = new Laya.Sprite;
                btnSp.mouseEnabled = true;
                var adElement = AdElement.creatAdElement();
                this._curElements.push(adElement);
                adElement.setData(adContent, BannerGuess.AdIconWidth, BannerGuess.AdIconHeight, this._pageId, this._conData.containerId);
                adElement.icon.pos(0, 0);
                btnSp.addChild(adElement.icon);
                adElement.play();
                if (this.needName) {
                    var txtBtnName = new Laya.Label();
                    var extraW = BannerGuess.AdIconSpaceW * 0.7;
                    txtBtnName.font = "SimHei";
                    txtBtnName.color = this.fontColor;
                    txtBtnName.align = "center";
                    txtBtnName.valign = "bottom";
                    txtBtnName.size(BannerGuess.AdIconWidth + extraW, BannerGuess.AdIconTxtHeight);
                    txtBtnName.fontSize = 20 * txtBtnName.width / 120;
                    txtBtnName.pos((-0.5) * extraW, BannerGuess.AdIconHeight);
                    txtBtnName.overflow = Laya.Text.HIDDEN;
                    txtBtnName.text = adContent.adName;
                    btnSp.addChild(txtBtnName);
                }
                btnSp.size(BannerGuess.AdIconWidth, BannerGuess.AdIconHeight + BannerGuess.AdIconTxtHeight);
                btnSp.x = BannerGuess.AdIconSpaceW + i * (BannerGuess.AdIconSpaceW + btnSp.width);
                btnSp.y = BannerGuess.AdIconSpaceH;
                this._iconPanel.addChild(btnSp);
                //为了右部滑动显示完全
                if (i + 1 == this._contents.length) {
                    var extSp = new Laya.Sprite();
                    extSp.size(BannerGuess.AdIconSpaceW, BannerGuess.AdIconSpaceH);
                    extSp.pos(btnSp.x + btnSp.width, btnSp.y);
                    this._iconPanel.addChild(extSp);
                }
            }
        }
    };
    BannerGuess.prototype.onAdSwitch = function () {
        Laya.timer.clear(this, this.onAdSwitch);
        this.onLoadAdIcons();
    };
    BannerGuess.prototype.getShowContents = function () {
        var result = [];
        for (var i = 0; i < this.iconNum; i++) {
            result.push(this._contents[this._showCount]);
            this._showCount = (++this._showCount) % this._contents.length;
        }
        return result;
    };
    BannerGuess.prototype.clearElements = function () {
        if (this._curElements && this._curElements.length > 0) {
            for (var i = this._curElements.length - 1; i >= 0; i--) {
                var element = this._curElements[i];
                zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, element.adId, element.order, element.effectType);
                AdElement.recoverAdElement(element);
                this._curElements.splice(i, 1);
            }
        }
        this._curElements = [];
    };
    Object.defineProperty(BannerGuess.prototype, "isDefauleBg", {
        //======↓设置默认属性↓==========================================================================================================
        get: function () {
            return this.bgUrl == CustomAdConfig.HOST + "guessbg4.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "needName", {
        get: function () {
            return BannerGuess.CustomData.needName ? BannerGuess.CustomData.needName : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "bgUrl", {
        get: function () {
            return BannerGuess.CustomData.bgSkin ? BannerGuess.CustomData.bgSkin : CustomAdConfig.HOST + "guessbg4.png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "bgSizeGrid", {
        get: function () {
            return BannerGuess.CustomData.bgSizeGrid && BannerGuess.CustomData.bgSkin ? BannerGuess.CustomData.bgSizeGrid : "0,100,0,100,0";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "iconNum", {
        /* 默认显示数量 宽=5 */
        get: function () {
            return BannerGuess.CustomData.iconNum ? BannerGuess.CustomData.iconNum : 5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "containerWidth", {
        /* 设计宽度 默认Laya.stage.width */
        get: function () {
            if (this.isDefauleBg) {
                return Laya.stage.width;
            }
            return BannerGuess.CustomData.containerWidth ? BannerGuess.CustomData.containerWidth : Laya.stage.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "containerHeight", {
        /* 设计高度 默认180 */
        get: function () {
            // if(this.isDefauleBg)
            // {
            //     return 180;
            // }
            return BannerGuess.CustomData.containerHeight ? BannerGuess.CustomData.containerHeight : 180;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "offSetLeft", {
        /* 左侧偏移 */
        get: function () {
            return BannerGuess.CustomData.offSetLeft ? BannerGuess.CustomData.offSetLeft : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "offSetTop", {
        /* 顶部偏移 */
        get: function () {
            return BannerGuess.CustomData.offSetTop ? BannerGuess.CustomData.offSetTop : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerGuess.prototype, "fontColor", {
        /* 字体颜色 */
        get: function () {
            return BannerGuess.CustomData.fontColor ? BannerGuess.CustomData.fontColor : "#f0f0f0";
        },
        enumerable: true,
        configurable: true
    });
    //游戏自定义设置
    BannerGuess.CustomData = {};
    //icon 大小
    BannerGuess.AdIconWidth = 80;
    BannerGuess.AdIconHeight = 80;
    BannerGuess.AdIconTxtHeight = 34;
    //icon 水平间距
    BannerGuess.AdIconSpaceW = 23;
    //icon 竖直间距
    BannerGuess.AdIconSpaceH = 8;
    //边界调整
    BannerGuess.BorderDiff = 5;
    //广告类型
    BannerGuess.AdAnimationType = AdGuessAnimationType.Roll;
    return BannerGuess;
}(Laya.View));
var BannerAd = /** @class */ (function () {
    function BannerAd(adUnitId) {
        this._loaded = true;
        this._adUnitId = adUnitId;
    }
    Object.defineProperty(BannerAd.prototype, "adUnitId", {
        get: function () {
            return this._adUnitId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BannerAd.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    BannerAd.prototype.create = function (designWidth, designHeight, left, top, maxHeight, designStyle) {
        var _this = this;
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (maxHeight === void 0) { maxHeight = 0; }
        if (designStyle === void 0) { designStyle = new Laya.Point(720, 1440); }
        if (!Laya.Browser.window.wx) {
            return;
        }
        var systemInfo = wx.getSystemInfoSync();
        var isIphoneX = systemInfo && systemInfo.model.indexOf("iPhone X") != -1;
        if (isIphoneX) {
            designWidth = systemInfo.screenWidth;
        }
        else {
            designWidth = designWidth / designStyle.x * systemInfo.screenWidth;
            designHeight = designHeight / designStyle.y * systemInfo.screenHeight;
            maxHeight = maxHeight / Laya.stage.height * systemInfo.screenHeight;
        }
        this._bannerAd = wx.createBannerAd({
            adUnitId: this._adUnitId,
            style: {
                left: left,
                top: top,
                width: designWidth
            }
        });
        this._bannerAd.onLoad(function () {
            console.log('banner 广告加载成功');
            _this._loaded = true;
            if (BannerAd.bannerLoadCallback) {
                BannerAd.bannerLoadCallback.runWith({ load: true });
            }
        });
        this._bannerAd.onError(function (err) {
            console.log('banner 广告加载失败', err);
            _this._loaded = false;
            if (BannerAd.bannerLoadCallback) {
                BannerAd.bannerLoadCallback.runWith({ load: false });
            }
        });
        this._bannerAd.onResize(function (res) {
            if (left == 0 && top == 0) {
                if (isIphoneX) {
                    _this._bannerAd.style.left = (systemInfo.screenWidth - _this._bannerAd.style.realWidth) / 2;
                    _this._bannerAd.style.top = Math.ceil(systemInfo.screenHeight - _this._bannerAd.style.realHeight - 12);
                }
                else {
                    var minHeight = Math.min(maxHeight, designHeight, res.height);
                    if (minHeight < res.height) {
                        var calcWidth = minHeight * _this._bannerAd.style.realWidth / _this._bannerAd.style.realHeight;
                        if (calcWidth >= 300) {
                            _this._bannerAd.style.width = calcWidth;
                            _this._bannerAd.style.height = minHeight;
                        }
                    }
                    _this._bannerAd.style.left = (systemInfo.screenWidth - _this._bannerAd.style.realWidth) / 2;
                    _this._bannerAd.style.top = systemInfo.screenHeight - _this._bannerAd.style.realHeight;
                }
            }
        });
    };
    BannerAd.prototype.show = function () {
        if (this._bannerAd) {
            this._bannerAd.show();
        }
    };
    BannerAd.prototype.hide = function () {
        if (this._bannerAd) {
            this._bannerAd.hide();
        }
    };
    BannerAd.prototype.destroy = function () {
        this._bannerAd && this._bannerAd.destroy();
    };
    return BannerAd;
}());
/*
* 广告单位
* 自定义banner
*/
/// <reference path="../data/AdContent.ts" />
/// <reference path="../data/AdContainer.ts" />
/// <reference path="../utils/AdLoader.ts" />
/// <reference path="../component/AdElement.ts" />
var CustomizedBanner = /** @class */ (function (_super) {
    __extends(CustomizedBanner, _super);
    function CustomizedBanner() {
        return _super.call(this) || this;
    }
    Object.defineProperty(CustomizedBanner.prototype, "pageId", {
        get: function () {
            return this._pageId;
        },
        enumerable: true,
        configurable: true
    });
    CustomizedBanner.prototype.show = function () {
        if (this._showFlag) {
            return;
        }
        this._showFlag = true;
        this.checkShow();
    };
    CustomizedBanner.prototype.hide = function () {
        this._showFlag = false;
        this.checkShow();
    };
    CustomizedBanner.prototype.checkShow = function () {
        this.visible = this._showFlag && this._loadFlag;
        if (this.visible) {
            if (this._adElement) {
                zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
            }
        }
        else {
            if (this._adElement) {
                zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
            }
        }
    };
    CustomizedBanner.prototype.dispose = function () {
        this.clear();
    };
    CustomizedBanner.prototype.setUnit = function (pageId, adContainer, designStyle, designHeight, left, top) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (!adContainer) {
            return;
        }
        this.clear();
        this._contentIdx = -1;
        this._pageId = pageId;
        this._showFlag = false;
        this._loadFlag = false;
        this.visible = false;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this._conData = adContainer;
        this._contents = this._conData.contents;
        //计算缩放
        var realDesignHeight = (designHeight / designStyle.y) * Laya.stage.height;
        this.height = Math.min(realDesignHeight, this._conData.conHeight);
        if (this.height < this._conData.conHeight) {
            //等比缩放
            this.width = (this.height / this._conData.conHeight) * this._conData.conWidth;
        }
        else {
            this.width = this._conData.conWidth;
        }
        this.setUnitPos(left, top);
        this.loadAndShow();
    };
    CustomizedBanner.prototype.clear = function () {
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.removeSelf();
        this.removeChildren();
        this.graphics.clear();
        if (this._adElement) {
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
            AdElement.recoverAdElement(this._adElement);
            this._adElement = null;
        }
        Laya.timer.clear(this, this.onAdEnd);
        this._conData = null;
        this._curContentData = null;
        this._contents = [];
    };
    CustomizedBanner.prototype.setUnitPos = function (left, top) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        Laya.stage.addChild(this);
        this.zOrder = 1100;
        //重置一下 坐标
        this.x = undefined;
        this.y = undefined;
        this.centerX = undefined;
        this.centerY = undefined;
        this.left = undefined;
        this.right = undefined;
        this.top = undefined;
        this.bottom = undefined;
        if (left == 0 && top == 0) {
            this.centerX = 0;
            this.bottom = 0;
        }
        else {
            this.left = left;
            this.top = top;
        }
    };
    CustomizedBanner.prototype.onClick = function () {
        this.loadAndShow();
    };
    //==================================================================================================
    CustomizedBanner.prototype.loadAndShow = function () {
        Laya.timer.clear(this, this.onAdEnd);
        var count = 0;
        var nextContent;
        while (count < this._contents.length) {
            this._contentIdx = (this._contentIdx + 1) % this._contents.length;
            nextContent = this._contents[this._contentIdx];
            if (nextContent) {
                break;
            }
            count++;
        }
        if (count < this._contents.length) {
            if (!this._curContentData || nextContent.adId != this._curContentData.adId) {
                this._curContentData = nextContent;
                AdLoader.load(this._curContentData.resUrls, laya.utils.Handler.create(this, this.onLoadRes));
            }
        }
    };
    CustomizedBanner.prototype.onLoadRes = function () {
        if (this._pageId != CustomAdMgr.curPageId || this._conData == null) {
            return;
        }
        this._loadFlag = true;
        if (!this._adElement) {
            this._adElement = AdElement.creatAdElement();
        }
        else {
            zm.AdShowTime.instance.adHide(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
        }
        this.removeChildren();
        this._adElement.setData(this._curContentData, this.width, this.height, this._pageId, this._conData.containerId, true, laya.utils.Handler.create(this, this.onClick, null, false));
        this.addChild(this._adElement.icon);
        this._adElement.play();
        // zm.AdShowTime.instance.adShow(this._pageId, this._conData.containerId, this._adElement.adId, this._adElement.order, this._adElement.effectType);
        this.checkShow();
        Laya.timer.once(this._curContentData.showTime * 1000, this, this.onAdEnd);
    };
    CustomizedBanner.prototype.onAdEnd = function (e) {
        this.loadAndShow();
    };
    return CustomizedBanner;
}(Laya.View));
/// <reference path="../data/AdContainer.ts" />
/// <reference path="./BannerGuess.ts" />
/// <reference path="./BannerAd.ts" />
/// <reference path="./CustomizedBanner.ts" />
/* banner(原生，猜你喜欢，备份)广告显示控制 */
var BannerAdManager = /** @class */ (function () {
    function BannerAdManager() {
    }
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
    BannerAdManager.prototype.initBanner = function (width, height, left, top, interval, fixedHeight, designStyle, customProperty, iphoneXEnable) {
        if (width === void 0) { width = 650; }
        if (height === void 0) { height = 220; }
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (interval === void 0) { interval = 60000; }
        if (fixedHeight === void 0) { fixedHeight = 0; }
        if (designStyle === void 0) { designStyle = new Laya.Point(720, 1440); }
        if (iphoneXEnable === void 0) { iphoneXEnable = false; }
        this._bannerShowFlag = true;
        this._styleWidth = width;
        this._styleHeight = height;
        this._styleLeft = left;
        this._styleTop = top;
        this._interval = interval;
        this._fixedHeight = fixedHeight == 0 ? height : fixedHeight;
        this._designStyle = designStyle;
        this._iphoneXEnable = iphoneXEnable;
        BannerGuess.CustomData = customProperty ? customProperty : {};
        // BannerGuess 宽高 与 Banner广告宽高分离
        // 如果没有设置，还是默认Banner广告宽高
        BannerGuess.CustomData.containerWidth = BannerGuess.CustomData.containerWidth || width;
        BannerGuess.CustomData.containerHeight = BannerGuess.CustomData.containerHeight || height;
        if (top == 0 && left == 0) {
            BannerGuess.CustomData.pos = { centerX: 0, bottom: 0 };
        }
        else {
            BannerGuess.CustomData.pos = { top: top, left: left };
        }
        BannerAd.bannerLoadCallback = laya.utils.Handler.create(this, this.bannerCallback, null, false);
    };
    BannerAdManager.prototype.bannerCallback = function (res) {
        if (res && res.load == true) {
            this.removeBackup();
        }
        else {
            this.showBackup();
        }
    };
    BannerAdManager.prototype.setPageBanner = function (adUnitId, pageId, pageInstance, interval) {
        if (adUnitId === void 0) { adUnitId = ""; }
        if (pageId === void 0) { pageId = 0; }
        if (pageInstance === void 0) { pageInstance = null; }
        if (interval === void 0) { interval = null; }
        this._pageInstance = pageInstance;
        this._curPageId = pageId;
        this._curAdUnitId = adUnitId;
        this._hasZmBannerData = false;
        this._curBackupData = null;
        this._curGuessData = null;
        this._curCustomBannerData = null;
        // this.removeBanner();
        if (interval && interval > 0) {
            this._interval = interval;
        }
        this._bannerShowFlag = true;
        if (pageId == 0) {
            this.doShow();
        }
    };
    BannerAdManager.prototype.updateGuess = function (adContainerData) {
        this._curGuessData = adContainerData;
        this._hasZmBannerData = true;
    };
    BannerAdManager.prototype.updateBackup = function (adContainerData) {
        this._curBackupData = adContainerData;
        //backup优先级低于wx banner
        // this._hasZmBannerData = true;
    };
    BannerAdManager.prototype.updateCustomBanner = function (adContainerData) {
        this._curCustomBannerData = adContainerData;
        this._hasZmBannerData = true;
    };
    BannerAdManager.prototype.showBanner = function () {
        this._bannerShowFlag = true;
        this.doShow();
    };
    BannerAdManager.prototype.showBannerAfterLoaded = function (pageId) {
        if (pageId != this._curPageId) {
            return;
        }
        this.doShow();
    };
    BannerAdManager.prototype.doShow = function () {
        //根据机型检查是否显示banner
        if (!this._bannerShowFlag) { //显示标志
            return;
        }
        if (this._curPageId != 0 && this._curPageId != CustomAdMgr.curPageId) { //当前页面不是目标页面
            return;
        }
        //this._curPageId=0，必显示bannner
        if (this._curPageId != 0 && this._hasZmBannerData) {
            this.showZmBannerAd();
        }
        else {
            //根据机型检查是否显示banner(只有wxbanner才检查机型)
            if (this.checkPhoneWxBannerEnable()) {
                this.showWxBanner();
            }
        }
        //防止加多次
        Laya.timer.clear(this, this.updateBanner);
        Laya.timer.loop(this._interval, this, this.updateBanner);
    };
    BannerAdManager.prototype.hideBanner = function () {
        this._bannerShowFlag = false;
        if (this._curAd) {
            if (this._curAd.loaded) {
                this._curAd.hide();
            }
            else {
                this.removeWxBanner();
            }
        }
        if (this._curGuess) {
            this._curGuess.hide();
        }
        if (this._curBackup) {
            this._curBackup.hide();
        }
        if (this._curCustomBanner) {
            this._curCustomBanner.hide();
        }
        Laya.timer.clear(this, this.updateBanner);
    };
    //zm banner广告
    BannerAdManager.prototype.showZmBannerAd = function () {
        this.removeWxBanner();
        //按zm广告优先级来的
        if (this._curGuessData) {
            this.showGuess();
            return;
        }
        if (this._curCustomBannerData) {
            this.showCustomBanner();
            return;
        }
    };
    BannerAdManager.prototype.removeZmBannerAd = function () {
        this.removeCustomBanner();
        this.removeGuess();
        this.removeBackup();
    };
    //自定义banner
    BannerAdManager.prototype.showCustomBanner = function () {
        this.removeGuess();
        this.removeBackup();
        if (this._curCustomBanner) {
            if (this._curCustomBanner.pageId != this._curPageId) {
                this._curCustomBanner.setUnit(this._curPageId, this._curCustomBannerData, this._designStyle, this._styleHeight, this._styleLeft, this._styleTop);
            }
        }
        else {
            this._curCustomBanner = new CustomizedBanner();
            this._curCustomBanner.setUnit(this._curPageId, this._curCustomBannerData, this._designStyle, this._styleHeight, this._styleLeft, this._styleTop);
        }
        this._curCustomBanner.show();
    };
    BannerAdManager.prototype.removeCustomBanner = function () {
        if (this._curCustomBanner) {
            this._curCustomBanner.dispose();
            this._curCustomBanner = null;
        }
    };
    //猜你喜欢
    BannerAdManager.prototype.showGuess = function () {
        this.removeCustomBanner();
        this.removeBackup();
        if (this._curGuess) {
            if (this._curGuess.pageId != this._curPageId) {
                this._curGuess.setUnit(this._curPageId, this._curGuessData, this._pageInstance);
            }
        }
        else {
            this._curGuess = new BannerGuess();
            this._curGuess.setUnit(this._curPageId, this._curGuessData, this._pageInstance);
        }
        this._curGuess.show();
    };
    BannerAdManager.prototype.removeGuess = function () {
        if (this._curGuess) {
            this._curGuess.dispose();
            this._curGuess = null;
        }
    };
    //备份-猜你喜欢
    BannerAdManager.prototype.showBackup = function () {
        //不显示
        if (!this._bannerShowFlag || !this._curBackupData || (this._curAd && this._curAd.loaded)) {
            return;
        }
        if (this._curBackup) {
            if (this._curBackup.pageId != this._curPageId) {
                this._curBackup.setUnit(this._curPageId, this._curBackupData, this._pageInstance);
            }
        }
        else {
            this._curBackup = new BannerGuess();
            this._curBackup.setUnit(this._curPageId, this._curBackupData, this._pageInstance);
        }
        this._curBackup.show();
    };
    BannerAdManager.prototype.removeBackup = function () {
        if (this._curBackup) {
            this._curBackup.dispose();
            this._curBackup = null;
        }
    };
    //wx banner广告
    BannerAdManager.prototype.showWxBanner = function () {
        this.removeZmBannerAd();
        if (this._curAd && this._curAd.adUnitId == this._curAdUnitId) {
            this._curAd.show();
        }
        else {
            this.creatNewAd();
        }
    };
    BannerAdManager.prototype.removeWxBanner = function () {
        if (this._curAd) {
            this._curAd.destroy();
            this._curAd = null;
        }
    };
    BannerAdManager.prototype.updateBanner = function () {
        if (this._curPageId != 0 && this._hasZmBannerData) {
            this.showZmBannerAd();
        }
        else {
            this.creatNewAd();
        }
    };
    BannerAdManager.prototype.creatNewAd = function () {
        this.removeWxBanner();
        this._curAd = new BannerAd(this._curAdUnitId);
        this._curAd.create(this._styleWidth, this._styleHeight, this._styleLeft, this._styleTop, this._fixedHeight, this._designStyle);
        this._curAd.show();
    };
    BannerAdManager.prototype.removeBanner = function () {
        Laya.timer.clear(this, this.updateBanner);
        this.removeWxBanner();
        this.removeZmBannerAd();
    };
    BannerAdManager.prototype.checkPhoneWxBannerEnable = function () {
        if (!Laya.Browser.window.wx) {
            return true;
        }
        var systemInfo = wx.getSystemInfoSync();
        console.log("system info", systemInfo);
        //不开启iphoneX广告情况下才检查iphoneX机型
        if (!this._iphoneXEnable && this.checkIphoneX(systemInfo)) {
            return false;
        }
        if (this.checkPhoneScreenOverWidth(systemInfo)) {
            return false;
        }
        return true;
    };
    //检查手机是否是iphone X系列
    BannerAdManager.prototype.checkIphoneX = function (systemInfo) {
        return systemInfo && systemInfo.model.indexOf("iPhone X") != -1;
    };
    //检查手机分辨率是否过大(360/640=0.5625) 
    //更新 iphone7 320/568=0.56338
    BannerAdManager.prototype.checkPhoneScreenOverWidth = function (systemInfo) {
        return systemInfo && (systemInfo.screenWidth / systemInfo.screenHeight > (0.57));
    };
    return BannerAdManager;
}());
var zm;
(function (zm) {
    var AdShowTime = /** @class */ (function () {
        function AdShowTime() {
            this.adInfoes = {};
            if (window['wx'] && wx.onShow && wx.onHide) {
                wx.onShow(this.onShow.bind(this));
                wx.onHide(this.onHide.bind(this));
            }
            this.lastStatTime = Date.now();
            this.eventQueue = [];
        }
        Object.defineProperty(AdShowTime, "instance", {
            get: function () {
                if (!this._instance) {
                    this._instance = new this;
                }
                return this._instance;
            },
            enumerable: true,
            configurable: true
        });
        AdShowTime.prototype.adShow = function (adPageId, advid, adid, order, effectType) {
            if (this.currentPageId != adPageId) {
                this.showPage(adPageId);
            }
            var ad = this.getOrCreateAd(adPageId, advid, adid, order, effectType);
            ad.start = Laya.Browser.now();
        };
        AdShowTime.prototype.adHide = function (adPageId, advid, adid, order, effectType, isShow) {
            var ad = this.getAd(adPageId, advid, adid);
            if (!ad) {
                return;
            }
            ad.duration += Laya.Browser.now() - (ad.start || this.onShowTime);
            ad.start = 0;
            this.pushEvent(ad);
            if (!isShow) {
                delete this.adInfoes[ad.adPageId][ad.advid][ad.adid];
            }
        };
        AdShowTime.prototype.pushEvent = function (e) {
            if (!e) {
                return;
            }
            this.eventQueue.push(e);
            Laya.timer.once(1, this, this.checkQueueLength, null, true);
        };
        AdShowTime.prototype.checkQueueLength = function () {
            var now = Date.now();
            if ((this.lastStatTime && now - this.lastStatTime > 10000) || this.eventQueue.length > 10) {
                this.stat();
            }
        };
        AdShowTime.prototype.showPage = function (adPageId) {
            if (this.currentPageId) {
                this.hidePage(this.currentPageId);
            }
            this.currentPageId = adPageId;
        };
        /**
         * 移除页面的时候发送事件，广告的show标志置为false
         * @param adPageId
         */
        AdShowTime.prototype.hidePage = function (adPageId) {
            if (this.currentPageId === adPageId) {
                this.stat();
                this.currentPageId = 0;
            }
        };
        AdShowTime.prototype.stat = function () {
            if (this.eventQueue.length > 0) {
                zm.statistics.sendAdShowTimeEvents(zm.gameID(), this.eventQueue);
                this.eventQueue = [];
                this.lastStatTime = Date.now();
            }
        };
        AdShowTime.prototype.getAd = function (adPageId, advid, adid) {
            var adPage = this.adInfoes[adPageId];
            if (!adPage) {
                return;
            }
            var adv = adPage[advid];
            if (!adv) {
                return;
            }
            return adv[adid];
        };
        AdShowTime.prototype.getOrCreateAd = function (adPageId, advid, adid, order, effectType) {
            var adPage = this.adInfoes[adPageId];
            if (!adPage) {
                adPage = {};
                this.adInfoes[adPageId] = adPage;
            }
            var adv = adPage[advid];
            if (!adv) {
                adv = {};
                adPage[advid] = adv;
            }
            var ad = adv[adid];
            if (!ad) {
                ad = {
                    adPageId: adPageId,
                    advid: advid,
                    adid: adid,
                    order: order + 1,
                    effectType: effectType,
                    duration: 0,
                    start: Laya.Browser.now(),
                };
                adv[adid] = ad;
            }
            return ad;
        };
        /**
         * 切后台后发送统计事件，但是广告的show标志仍然是true,但是清掉start时间
         */
        AdShowTime.prototype.onHide = function () {
            var _this = this;
            var ads;
            var ad;
            var advs = this.adInfoes[this.currentPageId];
            if (!advs) {
                return;
            }
            Object.keys(advs).forEach(function (k) {
                ads = advs[k];
                Object.keys(ads).forEach(function (ak) {
                    ad = ads[ak];
                    _this.adHide(_this.currentPageId, Number(k), Number(ak), ad.order, ad.effectType, true);
                });
            });
            this.stat();
        };
        AdShowTime.prototype.onShow = function () {
            this.onShowTime = Laya.Browser.now();
        };
        return AdShowTime;
    }());
    zm.AdShowTime = AdShowTime;
})(zm || (zm = {}));
/*
* 自定义广告管理类
* 调用广告方式：
* 1、事件调度。在页面打开和关闭时，CustomAdDispather抛出init和dispose事件，具体参数看代码
* 2、直接调用。setAdByPage 和 removeAdByPage 方法。
*/
/// <reference path="./data/CustomAdConfig.ts" />
/// <reference path="./data/CustomConst.ts" />
/// <reference path="./data/AdContainer.ts" />
/// <reference path="./data/CustomAdData.ts" />
/// <reference path="./AdLantern.ts" />
/// <reference path="./AdPendant.ts" />
/// <reference path="./AdMenu.ts" />
/// <reference path="./AdMenuNew.ts" />
/// <reference path="./IAdGuess.ts" />
/// <reference path="./AdTask.ts" />
/// <reference path="./AdBox.ts" />
/// <reference path="./AdFullScreen.ts" />
/// <reference path="./banner/BannerAdManager.ts" />
/// <reference path="./utils/AdShowTime.ts" />
/* *
    * TODO:
    * 1、整理广告显示隐藏逻辑
    * 2、curPageId 具体用法
 */
var CustomAdMgr = /** @class */ (function () {
    function CustomAdMgr() {
        this._adDataMgr = new CustomAdData();
        this._bannerMgr = new BannerAdManager();
        this._adShowFlag = true;
    }
    Object.defineProperty(CustomAdMgr, "curPageId", {
        get: function () {
            return CustomAdMgr._curPageId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomAdMgr.prototype, "platformID", {
        set: function (id) {
            CustomAdConfig.PlatformId = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomAdMgr.prototype, "uid", {
        set: function (v) {
            CustomAdConfig.UID = v;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置自定义广告是否启用
     * @param enable
     */
    CustomAdMgr.prototype.setAdEnable = function (enable) {
        if (enable === void 0) { enable = true; }
        CustomAdMgr.AdEnable = enable;
    };
    /**
     * 跳转配置的更多游戏
     * @param pageid 页面的id
     */
    CustomAdMgr.prototype.jumpMoreByPage = function (pageId) {
        var adContainers = this._adDataMgr.getCurPageAdContainerByType(pageId, AdContainType.More);
        if (adContainers && adContainers[0] && adContainers[0].contents) {
            var moreAdContainer = adContainers[0];
            //取第一个
            var ad = moreAdContainer.contents[0];
            if (ad) {
                AdClickHandler.openAd(ad, pageId, moreAdContainer.containerId);
                return;
            }
        }
        //都没配 默认跳 七号基地
        AdClickHandler.jumpApp("wx46c7a8da722329b5", pageId, 0, null);
    };
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
    CustomAdMgr.prototype.showAdPoster = function (pageId, posterProperty) {
        var adContainers = this._adDataMgr.getCurPageAdContainerByType(pageId, AdContainType.Box);
        if (adContainers && adContainers[0]) {
            var adContainerData = adContainers[0];
            AdBox.CustomData = posterProperty ? posterProperty : {};
            AdBox.instance.setUnit(pageId, adContainerData);
        }
        else {
            if (posterProperty && posterProperty.callback) {
                posterProperty.callback();
            }
        }
    };
    /**
     * 全屏广告
     * @param property 广告容器属性
     * {
     *   *callback:function      关闭回调，无参数
     *   ** 其他属性设置详见代码 AdFullScreen
     * }
     */
    CustomAdMgr.prototype.showAdFullScreen = function (pageId, property) {
        var hotContainers = this._adDataMgr.getCurPageAdContainerByType(pageId, AdContainType.FullScreen);
        var friendContainers = this._adDataMgr.getCurPageAdContainerByType(pageId, AdContainType.Guess);
        if (hotContainers && hotContainers[0] && friendContainers && friendContainers[0]) {
            AdFullScreen.CustomData = property ? property : {};
            if (AdFullScreen.instance.hasAdGuess) {
                AdFullScreen.instance.setUnit(pageId, hotContainers[0], friendContainers[0]);
            }
            else {
                var adFriend = this._adDataMgr.creatAdGuess(GuessType.Horizontal);
                var adHot = this._adDataMgr.creatAdGuess(GuessType.Vertical);
                AdFullScreen.instance.setUnit(pageId, hotContainers[0], friendContainers[0], adFriend, adHot);
            }
        }
        else {
            //全屏广告配置不正确时，直接回调
            if (property && property.callback) {
                property.callback();
            }
        }
    };
    /**
     * 在指定页面上添加广告
     * @param pageid 页面的id
     * @param pageInstance 页面
     */
    CustomAdMgr.prototype.addAd = function (pageid, pageInstance) {
        if (CustomAdMgr.AdEnable) {
            this.setAdByPage(pageid, pageInstance);
        }
    };
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
    CustomAdMgr.prototype.setAdCustomData = function (menuProperty, guessProperty, denpantProperty) {
        //确定是否使用新版本抽屉//写法很难受
        if (!menuProperty || !menuProperty.newVersion) {
            this._useMenuNew = false;
        }
        else {
            this._useMenuNew = true;
        }
        AdMenu.CustomData = menuProperty ? menuProperty : {};
        AdMenuNew.CustomData = menuProperty ? menuProperty : {};
        AdPendant.CustomData = denpantProperty ? denpantProperty : {};
        CustomAdData.GuessCustomeData = guessProperty ? guessProperty : {};
    };
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
    CustomAdMgr.prototype.initBanner = function (width, height, left, top, interval, fixedHeight, designStyle, customProperty, iphoneXEnable) {
        if (width === void 0) { width = 720; }
        if (height === void 0) { height = 200; }
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (interval === void 0) { interval = 60000; }
        if (fixedHeight === void 0) { fixedHeight = 0; }
        if (designStyle === void 0) { designStyle = new Laya.Point(720, 1440); }
        if (iphoneXEnable === void 0) { iphoneXEnable = false; }
        this._bannerMgr.initBanner(width, height, left, top, interval, fixedHeight, designStyle, customProperty, iphoneXEnable);
    };
    /**
     * 添加banner或者banner型猜你喜欢
     * @param adUnitId banner广告uid
     * @param pageid 页面的id —— 如果只要求显示banner，pageId传0，移除时调用hideBanner即可
     * @param pageInstance 页面容器<可以不用，已经废弃，现在banner强制贴在laya.stage最上层>
     * @param interval banner刷新间隔时间，可以根据页面具体配置，单位ms
     */
    CustomAdMgr.prototype.setPageBanner = function (adUnitId, pageId, pageInstance, interval) {
        if (adUnitId === void 0) { adUnitId = ""; }
        if (pageId === void 0) { pageId = 0; }
        if (pageInstance === void 0) { pageInstance = null; }
        if (interval === void 0) { interval = null; }
        if (CustomAdMgr.AdEnable) {
            this._bannerMgr.setPageBanner(adUnitId, pageId, pageInstance, interval);
        }
    };
    /**
     * 显示banner,需先setPageBanner
     */
    CustomAdMgr.prototype.showBanner = function () {
        if (CustomAdMgr.AdEnable) {
            this._bannerMgr.showBanner();
        }
    };
    /**
     * 隐藏banner,需先setPageBanner
     */
    CustomAdMgr.prototype.hideBanner = function () {
        if (CustomAdMgr.AdEnable) {
            this._bannerMgr.hideBanner();
        }
    };
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
    CustomAdMgr.prototype.showTaskAd = function (pageId, container, taskProperty) {
        var adContainers = this._adDataMgr.getCurPageAdContainerByType(pageId, AdContainType.PlayGame);
        if (adContainers && adContainers[0]) {
            var adContainerData = adContainers[0];
            AdTask.CustomData = taskProperty ? taskProperty : {};
            AdTask.instance.setUnit(pageId, adContainerData, container);
        }
    };
    CustomAdMgr.prototype.removeTaskAd = function (pageId) {
        AdTask.instance.clear();
    };
    /**
      * 移除页面的自定义广告
      * @param pageid 页面的ID
      */
    CustomAdMgr.prototype.removeAd = function (pageid) {
        this._adShowFlag = false;
        this._adDataMgr.removeAllAdLanternByPage(pageid);
        this._adDataMgr.removeAllAdMenuByPage(pageid);
        this._adDataMgr.removeAllAdMenuNewByPage(pageid);
        this._adDataMgr.removeAllAdGuessByPage(pageid);
        this._adDataMgr.removeAdPendantByPage(pageid);
        zm.AdShowTime.instance.hidePage(pageid);
    };
    /**
     * 移除最近添加的广告页
     */
    CustomAdMgr.prototype.removeLatestAdPage = function () {
        if (CustomAdMgr.curPageId != undefined) {
            this.removeAd(CustomAdMgr.curPageId);
        }
    };
    /**
     * 加载每页的自定义广告
     * @param pageid 页面名字。跟游戏自定义页面映射对应
     * @param pageInstance 页面实例，作为广告容器
     */
    CustomAdMgr.prototype.setAdByPage = function (pageid, pageInstance) {
        this._adShowFlag = true;
        CustomAdMgr._curPageId = pageid;
        var pageConfig = this._adDataMgr.getPageConfig(pageid);
        if (pageConfig) {
            this.showCurPageAd(pageid, pageInstance, pageConfig);
        }
        else {
            this.loadConfigByPage(pageid, pageInstance);
        }
        zm.AdShowTime.instance.showPage(pageid);
    };
    CustomAdMgr.prototype.loadConfigByPage = function (pageid, pageInstance) {
        if (!CustomAdConfig.PlatformId) {
            return;
        }
        var cfgUrl = CustomAdConfig.CustomAdHost + "/api/v1.1/adv";
        // var cfgUrl = "https://test-ad.xiaoyouxi.rzcdz2.com" + "/api/v1.1/adv";
        var param = {
            platform_id: CustomAdConfig.PlatformId,
            pages_id: pageid
        };
        zm.http.GET(cfgUrl, param, Laya.Handler.create(this, this.onLoadSuc, [pageid, pageInstance]), Laya.Handler.create(this, this.onLoadFail, [pageid]));
    };
    CustomAdMgr.prototype.onLoadSuc = function (pageid, pageInstance, res) {
        console.log("page ad loaded", pageid);
        if (res && !res.code && res.data && res.data.list) {
            this._adDataMgr.parseServerData(pageid, res.data);
            var pageConfig = this._adDataMgr.getPageConfig(pageid);
            this.showCurPageAd(pageid, pageInstance, pageConfig);
        }
    };
    CustomAdMgr.prototype.onLoadFail = function (pageid) {
        console.log("load customad fail: ", pageid);
    };
    CustomAdMgr.prototype.showCurPageAd = function (pageid, pageInstance, configs) {
        if (!configs) {
            return;
        }
        this._adTypes = [];
        //开始显示
        AdPendant.clearPageData();
        for (var i = 0; i < configs.length; i++) {
            if (configs[i] && configs[i].contents.length > 0) {
                this._adTypes.push(configs[i].containerType);
                //为了获取吊坠广告数量
                if (configs[i].containerType == AdContainType.Pendant) {
                    AdPendant.PendantNum++;
                }
            }
            this.creatAd(pageid, pageInstance, configs[i]);
        }
        //通知完成
        zm.eventCenter.event(zm.events.EventCustomAdLoaded, { pageId: pageid, adTypes: this._adTypes });
        //显示banner
        //加载完广告配置之后统一显示banner，防止加载wxBanner后立马刷新出 猜你喜欢广告
        //加载完配置还要检查当前页面是否是加载页面(切换了页面就不显示)
        if (pageid == CustomAdMgr._curPageId) {
            this._bannerMgr.showBannerAfterLoaded(pageid);
        }
    };
    CustomAdMgr.prototype.creatAd = function (pageid, pageInstance, adContainerData) {
        if (!adContainerData || adContainerData.contents.length == 0) {
            return;
        }
        switch (adContainerData.containerType) {
            case AdContainType.Single:
                this.showLantern(pageid, adContainerData, pageInstance);
                break;
            case AdContainType.Menu:
                this.showMenu(pageid, adContainerData, pageInstance);
                break;
            case AdContainType.Guess:
                this.showGuess(pageid, adContainerData, pageInstance);
                break;
            case AdContainType.PlayGame:
                // 单独实现
                break;
            case AdContainType.More:
                // 单独实现
                break;
            case AdContainType.BannerGuess:
                this._bannerMgr.updateGuess(adContainerData);
                break;
            case AdContainType.Box:
                // 加载资源
                AdBox.instance.preload(adContainerData);
                break;
            case AdContainType.Backup:
                this._bannerMgr.updateBackup(adContainerData);
                break;
            case AdContainType.Pendant:
                this.showPendant(pageid, adContainerData, pageInstance);
                break;
            case AdContainType.FullScreen:
                AdFullScreen.instance.preload(adContainerData);
                break;
            case AdContainType.CustomizedBanner:
                this._bannerMgr.updateCustomBanner(adContainerData);
                break;
        }
    };
    CustomAdMgr.prototype.showLantern = function (pageId, adContainer, parentCon) {
        // if(pageId != CustomAdMgr._curPageId || !this._adShowFlag){
        if (!this._adShowFlag) {
            return;
        }
        var unit = this._adDataMgr.creatAdLantern();
        unit.setUnit(pageId, adContainer, parentCon);
    };
    CustomAdMgr.prototype.showMenu = function (pageId, adContainer, parentCon) {
        if (pageId != CustomAdMgr._curPageId || !this._adShowFlag) {
            return;
        }
        if (this._useMenuNew) {
            var menu = this._adDataMgr.creatAdMenuNew();
            menu.setUnit(pageId, adContainer, parentCon);
        }
        else {
            var menu = this._adDataMgr.creatAdMenu();
            menu.setUnit(pageId, adContainer, parentCon);
        }
    };
    CustomAdMgr.prototype.showGuess = function (pageId, adContainer, parentCon) {
        if (pageId != CustomAdMgr._curPageId || !this._adShowFlag) {
            return;
        }
        var type = CustomAdData.GuessCustomeData.guessType == undefined ? GuessType.Horizontal : CustomAdData.GuessCustomeData.guessType;
        var guess = this._adDataMgr.creatAdGuess(type);
        guess.setUnit(pageId, adContainer, parentCon, CustomAdData.GuessCustomeData);
    };
    CustomAdMgr.prototype.showPendant = function (pageId, adContainer, parentCon) {
        if (pageId != CustomAdMgr._curPageId || !this._adShowFlag) {
            return;
        }
        var pendant = this._adDataMgr.creatAdPendant();
        pendant.setUnit(pageId, adContainer, parentCon);
    };
    CustomAdMgr.AdEnable = true;
    return CustomAdMgr;
}());
var zm;
(function (zm) {
    var RemoteConfig = /** @class */ (function () {
        function RemoteConfig() {
        }
        Object.defineProperty(RemoteConfig.prototype, "URL", {
            set: function (url) {
                if (this.configURL == url) {
                    return;
                }
                this.configURL = url;
                this.fetch();
                zm.eventCenter.on(zm.events.EventLogin, this, this.onLogin);
            },
            enumerable: true,
            configurable: true
        });
        RemoteConfig.prototype.onLogin = function () {
            if (this.failure) {
                this.fetch();
            }
        };
        RemoteConfig.prototype.fetch = function () {
            var now = Math.floor(Date.now() / RemoteConfig.UpdateInterval) * RemoteConfig.UpdateInterval;
            zm.http.GET(this.configURL, { t: now }, Laya.Handler.create(this, this.onFetchSuccess), Laya.Handler.create(this, this.onFetchFail), RemoteConfig.MaxRetryCnt);
        };
        RemoteConfig.prototype.onFetchSuccess = function (data) {
            this.config = data;
            this.failure = false;
            zm.eventCenter.event(zm.events.EventRemoteCfgLoaded, data);
        };
        RemoteConfig.prototype.onFetchFail = function () {
            this.config = {};
            this.failure = true;
        };
        RemoteConfig.prototype.getItem = function (key) {
            if (this.config) {
                return this.config[key];
            }
        };
        RemoteConfig.UpdateInterval = 30000;
        RemoteConfig.MaxRetryCnt = 3;
        return RemoteConfig;
    }());
    zm.RemoteConfig = RemoteConfig;
})(zm || (zm = {}));
/// <reference path="../http/http.ts" />
var zm;
/// <reference path="../http/http.ts" />
(function (zm) {
    var ShareConfig = /** @class */ (function () {
        function ShareConfig() {
            this.sharePointContents = {};
        }
        ShareConfig.prototype.init = function (gameID, uid) {
            this.uid = uid;
            this.gameID = gameID;
            this.retryCnt = 0;
            this.fetchShareCfg();
        };
        Object.defineProperty(ShareConfig.prototype, "UID", {
            set: function (uid) {
                this.uid = uid;
            },
            enumerable: true,
            configurable: true
        });
        ShareConfig.prototype.shareStatus = function (shareTag) {
            var sharePointContent = this.sharePointContents[shareTag];
            if (sharePointContent && sharePointContent.status == 2 /* Disable */) {
                return 2 /* Disable */;
            }
            return 1 /* Enable */;
        };
        ShareConfig.prototype.getSharePointCfg = function (shareTag, title, image, query) {
            var shareid;
            var sharepid;
            var sharePointContent = this.sharePointContents[shareTag];
            if (sharePointContent) {
                sharepid = sharePointContent.share_id;
                if (!title &&
                    !image &&
                    sharePointContent.status == 1 /* Enable */ &&
                    sharePointContent.share_contents &&
                    sharePointContent.share_contents.length > 0) {
                    var weight = Math.random() * sharePointContent.count_weight;
                    var length_1 = sharePointContent.share_contents.length;
                    var content = void 0;
                    for (var i = 0; i < length_1; i++) {
                        content = sharePointContent.share_contents[i];
                        weight -= content.share_weight;
                        if (weight <= 0) {
                            // let shareContent = sharePointContent.share_contents[Math.floor(Math.random() * sharePointContent.share_contents.length)]
                            title = title || content.share_content;
                            image = image || content.share_img;
                            shareid = content.share_content_id;
                            break;
                        }
                    }
                }
            }
            sharepid || (sharepid = ShareConfig.DefaultSharePointID);
            shareid || (shareid = ShareConfig.DefaultShareID);
            title || (title = this.defaultTitle);
            image || (image = this.defaultImg);
            query || (query = {});
            query.sharepid = sharepid;
            query.shareid = shareid;
            this.uid && (query.shareuid = this.uid);
            var shareCfg = {
                title: title,
                imageUrl: image,
                query: query,
                sharepid: sharepid,
                shareid: shareid
            };
            return shareCfg;
        };
        ShareConfig.prototype.defaultShareConfig = function (title, img) {
            this.defaultTitle = title;
            this.defaultImg = img;
        };
        ShareConfig.prototype.getDefaultConfig = function (shareTag, title, image, query) {
            var sharePointContent = this.sharePointContents[shareTag];
            var sharepid = ShareConfig.DefaultSharePointID;
            sharePointContent && (sharepid = sharePointContent.share_id);
            var shareid = ShareConfig.DefaultShareID;
            query || (query = {});
            query.sharepid = sharepid;
            query.shareid = shareid;
            title = title || this.defaultTitle;
            image = image || this.defaultImg;
            return {
                title: title,
                imageUrl: image,
                query: query,
                shareid: shareid,
                sharepid: sharepid
            };
        };
        ShareConfig.prototype.fetchShareCfg = function () {
            zm.http.GET(ShareConfig.ShareCfgHost + ShareConfig.ShareCfgUrl, { platform_id: this.gameID }, Laya.Handler.create(this, this.onFetchSuccess), Laya.Handler.create(this, this.onFetchFail));
        };
        ShareConfig.prototype.onFetchSuccess = function (data) {
            if (data.code == 0) {
                this.sharePointContents = {};
                if (data.data && data.data.list) {
                    for (var _i = 0, _a = data.data.list; _i < _a.length; _i++) {
                        var content = _a[_i];
                        this.sharePointContents[content.share_tag] = content;
                    }
                }
            }
            else {
                console.log("fetch share config result error. code:" + data.code);
            }
        };
        ShareConfig.prototype.onFetchFail = function () {
            if (this.retryCnt > 3) {
                return;
            }
            console.log('retry to fetch share config!');
            var delay = Math.pow(2, this.retryCnt);
            Laya.timer.once(delay, this, this.retryFetchConfig);
        };
        ShareConfig.prototype.retryFetchConfig = function () {
            this.retryCnt++;
            this.fetchShareCfg();
        };
        ShareConfig.ShareCfgHost = "https://adplatform.rzcdz2.com";
        ShareConfig.ShareCfgUrl = "/api/v1.1/share";
        ShareConfig.DefaultShareID = -1;
        ShareConfig.DefaultSharePointID = -1;
        return ShareConfig;
    }());
    zm.ShareConfig = ShareConfig;
})(zm || (zm = {}));
/// <reference path="../http/http.ts" />
var zm;
/// <reference path="../http/http.ts" />
(function (zm) {
    var Statistics = /** @class */ (function () {
        function Statistics() {
            this.Server = "https://zm.rzcdz2.com/stat";
            this.isInit = false;
            this.info = {};
        }
        Statistics.prototype.init = function (appId, appVersion) {
            this.info.ak = appId;
            this.info.v = appVersion;
            if (!this.initDeviceInfo()) {
                return false;
            }
            this.setUpOnErrorHandler();
            this.isInit = true;
        };
        Statistics.prototype.send = function (ev, ct) {
            var info = {};
            // 复制公共参数
            for (var k in this.info)
                info[k] = this.info[k];
            info.ev = ev;
            info.ct = ct;
            info.ts = Date.now();
            info.rnd = Math.floor(1e7 * Math.random());
            this.upload(info);
        };
        return Statistics;
    }());
    zm.Statistics = Statistics;
})(zm || (zm = {}));
/// <reference path="./share/ShareHelper.ts" />
/// <reference path="./device/DeviceHelper.ts" />
/// <reference path="./system/SystemHelper.ts" />
/// <reference path="./YokaStat/YokaStat.ts" />
/// <reference path="./share/YokaShare.ts" />
/// <reference path="./ad/CustomAdMgr.ts" />
/// <reference path="./utils.ts" />
/// <reference path="./config/RemoteConfig.ts" />
/// <reference path="./share/ShareConfig.ts" />
/// <reference path="./statistics/Statistics.ts" />
var zm;
/// <reference path="./share/ShareHelper.ts" />
/// <reference path="./device/DeviceHelper.ts" />
/// <reference path="./system/SystemHelper.ts" />
/// <reference path="./YokaStat/YokaStat.ts" />
/// <reference path="./share/YokaShare.ts" />
/// <reference path="./ad/CustomAdMgr.ts" />
/// <reference path="./utils.ts" />
/// <reference path="./config/RemoteConfig.ts" />
/// <reference path="./share/ShareConfig.ts" />
/// <reference path="./statistics/Statistics.ts" />
(function (zm) {
    //如果要发送统计数据，设为true
    zm.shouldSendStat = false;
    zm.Stat_Offset = 1000;
    var gameid;
    var gamename;
    var gameversion;
    var openid;
    var uid;
    var adplatformHost;
    //removeIf(!release)
    adplatformHost = "https://adplatform.rzcdz2.com";
    //endRemoveIf(!release)
    function gameID() {
        return gameid;
    }
    zm.gameID = gameID;
    function gameName() {
        return gamename;
    }
    zm.gameName = gameName;
    function version() {
        return gameversion;
    }
    zm.version = version;
    function openID() {
        return openid;
    }
    zm.openID = openID;
    function userID() {
        return uid;
    }
    zm.userID = userID;
    function init(appid, gameID, gameName, version) {
        if (!gameID || !gameName) {
            console.log('gameID or gameName is null!');
            return;
        }
        zm.appId = appid;
        CustomAdConfig.CustomAdHost = adplatformHost;
        zm.ShareConfig.ShareCfgHost = adplatformHost;
        zm.eventCenter = new Laya.EventDispatcher;
        gameid = gameID;
        gamename = gameName.toString();
        gameversion = version.toString();
        zm.remoteConfig = new zm.RemoteConfig;
        zm.shareConfig = new zm.ShareConfig;
        zm.ad = new CustomAdMgr;
        zm.ad.platformID = gameid;
        //removeIf(!web)
        zm.initWeb(zm.shareConfig);
        //endRemoveIf(!web)
        registerEvents();
        zm.share.init(gameid);
        zm.statistics.init(null, null, zm.utils.adaptStatID(zm.gameID(), zm.Stat_Offset), zm.gameName(), zm.version());
        sendAdEvent('内部跳转进来');
    }
    zm.init = init;
    function sendAdEvent(name) {
        if (Laya.Browser.window.wx && wx.aldSendEvent) {
            var options = wx.getLaunchOptionsSync();
            if (options && options.referrerInfo) {
                var referrerInfo = options.referrerInfo;
                if (referrerInfo.appId && referrerInfo.extraData && (referrerInfo.extraData['advid'] || referrerInfo.extraData['adid'])) {
                    wx.aldSendEvent(name, {
                        'appid': referrerInfo.appId,
                        '广告位': referrerInfo.extraData['advid'],
                        '广告': referrerInfo.extraData['adid']
                    });
                }
            }
        }
    }
    function onLogin(rep) {
        if (!rep) {
            return;
        }
        zm.eventCenter.off(zm.events.EventLogin, zm, onLogin);
        openid = rep.OpenID;
        uid = rep.UID;
        zm.opendata.onLogin(openid);
        zm.statistics.initUserInfo(openid, uid);
        zm.ad.uid = uid;
        zm.share.UID = uid;
        if (rep.First) {
            sendAdEvent('内部跳转进来-新用户');
        }
        else {
            sendAdEvent('内部跳转进来-老用户');
        }
        if (zm.system.runtimePlatform == 0 /* MiniGame */ &&
            zm.system.compareSDKVersion('2.4.0') >= 0 &&
            rep.ActivityID) {
            wx.updateShareMenu({
                withShareTicket: true,
                isUpdatableMessage: true,
                activityId: rep.ActivityID,
                templateInfo: [{
                        name: 'member_count',
                        value: '6533532'
                    }, {
                        name: 'room_limit',
                        value: '10000000'
                    }]
            });
        }
    }
    zm.onLogin = onLogin;
    function registerEvents() {
        zm.eventCenter.on(zm.events.EventLogin, zm, onLogin);
    }
})(zm || (zm = {}));
window.zm = zm;
/// <reference path="./YokaStat.ts" />
var zm;
/// <reference path="./YokaStat.ts" />
(function (zm) {
    var WebYokaStat = /** @class */ (function (_super) {
        __extends(WebYokaStat, _super);
        function WebYokaStat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebYokaStat.prototype.initParams = function () {
        };
        WebYokaStat.prototype.netType = function () {
            return 'wifi';
        };
        return WebYokaStat;
    }(zm.YokaStat));
    zm.WebYokaStat = WebYokaStat;
})(zm || (zm = {}));
var zm;
(function (zm) {
    var events;
    (function (events) {
        events.EventLogin = 'EventLogin';
        events.EventNetTypeChanged = 'EventNetTypeChanged ';
        events.EventAppShow = "EventAppShow";
        events.EventAppHide = "EventAppHide";
        events.EventRemoteCfgLoaded = "EventRemoteCfgLoaded";
        //广告系统
        events.EventCustomAdLoaded = "EventCustomAdLoaded";
        events.EventJumpAppSuccess = "EventJumpAppSuccess";
        events.EventJumpAppFail = "EventJumpAppFail";
    })(events = zm.events || (zm.events = {}));
})(zm || (zm = {}));
/// <reference path="../http/http.ts" />
/// <reference path="../events/events.ts" />
var zm;
/// <reference path="../http/http.ts" />
/// <reference path="../events/events.ts" />
(function (zm) {
    var LoginHandler = /** @class */ (function () {
        function LoginHandler() {
            this.sessionTime = 0;
            this.validityTime = 0;
            this.retryCnt = 0;
            this.MaxRetry = 3;
            this._status = 0 /* Unlogined */;
        }
        Object.defineProperty(LoginHandler.prototype, "loginUrl", {
            set: function (url) {
                if (!url || this._loginUrl === url) {
                    return;
                }
                zm.eventCenter.on(zm.events.EventNetTypeChanged, this, this.onNetTypeChanged);
                this._loginUrl = url;
                this.login();
            },
            enumerable: true,
            configurable: true
        });
        LoginHandler.prototype.relogin = function () {
            if (this._status === 1 /* Logining */) {
                return;
            }
            this.login();
        };
        LoginHandler.prototype.login = function () {
            this._status = 1 /* Logining */;
            if (!this._loginUrl) {
                console.debug('loginUrl is null!');
                return;
            }
            this.doLogin();
        };
        LoginHandler.prototype.loginServer = function (res) {
            console.log(' platform login success: ' + JSON.stringify(res));
            if (!this._loginUrl) {
                console.debug('loginUrl is null!');
                return;
            }
            zm.http.POST(this._loginUrl, res, Laya.Handler.create(this, this.onLoginServer), Laya.Handler.create(this, this.loginFail));
        };
        LoginHandler.prototype.onLoginServer = function (res) {
            if (res && res.Status === 0) {
                this.openid = res.OpenID;
                this.sessionId = res.Session.ID;
                this.validityTime = parseInt(res.Session.Expire) * 1000;
                this.sessionTime = this.validityTime + Date.now();
                this.loginSuccess(res);
            }
            else {
                this.loginFail();
            }
        };
        LoginHandler.prototype.thirdLoginFail = function () {
            if (this.retryCnt < this.MaxRetry) {
                Laya.timer.once(2000, this, this.failThenLogin);
            }
            else {
                this.loginFail();
            }
        };
        LoginHandler.prototype.loginFail = function () {
            this._status = 3 /* Failed */;
            zm.eventCenter.event(zm.events.EventLogin);
        };
        LoginHandler.prototype.failThenLogin = function () {
            this.retryCnt++;
            this.login();
        };
        LoginHandler.prototype.loginSuccess = function (res) {
            this.retryCnt = 0;
            this._status = 2 /* Logined */;
            zm.eventCenter.event(zm.events.EventLogin, res);
        };
        LoginHandler.prototype.onNetTypeChanged = function (type) {
            if (this.loginStatus == 3 /* Failed */ && type != 0 /* None */) {
                this.login();
            }
        };
        Object.defineProperty(LoginHandler.prototype, "loginStatus", {
            get: function () {
                if (this._status === 2 /* Logined */ && this.sessionTime <= Date.now()) {
                    this._status = 0 /* Unlogined */;
                }
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginHandler.prototype, "openID", {
            get: function () {
                return this.openid;
            },
            enumerable: true,
            configurable: true
        });
        LoginHandler.prototype.updateSessionTime = function () {
            this.sessionTime = this.validityTime + Date.now();
        };
        Object.defineProperty(LoginHandler.prototype, "sessionEndTime", {
            get: function () {
                return this.sessionTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginHandler.prototype, "session", {
            get: function () {
                var now = Date.now();
                if (now > this.sessionTime) {
                    this.sessionId = null;
                }
                return this.sessionId;
            },
            enumerable: true,
            configurable: true
        });
        return LoginHandler;
    }());
    zm.LoginHandler = LoginHandler;
})(zm || (zm = {}));
var zm;
(function (zm) {
    var WebDevicer;
    (function (WebDevicer) {
        function vibrateShort(success, fail) {
            if (getVibrateAllow() == false) {
                return;
            }
            navigator.vibrate = navigator.vibrate
                || Laya.Browser.window.navigator.webkitVibrate
                || Laya.Browser.window.navigator.mozVibrate
                || Laya.Browser.window.navigator.msVibrate;
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        }
        WebDevicer.vibrateShort = vibrateShort;
        function vibrateLong(success, fail) {
            if (getVibrateAllow() == false) {
                return;
            }
            navigator.vibrate = navigator.vibrate
                || Laya.Browser.window.navigator.webkitVibrate
                || Laya.Browser.window.navigator.mozVibrate
                || Laya.Browser.window.navigator.msVibrate;
            if (navigator.vibrate) {
                navigator.vibrate(400);
            }
        }
        WebDevicer.vibrateLong = vibrateLong;
        function setVibrateAllow(allow) {
            var saveStr = allow ? "on" : "off";
            Laya.LocalStorage.setItem("Local_Vibrate_Key", saveStr);
        }
        WebDevicer.setVibrateAllow = setVibrateAllow;
        function getVibrateAllow() {
            var saveStr = Laya.LocalStorage.getItem("Local_Vibrate_Key");
            return (saveStr && saveStr == "off") ? false : true;
        }
        WebDevicer.getVibrateAllow = getVibrateAllow;
    })(WebDevicer = zm.WebDevicer || (zm.WebDevicer = {}));
})(zm || (zm = {}));
var zm;
(function (zm) {
    var remote;
    (function (remote) {
        remote.GameVersion = 'game_version';
        remote.ShareEnable = 'share_enable';
        remote.GameTrigger = 'game_trigger';
    })(remote = zm.remote || (zm.remote = {}));
})(zm || (zm = {}));
/// <reference path="../config/RemoteKey.ts" />
var zm;
/// <reference path="../config/RemoteKey.ts" />
(function (zm) {
    var WebShare;
    (function (WebShare) {
        /**
         * 主动拉起转发，进入选择通讯录界面。
         * @param title
         * @param imageUrl
         * @param query  格式 key1=val1&key2=val2
         */
        function shareAppMessage(title, imageUrl, query, success, fail) {
            console.log(arguments);
            if (success) {
                success.runWith(['111111111111111111']);
            }
        }
        WebShare.shareAppMessage = shareAppMessage;
        function shareScreenShot(container, rect, title, query, success, fail) {
            console.log(arguments);
            if (success) {
                success.runWith(['111111111111111111']);
            }
        }
        WebShare.shareScreenShot = shareScreenShot;
        //诱导分享是否打开
        function rewardShareEnable() {
            var releaseVersion = zm.remoteConfig.getItem(zm.remote.GameVersion);
            if (releaseVersion && zm.utils.compareVersion(zm.version(), releaseVersion) < 1) {
                var shareEnable = zm.remoteConfig.getItem(zm.remote.ShareEnable);
                if (shareEnable) {
                    return true;
                }
            }
            return false;
        }
        WebShare.rewardShareEnable = rewardShareEnable;
        function zmGameTriggerState(triggerKey) {
            var triggerConfig = zm.remoteConfig.getItem(zm.remote.GameTrigger);
            if (triggerConfig == null || triggerConfig == undefined) {
                return false;
            }
            var trigger = triggerConfig[triggerKey];
            if (trigger == null || trigger == undefined) {
                return false;
            }
            return trigger;
        }
        WebShare.zmGameTriggerState = zmGameTriggerState;
    })(WebShare = zm.WebShare || (zm.WebShare = {}));
})(zm || (zm = {}));
/// <reference path="./SystemHelper.ts" />
var zm;
/// <reference path="./SystemHelper.ts" />
(function (zm) {
    var WebSystemHelper = /** @class */ (function () {
        function WebSystemHelper() {
            this.runtimePlatform = 1 /* Web */;
        }
        WebSystemHelper.prototype.getLaunchOptions = function () {
            return {};
        };
        WebSystemHelper.prototype.onShareAppMessage = function (tag) {
        };
        WebSystemHelper.prototype.compareSDKVersion = function (version) {
            return 0;
        };
        WebSystemHelper.prototype.exit = function () {
            window.close();
        };
        return WebSystemHelper;
    }());
    zm.WebSystemHelper = WebSystemHelper;
})(zm || (zm = {}));
/// <reference path="./OpenCommon.ts" />
/// <reference path="./OpenUtils.ts" />
var zm;
/// <reference path="./OpenCommon.ts" />
/// <reference path="./OpenUtils.ts" />
(function (zm) {
    var WebOpenUtils = /** @class */ (function () {
        function WebOpenUtils() {
        }
        WebOpenUtils.prototype.onLogin = function (openid) {
            console.log('openutils on login' + openid);
        };
        WebOpenUtils.prototype.postMessage = function (cmd, data) {
            console.log(cmd, data);
        };
        WebOpenUtils.prototype.refreshSharedSprite = function (width, height) {
            this.openSprite = new Laya.Sprite;
            return this.openSprite;
        };
        WebOpenUtils.prototype.destroySharedSprite = function () {
            if (this.openSprite) {
                this.openSprite.destroy();
                this.openSprite = null;
            }
        };
        return WebOpenUtils;
    }());
    zm.WebOpenUtils = WebOpenUtils;
})(zm || (zm = {}));
var zm;
(function (zm) {
    var http;
    (function (http) {
        function webRequest(method, url, params, success, fail, header) {
            var request = new Laya.HttpRequest();
            request.once(Laya.Event.COMPLETE, null, function (e) {
                if (success) {
                    success.runWith(e);
                }
            });
            request.once(Laya.Event.ERROR, null, function (e) {
                if (fail) {
                    fail.runWith(e);
                }
            });
            var headerArray = [];
            headerArray.push('Content-Type');
            headerArray.push('application/json');
            if (header) {
                for (var key in header) {
                    headerArray.push(key);
                    headerArray.push(header[key]);
                }
            }
            request.send(url, params, method, 'json', headerArray);
        }
        http.webRequest = webRequest;
    })(http = zm.http || (zm.http = {}));
})(zm || (zm = {}));
/// <reference path="../opendata/OpenCommon.ts" />
var zm;
/// <reference path="../opendata/OpenCommon.ts" />
(function (zm) {
    var SubmitAction = /** @class */ (function () {
        function SubmitAction() {
        }
        Object.defineProperty(SubmitAction.prototype, "isSubmitting", {
            get: function () {
                return this._isSubmitting;
            },
            enumerable: true,
            configurable: true
        });
        SubmitAction.prototype.reset = function (key, score, startMs, endMs, order) {
            this.retryCnt = 0;
            this.score = score;
            this.key = key;
            this.startMs = startMs;
            this.endMs = endMs;
            this.order = order;
            this.data = null;
        };
        SubmitAction.prototype.resubmit = function () {
            this.retryCnt++;
            this.submit();
        };
        SubmitAction.prototype.submitSuccess = function () {
            if (this.toResubmit) {
                this.submit();
            }
            else {
                if (this.complete) {
                    this.complete.runWith(this.key);
                }
            }
        };
        SubmitAction.prototype.submitFail = function () {
            if (this.retryCnt > SubmitAction.MaxRetryCnt) {
                console.debug('submit score faile!', this.data);
                if (this.complete) {
                    this.complete.runWith(this.key);
                }
                return;
            }
            var t = Math.pow(2, this.retryCnt) * 1000;
            Laya.timer.once(t, this, this.resubmit);
        };
        SubmitAction.prototype.submit = function (complete) {
            complete && (this.complete = complete);
            this.toResubmit = false;
            this._isSubmitting = true;
            this.doSubmit();
        };
        SubmitAction.prototype.doSubmit = function () {
        };
        SubmitAction.MaxRetryCnt = 3;
        return SubmitAction;
    }());
    zm.SubmitAction = SubmitAction;
})(zm || (zm = {}));
/// <reference path="./SubmitAction.ts" />
var zm;
/// <reference path="./SubmitAction.ts" />
(function (zm) {
    var WebSubmitAction = /** @class */ (function (_super) {
        __extends(WebSubmitAction, _super);
        function WebSubmitAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WebSubmitAction;
    }(zm.SubmitAction));
    zm.WebSubmitAction = WebSubmitAction;
})(zm || (zm = {}));
var zm;
(function (zm) {
    var SubmitActionManager = /** @class */ (function () {
        function SubmitActionManager(action) {
            this.actions = {};
            this.queue = [];
            this.submitAction = action;
        }
        SubmitActionManager.prototype.addAction = function (key, action) {
            if (this.actions[key]) {
                console.debug("action " + key + " is submitting");
                return;
            }
            this.actions[key] = action;
        };
        SubmitActionManager.prototype.removeAction = function (key) {
            if (this.actions[key]) {
                this.queue.push(this.actions[key]);
                this.actions[key] = null;
            }
        };
        SubmitActionManager.prototype.getAction = function () {
            if (this.queue.length > 0) {
                return this.queue.pop();
            }
            else {
                return new this.submitAction;
            }
        };
        SubmitActionManager.prototype.onSubmitComplete = function (key) {
            this.removeAction(key);
        };
        SubmitActionManager.prototype.submit = function (key, score, startMs, endMs, order) {
            var action = this.actions[key];
            if (!action) {
                action = this.getAction();
                this.addAction(key, action);
            }
            action.reset(key, score, startMs, endMs, order);
            if (action.isSubmitting) {
                action.toResubmit = true;
            }
            else {
                action.submit(Laya.Handler.create(this, this.onSubmitComplete));
            }
        };
        return SubmitActionManager;
    }());
    zm.SubmitActionManager = SubmitActionManager;
})(zm || (zm = {}));
/// <reference path="./LoginHandler.ts" />
var zm;
/// <reference path="./LoginHandler.ts" />
(function (zm) {
    var WebLoginHandler = /** @class */ (function (_super) {
        __extends(WebLoginHandler, _super);
        function WebLoginHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebLoginHandler.prototype.doLogin = function () {
            this.loginFail();
        };
        return WebLoginHandler;
    }(zm.LoginHandler));
    zm.WebLoginHandler = WebLoginHandler;
})(zm || (zm = {}));
/*
* Base64 加解密
*/
var Base64 = /** @class */ (function () {
    function Base64() {
    }
    /** 加密 */
    Base64.encode = function (msg) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        msg = Base64._utf8_encode(msg);
        while (i < msg.length) {
            chr1 = msg.charCodeAt(i++);
            chr2 = msg.charCodeAt(i++);
            chr3 = msg.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
        }
        return output;
    };
    /** 解密 */
    Base64.decode = function (base64Str) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        base64Str = base64Str.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < base64Str.length) {
            enc1 = Base64._keyStr.indexOf(base64Str.charAt(i++));
            enc2 = Base64._keyStr.indexOf(base64Str.charAt(i++));
            enc3 = Base64._keyStr.indexOf(base64Str.charAt(i++));
            enc4 = Base64._keyStr.indexOf(base64Str.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    };
    /** 判断是否是Base64 */
    Base64.isBase64 = function (str) {
        if (str == null || str.length == 0) {
            return false;
        }
        else {
            if (str.length % 4 != 0) {
                return false;
            }
            for (var i = 0; i < str.length; i++) {
                var c = str[i];
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
                    || c == '+' || c == '/' || c == '=') {
                    continue;
                }
                else {
                    return false;
                }
            }
            return true;
        }
    };
    Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    Base64._utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    Base64._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
    return Base64;
}());
/// <reference path="../http/http.ts" />
/// <reference path="../events/events.ts" />
/// <reference path="../tools/Base64.ts" />
var zm;
/// <reference path="../http/http.ts" />
/// <reference path="../events/events.ts" />
/// <reference path="../tools/Base64.ts" />
(function (zm) {
    var API = /** @class */ (function () {
        function API() {
            this.sessionValidity = 0;
            this.sessionExpire = 0;
            this.status = 1 /* Offline */;
            this.retryCnt = 0;
            this.MaxRetry = 2;
        }
        API.prototype.init = function (apiBase) {
            this.apiBase = apiBase;
            zm.eventCenter.on(zm.events.EventNetTypeChanged, this, this.onNetTypeChanged);
        };
        API.prototype.onNetTypeChanged = function (type) {
            if (this.Status === 1 /* Offline */ && type != 0 /* None */) {
                this.login();
            }
        };
        // 刷新 session 有效时间
        API.prototype.updateSession = function () {
            this.sessionExpire = this.sessionValidity + Date.now();
        };
        Object.defineProperty(API.prototype, "OpenID", {
            get: function () {
                return this.openid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(API.prototype, "Status", {
            get: function () {
                if (this.status === 0 /* Online */ && this.sessionExpire <= Date.now()) {
                    this.status = 1 /* Offline */;
                }
                return this.status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(API.prototype, "Session", {
            get: function () {
                if (this.Status == 1 /* Offline */) {
                    this.session = null;
                }
                return this.session;
            },
            enumerable: true,
            configurable: true
        });
        // 直接登录服务器接口
        API.prototype.loginZmServer = function (params, success, fail) {
            this.loginServer(params, success, fail);
        };
        API.prototype.loginServer = function (params, success, fail) {
            var _this = this;
            if (!this.apiBase) {
                zm.eventCenter.event(zm.events.EventLogin);
                if (fail) {
                    fail.run();
                    return;
                }
            }
            zm.http.POST(this.apiBase + "/login", params, Laya.Handler.create(this, function (res) {
                if (res && res.Status === 0) {
                    _this.openid = res.OpenID;
                    _this.session = res.Session.ID;
                    _this.sessionValidity = res.Session.Expire * 1000;
                    _this.sessionExpire = _this.sessionValidity + Date.now();
                    _this.status = 0 /* Online */;
                    _this.retryCnt = 0;
                    zm.eventCenter.event(zm.events.EventLogin, res);
                    if (success) {
                        success.runWith(res);
                    }
                }
                else {
                    if (fail) {
                        fail.runWith(res);
                    }
                }
            }), Laya.Handler.create(this, function () {
                _this.loginFailed(success, fail);
            }));
        };
        API.prototype.loginFailed = function (success, fail) {
            if (this.retryCnt < this.MaxRetry) {
                this.retryCnt++;
                Laya.timer.once(this.retryCnt * 2000, this, this.login, [success, fail]);
            }
            else {
                zm.eventCenter.event(zm.events.EventLogin);
                if (fail) {
                    fail.run();
                }
            }
        };
        API.prototype.doGET = function (api, params, success, fail) {
            var _this = this;
            params['session'] = this.session;
            zm.http.GET(this.apiBase + api, params, Laya.Handler.create(this, function (res) {
                if (res && res.Status === 0) {
                    _this.updateSession();
                    if (success) {
                        success.runWith(res);
                    }
                }
                else if (res && res.Status === 1 && res.Message === "Unauthorized") {
                    _this.sessionExpire = 0;
                    _this.GET(api, params, success, fail);
                }
                else {
                    if (fail) {
                        fail.runWith(res);
                    }
                }
            }), fail);
        };
        API.prototype.GET = function (api, params, success, fail) {
            var _this = this;
            if (this.Status == 1 /* Offline */) {
                this.login(Laya.Handler.create(this, function (res) {
                    if (res && res.Status === 0) {
                        _this.doGET(api, params, success, fail);
                    }
                    else {
                        if (fail) {
                            fail.runWith(res);
                        }
                    }
                }), fail);
            }
            else {
                this.doGET(api, params, success, fail);
            }
        };
        API.prototype.doPOST = function (api, params, success, fail) {
            var _this = this;
            zm.http.POST(this.apiBase + api + "?session=" + this.session, params, Laya.Handler.create(this, function (res) {
                if (res && res.Status === 0) {
                    _this.updateSession();
                    if (success) {
                        success.runWith(res);
                    }
                }
                else if (res && res.Status === 1 && res.Message === "Unauthorized") {
                    _this.sessionExpire = 0;
                    _this.POST(api, params, success, fail);
                }
                else {
                    if (fail) {
                        fail.runWith(res);
                    }
                }
            }), fail);
        };
        API.prototype.POST = function (api, params, success, fail) {
            var _this = this;
            if (this.Status == 1 /* Offline */) {
                this.login(Laya.Handler.create(this, function (res) {
                    if (res && res.Status === 0) {
                        _this.doPOST(api, params, success, fail);
                    }
                    else {
                        if (fail) {
                            fail.runWith(res);
                        }
                    }
                }), fail);
            }
            else {
                this.doPOST(api, params, success, fail);
            }
        };
        // 分数接口
        API.prototype.getScore = function (type, success, fail) {
            this.GET("/user/score/" + parseInt(type + ""), {}, success, fail);
        };
        API.prototype.setScore = function (score, type, currency, success, fail) {
            this.POST("/rank", {
                Score: score,
                Type: type,
                Currency: currency,
                Force: false,
            }, success, fail);
        };
        API.prototype.setScoreForce = function (score, type, currency, success, fail) {
            this.POST("/rank", {
                Score: score,
                Type: type,
                Currency: currency,
                Force: true,
            }, success, fail);
        };
        //上传用户头像昵称
        //建议对数据加密
        API.prototype.setUserInfo = function (nickname, avatar, success, fail) {
            this.POST("/user/info", {
                Name: nickname,
                Avatar: avatar
            }, success, fail);
        };
        //上传用户头像昵称(已经加密Base64)
        API.prototype.uploadEncodeUserInfo = function (nickname, avatar, success, fail) {
            this.setUserInfo(Base64.encode(nickname), Base64.encode(avatar), success, fail);
        };
        // 排行榜接口
        API.prototype.getRank = function (type, success, fail) {
            this.GET("/user/rank/" + parseInt(type + ""), {}, success, fail);
        };
        API.prototype.getRankList = function (type, success, fail) {
            this.GET("/rank/list/" + parseInt(type + ""), {}, success, fail);
        };
        API.prototype.getRankListLimit = function (type, limit, success, fail) {
            this.GET("/rank/list/" + parseInt(type + ""), {
                limit: limit
            }, success, fail);
        };
        //获取有用户头像昵称的排行榜
        API.prototype.getRankListWithInfo = function (type, success, fail) {
            this.GET("/ttrank/list/" + parseInt(type + ""), {}, success, fail);
        };
        //获取有用户头像昵称的排行榜
        API.prototype.getRankListWithInfoLimit = function (type, limit, success, fail) {
            this.GET("/ttrank/list/" + parseInt(type + ""), { limit: limit }, success, fail);
        };
        //获取有用户头像昵称的排行榜(对已经Base64加密的内容进行解密)
        API.prototype.getRankListWithDecodeInfo = function (type, success, fail) {
            this.getRankListWithInfo(type, Laya.Handler.create(this, function (res) {
                if (res && res.Status == 0 && res.Lists && res.Lists.length > 0) {
                    //确定是否是Base64加密的才进行解密
                    res.Lists.forEach(function (item) {
                        if (item) {
                            if (Base64.isBase64(item.Name)) {
                                item.Name = Base64.decode(item.Name);
                            }
                            if (Base64.isBase64(item.Avatar)) {
                                item.Avatar = Base64.decode(item.Avatar);
                            }
                        }
                    });
                }
                if (success) {
                    success.runWith([res]);
                }
            }), fail);
        };
        API.prototype.getRankListWithDecodeInfoLimit = function (type, limit, success, fail) {
            this.getRankListWithInfoLimit(type, limit, Laya.Handler.create(this, function (res) {
                if (res && res.Status == 0 && res.Lists && res.Lists.length > 0) {
                    //确定是否是Base64加密的才进行解密
                    res.Lists.forEach(function (item) {
                        if (item) {
                            if (Base64.isBase64(item.Name)) {
                                item.Name = Base64.decode(item.Name);
                            }
                            if (Base64.isBase64(item.Avatar)) {
                                item.Avatar = Base64.decode(item.Avatar);
                            }
                        }
                    });
                }
                if (success) {
                    success.runWith([res]);
                }
            }), fail);
        };
        // 金币接口
        API.prototype.getCurrency = function (success, fail) {
            this.GET("/user/currency", {}, success, fail);
        };
        API.prototype.setCurrency = function (currency, type, success, fail) {
            if (type == 0 && currency == 0) {
                return;
            }
            this.POST("/user/currency", {
                Type: type,
                Currency: currency,
            }, success, fail);
        };
        // 道具接口
        API.prototype.getItemList = function (success, fail) {
            this.GET("/user/item", {}, success, fail);
        };
        API.prototype.setItem = function (itemid, count, success, fail) {
            if (count == 0) {
                return;
            }
            else if (count > 0) {
                this.POST("/item/" + parseInt(itemid + ""), {
                    ItemNum: count,
                }, success, fail);
            }
            else {
                this.POST("/user/item/" + parseInt(itemid + ""), {
                    ItemNum: -count,
                }, success, fail);
            }
        };
        // 自定义数据接口
        API.prototype.setData = function (data, success, fail) {
            this.POST("/user/data", {
                Data: JSON.stringify(data),
            }, success, fail);
        };
        // 签到接口
        API.prototype.getSign = function (success, fail) {
            this.GET("/sign", {}, success, fail);
        };
        API.prototype.setSign = function (success, fail) {
            this.POST("/sign", {}, success, fail);
        };
        // 邀请接口
        API.prototype.getInviteList = function (success, fail) {
            this.GET("/task/invite", {}, success, fail);
        };
        API.prototype.completeInvite = function (openid, success, fail) {
            this.POST("/share", {
                OpenID: openid,
            }, success, fail);
        };
        API.prototype.finishInvite = function (taskid, reset, success, fail) {
            this.POST("/task/reward/" + parseInt(taskid + ""), {
                Reset: reset,
            }, success, fail);
        };
        //敏感词检测接口
        API.prototype.msgSecCheck = function (content, success, fail) {
            this.POST("/sec/msg", {
                Content: content,
            }, success, fail);
        };
        //微信订阅消息接口
        API.prototype.subscribeMessage = function (templateId, data, delaySecond, page, success, fail) {
            if (page === void 0) { page = "index"; }
            this.POST("/notify", {
                TemplateID: templateId,
                Data: data,
                Delay: delaySecond,
                Page: page
            }, success, fail);
        };
        return API;
    }());
    zm.API = API;
})(zm || (zm = {}));
/// <reference path="./API.ts" />
var zm;
/// <reference path="./API.ts" />
(function (zm) {
    var WebAPI = /** @class */ (function (_super) {
        __extends(WebAPI, _super);
        function WebAPI() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WebAPI.prototype.login = function (success, fail) {
            this.loginFailed(success, fail);
        };
        return WebAPI;
    }(zm.API));
    zm.WebAPI = WebAPI;
})(zm || (zm = {}));
/// <reference path="./UpdateHelper.ts" />
var zm;
/// <reference path="./UpdateHelper.ts" />
(function (zm) {
    var WebUpdate = /** @class */ (function () {
        function WebUpdate() {
        }
        WebUpdate.prototype.checkUpdate = function (callback) {
            if (callback) {
                callback.run();
            }
        };
        return WebUpdate;
    }());
    zm.WebUpdate = WebUpdate;
})(zm || (zm = {}));
/// <reference path="./index.ts" />
/// <reference path="./YokaStat/WebYokaStat.ts" />
/// <reference path="./login/LoginHandler.ts" />
/// <reference path="./device/WebDevicer.ts" />
/// <reference path="./share/WebShare.ts" />
/// <reference path="./system/WebSystemHelper.ts" />
/// <reference path="./opendata/WebOpenUtils.ts" />
/// <reference path="./http/http.ts" />
/// <reference path="./http/WebRequest.ts" />
/// <reference path="./submit/WebSubmitAction.ts" />
/// <reference path="./submit/SubmitActionManager.ts" />
/// <reference path="./login/WebLoginHandler.ts" />
/// <reference path="./api/WebAPI.ts" />
/// <reference path="./share/YokaShare.ts" />
/// <reference path="./update/WebUpdate.ts" />
var zm;
/// <reference path="./index.ts" />
/// <reference path="./YokaStat/WebYokaStat.ts" />
/// <reference path="./login/LoginHandler.ts" />
/// <reference path="./device/WebDevicer.ts" />
/// <reference path="./share/WebShare.ts" />
/// <reference path="./system/WebSystemHelper.ts" />
/// <reference path="./opendata/WebOpenUtils.ts" />
/// <reference path="./http/http.ts" />
/// <reference path="./http/WebRequest.ts" />
/// <reference path="./submit/WebSubmitAction.ts" />
/// <reference path="./submit/SubmitActionManager.ts" />
/// <reference path="./login/WebLoginHandler.ts" />
/// <reference path="./api/WebAPI.ts" />
/// <reference path="./share/YokaShare.ts" />
/// <reference path="./update/WebUpdate.ts" />
(function (zm) {
    function initWeb(shareConfig) {
        zm.device = zm.WebDevicer;
        zm.shareHelper = zm.WebShare;
        zm.share = new zm.YokaShare(zm.WebShare, shareConfig);
        zm.system = new zm.WebSystemHelper;
        zm.statistics = new zm.WebYokaStat;
        zm.opendata = new zm.WebOpenUtils;
        zm.http.request = zm.http.webRequest;
        zm.submitter = new zm.SubmitActionManager(zm.WebSubmitAction);
        zm.login = new zm.WebLoginHandler;
        zm.api = new zm.WebAPI;
        zm.update = new zm.WebUpdate;
        // ad.setAdEnable(false);
    }
    zm.initWeb = initWeb;
})(zm || (zm = {}));
