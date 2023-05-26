import SolarInfoItemUI from "../gameui/SolarInfoItemUI";
import GalaxyCamera from "./GalaxyCamera";
import UserData from "../data/UserData";

/*
* 星际星星;
*/
export default class GalaxyPlanet{
    constructor(){
    }

    private static readonly HitDis:number = 0.06;//0.05是半径

    private _discoverIdx:number;
    private _starObj:Laya.Sprite3D;
    private _infoItem:SolarInfoItemUI;

    public get discoverIdx():number
    {
        return this._discoverIdx;
    }

    public get starObj():Laya.Sprite3D
    {
        return this._starObj;
    }

    public get planetPosition():Laya.Vector3
    {
        return this._starObj.transform.position.clone();
    }

    public load(obj:Laya.Sprite3D, index:number):void
    {
        this._starObj = obj.getChildAt(0) as Laya.Sprite3D;
        this._discoverIdx = index;

        this.initInfoItem();
    }
    
    public initInfoItem():void
    {
        if(this._discoverIdx < UserData.instance.totalDiscoverIndex)
        {
            if(!this._infoItem)
            {
                this._infoItem = new SolarInfoItemUI();
                this._infoItem.init(this._discoverIdx);
            }
        }else{
            // this._starObj.active = false;
        }
    }

	public update():void
	{
        if(this._infoItem && this._infoItem.hasInfo)
        {
            let out:Laya.Vector3 = new Laya.Vector3(0,0,0);
            GalaxyCamera.instance.camera.worldToViewportPoint(this._starObj.transform.position, out);
            this._infoItem.setPos(out.x, out.y);
        }
    }
    
    public show():void
    {
        if(this._infoItem && this._infoItem.hasInfo)
        {
            this._infoItem.setEnable(true);
            this._infoItem.updateInfo();
        }
    }

    public hide():void
    {
        if(this._infoItem && this._infoItem.hasInfo)
        {
            this._infoItem.setEnable(false);
        }
    }

    public checkHit(pos:Laya.Vector3):boolean
    {
        let dis = Laya.Vector3.distanceSquared(pos, this.planetPosition);
        return dis <= GalaxyPlanet.HitDis*GalaxyPlanet.HitDis;
    }
}