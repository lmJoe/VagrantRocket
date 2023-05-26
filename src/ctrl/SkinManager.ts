import { ui } from "../ui/layaMaxUI";
import SkinData from "../model/SkinData";
import GameJsonConfig from "../config/GameJsonConfig";
import GameSave from "../data/GameSave";
import { SkinUnlockType, SkinType } from "../model/GameModel";
import MergeUserData from "../merge/data/MergeUserData";
import SolarManager from "../solar/SolarManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ServerData from "../data/ServerData";
import DataStatisticsMgr from "./DataStatisticsMgr";

/*
* 皮肤管理;
*/
export default class SkinManager
{
    constructor(){
        this.init();
    }

    private static _instance:SkinManager;
    public static get instance():SkinManager
    {
        if(!this._instance)
        {
            this._instance = new SkinManager();
        }
        return this._instance;
    }

    private static readonly SkinUserKey:string = "SkinUserKey";
    private static readonly FirstShowSkinKey:string = "FirstShowSkinKey";
    private static readonly FirstUseSkinKey:string = "FirstUseSkinKey";

    //使用headId，而不是skinId，因为headId唯一，扩展皮肤配置不影响之前的存储
    private _mySkinHeadIds:Array<number>;
    
    private _curUseSkinHeadId:number;
    private _curUseSkinColor:number;
    private _curUseSkinData:SkinData;
    
    //缓存当前新解锁皮肤
    private _newUnlockList:Array<SkinData>;
    //缓存当前新解锁皮肤，且没有被选中查看过的（用于红点）
    private _skinNoSelectedList:Array<SkinData>;
    //只计算等级解锁的皮肤
    private _nextUnlockSkin:SkinData;
    //
    private _lastSpecialSkinData:SkinData;
    private _lastSpecialColor:number;
    //
    private _firstShowSkin:boolean;
    private _firstUseSkin:boolean;

    private init():void
    {
        this._curUseSkinHeadId = -1;
        this._curUseSkinColor = -1;
        this._curUseSkinData = null;
        this._mySkinHeadIds = [];
        this._skinNoSelectedList = [];

        this._lastSpecialSkinData = null;
        this._lastSpecialColor = -1;

        GameEventMgr.instance.addListener(GameEvent.ChangeLevel, this, this.onGameLevelUp);
        GameEventMgr.instance.addListener(GameEvent.UnlockNewShipLevel, this, this.onUnlockNewShipLevel);
    }

    private onGameLevelUp():void
    {
        this.checkUnlockNewSkin();
    }

    private onUnlockNewShipLevel():void
    {
        this.checkUnlockNewSkin();
        this.checkNeedUpdateSkin();
    }

    public getSkinDataByHeadId(headId:number):SkinData
    {
        let allList:Array<SkinData> = GameJsonConfig.instance.getAllSkinConfig();
        for(var i=0; i<allList.length; i++)
        {
            let skinData = allList[i];
            if(skinData.headId == headId)
            {
                return skinData;
            }
        }
        return null;
    }

    public clearSkins():void
    {
        GameSave.clearValue(SkinManager.SkinUserKey);
        GameSave.clearValue(SkinManager.FirstShowSkinKey);
        GameSave.clearValue(SkinManager.FirstUseSkinKey);
    }

    private getSkinData():void
    {
        this._curUseSkinData = this.getSkinDataByHeadId(this._curUseSkinHeadId);
        //保存一遍
        this.saveSkinData();
    }
    
    //火箭等级解锁的未解锁皮肤中，要求火箭等级最低的
    private calcNextUnlockSkin():void
    {
        this._nextUnlockSkin = null;
        let maxGainSkin:SkinData = null;
        let allList:Array<SkinData> = GameJsonConfig.instance.getAllSkinConfig();
        for(var i=0; i<allList.length; i++)
        {
            let skinData = allList[i];
            if(skinData.unlockType == SkinUnlockType.ShipLevel && skinData.skinType ==SkinType.Special)
            {
                if( this._mySkinHeadIds.indexOf(skinData.headId) != -1 )
                {
                    if(maxGainSkin == null || skinData.unlockValue > maxGainSkin.unlockValue)
                    {
                        maxGainSkin = skinData;
                    }
                    continue;
                }
                if(this._nextUnlockSkin == null || skinData.unlockValue < this._nextUnlockSkin.unlockValue)
                {
                    this._nextUnlockSkin = skinData;
                }
            }
        }
        //如果皮肤都已经解锁，则赋值最高等级的皮肤
        if(this._nextUnlockSkin == null)
        {
            this._nextUnlockSkin = maxGainSkin;
        }
    }

    //皮肤相关存储数据，不是用户数据部分
    private checkSkinLocal():void
    {
        let dataStr:string = GameSave.getValue(SkinManager.FirstShowSkinKey);
        this._firstShowSkin = dataStr == "yes";
        
        let str:string = GameSave.getValue(SkinManager.FirstUseSkinKey);
        this._firstUseSkin = str == "yes";
    }

    public setFirstShowSkin():void
    {
        this._firstShowSkin = true;
        GameSave.setValue(SkinManager.FirstShowSkinKey, "yes");
        GameEventMgr.instance.Dispatch(GameEvent.RefreshSkinBtnReddot);
    }

    private setFirstUseSkin():void
    {
        this._firstUseSkin = true;
        GameSave.setValue(SkinManager.FirstUseSkinKey, "yes");
    }
    
    public getLocal():void
    {
        this._curUseSkinHeadId = -1;
        this._curUseSkinColor = -1;
        this._mySkinHeadIds = [];

        let dataStr:string = GameSave.getValue(SkinManager.SkinUserKey);
        if( dataStr && dataStr.length>0 )
        {
            let saveData:any = JSON.parse(dataStr);
            this._mySkinHeadIds = saveData.mySkinHeadIds;
            this._curUseSkinHeadId = saveData.curUseSkinHeadId;
            this._curUseSkinColor = saveData.curUseSkinColor;
        }
        this.checkUnlockNewSkin();
        this.getSkinData();
        //
        this.checkSkinLocal();
    }

    public getServer(serverData:any):void
    {
        if( serverData )
        {
            this._curUseSkinHeadId = -1;
            this._curUseSkinColor = -1;
            this._mySkinHeadIds = [];

            this._mySkinHeadIds = serverData.mySkinHeadIds;
            this._curUseSkinHeadId = serverData.curUseSkinHeadId;
            this._curUseSkinColor = serverData.curUseSkinColor;

            this.checkUnlockNewSkin();
            this.getSkinData();
        }
    }

    /* 解锁皮肤 */
    public unlockNewSkin(skinData:SkinData):void
    {
        this._skinNoSelectedList.push(skinData);
        this._mySkinHeadIds.push(skinData.headId);

        GameEventMgr.instance.Dispatch(GameEvent.UnlockNewSkin);
        this.saveSkinData();
        //解锁皮肤时，上传服务器数据
        ServerData.instance.uploadData();
    }

    /* 检查解锁皮肤 */
    private checkUnlockNewSkin():void
    {
        this._newUnlockList = [];

        let allList:Array<SkinData> = GameJsonConfig.instance.getAllSkinConfig();
        for(var i=0; i<allList.length; i++)
        {
            let skinData = allList[i];
            if( this._mySkinHeadIds.indexOf(skinData.headId) != -1 )
            {
                continue;
            }
            if( this.ckeckSkinCondition(skinData) )
            {
                this._newUnlockList.push(skinData);
                this._skinNoSelectedList.push(skinData);
                this._mySkinHeadIds.push(skinData.headId);
            }
        }
        this.calcNextUnlockSkin();
        if(this._newUnlockList.length > 0)
        {
            //对新解锁的火箭皮肤数据排序
            this._newUnlockList.sort(function(dataA:SkinData, dataB:SkinData):number
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
            //按皮肤类型再排一次
            this._newUnlockList.sort(function(dataA:SkinData, dataB:SkinData):number
            {
                return dataA.skinType - dataB.skinType;
            });
            GameEventMgr.instance.Dispatch(GameEvent.UnlockNewSkin);
            this.saveSkinData();
            //解锁皮肤时，上传服务器数据
            ServerData.instance.uploadData();
        }
    }

    private ckeckSkinCondition(skinData:SkinData):boolean
    {
        switch(skinData.unlockType)
        {
            case SkinUnlockType.ShipLevel:
                return this.checkShipLevel(skinData);

            case SkinUnlockType.SolarIndex:
                return this.checkSolarIndex(skinData);

            case SkinUnlockType.SolarNum:
                return this.checkSolarNum(skinData);

            case SkinUnlockType.Sign:
                return false;
        }
        return false;
    }

    private checkShipLevel(skinData:SkinData):boolean
    {
        return skinData.unlockValue <= MergeUserData.instance.iMaxLockedShipId;
    }

    private checkSolarIndex(skinData:SkinData):boolean
    {
        let solarData = SolarManager.instance.getSolarDataBySolarIndex(skinData.unlockValue);
        return solarData != null;
    }

    private checkSolarNum(skinData:SkinData):boolean
    {
        return skinData.unlockValue <= SolarManager.instance.getDiscoveredSolarNum();
    }

    public changeSkin(headId:number, colorId:number):void
    {
        if(!SpaceshipMaster.instance.spaceship)
        {
            return;
        }
        this._curUseSkinColor = colorId;
        this._curUseSkinHeadId = headId;
        this.getSkinData();
        if(this._curUseSkinData.skinType == SkinType.Special)
        {
            DataStatisticsMgr.instance.stat("应用皮肤",{"类型":"专属", "headId":headId.toString()});
        }else
        {
            DataStatisticsMgr.instance.stat("应用皮肤",{"类型":"传统", "headId":headId.toString()});
        }
        SpaceshipMaster.instance.spaceship.changeHead(this._curUseSkinHeadId);
        //
        if(this._firstUseSkin==false)
        {
            this.setFirstUseSkin();
        }
    }

    public checkHasSkin(headId:number):boolean
    {
        return this._mySkinHeadIds.indexOf(headId) != -1;
    }

    public clearUsedSkin():void
    {
        this._curUseSkinHeadId = -1;
        this._curUseSkinColor = -1;
        this._curUseSkinData = null;
    }

    public clearLastSpeicalSkin():void
    {
        this._lastSpecialSkinData = null;
        this._lastSpecialColor = -1;
    }

    public clearNewUnlockList():void
    {
        this._newUnlockList.splice(0);
        this._newUnlockList = [];
    }

    //升级新火箭，移除之前选择的皮肤，如果是特殊皮肤，提示是否更换
    public checkNeedUpdateSkin():void
    {
        if(this._curUseSkinData && this._curUseSkinData.skinType == SkinType.Special)
        {
            this._lastSpecialSkinData = this._curUseSkinData;
            this._lastSpecialColor = this._curUseSkinColor;
        }
        this.clearUsedSkin();
    }

    public selectSkinItem(skinHeadId:number):void
    {
        for(var i=this._skinNoSelectedList.length-1; i>=0; i--)
        {
            let skinData = this._skinNoSelectedList[i];
            if(skinData && skinData.headId == skinHeadId)
            {
                this._skinNoSelectedList.splice(i, 1);
                GameEventMgr.instance.Dispatch(GameEvent.RefreshSkinBtnReddot);
            }
        }
    }

    //-------火箭等级默认皮肤与传统皮肤数据的关系--------
    public getShipDefaultSkinDataByShipId(shipId:number):SkinData
    {
        let rocketInfo = GameJsonConfig.instance.getRokectConfigByLevel(shipId);
        return this.getSkinDataByHeadId(rocketInfo.headId);
    }
    //--------使用------------------------------------
    public get firstShowSkin():boolean
    {
        return this._firstShowSkin;
    }

    public get firstUseSkin():boolean
    {
        return this._firstUseSkin;
    }

    public get hasUseSkin():boolean
    {
        return this._curUseSkinHeadId != -1;
    }

    public getSkinNoSelectedList():Array<SkinData>
    {
        return this._skinNoSelectedList;
    }

    public getUnlockNewSkin():SkinData
    {
        if(this._newUnlockList.length > 0)
        {
            let skinData = this._newUnlockList[this._newUnlockList.length-1];
            this.clearNewUnlockList();
            return skinData;
        }
        return null;
    }

    public getNextUnlockSkin():SkinData
    {
        return this._nextUnlockSkin;
    }

    public getShipSkinData():SkinData
    {
        return this._curUseSkinData;
    }

    public getShipHeadId():number
    {
        return this._curUseSkinHeadId;
    }

    public getShipHeadColorId():number
    {
        return this._curUseSkinColor;
    }

    public getLastSpecialSkinData():SkinData
    {
        return this._lastSpecialSkinData;
    }

    public getLastSpecialColorId():number
    {
        return this._lastSpecialColor;
    }

    //--------存储------------------------------------
    public saveSkinData():void
    {
        GameSave.setValue(SkinManager.SkinUserKey, JSON.stringify( this.allSkinData() ));
    }

    public allSkinData():any
    {
        let data:any = {};
        data.mySkinHeadIds = this._mySkinHeadIds;
        data.curUseSkinHeadId = this._curUseSkinHeadId;
        data.curUseSkinColor = this._curUseSkinColor;
        return data;
    }
}