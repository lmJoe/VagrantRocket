/*
* 事件管理
*/
export default class GameEventMgr
{
    private static _instance:GameEventMgr;
    public static get instance():GameEventMgr
    {
        if(!this._instance)
        {
            this._instance = new GameEventMgr();
        }
        return this._instance;
    }

    constructor(){
        this.initMgr();
    }

    private eventDispatcher: Laya.EventDispatcher;
    private initMgr():void
    {
        this.eventDispatcher = new Laya.EventDispatcher;
    }

    public addListener(eventName: string, caller: any, handler: Function):void
    {
        this.eventDispatcher.on(eventName, caller, handler);
    }

    public removeListener(eventName: string, caller: any, handler: Function):void
    {
        this.eventDispatcher.off(eventName, caller, handler);
    }

    public Dispatch(eventName: string, args?: any)
    {
        this.eventDispatcher.event(eventName, args);
    }
}