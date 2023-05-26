import ResourceConfig from "../config/ResourceConfig";
import ZMGameConfig from "../ZMGameConfig";
import UserData from "../data/UserData";

/*
* 资源管理;
*/
export default class ResourceManager{
    constructor(){
    }

    private static _instance:ResourceManager;
    public static get instance():ResourceManager
    {
        if(!this._instance)
        {
            this._instance = new ResourceManager();
        }
        return this._instance;
    }

    private _scene:Laya.Scene3D;

    private _planetList:object;
    private _originPlanet:Laya.Sprite3D;
    private _halo:Laya.MeshSprite3D;
    private _pods:Laya.Sprite3D;
    private _heads:Laya.Sprite3D;

    private _background:Laya.Sprite3D;
    private _fogList:Array<Laya.MeshSprite3D>;
    private _asteroidList:Array<Laya.MeshSprite3D>;

    private _debris:Laya.Sprite3D;
    private _effects:Laya.Sprite3D;
    private _astronaut:Laya.Sprite3D;
    private _buildings:Laya.Sprite3D;
    
    private _solarCamera:Laya.Camera;
    private _directionLight:Laya.DirectionLight;
    
    private _galaxy:Laya.Sprite3D;
    private _galaxyCameraParent:Laya.Sprite3D;
    private _galaxyCamera:Laya.Camera;

    public init():void
    {
    }

    public load(url:any, successHandler?:Laya.Handler, progressHandler?:Laya.Handler):void
    {
        Laya.loader.load(url, successHandler, progressHandler);
    }

    public loadLocalRes(successHandler:Laya.Handler, progressHandler?:Laya.Handler):void
    {
        Laya.loader.load(ResourceConfig.localRes, successHandler, progressHandler);
    }

    public loadRes(successHandler:Laya.Handler, progressHandler?:Laya.Handler):void
    {
        Laya.loader.load(ResourceConfig.loadRes, successHandler, progressHandler);
    }

    public load3DRes(successHandler:Laya.Handler, progressHandler?:Laya.Handler):void
    {
        Laya.loader.create(ResourceConfig.ResUrl, successHandler, progressHandler);
    }

    private compileShader(model: any): void {
        //如果是粒子特效
        if (model instanceof Laya.ShuriKenParticle3D) {
            var shuriKenParticle3D: Laya.ShuriKenParticle3D = model as Laya.ShuriKenParticle3D;
            var render: Laya.ShurikenParticleRenderer = shuriKenParticle3D.particleRenderer
            var materials: Array<any> = render.materials;
            var spriteDefine: number = render._defineDatas.value; var publicDefine: number = 0; var materialDefine: number = 0;
            for (var i: number = 0; i < materials.length; i++) {
                var mater: Laya.ShurikenParticleMaterial = materials[i] as Laya.ShurikenParticleMaterial;
                var marData: any = mater._defineDatas;
                publicDefine = (1 & (~mater._disablePublicDefineDatas.value));
                materialDefine = mater._defineDatas.value;
                if (mater._shader) {
                    Laya.Shader3D.compileShader(mater._shader._name, 0, 0, publicDefine, spriteDefine, materialDefine);
                }
                console.log(publicDefine, spriteDefine, materialDefine);
            }
        }
        //递归获取子对象
        if (model._children) {
            for (var i: number = 0; i < model._children.length; i++) {
                this.compileShader(model._children[i]);
            }
        }
    }

    public loadPrefab():void
    {
        this._scene = Laya.loader.getRes(ResourceConfig.ResUrl) as Laya.Scene3D;
        this._solarCamera = this._scene.getChildByName("SolarCamera") as Laya.Camera;
        this._directionLight = this._scene.getChildByName("SolarLight") as Laya.DirectionLight;
        this._directionLight.active = false;

        this._galaxy = this._scene.getChildByName("Galaxy") as Laya.Sprite3D;
        this._galaxyCameraParent = this._scene.getChildByName("GalaxyCameraParent") as Laya.Sprite3D;
        this._galaxyCamera = this._galaxyCameraParent.getChildByName("GalaxyCamera") as Laya.Camera;

        this.loadPlanets();
        this.loadBackGround();
        this.loadDebris();
        this.loadEffects();
        this.loadPods();
        this.loadAstronaut();
        this.loadOriginPlanet();
        this.loadBuildings();
    }

    private loadBuildings():void
    {
        this._buildings = this._scene.getChildByName("Buildings") as Laya.Sprite3D;
        this._buildings.removeSelf();
    }

    public getBuildings():Laya.Sprite3D
    {
        return Laya.Sprite3D.instantiate(this._buildings) as Laya.Sprite3D;
    }

    private loadAstronaut():void
    {
        this._astronaut = this._scene.getChildByName("Astronaut") as Laya.Sprite3D;
        this._astronaut.removeSelf();
    }

    public getAstronaut():Laya.Sprite3D
    {
        let astronaut = this._astronaut.getChildByName("astronaut") as Laya.Sprite3D;
        return Laya.Sprite3D.instantiate(astronaut) as Laya.Sprite3D;
    }

    private loadPods():void
    {
        this._pods = this._scene.getChildByName("Pods") as Laya.Sprite3D;
        this._pods.removeSelf();

        this._heads = this._scene.getChildByName("Heads") as Laya.Sprite3D;
        this._heads.removeSelf();
    }

    public getRocketByName(podName:string):Laya.MeshSprite3D
    {
        if(podName.indexOf("head") != -1)
        {
            return this.getHead(podName);
        }
        if(podName.indexOf("pod") != -1)
        {
            return this.getPod(podName);
        }
        return null;
    }
    private getPod(podName:string):Laya.MeshSprite3D
    {
        let pod = this._pods.getChildByName(podName) as Laya.MeshSprite3D;
        return Laya.Sprite3D.instantiate(pod) as Laya.MeshSprite3D;
    }
    private getHead(headName:string):Laya.MeshSprite3D
    {
        let head = this._heads.getChildByName(headName) as Laya.MeshSprite3D;
        return Laya.Sprite3D.instantiate(head) as Laya.MeshSprite3D;
    }
    public getHeadTaril():Laya.TrailSprite3D
    {
        let trail = this._heads.getChildByName("Trail") as Laya.TrailSprite3D;
        return Laya.TrailSprite3D.instantiate(trail) as Laya.TrailSprite3D;
    }

    private loadPlanets():void
    {
        let planets = this._scene.getChildByName("Planets") as Laya.Sprite3D;
        planets.removeSelf();
        this._planetList = {};
        for(var i:number=0; i<planets.numChildren; i++)
        {
            if(planets.getChildAt(i).name.indexOf("planet_")!=-1)
            {
                let planet = planets.getChildAt(i) as Laya.MeshSprite3D;
                this._planetList[planet.name] = planet;
            }else if(planets.getChildAt(i).name == "Halo")
            {
                this._halo = planets.getChildAt(i) as Laya.MeshSprite3D;
            }
        }
    }

    private loadOriginPlanet():void
    {
        this._originPlanet = this._scene.getChildByName("OriginPlanet") as Laya.Sprite3D;
        this.compileShader(this._originPlanet);
    }

    private loadBackGround():void
    {
        this._background = this._scene.getChildByName("BackGround") as Laya.Sprite3D;
        this._background.removeSelf();
        this.compileShader(this._background);
        this._fogList = [];
        this._asteroidList = [];
        for(var i=0; i<this._background.numChildren; i++)
        {
            let bgObj = this._background.getChildAt(i) as Laya.MeshSprite3D;
            if(bgObj.name.indexOf("Fog") != -1)
            {
                this._fogList.push(bgObj);
            }
            else if(bgObj.name.indexOf("Asteroid") != -1)
            {
                this._asteroidList.push( bgObj.getChildAt(0) as Laya.MeshSprite3D );
            }
        }
    }

    private loadDebris():void
    {
        this._debris = this._scene.getChildByName("Debris") as Laya.Sprite3D;
        this._debris.removeSelf();
    }

    public getDebri():Laya.Sprite3D
    {
        let ran:number = Math.floor(Math.random()*this._debris.numChildren); 
        return Laya.MeshSprite3D.instantiate( this._debris.getChildAt(ran) as Laya.Sprite3D ) as Laya.Sprite3D;
    }

    private loadEffects():void
    {
        this._effects = this._scene.getChildByName("Effects") as Laya.Sprite3D;
        this._effects.removeSelf();
        this.compileShader(this._effects);
    }

    public getEffect(eftName:string):Laya.Sprite3D
    {
        let eft = this._effects.getChildByName(eftName) as Laya.Sprite3D;
        return Laya.Sprite3D.instantiate(eft) as Laya.Sprite3D;
    }

    public getOriginPlanet():Laya.Sprite3D
    {
        return this._originPlanet;
    }

    public getPrefabByName(name:string):Laya.Sprite3D
    {
        return this._scene.getChildByName(name) as Laya.Sprite3D;
    }

    public getFog():Laya.MeshSprite3D
    {
        let ran:number = Math.floor(Math.random()*this._fogList.length); 
        return Laya.MeshSprite3D.instantiate(this._fogList[ran]) as Laya.MeshSprite3D;
    }

    public getAsteroid():Laya.MeshSprite3D
    {
        let ran:number = Math.floor(Math.random()*this._asteroidList.length); 
        return Laya.MeshSprite3D.instantiate(this._asteroidList[ran]) as Laya.MeshSprite3D;
    }

    public getHighLine():Laya.Sprite3D
    {
        return this._background.getChildByName("HighLine") as Laya.Sprite3D;
    }

    public getNationalFlag():Laya.Sprite3D
    {
        let flag:Laya.Sprite3D = this._background.getChildByName("NationalFlag") as Laya.Sprite3D;
        return Laya.MeshSprite3D.instantiate( flag ) as Laya.Sprite3D;

    }
    
    public getPlanet(planetMesh:string):Laya.MeshSprite3D
    {
        return Laya.MeshSprite3D.instantiate(this._planetList[planetMesh]) as Laya.MeshSprite3D;
    }

    // public getRandomPlanet():Laya.MeshSprite3D
    // {
    //     let ran:number = Math.floor(Math.random()*this._planetList.length); 
    //     return Laya.MeshSprite3D.instantiate(this._planetList[ran]) as Laya.MeshSprite3D;
    // }

    public getEarth():Laya.MeshSprite3D
    {
        let earthMeshName:string = "planet_07";
        return Laya.MeshSprite3D.instantiate(this._planetList[earthMeshName]) as Laya.MeshSprite3D;
    }

    public getHalo():Laya.MeshSprite3D
    {
        return Laya.MeshSprite3D.instantiate(this._halo) as Laya.MeshSprite3D;
    }

    public getScene():Laya.Scene3D
    {
        return this._scene;
    }

    public getGalaxy():Laya.Sprite3D
    {
        return this._galaxy;
    }

    public getSolarCamera():Laya.Camera
    {
        return this._solarCamera;
    }

    public getGalaxyCameraParent():Laya.Sprite3D
    {
        return this._galaxyCameraParent;
    }

    public getGalaxyCamera():Laya.Camera
    {
        return this._galaxyCamera;
    }

    public static get LevelPrefix():string
    {
        if(UserData.instance.gameLevel > 1)
        {
            return "leveljpg/other/";
        }
        return "leveljpg/first/";
    }

    public getGameBgUrl(colorType:number):string
    {
        return ResourceManager.LevelPrefix + ResourceConfig.GameBgPrefix + colorType + ".png";
    }

    public getMergeBgUrl(colorType:number):string
    {
        return ResourceManager.LevelPrefix + ResourceConfig.MergeBgPrefix + colorType + ".png";
    }

    public getPlanetSkin(skinName:string):string
    {
        return ResourceManager.LevelPrefix+"planetjpg/"+skinName+".jpg";
    }

    public static get StarPrefix():string
    {
        if(UserData.instance.flySucCount >= 1)
        {
            return "starimg/other/";
        }
        return "starimg/first/";
    }
}