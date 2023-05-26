/*
* 时间;
*/
export default class DTime{
    constructor(){
    }

    public static get deltaTime():number
    {
        return DTime.deltaTimeMs / 1000;
    }

    public static get deltaTimeMs():number
    {
        // return Laya.timer.delta;
        return 20;
    }
}