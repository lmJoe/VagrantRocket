import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import UserData from "../data/UserData";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import WorldCamera from "../camera/WorldCamera";
import Constants from "../model/Constants";
import MergeUserData from "../merge/data/MergeUserData";

/*
* 最高线;
*/
export default class HighLine{
    constructor(){
    }

    private _highLine:Laya.Sprite3D;

    public init():void
    {
        this._highLine = ResourceManager.instance.getHighLine();
        this._highLine.transform.localScale = new Laya.Vector3(1,1,1);
        this._highLine.transform._setParent(null);

        this.initHighLine();
    }

    private initHighLine():void
    {
        this.resetHighLine();

        SceneController.instance.addBackgroundComponet(this._highLine);
    }

    public resetHighLine():void
    {
        let levelDistance:number = UserData.instance.levelDistance;
        let levelFlewDistance:number = UserData.instance.levelFlewDistance;
        let height = levelDistance - levelFlewDistance;
        let shipPower = MergeUserData.instance.rocketInfo.power;
        let rocketHeight = SpaceshipMaster.instance.spaceship.shipHeight;
        let highlineHeight = Math.ceil( (height-0.2*rocketHeight)/shipPower );
        this._highLine.transform.position = new Laya.Vector3(0, 5, highlineHeight);
        if(UserData.instance.totalDiscoverIndex < Constants.SolarNum)
        {
            this.setActive(true);
        }else{
            this.setActive(false);
        }
    }

    public setActive(boo:boolean):void
    {
        this._highLine.active = boo;
    }

	public update():void
	{
        if(this._highLine)
        {
            let pos = this._highLine.transform.position;
            pos.x = SpaceshipMaster.instance.rokectPosition.x;
            this._highLine.transform.position = pos;
        }
	}
}