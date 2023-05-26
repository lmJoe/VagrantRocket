import { BoostRank } from "./GameModel";

/*
* 游戏关卡加分配置;
*/
export default class LevelScoreData
{
    private _level:number;
    private _rankScore:Array<number>;
    private _planetScore:Array<number>;

/*     "1": {
        "id": 1,
        "level": "1",
        "okPrice": 0,
        "goodPrice": 0,
        "greatPrice": 10,
        "perfectPrice": 20,
        "insanePrice": 80,
        "oneStarPrice": 80,
        "twoStarPrice": 100,
        "threeStarPrice": 120,
        "fourStarPrice": 150,
        "fiveStarPrice": 180
      }, */

    constructor(data:any)
    {
        this._level = data.level;

        //操作等级加分
        this._rankScore = [];
        this._rankScore[BoostRank.Insane] = data.insanePrice;
        this._rankScore[BoostRank.Perfect] = data.perfectPrice;
        this._rankScore[BoostRank.Great] = data.greatPrice;
        this._rankScore[BoostRank.Good] = data.goodPrice;
        this._rankScore[BoostRank.OK] = data.okPrice;

        //星球等级加分
        this._planetScore = [];
        this._planetScore[0] = data.oneStarPrice;
        this._planetScore[1] = data.twoStarPrice;
        this._planetScore[2] = data.threeStarPrice;
        this._planetScore[3] = data.fourStarPrice;
        this._planetScore[4] = data.fiveStarPrice;
        this._planetScore[5] = data.fiveStarPrice;
        this._planetScore[6] = data.fiveStarPrice;
        this._planetScore[7] = data.fiveStarPrice;
        this._planetScore[8] = data.fiveStarPrice;
        this._planetScore[9] = data.fiveStarPrice;
    }

    public get level():number
    {
        return this._level;
    }

    public getScoreByRank(rank:BoostRank):number
    {
        return this._rankScore[rank];
    }

    public getScoreByPlanet(index:number):number
    {
        return this._planetScore[index];
    }
}