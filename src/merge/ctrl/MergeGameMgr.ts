import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import MergePageMgr from "../../gameuictrl/MergePageMgr";
import MergeShipMgr from "./MergeShipMgr";
import MergeUserData from "../data/MergeUserData";
import PowerUpMgr from "./PowerUpMgr";
import Constants from "../../model/Constants";
import DTime from "../../utils/DTime";
import ShopMgr from "./ShopMgr";
import WeakGuideMgr from "./WeakGuideMgr";
import SignManager from "../../ctrl/SignManager";

/*
* 合成游戏逻辑
*/
export default class MergeGameMgr
{
    private static _instance:MergeGameMgr;
    public static get instance():MergeGameMgr
    {
        if(!this._instance)
        {
            this._instance = new MergeGameMgr();
        }
        return this._instance;
    }

    constructor()
    {
    }

    private _inGameShow:boolean=true;
    private _timeCount:number;

    public start():void
    {
        this._timeCount = 0;
        MergeShipMgr.instance.start();
        ShopMgr.instance.start();
        WeakGuideMgr.instance.start();
        this.addEvent();
    }

    private addEvent():void
    {
        Laya.timer.frameLoop(1, this, this.onFrame);
    }

    private onFrame():void
    {
        let deltaTime = DTime.deltaTimeMs;
        this._timeCount += deltaTime;
        //更新产出
        if(MergePageMgr.instance.inShow)
        {
            MergeShipMgr.instance.update(deltaTime);
        }else{
            PowerUpMgr.refreshAllShipEarnings(deltaTime);
        }
        //免费获取火箭 -- 指看广告,经过ShopVideoGetShipTime后可显示一次商店看广告机会
        if(MergeUserData.instance.ShopVideoGetShipTime>0)
        {
            MergeUserData.instance.ShopVideoGetShipTime -= deltaTime;
            if( MergeUserData.instance.ShopVideoGetShipTime <= 0 )
            {
                MergeUserData.instance.ShopVideoGetShipTime = 0;
                GameEventMgr.instance.Dispatch(GameEvent.RefreshShopRedPoint);//UI
            }
        }
        //免费奖励 -- 宝箱
        if (MergeUserData.instance.FreeBonusTime > 0)
		{
            MergeUserData.instance.FreeBonusTime -= deltaTime;
            if( MergeUserData.instance.FreeBonusTime <= 0 )
            {
                MergeUserData.instance.FreeBonusTime = 0;
                GameEventMgr.instance.Dispatch(GameEvent.FreeBonusTime);
            }
        }
        //免费奖励展示 -- 宝箱展示时间
        if (MergeUserData.instance.ShowFreeBonusTime > 0)
		{
            MergeUserData.instance.ShowFreeBonusTime -= deltaTime;
			if (MergeUserData.instance.ShowFreeBonusTime <= 0)
			{
                MergeUserData.instance.ShowFreeBonusTime = 0;
                GameEventMgr.instance.Dispatch(GameEvent.ShowFreeBonusTime);
			}
        }
        //5倍加速 产出数值加倍
        if (MergeUserData.instance.Money5Time > 0)
        {
            MergeUserData.instance.Money5Time -= deltaTime;
            if (MergeUserData.instance.Money5Time <= 0)
            {
                MergeUserData.instance.Money5Time = 0;
                GameEventMgr.instance.Dispatch(GameEvent.Refresh_5_SpeedUp);
            }
        }
        //2倍加速时间 真实时间减一半
        if (MergeUserData.instance.speedUpTime > 0)
		{
            if (MergeUserData.instance.speedUp.durationTime > 0)
			{
                MergeUserData.instance.speedUp.durationTime -= deltaTime;
			}
			if (MergeUserData.instance.speedUp.durationTime <= 0)
			{
                MergeUserData.instance.speedUp.durationTime = 0;
                GameEventMgr.instance.Dispatch(GameEvent.StopSpeedUp);
            }
            GameEventMgr.instance.Dispatch(GameEvent.SpeedUpTimeCount);
        }
        //离线时间记录 -- 每30秒记录一次
        if(this._inGameShow && this._timeCount >= 30000)
        {
            this._timeCount = 0;
            MergeUserData.instance.saveOffLineTime();
        }
        //弱引导
        WeakGuideMgr.instance.update(deltaTime);
    }

    /* **
     * firstShow:boolean 进入游戏首次gameshow
     * TODO：整合ForceShowSignPopup与RefreshOnLineReward事件，做成启动弹窗事件和管理
     */
    public gameShow(firstShow:boolean):void
    {
        this._inGameShow = true;
        if(firstShow && SignManager.instance.getCanForceShowSign())
        {
            GameEventMgr.instance.Dispatch(GameEvent.ForceShowSignPopup);
        }else
        {
            GameEventMgr.instance.Dispatch(GameEvent.RefreshOnLineReward);
        }
    }
    
    public gameHide():void
    {
        this._inGameShow = false;
        MergeUserData.instance.saveOffLineTime();
    }

}