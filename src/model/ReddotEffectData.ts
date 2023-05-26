
/*
* 红点动画配置
*/
export default class ReddotEffectData
{
    public readonly reddot:Laya.Image;
    public readonly baseScale:number;
    public readonly maxScaleRate:number;
    public readonly totalScale:number;

    constructor(reddot:Laya.Image, baseScale:number, maxScaleRate:number=1.2)
    {
        this.reddot = reddot;
        this.baseScale = baseScale;
        this.maxScaleRate = baseScale * maxScaleRate;
        this.totalScale = this.baseScale + this.maxScaleRate;
    }   
}