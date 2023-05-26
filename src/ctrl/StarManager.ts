import GameSave from "../data/GameSave";
import StarInfo from "../model/StarInfo";
import GameJsonConfig from "../config/GameJsonConfig";
import ArrayUtil from "../utils/ArrayUtil";
import UserData from "../data/UserData";
import ServerData from "../data/ServerData";
import NpcDialogManager from "../gameuictrl/NpcDialogManager";
import { DialogType } from "../model/GameModel";
import StarPopupMgr from "../gameuictrl/StarPopupMgr";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ResourceManager from "./ResourceManager";

/*
* 星球探索管理;
*/
export default class StarManager{
    constructor(){
        this.init();
    }

    private static _instance:StarManager;
    public static get instance():StarManager
    {
        if(!this._instance)
        {
            this._instance = new StarManager();
        }
        return this._instance;
    }

    private static readonly StarUserKey:string = "StarUserKey";

    //所有星球信息
    private _allStars:Array<StarInfo>;
    //星球发现顺序 （前端设定好）
    private _discoverStarOrder:Array<number>;
    //用户已经发现的星球id
    private _discoverStarIds:Array<number>;
    //下次飞行将发现的星球信息
    private _targetStarInfo:StarInfo;
    
    private init():void
    {
        this._targetStarInfo = null;
        this._allStars = GameJsonConfig.instance.getAllStarInfo();
        GameEventMgr.instance.addListener(GameEvent.OnLaunched, this, this.onLaunched);
    }

    public get discoverStarIds():Array<number>
    {
        return this._discoverStarIds;
    }

    public get targetStarInfo():StarInfo
    {
        return this._targetStarInfo;
    }

    private onLaunched():void
    {
        this.prevLoadStarImg();
    }

    public clearData():void
    {
        GameSave.clearValue(StarManager.StarUserKey);
    }

    public getLocal():void
    {
        let dataStr:string = GameSave.getValue(StarManager.StarUserKey);
        if( dataStr && dataStr.length>0 )
        {
            let saveData:any = JSON.parse(dataStr);
            this.parseData(saveData);
        }else{
            this.parseData(null);
        }
    }

    public getServer(serverData:any):void
    {
        if( serverData )
        {
            this.parseData(serverData);
        }
    }

    private parseData(data:any):void
    {
        this._discoverStarIds = [];
        this._discoverStarOrder = [];
        if(data)
        {
            this._discoverStarIds = data.discoverStarIds != undefined ? data.discoverStarIds : [];
            this._discoverStarOrder = data.discoverStarOrder != undefined ? data.discoverStarOrder : [];
        }
        this.initDiscoverStarOrder();
        this.getTargetStar();
    }

    private initDiscoverStarOrder():void
    {
        if(this._discoverStarOrder && this._discoverStarOrder.length>0)
        {
            return;
        }
        let flySucCount = UserData.instance.flySucCount;
        if(flySucCount < this._allStars.length)
        {
            this.calcFirstOrder();
        }else{
            this.calcOtherOrder();
        }
    }

    private updateDiscoverStarOrder():void
    {
        let flySucCount = UserData.instance.flySucCount;
        if( flySucCount%this._allStars.length == 0 )
        {
            this.calcOtherOrder();
        }
        this.getTargetStar();
    }

    private calcFirstOrder():void
    {
        this._discoverStarOrder = [];
        let randomStarIds:Array<number> = [];
        //第一遍分出固定顺序和随机顺序star
        for(var i=0; i<this._allStars.length; i++)
        {
            let star = this._allStars[i];
            if(star.order != -1)
            {
                let orderIdx = star.order-1;
                this._discoverStarOrder[orderIdx] = star.id;
            }else{
                randomStarIds.push(star.id);
            }
        }
        //打乱随机星球
        ArrayUtil.shuffleSort(randomStarIds);
        //随机星球放入探索顺序表
        for(var j=0; j<this._allStars.length; j++)
        {
            if(!this._discoverStarOrder[j])
            {
                this._discoverStarOrder[j] = randomStarIds.pop();
            }
        }
        //保存
        this.saveStarData();
        ServerData.instance.uploadData();
    }

    private calcOtherOrder():void
    {
        this._discoverStarOrder = [];
        for(var i=0; i<this._allStars.length; i++)
        {
            let star = this._allStars[i];
            this._discoverStarOrder.push(star.id);
        }
        ArrayUtil.shuffleSort(this._discoverStarOrder);
        //保存
        this.saveStarData();
        ServerData.instance.uploadData();
    }

    private getTargetStar():void
    {
        let flySucCount = UserData.instance.flySucCount;
        let starIndex = flySucCount % this._discoverStarOrder.length;
        let starId = this._discoverStarOrder[starIndex];
        this._targetStarInfo = GameJsonConfig.instance.getStarInfoById(starId);
    }

    public onLand():void
    {
        if(this._targetStarInfo)
        {
            if(this._discoverStarIds.length < this._allStars.length)
            {
                if(this._discoverStarIds.indexOf(this._targetStarInfo.id) == -1)
                {
                    this._discoverStarIds.push(this._targetStarInfo.id);
                    this.saveStarData();
                }
                
                if(this._targetStarInfo.dialogType == DialogType.Dialog)
                {
                    NpcDialogManager.instance.showNpcDialog(this._targetStarInfo.dialogId, Laya.Handler.create(this, this.onEndStarDialog));
                }else{
                    StarPopupMgr.instance.show(this._targetStarInfo.id, Laya.Handler.create(this, this.onEndStarDialog));
                }
            }else{
                StarPopupMgr.instance.show(this._targetStarInfo.id, Laya.Handler.create(this, this.onEndStarDialog));
            }
            GameEventMgr.instance.Dispatch(GameEvent.OnStartStarDialog);
        }
        //更新
        this.updateDiscoverStarOrder();
    }

    private onEndStarDialog():void
    {
        GameEventMgr.instance.Dispatch(GameEvent.OnEndStarDialog);
    }

    public prevLoadStarImg():void
    {
        if(this._targetStarInfo)
        {
            ResourceManager.instance.load(this._targetStarInfo.iconImg);
        }
    }

    //--------存储------------------------------------
    public saveStarData():void
    {
        GameSave.setValue(StarManager.StarUserKey, JSON.stringify( this.allStarData() ));
    }

    public allStarData():any
    {
        let data:any = {};
        data.discoverStarIds = this._discoverStarIds;
        data.discoverStarOrder = this._discoverStarOrder;
        return data;
    }
}