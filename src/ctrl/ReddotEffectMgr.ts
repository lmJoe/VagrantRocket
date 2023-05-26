import DTime from "../utils/DTime";
import ReddotEffectData from "../model/ReddotEffectData";

/*
* 红点动效管理
*/
export default class ReddotEffectMgr{
    constructor(){
        this.init();
    }

    private static _instance:ReddotEffectMgr;
    public static get instance():ReddotEffectMgr
    {
        if(!this._instance)
        {
            this._instance = new ReddotEffectMgr();
        }
        return this._instance;
    }

    private _reddotList:Array<ReddotEffectData>;

    private _timeCount:number;

    private init():void
    {
        this._reddotList = [];
        this._timeCount = 0;
    }
    
    public update(delatTime:number):void
    {
        this._timeCount += delatTime;
        if(this._timeCount >= 200)
        {
            this._timeCount = 0;
            this.doEffect();
        }
    }

    private doEffect():void
    {
        this._reddotList.forEach(eft => {
            if(eft && eft.reddot)
            {
                eft.reddot.scale(eft.totalScale-eft.reddot.scaleX, eft.totalScale-eft.reddot.scaleY);
            }
        });
    }

    public addEffect(reddot:Laya.Image, baseScale:number, maxRate:number=1.2):void
    {
        if(!reddot){
            return;
        }
        this.clearEffect(reddot);

        reddot.scale(baseScale, baseScale);
        let eft:ReddotEffectData = new ReddotEffectData(reddot, baseScale, maxRate);
        this._reddotList.push(eft);
    }

    public clearEffect(reddot:Laya.Image):void
    {
        if(!reddot){
            return;
        }
        for(var i=this._reddotList.length-1; i>=0; i--)
        {
            let eft = this._reddotList[i];
            if(eft && eft.reddot == reddot)
            {
                this._reddotList.splice(i, 1);
                eft = null;
            }
        }
    }
}