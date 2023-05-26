import CameraShakeValues from "./CameraShakeValues";
import ResourceManager from "../ctrl/ResourceManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import Constants from "../model/Constants";
import GameEvent from "../event/GameEvent";
import GameEventMgr from "../event/GameEventMgr";
import SpaceshipManager from "../ship/SpaceshipManager";
import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";
import { SpaceshipState } from "../model/GameModel";
import BoostRankValue from "../boost/BoostRankValue";

/*
* 游戏相机;
*/
export default class WorldCamera{
    constructor(){
    }

    private static _instance:WorldCamera;
    public static get instance():WorldCamera
    {
        if(!this._instance)
        {
            this._instance = new WorldCamera();
        }
        return this._instance;
    }

    private readonly WaitingOffset:Laya.Vector3 = new Laya.Vector3(0, 80, -8);
    private readonly IgnitingOffset:Laya.Vector3 = new Laya.Vector3(0, 70, 30);//15
    private readonly FlyOffset:Laya.Vector3 = new Laya.Vector3(0, 80, 30);//15
    private readonly BoosteOffset:Laya.Vector3 = new Laya.Vector3(0, 125, 10);//0
    private readonly LandingOffset:Laya.Vector3 = new Laya.Vector3(0, 180, 0);//200
    private readonly ShengjiOffset:Laya.Vector3 = new Laya.Vector3(0, 40, 15);

    private readonly CameraRotation:Laya.Vector3 = new Laya.Vector3(-80, 0, 180);

    private readonly WaitingSpeed:Laya.Vector2 = new Laya.Vector2(4, 2);
    private readonly IgnitingSpeed:Laya.Vector2 = new Laya.Vector2(1, 0.8);
    private readonly FlySpeed:Laya.Vector2 = new Laya.Vector2(3.2, 0.8);
    private readonly BoosteSpeed:Laya.Vector2 = new Laya.Vector2(5.5, 5);
    private readonly LandingSpeed:Laya.Vector2 = new Laya.Vector2(2, 1);
    private readonly ShengjiSpeed:Laya.Vector2 = new Laya.Vector2(1, 0.9);

    public camera:Laya.Camera;
    private _moveNode:Laya.Transform3D;
    private _targetFOV:number;

    private _targetTransform:Laya.Transform3D;
    private _targetOffset:Laya.Vector3;
    private _moveXZSpeed:number;
    private _moveYSpeed:number;

    private _origPos:Laya.Vector3;
    private _shakeValues:CameraShakeValues;
    private _shakeTimer:number;

    private _originPos:Laya.Vector3;

    private _inLastBoost:boolean;

    public start():void
    {
        this.camera = ResourceManager.instance.getSolarCamera();
        this.camera.clearColor = null;
        this.camera.clearFlag = Laya.Camera.CLEARFLAG_DEPTHONLY;
        this._originPos = this.camera.transform.position.clone();
        this.camera.transform.position = new Laya.Vector3(0,0,0);

        let gameObj:Laya.Sprite3D = new Laya.Sprite3D("CameraMoveNode");
        this._moveNode = gameObj.transform;
        this.camera.transform._setParent(this._moveNode);

        this.reset();

        GameEventMgr.instance.addListener(GameEvent.OnLastBoostUsed, this, this.onLastBoostUsed);
    }

    public hide():void
    {
        this.camera.active = false;
    }

    public show():void
    {
        this.camera.active = true;
    }

    public reset():void
    {
        this._moveNode.position = this._originPos.clone();

        this.showWaiting();
        this._targetFOV = this.camera.fieldOfView;
        if (Constants.AccessingSolarSystem)
		{
            let posi:Laya.Vector3 = this._moveNode.position;
            posi.y = 150;
            this._moveNode.position = posi;
        }

        this._inLastBoost = false;
        this._shakeValues = null;
    }

    public forceReset():void
    {
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.FlyOffset, this.FlySpeed.x, this.FlySpeed.y);
        let target:Laya.Vector3 = SpaceshipMaster.instance.rokect.transform.position.clone();
        target.y = this.FlyOffset.y;
        this.jumpToTarget(target);
    }

    public startShengji():void
    {
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.ShengjiOffset, this.ShengjiSpeed.x, this.ShengjiSpeed.y);
    }
    
    public showWaiting():void
    {
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.WaitingOffset, this.WaitingSpeed.x, this.WaitingSpeed.y);
    }

    public showIgniting():void
    {
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.IgnitingOffset, this.IgnitingSpeed.x, this.IgnitingSpeed.y);
    }

    public showFlying():void
    {
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.FlyOffset, this.FlySpeed.x, this.FlySpeed.y);
    }

    public jumpToTarget(targetVec3:Laya.Vector3):void
    {
        this._moveNode.position = targetVec3;
    }

    public setTarget(target:Laya.Transform3D, offset:Laya.Vector3, xzSpeed:number, ySpeed:number):void
    {
        this._targetTransform = target;
        this._targetOffset = offset;
        this._moveXZSpeed = xzSpeed;
        this._moveYSpeed = ySpeed;
    }

    private onLastBoostUsed():void
    {
        this._inLastBoost = true;
        this.setTarget(SpaceshipMaster.instance.rokect.transform, this.LandingOffset, this.LandingSpeed.x, this.LandingSpeed.y);
    }

    public update():void
    {
        this.cameraPosition();
        if(this._shakeValues)
        {
            this.shakeCamera();
        }
    }

    private cameraPosition():void
    {
        let vec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
        Laya.Vector3.add(this._targetTransform.position, this._targetOffset, vec3);
        let posi:Laya.Vector3 = this._moveNode.position.clone();

        posi.x = Mathf.lerp(posi.x, vec3.x, DTime.deltaTime*this._moveXZSpeed);
        posi.z = Mathf.lerp(posi.z, vec3.z, DTime.deltaTime*this._moveXZSpeed);
        posi.y = Mathf.lerp(posi.y, vec3.y, DTime.deltaTime*this._moveYSpeed);

        this._moveNode.position = posi;
    }

    public doBooste(isLast:boolean, boostValues:BoostRankValue):void
    {
        this.shake(boostValues.cameraShake);
        if(!isLast)
        {
            let rangeY:number = Math.max(this.WaitingOffset.y, boostValues.value*this.BoosteOffset.y);
            let boosteOffset:Laya.Vector3 = new Laya.Vector3(this.BoosteOffset.x, rangeY, this.BoosteOffset.z)
            this.setTarget(SpaceshipMaster.instance.rokect.transform, boosteOffset, this.BoosteSpeed.x, this.BoosteSpeed.y);
            
            Laya.timer.clear(this, this.boosteEnd);
            Laya.timer.once(1000, this, this.boosteEnd);
        }
    }

    private boosteEnd():void
    {
        this.showFlying();
    }

    public shake(values:CameraShakeValues):void
    {
		if (!(values.power <= 0) && !(values.time <= 0))
		{
            this._shakeValues = values;
            this._shakeTimer = 0;
            this._origPos = this._moveNode.position;
		}
    }
    
    private shakeCamera():void
	{
        if(this._shakeTimer <= 1)
        {
            let damp = 1 - this._shakeTimer;
            
            let xxx = Mathf.range(0-this._shakeValues.power, this._shakeValues.power) * damp;
            let yyy = Mathf.range(0-this._shakeValues.power, this._shakeValues.power) * damp;
            let zzz = Mathf.range(0-this._shakeValues.power, this._shakeValues.power) * damp;

            this._moveNode.position = new Laya.Vector3(this._origPos.x+xxx, this._origPos.y+yyy, this._origPos.z+zzz);
            this._shakeTimer += DTime.deltaTime / this._shakeValues.time;

        }else{
            this._moveNode.position = this._origPos;
            this._shakeValues = null;
        }
	}
}