// import UserData from "../data/UserData";
// import GameEventMgr from "../event/GameEventMgr";
// import GameEvent from "../event/GameEvent";
// import LevelScoreData from "../model/LevelScoreData";
// import GameJsonConfig from "../config/GameJsonConfig";
// import LevelData from "../model/LevelData";
// import AstronautManager from "../astronaut/AstronautManager";

// /*
// * 当前星系经济系统;
// * 宇航员星球产出在 ProduceManager;
// */
// export default class EconomyManager{
//     constructor(){
//         this.init();
//     }

//     private static _instance:EconomyManager;
//     public static get instance():EconomyManager
//     {
//         if(!this._instance)
//         {
//             this._instance = new EconomyManager();
//         }
//         return this._instance;
//     }

//     private _levelScoreData:LevelScoreData;
//     private _levelData:LevelData;
//     private _curGameCoin:number;

//     public get levelScoreData():LevelScoreData
//     {
//         return this._levelScoreData;
//     }

//     public get levelData():LevelData
//     {
//         return this._levelData;
//     }

//     public get curGameCoin():number
//     {
//         return this._curGameCoin;
//     }

//     public get curPeopleCost():number
//     {
//         return this._levelData.getPeopleCost(AstronautManager.instance.astronautInShip);
//     }

//     private init():void
//     {
//         GameEventMgr.instance.addListener(GameEvent.GameGainCoin, this, this.onGainCoin);
//     }

//     private onGainCoin(gainCoin:number):void
//     {
//         this._curGameCoin += gainCoin;
//     }

//     public startGame():void
//     {
//         let level:number = UserData.instance.curDiscoverIndex;
//         this._levelScoreData = GameJsonConfig.instance.getLevelScoreConfig(level);
//         this._levelData = GameJsonConfig.instance.getLevelConfig(level);

//         this._curGameCoin = 0;
//     }

//     // public addProduceCoin(num:number):void
//     // {
//     //     this.addCoin(num);
//     // }

//     // public addCoin(num:number):void
//     // {
//     //     if(num >= 0)
//     //     {
//     //         UserData.instance.updateCoin(num);
//     //         GameEventMgr.instance.Dispatch(GameEvent.UpdateCoin, [num]);
//     //     }
//     // }

//     // public checkCoinEnough(num:number):boolean
//     // {
//     //     num = Math.abs(num);
//     //     return UserData.instance.coinNum >= num;
//     // }

//     // public useCoin(num:number):void
//     // {
//     //     num = -1 * Math.abs(num);
//     //     UserData.instance.updateCoin(num);
//     //     GameEventMgr.instance.Dispatch(GameEvent.UpdateCoin, [num]);
//     // }


// }