import DataStatisticsMgr from "./DataStatisticsMgr";
import { FPSScene, FPSMode } from "../model/GameModel";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* FPS统计
*/
export default class FPSStatistics{
    constructor(){
        this.init();
    }

    private static _instance:FPSStatistics;
    public static get instance():FPSStatistics
    {
        if(!this._instance)
        {
            this._instance = new FPSStatistics();
        }
        return this._instance;
    }

    private _totalTime:number;
    private _count:number;

    private _state:FPSScene;
    private _isActive:boolean;

    private _lastFPSRange:string;

    private _sendCount:number;
    private _lastFPSList:Array<number>;

    private _FPSMode:FPSMode;

    public get lowFps():boolean
    {
        return this._FPSMode == FPSMode.Low;
    }

    private init():void
    {
        this.reset();
        this._sendCount = 0;
        this._lastFPSList = [];
        this._FPSMode = FPSMode.High;
    }

    private reset():void
    {
        this._totalTime = 0;
        this._count = 0;
        this._isActive = false;
        this._state = FPSScene.None;

        this._lastFPSRange = "";
    }

    public start(state:FPSScene):void
    {
        if(this._state != state)
        {
            this.reset();
        }
        this._isActive = true;
        this._state = state;
    }

    public end():void
    {
        if(this._count >= 300)
        {
            this.sendFPS();
        }
        this.reset();
    } 
    
    public update():void
    {
        if(!this._isActive || this._state == FPSScene.None)
        {
            return;
        }

        this._totalTime += Laya.timer.delta;
        this._count ++;

        //60FPS情况，10秒统计一次
        if(this._count>=600)
        {
            this.sendFPS();

            this._count = 0;
            this._totalTime = 0;
        }
    }

    private sendFPS():void
    {
        let averageDelta = this._totalTime / this._count;
        let averageFPS:number = 1000 / averageDelta;

        let temp:number = averageFPS / 10;
        let maxFPS:number = Math.ceil(temp)*10;
        let minFPS:number = Math.floor(temp)*10;
        let msg:string = minFPS+"-"+maxFPS;

        //不加限制
        // if(this._lastFPSRange!="" && this._lastFPSRange==msg)
        // {
        //     return;
        // }
        // this._lastFPSRange = msg;

        let title:string = "FPS统计"+"-"+this.getScene()+"-"+this.getDevice();
        DataStatisticsMgr.instance.stat(title,{"范围":msg});

        this.countFPS(averageFPS);
    }

    private countFPS(averageFPS:number):void
    {
        this._sendCount ++;
        this._lastFPSList.push(averageFPS);
        if(this._lastFPSList.length>=3)
        {
            let value:number=0;
            for (let i = this._lastFPSList.length-1; i >=this._lastFPSList.length-3; i--) 
            {
                value += this._lastFPSList[i];
            }
            this._lastFPSList.shift();

            if(value < 90)
            {
                //最近三次FPS均值小于30帧
                this.changeFPSMode(FPSMode.Low);
            }
            else if(value > 150)
            {
                //最近三次FPS均值大于50帧
                this.changeFPSMode(FPSMode.High);
            }
            else
            {
                //最近三次FPS均值30-50帧
                this.changeFPSMode(FPSMode.Middle);
            }
        }
    }

    private changeFPSMode(mode:FPSMode):void
    {
        if(this._FPSMode <= mode)
        {
            //只能降低FPS模式(防止因为降低特效后，FPS回升，又开放特效)
            return;
        }

        if(this._FPSMode != mode)
        {
            this._FPSMode = mode;
            switch(this._FPSMode)
            {
                case FPSMode.Low:
                    GameEventMgr.instance.Dispatch(GameEvent.OnFPSLow);
                    console.log("low fps!");
                    break;
                case FPSMode.Middle:
                    GameEventMgr.instance.Dispatch(GameEvent.OnFPSMiddle);
                    console.log("middle fps!");
                    break;
                case FPSMode.High:
                    GameEventMgr.instance.Dispatch(GameEvent.OnFPSHigh);
                    console.log("high fps!");
                    break;
            }
        }
    }

    private getScene():string
    {
        switch(this._state)
        {
            case FPSScene.None:
                return "无";
            case FPSScene.Merge:
                return "合成";
            case FPSScene.Fly:
                return "飞行";
            case FPSScene.Galaxy:
                return "星际";
        }
    }

    private getDevice():string
    {
        if(Laya.Browser.onAndroid)
        {
            return "Android";
        }else if(Laya.Browser.onIOS){
            return "IOS";
        }else{
            return "其他";
        }
    }
}