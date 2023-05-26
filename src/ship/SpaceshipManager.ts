import SpaceshipMaster from "./SpaceshipMaster";
import GameManager from "../ctrl/GameManager";
import DTime from "../utils/DTime";
import BoostRankValue from "../boost/BoostRankValue";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import WorldCamera from "../camera/WorldCamera";
import Constants from "../model/Constants";
import Mathf from "../utils/Mathf";
import PlanetManager from "../planet/PlanetManager";
import { SpaceshipState, BoostRank } from "../model/GameModel";
import UserData from "../data/UserData";
import CameraShakeValues from "../camera/CameraShakeValues";
import BoostMeterManager from "../ctrl/BoostMeterManager";
import VibrateManager from "../ctrl/VibrateManager";
import GuideManager from "../gameuictrl/GuideManager";
import SolarManager from "../solar/SolarManager";
import AstronautManager from "../astronaut/AstronautManager";
import MergeUserData from "../merge/data/MergeUserData";

/*
* 飞船管理;
*/
export default class SpaceshipManager{
    constructor(){
    }

    private static _instance:SpaceshipManager;
    public static get instance():SpaceshipManager
    {
        if(!this._instance)
        {
            this._instance = new SpaceshipManager();
        }
        return this._instance;
    }

    public state:SpaceshipState;
    public podsLeft:number;
    public maxPods:number;
    private _lastBoostUsed:boolean;
    private _descending:boolean;

    private _prevHeight:number;
    private _floatTimer:number;

	public get flightOnGoing():boolean
	{
		return this.state == SpaceshipState.Flying || this.state == SpaceshipState.Boosting || 
			this.state == SpaceshipState.Landing || this.state == SpaceshipState.Igniting || this.state == SpaceshipState.SwitchLevel;
	}

	public get flightOnEnd():boolean
	{
		return this.state == SpaceshipState.Landed || this.state == SpaceshipState.Exploded || 
			this.state == SpaceshipState.Floating;
	}

	public get isPodMax():boolean
	{
		return this.podsLeft >= Constants.MaxPodCount;
	}

    public start():void
    {
        this.reset();

        SpaceshipMaster.instance.start();
		this._prevHeight = SpaceshipMaster.instance.rokectPosition.z - 100;
		
		GameEventMgr.instance.addListener(GameEvent.ChangeShips, this, this.changeShips);
	}

	private changeShips():void
	{
		this.restart();
	}

	private reset():void
	{
		this.state = SpaceshipState.WaitingForIgnition;
        this.maxPods = MergeUserData.instance.rocketInfo.totalPodNum;
		this.podsLeft = this.maxPods;
		this._lastBoostUsed = false;
		this._descending = false;
		this._floatTimer = 0;
	}
	
	public restart():void
	{
		this.reset();
		SpaceshipMaster.instance.restart();
		this._prevHeight = SpaceshipMaster.instance.rokectPosition.z - 100;
	}

    // public reducePod():void
    // {
    //     this.setPodCount(this.podsLeft-1);
	// 	SoundManager.instance.playSound(MusicConfig.PlatformUpdate, false);
    // }

    // public addPod():void
    // {
	// 	this.setPodCount(this.podsLeft+1);
	// 	SoundManager.instance.playSound(MusicConfig.ShipUpdate, false);
    // }

    // public setPodCount(count:number):void
    // {
	// 	if(count > Constants.MaxPodCount || count < 1){
	// 		return;
	// 	}

	// 	this.maxPods = count;
    //     this.podsLeft = this.maxPods;
	// 	SolarManager.instance.updatePods(this.maxPods);
    //     SpaceshipMaster.instance.setPodCount(this.podsLeft);
    // }

    public update():void
    {
		if (Constants.DebugState && GameManager.instance.boostTimeLeft<0 && this.state == SpaceshipState.Flying)
		{
			this.doBoost();
		}
		
        if (this.state == SpaceshipState.Landing)
		{
			this.landingSequence();
		}

		SpaceshipMaster.instance.update();

		if(this.flightOnGoing)
		{
			this.checkFloat();
		}  
	}
	
	private checkFloat():void
	{
        if (this._descending)
		{
			return;
		}
		if (SpaceshipMaster.instance.rokectPosition.z < this._prevHeight-1)
		{
            this._descending = true;
		}
        this._prevHeight = Math.max(this._prevHeight, SpaceshipMaster.instance.rokectPosition.z);
		if (this._lastBoostUsed && !this.flightOnEnd && !PlanetManager.instance.isWithinPlanetRange)
		{
			//如果开始掉头下降了就肯定会降落到星球
			this._floatTimer += DTime.deltaTime;
			if (this._floatTimer >= Constants.FloatingCheckTime)
			{
                this.state = SpaceshipState.Floating;
                SpaceshipMaster.instance.stayInSpace();
			}
		}
	}

    public onTap(isIgnit:boolean):void
	{
		if (!isIgnit && (this.state == SpaceshipState.Flying || this.state == SpaceshipState.Boosting) && !this._lastBoostUsed)
		{
			if(GuideManager.instance.hasTapGuide == true)
			{
				this.doBoost();
			}
		}
		else if (isIgnit && this.state == SpaceshipState.WaitingForIgnition)
		{
			this.doLaunch();
		}
	}

    private doLaunch():void
    {
		this.state = SpaceshipState.Igniting;
		WorldCamera.instance.showIgniting();
		WorldCamera.instance.shake(new CameraShakeValues(0.5, 2.5));
		
		SpaceshipMaster.instance.launch();
		PlanetManager.instance.originPlanet.onLaunch();

		VibrateManager.instance.vibrate();
    }

    private doBoost():void
    {
		if (this.state == SpaceshipState.Boosting)
		{
			//策划要求推进中不能再次点击,只有Flying状态才能点击推进
			// GameManager.instance.onBoostInterrupted();
			return;
		}
        this.state = SpaceshipState.Boosting;
		let boostValues:BoostRankValue = this.getBoostValues();
		if (this.podsLeft <= 2)
		{
			this._lastBoostUsed = true;
            GameEventMgr.instance.Dispatch(GameEvent.OnLastBoostUsed);
		}
		this.boostReward(boostValues.rank);
		SpaceshipMaster.instance.startBoost(this.calculateBoostForce(), boostValues.rank, false);
		
		WorldCamera.instance.doBooste(this._lastBoostUsed, boostValues);
		VibrateManager.instance.vibrate();

		this.podsLeft --;
		GameEventMgr.instance.Dispatch(GameEvent.OnBoostStarted,[boostValues, this._lastBoostUsed]);
	}

	private boostReward(rank:BoostRank):void
	{
		//推进无奖励
		BoostMeterManager.instance.onClickBoost(rank, 0);

		// let boostCoin:number = EconomyManager.instance.levelScoreData.getScoreByRank(rank);
		// BoostMeterManager.instance.onClickBoost(rank, boostCoin);
		// GameEventMgr.instance.Dispatch(GameEvent.GameGainCoin, [boostCoin]);
	}

    public onBoostCompleted(isLastPod:boolean):void
	{
		if (!isLastPod)
		{
			this.state = SpaceshipState.Flying;
			WorldCamera.instance.showFlying();
		}
		SpaceshipMaster.instance.onBoostCompleted(isLastPod);
	}

    private calculateBoostForce():number
	{
		let time = 1 - GameManager.instance.boostTimeLeft/GameManager.instance.boostTimeMax;
		return Constants.BoostForce * Mathf.curveEvaluate(time, 1, 0);
	}

	private afkBoostForce():number
	{
		return Constants.BoostForce * Mathf.curveEvaluate(Constants.DefaultBoostRate, 1, 0);
	}

	public stillFly():void
	{
		if (this.state != SpaceshipState.Flying)
		{
			return;
		}

        this.state = SpaceshipState.Boosting;
		let boostValues:BoostRankValue = BoostRankValue.getBoostValues(Constants.DefaultBoostRate);
		if (this.podsLeft <= 2)
		{
			this._lastBoostUsed = true;
            GameEventMgr.instance.Dispatch(GameEvent.OnLastBoostUsed);
		}
		// this.boostReward(boostValues.rank);
		
        SpaceshipMaster.instance.startBoost(this.afkBoostForce(), boostValues.rank, true);
		// WorldCamera.instance.doBooste(this._lastBoostUsed, boostValues);
		VibrateManager.instance.vibrate();
		this.podsLeft --;
		GameEventMgr.instance.Dispatch(GameEvent.OnBoostStarted,[boostValues, this._lastBoostUsed]);
		//隐藏圆环
        BoostMeterManager.instance.setEnable(false);
	}

	public explode():void
	{
		if (this.state == SpaceshipState.Flying)
		{
			this.state = SpaceshipState.Exploded;
			SpaceshipMaster.instance.explode();
			WorldCamera.instance.shake(new CameraShakeValues(1, 1));
			VibrateManager.instance.vibrate();
			AstronautManager.instance.onExplode();
		}
	}

	public reborn():void
	{
		this.state = SpaceshipState.Flying;
		WorldCamera.instance.showFlying();
		WorldCamera.instance.shake(new CameraShakeValues(1, 1));

		SpaceshipMaster.instance.reborn();
	}

    public onLand():void
	{
		GuideManager.instance.onLand();
		VibrateManager.instance.vibrate();
        SpaceshipMaster.instance.onLand();
		this.state = SpaceshipState.Landed;
	}

	private landingSequence():void
	{
		if(PlanetManager.instance.isWithinPlanetRange)
		{
			SpaceshipMaster.instance.land();
		}
	}

	public getBoostValues():BoostRankValue
	{
		let num:number = 1 - GameManager.instance.boostTimeLeft/GameManager.instance.boostTimeMax;
		num = Math.min(1, num);
		return BoostRankValue.getBoostValues(num);
	}

}