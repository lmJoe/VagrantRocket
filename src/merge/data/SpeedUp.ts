export default class SpeedUp
{
    constructor(mult:number, durationTime:number)
    {
        this._mult = mult;
        this._durationTime = durationTime;
    }

    private _mult:number = 1;
    private _durationTime:number=0;

    public get mult():number
    {
        return this._mult;
    }

    public get durationTime():number
    {
        return this._durationTime;
    }

    public set durationTime(value:number)
    {
        this._durationTime = value;
    }

    public add(mult:number, durationTime:number):void
    {
        this._mult = mult;
        this._durationTime += durationTime;
    }

    public reset():void
    {
        this._mult = 1;
        this._durationTime = 0;
    }

}