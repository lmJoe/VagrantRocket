export default class PrivilegeData
{
    public readonly id:number;
    public readonly name:string;
    public readonly level:number;
    public readonly type:number;
    public readonly value:number;
    public readonly price:number;
    public readonly desc:string;

    // "1": {
    //     "id": "1",
    //     "name": "ProfitBuff",
    //     "level": 1,
    //     "desc": "所有火箭收益增加",
    //     "type": 1,
    //     "value": 5,
    //     "price": 100
    //   },

    constructor(data:any)
    {
        this.id = data.id;
        this.type = data.type;
        this.name = data.name;
        this.desc = data.desc;
        this.level = data.level;
        this.value = data.value;
        this.price = data.price;
    }
}