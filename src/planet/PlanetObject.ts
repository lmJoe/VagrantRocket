import Mathf from "../utils/Mathf";
import DTime from "../utils/DTime";
import ResourceManager from "../ctrl/ResourceManager";
import AstronautManager from "../astronaut/AstronautManager";
import Constants from "../model/Constants";
import PlanetAstronaut from "./PlanetAstronaut";
import SolarManager from "../solar/SolarManager";
import PlanetConfig from "../model/PlanetConfig";
import GameJsonConfig from "../config/GameJsonConfig";
import LevelColor from "../config/LevelColor";
import PlanetPool from "./PlanetPool";
import NationManager from "../ctrl/NationManager";

/*
* 星球;
*/
export default class PlanetObject{
    constructor(){
    }
    
    private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(1, 1.5);
    private readonly FlagDefaultAngle:number = -120;

    public flyByPosition:Laya.Vector3;

    /*
                        / 星球/_planetObj
            / _rotateObj 
    _planet             \ 建筑物/宇航员
            \ _halo
    */
    private _planet:Laya.Sprite3D;
    private _rotateObj:Laya.Sprite3D;
    private _halo:Laya.MeshSprite3D;
    private _planetObj:Laya.MeshSprite3D;
    private _index:number;
    private _planetId:number;
    private _planetCfg:PlanetConfig;
    private _scalxNum:number;
    private _planetRadius:number;

    private _landedAstronauts:Array<PlanetAstronaut>;
    
    private _nationalFlag:Laya.Sprite3D;
    private _flag:Laya.MeshSprite3D;
    private _planetBuilding:Laya.Sprite3D;

    private _ownerNationId:number;


    public get planet():Laya.Sprite3D
    {
        return this._planet;
    }

    public get rotateObj():Laya.Sprite3D
    {
        return this._rotateObj;
    }

    public get planetRadius():number
    {
        return this._planetRadius * this._scalxNum;
    }

    public get planetPosition():Laya.Vector3
    {
        return this._planet.transform.position.clone();
    }

    public get scalxNum():number
    {   
        return this._scalxNum;
    }

    public get index():number
    {
        return this._index;
    }

    public load(index:number, planetId:number):void
    {
        this._index = index;
        this._landedAstronauts = [];

        this._planetId = planetId;
        this._planetCfg = GameJsonConfig.instance.getPlanetConfig( this._planetId );
        this._planetRadius = this._planetCfg.planetRadius;

        if(!this._planet)
        {
            this._planet = new Laya.Sprite3D("planet_"+index);
            this._rotateObj = new Laya.Sprite3D("rotateObj_"+index);
        }
        //星球整体
        this._planet.transform.position = new Laya.Vector3(0,0,0);
        this._planet.transform.localScale = new Laya.Vector3(1,1,1);
        this._planet.removeChildren();
        this._planet.removeSelf();
        this._planet.transform._setParent(null);
        
        //旋转部分
        this._rotateObj.transform.position = new Laya.Vector3(0,0,0);
        this._rotateObj.transform.localScale = new Laya.Vector3(1,1,1);
        this._rotateObj.removeChildren();
        this._rotateObj.removeSelf();
        this._rotateObj.transform._setParent(null);
        this._planet.addChild(this._rotateObj);
        
        //星球模型
        this._planetObj = ResourceManager.instance.getPlanet( this._planetCfg.planetMesh );
        this._planetObj.transform.localPosition = new Laya.Vector3(0,0,0);
        this._planetObj.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
        this._rotateObj.addChild(this._planetObj);
        if(!this._planetCfg.isEarth)
        {
            let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
            let matUrl:string = ResourceManager.instance.getPlanetSkin(this._planetCfg.planetSkin);
            Laya.Texture2D.load(matUrl, Laya.Handler.create(this, function(tex:Laya.Texture2D):void
            {
                //纹理加载完成后赋值
                mat.albedoTexture = tex;
                mat.albedoIntensity = 1.5;
                this._planetObj.meshRenderer.material = mat;
            }));
        }

        //星云
        this._halo = ResourceManager.instance.getHalo();
        this._halo.transform.localPosition = new Laya.Vector3(0,0,0);
        this._planet.addChild(this._halo);
        (this._halo.meshRenderer.material as Laya.UnlitMaterial).albedoColor = LevelColor.getPlanetColor(this._planetCfg.planetColor);
	}

    private setPlanet():void
	{
        this._scalxNum = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        this._planet.transform.localScale = new Laya.Vector3(this._scalxNum,this._scalxNum,this._scalxNum);
        let posi = this._planet.transform.position;
        posi.x += Mathf.range(-4, 4);
        // posi.y += Mathf.rangeWithInvert(5,10);
        this._planet.transform.position = posi;

        //占领国家阵营与繁荣度
        this.setNations();
	}

    public update():void
    {
        this.rotate();
        this.updateLandedAstronauts();
    }

    private rotate():void
	{
        let vec3:Laya.Vector3 = this._rotateObj.transform.localRotationEuler;
        vec3.z += DTime.deltaTime * 15;//15
        this._rotateObj.transform.localRotationEuler = vec3;
    }
    
    private updateLandedAstronauts():void
    {
        if(this._landedAstronauts && this._landedAstronauts.length>0)
        {
            this._landedAstronauts.forEach(pa => {
                pa.update();
            });
        }
    }

    private setNations():void
	{
        this._nationalFlag = PlanetPool.getNationalFlag();
        this._flag = this._nationalFlag.getChildByName("flag") as Laya.MeshSprite3D;

        this._ownerNationId = NationManager.instance.nationConfig.getOtherNationId();
        if(this._ownerNationId > 0)
        {
            this.initNationalFlag();
            this.initBuildings();
        }
    }
    
    private clearNations():void
    {
        this.clearBuildings();
        this.clearNationalFlag();
    }

    private initBuildings():void
    {
        this._planetBuilding = PlanetPool.getBuildings();
        let builingNum:number = this._planetBuilding.numChildren;
        for(var i=1; i<=builingNum; i++)
        {
            let building = this._planetBuilding.getChildByName('Building_'+i);
            building.active = true;
        }
        this._rotateObj.addChild(this._planetBuilding);
        this._planetBuilding.transform.localPosition = new Laya.Vector3(0,0,0);
        //10是星球建筑的半径
        let buildingScale = this._planetRadius/10;
        this._planetBuilding.transform.localScale = new Laya.Vector3(buildingScale, buildingScale, buildingScale);
    }

    private initNationalFlag():void
    {
        NationManager.instance.setFlagSkin(this._flag, this._ownerNationId);
        this.addNationalFlag(0);
    }

    private addNationalFlag(angle:number):void
    {
        this._planet.addChild(this._nationalFlag);
        this._nationalFlag.transform.localRotationEuler = new Laya.Vector3(0, angle, 0);
        this._nationalFlag.transform.localScale = new Laya.Vector3(1/this._scalxNum, 1/this._scalxNum, 1/this._scalxNum);
        this._nationalFlag.transform.localPosition = new Laya.Vector3(0, 0, this._planetRadius-1);
        this._planet.transform.localScale = new Laya.Vector3(this._scalxNum,this._scalxNum,this._scalxNum);
    }

    private clearBuildings():void
    {
        if(this._planetBuilding)
        {
            this._planetBuilding.removeSelf();
            PlanetPool.recoverBuildings(this._planetBuilding);
            this._planetBuilding = null;
        }
    }

    private clearNationalFlag():void
    {
        Laya.Tween.clearTween(this._twUpObj);
        Laya.Tween.clearTween(this._twDownObj);
        if(this._nationalFlag)
        {
            this._nationalFlag.removeSelf();
            PlanetPool.recoverNationalFlag(this._nationalFlag);
            this._nationalFlag = null;
        }
    }

    private updateNationalFlag():void
    {
        if(this._ownerNationId > 0)
        {
            NationManager.instance.seizeOtherNation(this._ownerNationId);
            this.doDownRotate();
        }
        else
        {
            this.doUpRotate();
        }
    }

    private _twUpObj:any = {num:0};
    private doUpRotate(delay:number=500):void
    {
        NationManager.instance.setFlagSkin(this._flag);
        this.addNationalFlag(this.FlagDefaultAngle);

        Laya.Tween.clearTween(this._twUpObj);
        this._twUpObj.num = this.FlagDefaultAngle;
        let tw1 = Laya.Tween.to(this._twUpObj,{num:0},800,Laya.Ease.backOut,Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(this._twUpObj);
        }), delay);
        tw1.update = new Laya.Handler(this,function():void
        {
            this._nationalFlag.transform.localRotationEuler = new Laya.Vector3(0, this._twUpObj.num, 0);
        });
    }

    private _twDownObj:any = {num:0};
    private doDownRotate():void
    {
        Laya.Tween.clearTween(this._twDownObj);
        this._twDownObj.num = 0
        let tw1 = Laya.Tween.to(this._twDownObj,{num:this.FlagDefaultAngle},800,Laya.Ease.backIn,Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(this._twDownObj);
            this.doUpRotate(100);

        }), 500);
        tw1.update = new Laya.Handler(this,function():void
        {
            this._nationalFlag.transform.localRotationEuler = new Laya.Vector3(0, this._twDownObj.num, 0);
        });
    }

    public setFlyByPosition(even:boolean):void
	{
        this.setPlanet();

        let diffX:number = Mathf.range(8, 10);
        let num:number = even ? -1*diffX: diffX;
        let posi:Laya.Vector3 = this._planet.transform.position.clone();
        posi.x += num;
        posi.z -= 60;//12
        posi.y = Mathf.range(-25, 3);
        this.flyByPosition = posi;
	}

    public hit(position:Laya.Vector3):boolean
	{
        let dis:number = Laya.Vector3.distance(this._planet.transform.position, position);
        return dis < this._planetRadius*this._scalxNum;
    }
    
    public receiveRokect(rokect:Laya.Sprite3D):void
    {
        rokect.transform._setParent(this._rotateObj.transform);
        rokect.transform.position = rokect.transform.localPosition;
        rokect.transform.localScale = new Laya.Vector3(1/this._scalxNum, 1/this._scalxNum, 1/this._scalxNum);
        this._planet.transform.localScale = new Laya.Vector3(this._scalxNum,this._scalxNum,this._scalxNum);
        rokect.transform.lookAt(this.planetPosition, new Laya.Vector3(0,1,0), false);
        
        //释放宇航员
        this.setLandAstronauts();
        this.updateNationalFlag();
    }

    private setLandAstronauts():void
    {
		// let count = AstronautManager.instance.astronautInShip;
		// count = Math.min(count, Constants.MaxAstronautInPlanet);
		// for(var i=0; i<count; i++)
		// {
		// 	this.spawnAstronaut(i);
        // }
        //强行一个人
        this.spawnAstronaut(1);
	}

	private spawnAstronaut(index:number):void
	{
        let sp = new Laya.Sprite3D();
        this._rotateObj.addChild(sp);

        let planetAstronaut = new PlanetAstronaut();
        planetAstronaut.init(sp,index);

        this._landedAstronauts.push(planetAstronaut);
    }
    
    public reset():void
    {
        if(this._landedAstronauts && this._landedAstronauts.length>0)
        {
            this._landedAstronauts.forEach(pa => {
                pa.clear();
            });

            this._landedAstronauts.splice(0);
            this._landedAstronauts = [];
        }
        this._planet.removeSelf();
        this._rotateObj.transform.localRotationEuler = new Laya.Vector3(0,0,0);
        //
        this.clearNations();
    }

    public destory():void
    {
        if(this._planet)
        {   
            this._planet.removeSelf();
            this._planet.transform._setParent(null);
            // this._planet.destroy(true);
            this._planet = null;
        }
    }
}