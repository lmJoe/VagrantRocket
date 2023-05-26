import BoostMeter from "../gameui/BoostMeter";
import GameLayerMgr from "../scene/GameLayerMgr";
import { BoostRank } from "../model/GameModel";

/*
* boost控制;
*/
export default class BoostMeterManager
{
    constructor()
    {
        this.init();
    }

    private static _instance:BoostMeterManager;
    public static get instance():BoostMeterManager
    {
        if(!this._instance)
        {
            this._instance = new BoostMeterManager();
        }
        return this._instance;
    }

    private _boostMeter:BoostMeter;

    private init():void
    {
        this._boostMeter = new BoostMeter();
        // GameLayerMgr.instance.effectLayer.addChild(this._boostMeter);
        GameLayerMgr.instance.gameLayer.addChildAt(this._boostMeter, 0);
        this.reset();
    }
    
    public reset():void
    {
        this._boostMeter.pos(-300,-200);
        this._boostMeter.setEnable(false);
    }
    
    public setEnable(enable:boolean):void
    {
        this._boostMeter.setEnable(enable);
    }

    public update():void
    {
        this._boostMeter.update();
    }
    
    public onClickBoost(rank:BoostRank, addCoin:number):void
    {
        this._boostMeter.onBoost(rank, addCoin);
    }

    public onStartBoostRotate(totalTime:number):void
    {
        this._boostMeter.onStartBoostRotate(totalTime);
    }
}