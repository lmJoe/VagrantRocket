import ResourceManager from "../ctrl/ResourceManager";
import { BoostRank } from "../model/GameModel";
import FPSStatistics from "../ctrl/FPSStatistics";
/*
* 飞船喷焰特效;
*/
export default class SpaceshipFX{
    constructor(){
    }

    private _effect:Laya.Sprite3D;

    private _defauleEft:Laya.Sprite3D;
    private _lastTrailEft:Laya.Sprite3D;
    private _bigDefaultEft:Laya.Sprite3D;

    private _boostEft1:Laya.Sprite3D;
    private _boostEft2:Laya.Sprite3D;
    private _bigBoostEft:Laya.Sprite3D;

    private _landEft:Laya.Sprite3D;

    public get effect():Laya.Sprite3D
    {
        return this._effect;
    }

    public init():void
    {   
        this._effect = new Laya.Sprite3D("ship effect");
        this.clearSelf();

        this._defauleEft = ResourceManager.instance.getEffect("E_penhuo");
        this._lastTrailEft = ResourceManager.instance.getEffect("E_penhuo_chang");
        this._bigDefaultEft = ResourceManager.instance.getEffect("changgui");

        this._boostEft1 = ResourceManager.instance.getEffect("E_tisu2");
        this._boostEft2 = ResourceManager.instance.getEffect("E_tisu3");
        this._bigBoostEft = ResourceManager.instance.getEffect("jiasu");

        this._landEft = ResourceManager.instance.getEffect("E_jiangluo");
        
        this._effect.addChild(this._defauleEft);
        this._defauleEft.transform.localPosition = new Laya.Vector3(0,0,0);
        this._defauleEft.active = false;
        
        this._effect.addChild(this._lastTrailEft);
        this._lastTrailEft.transform.localPosition = new Laya.Vector3(0,0,0);
        this._lastTrailEft.active = false;

        this._effect.addChild(this._bigDefaultEft);
        this._bigDefaultEft.transform.localPosition = new Laya.Vector3(0, 0, -2);
        this._bigDefaultEft.active = false;

        this._effect.addChild(this._boostEft1);
        this._boostEft1.transform.localPosition = new Laya.Vector3(0,0,0);
        this._boostEft1.active = false;

        this._effect.addChild(this._boostEft2);
        this._boostEft2.transform.localPosition = new Laya.Vector3(0,0,0);
        this._boostEft2.active = false;

        this._effect.addChild(this._bigBoostEft);
        this._bigBoostEft.transform.localPosition = new Laya.Vector3(0, 0, -2);
        this._bigBoostEft.active = false;

        this._effect.addChild(this._landEft);
        this._landEft.transform.localPosition = new Laya.Vector3(0,0,0);
        this._landEft.active = false;
    }

    public reset():void
    {
        this.clearSelf();
    }

    public clearAll():void
    {
        Laya.timer.clear(this, this.clearAll);

        this._defauleEft.active = false;
        this._lastTrailEft.active = false;
        this._bigDefaultEft.active = false;

        this._boostEft1.active = false;
        this._boostEft2.active = false;
        this._bigBoostEft.active = false;

        this._landEft.active = false;

        this.clearSelf();
        // this._effect.destroy(true);
    }

    private clearSelf():void
    {
        this._effect.removeSelf();
        this._effect.transform._setParent(null);
        this._effect.transform.position = new Laya.Vector3(0,0,0);
    }

    private canUseBoostEft():boolean
    {
        return FPSStatistics.instance.lowFps == false;
    }

    public onLaunch():void
    {
        this._defauleEft.active = true;
    }

    public onLandedPlanet():void
    {
        this._defauleEft.active = false;
        this._lastTrailEft.active = false;
        this._bigDefaultEft.active = false;

        this._landEft.active = true;
        let landParticle = this._landEft.getChildAt(0) as Laya.ShuriKenParticle3D;
        landParticle.particleSystem.play();
        //clearall
        Laya.timer.clear(this, this.clearAll);
        Laya.timer.once(2800, this, this.clearAll);
    }
    
    public onExplode():void
    {
        this._defauleEft.active = false;
        //clearall
        Laya.timer.clear(this, this.clearAll);
        Laya.timer.once(2500, this, this.clearAll);
    }
    
    public onLanding():void
    {
        this._defauleEft.active = false;
        this._lastTrailEft.active = false;
        this._bigDefaultEft.active = false;
    }

    public hideBoosteEft():void
    {
        this._boostEft1.active = false;
        this._boostEft2.active = false;
        this._bigBoostEft.active = false;
    }

    public booste(rank:BoostRank, aotu:boolean):void
    {
        if(this.canUseBoostEft())
        {
            switch(rank)
            {
                case BoostRank.OK:
                    break;
                case BoostRank.Good:
                    this._boostEft1.active = true;
                    break;
                case BoostRank.Great:
                    this._boostEft2.active = true;
                    break;
                case BoostRank.Perfect:
                    this._bigDefaultEft.active = true;
                    break;
                case BoostRank.Insane:
                    this._bigBoostEft.active = true;
                    this._bigDefaultEft.active = true;
                    break;
            }
        }
        if(aotu)
        {
            this._defauleEft.active = true;
        }else{
            this._lastTrailEft.active = true;
        }
    }

    public updatePosition(newPos:Laya.Vector3):void
    {
        let pos = this._effect.transform.position;
        pos.z = newPos.z;
        this._effect.transform.position = pos;

        let local = this._effect.transform.localPosition;
        local.x = 0;
        local.y = 0;
        this._effect.transform.localPosition = local;
    }
}