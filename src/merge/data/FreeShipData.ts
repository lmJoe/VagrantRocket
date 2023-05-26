export default class FreeShipData
{
    public readonly id:number;
    public readonly random_levelList:Array<number>;
    public readonly random_weightList:Array<number>;

    // "1": {
    //     "id": "1",
    //     "random_level_01": 1,
    //     "random_weight_01": 100,
    //     "random_level_02": -1,
    //     "random_weight_02": -1,
    //     "random_level_03": -1,
    //     "random_weight_03": -1,
    //     "random_level_04": -1,
    //     "random_weight_04": -1,
    //     "random_level_05": -1,
    //     "random_weight_05": -1
    //   },

    constructor(data:any)
    {
        this.id = data.id;
        this.random_levelList = [];
        this.random_levelList[0] = data.random_level_01;
        this.random_levelList[1] = data.random_level_02;
        this.random_levelList[2] = data.random_level_03;
        this.random_levelList[3] = data.random_level_04;
        this.random_levelList[4] = data.random_level_05;

        this.random_weightList = [];
        this.random_weightList[0] = data.random_weight_01;
        this.random_weightList[1] = data.random_weight_02;
        this.random_weightList[2] = data.random_weight_03;
        this.random_weightList[3] = data.random_weight_04;
        this.random_weightList[4] = data.random_weight_05;
    }
}