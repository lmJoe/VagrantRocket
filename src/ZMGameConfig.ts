/*
* 游戏配置;
*/
export default class ZMGameConfig
{
    public static get YunyingAirDropRewardImg():string
    {
        return "https://zmddzapi.rzcdz2.com/crowdearth/yunying/imgGetReward.png";
    }

    public static get DefaultShareImg():string
    {
        return "https://zmddzapi.rzcdz2.com/crowdearth/shareimg/shareimg_qq.jpg";
    }

    public static get DefaultShareMsg():string
    {
        return "从离开地球的那天起，就再也回不去了";
    }

    public static readonly RankShareTag:string = "crowdearth01";
    public static readonly UnlockShareTag:string = "crowdearth02";
    public static readonly SystemShareTag:string = "crowdearth03";
    public static readonly OfflineShareTag:string = "crowdearth04";
    public static readonly ChangeNationShareTag:string = "crowdearth05";
    public static readonly BalanceDoubleShareTag:string = "crowdearth06";
    public static readonly UpgradeBonusShareTag:string = "crowdearth07";
    public static readonly VideoBoxShareTag:string = "crowdearth08";


    public static readonly AdPage_Balance:number = 204;
    public static readonly AdPage_VideoBox:number = 205;
    public static readonly AdPage_Unlock:number = 206;
    public static readonly AdPage_SpeedUp:number = 207;
    public static readonly AdPage_Setting:number = 208;
    public static readonly AdPage_LevelUp:number = 209;
    public static readonly AdPage_FreeGain:number = 210;
    public static readonly AdPage_AirDrop:number = 211;
    public static readonly AdPage_Main:number = 212;
    public static readonly AdPage_Diary:number = 229;
    public static readonly AdPage_Skin:number = 236;
    public static readonly AdPage_Shop:number = 239;
    public static readonly AdPage_Recommend:number = 245;
    public static readonly AdPage_OffLine:number = 247;
    public static readonly AdPage_UpgradeBonus:number = 248;
    public static readonly AdPage_Sign:number = 249;
    public static readonly AdPage_FreeGain_HighLevel:number = 251;
}