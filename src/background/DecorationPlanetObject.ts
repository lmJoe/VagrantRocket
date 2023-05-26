import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";
import { DecorationPlanetType } from "../model/GameModel";
import SceneController from "../scene/SceneController";

/*
* 背景星球、小行星;
*/
export default class DecorationPlanetObject{
    constructor(){
    }

    private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(15,22);
    private readonly PosXMinMax:Laya.Vector2 = new Laya.Vector2(-40,40);
    private readonly PosYMinMax:Laya.Vector2 = new Laya.Vector2(-50,-80);
    private readonly RotationMinMax:Laya.Vector2 = new Laya.Vector2(5,10);
    private readonly WorldRotationRadiusMinMax:Laya.Vector2 = new Laya.Vector2(100,100);
    private readonly WorldRotationSpeedMinMax:Laya.Vector2 = new Laya.Vector2(0.3, 0.5);

    private _planet:Laya.MeshSprite3D;
    private _type:DecorationPlanetType;

	private _totateVec3:Laya.Vector3;
	private _worldRotationSpeed:number;
	private _worldRotatePoint:Laya.Vector3;

	private _ppNode:Laya.Transform3D;

    public load(planet:Laya.MeshSprite3D, type:DecorationPlanetType = DecorationPlanetType.Planet):void
    {
        this._planet = planet;
        this._type = type;

        this.instantiatePlanet();

		this._totateVec3 = new Laya.Vector3(0,0,0);
		this._totateVec3.x = Mathf.rangeWithInvert(this.RotationMinMax.x, this.RotationMinMax.y);
		this._totateVec3.y = Mathf.rangeWithInvert(this.RotationMinMax.x, this.RotationMinMax.y);
		this._totateVec3.z = Mathf.rangeWithInvert(this.RotationMinMax.x, this.RotationMinMax.y);

		this._worldRotationSpeed = Mathf.rangeWithInvert(this.WorldRotationSpeedMinMax.x, this.WorldRotationSpeedMinMax.y);
		let radius = Mathf.rangeWithInvert(this.WorldRotationRadiusMinMax.x, this.WorldRotationRadiusMinMax.y);
		this._worldRotatePoint = new Laya.Vector3(0,0,0);
		Laya.Vector3.add(this._planet.transform.position, Mathf.getPointInsideSphere(radius), this._worldRotatePoint);

		//增加父节点位置 为了公转
		let pnode = new Laya.Sprite3D("parentnode");
		this._ppNode = pnode.transform;
		// this._planet.transform._parent = this._ppNode;
		this._planet.transform._setParent(this._ppNode);
		//重置位置 
		this._ppNode.position = new Laya.Vector3(this._worldRotatePoint.x, this._worldRotatePoint.y, 0);
		let vec3:Laya.Vector3 = this._planet.transform.position;
		this._planet.transform.position = new Laya.Vector3(vec3.x-this._worldRotatePoint.x, vec3.y-this._worldRotatePoint.y, vec3.z);

		// let light = new Laya.PointLight();
		// // SceneController.instance.addComponet(light);
		// this._planet.addChild(light);
		// light.transform.position = this._planet.transform.position;
		// light.range = 10;
		// light.color = new Laya.Vector3(1,1,1);

		// m_rb = GetComponentInChildren<Rigidbody>();
		// InstantiatePlanet(random, atmoMul, planetObj);
		// float x = RandomUtils.RangeWithInvert(ref random, m_rotationMinMax.x, m_rotationMinMax.y);
		// float y = RandomUtils.RangeWithInvert(ref random, m_rotationMinMax.x, m_rotationMinMax.y);
		// float z = RandomUtils.RangeWithInvert(ref random, m_rotationMinMax.x, m_rotationMinMax.y);
		// Vector3 a = new Vector3(x, y, z);
		// float d = RandomUtils.RangeWithInvert(ref random, 2f, 5f);
		// m_rb.AddTorque(a * d, ForceMode.Acceleration);
		// float d2 = RandomUtils.RangeWithInvert(ref random, m_worldRotationRadiusMinMax.x, m_worldRotationRadiusMinMax.y);
		// m_worldRotationSpeed = RandomUtils.RangeWithInvert(ref random, m_worldRotationSpeedMinMax.x, m_worldRotationSpeedMinMax.y);
		// m_worldRotatePoint = base.transform.position + RandomUtils.GetPointInsideSphere() * d2;
		// MeshRenderer componentInChildren = m_localRotateNode.GetComponentInChildren<MeshRenderer>();
		// componentInChildren.receiveShadows = false;
		// componentInChildren.shadowCastingMode = ShadowCastingMode.Off;
    }

	private instantiatePlanet():void
	{
        this._planet.transform.localScale = new Laya.Vector3(0,0,0);
        let scaleNum:number = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        this._planet.transform.localScale = new Laya.Vector3(scaleNum,scaleNum,scaleNum);

        let vec3:Laya.Vector3 = this._planet.transform.position;
        vec3.x = Mathf.range(this.PosXMinMax.x, this.PosXMinMax.y);
        vec3.y = Mathf.range(this.PosYMinMax.x, this.PosYMinMax.y);
		this._planet.transform.position = vec3;

        // let planetMaterial:Laya.PBRStandardMaterial = new Laya.PBRStandardMaterial();
		// planetMaterial.albedoColor = new Laya.Vector4(128/255,128/255,128/255,1);
		// planetMaterial.metallic = 1;
		// planetMaterial.smoothness = 0;
		// this._planet.meshRenderer.material = planetMaterial;

		// GameObject gameObject = null;
		// if (m_type == Type.Background)
		// {
		// 	gameObject = Object.Instantiate(planetObj, base.transform.position, Quaternion.identity);
		// }
		// else if (m_type == Type.Asteroid)
		// {
		// 	gameObject = Object.Instantiate(PlanetManager.Planets.GetRandomAsteroid(random), base.transform.position, Quaternion.identity);
		// }
		// gameObject.transform.parent = m_localRotateNode;
		// gameObject.transform.localScale = Vector3.one;
		// float num = RandomUtils.Range(ref random, m_scaleMinMax.x, m_scaleMinMax.y);
		// base.transform.localScale = new Vector3(num, num, num);
		// Vector3 position = base.transform.position;
		// position.x += RandomUtils.Range(ref random, m_posXMinMax.x, m_posXMinMax.y);
		// position.z += RandomUtils.Range(ref random, m_posZMinMax.x, m_posZMinMax.y);
		// base.transform.position = position;
		// if (m_atmosphere != null)
		// {
		// 	PlanetParameters component = gameObject.GetComponent<PlanetParameters>();
		// 	m_atmosphere.material.color = component.m_atmosphereColor * atmoMul;
		// }
	}

	public update():void
	{
		//自转
		if(this._totateVec3){
			let vec3:Laya.Vector3 = this._planet.transform.localRotationEuler;
			vec3.x += DTime.deltaTime * this._totateVec3.x;
			vec3.y += DTime.deltaTime * this._totateVec3.y;
			vec3.z += DTime.deltaTime * this._totateVec3.z;
			this._planet.transform.localRotationEuler = vec3;
		}
		//公转
		if(this._worldRotatePoint)
		{
			let vec333:Laya.Vector3 = this._ppNode.localRotationEuler;
			vec333.z += DTime.deltaTime * this._worldRotationSpeed;
			this._ppNode.localRotationEuler = vec333;
			// this._planet.transform.RotateAround(this._worldRotatePoint, Laya.Vector3.Up, this._worldRotationSpeed * DTime.deltaTime);
		}
	}
}