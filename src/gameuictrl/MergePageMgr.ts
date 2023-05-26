import MergePageUI from "../gameui/MergePageUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import MergeShipMgr from "../merge/ctrl/MergeShipMgr";
import MergeUserData from "../merge/data/MergeUserData";
import ShopMgr from "../merge/ctrl/ShopMgr";
import GameJsonConfig from "../config/GameJsonConfig";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import Mathf from "../utils/Mathf";
import MergeDefine from "../merge/data/MergeDefine";
import ShipItem from "../merge/item/ShipItem";
import TipDialogMgr from "./TipDialogMgr";
import AirDropPopupMgr from "./AirDropPopupMgr";
import FreeGainShipPopupMgr from "./FreeGainShipPopupMgr";
import UnlockNewShipPopupMgr from "./UnlockNewShipPopupMgr";
import Util from "../utils/Util";
import SpeedUpPopupMgr from "./SpeedUpPopupMgr";
import ShopPopupMgr from "./ShopPopupMgr";
import AstronautManager from "../astronaut/AstronautManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
// import RankPopupMgr from "./RankPopupMgr";
import SettingPopupMgr from "./SettingPopupMgr";
import GameSceneMgr from "../ctrl/GameSceneMgr";
import { MergeGuideType, SkinType, FPSScene } from "../model/GameModel";
import MergeGuideManager from "../merge/ctrl/MergeGuideManager";
import OffLinePopupMgr from "./OffLinePopupMgr";
import CoinRainMgr from "./CoinRainMgr";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import WorldCamera from "../camera/WorldCamera";
import UserData from "../data/UserData";
import SkinPopupMgr from "./SkinPopupMgr";
import SkinManager from "../ctrl/SkinManager";
import NewSkinPopupMgr from "./NewSkinPopupMgr";
import ChangeSkinPopupMgr from "./ChangeSkinPopupMgr";
import NationPopupMgr from "./NationPopupMgr";
import NationManager from "../ctrl/NationManager";
import SignPopupMgr from "./SignPopupMgr";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import StarManualPopupMgr from "./StarManualPopupMgr";
import NpcDialogManager from "./NpcDialogManager";
import RecommendPopupMgr from "./RecommendPopupMgr";
import FPSStatistics from "../ctrl/FPSStatistics";
import WxHandler from "../wx/WxHandler";
import UpgradeBonusPopupMgr from "./UpgradeBonusPopupMgr";

/*
* MergePageMgr;
*/
export default class MergePageMgr
{
    constructor(){
        this.init();
    }

    private static _instance:MergePageMgr;
    public static get instance():MergePageMgr
    {
        if(!this._instance)
        {
            this._instance = new MergePageMgr();
        }
        return this._instance;
    }

    private _ui:MergePageUI;
    private _inShow:boolean;
    private _inSelling:boolean;

    private _curShipId:number;

    public get ui():MergePageUI
    {
        return this._ui;
    }

    public get inShow():boolean
    {
        return this._inShow && this._ui.parent!=null;
    }

    private init():void
    {
        this._ui = new MergePageUI();
        this._inShow = false;
        this._inSelling = false;

        this.addEvent();
        this.initPage();
    }
    
    private addEvent():void
    {
        //界面控制
        GameEventMgr.instance.addListener(GameEvent.OnMerge_ClickEvent, this, this.onUIClick);
        GameEventMgr.instance.addListener(GameEvent.OnMerge_MouseMove, this, this.onUIMouseMove);
        GameEventMgr.instance.addListener(GameEvent.OnMerge_MouseDown, this, this.onUIMouseDown);
        GameEventMgr.instance.addListener(GameEvent.OnMerge_MouseUp, this, this.onUIMouseUp);
        GameEventMgr.instance.addListener(GameEvent.OnRemoveAllPopup, this, this.onRemoveAllPopup);
        //
        GameEventMgr.instance.addListener(GameEvent.RefreshEarnings, this, this.refreshEarnings);
        GameEventMgr.instance.addListener(GameEvent.ChangeLevel, this, this.changeLevel);
        GameEventMgr.instance.addListener(GameEvent.RefreshOnLineReward, this, this.refreshOnlineReward);
        GameEventMgr.instance.addListener(GameEvent.ForceShowSignPopup, this, this.forceShowSignPopup);
        GameEventMgr.instance.addListener(GameEvent.RefreshGameDistance, this, this.refreshGameDistanceSlider);
        GameEventMgr.instance.addListener(GameEvent.FreeBonusTime, this, this.freeBonusTime);
        GameEventMgr.instance.addListener(GameEvent.ShowFreeBonusTime, this, this.showFreeBonusTime);
        GameEventMgr.instance.addListener(GameEvent.UnLockShips, this, this.unLockShips);
        GameEventMgr.instance.addListener(GameEvent.StartShengjiEffect, this, this.startShengjiEft);

        GameEventMgr.instance.addListener(GameEvent.StartSpeedUp, this, this.speedUp);
        GameEventMgr.instance.addListener(GameEvent.StopSpeedUp, this, this.stopSpeedUp);
        GameEventMgr.instance.addListener(GameEvent.SpeedUpTimeCount, this, this.setSpeedCountTime);
        GameEventMgr.instance.addListener(GameEvent.RefreshShopOtherList, this, this.refreshEarningsText);
        GameEventMgr.instance.addListener(GameEvent.Refresh_5_SpeedUp, this, this.refreshShowGoldEffect);
        GameEventMgr.instance.addListener(GameEvent.RefreshShopRedPoint, this, this.refreshShopRedPoint);
        GameEventMgr.instance.addListener(GameEvent.OnPrivilegeUpdate, this, this.refreshShopRedPoint);
        GameEventMgr.instance.addListener(GameEvent.UnlockNewSkin, this, this.refreshSkinBtnReddot);
        GameEventMgr.instance.addListener(GameEvent.RefreshSkinBtnReddot, this, this.refreshSkinBtnReddot);
        GameEventMgr.instance.addListener(GameEvent.RefreshSpeedUpBtnReddot, this, this.refreshSpeedUpBtnReddot);
        GameEventMgr.instance.addListener(GameEvent.OnSign, this, this.refreshSignReddot);

        GameEventMgr.instance.addListener(GameEvent.SellShip, this, this.sellShip);
        GameEventMgr.instance.addListener(GameEvent.SellShipEffectEnd, this, this.sellShipEffectEnd);
        GameEventMgr.instance.addListener(GameEvent.RefreshBuyShipBtn, this, this.refreshBuyShipBtn);
        GameEventMgr.instance.addListener(GameEvent.RefreshOwnMoneyText, this, this.refreshOwnMoneyText);
        GameEventMgr.instance.addListener(GameEvent.RefreshPlayerLevelUp, this, this.refreshRoleLevelOpen);
        
        GameEventMgr.instance.addListener(GameEvent.MergeGuideFinish, this, this.onMergeGuideFinish);
        GameEventMgr.instance.addListener(GameEvent.OnUnlockNewShipPageClose, this, this.OnUnlockNewShipPageClose);

        GameEventMgr.instance.addListener(GameEvent.OnBeginDrag, this, this.onBeginDrag);
        GameEventMgr.instance.addListener(GameEvent.OnEndDrag, this, this.onEndDrag);

        GameEventMgr.instance.addListener(GameEvent.OnMyCommentLikeNumUpdate, this, this.onCommentLikeNumUpdate);
        GameEventMgr.instance.addListener(GameEvent.OnNationChange, this, this.refreshNationInfo);
    }

    public show():void
    {
        UIManager.instance.showUI(this._ui);
        this._inShow = true;

        this.refreshSpeedUp();
        this.refreshAirDrop();
        this.initOwnMoneyText();
        this._ui.checkLevelUI();
        this._ui.updateMergeGuideUI();
        this._ui.hideDeleteNoticeAni(true);

        this._ui.setCommentReddot();
        this.refreshShopRedPoint();
        this.refreshSkinBtnReddot();
        this.refreshSpeedUpBtnReddot();
        this.refreshSignReddot();
        // this.refreshMoreGameReddot();

        this.refreshGameDistanceSlider();
        this.refreshSkinBtn();
        this.forceShowNation();
        MergeGuideManager.instance.showMergeGuide();

        // zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Main);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Main, this._ui);
        //
        FPSStatistics.instance.start(FPSScene.Merge);
    }
    
    public close():void
    {
        UIManager.instance.removeUI();
        this._inShow = false;
        PowerUpMgr.clearBackgroundEarningTime();
        MergeShipMgr.instance.openAllShipItemBox();
        CoinRainMgr.instance.close();

        zm.ad.removeAd(ZMGameConfig.AdPage_Main);
        // zm.ad.hideBanner();
        //
        FPSStatistics.instance.end();
    }

    private initPage():void
    {
        MergeShipMgr.instance.initItem(this._ui.boxMerge);
        this.refreshEarnings();
        this.initOwnMoneyText();
        this.refreshBuyShipBtn(PowerUpMgr.getMostCostEffectiveShipId());
        this.changeLevel();
        this.refreshRoleLevelOpen();
        this.refreshNationInfo();
    }

    //刷新左上角加速/收益/每秒产出等 信息
    private refreshEarnings():void
    {
        this._ui.setEarningsText();
    }
    
    private refreshBuyShipBtn(shipId:number):void
    {
        this._curShipId = shipId;
        this._ui.refreshBuyShipBtn(this._curShipId);
    }

    private initOwnMoneyText():void
    {
        this._ui.setOwnMoney();
    }

    private changeLevel():void
	{
        this._ui.setLevelInfo();
    }

    private refreshShopRedPoint():void
	{
        this._ui.refreshShopRedPoint();
    }

    private refreshSignReddot():void
	{
        this._ui.refreshSignReddot();
    }
    
    // private refreshMoreGameReddot():void
    // {
    //     this._ui.refreshMoreGameReddot();
    // }

    private refreshNationInfo():void
    {
        this._ui.refreshNationInfo();
    }
    
    private refreshSkinBtn():void
    {
        this._ui.refreshSkinBtn();
    }

    private showNewSkinPopup():void
    {
        let newSkin = SkinManager.instance.getUnlockNewSkin();
        if(newSkin && newSkin.skinType == SkinType.Special)
        {
            //显示特殊新皮肤
            NewSkinPopupMgr.instance.show(newSkin);
            SkinManager.instance.clearLastSpeicalSkin();
        }else
        {
            //显示普通新皮肤
            if(ChangeSkinPopupMgr.instance.canShow())
            {
                ChangeSkinPopupMgr.instance.show();
            }else
            {
                SkinManager.instance.clearLastSpeicalSkin();
            }
        }
    }

    private refreshSkinBtnReddot():void
    {
        this._ui.refreshSkinBtnReddot();
    }

    private refreshSpeedUpBtnReddot():void
    {
        this._ui.refreshSpeedUpBtnReddot();
    }

    private onRemoveAllPopup():void
    {
        if(this.nextPopupOfflineReward)
        {
            this.refreshOnlineReward();
        }
    }

    private nextPopupOfflineReward:boolean = false;
    //强制弹出签到界面
    private forceShowSignPopup():void
    {
        this.nextPopupOfflineReward = true;
        SignPopupMgr.instance.show();
    }

    //刷新离线奖励
    private refreshOnlineReward():void
	{
        this.nextPopupOfflineReward = false;
        let timeDiff =  Date.now() - MergeUserData.instance.LastOffLineTime;
        let sec = Math.floor(timeDiff / 1000);
        if(sec > 300)
        {
            this.showOfflineMoney();
        }
        MergeUserData.instance.saveOffLineTime();
    }

    private showOfflineMoney():void
	{
        if(MergeGuideManager.instance.hasFinish == false)
        {
            return;
        }
        //离线免费飞船
        let timeDiff =  Date.now() - MergeUserData.instance.LastOffLineTime;
        let sec = Math.floor(timeDiff / 1000);
        let min = Math.floor(timeDiff / 60000);
        this.judgeOfflineTimeFreeShip(sec);
        if(sec < 120)
        {
            return;
        }
        //离线金钱奖励
        let moneySpeed = PowerUpMgr.getAllEarningsPerSecond();
        let earningPerMin = moneySpeed * 60;
        let totalMoney = 0;
        let list = GameJsonConfig.instance.getOfflineConfig();
        for(var i=0; i<list.length; i++)
        {
            let offLineData = list[i];
            if(min > offLineData.min_time)
            {
                let tempTime = Math.min(min, offLineData.max_time) - offLineData.min_time;
                totalMoney += tempTime*earningPerMin*offLineData.revenue_multiple;
                continue;
            }
            break;
        }
        if(totalMoney > 0)
        {
            OffLinePopupMgr.instance.show(totalMoney);
        }
    }
    
    private judgeOfflineTimeFreeShip(seconds:number):void
	{
        let freeDropShipTime = MergeDefine.DropFreeBoxTime;
        let num = Math.floor(seconds / freeDropShipTime);
        let noHaveShipsNum = MergeShipMgr.instance.getNoHaveShipsLength();
        num = Math.min(num, MergeDefine.OfflineFreeDropShipNum, noHaveShipsNum);
        if(num > 0)
        {
            PowerUpMgr.createFreeDropShip(num, false);
        }
    }

    private forceShowNation():void
    {
        if(NationManager.instance.checkNeedForceShowNation())
        {
            NationPopupMgr.instance.show();
        }
    }
    
    private refreshGameDistanceSlider():void
	{
        this._ui.refreshGameDistanceSlider();
    }

    private sellShip():void
	{
        this._inSelling = true;
        //播放垃圾桶动画
        this._ui.playDeleteAni();//去除删除火箭动画
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
        this.refreshEarnings();
        DataStatisticsMgr.instance.stat("删除火箭");
    }

    private sellShipEffectEnd():void
    {
        this._inSelling = false;
        // this._ui.hideDeleteNoticeAni(true);
        // this._ui.setBottomBtnVisible(true);
        // this.refreshSpeedUp();
    }
   
	private refreshOwnMoneyText(old:number, change:number):void
	{
        this._ui.refreshOwnMoneyText(old, change);
        this.refreshBuyShipBtn(this._curShipId);
    }

    //等级解锁
    private refreshRoleLevelOpen():void
    {
        this.refreshAirDrop();
    }

    private showAirDrop(isShow:boolean):void
    {
        this._ui.showAirDrop(isShow);
        if(isShow)
        {
            MergeUserData.instance.ShowFreeBonusTime = MergeDefine.ShowFreeBounsTime;
        }
    }
    
    /*
    规则：
    1、刚到5级时，立即显示空投
    2、超过5级，等待空投CD
    3、不到5级，不显示空投
     */
	private refreshAirDrop()
	{   
        if(MergeUserData.instance.playerLevel == MergeDefine.open_airDrop_level)
        {
            if(MergeUserData.instance.FreeBonusTime < 0)
            {
                //显示空投
                this.showAirDrop(true);
            }
        }else if(MergeUserData.instance.playerLevel > MergeDefine.open_airDrop_level)
        {
            if(MergeUserData.instance.FreeBonusTime < 0)
            {
                //显示空投CD
                this.showFreeBonusTime();
            }
        }else{
            //隐藏空投
            this.showAirDrop(false);
        }
    }
    
    //进入空投显示时间
    private freeBonusTime():void
	{
        this.showAirDrop(true);
	}
    
    //进入空投CD时间
	private showFreeBonusTime():void
	{
        this.showAirDrop(false);   
        MergeUserData.instance.FreeBonusTime = MergeDefine.FreeBonusTime;
    }

    private refreshEarningsText():void
	{
        this.refreshEarnings();
        this.updateShipItemEarningsSpeed();
    }

    private refreshSpeedUp():void
    {
        if(MergeUserData.instance.speedUpTime > 0)
        {
            this.speedUp();
        }else{
            this.stopSpeedUp();
        }
    }
    
    private stopSpeedUp():void
	{
        this.refreshEarnings();
        this._ui.btnSpeedUp.visible = true;
        this._ui.imgSpeedUp.visible = false;
	}
    
	private speedUp():void
	{
        this.refreshEarnings();
        this._ui.btnSpeedUp.visible = false;
        this._ui.imgSpeedUp.visible = true;
        this.setSpeedCountTime();
    }

    private setSpeedCountTime():void
    {
        let speedUpTime = Math.ceil(MergeUserData.instance.speedUpTime);
        this._ui.txtSpeedUpTime.value = Util.formatGameTime(speedUpTime);
    }

	private refreshShowGoldEffect():void
	{
        if(MergeUserData.instance.Money5Time > 0)
        {
            //+5倍的金币动画
            CoinRainMgr.instance.show();
        }else{
            CoinRainMgr.instance.close();
        }
        this.refreshEarningsText();
	}

	private updateShipItemEarningsSpeed():void
	{
        MergeShipMgr.instance.updateShipItemEarningsSpeed();
    }
    
    //开始升级动画
    private startShengjiEft():void
    {
        WorldCamera.instance.startShengji();
        this.close();
    }

    //解锁新飞船页面
    private unLockShips():void
    {
        UnlockNewShipPopupMgr.instance.show();
    }
    
    //解锁新飞船页面关闭
    private OnUnlockNewShipPageClose():void
    {
        this.show();
        WorldCamera.instance.showWaiting();
        GameEventMgr.instance.Dispatch(GameEvent.RefreshShipItemList);
        GameEventMgr.instance.Dispatch(GameEvent.RefreshPlayerLevelUp);
        //升级礼包
        if(MergeUserData.instance.iMaxLockedShipId >= MergeDefine.UpgradeBonusShowLevel)
        {
            UpgradeBonusPopupMgr.instance.show( Laya.Handler.create(this, this.showNewSkinPopup) );
        }else{
            this.showNewSkinPopup();
        }
    }
    
    private onUIClick(clkTarget):void
    {
        //点击item
        let clkName:string = clkTarget.name;
        if(clkName.indexOf("ShipItem_") != -1)
        {
            let arr:Array<string> = clkName.split("_");
            let shipItemIdx:number = parseInt( arr[1] );
            //
            MergeShipMgr.instance.onClickItem(shipItemIdx);
            return;
        }
        switch(clkTarget)
        {
            case this._ui.imgAirDrop:
                this.onClickAirDrop();
                break;
            case this._ui.btnBuy:
                this.onClickBuy();
                break;
            case this._ui.btnShop:
                this.onClickShop();
                break;
            case this._ui.btnSpeedUp:
            case this._ui.imgSpeedUp:
                this.onClickSpeedUp();
                break;
            case this._ui.btnSetting:
                this.onClickSetting();
                break;
            case this._ui.btnRank:
                this.onClickRank();
                break;
            case this._ui.btnFly:
                this.onClickFly();
                break;
            case this._ui.btnExplore:
                this.onClickExplore();
                break;
            case this._ui.btnSkin:
                this.onClickSkin();
                break;
            case this._ui.btnSidebar:
            case this._ui.btnSideBarMask:
                this.onClickSidebar();
                break;
            case this._ui.boxNation:
                this.onClickNation();
                break;
            case this._ui.btnSign:
                this.onClickSign();
                break;
            case this._ui.btnStarManual:
                this.onClickStarManual();
                break;
            // case this._ui.btnMoreGame:
            //     this.onClickMoreGame();
            //     break;
            // case this._ui.btnService:
            //     this.onClickService();
            //     break;
            // case this._ui.btnAirDrop:
            //     this.onClickYunyingAirDrop();
            //     break;
        }
    }

    private onUIMouseMove(clkTarget):void
    {
        MergeShipMgr.instance.onMouseMove();
    }

    private onUIMouseDown(clkTarget):void
    {
        let clkName:string = clkTarget.name;
        if(clkName.indexOf("ShipItem_") != -1)
        {
            let arr:Array<string> = clkName.split("_");
            let shipItemIdx:number = parseInt( arr[1] );
            //
            MergeShipMgr.instance.onMouseDown(shipItemIdx);
        }
    }
    
    private onUIMouseUp(clkTarget):void
    {
        let clkName:string = clkTarget.name;
        if(clkName.indexOf("ShipItem_") != -1)
        {
            let arr:Array<string> = clkName.split("_");
            let shipItemIdx:number = parseInt( arr[1] );
            //
            MergeShipMgr.instance.onMouseUp(true, shipItemIdx);
        }else if(clkTarget == this._ui.btnSell)
        {
            MergeShipMgr.instance.onSellShip();
        }else{
            MergeShipMgr.instance.onMouseUp(false);
        }
    }

    private onClickAirDrop():void
	{   
        //点击空投
        MergeUserData.instance.FreeBonusTime = 0;
        MergeUserData.instance.ShowFreeBonusTime = 0;
        this.showAirDrop(false);
        //打开空投页面
        AirDropPopupMgr.instance.show();
    }

    private onClickBuy():void
    {
        let costMoney = PowerUpMgr.getShopPirceWithDiscountBuff(this._curShipId);
        if(MergeUserData.instance.judgeMoneyIsFull(costMoney))
        {
            MergeShipMgr.instance.createItem(this._curShipId, Laya.Handler.create(this, function(item:ShipItem):void
            {
                if(item != null)
                {
                    MergeUserData.instance.consumeMoney(costMoney);
                    MergeUserData.instance.buyShip(this._curShipId);
                    this.refreshBuyShipBtn(PowerUpMgr.getMostCostEffectiveShipId());
                    SoundManager.instance.playSound(MusicConfig.BuyShip, false);

                    PowerUpMgr.CheckNeedShowShipFreeLevelUp(item);
                }else{
                    //合成格子满了
                    TipDialogMgr.instance.show("格子满了");
                    SoundManager.instance.playSound(MusicConfig.NoCoin, false);
                }
            }));
            GameEventMgr.instance.Dispatch(GameEvent.BuyShip);
            DataStatisticsMgr.instance.stat("点击购买",{"结果":"成功购买"});
        }else{
            //显示没钱
            if(MergeShipMgr.instance.getNoHaveShipsLength() > 0)
            {
                FreeGainShipPopupMgr.instance.show();
                DataStatisticsMgr.instance.stat("点击购买",{"结果":"金币不足"});
            }else{
                TipDialogMgr.instance.show("格子满了");
                SoundManager.instance.playSound(MusicConfig.NoCoin, false);
                DataStatisticsMgr.instance.stat("点击购买",{"结果":"格子满了"});
            }
        }
    }

    private onClickShop():void
	{
        ShopPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
	}

    private onClickSpeedUp():void
	{
        SpeedUpPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
	}   

    private onClickSetting():void
	{
        SettingPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
	}

    private onClickRank():void
	{
        // RankPopupMgr.instance.show();
        // SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private onClickFly():void
    {
        this.close();
        GameEventMgr.instance.Dispatch(GameEvent.OnClickToBoost, [true]);
        AstronautManager.instance.addAstronautInShip();
        //
        if(SkinManager.instance.hasUseSkin)
        {
            let skinData = SkinManager.instance.getShipSkinData();
            if(skinData)
            {
                if(skinData.skinType == SkinType.Special)
                {
                    DataStatisticsMgr.instance.stat("开始飞行-专属皮肤",{"headId":skinData.headId});
                }else{
                    DataStatisticsMgr.instance.stat("开始飞行-传统皮肤",{"headId":skinData.headId});
                }
                return;
            }
        }
        DataStatisticsMgr.instance.stat("开始飞行-无皮肤");
        //
    }

    private onClickExplore():void
    {   
        if(UserData.instance.totalDiscoverIndex <= 1)
        {
            TipDialogMgr.instance.show("抵达第一个新星系解锁");
            SoundManager.instance.playSound(MusicConfig.NoCoin, false);
            return;
        }
        CoinRainMgr.instance.close();
        GameSceneMgr.instance.gotoGalaxy();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickSkin():void
    {
        let nextSkin = SkinManager.instance.getNextUnlockSkin();
        SkinPopupMgr.instance.show(nextSkin);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickStarManual():void
    {
        StarManualPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickSidebar():void
    {
        this._ui.setSidebar();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickNation():void
    {
        NationPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickSign():void
    {
        SignPopupMgr.instance.show();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    // private onClickMoreGame():void
    // {
    //     this._ui.showMoreGame();
    //     RecommendPopupMgr.instance.show();
    //     SoundManager.instance.playSound(MusicConfig.Click, false);
    // }

    // private onClickService():void
    // {
    //     DataStatisticsMgr.instance.stat("点击客服按钮");
    //     SoundManager.instance.playSound(MusicConfig.Click, false);
    //     WxHandler.instance.openCustomerServiceConversation();
    // }

    // private onClickYunyingAirDrop():void
    // {
    //     DataStatisticsMgr.instance.stat("主页空投按钮点击");
    //     YunyingAirDropPopupMgr.instance.show();
    //     SoundManager.instance.playSound(MusicConfig.Click, false);
    // }

    private onMergeGuideFinish(step:MergeGuideType):void
    {
        switch(step)
        {
            case MergeGuideType.StartGame:
                this.onClickFly();
                break;
            case MergeGuideType.BuyShip:
                this.onClickBuy();
                MergeGuideManager.instance.showMergeGuide();
                break;
        }
        this._ui.updateMergeGuideUI();
    }

    private onBeginDrag():void
    {
        // this._ui.setBottomBtnVisible(false);
        this._ui.showDeleteNoticeAni();
    }

    private onEndDrag():void
    {
        // if(this._inSelling == true)
        // {
        //     this._ui.hideDeleteNoticeAni(false);
        // }else{
        //     this._ui.hideDeleteNoticeAni(true);
        //     // this._ui.setBottomBtnVisible(true);
        //     // this.refreshSpeedUp();
        // }
        this._ui.hideDeleteNoticeAni(false);
    }

    private onCommentLikeNumUpdate(num:number):void
    {
        this._ui.setCommentReddot();
    }
}