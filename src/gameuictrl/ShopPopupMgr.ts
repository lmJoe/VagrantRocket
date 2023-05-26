import ShopPopupUI from "../gameui/ShopPopupUI";
import UIManager from "../ctrl/UIManager";
import { ShopTab, PrivilegeType } from "../merge/data/MergeModel";
import MergeUserData from "../merge/data/MergeUserData";
import GameEvent from "../event/GameEvent";
import GameEventMgr from "../event/GameEventMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import GameSave from "../data/GameSave";
import WxAdConfig from "../wx/WxAdConfig";
import ZMGameConfig from "../ZMGameConfig";
import BannerAdCustomManager from "../wx/BannerAdCustomManager";

/*
* ShopPopupMgr;
*/
export default class ShopPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:ShopPopupMgr;
    public static get instance():ShopPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new ShopPopupMgr();
        }
        return this._instance;
    }

    private static readonly FirstShowShopTabKey:string = "FirstShowShopTabKey";
    private static readonly FirstShowPrivilegeTabKey:string = "FirstShowPrivilegeTabKey";

    private _ui:ShopPopupUI;

    private init():void
    {
        this._ui = new ShopPopupUI();

        GameEventMgr.instance.addListener(GameEvent.OnShop_ClickEvent, this, this.onUIClick);
        GameEventMgr.instance.addListener(GameEvent.RefreshShopShipPage, this, this.onRefreshShopShipPage);
        GameEventMgr.instance.addListener(GameEvent.OnPrivilegeUpdate, this, this.onPrivilegeUpdate);
        GameEventMgr.instance.addListener(GameEvent.RefreshShopRedPoint, this, this.onRefreshShopReddot);
        
        // GameSave.clearValue(ShopPopupMgr.FirstShowShopTabKey);
        // GameSave.clearValue(ShopPopupMgr.FirstShowPrivilegeTabKey);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        
        this.setPage();
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);

        zm.ad.setPageBanner(WxAdConfig.BannerAdUnitId, ZMGameConfig.AdPage_Shop);
        zm.ad.setAdCustomData({pos:{x:0, y:200}, newVersion:true});
        zm.ad.addAd(ZMGameConfig.AdPage_Shop, this._ui);
        BannerAdCustomManager.instance.show();
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        SoundManager.instance.playSound(MusicConfig.Click, false);

        zm.ad.removeAd(ZMGameConfig.AdPage_Shop);
        zm.ad.hideBanner();
        BannerAdCustomManager.instance.hide();
    }

    private setPage():void
    {
        this.setFirstShowTab(ShopTab.Ship);
        this._ui.showShopPage(ShopTab.Ship);
    }  
    
    private setFirstShowTab(type:ShopTab):void
    {
        if(type == ShopTab.Ship)
        {
            if(this.firstShowShopTabReddot)
            {
                this.setFirstShowShopTab();   
            }
        }else
        {
            if(this.firstShowPrivilegeTabReddot)
            {
                this.setFirstShowPrivilegeTab();   
            }
        }
    }

    private onMaskClick():void
    {
        this.close();
    }

    private onRefreshShopShipPage():void
    {
        this._ui.refreshShopPage(ShopTab.Ship);
    }

    private onUIClick(clkTarget):void
    {
        switch(clkTarget)
        {
            case this._ui.btnTabShip:
                this.onClickBtnTabShip();
                break;
            case this._ui.btnTabPrivilege:
                this.onClickBtnTabPrivilege();
                break;
            case this._ui.btnProfitUpgrade:
                this.onClickProfitUpgrade();
                break;
            case this._ui.btnDiscountUpgrade:
                this.onClickDiscountUpgrade();
                break;
            case this._ui.btnBack:
                this.close();
                break;
        }
    }

    private onClickBtnTabShip():void
    {
        this.setFirstShowTab(ShopTab.Ship);
        this._ui.showShopPage(ShopTab.Ship);
        
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }
    
    private onClickBtnTabPrivilege():void
    {
        this.setFirstShowTab(ShopTab.Privilege);
        this._ui.showShopPage(ShopTab.Privilege);

        SoundManager.instance.playSound(MusicConfig.Click, false);
        DataStatisticsMgr.instance.stat("点击特权页");
    }
    
    private onClickProfitUpgrade():void
    {
        MergeUserData.instance.upgradePrivilegel(PrivilegeType.Profit);
        this._ui.refreshShopPage(ShopTab.Privilege);
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
    }
    
    private onClickDiscountUpgrade():void
    {
        MergeUserData.instance.upgradePrivilegel(PrivilegeType.Discount);
        this._ui.refreshShopPage(ShopTab.Privilege);
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
    }

    private onPrivilegeUpdate():void
    {
        this._ui.setPrivilegeReddot(true);
    }
    
    private onRefreshShopReddot():void
    {
        this._ui.setShopReddot(true);
    }

    private setFirstShowShopTab():void
    {
        GameSave.setValue(ShopPopupMgr.FirstShowShopTabKey, "yes");
        GameEventMgr.instance.Dispatch(GameEvent.RefreshShopRedPoint);
    }

    public get firstShowShopTabReddot():boolean
    {
        return GameSave.getValue(ShopPopupMgr.FirstShowShopTabKey) != "yes";
    }

    private setFirstShowPrivilegeTab():void
    {
        GameSave.setValue(ShopPopupMgr.FirstShowPrivilegeTabKey, "yes");
        GameEventMgr.instance.Dispatch(GameEvent.OnPrivilegeUpdate);
    }

    public get firstShowPrivilegeTabReddot():boolean
    {
        return GameSave.getValue(ShopPopupMgr.FirstShowPrivilegeTabKey) != "yes";
    }
}