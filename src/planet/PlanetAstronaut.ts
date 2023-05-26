import AstronautManager from "../astronaut/AstronautManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import PlanetManager from "./PlanetManager";
import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";

/*
* 宇航员临时星球;
*/
export default class PlanetAstronaut
{
    constructor(){
	}
	
	private _astronautSprite:Laya.Sprite3D;
	private _curAngle:number;
	private _axis:Laya.Vector3;

	private _sp:Laya.Sprite3D;
	private _index:number;

    public init(sp:Laya.Sprite3D, index:number):void
    {
		this._sp = sp;
		this._index = index;
		this.initAstronaut();
		this.initRotate();
    }

    private initAstronaut():void
    {
        let astronaut = AstronautManager.instance.creatAstronsut();
		this._astronautSprite = new Laya.Sprite3D();
		this._astronautSprite.addChild(astronaut.obj);
		let localEuler = astronaut.obj.transform.localRotationEuler;
		localEuler.x += 90;
		astronaut.obj.transform.localRotationEuler = localEuler;

		this._sp.addChild(this._astronautSprite);
        this._astronautSprite.transform.localPosition = SpaceshipMaster.instance.rokect.transform.localPosition.clone();
        let scalxNum = PlanetManager.instance.landingPlanet.scalxNum;
		//初始缩放
		astronaut.obj.transform.localScale = new Laya.Vector3(2/scalxNum, 2/scalxNum, 2/scalxNum);
		// astronaut.obj.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
		//初始旋转角度
		let euler = SpaceshipMaster.instance.rokect.transform.rotationEuler.clone();
		this._astronautSprite.transform.rotationEuler = euler;

		// let ve = this._astronautSprite.transform.rotationEuler;
        // ve.x = 180;
        // ve.y = 90;
        // ve.z = 90;
		// this._astronautSprite.transform.rotationEuler = ve;

		// let pos = PlanetManager.instance.landingPlanet.planetPosition;
		// let radis = PlanetManager.instance.landingPlanet.planetRadius;
		// this._astronautSprite.transform.position = new Laya.Vector3(pos.x , pos.y, pos.z+radis);
	}
	
	private initRotate():void
	{
		this._curAngle = Mathf.range(0, 360);
		let rx = Mathf.range(-1, 1);
		let ry = Mathf.range(-1, 1);
		let rz = Mathf.range(-1, 1);
		switch(this._index%4)
		{
			case 0:
				rx = Math.abs(rx);
				ry = Math.abs(ry);
				break;
			case 1:
				rx = -1*Math.abs(rx);
				ry = Math.abs(ry);
				break;
			case 2:
				rx = Math.abs(rx);
				ry = -1*Math.abs(ry);
				break;
			case 3:
				rx = -1*Math.abs(rx);
				ry = -1*Math.abs(ry);
				break;

		}
		this._axis = new Laya.Vector3(rx, ry, rz);
	}

	public update():void
	{
		let qqq = Laya.Quaternion.DEFAULT.clone();
		Laya.Quaternion.createFromAxisAngle(this._axis, this._curAngle, qqq);
		Laya.Quaternion.slerp(this._sp.transform.rotation, qqq, 0.05*DTime.deltaTime, qqq);
		this._sp.transform.rotation = qqq;

		this._curAngle += 0.001;

        let forward:Laya.Vector3 = new Laya.Vector3(0,0,0);
        this._astronautSprite.transform.getForward(forward);
		let pos:Laya.Vector3 = this._astronautSprite.transform.position.clone();
		let temp = new Laya.Vector3(0,0,0);
		Laya.Vector3.add(pos, forward, temp);
		this._astronautSprite.transform.lookAt(temp, new Laya.Vector3(0,-1,0), false); 
	}

	public clear():void
	{
		this._sp.removeSelf();
		this._sp.removeChildren();
		this._sp = null;
	}
}