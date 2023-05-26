/*
* 游戏层级;
*/
export default class GameLayerMgr{
    constructor(){
      
    }
    
    private static _instance:GameLayerMgr;
    public static get instance():GameLayerMgr
    {
      debugger
        if(!this._instance)
        {
            this._instance = new GameLayerMgr();
        }
        return this._instance;
    }

    public static StageWidth:number;
    public static StageHeight:number;

    private _bgLayer:Laya.Sprite;
    private _d3Layer:Laya.Sprite;
    private _gameLayer:Laya.Sprite;
    private _uiLayer:Laya.Sprite;
    private _effectLayer:Laya.Sprite;
    private _switchLayer:Laya.Sprite;
    private _systemLayer:Laya.Sprite;

    public static initStage(width:number, height:number):void
    {
        GameLayerMgr.StageWidth = width;
        GameLayerMgr.StageHeight = height;
    }

    public initLayer():void
    {
        //背景层
        this._bgLayer = new Laya.Sprite();
        this._bgLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        //3D场景层
        this._d3Layer = new Laya.Sprite();
        //游戏控制层
        this._gameLayer = new Laya.Sprite();
        this._gameLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        //UI界面层
        this._uiLayer = new Laya.Sprite();
        this._uiLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        this._uiLayer.mouseThrough = true;
        //特效层
        this._effectLayer = new Laya.Sprite();
        this._effectLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        this._effectLayer.mouseThrough = true;
        //切换场景层
        this._switchLayer = new Laya.Sprite();
        this._switchLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        this._switchLayer.mouseThrough = true;
        //系统通知层
        this._systemLayer = new Laya.Sprite();
        this._systemLayer.size(GameLayerMgr.StageWidth, GameLayerMgr.StageHeight);
        this._systemLayer.mouseThrough = true;

        Laya.stage.addChild(this._bgLayer);
        Laya.stage.addChild(this._d3Layer);
        Laya.stage.addChild(this._gameLayer);
        Laya.stage.addChild(this._uiLayer);
        Laya.stage.addChild(this._effectLayer);
        Laya.stage.addChild(this._switchLayer);
        Laya.stage.addChild(this._systemLayer);
    }

    public get bgLayer():Laya.Sprite
    {
        return this._bgLayer;
    }

    public get d3Layer():Laya.Sprite
    {
        return this._d3Layer;
    }

    public get gameLayer():Laya.Sprite
    {
        return this._gameLayer;
    }

    public get uiLayer():Laya.Sprite
    {
        return this._uiLayer;
    }

    public get effectLayer():Laya.Sprite
    {
        return this._effectLayer;
    }

    public get switchLayer():Laya.Sprite
    {
        return this._switchLayer;
    }

    public get systemLayer():Laya.Sprite
    {
        return this._systemLayer;
    }
}