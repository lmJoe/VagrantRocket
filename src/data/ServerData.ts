import UserData from "./UserData";
import MergeUserData from "../merge/data/MergeUserData";
import SolarManager from "../solar/SolarManager";
import MergeGuideManager from "../merge/ctrl/MergeGuideManager";
import GuideManager from "../gameuictrl/GuideManager";
import SkinManager from "../ctrl/SkinManager";
import StarManager from "../ctrl/StarManager";
import LoginManager from "../ctrl/LoginManager";

/*
* 服务器存储数据 
 */
export default class ServerData{
    constructor(){
    }

    private static _instance:ServerData;
    public static get instance():ServerData
    {
        if(!this._instance)
        {
            this._instance = new ServerData();
        }
        return this._instance;
    }

    public loadServerData(serverDataStr:string):void
    {
        if(!serverDataStr || serverDataStr.length == 0)
        {
            this.uploadData();
            return;
        }
        
        let serverData = JSON.parse(serverDataStr);
        if(UserData.instance.hasLocalData)
        {
            this.uploadData();
        }else{
            this.parseServerData(serverData);
        }
    }

/*
上传服务器信息时机：
1、登录时如果有本地信息，上传
2、升级火箭时
3、飞行结束时
4、解锁星系时 
5、解锁特权时
6、解锁皮肤时（切换皮肤就不传了，本地存储即可）
7、更新星球解锁顺序时（首次或者每40次飞行后）
 */
    public uploadData():void
    {
        if(LoginManager.getHasLogined() == false){
            return;
        }
        let data:any = {

            "usedata":UserData.instance.allUserData(),
            "mergeuserdata":MergeUserData.instance.allMergeUserData(),
            "solardata":SolarManager.instance.allSolarData(),
            "mergeguide":MergeGuideManager.instance.allMergeGuideData(),
            "flyguide":GuideManager.instance.getAllFlyGuideData(),
            "skindata":SkinManager.instance.allSkinData(),
            "stardata":StarManager.instance.allStarData()

        };
        zm.api.setData(data);
    }

    private parseServerData(data:any):void
    {
        debugger
        UserData.instance.getServer( data.usedata );
        MergeUserData.instance.getServer( data.mergeuserdata );
        SolarManager.instance.getServer( data.solardata );
        MergeGuideManager.instance.getServer( data.mergeguide );
        GuideManager.instance.getServer( data.flyguide );
        SkinManager.instance.getServer( data.skindata );
        StarManager.instance.getServer( data.stardata );
    }
}