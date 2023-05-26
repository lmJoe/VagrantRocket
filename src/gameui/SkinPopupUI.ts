import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import LevelColor from "../config/LevelColor";
import ResourceManager from "../ctrl/ResourceManager";
import { SkinType, SkinUnlockType } from "../model/GameModel";
import SkinManager from "../ctrl/SkinManager";
import SkinItem from "./SkinItem";
import SkinData from "../model/SkinData";
import GameJsonConfig from "../config/GameJsonConfig";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import TipDialogMgr from "../gameuictrl/TipDialogMgr";
    
export default class SkinPopupUI extends ui.popup.SkinPopupUI
{
    constructor() { 
        super(); 

        this.listSkin.itemRender = SkinItem;
        this.listSkin.repeatX = 5;
        this.listSkin.repeatY = 1;
        this.listSkin.spaceX = 1;
        this.listSkin.hScrollBarSkin = '';
        this.listSkin.scrollBar.elasticBackTime = 200;
        this.listSkin.scrollBar.elasticDistance = 100;
        this.listSkin.selectEnable = true;

        this.listSkin.visible = true;
        this.listSkin.renderHandler = new Laya.Handler(this, this.onSkinItemRender);
        this.listSkin.selectHandler = new Laya.Handler(this, this.onSkinItemSelect);

        this.aniBgEft.stop();
        this.aniGuide.mouseEnabled=false;
        this.aniGuide.mouseThrough=true;
        this.setGuideUse(false);
    }
    
    onEnable(): void 
    {
        this.imgSkin.visible = false;
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
        this.aniBgEft.stop();
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnSkin_ClickEvent, [clickTarget]);
    }

    private _sceneImgBg:Laya.Image;
    private _curTab:SkinType;
    //都是对应SkinType数据
    private _mySkinNum:number;
    private _mySkinIndexs:Array<boolean>;
    private _skinDataList:Array<SkinData>;
    //
    private _curSelectSkinData:SkinData;
    private _selectIndex:number;
    private _selectColorId:number;
    //
    private _forceShowHeadId:number;

    public setBg():void
    {
        if(!this._sceneImgBg)
        {
            this._sceneImgBg = new Laya.Image();
            this.addChildAt(this._sceneImgBg, 0);
            this._sceneImgBg.size(Laya.stage.width, Laya.stage.height);
        }
        let levelColorType = LevelColor.getLevelColorType();
        this._sceneImgBg.skin = ResourceManager.instance.getGameBgUrl(levelColorType);
        this._sceneImgBg.alpha = 1;
        //
        this.aniBgEft.play(0,true);
    }

    public showSkinHead(headId:number):void
    {
        this._forceShowHeadId = headId;
    }

    public showTab(type:SkinType):void
    {
        this._curTab = type;

        this.setTab();
        this.setSkinList();
    }

    private setTab():void
    {
        if(this._curTab == SkinType.Normal)
        {
            this.btnSkinNormal.skin = "imgRes2/skin/imgNormalTab1.png";
            this.btnSkinNormal.mouseEnabled = false;
            this.btnSkinSpecial.skin = "imgRes2/skin/imgSpecialTab0.png";
            this.btnSkinSpecial.mouseEnabled = true;
        }else
        {
            this.btnSkinNormal.skin = "imgRes2/skin/imgNormalTab0.png";
            this.btnSkinNormal.mouseEnabled = true;
            this.btnSkinSpecial.skin = "imgRes2/skin/imgSpecialTab1.png";
            this.btnSkinSpecial.mouseEnabled = false;
        }
    }

    public setReddot():void
    {
        let normalReddot:Laya.Image = this.btnSkinNormal.getChildByName("imgReddot") as Laya.Image;
        let specialReddot:Laya.Image = this.btnSkinSpecial.getChildByName("imgReddot") as Laya.Image;
        normalReddot.visible = false;
        specialReddot.visible = false;

        let skinNoSelectedList = SkinManager.instance.getSkinNoSelectedList();
        for(var i=0; i<skinNoSelectedList.length; i++)
        {
            let skinData = skinNoSelectedList[i];
            if(skinData)
            {
                if(skinData.skinType == SkinType.Normal)
                {
                    normalReddot.visible = true;
                }else{
                    specialReddot.visible = true;
                }
            }
        }
    }

    private setSkinList():void
    {
        this._selectIndex = -1;
        this._selectColorId = -1;

        this.getSkinTabList();
        this.setMySkinNum();
        this.getDefaultSelect();
        
        this.listSkin.array = this._skinDataList;
        //
        this.listSkin.selectedIndex = this._selectIndex;
        let scrollIndex = Math.max(0, this._selectIndex-2);
        this.listSkin.scrollTo(scrollIndex);
    }

    private getSkinTabList():void
    {
        this._skinDataList = [];
        this._mySkinIndexs = [];
        this._mySkinNum = 0;

        this.getSkins();
        this.sortSkins();
        this.caleSkinsState();

        this._forceShowHeadId = -1;
    }

    private getSkins():void
    {
        let allList:Array<SkinData> = GameJsonConfig.instance.getAllSkinConfig();
        //拿到该类别的皮肤数据
        for(var i=0; i<allList.length; i++)
        {
            let skinData = allList[i];
            if(skinData.skinType == this._curTab)
            {
                if(skinData.skinType == SkinType.Normal)
                {
                    if(SkinManager.instance.checkHasSkin(skinData.headId))
                    {
                        this._skinDataList.push(skinData);
                    }
                }else{
                    this._skinDataList.push(skinData);
                }
            }
        }
    }

    private sortSkins():void
    {
       //先按解锁类型和数值排序
       this._skinDataList.sort(function(dataA:SkinData, dataB:SkinData):number
       {
           if(dataA.unlockType == dataB.unlockType)
           {
               return dataA.unlockValue - dataB.unlockValue;
           }
           else
           {
               return dataA.unlockType - dataB.unlockType;
           }
       });
       //再按是否获得排序(冒泡)
       for(var i=1; i<this._skinDataList.length; i++)
       {
           for(var j=0; j<this._skinDataList.length-i; j++)
           {
                let aSkin:SkinData = this._skinDataList[j];
                let bSkin:SkinData = this._skinDataList[j+1];
                let gainA:boolean = SkinManager.instance.checkHasSkin(aSkin.headId);
                let gainB:boolean = SkinManager.instance.checkHasSkin(bSkin.headId);
                if(!gainA && gainB)
                {
                    this._skinDataList[j] = bSkin;
                    this._skinDataList[j+1] = aSkin;
                }
           }
       }
    }

    private caleSkinsState():void
    {
        //获得当前皮肤拥有情况
        for(var j=0; j<this._skinDataList.length; j++)
        {
            let skinData = this._skinDataList[j];
            if( SkinManager.instance.checkHasSkin(skinData.headId) )
            {
                this._mySkinIndexs.push( true );
                this._mySkinNum ++;
            }else{
                this._mySkinIndexs.push( false );
            }
            //判断是否有强制显示的
            if(this._forceShowHeadId != -1)
            {
                if(skinData.headId == this._forceShowHeadId)
                {
                    this.setSelectData(j);
                }
            }
            else
            {
                //判断当前类型皮肤有无正在使用中
                if(SkinManager.instance.hasUseSkin && skinData.headId == SkinManager.instance.getShipHeadId())
                {
                    this.setSelectData(j, SkinManager.instance.getShipHeadColorId());
                }
            }
        }
    }

    private setMySkinNum():void
    {
        this.txtSkinNum.text = "持有皮肤 "+this._mySkinNum+"/"+this._skinDataList.length;
    } 
    
    private getDefaultSelect():void
    {
        //没有使用中皮肤
        if(this._selectIndex == -1 && this._selectColorId == -1)
        {
            //从后向前遍历，第一个true就是当前解锁的最新皮肤，如果没有，就显示第一个将解锁的皮肤
            for(var i=this._mySkinIndexs.length-1; i>=0; i--)
            {
                if( this._mySkinIndexs[i] == true )
                {
                    this.setSelectData(i);
                    break;
                }
            }
            if(i < 0)
            {
                this.setSelectData(0);
            }
        }
        //
        this.setSelectSkinInfo();
    }

    private setSelectData(index:number, colorId:number=-1):void
    {
        this._selectIndex = index;
        this._curSelectSkinData = this._skinDataList[this._selectIndex];
        if(colorId == -1)
        {
            this._selectColorId = this._curSelectSkinData.colorList[0];
        }else{
            this._selectColorId = colorId;
        }
    }

    private setSelectSkinInfo():void
    {
        this.txtSkinName.text = this._curSelectSkinData.skinName;
        this.setDisplay();
        //设置颜色
        this.setColorInfo();
        //设置按钮
        this.setSkinBtn();
        //引导
        if(this._curSelectSkinData.skinType==SkinType.Special && SkinManager.instance.firstUseSkin==false && this._mySkinIndexs[this._selectIndex]==true)
        {
            this.setGuideUse(true);
        }else
        {
            this.setGuideUse(false);
        }
    }

    private setDisplay():void
    {
        this.imgSkin.visible = true;
        this.imgSkin.skin = null;
        this.imgSkin.skin = this._curSelectSkinData.getDisplaySkin(this._selectColorId);
        if(this._curSelectSkinData.skinType == SkinType.Special)
        {
            this.txtSkinDesc.text = this._curSelectSkinData.desc;
            this.txtSkinDesc.visible = true;
            this.imgSkin.size(450, 450);
        }else{
            this.txtSkinDesc.visible = false;
            this.imgSkin.size(256, 256);
        }
        this.imgSkin.centerX = 0;
        this.imgSkin.centerY = -150;
    }

    private setColorInfo():void
    {
        if(this._mySkinIndexs[this._selectIndex] == false)
        {
            this.boxColor.visible = false;
            return;
        }
        this.boxColor.visible = true;
        for(var i=0; i<5; i++)
        {
            let box = this.boxColor.getChildByName("itemColor"+i) as Laya.Button;
            box.visible = false;
            if(i < this._curSelectSkinData.colorList.length)
            {
                let colorId = this._curSelectSkinData.colorList[i];

                box.visible = true;
                let imgColor = box.getChildByName("imgColor") as Laya.Image;
                imgColor.skin = "imgRes2/skin/imgColor"+colorId+".png";
                
                let imgColorSelect = box.getChildByName("imgColorSelect") as Laya.Image;
                imgColorSelect.visible = colorId == this._selectColorId;
            }
        }
    }

    private setSkinBtn():void
    {
        if(this._mySkinIndexs[this._selectIndex] == true)
        {
            this.btnUnlock.visible = false;
            let isUse:boolean = this._curSelectSkinData.headId != SkinManager.instance.getShipHeadId() || this._selectColorId != SkinManager.instance.getShipHeadColorId();
            this.btnUse.visible = isUse;
        }else{
            this.btnUse.visible = false;
            this.btnUnlock.visible = true;
            this.setBtnUnlock();
        }
    }
    
    private setBtnUnlock():void
    {
        let boxUnlock0 = this.btnUnlock.getChildByName("boxUnlock0") as Laya.Box;
        let boxUnlock1 = this.btnUnlock.getChildByName("boxUnlock1") as Laya.Box;
        let boxUnlock2 = this.btnUnlock.getChildByName("boxUnlock2") as Laya.Box;
        switch(this._curSelectSkinData.unlockType)
        {
            case SkinUnlockType.ShipLevel:
                boxUnlock0.visible = true;
                boxUnlock1.visible = false;
                boxUnlock2.visible = false;
                let txtValue = boxUnlock0.getChildByName("txtValue") as Laya.FontClip;
                txtValue.value = ""+this._curSelectSkinData.unlockValue;
                break;
            case SkinUnlockType.Sign:
                boxUnlock0.visible = false;
                boxUnlock1.visible = false;
                boxUnlock2.visible = true;
                break;
            case SkinUnlockType.SolarIndex:
            case SkinUnlockType.SolarNum:
                boxUnlock0.visible = false;
                boxUnlock1.visible = true;
                boxUnlock2.visible = false;
                break;
        }
    }

    private onSkinItemRender(skinItem:SkinItem, index:number):void
    {
        let skinData = this._skinDataList[index];
        let isSelect = this._selectIndex == index;
        skinItem.setInfo(index, skinData, isSelect, this._mySkinIndexs[index]==false);
    }

    private onSkinItemSelect(index:number):void
    {
        let skinData = this._skinDataList[index];
        //如果选中的是正在使用的皮肤，颜色值选中使用中的颜色
        if(skinData.headId == SkinManager.instance.getShipHeadId())
        {
            this.setSelectData(index, SkinManager.instance.getShipHeadColorId());
        }else{
            this.setSelectData(index, -1);
        }
        this.setSelectSkinInfo();
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    public useSkin():void
    {
        let skinData = this._skinDataList[ this._selectIndex ];
        SkinManager.instance.changeSkin(skinData.headId, this._selectColorId);

        this.setSkinBtn();
    }

    public selectColor(colorIndex:number):void
    {
        this._selectColorId = this._curSelectSkinData.colorList[colorIndex];
        this.setDisplay();
        this.setColorInfo();
        this.setSkinBtn();
        //
        DataStatisticsMgr.instance.stat("选择皮肤颜色",{"headId": this._curSelectSkinData.headId.toString()});
    }

    public setGuideUse(enable:boolean):void
    {
        if(enable)
        {
            this.imgGuideHand.visible = true;
            this.aniGuide.visible = true;
            this.aniGuide.play(0,true);
        }else{
            this.aniGuide.stop();
            this.imgGuideHand.visible = false;
            this.aniGuide.visible = false;
        }
    }

    public showUnlockDesc():void
    {
        if(this._curSelectSkinData)
        {
            switch(this._curSelectSkinData.unlockType)
            {
                case SkinUnlockType.ShipLevel:
                    TipDialogMgr.instance.show("未达到解锁等级，快升级火箭吧");
                    break;
                case SkinUnlockType.Sign:
                    TipDialogMgr.instance.show("签到"+this._curSelectSkinData.unlockValue+"天才能解锁皮肤");
                    break;
                case SkinUnlockType.SolarIndex:
                case SkinUnlockType.SolarNum:
                    TipDialogMgr.instance.show("抵达新星系接收，快去飞行吧");
                    break;
            }
        }
    }
}