import GameSave from "../data/GameSave";

/*
* 震动控制;
*/
export default class VibrateManager{
    constructor(){
        this.init();
    }

    private static _instance:VibrateManager;
    public static get instance():VibrateManager
    {
        if(!this._instance)
        {
            this._instance = new VibrateManager();
        }
        return this._instance;
    }

    private static VibrateKey:string = 'VibrateKey';

    private _vibrateEnable:boolean;

    public get vibrateEnable():boolean
    {
        return this._vibrateEnable;
    }

    private init():void
    {
        let value = GameSave.getValue(VibrateManager.VibrateKey);
        if(value == "no")
        {
            this._vibrateEnable = false;
        }else{
            this._vibrateEnable = true;
        }
    }

    public setState(enable:boolean):void
    {
        let value = enable ? "yes" : "no";
        GameSave.setValue(VibrateManager.VibrateKey, value);

        this._vibrateEnable = enable;
    }

    public vibrate():void
    {
       //TODO  进行震动
       if( this._vibrateEnable )
       {
           zm.device.vibrateShort();
       }
    }
}