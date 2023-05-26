// import RankPopupUI from "../gameui/RankPopupUI";
// import GameEventMgr from "../event/GameEventMgr";
// import GameEvent from "../event/GameEvent";
// import UIManager from "../ctrl/UIManager";
// import { RankType } from "../model/GameModel";
// import WxOpenHander from "../wx/WxOpenHander";
// import RankInfo from "../data/RankInfo";
// import TipDialogMgr from "./TipDialogMgr";
// import UserData from "../data/UserData";
// import ScoreUtil from "../data/ScoreUtil";
// import ZMGameConfig from "../ZMGameConfig";
// import SoundManager from "../ctrl/SoundManager";
// import MusicConfig from "../config/MusicConfig";

// /*
// * RankPopupMgr;
// */
// export default class RankPopupMgr
// {
//     constructor(){
//         this.init();
//     }

//     private static _instance:RankPopupMgr;
//     public static get instance():RankPopupMgr
//     {
//         if(!this._instance)
//         {
//             this._instance = new RankPopupMgr();
//         }
//         return this._instance;
//     }

//     private _ui:RankPopupUI;

//     private _allRankInfo:Array<string>;
//     private _myRankInfo:RankInfo;

//     private _successHandler:Laya.Handler;
//     private _failHandler:Laya.Handler;

//     private _clickAllTime:number;

//     public get ui():RankPopupUI
//     {
//         return this._ui;
//     }

//     private init():void
//     {
//         this._ui = new RankPopupUI();

//         GameEventMgr.instance.addListener(GameEvent.OnRank_ClickEvent, this, this.onUIClick);
//     }
    
//     public show():void
//     {
//         UIManager.instance.showPopup(this._ui);
//         this._clickAllTime = 0;
//         //默认显示好友榜
//         this.onClickFriendRank();
//         //获取世界榜信息
//         this.getAllRankInfo();
//         GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
//     }

//     public close():void
//     {
//         GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
//         UIManager.instance.removePopup(this._ui);
//     }

//     private onMaskClick():void
//     {
//         this.close();
//     }

//     private onUIClick(clkTarget):void
//     {
//         switch(clkTarget)
//         {
//             case this._ui.btnInvite:
//                 //分享相关
//                 this.onClickInvite();
//                 break;
//             case this._ui.imgAllRank:
//                 this.onClickAllRank();
//                 break;
//             case this._ui.imgFriendRank:
//                 this.onClickFriendRank();
//                 break;
//         }
//     }
    
//     private onClickInvite():void
//     {
//         zm.share.shareMessage(ZMGameConfig.RankShareTag, null, Laya.Handler.create(this, function():void
//         {
//             console.log("分享成功");
//         }),Laya.Handler.create(this, function():void
//         {
//             console.log("分享失败");
//         }));
//         SoundManager.instance.playSound(MusicConfig.Click, false);
//     }

//     private onClickAllRank():void
//     {
//         if(Date.now() - this._clickAllTime < 1000)
//         {
//             return;
//         }
//         this._clickAllTime = Date.now();
//         if(this._allRankInfo && this._allRankInfo.length>0)
//         {
//             this.showWorldRank();
//         }else{
//             this.getAllRankInfo(Laya.Handler.create(this, this.showWorldRank), Laya.Handler.create(this, this.showFailTips));
//         }
//         SoundManager.instance.playSound(MusicConfig.Click, false);
//     }

//     private showFailTips():void
//     {
//         TipDialogMgr.instance.show("获取世界榜数据失败，请重试！");
//         SoundManager.instance.playSound(MusicConfig.NoCoin, false);
//     }

//     private showWorldRank():void
//     {
//         WxOpenHander.instance.showWorldRank(this._allRankInfo, this._myRankInfo.toJsonStr());
//         this.showRank(RankType.All);
//     }
    
//     private onClickFriendRank():void
//     {
//         WxOpenHander.instance.showFriendRank();
//         this.showRank(RankType.Firend);
//         SoundManager.instance.playSound(MusicConfig.Click, false);
//     }
    
//     private showRank(type:RankType):void
//     {
//         this._ui.setType(type);
//         this._ui.showRank();
//     }

//     private getAllRankInfo(success:Laya.Handler=null, fail:Laya.Handler=null):void
//     {
//         this._successHandler = success;
//         this._failHandler = fail;

//         this._myRankInfo = null;
//         this._allRankInfo = [];
//         // zm.api.getRankList(0, Laya.Handler.create(this, this.onGetAllRankInfo), Laya.Handler.create(this, this.onFailGetAllRankInfo));
//         zm.api.getRankListLimit(0, 100, Laya.Handler.create(this, this.onGetAllRankInfo), Laya.Handler.create(this, this.onFailGetAllRankInfo));
//     }

//     private onFailGetAllRankInfo():void
//     {
//         if(this._failHandler)
//         {
//             this._failHandler.run();
//         }
//     }

//     private onGetAllRankInfo(res:any):void
//     {
//         let dataList = res.Lists;
//         if(!dataList)
//         {
//             console.log("获取世界榜数据成功！");
//             return;
//         }
//         console.log("获取世界榜数据成功！");
//         dataList = dataList.sort(function(aaa, bbb):number
//         {
//             let aaaScore:number = aaa.Score;
//             let bbbScore:number = bbb.Score;
//             return bbbScore - aaaScore;
//         });

//         for(var i:number=0; i<dataList.length; i++)
//         {
//             let info = dataList[i];
//             let isSelf:boolean = zm.login.openID == info.OpenID;
//             let scores = ScoreUtil.parseServerScore(info.Score);
//             let rankInfo:RankInfo = new RankInfo(info.OpenID, info.Avatar, info.Name, scores[0], scores[1], i+1, isSelf);
//             this._allRankInfo.push(rankInfo.toJsonStr());
//             if(isSelf)
//             {
//                 this._myRankInfo = rankInfo;
//             }
//         }
//         if(this._myRankInfo == null)
//         {
//             this._myRankInfo = new RankInfo(zm.login.openID, "", "我", UserData.instance.gameDistance, UserData.instance.totalDiscoverIndex, 0, true);
//         }

//         if(this._successHandler)
//         {
//             this._successHandler.run();
//         }
//     }
// }