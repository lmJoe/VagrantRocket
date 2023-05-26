import Spaceship from "./Spaceship";
import SceneController from "../scene/SceneController";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ResourceManager from "../ctrl/ResourceManager";
import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";
import SpaceshipManager from "./SpaceshipManager";
import PlanetManager from "../planet/PlanetManager";
import Constants from "../model/Constants";
import { FlightEndCause, SpaceshipState, BoostRank } from "../model/GameModel";
import UIManager from "../ctrl/UIManager";
import ShaftManager from "../ctrl/ShaftManager";
import SpaceShipDebris from "./SpaceShipDebris";
import UserData from "../data/UserData";
import BoostMeterManager from "../ctrl/BoostMeterManager";
import AstronautManager from "../astronaut/AstronautManager";
import MergeUserData from "../merge/data/MergeUserData";
import SpaceShipSFX from "./SpaceShipSFX";
import WorldCamera from "../camera/WorldCamera";

/*
* 飞船控制;
*/
export default class SpaceshipMaster{
    constructor(){
    }

    private static _instance:SpaceshipMaster;
    public static get instance():SpaceshipMaster
    {
        if(!this._instance)
        {
            this._instance = new SpaceshipMaster();
        }
        return this._instance;
	}
	
	public readonly IgnitionTime:number = 4;//1.5
	private readonly IncreaseTime:number = 3;//5.5
    private readonly LaunchPosition:Laya.Vector3 = new Laya.Vector3(0, 0, -13);

	private _rokect:Laya.MeshSprite3D;
	private _spaceship:Spaceship;

    private _startAltitude:number;

    private _rotationSpeed:number;
	private _flyTimer:number;
	private _dragIncreaseTimer:number;
    private _canRotate:boolean;
	private _boostForce:number;

	public descendSpeed:number;

	/* 飞行 力与速度 */
	//当前速度
	private _currentSpeedVec3:Laya.Vector3;
	//阻力系数
	private _resistance:number;
	//火箭质量
	private _mass:number = 1;

    public get spaceship():Spaceship
    {
        return this._spaceship;
    }

    public get rokect():Laya.Sprite3D
    {
        return this._rokect;
    }

    public get altitude():number
    {
        return this._rokect.transform.position.z - this._startAltitude;
    }

    public get rokectPosition():Laya.Vector3
    {
        return this._rokect.transform.position.clone();
	}
	
    public start():void
    {
		this.resetGame();
        this.addEvents();
	}

	private addEvents():void
	{
		GameEventMgr.instance.addListener(GameEvent.OnLastBoostUsed, this, this.onLastBoostUsed);
		GameEventMgr.instance.addListener(GameEvent.OnFPSLow, this, this.onFPSLow);
	}
	
	private removeEvents():void
	{
		GameEventMgr.instance.removeListener(GameEvent.OnLastBoostUsed, this, this.onLastBoostUsed);
		GameEventMgr.instance.removeListener(GameEvent.OnFPSLow, this, this.onFPSLow);
	}

	public restart():void
	{
		this.resetGame();
	}

	private resetGame():void
	{
		this.resetRokect();
		this._canRotate = false;
	}

	private resetRokect():void
	{
		if(!this._rokect)
		{
			this._rokect = new Laya.MeshSprite3D();
			this._rokect.name = "Rocket";
		}
		if(!this._rokect.parent){
			SceneController.instance.addShipComponet(this._rokect);
		}
		this.rokect.transform._setParent(null);
		this._rokect.transform.position = new Laya.Vector3(0,0,0);
		this._rokect.transform.rotation = Laya.Quaternion.DEFAULT.clone();
		this._rokect.transform.localScale = new Laya.Vector3(1,1,1);

		// this._rokect.removeChildren();

		this.instantiateShip();
		this.alignToLaunchPosition();

		this._startAltitude = this._rokect.transform.position.z;

		this._flyTimer = 0;
		this._dragIncreaseTimer = 0;
		this._rotationSpeed = 0;

		this._currentSpeedVec3 = new Laya.Vector3(0, 0, 1);
		this._resistance = Constants.FlyResistance;
	}

    private instantiateShip():void
    {
		if(this._spaceship)
		{
			this._spaceship.destorySelf();
			this._spaceship = null;
		}
        this._spaceship = new Spaceship();
		this._spaceship.load( MergeUserData.instance.rocketInfo );
		this._rokect.addChild(this._spaceship.shipObj);
	}
	
	public clearRocketFX():void
	{
		if(this._spaceship)
		{
			// this._spaceship.destoryPods();
			this._spaceship.destorySelf();
			this._spaceship = null;
		}
		SpaceShipSFX.instance.stopEngine();
	}

    public setPodCount(num:number):void
    {
        this._spaceship.setPodCount(num);
		this.alignToLaunchPosition();
    }

    public alignToLaunchPosition():void
    {
        //竖直方向找对位置
        let boundsBottom:Laya.Vector3 = this._spaceship.getBoundsBottom();
        let vec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.subtract(this.LaunchPosition, boundsBottom, vec3);
		Laya.Vector3.add(this.rokect.transform.position.clone(), vec3, vec3);
		this._rokect.transform.position = vec3;
		//支架同步移动
		ShaftManager.instance.updateShaft();

		this.realignPivot();
		this._startAltitude = this._rokect.transform.position.z;
    }

	private realignPivot():void
	{
		let boundsCenter:Laya.Vector3 = this._spaceship.getBoundsCenter();
        this._spaceship.shipObj.removeSelf();
        this._rokect.transform.position = boundsCenter;
		this._rokect.addChild(this._spaceship.shipObj);
	}

    public launch():void
	{
		this._spaceship.onLaunch();
		SpaceShipSFX.instance.startIgnition();
		SpaceShipSFX.instance.startEngine();

		this.doIgnite();
        GameEventMgr.instance.Dispatch(GameEvent.OnLaunched);
	}

	private doIgnite():void
	{
		Laya.timer.clear(this,this.evaluateIgnition);
		Laya.timer.frameLoop(1,this,this.evaluateIgnition);
	}

	private evaluateIgnition()
	{	
		this._canRotate = true;
		if(this._flyTimer < 1)
		{
			//起飞时，转弯速度小
			this._rotationSpeed = Mathf.curveEvaluate(this._flyTimer, Constants.RotateSpeedIgnite, 0);
			this._flyTimer += DTime.deltaTime/this.IgnitionTime;
			return;
		}
		this._flyTimer = 1;
		SpaceshipManager.instance.state = SpaceshipState.Flying;
		WorldCamera.instance.showFlying();
		//飞行中，转弯速度中
		this._rotationSpeed = Constants.RotateSpeedFly;
		Laya.timer.clear(this,this.evaluateIgnition);
	}

    public update():void
    {
		if(this._canRotate)
		{
			this.rotateTowardsVelocity();
		}
		if(SpaceshipManager.instance.state == SpaceshipState.Exploded)
		{
			this.updateDebris();
		}else{
			this.clearDebris();
		}

        if (SpaceshipManager.instance.state == SpaceshipState.Flying || SpaceshipManager.instance.state == SpaceshipState.Igniting || SpaceshipManager.instance.state == SpaceshipState.SwitchLevel)
		{
			this.fly();
		}
		else if (SpaceshipManager.instance.state == SpaceshipState.Boosting)
		{
			this.boost();
		}
		this._spaceship.update();
    }

    private fly():void
    {
		let flyByPosition:Laya.Vector3 = PlanetManager.instance.flyByPosition;
		let diffVec:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.subtract(flyByPosition ,this._rokect.transform.position, diffVec);
		let normalized:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.normalize(diffVec, normalized);

		normalized.x *= 1.5;
		normalized.y *= 1.5;

		let flyValue:number = 1;
		if(this._flyTimer < 1)
		{
			flyValue = flyValue * this._flyTimer * 0.5;
		}
		let force:number = Constants.FlyForce*Mathf.curveEvaluate(flyValue, 1, 0);

		this.doMove(force, normalized);
    }

    private boost():void
    {
		let flyByPosition:Laya.Vector3 = PlanetManager.instance.flyByPosition;
		let diffVec:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.subtract(flyByPosition, this._rokect.transform.position, diffVec);
		let normalized:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.normalize(diffVec, normalized);

		normalized.x *= 1.5;
		normalized.y *= 3;

		this.doMove(this._boostForce, normalized);
    }

	public land():void
    {
		let posiVec3:Laya.Vector3 = PlanetManager.instance.landingPlanet.planetPosition;
		let diffVec:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.subtract(posiVec3, this._rokect.transform.position, diffVec);
		let normalized:Laya.Vector3 = new Laya.Vector3(0,1,0);
		Laya.Vector3.normalize(diffVec, normalized);

		this.doMove(Constants.LandForce, normalized);
    }

	private doMove(force:number, normalized:Laya.Vector3):void
	{
		if(SpaceshipManager.instance.flightOnGoing)
		{
			let curSpeednormalized:Laya.Vector3 = new Laya.Vector3(0,0,0);
			Laya.Vector3.normalize(this._currentSpeedVec3, curSpeednormalized); 
			Laya.Vector3.lerp(curSpeednormalized, normalized, DTime.deltaTime*this._rotationSpeed, normalized);
			
			let targetVec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
			Laya.Vector3.scale(normalized, force, targetVec3);

			this.applyForce(targetVec3);
		}
	}

	//默认
	private applyForce(forceVec3:Laya.Vector3):void
	{
		//先计算当前速度的阻力
		let normalized:Laya.Vector3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.normalize(this._currentSpeedVec3, normalized); 
		let v2:number = this._currentSpeedVec3.x*this._currentSpeedVec3.x + this._currentSpeedVec3.y*this._currentSpeedVec3.y + this._currentSpeedVec3.z*this._currentSpeedVec3.z;
		let dragForce = new Laya.Vector3(0,0,0);
		//空气阻力 F=k*v*v
		Laya.Vector3.scale(normalized, -1*this._resistance*v2, dragForce);
		//合力
		Laya.Vector3.add(forceVec3, dragForce, forceVec3);
		// //再计算新力和速度 a=F/m,v=a*t => v=F*t/m
		let forceSpeedVec3 = new Laya.Vector3(0,0,0);
		Laya.Vector3.scale(forceVec3, DTime.deltaTime/this._mass, forceSpeedVec3);
		Laya.Vector3.add(this._currentSpeedVec3, forceSpeedVec3, this._currentSpeedVec3);
		//最后计算新位置 s=v*t
		let movePos = new Laya.Vector3(0,0,0);
		Laya.Vector3.scale(this._currentSpeedVec3, DTime.deltaTime, movePos);
		Laya.Vector3.add(this.rokect.transform.position.clone(), movePos, movePos);
		this.rokect.transform.position = movePos;
	}

    public startBoost(force:number, rank:BoostRank, aotu:boolean):void
	{
		this._boostForce = force;
        this._spaceship.usePod(rank, aotu);
		this.realignPivot();

		SpaceShipSFX.instance.booste(rank);
	}

    public onBoostCompleted(isLastPod:boolean):void
	{
		if(this._spaceship)
		{
			this._spaceship.clearBoosteFx();
		}
		if(isLastPod)
		{
			if(this._spaceship)
			{
				this._spaceship.onLanding();
			}
			SpaceShipSFX.instance.stopEngine();
		}
	}

	
	private onFPSLow():void
	{
		if(this._spaceship)
		{
			this._spaceship.onFPSLow();
		}
	}

	private onLastBoostUsed():void
	{
		this._spaceship.onLastBoostUsed();
		this.doDragIncrease();
	}

	private doDragIncrease():void
	{
		let targetDrag = Constants.LandResistance;
		if(!PlanetManager.instance.isWithinPlanetRange)
		{
			//随机转
			targetDrag = Constants.FloatResistance;
			BoostMeterManager.instance.setEnable(false);
		}
		this._dragIncreaseTimer = 0;

		Laya.timer.clear(this, this.dragIncrease);
		Laya.timer.frameLoop(1, this, this.dragIncrease, [targetDrag]);
	}

	
    private dragIncrease(targetDrag:number):void
	{
		if(this._dragIncreaseTimer <= 1)
		{
			this._resistance = Mathf.lerp(0, targetDrag, this._dragIncreaseTimer);
			this._dragIncreaseTimer += DTime.deltaTime/this.IncreaseTime;

			return;
		}
		this._rotationSpeed = Constants.RotateSpeedLanding;
		Laya.timer.clear(this, this.dragIncrease);
	}

	private rotateTowardsVelocity():void
	{
		if (SpaceshipManager.instance.flightOnGoing)
		{
			let vel = this._currentSpeedVec3.clone();
			Laya.Vector3.normalize(vel,vel);
			// Laya.Vector3.lerp(new Laya.Vector3(0,0,0), vel, this._rotationSpeed*DTime.deltaTime, vel);
			let targetVec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
			Laya.Vector3.subtract(this._rokect.transform.position, vel, targetVec3);
			// Laya.Vector3.lerp(this._rokect.transform.position, targetVec3, this._rotationSpeed*DTime.deltaTime, targetVec3);
			this._rokect.transform.lookAt(targetVec3, new Laya.Vector3(0,1,0), false);

			// let temp:Laya.Vector3 = new Laya.Vector3(this._currentSpeedVec3.x, this._currentSpeedVec3.y, -this._currentSpeedVec3.z);
			// let tempQua1:Laya.Quaternion = Laya.Quaternion.DEFAULT.clone();
			// Laya.Quaternion.rotationLookAt(temp, Laya.Vector3.Up, tempQua1);
			// Laya.Quaternion.slerp(this._rokect.transform.rotation, tempQua1, 5*DTime.deltaTime, tempQua1);
			// this._rokect.transform.rotation = tempQua1;
		}
	}

	public onLand():void
	{
		if (SpaceshipManager.instance.state != SpaceshipState.Landed)
		{
			this._spaceship.onLand();
			PlanetManager.instance.landingPlanet.receiveRokect(this.rokect);
			SpaceShipSFX.instance.onLandedPlanet();
			
			GameEventMgr.instance.Dispatch(GameEvent.OnFlightEnded, [FlightEndCause.Landed]);
		}
	}

	public stayInSpace():void
	{
		GameEventMgr.instance.Dispatch(GameEvent.OnFlightEnded, [FlightEndCause.StayedInSpace]);
		
		console.log("stayInSpace");
	}
	
	public reborn():void
	{
		this._spaceship.shipObj.active = true;
		this._spaceship.onLaunch();

		console.log("reborn");
	}

	public explode():void
	{
		this._spaceship.shipObj.active = false;
		this._spaceship.onExplode();
		this.explodeDebris();
		GameEventMgr.instance.Dispatch(GameEvent.OnFlightEnded, [FlightEndCause.Exploded]);

		SpaceShipSFX.instance.onExplode();

		console.log("explode");
	}

	private _debrisList:Array<SpaceShipDebris>;
	private explodeDebris():void
	{
		this._debrisList = [];
		let num = Mathf.range(3,6);
		for(var i=0 ; i<num; i++)
		{
			let debris = ResourceManager.instance.getDebri();
			SceneController.instance.addShipComponet(debris);
			debris.transform.position = this._rokect.transform.position.clone();
			let shipDebris = new SpaceShipDebris();
			shipDebris.load(debris);

			this._debrisList.push(shipDebris);
		}
	}

	private updateDebris():void
	{
		if(this._debrisList && this._debrisList.length>0)
		{
			this._debrisList.forEach(shipDebris => {
				shipDebris.update();
			});
		}
	}

	private clearDebris():void
	{
		if(this._debrisList && this._debrisList.length>0)
		{
			this._debrisList.forEach(shipDebris => {
				shipDebris.clear();
			});

			this._debrisList.splice(0);
			this._debrisList = null;
		}
	}
    
}