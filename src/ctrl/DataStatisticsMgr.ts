import WxHandler from "../wx/WxHandler";

/*
* 数据统计;
*/
export default class DataStatisticsMgr
{
    constructor(){
    }

    private static _instance:DataStatisticsMgr;
    public static get instance():DataStatisticsMgr
    {
        if(!this._instance)
        {
            this._instance = new DataStatisticsMgr();
        }
        return this._instance;
    }

    public stat(eventName: string, data?: any):void
    {
        // if (WxHandler.isWx)
        // {
        //     wx.ykSendEvent(eventName, data);
        //     wx.aldSendEvent(eventName, data);
        // }
        console.log(eventName, data ? data : "");
    }
}