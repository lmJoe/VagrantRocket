import GameSave from "./GameSave";
import Constants from "../model/Constants";
import SolarManager from "../solar/SolarManager";
import WxHandler from "../wx/WxHandler";
import ScoreUtil from "./ScoreUtil";
import MergeUserData from "../merge/data/MergeUserData";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import LevelData from "../model/LevelData";
import GameJsonConfig from "../config/GameJsonConfig";
import ServerData from "./ServerData";
import CommentMgr from "../ctrl/CommentMgr";
import SkinManager from "../ctrl/SkinManager";
import NationManager from "../ctrl/NationManager";
import SignManager from "../ctrl/SignManager";
import StarManager from "../ctrl/StarManager";


/*
* 游戏关卡数据 
 */
export default class UserData{
    constructor(){
    }

    private static _instance:UserData;
    public static get instance():UserData
    {
        if(!this._instance)
        {
            this._instance = new UserData();
        }
        return this._instance;
    }

    //是否有本地存储
    private _hasLocalData:boolean;
    //游戏总飞行距离
    private _gameDistance:number;
    //当前星系index
    private _curDiscoverIndex:number;
    //总解锁星系 -- 游戏关卡
    private _totalDiscoverIndex:number;
    //降落星球index
    private _landPlanetIndex:number;
    //
    private _levelData:LevelData;
    //看的激励视频广告数量
    private _adVideoCount:number;
    //此关之前的所有关总距离
    private _prevLevelFlewDistance:number;
    //国家阵营
    private _nationId:number;
    //游戏登录星球次数
    private _flySucCount:number;
    //最佳飞行距离
    private _bestDistance:number;


    private _data:any;

    public start():void
    {
        // this.clearAllData();
        
        //获取本地存储
        this.getLocalUserData();
        SolarManager.instance.getLocal();
        MergeUserData.instance.initLoaclData();
        SkinManager.instance.getLocal();
        SignManager.instance.initData();
        StarManager.instance.getLocal();
        NationManager.instance.init();   
    }
    
    private clearAllData():void
    {
        GameSave.clearUserData();
        SolarManager.instance.clearSolarData();
        MergeUserData.instance.clearData();
        CommentMgr.instance.clearComment();
        SkinManager.instance.clearSkins();
        SignManager.instance.clearData();
        StarManager.instance.clearData();
    }

    private submitData():void
    {
        WxHandler.instance.submitGameData(this._gameDistance, this._totalDiscoverIndex);
        zm.api.setScore( ScoreUtil.packageServerScore(this._gameDistance, this._totalDiscoverIndex), 0, 0);
    }

    private getLocalUserData():void
    {
        this._hasLocalData = true;
        let data = GameSave.getUserData();
        if(!data)
        {
            this._hasLocalData = false;
        }
        this.parseData(data);
        // if(this._hasLocalData)
        // {
        //     this.submitData();
        // }
    }

    public getServer(data:any):void
    {
        this.parseData(data);
        this.saveUserData();
        this.submitData();
    }

    private parseData(data:any):void
    {
        this._data = data;
        if(!this._data)
        {
            this._data = {};
            //初值
            this._data.gameDistance = 0;//0
            this._data.curDiscoverIndex = Constants.DefaultFirstDiscoverIndex;
            this._data.totalDiscoverIndex = 1;//1
            this._data.landPlanetIndex = Constants.DefaultLandPlanetIndex;
            //
            this._data.adVideoCount = 0;//0
            this._data.nationId = 0;//0
            this._data.flySucCount = 0;//0
            this._data.bestDistance = 0;//0
        }
        this._gameDistance = this._data.gameDistance;
        this._curDiscoverIndex = this._data.curDiscoverIndex;
        this._totalDiscoverIndex = this._data.totalDiscoverIndex;
        this._landPlanetIndex = this._data.landPlanetIndex;
        //
        this._adVideoCount = this._data.adVideoCount == undefined ? 0 : this._data.adVideoCount;
        this._nationId = this._data.nationId == undefined ? 0 : this._data.nationId;
        this._bestDistance = this._data.bestDistance == undefined ? 0 : this._data.bestDistance;
        this._flySucCount = this._data.flySucCount == undefined ? 0 : this._data.flySucCount;

        this._levelData = GameJsonConfig.instance.getLevelConfig(this.gameLevel);
        //
        this.calcPrevLevelDistance();
        this.checkLevelAndDistance();  
    }

    public saveUserData():void
    {
        this._data.gameDistance = this._gameDistance;
        this._data.curDiscoverIndex = this._curDiscoverIndex;
        this._data.totalDiscoverIndex = this._totalDiscoverIndex;
        this._data.landPlanetIndex = this._landPlanetIndex;
        this._data.adVideoCount = this._adVideoCount;
        this._data.nationId = this._nationId;
        this._data.flySucCount = this._flySucCount;
        this._data.bestDistance = this._bestDistance;

        GameSave.setUserData(this._data);
    }

    private checkLevelAndDistance():void
    {
        if(this._gameDistance < this._prevLevelFlewDistance)
        {
            console.log("飞行总距离不够：", this._gameDistance);
            this._gameDistance = this._prevLevelFlewDistance + Math.floor( this.levelDistance*Math.random()*0.1 );
            console.log("飞行总距离更新：",this._gameDistance);
        }
        else if(this._gameDistance >= this._prevLevelFlewDistance+this.levelDistance)
        {
            console.log("飞行总距离超出：", this._gameDistance);
            this._gameDistance = this._prevLevelFlewDistance + Math.floor( this.levelDistance*Math.random()*0.5 );
            console.log("飞行总距离更新：",this._gameDistance);
        }else{
            //数据正常则不更新
            return;
        }
        //数据更新
        this.saveUserData();
        this.submitData();
    }

    public updateLandPlanet(planetIndex:number):void
    {
        this._landPlanetIndex = planetIndex;
        this.saveUserData();
    }

    public updateflySucCount():void
    {
        this._flySucCount++;
        this.saveUserData();
    }

    public addFlyDistance(distance:number):void
    {
        if(distance > this._bestDistance)
        {
            debugger
            this._bestDistance = distance;
            GameEventMgr.instance.Dispatch(GameEvent.RefreshBestDistance);
        }

        this._gameDistance += distance;
        this.saveUserData();
        this.submitData();
        GameEventMgr.instance.Dispatch(GameEvent.RefreshGameDistance);
        //
        // ServerData.instance.uploadData();
    }

    public updateCurDiscoverIndex(idx):void
    {
        this._curDiscoverIndex = idx;
        this.saveUserData();
    }

    public unlockNewSolar():void
    {
        this._totalDiscoverIndex ++;
        this._curDiscoverIndex = this._totalDiscoverIndex - 1;
        this._landPlanetIndex = Constants.DefaultLandPlanetIndex;
        this._levelData = GameJsonConfig.instance.getLevelConfig(this.gameLevel);
        this.calcPrevLevelDistance();
        this.saveUserData();
        this.submitData();
    }

    public updateAdCount():void
    {
        this._adVideoCount ++;
        this.saveUserData();
        GameEventMgr.instance.Dispatch(GameEvent.OnVideoAdUpdate);
    }

    public changeNation(nationId:number):void
    {
        this._nationId = nationId;
        this.saveUserData();
    }

    private calcPrevLevelDistance():void
    {
        this._prevLevelFlewDistance = 0;
        if(this.gameLevel > 1)
        {
            for(var i=1; i<this.gameLevel; i++)
            {
                let lvData = GameJsonConfig.instance.getLevelConfig(i);
                this._prevLevelFlewDistance += lvData.distance;
            }
        }
    }

    public allUserData():any
    {
        return this._data;
    }

    //游戏飞行总距离
    public get gameDistance():number
    {
        return this._gameDistance;
    }
    
    //本关之前关卡飞行总距离
    public get prevLevelFlewDistance():number
    {
        return this._prevLevelFlewDistance;
    }
    
    //本关已经飞行的距离
    public get levelFlewDistance():number
    {
        return this._gameDistance - this._prevLevelFlewDistance;
    }

    public get curDiscoverIndex():number
    {
        return this._curDiscoverIndex;
    }

    public get totalDiscoverIndex():number
    {
        return this._totalDiscoverIndex;
    }

    public get landPlanetIndex():number
    {
        return this._landPlanetIndex;
    }

    //游戏等级 —— 解锁信息数
    public get gameLevel():number
    {
        return this._totalDiscoverIndex;
    }

    public get levelDistance():number
    {
        return this._levelData.distance;
    }

    public get levelData():LevelData
    {
        return this._levelData;
    }

    public get hasLocalData():boolean
    {
        return this._hasLocalData;
    }

    public get adVideoCount():number
    {
        return this._adVideoCount;
    }

    public get nationId():number
    {
        return this._nationId;
    }

    public get flySucCount():number
    {
        return this._flySucCount;
    }

    public get bestDistance():number
    {
        return this._bestDistance;
    }
}