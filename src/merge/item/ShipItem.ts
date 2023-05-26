import { ui } from "../../ui/layaMaxUI";
import ShipItemDrag from "./ShipItemDrag";
import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import MergeUserData from "../data/MergeUserData";
import Mathf from "../../utils/Mathf";
import ShipInfoData from "../data/ShipInfoData";
import CacheShipData from "../data/CacheShipData";
import { ShipBoxType, PrivilegeType } from "../data/MergeModel";
import MergeDefine from "../data/MergeDefine";
import GameJsonConfig from "../../config/GameJsonConfig";
import Util from "../../utils/Util";
import PowerUpMgr from "../ctrl/PowerUpMgr";
import ShopMgr from "../ctrl/ShopMgr";
import SoundManager from "../../ctrl/SoundManager";
import MusicConfig from "../../config/MusicConfig";
import ServerData from "../../data/ServerData";

export default class ShipItem extends ui.component.ShipItemUI
{
    constructor(){
        super();
    }

    public static readonly ShipItemWidth:number = 130;
    public static readonly ShipItemHeight:number = 130;
    public static readonly ShipItemIconWidth:number = 122;
    public static readonly ShipItemIconHeight:number = 122;

    private static readonly BoxEffectTime:number = 10000;//10000

    private _index:number;
    private _curShipId:number;
    private _curShipInfo:ShipInfoData;
    private _earnings:number;
    private _earningsPeriod:number;
    private _itemDrag:ShipItemDrag;

    private _curTime:number;
    private _boxEffectTime:number;
    private _isHaveShip:boolean;
    private _shipBoxIsOpen:boolean;
    private _shipBoxIsVideo:boolean;
    private _isMergeing:boolean;
    private _isGrey:boolean;
    private _isDarging:boolean;
    private _isInUpgardeTime:boolean;

    private _dragTargetPos:Laya.Vector2;
    private _hechengAniImg:Laya.Image;

    public get index():number
    {
        return this._index;
    }

    public get shipId():number
    {
        if(this._isHaveShip)
        {
            return  this._isInUpgardeTime ? this._curShipId+1 : this._curShipId;
        }else
        {
            return -1;
        }
    }

    public get shipBoxIsOpen():boolean
    {
        return this._shipBoxIsOpen;
    }

    public get shipBoxIsVideo():boolean
    {
        return this._shipBoxIsVideo;
    }

    public get isHaveShip():boolean
    {
        return this._isHaveShip;
    }

    public get isCanCreate():boolean
    {
        return !this._isHaveShip;
    }

    public get iconUrl():string
    {
        return this._curShipInfo.skinUrl;
    }

    public get shipInfo():ShipInfoData
    {
        return this._curShipInfo;
    }

    public get centerPos():Laya.Vector2
    {
        let centerX:number = this.x + 0.5*ShipItem.ShipItemWidth;
        let centerY:number = this.y + 0.5*ShipItem.ShipItemHeight;
        return new Laya.Vector2(centerX, centerY);
    }

    public init(idx:number, drag:ShipItemDrag):void
    {
        this._index = idx;
        this._itemDrag = drag;
        this.name = "ShipItem_"+this._index;
        this.initMergeAni();

		if (MergeUserData.instance.getItemShipIdByIdx(this._index) > 0)
		{
            this.activeItem( MergeUserData.instance.getItemShipIdByIdx(this._index) );
            this._curTime = Mathf.range(0, 3000);
		}
		else
		{
            this.destroyItem();
		}
        this._isMergeing = false;
        this._isInUpgardeTime = false;
    }

    private initMergeAni():void
    {
        this._hechengAniImg = new Laya.Image();
        this._hechengAniImg.size(200, 200);//230
        let diffX:number = 0.5*(this.width-this._hechengAniImg.width);
        let diffY:number = 0.5*(this.height-this._hechengAniImg.height);
        this._hechengAniImg.pos(diffX, diffY);
        this._hechengAniImg.mouseEnabled = false;
        this._hechengAniImg.mouseThrough = true;
        this.addChild(this._hechengAniImg);
    }

    private hideMergeAni():void
    {
        this._hechengAniImg.visible = false;
        this._hechengAniImg.skin = null;
    }

    public setEnable(enable:boolean):void
    {
        this.mouseEnabled = enable;
        this.mouseThrough = !enable;
    }

    public showItem(isShow:boolean):void
    {
        this.imgSelect.visible = isShow;
        this.imgIcon.visible = isShow;
        this.txtLevel.visible = isShow;
        this.imgLevelBg.visible = isShow;
        
        this.txtEarnings.visible = false;
        this.imgBox.visible = false;
        this.eftBoxShake.visible = false;
        this.imgBg.visible = true;
        this.hideMergeAni();
    }

    private setTxtLevel(level:number, show:boolean=true):void
    {
        this.txtLevel.value = ""+level;
        this.txtLevel.visible = show;
        this.imgLevelBg.visible = show;
    }

    private setItemIcon(skinUrl:string, show:boolean=true):void
    {
        this.imgIcon.size(ShipItem.ShipItemIconWidth, ShipItem.ShipItemIconHeight);
        this.imgIcon.skin = skinUrl;
        this.imgIcon.visible = show;
    }

    private setGrey(grey:boolean):void
	{
        this._isGrey = grey;
        if(grey){
            this.imgIcon.alpha = 0.5;
        }else{
            this.imgIcon.alpha = 1;
        }
	}

    public destroyItem():void
    {
        this._isHaveShip = false;
        this._isGrey = false;
        this._isDarging = false;
        this._dragTargetPos = null;
        this._curShipId = -1;
        this.imgShadow.visible = false;
        MergeUserData.instance.setItemShipid(this._index, -1);
        this.showItem(false);
        this.setEnable(true);
        //移除各种动画
        this.hideBoxEffct();
    }

    public activeItem(shipId:number):void
    {
        this._shipBoxIsOpen = true;
        this._shipBoxIsVideo = false;
        this.activeItemWithShipId(shipId);
        this.setTxtLevel(this._curShipInfo.level);
        this.setItemIcon(this._curShipInfo.skinUrl);
        //隐藏箱子动画
        this.hideBoxEffct();
    }

    private activeItemWithShipId(shipId:number):void
    {
        if(!this._isHaveShip)
        {
            this.showItem(true);
            this._isHaveShip = true;
            this.imgSelect.visible = false;
            this._isGrey = false;
        }  
        this._curTime = 0; 
        this.setEnable(true);
        this._curShipId = shipId;
        this.imgShadow.visible = true;
        MergeUserData.instance.setItemShipid(this._index, shipId);
        this.updateEarnings();
    }

    public updateEarnings():void
    {
        this._curShipInfo = GameJsonConfig.instance.getShipInfoConfig(this._curShipId);
        let num = 1;
		if ( MergeUserData.instance.Money5Time > 0 )
		{
			num = MergeDefine.AirDropMoneyRate;
        }
        this._earnings = this._curShipInfo.output_gold*(num+ShopMgr.instance.getOtherShopBuff(PrivilegeType.Profit));
        this._earningsPeriod = this._curShipInfo.gold_interval;
    }

    public activeShipBox(boxData:CacheShipData):void
    {   
        this._shipBoxIsOpen = boxData.isOpen;
        this._shipBoxIsVideo = boxData.isVideoBox;
        this.activeItemWithShipId(boxData.shipId);
        this.setTxtLevel(this._curShipInfo.level, false);
        this.setItemIcon(this._curShipInfo.skinUrl, false);
        this._boxEffectTime = ShipItem.BoxEffectTime;
        //显示箱子动画
        this.showBoxEffct(boxData.boxType);
    }

	public upgradeShip(upLv:number=1):void
	{
        this.playMergeAni();
        this._isInUpgardeTime = false;
        this._isMergeing = false;
		if (this._curShipId < MergeDefine.MaxShipLevel)
		{
            let newShipLevel = this._curShipId+upLv;
			if (newShipLevel > MergeUserData.instance.iMaxLockedShipId)
			{
                MergeUserData.instance.unlockNewShipLevel(newShipLevel);
			}
            this.activeItem(this._curShipId+upLv);
            //升级数据更新之后，在上传数据
            ServerData.instance.uploadData();
		}
	}

    private showBoxEffct(boxType:ShipBoxType):void
    {
        this.dropBoxEffect(boxType);
    }

    private hideBoxEffct():void
    {
        this.eftBoxShake.stop();
        this.eftBoxShake.visible = false;
        this.imgBox.visible = false;
    }

    public openShipBoxWithEffect(sound:boolean=true):void
    {
        this.openShipBox(sound);
        this.playMergeAni();
    }

    public openShipBox(sound:boolean=true):void
    {
        if(this._shipBoxIsOpen==false && this._isHaveShip)
        {
            this._boxEffectTime = 0;
            this.hideBoxEffct();
            this.activeItem(this._curShipId);
            if(sound)
            {
                SoundManager.instance.playSound(MusicConfig.Merge, false);
            }
            GameEventMgr.instance.Dispatch(GameEvent.RefreshEarnings);
        }
    }

    public resetDrag():void
    {
        if (this._isDarging)
		{
			this.onEndDrag(this._dragTargetPos);
		}
    }

    public onBeginDrag(pos:Laya.Vector2):void
	{
        if(this._isHaveShip && this._isGrey==false && this._shipBoxIsOpen && this._isMergeing==false)
        {
            this._isDarging = true;
            this._dragTargetPos = pos;
            this._itemDrag.onBeginDrag(this, this.centerPos);
            this.setGrey(true);
            GameEventMgr.instance.Dispatch(GameEvent.OnBeginDrag, [this._curShipId, this._index]);
        }
	}

	public onDrag(pos:Laya.Vector2):void
	{
		if (this._isDarging)
		{
			this._itemDrag.onDrag(pos);
		}
	}

	public onEndDrag(pos:Laya.Vector2):void
	{
		if (this._isDarging)
		{
            this._itemDrag.onEndDrag(this, pos);
            this._dragTargetPos = null;
			this._isDarging = false;
            this.setGrey(false);
            GameEventMgr.instance.Dispatch(GameEvent.OnEndDrag);
		}
    }
    
    public onDragEndHit(dragItem:ShipItem, callback:Laya.Handler):void
	{
        if(this._isHaveShip)
        {
            if(this._isMergeing || this._shipBoxIsOpen==false)
            {
                callback.runWith(0);
                return;
            }
            if(dragItem.shipId == this._curShipId && this._curShipId < MergeDefine.MaxShipLevel)
            {
                dragItem.destroyItem();
                this._isInUpgardeTime = true;
                this._isMergeing = true;
                this._itemDrag.playLevelUpAni(this, this.centerPos, Laya.Handler.create(this, this.upgradeShip));
                GameEventMgr.instance.Dispatch(GameEvent.CombinationShip);
                callback.runWith(1);
                return;
            }
            //交换
            let myShipId = this._curShipId;
            this.activeItem(dragItem.shipId);
            dragItem.activeItem(myShipId);
        }else{
            this.activeItem(dragItem.shipId);
            dragItem.destroyItem();
        }
        callback.runWith(0);
    }
    
	public update(deltaTime:number):void
	{
        if( this._boxEffectTime > 0 )
        {
            this._boxEffectTime -= deltaTime;
            if(this._boxEffectTime <= 0)
            {
                this.openShipBoxWithEffect();
            }
        }
        if(this._isHaveShip && this._shipBoxIsOpen)
        {
            this._curTime += deltaTime;
            let mult = 1;
            let time = this._earningsPeriod;
            if(MergeUserData.instance.speedUpTime > 0)
            {
                mult = MergeUserData.instance.speedUp.mult;
            }
            if(mult > 0)
            {
                time = time/mult;
            }
            if(this._curTime >= time)
            {
                this._curTime = 0;
                this.revenue();
            }
        }
	}

	private revenue():void
	{
        MergeUserData.instance.changeMoney(this._earnings);
        //飘字
        this.showEarningEffect(this._earnings);
    }
    
    private dropBoxEffect(boxType:ShipBoxType):void
    {
        this.imgBox.skin = "imgRes2/common/imgBox_"+boxType+".png";
        this.imgBox.visible = true;
        this.imgBox.pos(60, 115);
        this.imgBox.alpha = 1;
        this.imgBox.scale(1, 1);
        let tw0 = Laya.Tween.from(this.imgBox, {y:-450, alpha:0}, 200, Laya.Ease.elasticIn, Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(this.imgBox);
            let tw1 = Laya.Tween.to(this.imgBox, {scaleX:1.2, scaleY:0.8}, 80, Laya.Ease.backOut);
            let tw2 = Laya.Tween.to(this.imgBox, {scaleX:1, scaleY:1}, 80, Laya.Ease.backOut, Laya.Handler.create(this, function():void
            {
                Laya.Tween.clearTween(this.imgBox);
                this.boxShakeEffect();
            }), 90);
        }));
    }

    private boxShakeEffect():void
    {
        this.eftBoxShake.visible = true;
        this.eftBoxShake.play(0, true);
    }

    private earningTw:Laya.Tween;
    private showEarningEffect(earnings:number):void
    {
        Laya.Tween.clearTween(this.txtEarnings);
        this.txtEarnings.visible = true;
        this.txtEarnings.pos(60, 40);
        this.txtEarnings.alpha = 1;
        this.txtEarnings.value = "+$"+Util.moneyFormat(earnings);
        
        Laya.Tween.to(this.txtEarnings, {y:-50, alpha:0.5}, 500, Laya.Ease.linearNone, Laya.Handler.create(this, function():void
        {
            this.txtEarnings.visible = false;
        }));
    }

    private _aniCount:number;
    private playMergeAni():void
    {
        this.stopMergeAni();
        this._hechengAniImg.visible = true;
        this._hechengAniImg.skin = null;
        this._aniCount = 1;
        let totalImgCount:number = 14;
        let loopTime:number = 40;
        Laya.timer.loop(loopTime, this, this.onMergeAni, [totalImgCount]);
    }

    private onMergeAni(totalImgCount:number):void
    {
        this._hechengAniImg.skin = "ani/hecheng/hecheng2_"+ Util.strNumber(this._aniCount, 5) +".png";
        this._aniCount ++;
        if(this._aniCount >= totalImgCount)
        {
            this.stopMergeAni();
            this.hideMergeAni();
        }
    }

    private stopMergeAni():void
    {
        Laya.timer.clear(this, this.onMergeAni);
        if(this._hechengAniImg)
        {
            this._hechengAniImg.skin = null;
        }
    }
}