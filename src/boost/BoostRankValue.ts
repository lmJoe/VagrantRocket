import CameraShakeValues from "../camera/CameraShakeValues";
import { BoostRank } from "../model/GameModel";

/*
* name;
*/
export default class BoostRankValue
{
    constructor(rk:BoostRank, ve:number, ce:CameraShakeValues, cr:Laya.Vector4)
    {
        this.rank = rk;
        this.value = ve;
        this.cameraShake = ce;
        this.color = cr;
    }

    public rank:BoostRank;
    public value:number;
    public cameraShake:CameraShakeValues;
    public color:Laya.Vector4;

    private static Values:Array<BoostRankValue> = 
    [
        new BoostRankValue(BoostRank.Insane, 0.97, new CameraShakeValues(0.3,0.3), null),
        new BoostRankValue(BoostRank.Perfect, 0.9, new CameraShakeValues(0.25,0.3), null),
        new BoostRankValue(BoostRank.Great, 0.8, new CameraShakeValues(0.2,0.3), null),
        new BoostRankValue(BoostRank.Good, 0.65, new CameraShakeValues(0.2,0.3), null),
        new BoostRankValue(BoostRank.OK, 0, new CameraShakeValues(0.2,0.3), null)
    ];

    public static getBoostValues(rate:number):BoostRankValue
    {
		if (rate > BoostRankValue.Values[0].value)
		{
			return BoostRankValue.Values[0];
		}
		if (rate > BoostRankValue.Values[1].value)
		{
			return BoostRankValue.Values[1];
		}
		if (rate > BoostRankValue.Values[2].value)
		{
			return BoostRankValue.Values[2];
		}
		if (rate > BoostRankValue.Values[3].value)
		{
			return BoostRankValue.Values[3];
		}
		return BoostRankValue.Values[4];
    }

    public static getOverPrefectRate():number
    {
        return 1-BoostRankValue.Values[0].value + 1-BoostRankValue.Values[1].value;
    }
}