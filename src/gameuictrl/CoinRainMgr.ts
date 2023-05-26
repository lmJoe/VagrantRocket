import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import GameLayerMgr from "../scene/GameLayerMgr";

/*
* CoinRainMgr;
*/
export default class CoinRainMgr
{
    constructor(){
        this.init();
    }

    private static _instance:CoinRainMgr;
    public static get instance():CoinRainMgr
    {
        if(!this._instance)
        {
            this._instance = new CoinRainMgr();
        }
        return this._instance;
    }

    private _rain0:ui.component.CoinRainUI;
    private _rain1:ui.component.CoinRainUI;

    private init():void
    {
        this._rain0 = new ui.component.CoinRainUI();
        this._rain0.mouseEnabled = false;
        this._rain0.mouseThrough = true;
        this._rain0.visible = false;

        this._rain1 = new ui.component.CoinRainUI();
        this._rain1.mouseEnabled = false;
        this._rain1.mouseThrough = true;
        this._rain1.visible = false;
    }
    
    public show():void
    {
        GameLayerMgr.instance.effectLayer.addChild(this._rain0);
        GameLayerMgr.instance.effectLayer.addChild(this._rain1);
        this.setAni();
    }

    public close():void
    {
        Laya.timer.clear(this, this.rainAgain);
        this.stopCoins(this._rain0);
        this.stopCoins(this._rain1);
        GameLayerMgr.instance.effectLayer.removeChild(this._rain0);
        GameLayerMgr.instance.effectLayer.removeChild(this._rain1);
    }

    private setAni():void
    {
        // Laya.timer.once(2000, this, this.close);

        this.startCoins(this._rain0);
        Laya.timer.once(1000, this, this.rainAgain);
    }

    private rainAgain():void
    {
        this.startCoins(this._rain1);
    }

    private startCoins(coinRain:ui.component.CoinRainUI):void
    {
        coinRain.visible = true;
        for(var i=1; i<=10; i++)
        {
            let coin = coinRain.getChildByName("coin"+i) as ui.component.CoinItemUI;
            coin.visible = true;
            coin.scale(0.7, 0.7);
            coin.aniRotate.play(0, true);
        }
        coinRain.aniRain.play(0, true);
    }

    private stopCoins(coinRain:ui.component.CoinRainUI):void
    {
        for(var i=1; i<=10; i++)
        {
            let coin = coinRain.getChildByName("coin"+i) as ui.component.CoinItemUI;
            coin.aniRotate.stop();
        }
        coinRain.aniRain.stop();
        coinRain.visible = false;
    }
}