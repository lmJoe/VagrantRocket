import GameManager from "./GameManager";
import GalaxyManager from "../galaxy/GalaxyManager";
import GameTapManager from "./GameTapManager";
import SwitchSceneMgr from "./SwitchSceneMgr";

/*
* 游戏场景切换;
*/
export default class GameSceneMgr{
    constructor(){
    }

    private static _instance:GameSceneMgr;
    public static get instance():GameSceneMgr
    {
        if(!this._instance)
        {
            this._instance = new GameSceneMgr();
        }
        return this._instance;
    }

    public start():void
    {
        GameTapManager.instance.start();
        GameManager.instance.start();
        GalaxyManager.instance.start();

        this.gotoSolar(true);
    }

    public gotoSolar(isInit:boolean=false):void
    {
        if(isInit)
        {
            SwitchSceneMgr.instance.initScene();
            this.showSolar();
        }
        else
        {
            SwitchSceneMgr.instance.switchScene(Laya.Handler.create(this, this.showSolar));
        }
    }
    
    public gotoGalaxy(isInit:boolean=false):void
    {
        if(isInit)
        {
            this.showGalaxy();
        }
        else
        {
            SwitchSceneMgr.instance.switchScene(Laya.Handler.create(this, this.showGalaxy));
        }
    }

    private showSolar():void
    {
        GalaxyManager.instance.leave();
        GameManager.instance.enter();
    }

    private showGalaxy():void
    {
        GameManager.instance.leave();
        GalaxyManager.instance.enter();
    }

    public gotoNextLevel():void
    {
        SwitchSceneMgr.instance.switchLevel(Laya.Handler.create(this, this.showAllGalaxy), Laya.Handler.create(this, this.unlockNewSolar));
    }

    private showAllGalaxy():void
    {
        GameManager.instance.leave();
        GalaxyManager.instance.enter(true);
    }

    private unlockNewSolar():void
    {
        GalaxyManager.instance.exploreNewSolar();
    }


}