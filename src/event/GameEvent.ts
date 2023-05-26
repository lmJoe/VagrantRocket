/*
* 游戏事件;
*/
export default class GameEvent
{
    /* 游戏事件 */
    public static readonly OnLaunched:string = "OnLaunched";
    public static readonly OnFlightEnded:string = "OnFlightEnded";
    public static readonly OnLastBoostUsed:string = "OnLastBoostUsed";
    public static readonly OnBoostStarted:string = "OnBoostStarted";
    public static readonly OnGameOver:string = "OnGameOver";
    public static readonly BoostMeterMovieEnd:string = "BoostMeterMovieEnd";
    public static readonly OnUnlockSolarStart:string = "OnUnlockSolarStart";
    public static readonly OnUnlockSolarEnd:string = "OnUnlockSolarEnd";
    //游戏重开
    public static readonly onRestartGame:string = "onRestartGame";
    //游戏强制重开-新手引导
    public static readonly onForceRestartGame:string = "onForceRestartGame";
    //游戏复活
    public static readonly onRebornGame:string = "onRebornGame";
    
    /* 系统事件 */
    public static readonly UpdateCoin:string = "UpdateCoin";
    public static readonly GameGainCoin:string = "GameGainCoin";
    public static readonly PeopleInShipChange:string = "PeopleInShipChange";
    public static readonly SolarPeopleChange:string = "SolarPeopleChange";

    public static readonly onLoad3dResCompleted:string = "onLoad3dResCompleted";
    public static readonly onLoadMovieEnd:string = "onLoadMovieEnd";

    public static readonly OnRemoveAllPopup:string = "OnRemoveAllPopup";
    
    /* 点击事件 */
    public static readonly OnPopupMaskClick:string = "OnPopupMaskClick";
    public static readonly OnHome_ClickEvent:string = "OnHome_ClickEvent";
    public static readonly OnRevive_ClickEvent:string = "OnRevive_ClickEvent";
    public static readonly OnBalance_ClickEvent:string = "OnBalance_ClickEvent";
    public static readonly OnSetting_ClickEvent:string = "OnSetting_ClickEvent";
    public static readonly OnRank_ClickEvent:string = "OnRank_ClickEvent";
    public static readonly OnGalaxy_ClickEvent:string = "OnGalaxy_ClickEvent";
    public static readonly onManual_ClickEvent:string = "onManual_ClickEvent";
    public static readonly OnShop_ClickEvent:string = "OnShop_ClickEvent";
    public static readonly OnMerge_ClickEvent:string = "OnMerge_ClickEvent";
    public static readonly OnSkin_ClickEvent:string = "OnSkin_ClickEvent";
    public static readonly OnNation_ClickEvent:string = "OnNation_ClickEvent";
    public static readonly OnSign_ClickEvent:string = "OnSign_ClickEvent";

    /* 触发事件 */
    public static readonly OnClickToBoost:string = "OnClickToBoost";
    public static readonly OnScreenMove:string = "OnScreenMove";
    public static readonly OnClickAddPod:string = "OnClickAddPod";
    public static readonly OnClickReducePod:string = "OnClickReducePod";
    public static readonly OnClickGalaxyPlanet:string = "OnClickGalaxyPlanet";

    public static readonly OnBalancePageClose:string = "OnBalancePageClose";
    public static readonly GalaxyUIEnable:string = "GalaxyUIEnable";
    public static readonly OnUnlockNewShipPageClose:string = "OnUnlockNewShipPageClose";
    
    /* 合成事件 */ 
    public static readonly OnBeginDrag:string = "OnBeginDrag";
    public static readonly OnDrag:string = "OnDrag";
    public static readonly OnEndDrag:string = "onEndDrag";
    public static readonly RefreshEarnings:string = "RefreshEarnings";
    public static readonly CombinationShip:string = "CombinationShip";
    
    public static readonly RefreshOwnMoneyText:string = "RefreshOwnMoneyText";
    public static readonly RefreshBuyShipBtn:string = "RefreshBuyShipBtn";
    public static readonly UnlockNewShipLevel:string = "unlockNewShipLevel";
    public static readonly UnLockShips:string = "UnLockShips";
    public static readonly ChangeShips:string = "ChangeShips";
    public static readonly DragCreateShip:string = "DragCreateShip";
    public static readonly RefreshPlayerLevelUp:string = "RefreshPlayerLevelUp";
    public static readonly BuyShip:string = "BuyShip";

    public static readonly OnMerge_MouseMove:string = "OnMerge_MouseMove";
    public static readonly OnMerge_MouseDown:string = "OnMerge_MouseDown";
    public static readonly OnMerge_MouseUp:string = "OnMerge_MouseUp";


    public static readonly CreatShip:string = "CreatShip";
    public static readonly CreateBoxShip:string = "CreateBoxShip";
    public static readonly RefreshShipItemList:string = "RefreshShipItemList";
    public static readonly SellShip:string = "SellShip";
    public static readonly SellShipEffectEnd:string = "SellShipEffectEnd";
    public static readonly RefreshGameDistance:string = "RefreshGameDistance";
    public static readonly RefreshBestDistance:string = "RefreshBestDistance";

    public static readonly StartSpeedUp:string = "StartSpeedUp";
    public static readonly StopSpeedUp:string = "StopSpeedUp";
    public static readonly SpeedUpTimeCount:string = "SpeedUpTimeCount";
    public static readonly RefreshShopOtherList:string = "RefreshShopOtherList";
    public static readonly Refresh_5_SpeedUp:string = "Refresh_5_SpeedUp";


    public static readonly RefreshShopShipPage:string = "RefreshShopShipPage";
    public static readonly RefreshShopRedPoint:string = "RefreshShopRedPoint";
    public static readonly FreeBonusTime:string = "FreeBonusTime";
    public static readonly ShowFreeBonusTime:string = "ShowFreeBonusTime";
    public static readonly ChangeLevel:string = "ChangeLevel";
    public static readonly RefreshOnLineReward:string = "RefreshOnLineReward";

    public static readonly StartShengjiEffect:string = "StartShengjiEffect";

    //合成引导
    public static readonly MergeGuideFinish:string = "MergeGuideFinish";

    //输入
    public static readonly InputConfirm:string = "InputConfirm";
    public static readonly OnMyCommentLikeNumUpdate:string = "OnMyCommentLikeNumUpdate";
    public static readonly OnMyCommentLikeNotice:string = "OnMyCommentLikeNotice";
    
    //看视频更新
    public static readonly OnVideoAdUpdate:string = "OnVideoAdUpdate";
    public static readonly OnPrivilegeUpdate:string = "OnPrivilegeUpdate";
    
    //弱引导点击关闭
    public static readonly OnWeakGuideClickClose:string = "OnWeakGuideClickClose";
    //解锁皮肤
    public static readonly UnlockNewSkin:string = "UnlockNewSkin";
    public static readonly RefreshSkinBtnReddot:string = "RefreshSkinBtnReddot";
    //加速界面红点
    public static readonly RefreshSpeedUpBtnReddot:string = "RefreshSpeedUpBtnReddot";
    //国家
    public static readonly OnNationChange:string = "OnNationChange";
    //签到
    public static readonly OnSign:string = "OnSign";
    public static readonly ForceShowSignPopup:string = "ForceShowSignPopup";
    //星球探索
    public static readonly OnStartStarDialog:string = "OnStartStarDialog";
    public static readonly OnEndStarDialog:string = "OnEndStarDialog";
    //FPS事件
    public static readonly OnFPSLow:string = "OnFPSLow";
    public static readonly OnFPSMiddle:string = "OnFPSMiddle";
    public static readonly OnFPSHigh:string = "OnFPSHigh";
}