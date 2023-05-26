// import WxHandler from "./WxHandler";
// import CmdConst from "./CmdConst";

// /*
// * 主域对开放域操作
// */
// export default class WxOpenHander{
//     constructor(){
//     }

//     private static _instance:WxOpenHander;
//     public static get instance():WxOpenHander
//     {
//         if(!this._instance)
//         {
//             this._instance = new WxOpenHander();
//         }
//         return this._instance;
//     }

//     private postMessage(cmd: string, data?: any): void 
//     {
//         if (WxHandler.isWx) 
//         {
//             let open = WxHandler.wx.getOpenDataContext();
//             if (!open) {
//                 return;
//             }
//             if(data && data.newWidth && data.newHeight)
//             {
//                 this.changeSharecanvasSize(data.newWidth, data.newHeight);
//             }
//             let postData = {"cmd":cmd, "data":data};
//             open.postMessage( postData );
//         }
//     }

//     private changeSharecanvasSize(newWidth:number, newHeight:number):void
//     {
//         Laya.Browser.window.sharedCanvas.width = newWidth;
//         Laya.Browser.window.sharedCanvas.height = newHeight;
//     }

//     /*获取自己的信息*/
//     public getSelfInfo():void
//     {
//         this.postMessage(CmdConst.SelfInfo);
//     }

//     public showFriendRank():void
//     {
//         let data = {"newWidth":525, "newHeight":648};
//         this.postMessage(CmdConst.FriendRank, data);
//         // this.showOpen();
//     }
    
//     public showWorldRank(list:Array<string>, myInfo:string):void
//     {
//         let data = {"newWidth":525, "newHeight":648, "list":list, "myInfo":myInfo};
//         this.postMessage(CmdConst.WorldRank, data);
//         // this.showOpen();
//     }

// //==========================================================================
//     public get openSprite():Laya.Sprite
//     {
//         return  this._openSprite;
//     }

//     private _openSprite:Laya.Sprite;
//     private drawTexture: Laya.Texture;
//     public showOpen():void
//     {
//         if(!this._openSprite){
//             this._openSprite = new Laya.Sprite();
//         }
//         this.hideOpen();
//         this._openSprite.visible = true;

//         let sharedCanvas = window["sharedCanvas"];
//         if (this.drawTexture) {
//             this.drawTexture.destroy();
//             this.drawTexture = null;
//         }
//         this.drawTexture = new Laya.Texture(sharedCanvas);
//         //小程序使用，非常费，这个参数可以根据自己的需求适当调整，如果内容不变可以不用设置成true
//         this.drawTexture.bitmap.alwaysChange = false;
//         this._openSprite.graphics.drawTexture(this.drawTexture, 0, 0, this.drawTexture.width, this.drawTexture.height);
//         Laya.timer.loop(100, this, this.updateUserInfoTexture);
//     }

//      private updateUserInfoTexture() 
//      {
//         //此方法只有在webGl模式下存在
//         if (this.drawTexture){
//             this.drawTexture.bitmap.reloadCanvasData();
//         }
//     }

//     public hideOpen():void
//     {
//         Laya.timer.clear(this, this.updateUserInfoTexture);
//         this._openSprite.visible = false;
//         this._openSprite.removeSelf();
//         this._openSprite.removeChildren();
//     }
// }