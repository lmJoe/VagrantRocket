import ResourceManager from "./ResourceManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import DTime from "../utils/DTime";
import AstronautManager from "../astronaut/AstronautManager";
import SceneController from "../scene/SceneController";
import NationManager from "./NationManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* 发射平台管理;
*/
export default class ShaftManager{
    constructor(){
    }

    private static _instance:ShaftManager;
    public static get instance():ShaftManager
    {
        if(!this._instance)
        {
            this._instance = new ShaftManager();
        }
        return this._instance;
    }

    private readonly UpdateTime:number = 0.4;
    private readonly BaseHeight:number = 10.0;

    private _shaft:Laya.Sprite3D;
    private _platform:Laya.Sprite3D;

    private originPos:Laya.Vector3;
    private targetPos:Laya.Vector3;

    private moveTimer:number;

    private _astronautTarget:Laya.Sprite3D;
    private _flag:Laya.MeshSprite3D;

    public start():void
    {
        this._platform = ResourceManager.instance.getPrefabByName("Platform");
        this._shaft = this._platform.getChildByName("Shaft") as Laya.Sprite3D;
        this.originPos = this._shaft.transform.localPosition.clone();

        this._astronautTarget = this._shaft.getChildByName("astronaut") as Laya.Sprite3D;
        this._astronautTarget.active = false;

        let nationalFlag = this._shaft.getChildByName("NationalFlag") as Laya.Sprite3D;
        this._flag = nationalFlag.getChildByName("flag") as Laya.MeshSprite3D;
        this.updateFlag();

        GameEventMgr.instance.addListener(GameEvent.OnNationChange, this, this.updateFlag);
    }

    public update():void
    {
        this.moveShaft();
    }

    private moveShaft():void
    {
        if(this.targetPos)
        {
            if(this.moveTimer < 1)
            {
                this.moveTimer = DTime.deltaTime/this.UpdateTime;
                let tempVec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
                Laya.Vector3.lerp(this._shaft.transform.localPosition, this.targetPos, this.moveTimer, tempVec3);

                this._shaft.transform.localPosition = tempVec3;
            }else{
                this._shaft.transform.localPosition = this.targetPos;
                this.targetPos = null;
            }
        }
    }

    public updateShaft():void
    {
        let scaleZ:number = this._platform.transform.localScaleZ;
        let shipHeight:number = SpaceshipMaster.instance.spaceship.shipHeight;
        let diff:number = shipHeight - this.BaseHeight - 3;
        let diffVec3:Laya.Vector3 = this.originPos.clone();
        diffVec3.z += diff/scaleZ;

        this.targetPos = diffVec3;
        this.moveTimer = 0;
    }

    public addAstronaut():void
	{
        let astronaut = AstronautManager.instance.creatAstronsut();
        this._shaft.addChild(astronaut.obj);
        astronaut.obj.transform.position = this._astronautTarget.transform.position.clone();
        let targetScale = this._astronautTarget.transform.localScale.clone();
        Laya.Vector3.scale(targetScale, 2, targetScale);
        astronaut.obj.transform.localScale = targetScale
        astronaut.obj.transform.rotation = this._astronautTarget.transform.rotation.clone();

        astronaut.run(1.2);//5
        astronaut.setLifeTime(2.5);
    }

    public updateFlag():void
    {   
        NationManager.instance.setFlagSkin(this._flag);
    }
    
}