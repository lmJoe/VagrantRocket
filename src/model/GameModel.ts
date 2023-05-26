/*
* 枚举类;
*/
class GameModel
{
}

export enum FPSScene
{
    None=0,
    Merge=1,
    Fly=2,
    Galaxy=3
}

export enum FPSMode
{
    Low=0,
    Middle=1,
    High=2
}

export enum PopupEftType
{
    Normal=0,
    Dialog=1
}

export enum BoosterType
{
    Single=0,
    Multi=1
}

export enum FlightEndCause
{
    None,
    Landed,
    Exploded,
    StayedInSpace
}

export enum SpaceshipState
{
    WaitingForIgnition,
    Igniting,
    Flying,
    Boosting,
    Landing,
    Landed,
    Exploded,
    Floating,
    SwitchLevel
}

export enum BoostRank
{
    Insane,
    Perfect,
    Great,
    Good,
    OK
}

export enum DecorationPlanetType
{
    Planet,
    Asteroid
}

export enum FlyGuideType
{
    Tap,
    Boom,
    Reborn
}

export enum MergeGuideType
{
    StartGame=0,
    BuyShip,
    MergeShip,
    EndGuide,
    Finished
}

export enum WeakGuideType
{
    Fly=0,
    Buy,
    Merge
}

export enum RankType
{
    All,
    Firend
}

export enum DiaryType
{
    Galaxy,
    Manual
}

export enum SkinType
{
    Normal,
    Special
}

export enum SkinUnlockType
{
    ShipLevel,
    SolarIndex,
    SolarNum,
    Sign
}

export enum SignBonusType
{
    Coin,
    Ship,
    SpeedUp,
    Skin
}

export enum BonusGainType
{
    None=0,
    Video=1,
    Share=2
}

export enum DialogType
{
    Dialog=1,
    Star=2
}