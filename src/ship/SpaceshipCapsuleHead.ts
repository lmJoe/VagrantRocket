import SpaceshipPod from "./SpaceshipPod";
import UserData from "../data/UserData";
import ResourceManager from "../ctrl/ResourceManager";
import HeadWindFx from "./HeadWindFx";
import SpaceShipPool from "./SpaceShipPool";
import { BoostRank } from "../model/GameModel";
import SkinManager from "../ctrl/SkinManager";
import GameJsonConfig from "../config/GameJsonConfig";

/*
* 飞船头部;
*/
export default class SpaceshipCapsuleHead extends SpaceshipPod{
    constructor(){
        super();
    }

    public head_base:Laya.MeshSprite3D;
    //有些头部没有脚
    public head_feet:Laya.MeshSprite3D;
    //头部特效
    private _windFx:HeadWindFx;
    private _flyTrail:Laya.Sprite3D;

    public load(id:number):void
    {
        super.load(id);

        this.head_base = this.pod.getChildByName("base") as Laya.MeshSprite3D;
        this.head_feet = this.pod.getChildByName("feet") as Laya.MeshSprite3D;

        this.onFly();
    }

    //头部皮肤应用
    protected loadSkin(sub:Laya.MeshSprite3D):void
    {
        let realSub:Laya.MeshSprite3D = sub.getChildAt(0) as Laya.MeshSprite3D;
        let subName:string = realSub.name;
        let typeName:string = (subName.split("_")[1] as string).charAt(0);
        let meshName:string = "capsule_"+typeName;

        let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
        let matUrl:string = this.getSkinUrl(meshName, "headjpg");

        Laya.Texture2D.load(matUrl, Laya.Handler.create(this, function(tex:Laya.Texture2D):void
        {
            if(realSub && !realSub.destroyed)
            {
                //纹理加载完成后赋值
                mat.albedoTexture = tex;
                mat.albedoColor = new Laya.Vector4(1,1,1,1);
                realSub.meshRenderer.material = mat;

            }
        }));
    }

    protected getSkinColorId():number
    {
        if(SkinManager.instance.hasUseSkin)
        {
            return SkinManager.instance.getShipHeadColorId();
        }else{
            return super.getSkinColorId();
        }
    }

    public initHeadFxs():void
    {
        this.initWindFx();
        this.initFlyTrail();
    }

    private initWindFx():void
    {
        // this._windFx = SpaceShipPool.getFxWind();
        // this.pod.addChild(this._windFx.effect);
        // let podPos = this.pod.transform.position.clone();;
        // this._windFx.effect.transform.position = new Laya.Vector3(podPos.x, podPos.y, podPos.z+this.podHeight+3);
        // this._windFx.effect.transform.localScale = new Laya.Vector3(0.2, 0.2, 0.2);
    }

    private initFlyTrail():void
    {
        this.clearTrail();
        this._flyTrail = ResourceManager.instance.getEffect("FlyTrail");
        this.pod.addChild(this._flyTrail);
        this._flyTrail.transform.localPosition = new Laya.Vector3(0, 0, 1);
        this._flyTrail.active = false;
    }

    public onFly():void
    {
        this.head_base.active = true;
        if(this.head_feet)
        {
            this.head_feet.active = false;
        }
    }

    public showWind(rank:BoostRank):void
    {
        // this._windFx.booste(rank);
    }

    public clearBoosteFx():void
    {
        super.clearBoosteFx();
        // this._windFx.hideWind();
    }

    public landing():void
    {
        super.landing();
        // this._windFx.hideWind();
        this._flyTrail.active = true;
    }
    
    public onLand():void
    {
        this.head_base.active = true;
        this._flyTrail.active = false;
        if(this.head_feet)
        {
            this.head_feet.active = true;
        }
        // this._windFx.hideWind();

        this.land();
    }
    
    public onLastBoostUsed():void
	{
        this.head_base.active = true;
        // this._flyTrail.active = true;
    }
    
    public destorySelf():void
    {
        this.clearTrail();
        super.destorySelf();

        // SpaceShipPool.recoverWindFx(this._windFx);
        // this._windFx = null;
    }

    private clearTrail():void
    {
        if(this._flyTrail)
        {
            this._flyTrail.active = false;
            this._flyTrail.removeSelf();
            this._flyTrail.transform._setParent(null);
            // this._flyTrail.destroy();
            this._flyTrail = null;
        }
    }
}