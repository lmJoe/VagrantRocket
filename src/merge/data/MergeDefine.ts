

export default class MergeDefine
{

    //总火箭等级
    public static readonly MaxShipLevel:number = 50;
    //离线奖励掉落箱子数量
    public static readonly OfflineFreeDropShipNum:number = 6;
    //免费升级时间间隔
    public static readonly FreeUpGradeShipTime:number = 240000;//300000 300秒   240000 240秒
    //免费升级等级限制
    public static readonly FreeUpGradeShipLevelLimit:number = 7;//7
    
    //空投配置
    public static readonly FreeBonusTime:number = 300000;//300000 300秒
    public static readonly ShowFreeBounsTime:number = 1800000;//30000 30秒  1800000 30min
    public static readonly AirDropMoneyRate:number = 10;
    public static readonly AirDropFreeShipNum:number = 4;

    //普通掉落箱子
    public static readonly DropFreeBoxTime:number = 20000;//20秒
    //掉落视频箱子计数(掉落n个普通箱子之后，掉落视频箱子)
    public static readonly DropVideoBoxCount:number = 5;//3
    //掉落视频箱子出现延迟时间
    public static readonly DropVideoBoxDelayTime:number = 10000;//10000 10秒
    //掉落视频箱子-视频奖励个数
    public static readonly DropVideoBoxBonusNum:number = 4;
    //掉落视频箱子-出现等级
    public static readonly DropVideoBoxLevelLimit:number = 1;//6级出现

    //视频免费获得火箭每日次数 —— 钱不够的时候
    public static readonly AdFreeShipDailyCount:number = 5;

    //商店视频免费获得火箭时间间隔
    public static readonly ShopVideoGetShipTime:number = 300000;//300000 300秒

    //视频加速每日次数
    public static readonly AdSpeedUpDailyCount:number = 8;
    //时间加速配置
    public static readonly SpeedUpMult:number = 5;//2 10 
    //每次加速持续时间
    public static readonly SpeedUpTime:number = 60000;//150000 150秒

    
    //部分conf设定 —— 等级解锁
    public static readonly open_airDrop_level:number = 5;

    //弱引导开启时间
    public static readonly WeakGuideTime:number = 10000;//10秒


    //升级奖励数值
    public static readonly UpgradeBonusShowLevel:number = 8;
    public static readonly UpgradeBonusNum:number = 4;
}