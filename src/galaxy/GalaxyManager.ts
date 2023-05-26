import Constants from "../model/Constants";
import GalaxyCamera from "./GalaxyCamera";
import ResourceManager from "../ctrl/ResourceManager";
import DTime from "../utils/DTime";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GalaxyPageMgr from "../gameuictrl/GalaxyPageMgr";
import GalaxyShip from "./GalaxyShip";
import GalaxyPlanet from "./GalaxyPlanet";
import SolarManager from "../solar/SolarManager";
import UserData from "../data/UserData";
import GameSceneMgr from "../ctrl/GameSceneMgr";
import SolarWelcomePopupMgr from "../gameuictrl/SolarWelcomePopupMgr";
import ManualPageMgr from "../gameuictrl/ManualPageMgr";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import MergeUserData from "../merge/data/MergeUserData";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import SwitchSceneMgr from "../ctrl/SwitchSceneMgr";
import BackgroundManager from "../background/BackgroundManager";
import FPSStatistics from "../ctrl/FPSStatistics";
import { FPSScene } from "../model/GameModel";

/*
* 星际逻辑控制;
*/
export default class GalaxyManager{
    constructor(){
    }

    private static _instance:GalaxyManager;
    public static get instance():GalaxyManager
    {
        if(!this._instance)
        {
            this._instance = new GalaxyManager();
        }
        return this._instance;
    }

    private static readonly GalaxyRotateSpeed:number = 1.5;

    private _galaxy:Laya.Sprite3D;
    private _galaxyPlanets:Array<GalaxyPlanet>;
    private _galaxyGlow:Laya.Sprite3D;

    private _unlockGalaxyPlanet:GalaxyPlanet;
    private _inUnlockSolarMovie:boolean;

    public get inUnlockSolarMovie():boolean
    {
        return this._inUnlockSolarMovie;
    }

    public start():void
    {
        GalaxyCamera.instance.start();
        this.initGalaxy();

        this._inUnlockSolarMovie = false;
    }
    
    /**
     * @param showAllGalaxy 是否显示完整星系(远景)
     */
    public enter(showAllGalaxy:boolean=false):void
    {
        if(this._galaxyGlow){
            this._galaxyGlow.active = true;
        }
        FPSStatistics.instance.start(FPSScene.Galaxy);
        Constants.AccessingSolarSystem = false;
        BackgroundManager.instance.setGalaxyBg();
        GalaxyCamera.instance.show();
        GalaxyPageMgr.instance.show();
        this.addEvents();
        if(showAllGalaxy)
        {
            this.setGalaxyPlanetInfoEnable(false);
            this.showAllGalaxy();
        }else{
            this.setGalaxyPlanetInfoEnable(true);
            this.showCurSolar();
        }
    }
    
    public leave():void
    {
        if(this._galaxyGlow){
            this._galaxyGlow.active = false;
        }
        FPSStatistics.instance.end();
        this.removeEvents();
        GalaxyPageMgr.instance.close();
        GalaxyCamera.instance.hide();
        this.setGalaxyPlanetInfoEnable(false);
    }

    private addEvents():void
    {
        Laya.timer.frameLoop(1,this,this.galaxyUpdate);
        GameEventMgr.instance.addListener(GameEvent.OnScreenMove, this, this.onScreenMove);
        GameEventMgr.instance.addListener(GameEvent.OnClickGalaxyPlanet, this, this.onClickGalaxyPlanet);
        GameEventMgr.instance.addListener(GameEvent.GalaxyUIEnable, this, this.setGalaxyUI);
    }
    
    private removeEvents():void
    {
        Laya.timer.clear(this,this.galaxyUpdate);
        GameEventMgr.instance.removeListener(GameEvent.OnScreenMove, this, this.onScreenMove);
        GameEventMgr.instance.removeListener(GameEvent.OnClickGalaxyPlanet, this, this.onClickGalaxyPlanet);
        GameEventMgr.instance.removeListener(GameEvent.GalaxyUIEnable, this, this.setGalaxyUI);
    }

    private galaxyUpdate():void
    {
        this.update();
        GalaxyCamera.instance.update();
    }

    private initGalaxy():void
    {   
        this._unlockGalaxyPlanet = null;
        this._galaxy = ResourceManager.instance.getGalaxy();
        this.initGalaxyPlanet();
        this.initGalaxyAllStars();
        this.initGalaxySpiral();
        this.initGalaxyShip();
        this.initGalaxyGlow();
    } 

    private initGalaxyGlow():void
    {
        this._galaxyGlow = this._galaxy.getChildByName("GalaxyGlow") as Laya.Sprite3D;
        this._galaxyGlow.active = false;
    }

    private initGalaxySpiral():void
    {
        let spiral = this._galaxy.getChildByName("Galaxy_Spiral") as Laya.Sprite3D;
        let mesh = spiral.getChildAt(0) as Laya.MeshSprite3D;
        let material:Laya.UnlitMaterial = mesh.meshRenderer.material as Laya.UnlitMaterial;
        material.renderQueue = 2900;
    }

    private initGalaxyAllStars():void
    {
        // let allStars = this._galaxy.getChildByName("Galaxy_Stars") as Laya.Sprite3D;
        // let mesh = allStars.getChildAt(0) as Laya.MeshSprite3D;
        // let material:Laya.UnlitMaterial = mesh.meshRenderer.material as Laya.UnlitMaterial;
        // material.renderQueue = 3100;
    }

    private initGalaxyPlanet():void
    {
        this._galaxyPlanets = [];
        for(var i=0; i<Constants.SolarNum; i++)
        {
            let planetObj = this._galaxy.getChildByName("GalaxyPlanet_"+i) as Laya.Sprite3D;
            if(planetObj)
            {
                let galaxyPlanet = new GalaxyPlanet();
                galaxyPlanet.load(planetObj, i);
                this._galaxyPlanets.push(galaxyPlanet);
            }
        }
    }

    private initGalaxyShip():void
    {
        let shipObj = this._galaxy.getChildByName("GalaxyShip") as Laya.Sprite3D;
        shipObj.removeSelf();
        GalaxyShip.instance.init(shipObj);
    }
    
    private update():void
    {
        if(GalaxyShip.instance.shipFlying)
        {
            GalaxyShip.instance.update();
            this.checkGalaxyShipLand();
        }else{
            this.rotateGalaxy();
            this.updateGalaxyPlanet();
        }
    }
    
    private onScreenMove(diffPos:Laya.Vector2):void
    {
        GalaxyCamera.instance.setDragTarget(diffPos.x, diffPos.y);
    }
    
    private rotateGalaxy():void
    {
        if(this._galaxy)
        {
            let vec3:Laya.Vector3 = this._galaxy.transform.localRotationEuler;
            vec3.z -= DTime.deltaTime * GalaxyManager.GalaxyRotateSpeed;
            this._galaxy.transform.localRotationEuler = vec3;
        }
    }
    
    private updateGalaxyPlanet():void
    {
        if(this._galaxyPlanets)
        {
            this._galaxyPlanets.forEach(galaxyPlanet => {
                
                galaxyPlanet.update();

            });
        }
    }

    private setGalaxyUI(enable:boolean):void
    {
        GalaxyPageMgr.instance.setUIEnable(enable);
        this.setGalaxyPlanetInfoEnable(enable);
    }

    private setGalaxyPlanetInfoEnable(enable:boolean):void
    {
        if(this._galaxyPlanets)
        {
            this._galaxyPlanets.forEach(galaxyPlanet => {
                
                if(enable){
                    galaxyPlanet.show();
                }else{
                    galaxyPlanet.hide();
                }

            });
        }
    }

    public disSquareToGalaxyCenter(posX:number, posY:number):number
    {
        let diffX = posX-this._galaxy.transform.position.x;
        let diffY = posY-this._galaxy.transform.position.y;
        return diffX*diffX + diffY*diffY;
    }

    public onClickGalaxyPlanet(discoverIdx:number):void
    {
        ManualPageMgr.instance.show(discoverIdx);
        // SolarManager.instance.selectSolar(discoverIdx);
        // GameSceneMgr.instance.gotoSolar();
    }

    public exploreNewSolar():void
    {
        this._inUnlockSolarMovie = true;
        //音乐
        SoundManager.instance.playMusic(MusicConfig.ExploreBgm, 1);
        //初始位置
        let curGalaxyPlanet = this._galaxyPlanets[UserData.instance.curDiscoverIndex];
        //解锁星系
        let nextDiscoverIdx:number = UserData.instance.totalDiscoverIndex;
        this._unlockGalaxyPlanet = this._galaxyPlanets[nextDiscoverIdx];
        //隐藏UI
        this.setGalaxyUI(false);
        //显示通知
        Laya.timer.once(1000, this, function():void
        {
            GalaxyPageMgr.instance.setNoticeEnable(true);
        })
        //设置镜头
        GalaxyCamera.instance.setTargetTransform(GalaxyShip.instance.ship.transform);
        //飞行动画
        GalaxyShip.instance.launch(curGalaxyPlanet.planetPosition, this._unlockGalaxyPlanet.planetPosition);
        //
        GameEventMgr.instance.Dispatch(GameEvent.OnUnlockSolarStart);
    }

    private checkGalaxyShipLand():void
    {
        let shipPos = GalaxyShip.instance.shipPositon;
        if( this._unlockGalaxyPlanet.checkHit(shipPos) )
        {
            this.galaxyShipLand();
        }
    }

    private galaxyShipLand():void
    {
        this._inUnlockSolarMovie = false;
        GalaxyShip.instance.land();
        //解锁星系
        SolarManager.instance.unlockNewSolar();
        this._unlockGalaxyPlanet.initInfoItem();
        this._unlockGalaxyPlanet.hide();
        this._unlockGalaxyPlanet = null;
        //
        GalaxyPageMgr.instance.setNoticeEnable(false);
        //
        GalaxyCamera.instance.clearTargetTransform();
        SwitchSceneMgr.instance.reachGalaxyPlanet(Laya.Handler.create(this, this.maskIn), Laya.Handler.create(this, this.maskOut));
        //
        DataStatisticsMgr.instance.stat("解锁新星系",{"星系等级":UserData.instance.totalDiscoverIndex.toString(), "火箭等级":MergeUserData.instance.iMaxLockedShipId.toString() });
        //
        GameEventMgr.instance.Dispatch(GameEvent.OnUnlockSolarEnd);
    }

    private maskIn():void
    {
        this.showCurSolar();
        this.setGalaxyUI(true);
        //显示欢迎新星系界面
        SolarWelcomePopupMgr.instance.show();
    }
    
    private maskOut():void
    {
    }

    private showCurSolar():void
    {
        let curGalaxyPlanet = this._galaxyPlanets[UserData.instance.curDiscoverIndex];
        GalaxyCamera.instance.jumpToTarget(curGalaxyPlanet.planetPosition);
    }

    private showAllGalaxy():void
    {
        GalaxyCamera.instance.showAllGalaxy();
    }
}