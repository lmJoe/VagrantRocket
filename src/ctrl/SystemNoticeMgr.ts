import DTime from "../utils/DTime";
import CommentMgr from "./CommentMgr";
import CommentNoticeMgr from "../gameuictrl/CommentNoticeMgr";
import ReddotEffectMgr from "./ReddotEffectMgr";
import FPSStatistics from "./FPSStatistics";

/*
* 游戏通知;
*/
export default class SystemNoticeMgr{
    constructor(){
    }

    private static _instance:SystemNoticeMgr;
    public static get instance():SystemNoticeMgr
    {
        if(!this._instance)
        {
            this._instance = new SystemNoticeMgr();
        }
        return this._instance;
    }

    public start():void
    {
        CommentMgr.instance.start();
        
        this.addEvents();
    }
    
    private addEvents():void
    {
        Laya.timer.frameLoop(1,this,this.update);
    }
    
    private update():void
    {
        let delatTime = DTime.deltaTimeMs;
        //评论通知
        CommentMgr.instance.update();
        CommentNoticeMgr.instance.update(delatTime);
        
        //红点特效
        ReddotEffectMgr.instance.update(delatTime);
        
        //红点特效
        FPSStatistics.instance.update();
    }
}