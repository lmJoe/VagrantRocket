import Mathf from "../utils/Mathf";
import WorldCamera from "../camera/WorldCamera";
import DTime from "../utils/DTime";

/*
* 飞船碎片;
*/
export default class SpaceShipDebris{
    constructor(){
    }

    private _debris:Laya.Sprite3D;
    private _rotateSpeed:number;
    private _moveSpeed:Laya.Vector3;

    public load(obj:Laya.Sprite3D):void
    {
        this._debris = obj;

        this._rotateSpeed = Mathf.range(1,3);

        let targetPos = WorldCamera.instance.camera.transform.position.clone();
        let xx = Mathf.range(-100,100);
        let zz = Mathf.range(-50,50);
        targetPos.x += xx;
        targetPos.z += zz;
        let speed = new Laya.Vector3(0,0,0);
        Laya.Vector3.subtract(targetPos, this._debris.transform.position, speed);
        Laya.Vector3.normalize(speed, speed);
        this._moveSpeed = speed;
    }

    public update():void
    {
        this.rotate();
        this.move();
    }

    private rotate():void
    {
        let temp = this._debris.transform.localRotationEuler;
        temp.x += this._rotateSpeed;
        this._debris.transform.localRotationEuler = temp;
    }

    private move():void
    {
        let temp = this._moveSpeed.clone();
        Laya.Vector3.scale(temp, DTime.deltaTime*18, temp);
        Laya.Vector3.add(this._debris.transform.position, temp, temp);
        this._debris.transform.position = temp;
    }

    public clear():void
    {
        this._debris.active = false;
        this._debris.removeSelf();
    }
}