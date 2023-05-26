export default class GameSave{
    constructor(){
    }

    private static GameKey:string = "CrowdEarth_SaveKey_";
    private static UseDataKey:string = "UserData";

    public static setUserData(data:any):void
    {
        let str:string = JSON.stringify(data);
        GameSave.setValue(GameSave.UseDataKey, str);
    } 

    public static getUserData():any
    {
        let valurStr:string = GameSave.getValue(GameSave.UseDataKey);
        if(valurStr && valurStr.length>0)
        {
            return JSON.parse(valurStr);
        }
        return null;
    } 

    public static getValue(key:string):any
    {
        let str:string = Laya.LocalStorage.getItem(GameSave.GameKey+key);
        if(str == "null" || str == "NaN" || str == "undefined")
        {
            str = "";
        }
        return str;
    }

    public static setValue(key:string, value:string):void
    {
        if(value && value.length>0){
            Laya.LocalStorage.setItem(GameSave.GameKey+key, value);
        }
    }

    public static clearValue(key:string):void
    {
        Laya.LocalStorage.setItem(GameSave.GameKey+key, '');
    }

    public static clearUserData():void
    {
        GameSave.clearValue(GameSave.UseDataKey);
    }
}