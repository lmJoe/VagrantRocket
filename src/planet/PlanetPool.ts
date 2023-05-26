import ResourceManager from "../ctrl/ResourceManager";

/*
* 星球资源——缓存池
*/
export default class PlanetPool
{
    //星球建筑
    private static BuildingsPool:Array<Laya.Sprite3D> = [];
    //旗子
    private static NationalFlagPool:Array<Laya.Sprite3D> = [];

    public static getBuildings():Laya.Sprite3D
    {
        if(this.BuildingsPool.length == 0)
        {
            let res = ResourceManager.instance.getBuildings();
            this.BuildingsPool.push(res);
        }
        let building = this.BuildingsPool.pop();
        return building;
    }

    public static recoverBuildings(building:Laya.Sprite3D):void
    {
        this.BuildingsPool.push(building);
    }

    public static getNationalFlag():Laya.Sprite3D
    {
        if(this.NationalFlagPool.length == 0)
        {
            let res = ResourceManager.instance.getNationalFlag();
            this.NationalFlagPool.push(res);
        }
        let nationalFlag = this.NationalFlagPool.pop();
        return nationalFlag;
    }

    public static recoverNationalFlag(nationalFlag:Laya.Sprite3D):void
    {
        this.NationalFlagPool.push(nationalFlag);
    }
}