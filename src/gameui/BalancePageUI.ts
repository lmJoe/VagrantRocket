import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import Constants from "../model/Constants";
import UserData from "../data/UserData";
import NationManager from "../ctrl/NationManager";
import Util from "../utils/Util";
import MergeUserData from "../merge/data/MergeUserData";
import { BonusGainType } from "../model/GameModel";
import NationConfig from "../config/NationConfig";
    
export default class BalancePageUI extends ui.view.BalancePageUI
{
    constructor() { 
        super(); 
    }

    private _bonus:number;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnRevive_ClickEvent, [clickTarget]);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }

    public setPage(type:BonusGainType):void
    {
        this.setDistance();
        this.setNationBonus();
        this.setBtn(type);
    }

    private setDistance():void
    {
        if(UserData.instance.gameLevel >= Constants.TotalLevelNum)
        {
            this.txtLeftDistance.visible = false;
            this.imgNextLevel.visible = false;
            this.boxDistance.visible = false;
        }else
        {
            let levelDistance:number = UserData.instance.levelDistance;
            let levelFlewDistance:number = UserData.instance.levelFlewDistance;
            let leftDistance = levelDistance - levelFlewDistance;
            if(leftDistance >= 0)
            {
                this.txtLeftDistance.visible = true;
                this.imgNextLevel.visible = true;
                this.boxDistance.visible = true;
                
                this.txtLeftDistance.value = "" + Math.floor(leftDistance);
                this.txtCurLevel.value = "" + UserData.instance.gameLevel;
                this.txtNextLevel.value = "" + (UserData.instance.gameLevel+1);
                let rate = levelFlewDistance / levelDistance;
                this.barDistance.value = rate;
                this.imgPoint.x = this.barDistance.x + (rate)*this.barDistance.width;
                this.imgPoint.y = 5;
            }else{
                this.txtLeftDistance.visible = false;
                this.imgNextLevel.visible = false;
                this.boxDistance.visible = false;
            }
        }
    }

    private setNationBonus():void
    {
        let bonusShipId:number = NationManager.instance.nationConfig.getBaseBonusShipId();
        let seizeNationId:number = NationManager.instance.seiznNationId;
        let extraMulti:number = NationManager.instance.nationConfig.getExtraMulti( seizeNationId );
        if(extraMulti > 1)
        {
            this.imgExtraMulti.skin = "imgRes2/nation/imgMulti_"+extraMulti+".png";
            this.imgExtraMulti.visible = true;
            this.boxBase.visible = false;
            this.boxExtra.visible = true;
            //我的
            let imgMyNation = this.boxExtra.getChildByName("imgMyNation") as Laya.Image;
            imgMyNation.skin = NationManager.instance.nationConfig.tag;
            //被占领的
            let seizeNation = NationConfig.getNationConfig(seizeNationId);
            let imgSeizeNation = this.boxExtra.getChildByName("imgSeizeNation") as Laya.Image;
            imgSeizeNation.skin = seizeNation.tag;
        }else{
            this.imgExtraMulti.visible = false;
            this.boxBase.visible = true;
            this.boxExtra.visible = false;
            //我的
            let imgMyNation = this.boxBase.getChildByName("imgMyNation") as Laya.Image;
            imgMyNation.skin = NationManager.instance.nationConfig.tag;
        }
        this.txtShipNum.text = ""+extraMulti;
        this.txtShipLevel.text = ""+bonusShipId;
        //
        this._bonus = NationManager.instance.nationConfig.getBaseBonusByBonusShipId( bonusShipId );
        this._bonus = this._bonus * extraMulti;
        this.txtBonus.value = Util.moneyFormat(this._bonus);
        //
        NationManager.instance.clearSeizeBonus();
    }

    private setBtn(type:BonusGainType):void
    {
        let imgVideoTag:Laya.Image = this.btnDoubleGain.getChildByName("imgVideoTag") as Laya.Image;
        let imgShareTag:Laya.Image = this.btnDoubleGain.getChildByName("imgShareTag") as Laya.Image;
        imgVideoTag.visible = type == BonusGainType.Video;
        imgShareTag.visible = type == BonusGainType.Share;
    }
    
    public gainBonus(double:boolean):void
    {
        this._bonus = double ? this._bonus*2 : this._bonus;
        MergeUserData.instance.changeMoney(this._bonus);
    }
}