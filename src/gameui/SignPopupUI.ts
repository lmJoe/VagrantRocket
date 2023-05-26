import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import Constants from "../model/Constants";
import SignBonusConfig from "../config/SignBonusConfig";
import SignManager from "../ctrl/SignManager";
import { SignBonusType } from "../model/GameModel";
import SkinManager from "../ctrl/SkinManager";
import SkinData from "../model/SkinData";
    
export default class SignPopupUI extends ui.popup.SignPopupUI
{
    constructor() 
    { 
        super(); 
        this.init();
    }

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnSign_ClickEvent, [clickTarget]);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }

    private init():void
    {
        this.mouseThrough = true;
        this.boxPanel.mouseThrough = true;
        this.imgBg.mouseEnabled = true;
        this.imgBg.mouseThrough = false;
    }
    
    public showPage():void
    {
        this.refreshPage();
    }
    
    private refreshPage():void
    {
        this.setSignItem();
        this.setBtn();
    }

    private setSignItem():void
    {
        for(var i=1; i<=Constants.SignTotalDay; i++)
        {
            let cfg:SignBonusConfig = SignBonusConfig.getSignBonusConfig(i);
            let item:Laya.Box = this.boxPanel.getChildByName("boxItem"+i) as Laya.Box;
            //
            let txtBonusName:Laya.Label = item.getChildByName("txtBonusName") as Laya.Label;
            txtBonusName.text = cfg.bonusName;
            //是否已经领取
            let imgGained:Laya.Image = item.getChildByName("imgGained") as Laya.Image;
            let imgGainedMask:Laya.Image = item.getChildByName("imgGainedMask") as Laya.Image;
            imgGained.visible = SignManager.instance.signDay >= i;
            imgGainedMask.visible = SignManager.instance.signDay >= i;
            //是否当前签到日
            let imgSelect:Laya.Image = item.getChildByName("imgSelect") as Laya.Image;
            let hasSigned:boolean = SignManager.instance.getTodayHasSign();
            if(hasSigned)
            {
                imgSelect.visible = SignManager.instance.signDay == i;
            }else{
                imgSelect.visible = SignManager.instance.signDay+1 == i;
            }
            //皮肤奖励
            let imgBonus:Laya.Image = item.getChildByName("imgBonus") as Laya.Image;
            // imgBonus.size(130, 130);
            imgBonus.centerX = 0;
            // imgBonus.y = 60;
            if(cfg.bonusType == SignBonusType.Skin)
            {
                let skinData:SkinData = SkinManager.instance.getSkinDataByHeadId(cfg.bonusValue);
                imgBonus.skin = skinData.getDisplaySkin();
            }
        }
    }

    private setBtn():void
    {
        let hasSigned:boolean = SignManager.instance.getTodayHasSign();
        let gainAll:boolean = SignManager.instance.getGainAllBonus();
        this.btnGain.visible = !gainAll && !hasSigned;
        this.btnGained.visible = gainAll || hasSigned;
    }

    public trySign():void
    {
        SignManager.instance.sign();
        this.refreshPage();
    }
}