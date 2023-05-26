import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ResourceConfig from "../config/ResourceConfig";
import MergeUserData from "../merge/data/MergeUserData";
import ShopMgr from "../merge/ctrl/ShopMgr";
import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import Util from "../utils/Util";
import GameJsonConfig from "../config/GameJsonConfig";
import AstronautManager from "../astronaut/AstronautManager";
import SolarManager from "../solar/SolarManager";
import { PrivilegeType } from "../merge/data/MergeModel";
import UserData from "../data/UserData";
import Constants from "../model/Constants";
import MergeGuideManager from "../merge/ctrl/MergeGuideManager";
import { MergeGuideType } from "../model/GameModel";
import MergeDefine from "../merge/data/MergeDefine";
import LevelColor from "../config/LevelColor";
import ResourceManager from "../ctrl/ResourceManager";
import CommentMgr from "../ctrl/CommentMgr";
import SkinManager from "../ctrl/SkinManager";
import SpeedUpPopupMgr from "../gameuictrl/SpeedUpPopupMgr";
import NationManager from "../ctrl/NationManager";
import SignManager from "../ctrl/SignManager";
import ReddotEffectMgr from "../ctrl/ReddotEffectMgr";
import GameSave from "../data/GameSave";
/*
* 星际界面;
*/
export default class MergePageUI extends ui.view.MergePageUI
{
    constructor(){
        super();
        this.mouseEnabled = true;
        this.mouseThrough = true;
        this.boxMerge.mouseEnabled = true;
        this.boxMerge.mouseThrough = true;
        this.showAirDrop(false);
        this.initDeleteAni();
        this.showDeleteNoticeAni();
        this.setBg();

        this.boxSidebar.x = -100;
        this.btnSideBarMask.size(Laya.stage.width, Laya.stage.height);
        this.btnSideBarMask.pos(0, 0);
        this.btnSideBarMask.visible = false;

        this.boxInfo.visible = Constants.DebugState;
        this.btnRank.visible = false;
    }

    private setBg():void
    {
        let levelColorType = LevelColor.getLevelColorType();
        this.imgMergePageBg.skin = ResourceManager.instance.getMergeBgUrl(levelColorType);

        let justY = this.boxMainBtn.centerY + 0.5*Laya.stage.height;
        let height = Laya.stage.height - justY + 20;
        this.imgMergePageBg.size(Laya.stage.width, height);
    }

    private _deleteAniImg:Laya.Image;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
        this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }   

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnMerge_ClickEvent, [clickTarget]);
    }

    private onMouseMove(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnMerge_MouseMove, [clickTarget]);
    }

    private onMouseDown(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnMerge_MouseDown, [clickTarget]);
    }

    private onMouseUp(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnMerge_MouseUp, [clickTarget]);
    }

    public checkLevelUI():void
    {
        if(UserData.instance.gameLevel > 1)
        {
            this.btnExplore.skin = "imgRes2/mergehome/btnExplore1.png";
        }
        else{
            this.btnExplore.skin = "imgRes2/mergehome/btnExplore0.png";
        }
    }

    public setEarningsText():void
    {
        let num = 1;
        if(MergeUserData.instance.Money5Time > 0)
        {
            num = MergeDefine.AirDropMoneyRate;
        }
        num += ShopMgr.instance.getOtherShopBuff(PrivilegeType.Profit);
        this.txtEarningInfo.text = "收益x" + (num*100).toFixed(0) + "%";

        let num2 = MergeUserData.instance.speedUpTime > 0 ? MergeUserData.instance.speedUp.mult : 1;
        this.txtSpeedUpInfo.text = "加速x" + (num2*100).toFixed(0) + "%";

        let moneySpeed = PowerUpMgr.getAllEarningsPerSecond();
        moneySpeed = moneySpeed * num * num2;
        this.txtMoneySpeed.text = Util.moneyFormat(moneySpeed) + "/秒";
    }

    public refreshBuyShipBtn(shipId:number):void
    {
        let shipInfo = GameJsonConfig.instance.getShipInfoConfig(shipId);
        this.imgBuyShipIcon.skin = shipInfo.skinUrl;
        let shipCost = PowerUpMgr.getShopPirceWithDiscountBuff(shipId);
        this.txtBuyShipCost.value = Util.moneyFormat(shipCost);
        // this.btnBuy.gray = MergeUserData.instance.judgeMoneyIsFull(shipCost) == false;
    }

    public setOwnMoney():void
    {
        this.txtOwnMoney.value = Util.moneyFormat(MergeUserData.instance.ownMoney);
    }

    public setLevelInfo():void
    {
        this.setBg();
    }

    public refreshSkinBtn():void
    {
        let nextSkin = SkinManager.instance.getNextUnlockSkin();
        this.imgNextSkin.skin = nextSkin.skinIcon;
        if(MergeUserData.instance.iMaxLockedShipId < nextSkin.unlockValue)
        {
            this.txtNextLabel0.visible = true;
            this.txtNextLabel1.visible = true;
            this.txtNextSkin.visible = true;
            this.txtNextSkin.text = nextSkin.unlockValue+"级";
        }else{
            this.txtNextLabel0.visible = false;
            this.txtNextLabel1.visible = false;
            this.txtNextSkin.visible = false;
        }
    }

    public refreshSkinBtnReddot():void
    {
        let firstShowSkin:boolean = SkinManager.instance.firstShowSkin;
        let hasNoSelectedSkin:boolean = SkinManager.instance.getSkinNoSelectedList().length > 0;

        let skinReddot:Laya.Image = this.btnSkin.getChildByName("imgReddot") as Laya.Image;
        skinReddot.visible = !firstShowSkin || hasNoSelectedSkin;
    }

    public refreshSpeedUpBtnReddot():void
    {
        let speedUpReddot:Laya.Image = this.btnSpeedUp.getChildByName("imgReddot") as Laya.Image;
        speedUpReddot.visible = SpeedUpPopupMgr.instance.showSpeedUpReddot;
    }

    public refreshGameDistanceSlider():void
    {
        if(UserData.instance.gameLevel >= Constants.TotalLevelNum)
        {
            this.txtExploreDistance.text = "总飞行距离:"+UserData.instance.gameDistance;
            this.barExploreDistance.value = 1;
        }else
        {
            let levelDistance:number = UserData.instance.levelDistance;
            this.txtExploreDistance.text = UserData.instance.levelFlewDistance + "/" + levelDistance;
            this.barExploreDistance.value = UserData.instance.levelFlewDistance / levelDistance;
        }
    }

    public refreshOwnMoneyText(old:number, change:number):void
	{
        this.setOwnMoney();
        let endValue = 1;
        let duration = 100;
        let curMoneyData = 0;

        let twObj:any = {};
        twObj.num = 0;
        let tw = Laya.Tween.to(twObj,{num:endValue},duration,Laya.Ease.backOut,Laya.Handler.create(this,function():void
        {
            this.setOwnMoney();
            this.txtOwnMoney.scale(1, 1);
        }));      
        tw.update = new Laya.Handler(this,function():void
        {
            curMoneyData = old + change*twObj.num;
            this.txtOwnMoney.value = Util.moneyFormat(curMoneyData);
            let scaleNum = 1+(twObj.num/10);
            this.txtOwnMoney.scale(scaleNum, scaleNum);
        });
    }
    
	public refreshShopRedPoint():void
	{
        let shopCanRed:boolean = ShopMgr.instance.canShopRed;
        let privilegeCanRed:boolean = ShopMgr.instance.canUpdatePrivilege;
        let shopReddot:Laya.Image = this.btnShop.getChildByName("imgReddot") as Laya.Image;
        shopReddot.visible = shopCanRed || privilegeCanRed;
	}

    public updateMergeGuideUI():void
    {
        this.btnFly.visible = MergeGuideManager.instance.mergeGuideStep != MergeGuideType.StartGame;
        this.btnBuy.visible = MergeGuideManager.instance.mergeGuideStep != MergeGuideType.BuyShip;
    }
    
    public showAirDrop(isShow:boolean):void
    {
        this.imgAirDrop.visible = isShow;
        this.eftAirDrop.visible = isShow;
        if(isShow)
        {
            this.eftAirDrop.play(0, true);
            this.imgAirDrop.mouseEnabled = true;
            this.imgAirDrop.mouseThrough = false;
        }else{
            this.eftAirDrop.stop();
        }
    }

    public setSidebar():void
    {
        let targetX = -100 - this.boxSidebar.x;
        if(targetX >= 0)
        {
            this.btnSideBarMask.visible = true;
        }else
        {
            this.btnSideBarMask.visible = false;
        }
        Laya.Tween.to(this.boxSidebar, {x:targetX}, 100, Laya.Ease.linearNone, Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(this.boxSidebar);
        }));
    }

    public refreshNationInfo():void
    {
        this.txtNation.text = NationManager.instance.nationConfig.nationName;
        this.imgNation.skin = null;
        this.imgNation.skin = NationManager.instance.nationConfig.icon;
    }

    public refreshSignReddot():void
    {
        let gainAll:boolean = SignManager.instance.getGainAllBonus();
        let hasSign:boolean = SignManager.instance.getTodayHasSign();
        let signReddot:Laya.Image = this.btnSign.getChildByName("imgReddot") as Laya.Image;
        signReddot.visible = !gainAll && !hasSign;

        this.refreshSidebarReddot();
    }

    // public refreshMoreGameReddot():void
    // {
    //     let dotVisible:boolean = true;
    //     //红点一直显示
    //     // let valueStr:string = GameSave.getValue("MoreGameKey");
    //     // if(valueStr && valueStr.length > 0)
    //     // {
    //     //     let timeMark = parseInt(valueStr);
    //     //     dotVisible = !Util.isToday(timeMark)
    //     // }
    //     let moreGameReddot:Laya.Image = this.btnMoreGame.getChildByName("imgReddot") as Laya.Image;
    //     moreGameReddot.visible = dotVisible;
    //     if(moreGameReddot.visible)
    //     {
    //         ReddotEffectMgr.instance.addEffect(moreGameReddot, 1.2);
    //     }else{
    //         ReddotEffectMgr.instance.clearEffect(moreGameReddot);
    //     }
    // }

    // public showMoreGame():void
    // {
    //     //红点一直显示
    //     // GameSave.setValue("MoreGameKey", ""+Date.now());
    //     // let moreGameReddot:Laya.Image = this.btnMoreGame.getChildByName("imgReddot") as Laya.Image;
    //     // moreGameReddot.visible = false;
    //     // ReddotEffectMgr.instance.clearEffect(moreGameReddot);
    // }

    //侧边栏红点
    public refreshSidebarReddot():void
    {
        let signReddot:Laya.Image = this.btnSign.getChildByName("imgReddot") as Laya.Image;

        let sidebarReddot:Laya.Image = this.btnSidebar.getChildByName("imgReddot") as Laya.Image;
        sidebarReddot.visible = signReddot.visible;
    }

//烟雾动画
    private initDeleteAni():void
    {
        this._deleteAniImg = new Laya.Image();
        this._deleteAniImg.size(200, 200);//256
        let diffX:number = 0.5*this._deleteAniImg.width;
        let diffY:number = 0.5*this._deleteAniImg.height;
        this._deleteAniImg.pos(this.btnSell.x-diffX, this.btnSell.y-diffY);
        this._deleteAniImg.mouseEnabled = false;
        this._deleteAniImg.mouseThrough = true;
        this.boxBottmBtn.addChild(this._deleteAniImg);
    }

    private hideDeleteAni():void
    {
        // this._deleteAniImg.visible = false;
        this._deleteAniImg.skin = null;
    }

    private _aniCount:number;
    public playDeleteAni():void
    {
        this.stopDeleteAni();
        this._deleteAniImg.visible = true;
        this._deleteAniImg.skin = null;
        this._aniCount = 1;
        let totalImgCount:number = 8;
        let loopTime:number = 50;
        Laya.timer.loop(loopTime, this, this.onDeleteAni, [totalImgCount]);
    }

    private onDeleteAni(totalImgCount:number):void
    {
        this._deleteAniImg.skin = "ani/delete/yanwu"+ this._aniCount +".png";
        this._aniCount ++;
        if(this._aniCount >= totalImgCount)
        {
            this.stopDeleteAni();
            this.hideDeleteAni();

            GameEventMgr.instance.Dispatch(GameEvent.SellShipEffectEnd);
        }
    }

    private stopDeleteAni():void
    {
        Laya.timer.clear(this, this.onDeleteAni);
        if(this._deleteAniImg)
        {
            this._deleteAniImg.skin = null;
        }
    }

    public showDeleteNoticeAni():void
    {
        this.btnSell.visible = true;
        this.aniDeleteNotice.visible = true;
        this.aniDeleteNotice.play();
    }

    public hideDeleteNoticeAni(forceHide:boolean):void
    {
        // if(forceHide)
        // {
        //     this.btnSell.visible = false;
        // }
        this.aniDeleteNotice.visible = false;
        this.aniDeleteNotice.stop();
    }

    // public setBottomBtnVisible(boo:boolean):void
    // {
    //     this.imgSpeedUp.visible = boo;
    //     this.btnSpeedUp.visible = boo;
    //     this.btnBuy.visible = boo;
    //     this.btnShop.visible = boo;
    // }

    public setCommentReddot():void
    {
        let unSeeNum = CommentMgr.instance.unSeeNum;
        if(unSeeNum > 0)
        {
            this.imgCommentReddot.visible = true;
            this.txtCommentNum.visible = true;
            this.txtCommentNum.text = ""+unSeeNum;
        }else{
            this.imgCommentReddot.visible = false;
            this.txtCommentNum.visible = false;
            this.txtCommentNum.text = ""+0; 
        }
    }
}