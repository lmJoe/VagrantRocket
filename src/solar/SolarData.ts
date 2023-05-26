import PlanetData from "./PlanetData";
import Constants from "../model/Constants";
// import EconomyManager from "../ctrl/EconomyManager";
import GameJsonConfig from "../config/GameJsonConfig";
import Mathf from "../utils/Mathf";

export default class SolarData
{
    private constructor(){
    }

    private _data:any;

    // private _coinRate:number;

    private _index:number;//星系idx 从0开始
    private _discoverIndex:number;//发现顺序
    private _discoverTime:number;//发现时间
    private _discoverSequence:number;//访客顺序
    private _planetDataList:Array<PlanetData>;
    // private _rocketPodNum:number;
    private _peopleInShip:number;
    private _commentHeads:Array<number>;
    private _commentZan:number;

    public get index():number
    {
        return this._index;
    }

    public get discoverIndex():number
    {
        return this._discoverIndex;
    }
    
    public get discoverTimeDesc():string
    {
        let date = new Date(this._discoverTime);
        return date.getFullYear() +"."+ (date.getMonth()+1) +"."+date.getDate();
    }

    public get discoverTime():number
    {
        return this._discoverTime;
    }
    
    public get discoverSequence():number
    {
        return this._discoverSequence;
    }

    public get iconUrl():string
    {
        if(this._index == 0)
        {
            return "solaricon/first/solar_"+this._index+".png";
        }else{
            return "solaricon/other/solar_"+this._index+".png";
        }
        // return "solaricon/solar_"+this._index+".png";
    }

    // public get coinRate():number
    // {
    //     this.calcCoinRate();
    //     return this._coinRate;
    // }

    // public get rocketPodNum():number
    // {
    //     return this._rocketPodNum;
    // }

    public get peopleInShip():number
    {
        return this._peopleInShip;
    }

    public get commentHeads():Array<number>
    {
        return this._commentHeads;
    }

    public hasZan(idx:number):boolean
    {
        let str:string = this._commentZan.toString();
        let arr:Array<string> = str.split("");
        arr.reverse();
        return arr[idx] == "1";
    }

    public get solarPopulation():number
    {
        let num:number = 0;
        this._planetDataList.forEach(planet => {
            num += planet.population;
        });
        return num;
    }

    public static CreatSolarData():SolarData
    {
        return new SolarData();
    }

    public setIndex(discoverIdx:number, idx:number):void
    {
        this._discoverIndex = discoverIdx;
        this._index = idx;
        this._discoverSequence = this.getDiscoverSequence(this._discoverIndex);
    }

    public parseData(jsonStr:string):void
    {
        if(!jsonStr || jsonStr.length==0)
        {
            this._data = {};
            //初值
            this._data.index = Constants.DefaultFirstSolarIndex;
            this._data.discoverIndex = Constants.DefaultFirstDiscoverIndex;
            this._data.discoverTime = Date.now();
            this._data.discoverSequence = 0;
            this._data.populationList = null;
            // this._data.rocektPodNum = Constants.DefaultPodCount;
            this._data.peopleInShip = Constants.DefaultShipPeople;
            this._data.commentHeads = this.createCommentHeads();
            this._data.commentZan = 0;
        }else
        {
            this._data = JSON.parse(jsonStr);
        }
        this._index = this._data.index;
        this._discoverIndex = this._data.discoverIndex;
        this._discoverTime = this._data.discoverTime;
        this._discoverSequence = this._data.discoverSequence;
        // this._rocketPodNum = this._data.rocektPodNum;
        this._peopleInShip = this._data.peopleInShip;
        this._commentHeads = this._data.commentHeads;
        this._commentZan = this._data.commentZan;
        this.parsePlanetData();
    }

    private createCommentHeads():Array<number>
    {
        let arr = [];
        for(var i=0; i<Constants.MaxSolarCommentNum; i++)
        {
            let ran = Math.ceil( Mathf.range(100001, 104000) );
            arr.push(ran);
        }
        return arr;
    }

    private getDiscoverSequence(idx:number):number
    {
        let explorerCfg = GameJsonConfig.instance.getExplorerConfig(idx);
        return explorerCfg.sequence;
    }

    private parsePlanetData():void
    {
        this._planetDataList = [];
        for(var i=0; i<Constants.LandablePlanetCount; i++)
        {
            let planetStr:string = "";
            if(this._data.populationList && this._data.populationList[i])
            {
                planetStr = this._data.populationList[i];
            }else{
                planetStr = Constants.DefaultPlanetPopulation + "";
            }
            let planetData = new PlanetData();
            planetData.parseData(planetStr);
            this._planetDataList[i] = planetData;
        }
    }

    // private calcCoinRate():void
    // {
    //     this._coinRate = 0;
    //     for(var i=0; i<this._planetDataList.length; i++)
    //     {
    //         let planetData = this._planetDataList[i];
    //         if(planetData.population > 0)
    //         {
    //             let levelData = GameJsonConfig.instance.getLevelConfig(this._discoverIndex);
    //             let planetRate = levelData.getPlanetWorkProfit(i);
    //             this._coinRate += planetRate*planetData.population;
    //         }
    //     }
    // }

    public getPlanetData(index:number):PlanetData
    {
        return this._planetDataList[index];
    }

    public addPlanetPeople(index:number, num:number):void
    {
        let pd = this._planetDataList[index];
        pd.addPeople(num);
    }

    // public updatePods(num:number):void
    // {
    //     this._rocketPodNum = num;
    // }

    public updatePeopleInShip(num:number):void
    {
        this._peopleInShip = num;
    }

    public updateZan(idx:number):void
    {
        this._commentZan += Math.pow(10, idx);
    }

    public toStr():string
    {
        this._data.index = this._index;
        this._data.discoverIndex = this._discoverIndex;
        this._data.discoverTime = this._discoverTime;
        this._data.discoverSequence = this._discoverSequence;
        // this._data.rocektPodNum = this._rocketPodNum;
        this._data.peopleInShip = this._peopleInShip;
        this._data.commentHeads = this._commentHeads;
        this._data.commentZan = this._commentZan;
        let planetStrList:Array<string> = [];
        for(var i=0; i<this._planetDataList.length; i++)
        {
            let planetData = this._planetDataList[i];
            planetStrList[i] = planetData.toStr();
        }
        this._data.populationList = planetStrList;

        return JSON.stringify(this._data);
    }
}