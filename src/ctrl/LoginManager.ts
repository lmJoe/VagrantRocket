import { Application, sharedApplication } from "../zm";
import QgHandler from "../qg/QgHandler";

export default class LoginManager
{
    private static successCallback: Laya.Handler;
    private static failCallback: Laya.Handler;

    private static haslogind:boolean = false;
    private static openId: string = null;
    private static sessionId: string = null;
    private static validityTime: number = null;
    private static sessionTime: number = null;
    private static createTime: number;
    public static isNewPlayer: boolean = false;

    public static login(success: Laya.Handler, fail: Laya.Handler)
    {
        this.successCallback = success;
        this.failCallback = fail;

        zm.eventCenter.once(zm.events.EventLogin, this, this.onLogin);
        // zm.api.login();
        QgHandler.qgLogin(Laya.Handler.create(this,this.onQgLoginSuc), Laya.Handler.create(this,this.onQgLoginFail));
    }

    private static onQgLoginSuc(data):void    
    {
        zm.api.loginZmServer({ID: data.uid}, Laya.Handler.create(this, this.onLogin), Laya.Handler.create(this, this.onLogin));
    }

    private static onQgLoginFail(data)    
    {
        this.onLogin(null);
        // zm.api.loginZmServer({ID: "test01"}, Laya.Handler.create(this, this.onLogin), Laya.Handler.create(this, this.onLogin));
    }

    private static onLogin(data: zm.LoginRep)    
    {
        console.log("onLogin:", JSON.stringify(data));
        if (data != null)
        {
            this.haslogind = true;
            this.openId = data.OpenID;
            this.sessionId = data.Session.ID;
            this.validityTime = data.Session.Expire * 1000;
            this.sessionTime = this.validityTime + Date.now();
            this.isNewPlayer = data.First;
            let createTimeStr: string = data.Created.substring(5, 10);
            if (createTimeStr != null)
            {
                this.createTime = parseInt(createTimeStr.replace("-", ""));
                console.log("this.createTime:",this.createTime);
            }

            if (this.successCallback != null)
            {
                this.successCallback.runWith(data);
            }
        }
        else
        {
            if (this.failCallback != null)
            {
                this.failCallback.runWith("login fail");
            }
        }
    }

    // public static retryLogin(success: Laya.Handler, fail: Laya.Handler)
    // {
    //     console.log("retryLogin:")
    //     this.successCallback = success;
    //     this.failCallback = fail;

    //     zm.eventCenter.once(zm.events.EventLogin, this, this.onLogin)
    //     zm.login.relogin();
    // }

    public static getHasLogined():boolean
    {
        return this.haslogind;
    }

    public static isLogined(): boolean
    {
        if (this.sessionTime == null)
        {
            return false;
        }
        return Date.now() < this.sessionTime;
    }

    public static getOpenId(): string
    {
        return this.openId;
    }

    public static updateSessionTime(): void
    {
        this.sessionTime = this.validityTime + Date.now();
    }

    public static getSessionTime(): number
    {
        return this.sessionTime;
    }

    public static getSession(): string
    {
        let now = Date.now();
        if (now > this.sessionTime)
        {
            this.sessionId = null;
        }
        return this.sessionId
    }

    public static getCreateTime():number
    {
        if(this.createTime == null)
        {
            return 0;
        }
        return this.createTime;
    }
}