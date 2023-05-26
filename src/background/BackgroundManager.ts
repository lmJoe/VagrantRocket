import DecorationPlanetObject from "./DecorationPlanetObject";
import Mathf from "../utils/Mathf";
import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import ResourceConfig from "../config/ResourceConfig";
import GameConfig from "../GameConfig";
import GameLayerMgr from "../scene/GameLayerMgr";
import Spaceship from "../ship/Spaceship";
import SpaceshipManager from "../ship/SpaceshipManager";
import { SpaceshipState } from "../model/GameModel";
import BackgroundFog from "./BackgroundFog";
import HighLine from "./HighLine";
import BackgroundAsteroid from "./BackgroundAsteroid";
import UserData from "../data/UserData";
import LevelColor from "../config/LevelColor";
import Constants from "../model/Constants";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SolarManager from "../solar/SolarManager";
import MergeUserData from "../merge/data/MergeUserData";
import FPSStatistics from "../ctrl/FPSStatistics";

/*
* 背景星星管理;
*/
export default class BackgroundManager{
    constructor(){
    }
    private static _instance:BackgroundManager;
    public static get instance():BackgroundManager
    {
        if(!this._instance)
        {
            this._instance = new BackgroundManager();
        }
        return this._instance;
    }

    private _backgroundFog:BackgroundFog;
    private _backgroundAsteroid:BackgroundAsteroid;
    private _highLine:HighLine;
    private _sceneImgBg:Laya.Image;

    public start():void
    {
        this.instantiateAsteroids();
        this.instantiateFogs();
        this.setGameBg();
        this.instantiateHighLine();
        GameEventMgr.instance.addListener(GameEvent.ChangeLevel, this, this.onLevelChange);
        GameEventMgr.instance.addListener(GameEvent.OnFPSLow, this, this.onFPSLow);
    }

    private onLevelChange():void
    {
        if(this._backgroundFog)
        {
            this._backgroundFog.reset();
        }
        if(this._backgroundAsteroid && !FPSStatistics.instance.lowFps)
        {
            this._backgroundAsteroid.reset();
        }
    }

    private onFPSLow():void
    {
        if(this._backgroundAsteroid)
        {
            this._backgroundAsteroid.clear();
            this._backgroundAsteroid = null;
        }
    }

    public reset():void
    {
        if(this._highLine)
        {
            this._highLine.resetHighLine();
        }
        this.setGameBg();
    }

    public update():void
    {
        if(this._backgroundFog && !FPSStatistics.instance.lowFps)
        {
            this._backgroundFog.update();
        }
        
        if(this._highLine)
        {
            this._highLine.update();
        }
    }

    public setGalaxyBg():void
    {
        this.setGameBg();
    }

    private setGameBg():void
	{  
        if(!this._sceneImgBg)
        {
            this._sceneImgBg = new Laya.Image();
            GameLayerMgr.instance.bgLayer.addChild(this._sceneImgBg);
            this._sceneImgBg.pos(0, 0);
            this._sceneImgBg.size(Laya.stage.width, Laya.stage.height);
        }
        if(Constants.AccessingSolarSystem)
        {
            let levelColorType = LevelColor.getLevelColorType();
            this._sceneImgBg.skin = ResourceManager.instance.getGameBgUrl(levelColorType);
            this._sceneImgBg.alpha = 0.7;
        }else{
            this._sceneImgBg.skin = ResourceConfig.GalaxyBg;
            this._sceneImgBg.alpha = 1;
        }
    }

    private instantiateAsteroids():void
	{   
        this._backgroundAsteroid = new BackgroundAsteroid();
        this._backgroundAsteroid.init();
    }

    private instantiateFogs():void
	{   
        this._backgroundFog = new BackgroundFog();
        this._backgroundFog.init();
    }

    private instantiateHighLine():void
	{   
        this._highLine = new HighLine();
        this._highLine.init();
    }
}