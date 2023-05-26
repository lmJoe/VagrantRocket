import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import { ShopTab, PrivilegeType } from "../merge/data/MergeModel";
import ShopItem from "./ShopItem";
import GameJsonConfig from "../config/GameJsonConfig";
import ShipInfoData from "../merge/data/ShipInfoData";
import MergeUserData from "../merge/data/MergeUserData";
import PrivilegeData from "../merge/data/PrivilegeData";
import ShopMgr from "../merge/ctrl/ShopMgr";
import UserData from "../data/UserData";
import GameSave from "../data/GameSave";
    
export default class ShopPopupUI extends ui.popup.ShopPopupUI
{
    constructor() { 
        super(); 
        this.mouseThrough = true;
        this.initUI();
    }

    private _allShipInfoList:Array<ShipInfoData>;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnShop_ClickEvent, [clickTarget]);
    }

    private initUI():void
    {
        this.listPanel.itemRender = ShopItem;
        this.listPanel.repeatX = 1;
        this.listPanel.repeatY = 6;
        this.listPanel.spaceY = 5;
        this.listPanel.vScrollBarSkin = '';
        this.listPanel.scrollBar.elasticBackTime = 200;
        this.listPanel.scrollBar.elasticDistance = 100;
        this.listPanel.selectEnable = true;
    }

    public showShopPage(type:ShopTab):void
    {
        this.setTab(type);
        if(type == ShopTab.Ship)
        {
            this.setShipShop();
        }else{
            this.setPrivilege();
        }
        this.setDiscountTag();
    }
    
    public refreshShopPage(type:ShopTab):void
    {
        if(type == ShopTab.Ship)
        {
            this.setShipShop();
        }else{
            this.setPrivilege();
        }
        this.setDiscountTag();
    }

    private setDiscountTag():void
    {
        let discountBuff:number = ShopMgr.instance.getOtherShopBuff(PrivilegeType.Discount)*100;
        discountBuff = parseInt(discountBuff.toFixed(0));
        if(discountBuff > 0)
        {
            this.boxDiscountTag.visible = true;
            this.txtDiscountTag.value = (discountBuff)+"%";
        }else{
            this.boxDiscountTag.visible = false;
        }
        this.boxDiscountTag.mouseEnabled = false;
        this.boxDiscountTag.mouseThrough = true;
    }

    private setTab(type:ShopTab):void
    {
        if(type == ShopTab.Ship)
        {
            this.btnTabShip.skin = "imgRes2/shop/imgShip1.png";
            this.btnTabShip.mouseEnabled = false;
            this.btnTabPrivilege.skin = "imgRes2/shop/imgPrivilege0.png";
            this.btnTabPrivilege.mouseEnabled = true;

            this.setPrivilegeReddot(true);
            this.setShopReddot(true);
        }else{
            this.btnTabShip.skin = "imgRes2/shop/imgShip0.png";
            this.btnTabShip.mouseEnabled = true;
            this.btnTabPrivilege.skin = "imgRes2/shop/imgPrivilege1.png";
            this.btnTabPrivilege.mouseEnabled = false;

            this.setPrivilegeReddot(true);
            this.setShopReddot(true);
        }
    }

    private setShipShop():void
    {
        this.listPanel.visible = true;
        this.boxPrivilege.visible = false;

        this.listPanel.renderHandler = new Laya.Handler(this, this.onShopListRender);
        this._allShipInfoList = GameJsonConfig.instance.getAllShipInfoConfig();
        this.listPanel.array = this._allShipInfoList;
        //滚动
        let videoItemIndex = this.getCurVideoShopItemIndex();
        let scrollIndex = Math.max(0, videoItemIndex-2);
        this.listPanel.scrollTo(scrollIndex);
    }


    private onShopListRender(shopItem: ShopItem, index: number):void
    {
        let info = this._allShipInfoList[index];
        shopItem.setInfo(info, index);
    }

    private getCurVideoShopItemIndex():number
    {
        let freeGetShipTime = MergeUserData.instance.ShopVideoGetShipTime;
		if(freeGetShipTime == 0)
		{
			let maxUnlockShipInfo = GameJsonConfig.instance.getShipInfoConfig( MergeUserData.instance.iMaxLockedShipId );
			if(maxUnlockShipInfo.bonusShip_level > 0)
			{
                for (let index = 0; index < this._allShipInfoList.length; index++) 
                {
                    let shipInfo = this._allShipInfoList[index];
                    if(shipInfo.level == maxUnlockShipInfo.bonusShip_level)
                    {
                        return index;
                    }
                }
			}	
        }
        return -1;
    }

    private setPrivilege():void
    {
        this.listPanel.visible = false;
        this.boxPrivilege.visible = true;

        this.setProfit();
        this.setDiscount();
    }

    private setProfit():void
    {
        let profitNum:number = MergeUserData.instance.getPrivilegeLevel(PrivilegeType.Profit);
        let cfg:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Profit, profitNum+1);
        let isMax:boolean = false;
        if(cfg == null)
        {
            isMax = true;
            cfg = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Profit, profitNum);
        }
        this.txtProfitLevel.value = "" + cfg.level;
        this.txtProfitDesc.text = cfg.desc + " " + cfg.value + "%";
        let videoCount:number = UserData.instance.adVideoCount;
        this.barProfit.value = isMax ? 1 : videoCount/cfg.price;
        this.txtProfitValue.text = isMax ? "MAX" : videoCount+"/"+cfg.price;
        if(videoCount >= cfg.price && !isMax)
        {
            this.btnProfitUpgrade.visible = true;
            this.barProfit.visible = false;
            this.imgProfitReddot.visible = true;
        }else{
            this.btnProfitUpgrade.visible = false;
            this.barProfit.visible = true;
            this.imgProfitReddot.visible = false;
        }
    }

    private setDiscount():void
    {
        let discountNum:number = MergeUserData.instance.getPrivilegeLevel(PrivilegeType.Discount);
        let cfg:PrivilegeData = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Discount, discountNum+1);
        let isMax:boolean = false;
        if(cfg == null)
        {
            isMax = true;
            cfg = GameJsonConfig.instance.getPrivilegeConfigByTypeLevel(PrivilegeType.Discount, discountNum);
        }
        this.txtDiscountLevel.value = "" + cfg.level;
        this.txtDiscountDesc.text = cfg.desc + " " + cfg.value + "%";
        let videoCount:number = UserData.instance.adVideoCount;
        this.barDiscount.value = isMax ? 1 : videoCount/cfg.price;
        this.txtDiscountValue.text = isMax ? "MAX" : videoCount+"/"+cfg.price;
        if(videoCount >= cfg.price && !isMax)
        {
            this.btnDiscountUpgrade.visible = true;
            this.barDiscount.visible = false;
            this.imgDiscountReddot.visible = true;
        }else{
            this.btnDiscountUpgrade.visible = false;
            this.barDiscount.visible = true;
            this.imgDiscountReddot.visible = false;
        }
    }

    public setPrivilegeReddot(boo:boolean=true):void
    {
        this.imgPrivilegeReddot.visible = boo && ShopMgr.instance.canUpdatePrivilege;
    }

    public setShopReddot(boo:boolean=true):void
    {
        this.imgShopReddot.visible = boo && ShopMgr.instance.canShopRed;
    }
}
