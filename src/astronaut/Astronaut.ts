import DTime from "../utils/DTime";
import Mathf from "../utils/Mathf";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import PlanetManager from "../planet/PlanetManager";
import WorldCamera from "../camera/WorldCamera";
import Constants from "../model/Constants";

/*
* 宇航员;
*/
export default class Astronaut
{
    constructor(){
    }

    private static readonly Immortality:number = -10;

    private _astronaut:Laya.Sprite3D;
    private _animator:Laya.Animator;

    private _moveSpeed:number;
    private _lifeTime:number;

    private _floating:boolean;
    private _floatRotateSpeed:number;
    private _floatMoveSpeed:Laya.Vector3;

    public get obj():Laya.Sprite3D
    {
        return this._astronaut;
    }

    public load(astronaut:Laya.Sprite3D):void
    {
        this._astronaut = astronaut;
        this._lifeTime = Astronaut.Immortality;
        this._floating = false;

        this._astronaut.transform.position = new Laya.Vector3(0,0,0);
        this._astronaut.transform.rotation = Laya.Quaternion.DEFAULT.clone();
        this._astronaut.transform.localScale = new Laya.Vector3(1, 1, 1);

        this._animator = (this._astronaut.getChildAt(0) as Laya.Sprite3D).getComponent(Laya.Animator) as Laya.Animator;
    }

    public setLifeTime(second:number):void
    {
        this._lifeTime = second;
    }

    public needRemove():boolean
    {
        return this._lifeTime < 0 && this._lifeTime > Astronaut.Immortality;
    }

    public run(speed:number):void
    {
        this._moveSpeed = speed;
        this._floating = false;
        this._animator.play("pao");
    }

    public idle():void
    {
        this._moveSpeed = 0;
        this._floating = false;
        this._animator.play("idle");
    }

    public float():void
    {
        this._moveSpeed = 0;
        this._floating = true;
        this._animator.play("idle");

        this._floatRotateSpeed = Mathf.range(1,2);

        let targetPos = WorldCamera.instance.camera.transform.position.clone();
        let xx = Mathf.range(-100,100);
        let zz = Mathf.range(-50,50);
        targetPos.x += xx;
        targetPos.z += zz;
        let speed = new Laya.Vector3(0,0,0);
        Laya.Vector3.subtract(targetPos, this._astronaut.transform.position, speed);
        Laya.Vector3.normalize(speed, speed);

        this._floatMoveSpeed = speed;
    }

    public update():void
    {
        if ( this._moveSpeed > 0 )
		{
            let pos:Laya.Vector3 = this._astronaut.transform.position.clone();
            let forward:Laya.Vector3 = new Laya.Vector3(0,0,0);
            this._astronaut.transform.getForward(forward);
            Laya.Vector3.scale(forward, -1*this._moveSpeed*DTime.deltaTime, forward);
            Laya.Vector3.add(pos, forward, pos);
            this._astronaut.transform.position = pos;
        }
        if(this._floating)
        {
            this.floatRotate();
            this.floatMove();
        }
        if(this._lifeTime > Astronaut.Immortality)
        {
            this._lifeTime -= DTime.deltaTime;
        }
    }

    private floatRotate():void
    {
        let temp = this._astronaut.transform.localRotationEuler;
        temp.x += this._floatRotateSpeed;
        this._astronaut.transform.localRotationEuler = temp;
    }

    private floatMove():void
    {
        let temp = this._floatMoveSpeed.clone();
        Laya.Vector3.scale(temp, DTime.deltaTime*Constants.AstronautFloatSpeed, temp);
        Laya.Vector3.add(this._astronaut.transform.position, temp, temp);
        this._astronaut.transform.position = temp;
    }

    public clear():void
    {
        this._astronaut.removeSelf();
        this._astronaut.transform._setParent(null);
        this._astronaut.destroy(true);
    }

    public onLand():void
    {
        this.run(0);
        // this.idle();
    }
    
    private doPlanetMove(movePos:Laya.Vector3):void
    {
        //贴着球面走
        this.calcPosition(movePos);
        //站立在球面上
        this.calcRotation();
    }   
    
    private calcPosition(movePos:Laya.Vector3):void
    {
        if(!PlanetManager.instance.landingPlanet){
            return;
        }

        let targetPos:Laya.Vector3 = this._astronaut.transform.position.clone();
        Laya.Vector3.add(targetPos, movePos, targetPos);

        let planetPos = PlanetManager.instance.landingPlanet.planetPosition;
        let planetRadius = PlanetManager.instance.landingPlanet.planetRadius;
        let temp = new Laya.Vector3(0,0,0);
        Laya.Vector3.subtract(targetPos, planetPos, temp);
        let len = Laya.Vector3.distance(temp, new Laya.Vector3(0,0,0));
        let rate = Math.min(1, planetRadius/len);
        Laya.Vector3.scale(temp, rate, temp);
        Laya.Vector3.add(planetPos, temp, temp);
        //
        this._astronaut.transform.position = temp;
    }

    private calcRotation():void
    {
        let forward:Laya.Vector3 = new Laya.Vector3(0,0,0);
        this._astronaut.transform.getForward(forward);
        let temp:Laya.Vector3 = new Laya.Vector3(-forward.x, -forward.y, -forward.z);
        let tempQua:Laya.Quaternion = Laya.Quaternion.DEFAULT.clone();
        Laya.Quaternion.rotationLookAt(temp, new Laya.Vector3(0,1,0), tempQua);
        this._astronaut.transform.rotation = tempQua;
    }

    
    public alignToPlanet(target:Laya.Transform3D):void
	{
		// Vector3 normalized = (target.position - base.transform.position).normalized;
		// float trueRandomFloat = Constants.GetTrueRandomFloat(0f, 360f);
		// base.transform.Rotate(0f, trueRandomFloat, 0f, Space.Self);
		// if (Physics.Raycast(base.transform.position + base.transform.up * 0.1f, normalized, out RaycastHit hitInfo, 10f, 1 << LayerMask.NameToLayer("Planet")))
		// {
		// 	base.transform.position = hitInfo.point;
		// }
	}
}