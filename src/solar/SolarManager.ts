import SolarData from "./SolarData";
import GameSave from "../data/GameSave";
import UserData from "../data/UserData";
import Constants from "../model/Constants";
import GameEvent from "../event/GameEvent";
import GameEventMgr from "../event/GameEventMgr";
import ServerData from "../data/ServerData";

/*
* 星系管理;
*/
export default class SolarManager
{
    constructor(){
    }

    private static _instance:SolarManager;
    public static get instance():SolarManager
    {
        if(!this._instance)
        {
            this._instance = new SolarManager();
        }
        return this._instance;
    }

    private static readonly SolarKey:string = "SolarKey_";

    private _solarDataList:Array<SolarData>;
    private _curSolarData:SolarData;

    private _totalPeople:number;

    public clearSolarData():void
    {
        for(var i=0; i<Constants.SolarNum; i++)
        {
            GameSave.clearValue(SolarManager.SolarKey+i)
        }
    }

    public getLocal():void
    {
        this._solarDataList = [];
        this._curSolarData = null;
        this._totalPeople = 0;

        let idx:number = 0;
        while(true)
        {
            let dataStr:string = GameSave.getValue(SolarManager.SolarKey+idx);
            if( !dataStr || dataStr.length==0 )
            {
                if(idx == 0)
                {
                    let solarData = SolarData.CreatSolarData();
                    solarData.parseData(null);
                    solarData.setIndex(Constants.DefaultFirstDiscoverIndex, Constants.DefaultFirstSolarIndex);
                    
                    this._solarDataList[ UserData.instance.curDiscoverIndex ] = solarData;
                    this._totalPeople = 0;
                }
                break;
            }
            else
            {
                let solarData = SolarData.CreatSolarData();
                solarData.parseData(dataStr); 
                this._solarDataList[idx] = solarData;

                this._totalPeople += solarData.solarPopulation;
            }
            idx ++;
        }

        this.changeTianGeToLastSolar();
        this.changeRepeatedSolar();
        this.getCurSolarData();
    }

    public getServer(dataList:Array<string>):void
    {
        this._solarDataList = [];
        this._curSolarData = null;
        this._totalPeople = 0;

        for(var i=0; i<dataList.length; i++)
        {
            let dataStr:string = dataList[i];
            if( !dataStr || dataStr.length==0 )
            {
                continue;
            }
            let solarData = SolarData.CreatSolarData();
            solarData.parseData(dataStr); 
            this._solarDataList[solarData.discoverIndex] = solarData;
            this.saveSolarData(solarData);

            this._totalPeople += solarData.solarPopulation;
        }

        this.changeTianGeToLastSolar();
        this.changeRepeatedSolar();
        this.getCurSolarData();
    }

    public saveCurSolarData():void
    {
        if(this._curSolarData)
        {
            this.saveSolarData(this._curSolarData);
        }
    }

    private getCurSolarData():void
    {
        this._curSolarData = this._solarDataList[ UserData.instance.curDiscoverIndex ];
    }

    public selectSolar(discoverIdx:number):void
    {
        if(discoverIdx == UserData.instance.curDiscoverIndex || discoverIdx >= UserData.instance.totalDiscoverIndex)
        {
            return;
        }
        UserData.instance.updateCurDiscoverIndex(discoverIdx);
        this.getCurSolarData();
    }

    public unlockNewSolar():void
    {
        let curSolarIndex = this.getNewSolarIndex();
        //星系探索index+1
        UserData.instance.unlockNewSolar();
        //新的星系
        let solarData = SolarData.CreatSolarData();
        solarData.parseData(null);
        solarData.setIndex(UserData.instance.curDiscoverIndex, curSolarIndex);
        this._solarDataList[ UserData.instance.curDiscoverIndex ] = solarData;
        this._curSolarData = solarData;
        //切关成功
        GameEventMgr.instance.Dispatch(GameEvent.ChangeLevel);

        this.saveCurSolarData();
        //
        ServerData.instance.uploadData();
    }

    private getNewSolarIndex():number
    {
        if(this._solarDataList.length == Constants.SolarNum-1)
        {
            //最后一个星系是天鸽星系
            return Constants.SolarNum-1;
        }
        //随机新的星系index
        let undiscoverIndexs = this.getUndiscoveredSolarIndexs();
        let ranIdx = Math.floor(undiscoverIndexs.length * Math.random());
        return undiscoverIndexs[ranIdx];
    }

    //保证天鸽星系是最后一个
    private changeTianGeToLastSolar():void
    {
        let tiangeSolarData:SolarData = null;
        for(var idx=0; idx<this._solarDataList.length; idx++)
        {
            let solarData = this._solarDataList[idx];
            if(solarData.index == Constants.SolarNum-1)
            {
                tiangeSolarData = solarData;
                break;
            }
        }
        //兼容旧的，强行将之前解锁的天鸽星系改成别的星系
        if(tiangeSolarData != null)
        {
            let undiscoverIndexs = this.getUndiscoveredSolarIndexs();
            if(undiscoverIndexs.length > 0)
            {
                let ranIdx = Math.floor(undiscoverIndexs.length * Math.random());
                tiangeSolarData.setIndex(tiangeSolarData.discoverIndex, undiscoverIndexs[ranIdx]);
                this.saveSolarData(tiangeSolarData);
            }
        }
    }  
    
    //重复解锁星系修改
    private changeRepeatedSolar():void
    {
        let undiscoverIndexs = this.getUndiscoveredSolarIndexs();
        let discoverIndexs:Array<number> = [];
        let repeatedCount:number = 0;
        for(var idx=0; idx<this._solarDataList.length; idx++)
        {
            let solarData = this._solarDataList[idx];
            if(discoverIndexs.indexOf(solarData.index) != -1)
            {
                let newSolarIndex = undiscoverIndexs[repeatedCount];
                solarData.setIndex(solarData.discoverIndex, newSolarIndex);
                this.saveSolarData(solarData);

                repeatedCount ++;
            }
            else
            {
                discoverIndexs.push( solarData.index );
            }
        }
    } 

    private getUndiscoveredSolarIndexs():Array<number>
    {
        let indexs:Array<number> = [];
        for(var solarIndex=0; solarIndex<Constants.SolarNum-1; solarIndex++)
        {
            if(this.getSolarDataBySolarIndex(solarIndex) == null)
            {
                indexs.push(solarIndex);
            }
        }
        return indexs;
    }

    // public calcAllSolarCoinRate():number
    // {
    //     let coinRate:number = 0;
    //     for(var i=0; i<this._solarDataList.length; i++)
    //     {
    //         let solarData = this._solarDataList[i];
    //         coinRate += solarData.coinRate;
    //     }
    //     return coinRate;
    // }

//---------总游戏人数------------------------------------
    public totalPeople():number
    {
        return this._totalPeople;
    }

//---------星系信息------------------------------------
    public solarIndex():number
    {
        return this._curSolarData.index;
    }

//---------节数------------------------------------
    // public solarRocketPodNum():number
    // {
    //     return this._curSolarData.rocketPodNum;
    // }
    
    // public updatePods(num:number):void
    // {
    //     this._curSolarData.updatePods(num);
    //     this.saveCurSolarData();
    // }
//--------飞船人数------------------------------------
    public solarPeopleInShip():number
    {
        return this._curSolarData.peopleInShip;
    }

    public updatePeopleInShip(num:number):void
    {
        this._curSolarData.updatePeopleInShip(num);
        this.saveCurSolarData();
    }
//--------星系人数------------------------------------
    public solarPopulation():number
    {
        return this._curSolarData.solarPopulation;
    }

    public addSolarPopulation(planetIdx:number, num:number):void
    {
        this._totalPeople += num;
        this._curSolarData.addPlanetPeople(planetIdx, num);
        this.saveCurSolarData();
        GameEventMgr.instance.Dispatch(GameEvent.SolarPeopleChange);
    }
//--------星球繁荣度------------------------------------
    public solarPlanetBuildingLevel(planetIdx:number):number
    {
        return this._curSolarData.getPlanetData(planetIdx).buildingLevel;
    }
//--------星系数据------------------------------------
    public getSolarDataByDiscoverIndex(discoverIndex:number):SolarData
    {
        return this._solarDataList[discoverIndex];
    }

    public getSolarDataBySolarIndex(solarIndex:number):SolarData
    {
        for(var i=0; i<this._solarDataList.length; i++)
        {
            let data = this._solarDataList[i];
            if(data && data.index == solarIndex)
            {
                return data;
            }
        }
        return null;
    }

    //解锁星系数，其实就是UseData.gameLevel
    public getDiscoveredSolarNum():number
    {
        return this._solarDataList.length;
    }
//--------存储------------------------------------
    public saveSolarData(solarData:SolarData):void
    {
        GameSave.setValue(SolarManager.SolarKey + solarData.discoverIndex, solarData.toStr());
    }

    public allSolarData():Array<string>
    {
        let arr:Array<string> = [];
        if(this._solarDataList)
        {
            this._solarDataList.forEach(solarData => {
                arr.push( solarData.toStr() );
            });
        }
        return arr;
    }
}