import Mathf from "../utils/Mathf";
import Constants from "../model/Constants";
import DTime from "../utils/DTime";
import SceneController from "../scene/SceneController";
import Util from "../utils/Util";
import ResourceManager from "../ctrl/ResourceManager";

/*
* 星际飞船;
*/
export default class GalaxyShip
{
    constructor(){
    }

    private static _instance:GalaxyShip;
    public static get instance():GalaxyShip
    {
        if(!this._instance)
        {
            this._instance = new GalaxyShip();
        }
        return this._instance;
    }

    private _ship:Laya.Sprite3D;
    private _shipTrail:Laya.TrailSprite3D;
    private _inFlying:boolean;
    private _flyTimer:number;

    private _flyStartPos:Laya.Vector3;
    private _flyTargetPos:Laya.Vector3;
    private _flyCtrlPos:Laya.Vector3;

    private _rotationSpeed:number; 
    private _flyTotalTime:number;
    
    public get shipFlying():boolean
    {
        return this._inFlying;
    }

    public get shipPositon():Laya.Vector3
    {
        return this._ship.transform.position.clone();
    }

    public get ship():Laya.Sprite3D
    {
        return this._ship;
    }

    public init(shipObj:Laya.Sprite3D):void
    {
        this._ship = shipObj;
        this._ship.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        this._ship.transform.rotationEuler = new Laya.Vector3(0,0,0);
        this._ship.transform.localScale = new Laya.Vector3(0.03,0.03,0.03);
        this._ship.active = false;

        this.createTrail();

        this._inFlying = false;
        this._rotationSpeed = 20;
    }

    private createTrail():void
    {
        let modelTrail = ResourceManager.instance.getHeadTaril();
        this._shipTrail = new Laya.TrailSprite3D();
        this._shipTrail.trailFilter.time = 2.7;
        this._shipTrail.trailFilter.minVertexDistance = 0.01;
        this._shipTrail.trailFilter.widthMultiplier = 0.03;
        this._shipTrail.trailFilter.widthCurve = modelTrail.trailFilter.widthCurve;
        // trial.trailFilter.colorGradient = this._trail.trailFilter.colorGradient;
        this._ship.addChild(this._shipTrail);

        this._shipTrail.active = false;
    }

    public launch(startPos:Laya.Vector3, targetPos:Laya.Vector3):void
    {
        this._flyStartPos = startPos;
        this._flyTargetPos = targetPos;
        this.getCtrlPos();
        
        SceneController.instance.clearShipParent();
        SceneController.instance.addShipComponet(this._ship);
        this._ship.transform.position = startPos;
        this._ship.active = true;
        
        this._inFlying = true;
        this._flyTimer = 0;

        Laya.timer.clear(this, this.onNext);
        Laya.timer.frameOnce(1, this, this.onNext);
    }
    
    private onNext():void
    {
        if(!this._shipTrail)
        {
            this.createTrail();
        }
        this._shipTrail.active = true;
    }

    private getCtrlPos():void
    {
        let diffX = this._flyTargetPos.x-this._flyStartPos.x;
        let diffY = this._flyTargetPos.y-this._flyStartPos.y;

        let k = diffY / diffX;
        let b = this._flyStartPos.y - k*this._flyStartPos.x;

        let dk = -1 / k;
        let midPosX = 0.5*(this._flyTargetPos.x+this._flyStartPos.x);
        let midPosY = 0.5*(this._flyTargetPos.y+this._flyStartPos.y);
        let db = midPosY - dk*midPosX;

        let dis = Math.sqrt(diffY*diffY + diffX*diffX);
        let offset = Mathf.rangeWithInvert(0.5*dis, dis);
        this._flyCtrlPos = new Laya.Vector3(0,0,0);
        if( Math.abs(dk) > 1)
        {
            this._flyCtrlPos.y = midPosY + offset;
            this._flyCtrlPos.x = (this._flyCtrlPos.y-db) / dk;
        }else{
            this._flyCtrlPos.x = midPosX + offset;
            this._flyCtrlPos.y = this._flyCtrlPos.x*dk + db;
        }

        this._flyTotalTime = Constants.GalaxyShipGravityFlyTime;
    }

    public land():void
    {
        this._inFlying = false;
        this._ship.active = false;

        this._shipTrail.active = false;
        this._shipTrail.removeSelf();
        this._shipTrail.transform._setParent(null);
        this._shipTrail.destroy(true);
        this._shipTrail = null;

        SceneController.instance.clearShipParent();
    }

	public update():void
	{
        if(this._inFlying)
        {
            this.doFly();
        }
    }

    private doFly():void
    {   
        this._flyTimer += DTime.deltaTime/this._flyTotalTime;
        if(this._flyTimer <= 1)
        {
            let flyPos2 = Util.bezierCurve(this._flyTimer, this._flyStartPos.x, this._flyStartPos.y, this._flyCtrlPos.x, this._flyCtrlPos.y, this._flyTargetPos.x, this._flyTargetPos.y);
            let curPos = this._ship.transform.position.clone();
            let flyPos3 = new Laya.Vector3(flyPos2.x, flyPos2.y, curPos.z);

            let directionVec = new Laya.Vector3(0,0,0);
            Laya.Vector3.lerp(curPos, flyPos3, this._rotationSpeed*DTime.deltaTime, directionVec);
            let temp = new Laya.Vector3(0,0,0);
            Laya.Vector3.subtract(directionVec, curPos, temp);
            Laya.Vector3.subtract(curPos, temp, temp);
            this._ship.transform.lookAt(temp, new Laya.Vector3(0,1,0), false);

            this._ship.transform.position = flyPos3;
        }
    }
}