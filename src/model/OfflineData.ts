/*
* 离线奖励配置;
*/
export default class OfflineData
{
    public readonly id:number;
    public readonly min_time:number;
    public readonly max_time:number;
    public readonly revenue_multiple:number;

    // "1": {
    //     "id": "1",
    //     "min_time": 0,
    //     "max_time": 60,
    //     "revenue_multiple": 0.5
    //   },


    constructor(data:any)
    {
        this.id = data.id;
        this.min_time = data.min_time;
        this.max_time = data.max_time;
        this.revenue_multiple = data.revenue_multiple;
    }
}