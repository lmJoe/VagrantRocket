import Mathf from "../utils/Mathf";
import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import DTime from "../utils/DTime";
import LevelColor from "../config/LevelColor";

/*
* 背景星云;
*/
export default class BackgroundFog{
    constructor(){
    }

    // private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(100,150);
    private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(200,300);
    private readonly FogNum:number = 70;

    private fogLayer:Laya.Sprite3D;
    private fogList:Array<Laya.MeshSprite3D>;
    private fogRotateSpeeds:Array<number>;

    public init():void
    {
        this.fogLayer = new Laya.Sprite3D("bgfoglayer");
        this.fogLayer.transform.position = new Laya.Vector3(0,0,0);
        this.fogList = [];
        this.fogRotateSpeeds = [];

        this.setFogs();
    }

    public reset():void
    {
        if(this.fogList && this.fogList.length>0)
        {
            for (var i = 0; i < this.fogList.length; i++) 
            {
                let fog = this.fogList[i];
                if(fog)
                {
                    this.setFogColor(fog);
                }
            }
        }
    }

    private setFogs():void
    {
        let zore:Laya.Vector3 = new Laya.Vector3(0,0,0);
        zore.z = -50;
        for (var i = 0; i < this.FogNum; i++) 
        {
            let fog:Laya.MeshSprite3D = ResourceManager.instance.getFog();
            fog.transform.position = zore.clone();
            this.initFog(fog);
            
            this.fogRotateSpeeds[i] = Mathf.range(-6,6);
            this.fogList[i] = fog;
            this.fogLayer.addChild(fog);

            zore.z += Mathf.range(55,65);
        }
        SceneController.instance.addBackgroundComponet(this.fogLayer);
    }

    private initFog(fog:Laya.MeshSprite3D):void
    {   
        let xxx = Mathf.range(-55,55);
        let yyy = Mathf.range(-40, -80);
        fog.transform.position = new Laya.Vector3(xxx, yyy, fog.transform.position.z);

        let scalexxx = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        let scaleyyy = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
        fog.transform.localScale = new Laya.Vector3(scalexxx, scaleyyy, 1);

        this.setFogColor(fog);
        // let levelColorType = LevelColor.getLevelColorType();
        // let color = LevelColor.getPlanetColor(levelColorType);
        // (fog.meshRenderer.material as Laya.UnlitMaterial).albedoColor = color;
        // (fog.meshRenderer.material as Laya.UnlitMaterial).albedoColor = new Laya.Vector4(147/255,112/255,219/255,1);

        let rotatezzz = Mathf.range(0,360);
        fog.transform.rotationEuler = new Laya.Vector3(fog.transform.rotationEuler.x, 0, rotatezzz);
    }

    private setFogColor(fog:Laya.MeshSprite3D):void
    {
        let levelColorType = LevelColor.getLevelColorType();
        let color = LevelColor.getPlanetColor(levelColorType);
        (fog.meshRenderer.material as Laya.UnlitMaterial).albedoColor = color;
    }

	public update():void
	{
        if(this.fogList && this.fogList.length>0)
        {
            for (var i = 0; i < this.fogList.length; i++) 
            {
                let fog = this.fogList[i];
                let speed = this.fogRotateSpeeds[i];

                let eulerAngles = fog.transform.rotationEuler;
                eulerAngles.z += speed * DTime.deltaTime;
                fog.transform.rotationEuler = eulerAngles;
            }

        }
	}
}