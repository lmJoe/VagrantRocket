/*
* 免费升级飞船配置;
*/
export default class FreeShipLevelUpData
{
    public readonly minus_level:number;
    public readonly freelevelup_chance:number;
    public readonly plus_level:number;

    // "0": {
    //     "minus_level": "0",
    //     "freelevelup_chance": 1500,
    //     "plus_level": 1
    //   },

    constructor(data:any)
    {
        this.minus_level = data.minus_level;
        this.freelevelup_chance = data.freelevelup_chance;
        this.plus_level = data.plus_level;
    }
}