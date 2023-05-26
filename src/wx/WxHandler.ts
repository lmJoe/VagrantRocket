import WxDataKey from "./WxDataKey";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";

/*
* 微信api处理
*/
export default class WxHandler
{
    constructor(){
    }
    private static _instance:WxHandler;
    public static get instance():WxHandler
    {
        if(!this._instance)
        {
            this._instance = new WxHandler();
        }
        return this._instance;
    }

    //公众号跳回scene值
    private static RewardScenes: number[] = [1043, 1058, 1074, 1082, 1091];

    //是否微信环境
    public static get isWx():boolean
    {
        return WxHandler.wx;
    }

    //微信全局对象
    public static get wx():any
    {
        return Laya.Browser.window.wx;
    }

    //提交数据
    public submitGameData(score:number, solarNum:number, success?:Laya.Handler, fail?:Laya.Handler):void
    {
        if(!WxHandler.isWx)
        {
            if(success){
                success.run();
            }
            return;
        }
        let kvDataList = new Array(); 
        let timeStamp:number = Math.floor(Date.now()/1000);//微信 Unix时间戳 秒为单位
        let data = {"wxgame":{"score":score, "update_time":timeStamp}, "SolarNum":solarNum};
        kvDataList.push( {key:WxDataKey.StoreKey, value:JSON.stringify(data)} );
        WxHandler.wx.setUserCloudStorage(
        {
            KVDataList: kvDataList,  
            success: function (res) 
            {
                console.log('setUserCloudStorage','success',res);
                if(success){
                    success.run();
                }
            },  
            fail: function (res) 
            {  
                console.log('setUserCloudStorage','fail',res);
                if(fail){
                    fail.run();
                }
            },  
        });
    }

    //进入客服会话
    public openCustomerServiceConversation(success?:Laya.Handler, fail?:Laya.Handler):void
    {
        if(!WxHandler.isWx)
        {
            if(fail){
                fail.run();
            }
            return;
        }
        if (WxHandler.wx.openCustomerServiceConversation != null) 
        {
            WxHandler.wx.openCustomerServiceConversation({
                showMessageCard: true,
                sendMessageTitle: "我要领空投",
                sendMessageImg: "wxlocal/imgGetReward.png",
                sendMessagePath: "customer_service/index",
                success: () => {
                    DataStatisticsMgr.instance.stat("空投福利-进入客服会话");
                    if(success){
                        success.run();
                    }
                },
                false: () => {
                    console.log("空投领取失败");
                    if(fail){
                        fail.run();
                    }
                }
            });
        }
    }

    //判断公众号跳回场景值
    public isRewardScence(scene: number): boolean 
    {
        for (let i = 0; i < WxHandler.RewardScenes.length; i++) 
        {
            if (WxHandler.RewardScenes[i] == scene) {
                return true;
            }
        }
        return false;
    }
}