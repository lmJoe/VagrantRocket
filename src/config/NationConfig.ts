import PowerUpMgr from "../merge/ctrl/PowerUpMgr";
import MergeDefine from "../merge/data/MergeDefine";

export default class NationConfig
{
    private static readonly NationKey:number = 2;//0 国家 1阵营 2石头剪刀布

    private static readonly Nations:Array<NationConfig> = 
    [
        new NationConfig(1, "中国", "为伟大祖国的航天事业而战", 1, "0:1:3", "替换其他国家旗帜可以获得3倍奖励", ["0:70", "2:15", "3:15"]),
        new NationConfig(2, "美国", "老牌劲旅，捍卫NASA的荣耀", 1, "1:0.6:2", "成功插旗有60%概率获得2倍奖励", ["0:45", "1:40", "3:15"]),
        new NationConfig(3, "日本", "快速崛起的新兴航天大国", 1, "1:0.2:4", "成功插旗有20%概率获得4倍奖励", ["0:45", "1:40", "2:15"])
    ];

    private static readonly Camps:Array<NationConfig> = 
    [
        new NationConfig(1, "和平之国", "和平的种子理应洒满宇宙万物", 1, "0:1:3", "替换其他国家旗帜可以获得3倍奖励", ["0:70", "2:15", "3:15"]),
        new NationConfig(2, "海盗团", "行走在伟大的航路上", 1, "1:0.6:2", "成功插旗有60%概率获得2倍奖励", ["0:45", "1:40", "3:15"]),
        new NationConfig(3, "外星部落", "让我们重新缔造文明", 1, "1:0.2:4", "成功插旗有20%概率获得4倍奖励", ["0:45", "1:40", "2:15"])
    ];

    private static readonly Union:Array<NationConfig> = 
    [
        new NationConfig(1, "拳头", "拳头代表着勇气...", 1, "2:1:3:2", "替换 剪刀 旗帜可以获得3倍奖励", ["0:40", "2:40", "3:20"]),
        new NationConfig(2, "剪刀", "剪刀代表着革新...", 1, "2:1:2:3", "替换 布 旗帜可以获得3倍奖励", ["0:40", "3:40", "1:20"]),
        new NationConfig(3, "布", "布代表着包容与和平...", 1, "2:1:3:1", "替换 拳头 旗帜可以获得3倍奖励", ["0:40", "1:40", "2:20"])
    ];

    private static Configs:Array<NationConfig> = [];

    public static init():void
    {
        switch(NationConfig.NationKey)
        {
            case 0: 
                NationConfig.Configs = NationConfig.Nations;
                break;
            case 1: 
                NationConfig.Configs = NationConfig.Camps;
                break;
            case 2: 
                NationConfig.Configs = NationConfig.Union;
                break;
        }
    }

    private static getFolderName():string
    {
        return "camp";
    }

    public static getNationConfig(nationId:number):NationConfig
    {
        for (var index = 0; index < NationConfig.Configs.length; index++) 
        {
            let cfg = NationConfig.Configs[index];
            if(cfg.nationId == nationId)
            {
                return cfg;
            }
        }
        return null;
    }

    public static getDefaultNationConfig():NationConfig
    {
        return NationConfig.Configs[0];
    }

    public static getNationSkinByNationId(nationId:number):string
    {
        let folderName:string = NationConfig.getFolderName();
        return "imgRes2/flag/"+folderName+"/skin_"+nationId+".png";
    }

    public static getNationIconByNationId(nationId:number):string
    {
        let folderName:string = NationConfig.getFolderName();
        return "imgRes2/flag/"+folderName+"/icon_"+nationId+".png";
    }

    public static getNationTagByNationId(nationId:number):string
    {
        let folderName:string = NationConfig.getFolderName();
        return "imgRes2/flag/"+folderName+"/tag_"+nationId+".png";
    }


    //0表示没有
    public readonly nationId:number;
    public readonly nationName:string;
    public readonly nationDesc:string;
    //基础奖励倍数（目前都是1）
    private readonly baseBonusRate:number;
    //额外奖励类型（0：占领其他势力额外奖励  1：占领星球即奖励  2：阵营克制）
    private readonly extraBonusType:number;
    //额外奖励触发几率
    private readonly extraBonusRate:number;
    //额外奖励倍数
    private readonly extraBonusMulti:number;
    //额外奖励克制阵营
    private readonly extraBonusSuppressNationId:number;
    //额外奖励描述
    public readonly extraBonusDesc:string;
    //其他国家出现概率
    private readonly otherNations:Array<any>; 

    constructor(nationId:number, nationName:string, nationDesc:string, baseBonusRate:number, extraBonus:string, extraBonusDesc:string, otherNation:Array<string>)
    {
        this.nationId = nationId;
        this.nationName = nationName;
        this.nationDesc = nationDesc;
        this.baseBonusRate = baseBonusRate;
        this.extraBonusDesc = extraBonusDesc;
        //额外奖励
        let extraArr:Array<string> = extraBonus.split(":");
        this.extraBonusType = parseInt( extraArr[0] );
        this.extraBonusRate = parseInt( extraArr[1] );
        this.extraBonusMulti = parseInt( extraArr[2] );
        if(this.extraBonusType == 2)
        {
            this.extraBonusSuppressNationId = parseInt( extraArr[3] );
        }else{
            this.extraBonusSuppressNationId = 0;
        }
        //其他国家
        this.otherNations = [];
        for(var i=0; i<otherNation.length; i++)
        {
            let str = otherNation[i];
            let arr = str.split(":");
            let id = parseInt( arr[0] );
            let rate = parseInt( arr[1] );
            this.otherNations.push( {"nationId":id, "rate":rate} );
        }
    }

    public get icon():string
    {
        return NationConfig.getNationIconByNationId(this.nationId);
    }

    public get skin():string
    {
        return NationConfig.getNationSkinByNationId(this.nationId);
    }

    public get tag():string
    {
        return NationConfig.getNationTagByNationId(this.nationId);
    }

    //0 表示没有国家
    public getOtherNationId():number
    {
        let ran:number = 100 * Math.random();
        let rate:number = 0;
        for(var i=0; i<this.otherNations.length; i++)
        {
            let data = this.otherNations[i];
            if(data)
            {
                rate += data.rate;
                if(ran < rate)
                {
                    return data.nationId;
                }
            }
        }
        return 0;
    }

    // //基础奖励 广告奖励配置随机飞船id+1的飞船商店售卖打折后价格
    // public getBaseBonus():number
    // {
    //     let bonusShipId:number = PowerUpMgr.getFreeDropShipId(true);
    //     bonusShipId = Math.min(MergeDefine.MaxShipLevel, bonusShipId+1);
    //     let bonus:number = PowerUpMgr.getShopPirceWithDiscountBuff(bonusShipId);
    //     return bonus;
    // }

    //基础奖励 广告奖励配置随机飞船id+1的飞船
    public getBaseBonusShipId():number
    {
        let bonusShipId:number = PowerUpMgr.getFreeDropShipId(true);
        return Math.min(MergeDefine.MaxShipLevel, bonusShipId+1);
    }

    public getBaseBonusByBonusShipId(bonusShipId:number):number
    {
        return PowerUpMgr.getShopPirceWithDiscountBuff(bonusShipId);
    }

    //占领星球额外奖励
    public getExtraMulti(otherNationId:number=0):number
    {
        let ran:number = Math.random();
        if(this.extraBonusType == 0)
        {
            if(otherNationId == 0)
            {
                return 1;
            }else{
                return ran <= this.extraBonusRate ? this.extraBonusMulti : 1;
            }
        }
        else if(this.extraBonusType == 1)
        {
            return ran <= this.extraBonusRate ? this.extraBonusMulti : 1;
        }
        else if(this.extraBonusType == 2)
        {
            if(otherNationId != 0 && otherNationId == this.extraBonusSuppressNationId)
            {
                return this.extraBonusMulti;
            }else{
                return 1;
            }
        }
        return 1;
    }

}   