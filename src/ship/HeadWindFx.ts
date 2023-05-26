import ResourceManager from "../ctrl/ResourceManager";
import { BoostRank } from "../model/GameModel";
/*
* 头部顶风特效;
*/
export default class HeadWindFx{
    constructor(){
    }

    private _effect:Laya.Sprite3D;

    private _windEft:Laya.Sprite3D;
    // private _twObj:any = {num:0};

    public get effect():Laya.Sprite3D
    {
        return this._effect;
    }

    public init():void
    {   
        this._effect = new Laya.Sprite3D("ship effect");
        this.clearSelf();
        
        this._windEft = ResourceManager.instance.getEffect("E_qiliuxiaoguo_v3");
        this._effect.addChild(this._windEft);
        this._windEft.transform.localPosition = new Laya.Vector3(0,0,0);
        this.hideWind();
    }

    public reset():void
    {
        this.clearSelf();
    }

    public clearAll():void
    {
        this.hideWind();
        this.clearSelf();
        // this._effect.destroy(true);
    }

    private clearSelf():void
    {
        this._effect.removeSelf();
        this._effect.transform._setParent(null);
        this._effect.transform.position = new Laya.Vector3(0,0,0);
    }

    public hideWind():void
    {
        // Laya.Tween.clearTween(this._twObj);
        // this.changeMaterialOffset(0);
        this._windEft.active = false;
    }

    public booste(rank:BoostRank):void
    {
        switch(rank)
        {
            case BoostRank.OK:
            case BoostRank.Good:
            case BoostRank.Great:
                this.hideWind();
                break;
            case BoostRank.Perfect:
                this.showEft();
                break;
            case BoostRank.Insane:
                this.showEft();
                break;
        }
    }

    private showEft():void
    {
        this._windEft.active = true;
        // this.doTween();
    }
    // private doTween():void
    // {
    //     Laya.Tween.clearTween(this._twObj);
    //     this._twObj.num = 0;
    //     let tw1 = Laya.Tween.to(this._twObj,{num:1},140,Laya.Ease.backOut,Laya.Handler.create(this, function():void
    //     {
    //         this.doTween();
    //     }));
    //     tw1.update = new Laya.Handler(this,function():void
    //     {
    //         this.changeMaterialOffset(this._twObj.num);
    //     });
    // }

    // private changeMaterialOffset(value:number):void
    // {
    //     for(var i=0; i<4; i++)
    //     {
    //         let effect = this._windEft.getChildAt(0) as Laya.Sprite3D;
    //         let qiliu:Laya.ShuriKenParticle3D = effect.getChildByName("qiliu"+i) as Laya.ShuriKenParticle3D;
    //         if(qiliu)
    //         {
    //             let material = qiliu.particleRenderer.material as Laya.ShurikenParticleMaterial;
    //             material.tilingOffset = new Laya.Vector4(1,1,0,value);
    //         }
    //         if(i>0)
    //         {
    //             qiliu.active = false;
    //         }
    //     }
    // }
}