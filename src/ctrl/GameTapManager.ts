import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GameLayerMgr from "../scene/GameLayerMgr";
import Constants from "../model/Constants";

/*
* 游戏点击控制;
*/
export default class GameTapManager{
    constructor(){
    }

    private static _instance:GameTapManager;
    public static get instance():GameTapManager
    {
        if(!this._instance)
        {
            this._instance = new GameTapManager();
        }
        return this._instance;
    }

    private _tapSp:Laya.Sprite;
    private _downPos:Laya.Vector2;

    public start():void
    {
        this._tapSp = new Laya.Sprite();
        this._tapSp.size(Laya.stage.width, Laya.stage.height);
        this._tapSp.graphics.drawRect(-5, -5, Laya.stage.width+10, Laya.stage.height+10, "#000000");
        this._tapSp.alpha = 0;

        this._tapSp.mouseEnabled = true;
        this._tapSp.mouseThrough = false;

        GameLayerMgr.instance.gameLayer.removeChildren();
        GameLayerMgr.instance.gameLayer.addChild(this._tapSp);
        
        this._tapSp.on(Laya.Event.MOUSE_DOWN, this, this.onTapDown);
        this._tapSp.on(Laya.Event.MOUSE_UP, this, this.onTapUp);
        this._tapSp.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        this._tapSp.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);

        this._downPos = null;
    }

    private onTapDown():void
    {
        if(Constants.AccessingSolarSystem)
        {
            GameEventMgr.instance.Dispatch(GameEvent.OnClickToBoost, [false]);
        }

        this._downPos = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);
    }

    private onTapUp():void
    {
        this._downPos = null;
    }

    private onMouseOut():void
    {
        this._downPos = null;
    }

    private onMouseMove():void
    {
        if(Constants.AccessingSolarSystem==false && this._downPos)
        {
            let diffPos:Laya.Vector2 = new Laya.Vector2(Laya.stage.mouseX-this._downPos.x, Laya.stage.mouseY-this._downPos.y);
            GameEventMgr.instance.Dispatch(GameEvent.OnScreenMove, [diffPos]);

            this._downPos = new Laya.Vector2(Laya.stage.mouseX, Laya.stage.mouseY);
        }
    }
}