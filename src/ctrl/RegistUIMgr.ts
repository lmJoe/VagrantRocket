import { ui } from "../ui/layaMaxUI";

/*
* 注册UI;
*/
export default class RegistUIMgr
{
    constructor(){
    }

    private static _instance:RegistUIMgr;
    public static get instance():RegistUIMgr
    {
        if(!this._instance)
        {
            this._instance = new RegistUIMgr();
        }
        return this._instance;
    }

    public regist():void
    {
        laya.utils.ClassUtils.regClass("ui.component.CoinItemUI", ui.component.CoinItemUI);
    }

}