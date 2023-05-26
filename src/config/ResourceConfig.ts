export default class ResourceConfig{
    constructor(){
    }

    public static ResUrl:string = "res/LayaScene_CrowdEarth/Conventional/CrowdEarth.ls";

    //游戏背景（关卡，星际，合成界面）
    public static GalaxyBg:string = "leveljpg/first/bgjpg/galaxybg.jpg";
    public static MergeBgPrefix:string = "bgjpg/mergebg";
    public static GameBgPrefix:string = "bgjpg/bg";
    
    //探索星球资源
    public static StarBg:string = "starimg/first/imgStarBg.jpg";

    private static CommonResUrl:string = "res/atlas/common.atlas";
    private static SettingResUrl:string = "res/atlas/setting.atlas";
    private static GameinfoResUrl:string = "res/atlas/gameinfo.atlas";
    private static GameendResUrl:string = "res/atlas/gameend.atlas";
    private static guideResUrl:string = "res/atlas/guide.atlas";
    private static RankResUrl:string = "res/atlas/rank.atlas";
    private static ManualResUrl:string = "res/atlas/manual.atlas";
    private static GalaxyResUrl:string = "res/atlas/galaxy.atlas";
    private static SolarIconResUrl:string = "res/atlas/solaricon.atlas";
    //动画
    private static HechengAniResUrl:string = "res/atlas/ani/hecheng.atlas";
    private static DeleteAniResUrl:string = "res/atlas/ani/delete.atlas";
    private static CoinAniResUrl:string = "res/atlas/ani/coin.atlas";
    //合成资源
    private static MergeHomeResUrl:string = "res/atlas/imgRes2/mergehome.atlas";
    private static MergeCommonResUrl:string = "res/atlas/imgRes2/common.atlas";
    private static GainShipResUrl:string = "res/atlas/imgRes2/gainship.atlas";
    private static SpeedUpResUrl:string = "res/atlas/imgRes2/speedup.atlas";
    private static ShopResUrl:string = "res/atlas/imgRes2/shop.atlas";
    private static ShipIconUrl:string = "res/atlas/imgRes2/shipicon.atlas";
    private static OfflineUrl:string = "res/atlas/imgRes2/offline.atlas";
    //探索星球
    private static NpcDialogUrl:string = "res/atlas/npcdialog/dialog.atlas";
    private static StarPopupUrl:string = "res/atlas/star.atlas";
    //运营
    private static SkinResUrl:string = "res/atlas/imgRes2/skin.atlas";
    private static NationUrl:string = "res/atlas/imgRes2/nation.atlas";
    private static SignUrl:string = "res/atlas/imgRes2/sign.atlas";
    private static RecommendPopupUrl:string = "res/atlas/recommend.atlas";
    private static YunyingPopupUrl:string = "res/atlas/yunying.atlas";
    private static UpgradeBonusPopupUrl:string = "res/atlas/imgRes2/upgrade.atlas";
    
    //wxlocal
    private static WxLocalLogo:string = "wxlocal/logo.png";
    private static WxLocalLoadingBg:string = "wxlocal/loadingbg.jpg";
    private static WxLocalLoadingBar:string = "wxlocal/progress$bar.png";
    private static WxLocalLoadingBarBg:string = "wxlocal/progress.png";
    private static WxLocalRocekt:string = "wxlocal/rocekt.png";
    private static WxLocalRocektFire:string = "wxlocal/rocektfire.png";
    private static WxLocalGetReward:string = "wxlocal/imgGetReward.png";
    //--rank
    private static WxLocalRankItemBg0:string = "wxlocal/rank/imgitembg0.png";
    private static WxLocalRankItemBg1:string = "wxlocal/rank/imgitembg1.png";
    private static WxLocalRankItemBgMy:string = "wxlocal/rank/imgmyitembg.png";
    private static WxLocalRankImg1:string = "wxlocal/rank/imgrank1.png";
    private static WxLocalRankImg2:string = "wxlocal/rank/imgrank2.png";
    private static WxLocalRankImg3:string = "wxlocal/rank/imgrank3.png";
    private static WxLocalRankNum:string = "wxlocal/rank/ranknum.png";
    private static WxLocalRankScoreNum:string = "wxlocal/rank/scorenum.png";
    //--special avatar
    private static WxLocalSpecialAvatar:string = "wxlocal/special/imgSpecialAvatar.png";

    //游戏数据配置
    public static RokectlvCfg:string = "res/config/rocketLv.json";
    public static BoosterCfg:string = "res/config/booster.json";
    public static LevelCfg:string = "res/config/level.json";
    public static SolarInfoCfg:string = "res/config/solarinfo.json";
    public static ShipInfoCfg:string = "res/config/shipinfo.json";
    public static UserLevelCfg:string = "res/config/userleveldata.json";
    public static SolarCommentCfg:string = "res/config/comment.json";
    public static ExplorerCfg:string = "res/config/explorer.json";
    public static PlanetCfg:string = "res/config/planet.json";
    public static OfflineCfg:string = "res/config/offline.json";
    public static SkinCfg:string = "res/config/skin.json";
    public static MeshCfg:string = "res/config/mesh.json";
    //合成数据
    public static ADShipsCfg:string = "res/config/ADShips.json";
    public static FreeShipsCfg:string = "res/config/FreeShips.json";
    public static FreeBonusCfg:string = "res/config/FreeBonus.json";
    public static PrivilegeCfg:string = "res/config/privilege.json";
    public static FreeShipLevelUpCfg:string = "res/config/freeshiplevelup.json";
    //世界观
    public static NpcDialogCfg:string = "res/config/npcdialog.json";
    public static StarInfoCfg:string = "res/config/starinfo.json";

    private static get ConfigRes():Array<any>
    {
        let arr:Array<any> = 
        [
            {url:ResourceConfig.RokectlvCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.BoosterCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.LevelCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.SolarInfoCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.ShipInfoCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.UserLevelCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.SolarCommentCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.ExplorerCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.PlanetCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.OfflineCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.SkinCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.MeshCfg, type:Laya.Loader.JSON}

            ,{url:ResourceConfig.ADShipsCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.FreeShipsCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.FreeBonusCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.PrivilegeCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.FreeShipLevelUpCfg, type:Laya.Loader.JSON}

            ,{url:ResourceConfig.NpcDialogCfg, type:Laya.Loader.JSON}
            ,{url:ResourceConfig.StarInfoCfg, type:Laya.Loader.JSON}
        ];
        return arr;
    }

    private static get ImageRes():Array<any>
    {
        let arr:Array<any> = 
        [
            // {url:ResourceConfig.CommonResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.SettingResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.GameinfoResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.GameendResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.guideResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.RankResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.ManualResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.GalaxyResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.SolarIconResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.SkinResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.NationUrl, type:Laya.Loader.ATLAS}
            {url:ResourceConfig.SignUrl, type:Laya.Loader.ATLAS}

            // ,{url:ResourceConfig.NpcDialogUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.StarPopupUrl, type:Laya.Loader.ATLAS}

            // ,{url:ResourceConfig.RecommendPopupUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.YunyingPopupUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.UpgradeBonusPopupUrl, type:Laya.Loader.ATLAS}

            // ,{url:ResourceConfig.HechengAniResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.DeleteAniResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.CoinAniResUrl, type:Laya.Loader.ATLAS}
            
            ,{url:ResourceConfig.MergeHomeResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.MergeCommonResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.GainShipResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.SpeedUpResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.ShopResUrl, type:Laya.Loader.ATLAS}
            // ,{url:ResourceConfig.ShipIconUrl, type:Laya.Loader.ATLAS}
            ,{url:ResourceConfig.OfflineUrl, type:Laya.Loader.ATLAS}

        ];
        return arr;
    }

    public static get loadRes():any
    {
        return ResourceConfig.ImageRes.concat( ResourceConfig.ConfigRes );
    }

    public static get localRes():Array<any>
    {
        let arr:Array<any> = 
        [
            {url:ResourceConfig.WxLocalLogo, type:Laya.Loader.IMAGE}
            ,{url:ResourceConfig.WxLocalLoadingBg, type:Laya.Loader.IMAGE}
            ,{url:ResourceConfig.WxLocalLoadingBar, type:Laya.Loader.IMAGE}
            ,{url:ResourceConfig.WxLocalLoadingBarBg, type:Laya.Loader.IMAGE}
            ,{url:ResourceConfig.WxLocalRocekt, type:Laya.Loader.IMAGE}
            ,{url:ResourceConfig.WxLocalRocektFire, type:Laya.Loader.IMAGE}
            
            // ,{url:ResourceConfig.WxLocalRankItemBg0, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankItemBg1, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankItemBgMy, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankImg1, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankImg2, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankImg3, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankNum, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalRankScoreNum, type:Laya.Loader.IMAGE}
            
            // ,{url:ResourceConfig.WxLocalSpecialAvatar, type:Laya.Loader.IMAGE}
            // ,{url:ResourceConfig.WxLocalGetReward, type:Laya.Loader.IMAGE}

        ];
        return arr;
    }

    public static clearLoadingRes():void
    {
        let localRes = ResourceConfig.localRes;
        for (let index = 0; index < localRes.length; index++) 
        {
            let data = localRes[index];
            Laya.loader.clearRes(data.url);
        }
    }
}