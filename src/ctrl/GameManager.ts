import Constants from "../model/Constants";
import SpaceshipManager from "../ship/SpaceshipManager";
import WorldCamera from "../camera/WorldCamera";
import PlanetManager from "../planet/PlanetManager";
import BackgroundManager from "../background/BackgroundManager";
import UIManager from "./UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import DTime from "../utils/DTime";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import BoostRankValue from "../boost/BoostRankValue";
import Mathf from "../utils/Mathf";
import { FlightEndCause, SpaceshipState, FlyGuideType, FPSScene } from "../model/GameModel";
import ShaftManager from "./ShaftManager";
import UserData from "../data/UserData";
import SceneController from "../scene/SceneController";
import BoostMeterManager from "./BoostMeterManager";
import GameInfoMgr from "../gameuictrl/GameInfoMgr";
import BalancePageMgr from "../gameuictrl/BalancePageMgr";
import SoundManager from "./SoundManager";
import MusicConfig from "../config/MusicConfig";
import DataStatisticsMgr from "./DataStatisticsMgr";
import GuideManager from "../gameuictrl/GuideManager";
import AstronautManager from "../astronaut/AstronautManager";
import MergePageMgr from "../gameuictrl/MergePageMgr";
import MergeUserData from "../merge/data/MergeUserData";
import GameSceneMgr from "./GameSceneMgr";
import CameraShakeValues from "../camera/CameraShakeValues";
import CommentNoticeMgr from "../gameuictrl/CommentNoticeMgr";
import StarManager from "./StarManager";
import FPSStatistics from "./FPSStatistics";

/*
* 游戏逻辑控制;
*/
export default class GameManager{
    constructor(){
    }

    private static _instance:GameManager;
    public static get instance():GameManager
    {
        if(!this._instance)
        {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    private _gameDistance:number;
    private _igniting:boolean;
    private _inGame:boolean;
    private _inLevelSwitching:boolean;//切关

    private _boostTimeLeft:number;
    private _boostTimeMax:number;
    private _ignitionTimeLeft:number;
    private _lastPod:boolean;


    public get boostTimeLeft():number
    {
        return this._boostTimeLeft;
    }
    public get boostTimeMax():number
    {
        return this._boostTimeMax;
    }

    public start():void
    {
        //注意顺序
        ShaftManager.instance.start();
        SpaceshipManager.instance.start();
        WorldCamera.instance.start();
        PlanetManager.instance.start();
        BackgroundManager.instance.start();
        AstronautManager.instance.start();
        
        CommentNoticeMgr.instance.show();
    }

    //进入关卡星系
    public enter():void
    {
        //进去关卡星系
        Constants.AccessingSolarSystem = true;
        WorldCamera.instance.show();
        this.reset();
        //重置其他
        SpaceshipManager.instance.restart();
        WorldCamera.instance.reset();
        PlanetManager.instance.reset();
        BackgroundManager.instance.reset();
        AstronautManager.instance.reset();
        // 加载首页
        MergePageMgr.instance.show();
        this.addEvents();
    }
    
    //离开关卡星系
    public leave():void
    {
        MergePageMgr.instance.close();
        GameInfoMgr.instance.close();
        WorldCamera.instance.hide();
        this.removeEvents();
        SpaceshipMaster.instance.clearRocketFX();
    }

    private addEvents():void
    {
        Laya.timer.frameLoop(1,this,this.gameUpdate);

        GameEventMgr.instance.addListener(GameEvent.OnLaunched, this, this.onLaunched);
        GameEventMgr.instance.addListener(GameEvent.OnBoostStarted, this, this.onBoostStarted);
        GameEventMgr.instance.addListener(GameEvent.OnFlightEnded, this, this.onFlightEnded);

        // GameEventMgr.instance.addListener(GameEvent.OnClickAddPod, this, this.onAddPod);
        // GameEventMgr.instance.addListener(GameEvent.OnClickReducePod, this, this.onReducePod);
        GameEventMgr.instance.addListener(GameEvent.OnClickToBoost, this, this.onClickToBoost);
        GameEventMgr.instance.addListener(GameEvent.onRestartGame, this, this.onClickToRestart);
        GameEventMgr.instance.addListener(GameEvent.onForceRestartGame, this, this.onForceRestartGame);
        GameEventMgr.instance.addListener(GameEvent.onRebornGame, this, this.onRebornGame);

        GameEventMgr.instance.addListener(GameEvent.BoostMeterMovieEnd, this, this.boosterMovieEnd);

        GameEventMgr.instance.addListener(GameEvent.OnStartStarDialog, this, this.onStartStarDialog);
        GameEventMgr.instance.addListener(GameEvent.OnEndStarDialog, this, this.onEndStarDialog);
    }

    private removeEvents():void
    {
        Laya.timer.clear(this,this.gameUpdate);

        GameEventMgr.instance.removeListener(GameEvent.OnLaunched, this, this.onLaunched);
        GameEventMgr.instance.removeListener(GameEvent.OnBoostStarted, this, this.onBoostStarted);
        GameEventMgr.instance.removeListener(GameEvent.OnFlightEnded, this, this.onFlightEnded);

        // GameEventMgr.instance.removeListener(GameEvent.OnClickAddPod, this, this.onAddPod);
        // GameEventMgr.instance.removeListener(GameEvent.OnClickReducePod, this, this.onReducePod);
        GameEventMgr.instance.removeListener(GameEvent.OnClickToBoost, this, this.onClickToBoost);
        GameEventMgr.instance.removeListener(GameEvent.onRestartGame, this, this.onClickToRestart);
        GameEventMgr.instance.removeListener(GameEvent.onForceRestartGame, this, this.onForceRestartGame);
        GameEventMgr.instance.removeListener(GameEvent.onRebornGame, this, this.onRebornGame);

        GameEventMgr.instance.removeListener(GameEvent.BoostMeterMovieEnd, this, this.boosterMovieEnd);

        GameEventMgr.instance.removeListener(GameEvent.OnStartStarDialog, this, this.onStartStarDialog);
        GameEventMgr.instance.removeListener(GameEvent.OnEndStarDialog, this, this.onEndStarDialog);
    }

    //solar游戏中 暂定
    public stopGame():void
    {
        Laya.timer.clear(this,this.gameUpdate);
        Laya.SoundManager.musicMuted = true;
        Laya.SoundManager.soundMuted = true;
    }
    
    public continueGame():void
    {
        Laya.timer.frameLoop(1,this,this.gameUpdate);
        Laya.SoundManager.musicMuted = false;
        Laya.SoundManager.soundMuted = false;
    }

    private gameUpdate():void
    {
        if(this._inGame)
        {
            GameManager.instance.update();
            PlanetManager.instance.update();
            BackgroundManager.instance.update();
            //不用出现宇航员进入飞船动画
            AstronautManager.instance.update();
        }
        SpaceshipManager.instance.update();
        WorldCamera.instance.update();
        ShaftManager.instance.update();
    }
    
    private update():void
    {
        if(this._inLevelSwitching || SpaceshipManager.instance.flightOnEnd)
        {   
            return;
        }

        if (!this._igniting && SpaceshipManager.instance.state != SpaceshipState.Boosting && SpaceshipManager.instance.state != SpaceshipState.WaitingForIgnition)
		{
            this._boostTimeLeft -= DTime.deltaTime;
            //检查引导
			if(GuideManager.instance.hasTapGuide == false && this._boostTimeLeft < 0.3)
			{
                GuideManager.instance.showGuide(FlyGuideType.Tap);
            }else if(GuideManager.instance.hasBoomGuide == false && this._boostTimeLeft < 0.03)
            {
                GuideManager.instance.showGuide(FlyGuideType.Boom);
            }
            //爆炸检测
            if (this._boostTimeLeft < -0.03)
            {
                //不再爆炸 改为默认飞行
                SpaceshipManager.instance.stillFly();
                // SpaceshipManager.instance.explode();
            }
        }
        if( SpaceshipManager.instance.flightOnGoing )
        {
            this.calcGameDistance();
        }
    }
    
    private calcGameDistance():void
    {
        let newDistance:number = SpaceshipMaster.instance.altitude*MergeUserData.instance.rocketInfo.power;
        this._gameDistance = Math.max(this._gameDistance, Math.floor( newDistance ) );
        GameInfoMgr.instance.updateGameDistace(this._gameDistance);

        if(UserData.instance.totalDiscoverIndex < Constants.SolarNum)
        {
            let levelFlewDistance:number = UserData.instance.levelFlewDistance;
            if(levelFlewDistance + this._gameDistance >= UserData.instance.levelDistance)
            {
                this._inLevelSwitching = true;
                this.switchLevel();
            }
        }
    }

    private switchLevel():void
    {
        GameSceneMgr.instance.gotoNextLevel();
        SpaceshipManager.instance.state = SpaceshipState.SwitchLevel;
        WorldCamera.instance.setTarget(SpaceshipMaster.instance.rokect.transform, new Laya.Vector3(0, 30, 0), 4, 1);

        this._inGame = false;
        this.addDistance();
        BoostMeterManager.instance.setEnable(false);
        GameInfoMgr.instance.close();
        //强制算登陆成功
        PlanetManager.instance.onLanded();
    }

    private onClickToRestart():void
    {
        this.reset();

        SpaceshipManager.instance.restart();
        WorldCamera.instance.reset();
        PlanetManager.instance.reset();
        BackgroundManager.instance.reset();
        AstronautManager.instance.reset();

        MergePageMgr.instance.show();
    }

    private onForceRestartGame():void
    {
        this.reset();

        SpaceshipManager.instance.restart();
        WorldCamera.instance.reset();
        PlanetManager.instance.reset();
        BackgroundManager.instance.reset();
        AstronautManager.instance.reset();

        Laya.timer.clear(this, this.onClickToBoost);
        Laya.timer.frameOnce(2, this, this.onClickToBoost, [true]);
    }

    private onRebornGame():void
    {
        SpaceshipManager.instance.reborn();
        this._boostTimeLeft = 0.02;

        this._inGame = true;
        SoundManager.instance.playMusic(MusicConfig.GameBgm);
        BoostMeterManager.instance.setEnable(true);
    }

    private reset():void
    {
        this._gameDistance = 0;
        this._igniting = false;
        this._inGame = false;
        this._inLevelSwitching = false;

        SceneController.instance.clearShipParent();
        // EconomyManager.instance.startGame();
        //游戏信息
        GameInfoMgr.instance.show();

        SoundManager.instance.playMusic(MusicConfig.GameBgm);
    }

    private onClickToBoost(isIgnit:boolean):void
    {
        SpaceshipManager.instance.onTap(isIgnit);
    }

    //点火发射
    private onLaunched():void
    {
		this._boostTimeMax = Constants.BoostMeterTimeMinMax.y;
        this._boostTimeLeft = this._boostTimeMax;
        BoostMeterManager.instance.onStartBoostRotate(this._boostTimeMax);
        this.doLaunched();
        //
        FPSStatistics.instance.start(FPSScene.Fly);
    }

    private doLaunched():void
    {
		Laya.timer.clear(this,this.ignitionSequence);

        this._igniting = true;
        this._inGame = true;

        this._ignitionTimeLeft = SpaceshipMaster.instance.IgnitionTime;
		Laya.timer.frameLoop(1,this,this.ignitionSequence);
	}

	private ignitionSequence()
	{	
        if(SpaceshipManager.instance.state == SpaceshipState.SwitchLevel)
        {
            Laya.timer.clear(this,this.ignitionSequence);
            return;
        }

        this._ignitionTimeLeft -= DTime.deltaTime;
        if(this._ignitionTimeLeft <= 1)
        {
            BoostMeterManager.instance.setEnable(true);
        }
        if(this._ignitionTimeLeft <= 0)
        {
            this._igniting = false;
            Laya.timer.clear(this,this.ignitionSequence);
        }
	}

    public onBoostInterrupted():void
	{
		this._boostTimeLeft = this._boostTimeMax;
	}

    private onBoostStarted(boost:BoostRankValue, lastPod:boolean):void
    {
        this.doBoost(lastPod);
    }

    private doBoost(lastPod:boolean):void
    {
        Laya.timer.clear(this,this.boostSequence);
        this._lastPod = lastPod
        this._boostSequenceTime = 0;
		Laya.timer.frameLoop(1,this,this.boostSequence);
	}

    private _boostSequenceTime:number;
    private boostSequence()
	{
        this._boostSequenceTime += DTime.deltaTime;
        //推进加速时间
        if(this._boostSequenceTime < Constants.BoostTime)
        {
            return;
        }
        Laya.timer.clear(this,this.boostSequence);
		if (this._lastPod)
		{
            if(PlanetManager.instance.isWithinPlanetRange)
            {
                PlanetManager.instance.setLandingPlanet();
            }else{
                this.doPlanetNotReached();
            }
            SpaceshipManager.instance.state = SpaceshipState.Landing;
            if(GuideManager.instance.hasBoomGuide == false)
            {
                GuideManager.instance.doBoomGuide();
            }
		}
		else
		{
            //获取下一节 推进时间
            this.startBoostRotate();
		}
        SpaceshipManager.instance.onBoostCompleted(this._lastPod);
    }
    
    private startBoostRotate():void
    {
        let t = (SpaceshipManager.instance.podsLeft-1)/(SpaceshipManager.instance.maxPods-1)
        this._boostTimeMax = Mathf.lerp(Constants.BoostMeterTimeMinMax.x, Constants.BoostMeterTimeMinMax.y, t);
        this._boostTimeLeft = this._boostTimeMax;

        //显示圆环
        if(SpaceshipManager.instance.state != SpaceshipState.SwitchLevel)
        {
            BoostMeterManager.instance.setEnable(true);
            BoostMeterManager.instance.onStartBoostRotate(this._boostTimeMax);
        }
    }

    private doPlanetNotReached():void
    {
        Laya.timer.clear(this,this.planetNotReachedSequence);
        Laya.timer.frameLoop(1,this,this.planetNotReachedSequence);
    }

    private planetNotReachedSequence():void
	{
        if(SpaceshipMaster.instance.descendSpeed <= 0.2)
        {
            Laya.timer.clear(this,this.planetNotReachedSequence);
            this.onFlightEnded(FlightEndCause.StayedInSpace);
        }
	}

    private boosterMovieEnd():void
    {
        if(this._lastPod)
        {
            BoostMeterManager.instance.setEnable(false);
        }
    }

    private onStartStarDialog():void
    {
        
    }

    private onEndStarDialog():void
    {
        BalancePageMgr.instance.show();
    }

    private onFlightEnded(endCause:FlightEndCause):void
    {
        FPSStatistics.instance.end();
        // this._inGame = false;
        SoundManager.instance.playMusic(MusicConfig.EndBgm);
        BoostMeterManager.instance.setEnable(false);
        if(endCause == FlightEndCause.Landed)
        {
            //统计降落次数
            UserData.instance.updateflySucCount();
            this.addDistance();
        }

        let winGame:boolean = endCause == FlightEndCause.Landed;
        if(winGame)
        {
            DataStatisticsMgr.instance.stat("飞行成功",{"高度":this._gameDistance.toString()});
        }else{
            DataStatisticsMgr.instance.stat("飞行失败",{"高度":this._gameDistance.toString()});
        }

        Laya.timer.clear(this,this.doFlightEnd);
        this._doFlightEndTime = 0;
        Laya.timer.frameLoop(1,this,this.doFlightEnd,[endCause]);
    }

    private _doFlightEndTime:number;
    private doFlightEnd(endCause:FlightEndCause):void
    {
		switch (endCause)
		{
            case FlightEndCause.Landed:
                this.onFlightLanded();
                break;
            case FlightEndCause.Exploded:
                this.onFlightExploded();
                break;
            case FlightEndCause.StayedInSpace:
                this.onFlightStayedInSpace();
                break;
		}
    }

    private onFlightLanded():void
	{
        this._doFlightEndTime += DTime.deltaTime;
        if(this._doFlightEndTime < 3)//1
        {
            return;
        }
        Laya.timer.clear(this,this.doFlightEnd);
        GameEventMgr.instance.Dispatch(GameEvent.OnGameOver,[FlightEndCause.Landed, false]);
        //
        PlanetManager.instance.onLanded();
        StarManager.instance.onLand();
	}

	private onFlightExploded():void
	{
        this._doFlightEndTime += DTime.deltaTime;

        //播放动画 延迟显示界面
        if(this._doFlightEndTime < 2.5)
        {
            return;
        }
        Laya.timer.clear(this,this.doFlightEnd);

        if(GuideManager.instance.hasLanded == false)
        {
            GuideManager.instance.showGuide(FlyGuideType.Reborn);
        }else{
            GameEventMgr.instance.Dispatch(GameEvent.OnGameOver,[FlightEndCause.Exploded, false]);
            BalancePageMgr.instance.show();
        }
	}

	private onFlightStayedInSpace():void
	{
        this._doFlightEndTime += DTime.deltaTime;
        if(this._doFlightEndTime < 0.1)
        {
            return;
        }
        Laya.timer.clear(this,this.doFlightEnd);
        GameEventMgr.instance.Dispatch(GameEvent.OnGameOver,[FlightEndCause.StayedInSpace, false]);
        BalancePageMgr.instance.show();
    }
    
    // private onAddPod():void
	// {
    //     SpaceshipManager.instance.addPod();
    // }
    
    // private onReducePod():void
	// {
    //     SpaceshipManager.instance.reducePod();
    // }

    private addDistance():void
    {
        debugger
        UserData.instance.addFlyDistance(this._gameDistance);
    }
}