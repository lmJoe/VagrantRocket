import Constants from "./Constants";

/*
* 产出倍数数据;
* 各个效果分别计算;
*/
export default class ProduceEffectData
{
    private _startTime:number;
    private _multiple:number;
    private _duration:number

    constructor(multiple:number, duration:number, startTime:number=0)
    {
        this._multiple = multiple;
        this._duration = duration;
        if(!startTime || startTime<=0)
        {
            this._startTime = Date.now();
        }else{
            this._startTime = startTime;
        }
    }

    public get multiple():number
    {
        return this._multiple;
    }

    public get duration():number
    {
        return this._duration;
    }

    public get startTime():number
    {
        return this._startTime;
    }

    public updateDuration(time:number):void
    {
        this._duration -= time;
    }

    private toStr():string
    {
        return this._multiple+":"+this._duration+":"+this._startTime;
    }

    public static parseToStr(list:Array<ProduceEffectData>):string
    {
        let str:string = "";
        list.forEach(data => {

            str += data.toStr()+",";

        });
        str = str.substr(0, str.length-1);
        return str;
    }

    public static parseDataStr(str:string):Array<ProduceEffectData>
    {
        let result:Array<ProduceEffectData> = [];
        let arr:Array<string> = str.split(",");
        arr.forEach(dataStr => {
            
            if(dataStr.length>1)
            {
                let datas = dataStr.split(":");
                let temp = new ProduceEffectData(parseInt(datas[0]), parseInt(datas[1]), parseInt(datas[2]));
                result.push(temp);
            }
        });
        return result;
    }
}