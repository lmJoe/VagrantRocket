import Mathf from "../utils/Mathf";
import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import DTime from "../utils/DTime";
import LevelColor from "../config/LevelColor";

/*
* 背景小行星;
*/
export default class BackgroundAsteroid{
    constructor(){
    }

    private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(7, 12);
    private readonly AsteroidNum:number = 30;

    private asteroidLayer:Laya.Sprite3D;
    private asteroidList:Array<Laya.MeshSprite3D>;

    public init():void
    {
        this.asteroidLayer = new Laya.Sprite3D("asteroidLayer");
        this.asteroidLayer.transform.position = new Laya.Vector3(0,0,0);
        this.asteroidList = [];

        this.setAsteroids();
    }

    public reset():void
    {
        if(this.asteroidList && this.asteroidList.length>0)
        {
            for (var i = 0; i < this.asteroidList.length; i++) 
            {
                let asteroid = this.asteroidList[i];
                if(asteroid)
                {
                    this.setColor(asteroid);
                }
            }
        }
    }

    private setAsteroids():void
    {
        let zore:Laya.Vector3 = new Laya.Vector3(0,0,0);
        zore.z = 500;
        for (var i = 0; i < this.AsteroidNum; i++) 
        {
            let asteroid:Laya.MeshSprite3D = ResourceManager.instance.getAsteroid();
            asteroid.transform.position = zore.clone();
            this.initAsteroid(asteroid);
            
            this.asteroidList[i] = asteroid;
            this.asteroidLayer.addChild(asteroid);

            zore.z += Mathf.range(150,300);
        }
        SceneController.instance.addBackgroundComponet(this.asteroidLayer);
    }

    private initAsteroid(asteroid:Laya.MeshSprite3D):void
    {   
        let xxx = Mathf.rangeWithInvert(15, 50);
        let yyy = Mathf.range(-40, -30);
        asteroid.transform.position = new Laya.Vector3(xxx, yyy, asteroid.transform.position.z);

        let scalexxx = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        let scaleyyy = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        let scalezzz = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        asteroid.transform.localScale = new Laya.Vector3(scalexxx, scaleyyy, scalezzz);



        let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
        asteroid.meshRenderer.material = mat;
        // mat.albedoColor = new Laya.Vector4(72/255,61/255,139/255,1);
        // mat.albedoColor = color;
        this.setColor(asteroid);

        let rotatezzz = Mathf.range(0,360);
        asteroid.transform.rotationEuler = new Laya.Vector3(asteroid.transform.rotationEuler.x, 0, rotatezzz);
    }

    private setColor(asteroid:Laya.MeshSprite3D):void
    {
        let levelColorType = LevelColor.getLevelColorType();
        let color = LevelColor.getPlanetColor(levelColorType);
        (asteroid.meshRenderer.material as Laya.UnlitMaterial).albedoColor = color;
    }

    public clear():void
    {
        if(this.asteroidList && this.asteroidList.length>0)
        {
            for (var i = 0; i < this.asteroidList.length; i++) 
            {
                let asteroid = this.asteroidList[i];
                if(asteroid)
                {
                    asteroid.removeSelf();
                }
            }
            this.asteroidList.splice(0);
        }

        if(this.asteroidLayer)
        {
            this.asteroidLayer.removeSelf();
            this.asteroidLayer = null;
        }
    }
}