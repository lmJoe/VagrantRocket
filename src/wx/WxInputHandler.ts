import WxHandler from "./WxHandler";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* wx输入处理
*/
export default class WxInputHandler{
    constructor()
    {
        this.init();
    }

    private static _instance:WxInputHandler;
    public static get instance():WxInputHandler
    {
        if(!this._instance)
        {
            this._instance = new WxInputHandler();
        }
        return this._instance;
    }

    private static readonly DefaultMsg:string = "让流浪进行到底…";

    private _lastMsg:string;

    public get lastMsg():string
    {
        return this._lastMsg;
    }

    private init():void
    {
        if(!WxHandler.isWx)
        {
            return;
        }
        WxHandler.wx.onKeyboardInput(function(res:any):void
        {
            WxInputHandler.instance._lastMsg = res.value;
        }.bind(this));

        WxHandler.wx.onKeyboardConfirm(function(res:any):void
        {
            console.log("onKeyboardConfirm : ", res);
            GameEventMgr.instance.Dispatch(GameEvent.InputConfirm, [res.value]);

            WxInputHandler.instance._lastMsg = WxInputHandler.DefaultMsg;
        }.bind(this));
        
        WxHandler.wx.onKeyboardComplete(function(value:any):void
        {
            console.log("onKeyboardComplete : ", value);
            
            WxInputHandler.instance._lastMsg = WxInputHandler.DefaultMsg;
        }.bind(this));
    }

    public showKeyboard(successFun?:Laya.Handler, failFun?:Laya.Handler):void
    {   
        if(!WxHandler.isWx)
        {
            if(failFun)
            {
                console.log("showKeyboard : no wx");
                failFun.run();
            }
            return;
        }

        if(!this._lastMsg || this._lastMsg.length==0)
        {
            this._lastMsg = WxInputHandler.DefaultMsg;
        }

        Laya.timer.clear(this, this.onframe);
        Laya.stage.off(Laya.Event.CLICK, this, this.onClickStageWhenKeyBoardShow);

        WxHandler.wx.showKeyboard( 
            {
                defaultValue : this._lastMsg,
                maxLength : 60,
                multiple : true,
                confirmHold : false,
                confirmType : "done",
                success : function(res):void
                {
                    if(successFun)
                    {
                        console.log("showKeyboard success : ", res);
                        successFun.run();
                    }
                },
                fail : function(res):void
                {
                    if(failFun)
                    {
                        console.log("showKeyboard fail : ", res);
                        failFun.run();
                    }
                }
            }
        );
        //
        Laya.timer.frameOnce(2, this, this.onframe);
    }
    
    private onframe():void
    {
        Laya.stage.on(Laya.Event.CLICK, this, this.onClickStageWhenKeyBoardShow);
    }

    private onClickStageWhenKeyBoardShow():void
    {
        this.hideKeyBoard();
    }

    public hideKeyBoard(successFun?:Laya.Handler, failFun?:Laya.Handler):void
    { 
        WxHandler.wx.hideKeyboard( 
            {
                success : function(res):void
                {
                    if(successFun)
                    {
                        console.log("hideKeyBoard success : ", res);
                        successFun.run();
                    }
                },
                fail : function(res):void
                {
                    if(failFun)
                    {
                        console.log("hideKeyBoard fail : ", res);
                        failFun.run();
                    }
                }
            }
        );
    }

}