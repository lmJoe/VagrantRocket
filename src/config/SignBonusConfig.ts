import { SignBonusType } from "../model/GameModel";

export default class SignBonusConfig
{

    private static readonly Configs:Array<SignBonusConfig> = 
    [
        new SignBonusConfig(1, "5倍时间加速卡", SignBonusType.SpeedUp, 1, "加速卡可免费进行1次加速"),
        new SignBonusConfig(2, "金币小礼包", SignBonusType.Coin, 3, "金币价值："),
        new SignBonusConfig(3, "招财猫", SignBonusType.Skin, 118, "礼包包含专属皮肤-招财猫"),
        new SignBonusConfig(4, "升级小礼包", SignBonusType.Ship, 10, "礼包有10架高级火箭"),
        new SignBonusConfig(5, "金币大礼包", SignBonusType.Coin, 4, "金币价值："),
        new SignBonusConfig(6, "升级大礼包", SignBonusType.Ship, 20, "礼包有20架高级火箭"),
        new SignBonusConfig(7, "甜甜圈", SignBonusType.Skin, 119, "礼包包含专属皮肤-甜甜圈")
    ];

    public static getSignBonusConfig(day:number):SignBonusConfig
    {
        for (var index = 0; index < SignBonusConfig.Configs.length; index++) 
        {
            let cfg = SignBonusConfig.Configs[index];
            if(cfg.day == day)
            {
                return cfg;
            }
        }
        return null;
    }

    public readonly day:number;
    public readonly bonusName:string;
    public readonly bonusType:SignBonusType;
    public readonly bonusValue:number;
    public readonly bonusDesc:string;

    constructor(day:number, bonusName:string, type:SignBonusType, value:number, desc:string)
    {
        this.day = day;
        this.bonusName = bonusName;
        this.bonusType = type;
        this.bonusValue = value;
        this.bonusDesc = desc;
    }
}   