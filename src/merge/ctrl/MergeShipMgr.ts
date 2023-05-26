import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";
import ShipItemDrag from "../item/ShipItemDrag";
import ShipItem from "../item/ShipItem";
import CacheShipData from "../data/CacheShipData";
import GameJsonConfig from "../../config/GameJsonConfig";
import MergeUserData from "../data/MergeUserData";
import MergeDefine from "../data/MergeDefine";
import PowerUpMgr from "./PowerUpMgr";
import TipDialogMgr from "../../gameuictrl/TipDialogMgr";
import MergeGuideManager from "./MergeGuideManager";
import { MergeGuideType } from "../../model/GameModel";
import SoundManager from "../../ctrl/SoundManager";
import MusicConfig from "../../config/MusicConfig";
import VideoBoxPopupMgr from "../../gameuictrl/VideoBoxPopupMgr";

/*
* 合成管理
*/
export default class MergeShipMgr
{
    private static _instance:MergeShipMgr;
    public static get instance():MergeShipMgr
    {
        if(!this._instance)
        {
            this._instance = new MergeShipMgr();
        }
        return this._instance;
    }

    constructor()
    {
    }

    private readonly RowMax:number = 4;
    private readonly ColMax:number = 3;
    private readonly TopOffset:number = 30;
    private readonly MaxCacheDataShipTime:number = 1000;

    private _boxMerge:Laya.Box;
    private _itemDrag:ShipItemDrag;
    private _itemList:Array<ShipItem>;
    private _curItemNum:number;

    private _cacheShipDataNum:number;
    private _curCacheDataShipTime:number;
    public isCanRefreshCacheData:boolean;

    private _curDropVideoBoxTime:number;
    private _curDropFreeBoxTime:number;
    private _curDropFreeBoxCount:number;

    private _tryDragDown:boolean;
    private _tryDragItem:ShipItem;
    private _inDrag:boolean;

    public get itemList():Array<ShipItem>
    {
        return this._itemList;
    }

    public get cacheShipDataNum():number
    {
        return this._cacheShipDataNum;
    }

    public start():void
    {
        this.initCacheShipData();

        this._curDropVideoBoxTime = MergeDefine.DropVideoBoxDelayTime;
        this._curDropFreeBoxTime = MergeDefine.DropFreeBoxTime;
        this._curDropFreeBoxCount = 0;
    }

	private initCacheShipData():void
	{
		if (MergeUserData.instance.CacheShipDataList != null)
		{
			this._cacheShipDataNum = MergeUserData.instance.CacheShipDataList.length;
        }
        this._curCacheDataShipTime = 0;
        this.isCanRefreshCacheData = this._cacheShipDataNum > 0;
	}

	public addCacheShipData(data:CacheShipData):void
	{
		if (MergeUserData.instance.CacheShipDataList == null)
		{
			MergeUserData.instance.CacheShipDataList = [];
		}
        MergeUserData.instance.CacheShipDataList.push(data);
        this.initCacheShipData();
	}

	public getCacheShipData():CacheShipData
	{
        let result = null;
        if(MergeUserData.instance.CacheShipDataList.length > 0)
        {
            result = MergeUserData.instance.CacheShipDataList.shift();
            this.initCacheShipData();
        }
		return result;
	}

	public refreshCacheShipData():void
	{
		if (this.isCanRefreshCacheData == false)
		{
			return;
        }   
        let num = 0;
        let noHaveShipsLength = this.getNoHaveShipsLength();
        if(noHaveShipsLength > 0)
        {
            num = this._cacheShipDataNum < noHaveShipsLength ? this._cacheShipDataNum : noHaveShipsLength;
            for(var i=0; i<num; i++)
            {
                this.createBoxItem(this.getCacheShipData(), null);
            }
        }
	}

    public getHaveShipsLength():number
	{
        let num = 0;
        for(var i=0; i<this._itemList.length; i++)
        {
            if(this._itemList[i].isHaveShip)
            {
                num ++;
            }
        }
        return num;
	}

	public getNoHaveShipsLength():number
	{
        let num = 0;
        for(var i=0; i<this._itemList.length; i++)
        {
            if(!this._itemList[i].isHaveShip)
            {
                num ++;
            }
        }
        return num;
	}

    public initItem(boxMerge:Laya.Box):void
    {
        this._boxMerge = boxMerge;

        this.clearDragItem();

        this._itemDrag = new ShipItemDrag();
        this._boxMerge.addChild(this._itemDrag.iconBox);
        this._itemDrag.iconBox.zOrder = 100;
        //TODO
        this._itemList = [];
        this.createShipItemGrid();

        GameEventMgr.instance.addListener(GameEvent.RefreshShipItemList, this, this.createShipItemGrid);
    }

    private clearDragItem():void
    {
        this._tryDragDown = false;
        this._tryDragItem = null;
        this._inDrag = false;
    }

    private createShipItemGrid():void
    {   
        this._curItemNum = GameJsonConfig.instance.getMergeUserLevelConfig(MergeUserData.instance.playerLevel).max_plane;
        let boxWidth = this._boxMerge.width;
        let boxHeight = this._boxMerge.height;
        let rowSpace = (boxWidth-ShipItem.ShipItemWidth*this.RowMax)/(this.RowMax+1);
        let num2 = 120;//147
        let num3 = 2;
        if( this._curItemNum/num3 > this.ColMax )
        {
            num3 = Math.ceil(this._curItemNum/this.ColMax);
        }
        let zero = Laya.Vector2.ZERO.clone();
        let num4 = 0;
        let num5 = this._curItemNum;
        for(var i=0; i<this.ColMax; i++)
        {
            let num6 = (num5 <= num3) ? num5 : num3;
            num5 = (num5-num3 >= 0) ? (num5-num3) : num5;
            let num7 = 1.5;
            switch(num6)
            {
                case 1:
                    num7 = 2;
                    break;
                case 2:
                    num7 = 1.5;
                    break;
                case 3:
                    num7 = 1.3;
                    break;
                case 4:
                    num7 = 1.25;
                    break;
                case 5:
                    num7 = 1.2;
                    break;
            }
            let num8 = ShipItem.ShipItemWidth*num6 + rowSpace*(num6+1)*num7;
            zero.x = (boxWidth-num8)/2;
            zero.y = this.TopOffset + i*num2;
            for(var j=0; j<num3; j++)
            {
                num4 ++;
                if(num4 > this._curItemNum)
                {
                    return;
                }
                zero.x = zero.x + rowSpace*num7;
                if(this._itemList.length >= num4)
                {
                    this._itemList[num4-1].pos(zero.x, zero.y);
                }else{
                    let item = new ShipItem();
                    item.init(num4-1, this._itemDrag);
                    item.pos(zero.x, zero.y);
                    this._itemList.push(item);
                    this._boxMerge.addChild(item);
                }
                zero.x += ShipItem.ShipItemWidth;
                // console.log("gird pos ",num4-1,zero.x, zero.y);
            }
        }
    }

    public createItem(shipId:number, callback:Laya.Handler):void
    {
        let item = this.getRandomItem();
        if(item)
        {
            item.activeItem(shipId);
            if(callback){
                callback.runWith(item);
            }
        }else{
            if(callback){
                callback.runWith(null);
            }
        }
    }

    public createBoxItem(boxData:CacheShipData, callback:Laya.Handler):void
    {
        let item = this.getRandomItem();
        if(item)
        {
            item.activeShipBox(boxData);
            if(callback){
                callback.runWith(item);
            }
        }else{
            if(callback){
                callback.runWith(null);
            }
        }
    }

    private getRandomItem():ShipItem
    {
        //引导是必须第二个格子产生
        if(MergeGuideManager.instance.mergeGuideStep == MergeGuideType.MergeShip)
        {
            if(this._itemList[1] && this._itemList[1].isCanCreate)
            {
                return this._itemList[1];
            }
        }
        //
        let arr:Array<number> = [];
        for(var i=0; i<this._curItemNum; i++)
        {
            if(this._itemList[i] && this._itemList[i].isCanCreate)
            {
                arr.push(i);
            }
        }
        if(arr.length > 0)
        {   
            let idx = Math.floor( Math.random() * arr.length );
            return this._itemList[ arr[idx] ];
        }else{
            return null;
        }
    }

    private getItemByIdx(idx:number):ShipItem
    {
        return this._itemList[idx];
    }

    public update(deltaTime:number):void
    {
        this.updateShipEarnings(deltaTime);
        if(MergeGuideManager.instance.hasFinish)
        {
            this.updateFreeDropShip(deltaTime);
            this.updateCacheDataShip(deltaTime);
        }
    }
    
    public onClickItem(itemIdx:number):void
    {
        let item = this.getItemByIdx(itemIdx);
        if(item && item.isHaveShip && item.shipBoxIsOpen==false)
        {
            if(item.shipBoxIsVideo)
            {
                VideoBoxPopupMgr.instance.show(item);
            }else{
                item.openShipBox();
            }
        }
    }
    
    public onMouseDown(itemIdx:number):void
    {
        let item = this.getItemByIdx(itemIdx);
        if(item && item.isHaveShip && item.shipBoxIsOpen && this._itemDrag && !this._itemDrag.inMergeing)
        {
            this._tryDragDown = true;
            this._tryDragItem = item;
            this._inDrag = false;
        }
    }
    
    public onMouseUp(hitItem:boolean, itemIdx:number=-1):void
    {
        if(this._inDrag)
        {
            this.onEndDrag(hitItem, itemIdx);
        }
        this.clearDragItem();
    }
    
    public onMouseMove():void
    {
        if(this._tryDragDown)
        {
            if(this._inDrag == false)
            {
                this._inDrag = true;
                this.onBeginDrag();
            }else{
                this.onDrag();
            }
        }
    }

    private onBeginDrag():void
    {
        if(this._tryDragItem)
        {
            this._tryDragItem.onBeginDrag( this.getWorldMouseXYToDragPos() );
            this.showShipSelectIcon(true, this._tryDragItem.shipId, this._tryDragItem.index);
        }
    }

    private onDrag():void
    {
        if(this._tryDragItem)
        {
            this._tryDragItem.onDrag( this.getWorldMouseXYToDragPos() );
        }
    }

    private onEndDrag(hitItem:boolean, itemIdx:number=-1):void
    {
        if(this._tryDragItem)
        {
            this._tryDragItem.onEndDrag( this.getWorldMouseXYToDragPos() );
            this.showShipSelectIcon(false, this._tryDragItem.shipId, this._tryDragItem.index);
            if(hitItem && this._tryDragItem.index != itemIdx)
            {
                let hitShipItem = this._itemList[itemIdx];
                if(hitShipItem)
                {
                    hitShipItem.onDragEndHit(this._tryDragItem, Laya.Handler.create(this, this.onDragEndCallBack));
                }
            }
        }
    }

    private onDragEndCallBack(state:number):void
	{
		if (state != 1)
		{
			return;
        }
        GameEventMgr.instance.Dispatch(GameEvent.RefreshEarnings);
	}

    private getWorldMouseXYToDragPos():Laya.Vector2
    {
        let localX = Laya.stage.mouseX - this._boxMerge.x;
        let localY = Laya.stage.mouseY - this._boxMerge.y;
        return new Laya.Vector2(localX, localY);
    }

    private showShipSelectIcon(isShow:boolean, shipId:number, index:number):void
	{
        if(this._inDrag)
        {
            for(var i=0; i<this._itemList.length; i++)
            {
                let item = this._itemList[i];
                if(item && item.shipBoxIsOpen)
                {
                    item.imgSelect.visible = isShow && item.shipId==shipId && item.index!=index;
                }
            }
        }
	}

    //更新飞船产出效率
    public updateShipItemEarningsSpeed():void
	{
        this._itemList.forEach(item => {
            if(item.isHaveShip && item.shipId>0)
            {
                item.updateEarnings();
            }
        });
    }

    //更新飞船 —— 金币产出/箱子动画等
	private updateShipEarnings(deltaTime:number):void
	{
        this._itemList.forEach(item => {
            if(item.isHaveShip && item.shipId>0)
            {
                item.update(deltaTime);
            }
        });
	}
    
    //更新待生成的飞船
    private updateCacheDataShip(deltaTime:number):void
	{
        if(this._cacheShipDataNum > 0)
        {
            this._curCacheDataShipTime += deltaTime;
            //每秒检查一次能否生成
            if(this._curCacheDataShipTime >= this.MaxCacheDataShipTime)
            {
                this._curCacheDataShipTime = 0;
                this.refreshCacheShipData();
            }
        }
	}

    //更新免费掉落的飞船
	private updateFreeDropShip(deltaTime:number):void
	{
        if(this._curDropFreeBoxTime > 0)
        {
            this._curDropFreeBoxTime -= deltaTime;
            if(this._curDropFreeBoxTime <= 0)
            {
                this._curDropFreeBoxCount ++;
                this._curDropFreeBoxTime = MergeDefine.DropFreeBoxTime;
                PowerUpMgr.createFreeDropShip(1, false);
            }
            if(MergeUserData.instance.iMaxLockedShipId>=MergeDefine.DropVideoBoxLevelLimit && this._curDropFreeBoxCount>0 && this._curDropFreeBoxCount%MergeDefine.DropVideoBoxCount==0)
            {
                this._curDropVideoBoxTime -= deltaTime;
                if(this._curDropVideoBoxTime <= 0)
                {
                    this._curDropFreeBoxCount = 0;
                    this._curDropVideoBoxTime = MergeDefine.DropVideoBoxDelayTime;
                    PowerUpMgr.createDropVideoBox();
                }
            }
        }
    }
    
    //打开所有箱子
    public openAllShipItemBox():void
    {
        this._itemList.forEach(item => {
            if(item.isHaveShip && item.shipBoxIsOpen==false)
            {
                item.openShipBox(false);
            }
        });
    }

    public onSellShip():void
    {
        if(!this._tryDragItem || !this._inDrag)
        {
            return;
        }
        //如果是 最高等级 且 最高等级只有一架，不能卖出
        if(this._tryDragItem.shipId == MergeUserData.instance.iMaxLockedShipId)
        {
            //检查是不是只有一架
            let maxIdShipNum:number = 0;
            let shipItemLen:number = MergeUserData.instance.getItemShipLength();
            for(var i=0; i<shipItemLen; i++)
            {
                if(MergeUserData.instance.getItemShipIdByIdx(i) == MergeUserData.instance.iMaxLockedShipId)
                {
                    maxIdShipNum ++;
                }
            }
            if(maxIdShipNum == 1)
            {
                TipDialogMgr.instance.show("该火箭正在飞行，不能售卖");
                SoundManager.instance.playSound(MusicConfig.NoCoin, false);
                this.clearDragItem();
                return;
            }
        }
        MergeUserData.instance.changeMoney( this._tryDragItem.shipInfo.sell_gold );
        //
        GameEventMgr.instance.Dispatch(GameEvent.SellShip);
        this.onEndDrag(false);
        this._tryDragItem.destroyItem();
        this.clearDragItem();
    }

    public checkCanMerege():Array<ShipItem>
    {
        let arr:Array<ShipItem> = [];
        for(var i=0; i<this._itemList.length; i++)
        {
            if(this._itemList[i].isHaveShip && this._itemList[i].shipId > 0 && this._itemList[i].shipBoxIsOpen)
            {
                let checkItem = this._itemList[i];
                for(var j=i; j<this._itemList.length; j++)
                {
                    let item = this._itemList[j];
                    if(item.index != checkItem.index && item.isHaveShip && item.shipId == checkItem.shipId && item.shipBoxIsOpen)
                    {
                        arr.push(checkItem);
                        arr.push(item);
                        return arr;
                    }
                }
            }
        }
        return null;
    }
}