import ResourceManager from "../ctrl/ResourceManager";
import GameLayerMgr from "./GameLayerMgr";

export default class SceneController{
    constructor(){
    }
    // public static InitScene:string = "Init";
    // public static SolarSystemScene:string = "SolarSystem";
    // public static GalaxyScene:string = "Galaxy";

    private static _instance:SceneController;
    public static get instance():SceneController
    {
        if(!this._instance)
        {
            this._instance = new SceneController();
        }
        return this._instance;
    }

    private _gameScene:Laya.Scene3D;

    private _sceneBackgroundParent:Laya.Sprite3D;
    private _scenePlanetParent:Laya.Sprite3D;
    private _sceneShipParent:Laya.Sprite3D;

    public loadScene():void
    {
        this._gameScene = ResourceManager.instance.getScene();
        GameLayerMgr.instance.d3Layer.addChild(this._gameScene);

        this._sceneBackgroundParent = new Laya.Sprite3D("sceneBackgroundParent");
        this._sceneBackgroundParent.transform.position = new Laya.Vector3(0,0,0);
        this._gameScene.addChild(this._sceneBackgroundParent);
        
        this._scenePlanetParent = new Laya.Sprite3D("scenePlanetParent");
        this._scenePlanetParent.transform.position = new Laya.Vector3(0,0,0);
        this._gameScene.addChild(this._scenePlanetParent);
        
        this._sceneShipParent = new Laya.Sprite3D("sceneShipParent");
        this._sceneShipParent.transform.position = new Laya.Vector3(0,0,0);
        this._gameScene.addChild(this._sceneShipParent);
    }

    public removeScene():void
    {
        Laya.stage.removeChild(this._gameScene);
    }

    // public addComponet(node:Laya.Node):void
    // {
    //     this._gameScene.addChild(node);
    // }

    public removeComponet(node:Laya.Node):void
    {
        // this._gameScene.removeChild(node);
        node.removeSelf();
    }

    public addBackgroundComponet(node:Laya.Node):void
    {
        this._sceneBackgroundParent.addChild(node);
    }

    public addPlanetComponet(node:Laya.Node):void
    {
        this._scenePlanetParent.addChild(node);
    }

    public addShipComponet(node:Laya.Node):void
    {
        this._sceneShipParent.addChild(node);
    }

    public clearShipParent():void
    {
        this._sceneShipParent.removeChildren();
    }
}