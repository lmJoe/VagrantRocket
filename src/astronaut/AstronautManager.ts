import Astronaut from "./Astronaut";
import Constants from "../model/Constants";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ResourceManager from "../ctrl/ResourceManager";
import SceneController from "../scene/SceneController";
import SolarManager from "../solar/SolarManager";
import ShaftManager from "../ctrl/ShaftManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";

/*
* 宇航员管理;
*/
export default class AstronautManager
{
    constructor(){
    }

    private static _instance:AstronautManager;
    public static get instance():AstronautManager
    {
        if(!this._instance)
        {
            this._instance = new AstronautManager();
        }
        return this._instance;
    }

    private _astronautList:Array<Astronaut>;
    private _astronautInShip:number;

    public get astronautList():Array<Astronaut>
    {
        return this._astronautList;
    }

    public get astronautInShip():number
    {
        return this._astronautInShip;
    }

    public get isSolarSystemFull():boolean
    {
        return this._astronautInShip >= Constants.MaxPopulationOnSolarSystem;
    }

    public start():void
    {
        this._astronautList = [];
        this.initAstronautInShip();
        this.prevLoadAstronaut();
    }
    
    private initAstronautInShip():void
    {
        this._astronautInShip = SolarManager.instance.solarPeopleInShip();//
        //默认加一人
        // if(this._astronautInShip == 0 && this.isSolarSystemFull == false)
        // {
        //     this.addAstronautInShip();
        // }
    }
    
    public reset():void
    {
        this.initAstronautInShip();
        this.clearAllAstronauts();
    }

    private prevLoadAstronaut():void
    {
        let astronautObj:Laya.Sprite3D = ResourceManager.instance.getAstronaut();
        let astronaut:Astronaut = new Astronaut();
        astronaut.load(astronautObj);
        
        astronaut.obj.transform.position = new Laya.Vector3(0, 0, -50);
        SceneController.instance.addBackgroundComponet(astronaut.obj);
    }

    public creatAstronsut():Astronaut
    {
        let astronautObj:Laya.Sprite3D = ResourceManager.instance.getAstronaut();
        let astronaut:Astronaut = new Astronaut();
        astronaut.load(astronautObj);

        this._astronautList.push(astronaut);

        return astronaut;
    }

    public addAstronautInShip():void
	{
        this._astronautInShip ++;
        //存人数
        SolarManager.instance.updatePeopleInShip(this._astronautInShip);
        GameEventMgr.instance.Dispatch(GameEvent.PeopleInShipChange);
        //播动画
        ShaftManager.instance.addAstronaut();
    }

    private clearAstronautInShip():void
    {
        this._astronautInShip = Constants.DefaultShipPeople;
        //存人数
        SolarManager.instance.updatePeopleInShip(this._astronautInShip);
        GameEventMgr.instance.Dispatch(GameEvent.PeopleInShipChange);
    }

    public onLand():void
	{
        this.clearAstronautInShip();
    }

    public onExplode():void
	{
        //宇航员-乱飞动画
		let num = Math.min(this._astronautInShip, Constants.MaxAstronautFloatNum);
		for(var i=0 ; i<num; i++)
		{
            let astronaut = this.creatAstronsut();
			SceneController.instance.addShipComponet(astronaut.obj);
            astronaut.obj.transform.position = SpaceshipMaster.instance.rokectPosition;
            astronaut.float();
		}
        this.clearAstronautInShip();
    }
    
    public update():void
    {
        if(this._astronautList && this._astronautList.length>0)
        {   
            for( var i=this._astronautList.length-1; i>=0; i-- )
            {
                let astronaut = this._astronautList[i];
                if(astronaut)
                {
                    astronaut.update();
                    if(astronaut.needRemove())
                    {
                        astronaut.clear();
                        astronaut = null;
                        this._astronautList.splice(i,1);
                    }
                }
            }
        }
    }

    public clearAllAstronauts():void
    {
        if(this._astronautList && this._astronautList.length>0)
        {   
            this._astronautList.forEach(astronaut => {
                if(astronaut)
                {
                    astronaut.clear();
                    astronaut = null;
                }
            });
            this._astronautList.splice(0);
        }
    }

}