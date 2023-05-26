import GameLayerMgr from "../scene/GameLayerMgr";

/*
* 场景过渡;
*/
export default class SwitchSceneMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SwitchSceneMgr;
    public static get instance():SwitchSceneMgr
    {
        if(!this._instance)
        {
            this._instance = new SwitchSceneMgr();
        }
        return this._instance;
    }

    private _mask:Laya.View;

    private init():void
    {
        this.creatMask();
    }

    private creatMask():void
    {
        this._mask = new Laya.View();
        this._mask.size(Laya.stage.width, Laya.stage.height);
        this._mask.graphics.drawRect(-5, -5, Laya.stage.width+10, Laya.stage.height+10, "#000000");
        this._mask.alpha = 1;
        this._mask.name = "switch mask";

        this._mask.mouseEnabled = true;
        this._mask.mouseThrough = false;
        //加监听保证不穿透
        this._mask.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        console.log(evt.target.name);
    }

    private addMask():void
    {
        this._mask.pos(0, 0);
        GameLayerMgr.instance.switchLayer.addChild(this._mask);
    }

    private removeMask():void
    {
        GameLayerMgr.instance.switchLayer.removeChild(this._mask);
    }

    /**
     * @param maskInEndFun 渐入完回调
     * @param maskOutEndFun 渐出完回调
     */
    public switchScene(maskInEndFun:Laya.Handler=null, maskOutEndFun:Laya.Handler=null):void
    {
        this.maskIn(500, 0, maskInEndFun);
        this.maskOut(350, 500, maskOutEndFun);
    }
    
    private maskIn(duration:number, delay:number, callback:Laya.Handler=null):void
    {
        this.addMask();
        this._mask.alpha = 0;
        let tw2 = Laya.Tween.to(this._mask,{alpha:1},duration,Laya.Ease.linearNone,Laya.Handler.create(this,function():void
        {
            Laya.Tween.clear(tw2);
            if(callback)
            {
                callback.run();
            }
        }), delay);
    }

    private maskOut(duration:number, delay:number, callback:Laya.Handler=null):void
    {
        let tw2 = Laya.Tween.to(this._mask,{alpha:0},duration,Laya.Ease.linearNone,Laya.Handler.create(this,function():void
        {
            Laya.Tween.clearTween(this._mask);
            this.removeMask();
            if(callback)
            {
                callback.run();
            }
        }), delay);
    }

    /**
     * @param maskInEndFun 渐入完回调
     * @param maskOutEndFun 渐出完回调
     */
    public switchLevel(maskInEndFun:Laya.Handler=null, maskOutEndFun:Laya.Handler=null):void
    {
        this.maskIn(1800, 0, maskInEndFun);
        this.maskOut(500, 1800, maskOutEndFun);
    }

    /**
     * @param maskOutEndFun 渐出完回调
     */
    public initScene(maskOutEndFun:Laya.Handler=null):void
    {
        this.addMask();
        this._mask.alpha = 1;
        this.maskOut(600, 0, maskOutEndFun);
    }

    /**
     * @param maskInEndFun 渐入完回调
     * @param maskOutEndFun 渐出完回调
     */
    public reachGalaxyPlanet(maskInEndFun:Laya.Handler=null, maskOutEndFun:Laya.Handler=null):void
    {
        this.maskIn(1000, 0, maskInEndFun);
        this.maskOut(100, 1000, maskOutEndFun);
    }
}