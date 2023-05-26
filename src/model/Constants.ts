import MergeDefine from "../merge/data/MergeDefine";

/*
* 常量;
*/
export default class Constants{
    constructor(){
    }

    /* 调试 */
    public static readonly DebugState:boolean = false;//false

    public static AccessingSolarSystem:boolean = false;

    public static BoostMeterTimeMinMax:Laya.Vector2 = new Laya.Vector2(2, 2.5);//1, 2.5

    public static FlyForce:number = 10;//100 10
    public static BoostForce:number = 100;//550 30
    public static LandForce:number = 10;//200 20
    public static BoostTime:number = 3;//1.8
    public static FlyResistance:number = 0.0075;//0.008
    public static LandResistance:number = 0.01;//0.012
    public static FloatResistance:number = 0.15;//0.15

    public static readonly RotateSpeedIgnite:number = 1;
    public static readonly RotateSpeedFly:number = 10;
    public static readonly RotateSpeedLanding:number = 49;
    
    public static GalaxyShipGravityFlyTime:number = 16.5;//16.5

    public static DefaultCoin:number = 20000;//20000
    public static DefaultShipId:number = 1;//1
    public static DefaultItemShipIds:Array<number> = [1];
    public static DefaultPrivilegeData:Array<number> = [0,0];
    public static get DefaultBuyShipsNum():Array<number>
    {
        let arr = [];
        for(var i:number=0; i<MergeDefine.MaxShipLevel; i++)
        {
            arr[i] = 0;
        }
        return arr;
    }

    public static readonly FirstPlanetHeight:number = 350;//145  200
    public static readonly PlanetDistance:number = 400;//80  250
    public static readonly PlanetCheckHeight:number = 100//50 
    public static LandablePlanetCount:number = 10;
    //星系数
    public static SolarNum:number = 35;
    //关卡数
    public static get TotalLevelNum():number
    {
        return Constants.SolarNum;
    }
    
    public static DefaultFirstDiscoverIndex:number = 0;
    public static DefaultFirstSolarIndex:number = 0;//0
    public static DefaultPlanetPopulation:number = 0;
    //
    public static DefaultLandPlanetIndex:number = -1;

    public static DefaultShipPeople:number = 0;
    // public static DefaultPodCount:number = 5;//10
    public static MaxPodCount:number = 10;

    public static FloatingCheckTime:number = 7;

    public static MaxPopulationOnSolarSystem:number = 20;
    public static MaxAstronautInPlanet:number = 10;
    public static MaxAstronautFloatNum:number = 5;
    public static AstronautFloatSpeed:number = 15;

    public static MaxSolarCommentNum:number = 10;
    
    //产出间隔 ms
    public static ProduceInterval:number = 1000;
    
    //显示温馨提示的限制
    public static DistanceRate:number = 0.1;
    public static DistanceLimit:number = 999999;

    //默认不点击 持续飞行的控制
    public static DefaultBoostRate:number = 0.1;
    
    //通知显示时间
    public static CommentNoticeShowTime:number = 8000;
    //评论固定点赞间隔 
    public static CommentLikeStaticCheckTime:number = 1800000;//1800000  30min
    //固定点赞概率
    public static CommentLikeStaticCheckRate:number = 50;//50 50/100
    //固定点赞检测结束时间
    public static CommentLikeStaticCheckEndTime:number = 172800000;//172800000 48h
    //固定点赞检测总次数
    public static CommentLikeStaticCheckTotalCount:number = 96;//96  48h*2

    //总签到天数
    public static SignTotalDay:number = 7;

    //好友在玩弹出时机（飞行次数）
    public static RecommendShowCount:number = 2;//3

}