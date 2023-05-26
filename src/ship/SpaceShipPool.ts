import ResourceManager from "../ctrl/ResourceManager";
import SpaceshipFX from "./SpaceshipFX";
import HeadWindFx from "./HeadWindFx";

/*
* 特效节点——缓存池
*/
export default class SpaceShipPool
{
    //喷焰特效 缓存池
    private static FxPool:Array<SpaceshipFX> = [];
    
    //顶风特效 缓存池
    private static FxWindPool:Array<HeadWindFx> = [];

    public static getFx():SpaceshipFX
    {
        if(this.FxPool.length == 0)
        {
            let newfx = new SpaceshipFX();
            newfx.init();
            this.FxPool.push(newfx);
        }
        let fx = this.FxPool.pop();
        fx.reset();
        return fx;
    }

    public static recoverFx(fx:SpaceshipFX):void
    {
        fx.clearAll();
        this.FxPool.push(fx);
    }

    public static getFxWind():HeadWindFx
    {
        if(this.FxWindPool.length == 0)
        {
            let windFx = new HeadWindFx();
            windFx.init();
            this.FxWindPool.push(windFx);
        }
        let fx = this.FxWindPool.pop();
        fx.reset();
        return fx;
    }

    public static recoverWindFx(fx:HeadWindFx):void
    {
        fx.clearAll();
        this.FxWindPool.push(fx);
    }

}