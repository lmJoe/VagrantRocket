import ResourceManager from "../ctrl/ResourceManager";
import Constants from "../model/Constants";
import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";
import GalaxyManager from "./GalaxyManager";

/*
* 星际相机;
*/
export default class GalaxyCamera{
    constructor(){
    }

    private static _instance:GalaxyCamera;
    public static get instance():GalaxyCamera
    {
        if(!this._instance)
        {
            this._instance = new GalaxyCamera();
        }
        return this._instance;
    }

    private static readonly MoveXYSpeed:number = 0.5;
    private static readonly MoveZSpeed:number = 0.2;
    private static readonly DragXYSpeed:number = 4;
    private static readonly DragZSpeed:number = 2;
    // private static readonly XYDistanceScale:Laya.Vector2 = new Laya.Vector2(0.013, 0.013);
    private static readonly XYDistanceScale:Laya.Vector2 = new Laya.Vector2(0.02, 0.02);
    private static readonly XYDistanceSquareLimit:number = 16;

    private static readonly NearZ:number = -78;//-77.7
    private static readonly FarZ:number = -77.116;

    private _cameraParent:Laya.Sprite3D;
    private _camera:Laya.Camera;

    private _originPos:Laya.Vector3;
    private _targetPos:Laya.Vector3;
    private _targetTransform:Laya.Transform3D;

    private _moveXYSpeed:number;
    private _moveZSpeed:number;


    public get camera():Laya.Camera
    {
        return this._camera;
    }

    public start():void
    {
        this._cameraParent = ResourceManager.instance.getGalaxyCameraParent();
        this._cameraParent.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        this._originPos = this._cameraParent.transform.position.clone();

        this._camera = ResourceManager.instance.getGalaxyCamera();
        this._camera.clearColor = null;
        this.camera.clearFlag = Laya.Camera.CLEARFLAG_DEPTHONLY;

        this._targetPos = null;
    }

    public hide():void
    {
        this._camera.active = false;
    }

    public show():void
    {
        this._camera.active = true;
        //恢复初始位置
        this._targetPos = null;
        this._targetTransform = null;
    }

    private getWatchTargetPos(targetVec3:Laya.Vector3):Laya.Vector3
    {
        targetVec3.y = targetVec3.y + 2;
        targetVec3.z = GalaxyCamera.NearZ;
        return targetVec3;
    }

    public showAllGalaxy():void
    {
        this._cameraParent.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        this._cameraParent.transform.position = this._originPos.clone();
    }

    public jumpToTarget(targetVec3:Laya.Vector3):void
    {
        this._cameraParent.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        this._cameraParent.transform.position = this.getWatchTargetPos(targetVec3);
    }

    public setTargetTransform(target:Laya.Transform3D):void
    {
        this._targetTransform = target;
    }
    
    public clearTargetTransform():void
    {
        this._targetTransform = null;
    }

    public setDragTarget(moveX:number, moveY:number):void
    {
        let posX = this._cameraParent.transform.position.x + moveX*GalaxyCamera.XYDistanceScale.x;
        let posY = this._cameraParent.transform.position.y - moveY*GalaxyCamera.XYDistanceScale.y;
        if(GalaxyManager.instance.disSquareToGalaxyCenter(posX, posY) <= GalaxyCamera.XYDistanceSquareLimit)
        {
            this._moveXYSpeed = GalaxyCamera.DragXYSpeed;
            this._moveZSpeed = GalaxyCamera.DragZSpeed;

            this._targetPos = new Laya.Vector3(0,0,0);
            this._targetPos.x = posX;
            this._targetPos.y = posY;
            this._targetPos.z = this._cameraParent.transform.position.z;
        }
    }

    public update():void
    {
        this.cameraPosition();
    }

    private cameraPosition():void
    {
        if(Constants.AccessingSolarSystem == true)
        {
            return;
        }

        if(this._targetTransform)
        {
            let targetVec3 = this._targetTransform.position.clone();
            this._targetPos = this.getWatchTargetPos(targetVec3);
            this._moveXYSpeed = GalaxyCamera.MoveXYSpeed;
            this._moveZSpeed = GalaxyCamera.MoveZSpeed;
        }

        if(this._targetPos)
        {
            let posi:Laya.Vector3 = this._cameraParent.transform.position.clone();
            posi.x = Mathf.lerp(posi.x, this._targetPos.x, DTime.deltaTime*this._moveXYSpeed);
            posi.y = Mathf.lerp(posi.y, this._targetPos.y, DTime.deltaTime*this._moveXYSpeed);
            posi.z = Mathf.lerp(posi.z, this._targetPos.z, DTime.deltaTime*this._moveZSpeed);
            this._cameraParent.transform.position = posi;
        }
    }
}