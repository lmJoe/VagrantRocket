import OriginPlanet from "./OriginPlanet";
import PlanetObject from "./PlanetObject";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SpaceshipManager from "../ship/SpaceshipManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import WorldCamera from "../camera/WorldCamera";
import Constants from "../model/Constants";
import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import { SpaceshipState } from "../model/GameModel";
import CameraShakeValues from "../camera/CameraShakeValues";
import SolarManager from "../solar/SolarManager";
import AstronautManager from "../astronaut/AstronautManager";
import UserData from "../data/UserData";

/*
* 可降落星球管理;
*/
export default class PlanetManager{
    constructor(){
    }

    private static _instance:PlanetManager;
    public static get instance():PlanetManager
    {
        if(!this._instance)
        {
            this._instance = new PlanetManager();
        }
        return this._instance;
    }

    private _originPlanet:OriginPlanet;

    private _solarPlanets:Array<PlanetObject>;
    private _landablePlanets:Array<PlanetObject>;
    
    public isWithinPlanetRange:boolean;
    public landingPlanet:PlanetObject;


    public get flyByPosition():Laya.Vector3
    {
        if(this._landablePlanets.length > 0)
        {
            return this._landablePlanets[0].flyByPosition;
        }else{
            let pos = SpaceshipMaster.instance.rokectPosition;
            pos.z += 100;
            return pos;
        }
    }

    public get originPlanet():OriginPlanet
    {
        return this._originPlanet;
    }

    public start():void
    {
        this.instantiatePlanets();
        this.initOriginPlanet();
        this.reset();
        GameEventMgr.instance.addListener(GameEvent.ChangeLevel, this, this.onLevelChange);
        GameEventMgr.instance.addListener(GameEvent.OnNationChange, this, this.onNationChange);
    }

    private onLevelChange():void
    {
        this._solarPlanets.forEach(planetObj => {
            planetObj.destory();
        });
        this.instantiatePlanets();
        // this.reset();
    }
    
    private onNationChange():void
    {
        this.reset();
    }

    public reset():void
    {
        this.isWithinPlanetRange = false;
        this.landingPlanet = null;
        this._solarPlanets.forEach(planetObj => {
            planetObj.reset();
        });
        this.setPlanets();
    }

    public onLanded():void
	{
        let landPlanet = this.landingPlanet ? this.landingPlanet : this._landablePlanets[0];
        if(landPlanet)
        {
            //星球加人 
            SolarManager.instance.addSolarPopulation(landPlanet.index, AstronautManager.instance.astronautInShip);
            AstronautManager.instance.onLand();
            UserData.instance.updateLandPlanet(landPlanet.index);
        }
    }

    public update():void
    {
        if(this._landablePlanets.length>0 && SpaceshipManager.instance.state != SpaceshipState.Landing && SpaceshipManager.instance.state != SpaceshipState.Landed)
        {
            let posi:Laya.Vector3 = SpaceshipMaster.instance.rokectPosition;
            let flyByPosition = this._landablePlanets[0].flyByPosition;
            if(posi.z > flyByPosition.z)
            {
                if(this._landablePlanets.length > 1)
                {
                    this._landablePlanets.shift();
                }
            }
            if(this._landablePlanets.length > 0)
            {
                flyByPosition = this._landablePlanets[0].flyByPosition;
                if(posi.z > flyByPosition.z-Constants.PlanetCheckHeight )
                {
                    this.isWithinPlanetRange = true;
                }            
            // }else{
            //     this.isWithinPlanetRange = false;
            }
        }else{
            if(this.landingPlanet && SpaceshipManager.instance.state != SpaceshipState.Landed)
            {
               let isHit:boolean = this.landingPlanet.hit(SpaceshipMaster.instance.rokectPosition);
               if(isHit)
               {
                   SpaceshipManager.instance.onLand();
                   WorldCamera.instance.shake(new CameraShakeValues(0.5, 1));
                   WorldCamera.instance.setTarget(this.landingPlanet.planet.transform, new Laya.Vector3(0, 60, 6), 1, 1);
               }
            }
        }
        if(this._landablePlanets)
        {
            this._landablePlanets.forEach(planetObj => {
                planetObj.update();
            });
        }
        if(this.landingPlanet){
            this.landingPlanet.update();
        }
    }

    private instantiatePlanets():void
    {
        //实例化当前星系星球，按关卡配置顺序
        this._solarPlanets = [];
        this._landablePlanets = [];
        for(var i:number=0; i<Constants.LandablePlanetCount; i++)
        {
            let planetObj:PlanetObject = new PlanetObject();
            let planetId:number = UserData.instance.levelData.planetList[i];
            planetObj.load(i, planetId);
            this._solarPlanets.push(planetObj);
        }
    }
    
    private initOriginPlanet():void
    {
        //出发星球
        this._originPlanet = new OriginPlanet();
        let oPlanet:Laya.Sprite3D = ResourceManager.instance.getOriginPlanet();
        this._originPlanet.load(oPlanet);
    }

    private setPlanets():void
    {
        //根据当前关卡进度，设置星球顺序
        let curLandPlanetIdx = UserData.instance.landPlanetIndex;
        if(curLandPlanetIdx >= 0)
        {
            this._originPlanet.changeRealPlanet( UserData.instance.levelData.planetList[curLandPlanetIdx] );

            let firstPlanetIdx:number = (curLandPlanetIdx+1)%Constants.LandablePlanetCount;
            let temp = this._solarPlanets.concat();
            let behinds:Array<PlanetObject> = temp.splice(firstPlanetIdx);
            this._landablePlanets = behinds.concat(temp);
        }else{
            this._originPlanet.changeRealPlanet( UserData.instance.levelData.originPlanetId );
            this._landablePlanets = this._solarPlanets.concat();
        }
        //设置星球分布
        let zeroVec:Laya.Vector3 = new Laya.Vector3(0,0,0);
        let levelFirstDiff:number = 0;//index*7
        let levelDistanceDiff:number = 0;//index*5
        zeroVec.z = Constants.FirstPlanetHeight + levelFirstDiff;
        // zeroVec.y = -15;
        zeroVec.y = -3;
        let flag:boolean = Math.random() > 0.5;
        let leftDistance:number = UserData.instance.levelDistance - UserData.instance.levelFlewDistance;
        for(var i:number=0; i<this._landablePlanets.length; i++)
        {
            //过关线附近 不产生星球 -- 仍要产生
            // if(zeroVec.z >= leftDistance - 100)
            // {
            //     this._landablePlanets.splice(i);
            //     break;
            // }
            let planetObj = this._landablePlanets[i];
            planetObj.planet.transform.position = zeroVec.clone();
            SceneController.instance.addPlanetComponet(planetObj.planet);

            flag = !flag;
            planetObj.setFlyByPosition(flag);

            zeroVec.z += Constants.PlanetDistance + levelDistanceDiff;
        }
    }

	public setLandingPlanet():void
	{
        let planetObj = this._landablePlanets[0];
        for(var i:number=0; i<this._landablePlanets.length; i++)
        {
            let shipPosi = SpaceshipMaster.instance.rokectPosition;
            let planetPosition = this._landablePlanets[i].planetPosition;

            let dis0:number = Laya.Vector3.distanceSquared(shipPosi, planetPosition);
            let dis1:number = Laya.Vector3.distanceSquared(shipPosi, planetObj.planetPosition);

            if(dis0 < dis1)
            {
                planetObj = this._landablePlanets[i];
            }
        }
        this.landingPlanet = planetObj;
	}
}