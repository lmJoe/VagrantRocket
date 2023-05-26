import SceneController from "../scene/SceneController";
import GameManager from "./GameManager";
import LoginManager from "./LoginManager";
// import WxOpenHander from "../wx/WxOpenHander";
import GameSceneMgr from "./GameSceneMgr";
import RegistUIMgr from "./RegistUIMgr";
import MergeGameMgr from "../merge/ctrl/MergeGameMgr";
import UserData from "../data/UserData";
import ZMGameConfig from "../ZMGameConfig";
import ServerData from "../data/ServerData";
import LoadingPageMgr from "../gameuictrl/LoadingPageMgr";
import SystemNoticeMgr from "./SystemNoticeMgr";
import GameSave from "../data/GameSave";
import Util from "../utils/Util";
import DataStatisticsMgr from "./DataStatisticsMgr";
import WxHandler from "../wx/WxHandler";
import SoundManager from "./SoundManager";

/*
* 系统控制——区分星际，游戏，微信，登录等;
*/
export default class SystemControl{
    constructor(){
    }

    private static _instance:SystemControl;
    public static get instance():SystemControl
    {
        if(!this._instance)
        {
            this._instance = new SystemControl();
        }
        return this._instance;
    }

    private static readonly SystemKey:string = "SystemKey";
    private _systemData:any;
    private _dailyGameCount:number;
    private _lastGameTimemark:number;

    private enterGamePage():void
    {
        LoadingPageMgr.instance.close();
        MergeGameMgr.instance.start();
        GameSceneMgr.instance.start();
    }
    
    public start():void
    {
        this.initSystemData();
        UserData.instance.start();
        RegistUIMgr.instance.regist();
        SceneController.instance.loadScene();
        // WxOpenHander.instance.getSelfInfo();
        SystemNoticeMgr.instance.start();
        //有本地数据直接显示界面
        if(UserData.instance.hasLocalData)
        {
            this.enterGamePage();
        }
        //开始登录
        zm.eventCenter.on(zm.events.EventAppShow, this, this.onShow);
        zm.eventCenter.on(zm.events.EventAppHide, this, this.onHide);
        LoginManager.login(Laya.Handler.create(this, this.onFirstLoginSuccess), Laya.Handler.create(this, this.onFirstLoginFail));
    }

    private onFirstLoginSuccess(data):void
    {
        if(data)
        {
            //得到服务器信息
            ServerData.instance.loadServerData(data.Data);
            // ServerData.instance.loadServerData("");
            if(!UserData.instance.hasLocalData)
            {
                //无本地数据等待登录返回
                this.enterGamePage();
            }
        }
        //
        if(WxHandler.isWx)
        {
            let launchOptions = WxHandler.wx.getLaunchOptionsSync();
            console.log("onStart", launchOptions);
            this.parseLaunchScene(launchOptions);
        }
        MergeGameMgr.instance.gameShow(true);
    }

    private onFirstLoginFail(failStr):void
    {
        console.log("onFirstLoginFail", failStr);
        if(!UserData.instance.hasLocalData)
        {
            //无本地数据等待登录成功再显示
            this.enterGamePage();
        }
        MergeGameMgr.instance.gameShow(true);
    }

    private onShow(res: zm.LaunchOptions) 
    {
        console.log("onShow", res);
        this.parseLaunchScene(res);
        MergeGameMgr.instance.gameShow(false);
    }
    
    /**切后台*/
    private onHide() {
        console.log("onHide");
        MergeGameMgr.instance.gameHide();
        SoundManager.instance.stopAllSound();
    }

    private clearData():void
    {
        GameSave.clearValue(SystemControl.SystemKey);
    }

    private initSystemData():void
    {
        let saveStr = GameSave.getValue(SystemControl.SystemKey);
        if(!saveStr)
        {
            this._systemData = {};
            this._systemData.dailyGameCount = 0;
            this._systemData.lastGameTimemark = 0;
        }else{
            this._systemData = JSON.parse(saveStr);
        }
        this._dailyGameCount = this._systemData.dailyGameCount;
        this._lastGameTimemark = this._systemData.lastGameTimemark;
        //统计今日打开游戏次数
        if(Util.isToday(this._lastGameTimemark) == false)
        {
            this._dailyGameCount = 0;
        }
        this._dailyGameCount ++;
        //保存新数据
        this._lastGameTimemark = Date.now();
        this.saveData();
        //统计
        DataStatisticsMgr.instance.stat("每日登入游戏",{"次数":this._dailyGameCount.toString()});
    }

    private saveData():void
    {
        this._systemData.dailyGameCount = this._dailyGameCount;
        this._systemData.lastGameTimemark = this._lastGameTimemark;
        GameSave.setValue(SystemControl.SystemKey, JSON.stringify(this._systemData));
    }

    public get dailyGameCount():number
    {
        return this._dailyGameCount;
    }

    private parseLaunchScene(ops: zm.LaunchOptions): void 
    {
        // if(ops && WxHandler.instance.isRewardScence(ops.scene))
        // {
        //     YunyingAirDropBonusPopupMgr.instance.fromRightScene();
        // }
    }
}