import GameInfoPageUI from "../gameui/GameInfoPageUI";
import GameLayerMgr from "../scene/GameLayerMgr";
import UserData from "../data/UserData";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";

/*
* GameInfoMgr;
*/
export default class GameInfoMgr
{
    constructor(){
        this.init();
    }

    private static _instance:GameInfoMgr;
    public static get instance():GameInfoMgr
    {
        if(!this._instance)
        {
            this._instance = new GameInfoMgr();
        }
        return this._instance;
    }

    private _ui:GameInfoPageUI;

    public get ui():GameInfoPageUI
    {
        return this._ui;
    }

    private init():void
    {
        this._ui = new GameInfoPageUI();
        GameEventMgr.instance.addListener(GameEvent.OnLaunched, this, this.onLaunched);
        GameEventMgr.instance.addListener(GameEvent.OnGameOver, this, this.onGameover);
        GameEventMgr.instance.addListener(GameEvent.onRestartGame, this, this.onRestartGame);
    }

    public show():void
    {
        //加载方式特殊
        GameLayerMgr.instance.gameLayer.addChild(this._ui);
        this.reset();
    }

    public close():void
    {
        this._ui.removeSelf();
    }
    
    public reset():void
    {
        this._ui.onStart();
        this._ui.setBestDistance();
        
        this.updateGameDistace(0);
    }
    
    public updateGameDistace(distance:number):void
    {
        this._ui.setGameDistance(distance);
    }

    public onLaunched():void
    {
        this._ui.onLaunched();
    }
    
    public onGameover():void
    {
        this._ui.onGameOver();
    }

    public onRestartGame():void
    {
        this.reset();
    }

}