import SpaceshipMaster from "./SpaceshipMaster";
import Mathf from "../utils/Mathf";
import ShipPodData from "../model/ShipPodData";
import GameJsonConfig from "../config/GameJsonConfig";
import ResourceManager from "../ctrl/ResourceManager";
import UserData from "../data/UserData";
import MergeUserData from "../merge/data/MergeUserData";
import SpaceshipFX from "./SpaceshipFX";
import { BoostRank, BoosterType } from "../model/GameModel";
import SpaceShipPool from "./SpaceShipPool";
import DTime from "../utils/DTime";
import LevelColor from "../config/LevelColor";

/*
* 飞船节点;
*/
export default class SpaceshipPod{
    constructor(){
    }

    private _id:number;
    private _podData:ShipPodData;
    private _pod:Laya.MeshSprite3D;
    private _objs:Array<Laya.MeshSprite3D>;
    private _objsRotateList:Array<number>;
    private _objsSpeedList:Array<Laya.Vector3>;
    private _rotateSpeed:number;

    private _fxMeshList:Array<Laya.MeshSprite3D>;
    protected _fxList:Array<SpaceshipFX>;

    public get pod():Laya.MeshSprite3D
    {
        return this._pod;
    }

    public get podData():ShipPodData
    {
        return this._podData;
    }

    public get podHeight():number
    {
        return this._podData.height+this._podData.startPosZ;
    }

    public get objs():Array<Laya.MeshSprite3D>
    {
        return this._objs;
    }

    public load(id:number):void
    {
        this._id = id;
        let colorId = this.getSkinColorId();
        this._podData = GameJsonConfig.instance.getBoosterConfig(this._id);
        this._pod = ResourceManager.instance.getRocketByName( this._podData.getBoosterPath(colorId) );
        this._pod.transform.localScale = new Laya.Vector3(this._podData.scaleNum, this._podData.scaleNum, this._podData.scaleNum);

        this._objs = [];
        this._objsRotateList = [];
        this._objsSpeedList = [];
        this._fxMeshList = [];
        this._fxList = [];
        this.loadObjs();
        // this.enable();

        this._rotateSpeed = this._id % 2 == 0 ? 10 : -10;
    }

    private loadObjs():void
    {
        let subNum:number = this._pod.numChildren;
        for(var i=subNum-1; i>=0; i--)
        {
            let subPod:Laya.MeshSprite3D = this._pod.getChildAt(i) as Laya.MeshSprite3D;
            if(subPod.name.indexOf("fx") == -1)
            {   
                this.loadSkin(subPod);
                this._objs.push(subPod);  
            }
        }  
    }

    protected loadSkin(sub:Laya.MeshSprite3D):void
    {
        let subName:string = sub.name;
        let typeName:string = (subName.split("_")[1] as string).charAt(0);
        let meshName:string = "rocket_"+typeName;

        let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
        let matUrl:string = this.getSkinUrl(meshName, "podjpg");

        Laya.Texture2D.load(matUrl, Laya.Handler.create(this, function(tex:Laya.Texture2D):void
        {
            if(sub && !sub.destroyed)
            {
                //纹理加载完成后赋值
                mat.albedoTexture = tex;
                sub.meshRenderer.material = mat;
            }
        }));
    }

    protected getSkinUrl(meshName:string, prefix:string):string
    {
        prefix = "wxlocal/"+prefix;
        let colorId:number = this.getSkinColorId();
        let meshSkinName:string = GameJsonConfig.instance.getMeshSkinName(meshName);
        if(this._podData.boosterType == BoosterType.Single)
        {
            let skinName:string = meshSkinName+"_"+ (colorId+1);
            return prefix+"/"+skinName+".jpg";
        }else{
            return prefix+"/"+meshSkinName+".png";
        }
    }

    public refreshSkin():void
    {
        if(this._objs)
        {
            this._objs.forEach(subPod => {
                this.loadSkin(subPod);
            });
        }
    }

    protected getSkinColorId():number
    {
        // -1 是为了跟 皮肤颜色id 保持一致
        return LevelColor.getShipColorByShipId( MergeUserData.instance.iMaxLockedShipId ) - 1;
    }

    public enable():void
    {
        this.initFxs();
    }

    protected initFxs():void
    {
        let subNum:number = this._pod.numChildren;
        for(var i=subNum-1; i>=0; i--)
        {
            let subPod:Laya.MeshSprite3D = this._pod.getChildAt(i) as Laya.MeshSprite3D;
            if(subPod.name.indexOf("fx") != -1)
            {   
                this.initFx(subPod);
            }
        }  
    }

    private initFx(sub:Laya.MeshSprite3D):void
    {
        sub.active = false;
        this._fxMeshList.push(sub);

        let rocketFx = SpaceShipPool.getFx();
        this._pod.addChild(rocketFx.effect);
        rocketFx.effect.transform.position = sub.transform.position.clone();
        rocketFx.effect.transform.localScale = new Laya.Vector3(1, 1, 1);

        this._fxList.push(rocketFx);
    }

    public setVisible(enable:boolean):void
	{
        for(var i:number=0; i<this._objs.length; i++)
        {
            this._objs[i].active = enable;
        } 
    }
    
    public rotatePod():void
    {
        let vec3:Laya.Vector3 = this._pod.transform.localRotationEuler;
        vec3.z += DTime.deltaTime * this._rotateSpeed;
        this._pod.transform.localRotationEuler = vec3;
    }

    public clearRotation():void
    {
        if(this._pod)
        {
            this._rotateSpeed = 0;
            this._pod.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        }
    }

    public flyAway():void
    {
        if(this._objsRotateList.length>0 && this._objsSpeedList.length>0)
        {
            for(var i:number=0; i<this._objs.length; i++)
            {
                this.moveObj(this._objs[i], i);
            } 
        }
    }

    private moveObj(obj:Laya.MeshSprite3D, index:number):void
    {
        let randomRotate = this._objsRotateList[index];
        let speed = this._objsSpeedList[index];

        let eulerVec3 = obj.transform.rotationEuler;
        eulerVec3.y += randomRotate;
        obj.transform.rotationEuler = eulerVec3;

        
        let posVec3 = obj.transform.position;
        posVec3.x += speed.x;
        posVec3.z += speed.z;
        obj.transform.position = posVec3;
    }

    public detach():void
	{
        this.clearFx();
        let worldPos = this._pod.transform.position;
        this._pod.transform._setParent(null);
        this._pod.transform.position = worldPos;
        for(var i:number=0; i<this._objs.length; i++)
        {
            this.detachObject(this._objs[i], i);
        } 
	}

	private detachObject(obj:Laya.MeshSprite3D, index:number):void
	{
        let worldPos = obj.transform.position;
        obj.transform._setParent(null);
        obj.transform.position = worldPos;
        obj.transform.localScale = new Laya.Vector3(this._podData.scaleNum, this._podData.scaleNum, this._podData.scaleNum);

        let randomRotate = Mathf.range(-4,4);
        this._objsRotateList[index] = randomRotate;
        
        let speed = new Laya.Vector3( 0.1*(Math.random()-0.5), 0, 0 );
        this._objsSpeedList[index] = speed;
    }

    public launch():void
    {
        this._fxList.forEach(fx => {
            
            fx.onLaunch();

        });
    }

    public booste(rank:BoostRank, aotu:boolean):void
    {
        this._fxList.forEach(fx => {
            
            fx.booste(rank, aotu);

        });
    }

    public landing():void
    {
        this._fxList.forEach(fx => {
            
            fx.onLanding();

        });
    }

    public land():void
    {
        this._fxList.forEach(fx => {
            
            fx.onLandedPlanet();

        });
    }

    public explode():void
    {
        this._fxList.forEach(fx => {
            
            fx.onExplode();

        });
    }

    public clearFx():void
    {
        this._fxList.forEach(fx => {
            
            SpaceShipPool.recoverFx(fx);

        });
    }

    public clearBoosteFx():void
    {
        this._fxList.forEach(fx => {
            
            fx.hideBoosteEft();

        });
    }

    public destorySelf():void
    {
        this.clearFx();
        //这里会不会有问题？清理每节(不清理贴图)
        this._pod.removeSelf();
        this._pod.transform._setParent(null);
        // this._pod.destroy(true);
        this._pod = null;
    }
}