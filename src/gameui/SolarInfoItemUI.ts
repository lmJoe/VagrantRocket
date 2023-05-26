import { ui } from "../ui/layaMaxUI";
import SolarData from "../solar/SolarData";
import SolarManager from "../solar/SolarManager";
import UserData from "../data/UserData";
import GameLayerMgr from "../scene/GameLayerMgr";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GameJsonConfig from "../config/GameJsonConfig";
/*
* 星际星系简介面板;
*/
export default class SolarInfoItemUI extends ui.component.SolarInfoItemUI
{
    constructor(){
        super();
        // this.mouseEnabled = true;
        this.mouseThrough = true;
    }

    private _discoverIdx:number;
    private _solarData:SolarData;
    private _clickTime:number;

    public get hasInfo():boolean
    {
        return this._solarData != null && this._solarData != undefined;
    }

    public init(discoverIdx:number):void
    {
        this._discoverIdx = discoverIdx;
        this.setInfo();
        //初始位置
        GameLayerMgr.instance.gameLayer.addChild(this);
        this.pos(-300, -300);
        //
        this._clickTime = 0;
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private onClick(evt:Laya.Event):void
    {
        if(evt.target == this.imgItem || evt.target == this.btnItem)
        {
            let nowTime = Date.now();
            if(nowTime - this._clickTime > 1500)
            {
                this._clickTime = nowTime;
                GameEventMgr.instance.Dispatch(GameEvent.OnClickGalaxyPlanet, [this._discoverIdx]);
            }
        }
    }

    public updateInfo():void
    {
        if(this._discoverIdx == UserData.instance.curDiscoverIndex)
        {
            this.setInfo();
        }
    }
    
    private setInfo():void
    {
        this._solarData = SolarManager.instance.getSolarDataByDiscoverIndex( this._discoverIdx );
        if(this._solarData)
        {
            let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(this._solarData.index);
            this.txtSolarName.text = solarInfoCfg.solarName;
            this.txtSolarName.cacheAs = "bitmap";
            this.txtArriveDesc.text = "第" + this._solarData.discoverSequence + "位探索者";
            this.txtArriveDesc.cacheAs = "bitmap";

            this.txtLevel.value = ""+(1+this._solarData.discoverIndex);
            this.txtDate.value = this._solarData.discoverTimeDesc;

            this.visible = true;
        }else{
            this.visible = false;
        }
    }

    public setPos(starScreenX:number, starScreenY:number):void
    {
        this.pos(starScreenX-this.btnItem.x, starScreenY-this.btnItem.y);
    }

    public setEnable(enable:boolean):void
    {
        this.visible = enable;
    }
}