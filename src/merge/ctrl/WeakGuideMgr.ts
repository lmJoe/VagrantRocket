import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import MergePageMgr from "../../gameuictrl/MergePageMgr";
import UIManager from "../../ctrl/UIManager";
import MergeDefine from "../data/MergeDefine";
import MergeShipMgr from "./MergeShipMgr";
import { WeakGuideType } from "../../model/GameModel";
import PowerUpMgr from "./PowerUpMgr";
import MergeUserData from "../data/MergeUserData";
import WeakGuidePopupMgr from "../../gameuictrl/WeakGuidePopupMgr";

/*
* WeakGuideMgr;
*/
export default class WeakGuideMgr
{
    constructor()
    {
    }
    
    private static _instance:WeakGuideMgr;
    public static get instance():WeakGuideMgr
    {
        if(!this._instance)
        {
            this._instance = new WeakGuideMgr();
        }
        return this._instance;
    }

    private _countTime:number;
    private _hasShowWeakGuide:boolean;

    public start():void
    {
        GameEventMgr.instance.addListener(GameEvent.OnBeginDrag, this, this.onCombinaShip);
        GameEventMgr.instance.addListener(GameEvent.CombinationShip, this, this.onCombinaShip);
        GameEventMgr.instance.addListener(GameEvent.BuyShip, this, this.onBuyShip);
        GameEventMgr.instance.addListener(GameEvent.OnLaunched, this, this.onLaunch);
        GameEventMgr.instance.addListener(GameEvent.OnWeakGuideClickClose, this, this.hideGuide);

        this._countTime = 0;
        this._hasShowWeakGuide = false;
    }


    private onCombinaShip():void
    {
        this.hideGuide();
    }

    private onBuyShip():void
    {
        this.hideGuide();
    }

    private onLaunch():void
    {
        this.hideGuide();
    }

    public update(deltaTime:number):void
    {
        if(MergePageMgr.instance.inShow && UIManager.instance.hasPopup == false)
        {
            if(!this._hasShowWeakGuide)
            {
                this._countTime += deltaTime;
                if(this._countTime >= MergeDefine.WeakGuideTime)
                {
                    this.showGuide();
                }
            }
        }else{
            this._countTime = 0;
        }
    }

    private hideGuide():void
    {
        this._countTime = 0;
        if(this._hasShowWeakGuide)
        {
            this._hasShowWeakGuide = false;
            //
            WeakGuidePopupMgr.instance.close();
        }
    }

    private showGuide():void
    {
        //检查合成
        let targetItems = MergeShipMgr.instance.checkCanMerege();
        if(targetItems && targetItems.length == 2)
        {
            this.doShowGuide(WeakGuideType.Merge, {List:targetItems});
            return;
        }
        //检查购买
        let costMoney = PowerUpMgr.getShopPirceWithDiscountBuff( PowerUpMgr.getMostCostEffectiveShipId() );
        if(MergeShipMgr.instance.getNoHaveShipsLength()>0 && MergeUserData.instance.judgeMoneyIsFull(costMoney))
        {
            this.doShowGuide(WeakGuideType.Buy);
            return;
        }
        //检查购买
        this.doShowGuide(WeakGuideType.Fly);
    }

    private doShowGuide(type:WeakGuideType, data?:any):void
    {
        if(this._hasShowWeakGuide)
        {
            return;
        }
        this._hasShowWeakGuide = true;
        //
        WeakGuidePopupMgr.instance.show(type, data);
    }



}