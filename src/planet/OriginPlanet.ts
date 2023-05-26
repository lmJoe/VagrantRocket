import GameJsonConfig from "../config/GameJsonConfig";
import ResourceManager from "../ctrl/ResourceManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import MergeUserData from "../merge/data/MergeUserData";
import FPSStatistics from "../ctrl/FPSStatistics";

/*
* 出发星球;
*/
export default class OriginPlanet
{
    constructor(){
    }

    private static readonly BoomTrigger:Array<number> = [0.32, 0.42, 0.47];

    private _planet:Laya.Sprite3D;
    private _realPlanet:Laya.MeshSprite3D;
    private _launchEft:Laya.Sprite3D;
    private _shengjiEft:Laya.Sprite3D;
    private _shengjiBoomEft:Laya.ShuriKenParticle3D;
    private _rainbowEft:Laya.Sprite3D;
    private _staySmokeEft:Laya.Sprite3D;

    private _partCount:number;

    public load(obj:Laya.Sprite3D):void
    {
        this._planet = obj;
        this._realPlanet = this._planet.getChildByName("HomePlanet") as Laya.MeshSprite3D;
        this._launchEft = this._planet.getChildByName("LaunchEft") as Laya.Sprite3D;
        this._shengjiEft = this._planet.getChildByName("ShengjiEft") as Laya.Sprite3D;
        this._rainbowEft = this._planet.getChildByName("Rainbow") as Laya.Sprite3D;
        this._staySmokeEft = this._planet.getChildByName("SmokeEft") as Laya.Sprite3D;

        this._launchEft.active = false;

        this.hideShengjiEft();
        
        this._rainbowEft.active = false;
        this._staySmokeEft.active = false;

        //升级事件监听
        GameEventMgr.instance.addListener(GameEvent.StartShengjiEffect, this, this.showShengjiEft);
        GameEventMgr.instance.addListener(GameEvent.OnFPSLow, this, this.onFPSLow);
    }

    public onFPSLow():void
    {
        this.setStayEft();
    }

    public changeRealPlanet(planetId:number):void
    {
        let oldPos = this._realPlanet.transform.localPosition.clone();
        let oldRo = this._realPlanet.transform.rotation.clone();
        this._realPlanet.removeSelf();
        
        let planetCfg = GameJsonConfig.instance.getPlanetConfig( planetId );
        let planetModel = ResourceManager.instance.getPlanet( planetCfg.planetMesh );
        if(planetCfg.isEarth == false)
        {
            let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
            let matUrl:string = ResourceManager.instance.getPlanetSkin(planetCfg.planetSkin);
            Laya.Texture2D.load(matUrl, Laya.Handler.create(this, function(tex:Laya.Texture2D):void
            {
                mat.albedoTexture = tex;
                planetModel.meshRenderer.material = mat;
            }));
        }

        this._planet.addChild(planetModel);
        planetModel.transform.localPosition = oldPos;
        planetModel.transform.rotation = oldRo;
        this._realPlanet = planetModel;

        this.setStayEft();
    }

    private setStayEft():void
    {
        this._rainbowEft.active = !FPSStatistics.instance.lowFps;
        this._staySmokeEft.active = !FPSStatistics.instance.lowFps;
    }

    public onLaunch():void
    {
        this._launchEft.active = true;
        this._rainbowEft.active = false;
        this._staySmokeEft.active = false;
        Laya.timer.once(3700,this,this.effectEnd);
    }

    private effectEnd():void
    {
        this._launchEft.active = false;
    }

    private getShengjiClipNum():number
    {
        let shipId = MergeUserData.instance.iMaxLockedShipId;
        shipId = Math.max(1, shipId-1);
        let rocketData = GameJsonConfig.instance.getRokectConfigByLevel(shipId);
        return rocketData.clipNum;
    }

    private hasFreshNewShip:boolean = false;
    private _clipNum:number;
    private showShengjiEft():void
    {
        this._partCount = 0;
        this._clipNum = this.getShengjiClipNum();
        this.hasFreshNewShip = false;

        let tiepi = this._shengjiEft.getChildByName("tiepi0"+this._clipNum) as Laya.Sprite3D;
        tiepi.active = true;
        let animator = tiepi.getComponent(Laya.Animator) as Laya.Animator;
        animator.speed = 1.5;
        animator.play("Take"+this._clipNum, 0, 0);

        Laya.timer.clear(this, this.onFrame);
        Laya.timer.frameLoop(1, this, this.onFrame);
    }

    private onFrame():void
    {
        let tiepi = this._shengjiEft.getChildByName("tiepi0"+this._clipNum) as Laya.Sprite3D;
        let animator = tiepi.getComponent(Laya.Animator) as Laya.Animator;

        let value = animator.getCurrentAnimatorPlayState();
        if( this._partCount < this._clipNum && Math.floor(value.normalizedTime/0.085) > this._partCount )
        {
            this._partCount ++;
            this.showLevelEft(this._partCount);
            SoundManager.instance.playSound(MusicConfig.DaJiaZi, false);
        }
        if(this.hasFreshNewShip == false && value.normalizedTime > OriginPlanet.BoomTrigger[this._clipNum-3])
        {
            this.hasFreshNewShip = true;
            this.stopEffect();
            // SoundManager.instance.playSound(MusicConfig.JiaZiBoom, false);
            // this.freshNewShip();
        }
        if(value.normalizedTime >= 1)
        {
            Laya.timer.clear(this, this.onFrame);
            this.onShengjiEftEnd();
            this.hideShengjiEft();
        }
    }

    private stopEffect():void
    {
        let tiepi = this._shengjiEft.getChildByName("tiepi0"+this._clipNum) as Laya.Sprite3D;
        let animator = tiepi.getComponent(Laya.Animator) as Laya.Animator;
        animator.speed = 0;

        Laya.timer.clear(this, this.onResume);
        Laya.timer.once(500, this, this.onResume);
    }

    private onResume(): void
    {
        let tiepi = this._shengjiEft.getChildByName("tiepi0"+this._clipNum) as Laya.Sprite3D;
        let animator = tiepi.getComponent(Laya.Animator) as Laya.Animator;
        animator.speed = 1.7;

        SoundManager.instance.playSound(MusicConfig.JiaZiBoom, false);
        this.freshNewShip();
    }
    
    private freshNewShip():void
    {
        GameEventMgr.instance.Dispatch(GameEvent.ChangeShips);
        this._shengjiBoomEft.active = true;
        this._shengjiBoomEft.particleSystem.play();
    }

    private onShengjiEftEnd():void
    {
        let tiepi = this._shengjiEft.getChildByName("tiepi0"+this._clipNum) as Laya.Sprite3D;
        tiepi.active = false;
        this._shengjiBoomEft.active = false; 
        GameEventMgr.instance.Dispatch(GameEvent.UnLockShips);
    }

    private hideShengjiEft():void
    {
        //爆炸
        this._shengjiBoomEft = this._shengjiEft.getChildByName("glow") as Laya.ShuriKenParticle3D;
        this._shengjiBoomEft.particleSystem.stop();
        this._shengjiBoomEft.active = false;
        
        //震动烟雾
        for(var i=1; i<=5; i++)
        {
            let eft = this._shengjiEft.getChildByName(i+"lever") as Laya.ShuriKenParticle3D;
            eft.particleSystem.stop();
            eft.active = false;
        }

        //铁皮
        for(var j=3; j<=5; j++)
        {
            let tiepi = this._shengjiEft.getChildByName("tiepi0"+j) as Laya.Sprite3D;
            if(tiepi){
                tiepi.active = false;
            }
        }
    }

    private showLevelEft(level:number):void
    {
        let eft = this._shengjiEft.getChildByName(level+"lever") as Laya.ShuriKenParticle3D;
        eft.active = true;
        eft.particleSystem.play();
    }
}