// import GameEventMgr from "../event/GameEventMgr";
// import GameEvent from "../event/GameEvent";
// import SolarManager from "../solar/SolarManager";
// import GameSave from "../data/GameSave";
// import ProduceEffectData from "../model/ProduceEffectData";
// import Constants from "../model/Constants";
// import UserData from "../data/UserData";
// import EconomyManager from "./EconomyManager";

// /*
// * 星球产出;
// * 自己单独时间轴 update
// */
// export default class ProduceManager
// {
//     constructor(){
//     }

//     private static _instance:ProduceManager;
//     public static get instance():ProduceManager
//     {
//         if(!this._instance)
//         {
//             this._instance = new ProduceManager();
//         }
//         return this._instance;
//     }

//     private static readonly ProdeceTimeMarkKey:string = "ProdeceTimeMarkKey";
//     private static readonly ProdeceEffectDataKey:string = "ProdeceEffectDataKey";

//     private _gameCoinRate:number;
//     private _produceList:Array<ProduceEffectData>;
//     private _timeDelta:number;
//     private _timemark:number;


//     public get gameCoinRate():number
//     {
//         return this._gameCoinRate;
//     }

//     //启动游戏时
//     public start():void
//     {
//         this.calcProduceStartTime();
//         this.calcGameCoinRate();
//         this.calcProduceEffectData();

//         GameEventMgr.instance.addListener(GameEvent.SolarPeopleChange, this, this.onSolarPeopleChanged);
//         Laya.timer.frameLoop(1, this, this.update);
//     }
    
//     private onSolarPeopleChanged():void
//     {
//         this.calcGameCoinRate();
//     }

//     private calcGameCoinRate():void
//     {
//         this._gameCoinRate = SolarManager.instance.calcAllSolarCoinRate();
//     }

//     private calcProduceEffectData():void
//     {
//         this._produceList = [];
//         let str:string = GameSave.getValue(ProduceManager.ProdeceEffectDataKey);
//         if(str && str.length>0)
//         {
//             this._produceList = ProduceEffectData.parseDataStr(str);
//         }
//     }

//     private calcProduceStartTime():void
//     {
//         let str:string = GameSave.getValue(ProduceManager.ProdeceTimeMarkKey);
//         if(!str || str.length==0)
//         {
//             this._timemark = 0;
//             this._timeDelta = 0;
//         }else{
//             this._timemark = parseInt(str);
//             this._timeDelta = Date.now() - this._timemark;
//         }
//     }

//     private update():void
//     {
//         this.calcProduce();
//     }

//     private saveTimemark():void
//     {
//         GameSave.setValue(ProduceManager.ProdeceTimeMarkKey, this._timemark.toString());
//     }

//     private calcProduce():void
//     {
//         let nowTime:number = Date.now();
//         this._timeDelta += nowTime - this._timemark;
//         this._timemark = nowTime;
//         if(this._timeDelta >= Constants.ProduceInterval)
//         {
//             this.calcCoinProduce();
//             //存
//             this.saveTimemark();
//         }
//     }

//     private calcCoinProduce():void
//     {
//         let leftTime = this._timeDelta % Constants.ProduceInterval;
//         let coinTime = this._timeDelta - leftTime;
//         this._timeDelta = leftTime;

//         let produceCoin:number = 0;
//         if(this._produceList.length > 0)
//         {
//             for(var i=this._produceList.length-1; i>=0; i--)
//             {
//                 let data = this._produceList[i];
//                 if(data.duration <= coinTime)
//                 {
//                     produceCoin += this.calcCoin(data.duration, data.multiple);
//                     coinTime -= data.duration;
//                     //移除这个effect
//                     this._produceList.splice(i,1);
//                 }else{
//                     produceCoin += this.calcCoin(coinTime, data.multiple);
//                     data.updateDuration(coinTime);
//                 }
//             }
//         }else{
//             produceCoin += this.calcCoin(coinTime, 1);
//         }
//         if(produceCoin > 0)
//         {
//             EconomyManager.instance.addProduceCoin(produceCoin);
//         }
//     }

//     private calcCoin(time:number, multiple:number=1):number
//     {
//         let factor = time/Constants.ProduceInterval;
//         if(factor >= 0.5)
//         {
//             return Math.ceil(factor) * this._gameCoinRate * multiple;
//         }
//     }

//     public addProduceEffect():void
//     {
//         let data = new ProduceEffectData(10, 60000);
//         this._produceList.push(data);
//     }
// }