export default class FreeBonusData
{
    public readonly id:number;
    public readonly type:number;
    public readonly num:number;//数量/倍数
    public readonly time:number;
    public readonly weight:number;
    public readonly desc:string;
    public readonly hintImage:string;
    public readonly hintText:string;
    

    // "0": {
    //     "ID": "0",
    //     "type": 1,
    //     "rate": 5,
    //     "time": 60,
    //     "weight": 10,
    //     "desc": "Earnings",
    //     "hintImage": "buffadd",
    //     "hintText": "hint_5speed"
    //   },

    constructor(data:any)
    {
        this.id = data.ID;
        this.type = data.type;
        this.num = data.num;
        this.time = data.time;
        this.weight = data.weight;
        this.desc = data.desc;
        this.hintImage = data.hintImage;
        this.hintText = data.hintText;
    }
}