import { ui } from "./../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameLayerMgr from "../scene/GameLayerMgr";
import GameManager from "../ctrl/GameManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GameSave from "../data/GameSave";
import { FlyGuideType } from "../model/GameModel";

/*
* GuideManager;
*/
export default class GuideManager
{
    constructor(){
        this.init();
    }

    private static _instance:GuideManager;
    public static get instance():GuideManager
    {
        if(!this._instance)
        {
            this._instance = new GuideManager();
        }
        return this._instance;
    }

    private static readonly GuideKey:string = "FlyGuideKey";

    private _ui:ui.popup.GuidePopupUI;

    private _hasTapGuide:boolean;
    private _hasBoomGuide:boolean;
    private _hasLanded:boolean;

    private _canClickGuide:boolean;
    private _curFlyGuideType:FlyGuideType;

    
    public get hasTapGuide():boolean
    {
        return this._hasTapGuide;
    }

    public get hasBoomGuide():boolean
    {
        return this._hasBoomGuide;
    }

    public get hasLanded():boolean
    {
        return this._hasLanded;
    }

    public get hasFinish():boolean
    {
        return this._hasLanded;
    }

    private init():void
    {
        this._ui = new ui.popup.GuidePopupUI();
        this._ui.mouseEnabled = false;
        this._ui.mouseThrough = true;

        this.getLocalGuideData();

        this._canClickGuide = false;
    }

    private getLocalGuideData():void
    {
        let saveStr:string = GameSave.getValue(GuideManager.GuideKey);
        // let saveStr:string = "";
        this.getGuideData(saveStr);
    }

    public getServer(data:any):void
    {
        this.getGuideData( data[GuideManager.GuideKey] );
        this.saveGuideData();
    }

    public getAllFlyGuideData():any
    {
        let data = {};
        data[GuideManager.GuideKey] = GameSave.getValue(GuideManager.GuideKey);
        return data;
    }

    private getGuideData(saveStr:string):void
    {
        if(!saveStr || saveStr.length==0)
        {
            saveStr = "0:0:0";
        }
        let arr = saveStr.split(":");
        this._hasTapGuide = parseInt(arr[0]) > 0;
        this._hasBoomGuide = parseInt(arr[1]) > 0;
        this._hasLanded = parseInt(arr[2]) > 0;
    }

    private saveGuideData():void
    {
        let saveStr:string = "";
        saveStr = saveStr + (this._hasTapGuide ? 1:0) + ":";
        saveStr = saveStr + (this._hasBoomGuide ? 1:0) + ":";
        saveStr = saveStr + (this._hasLanded ? 1:0);
        GameSave.setValue(GuideManager.GuideKey, saveStr);
    }

    public showGuide(type:FlyGuideType):void
    {
        GameManager.instance.stopGame();

        UIManager.instance.showPopup(this._ui);
        this._curFlyGuideType = type;
        this.showGuideBox(type);

        this._canClickGuide = false;
        Laya.timer.clear(this, this.onTimer);
        Laya.timer.once(1000, this, this.onTimer);

        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }

    private showGuideBox(type:FlyGuideType):void
    {
        this._ui.boxTapGuide.visible = type == FlyGuideType.Tap;
        this._ui.boxBoomGuide.visible = type == FlyGuideType.Boom;
        this._ui.boxRebornGuide.visible = type == FlyGuideType.Reborn;
        if(type != FlyGuideType.Reborn)
        {
            this._ui.boxTap.visible = true;
            this._ui.aniTap.play(0, true);
        }else{
            this._ui.boxTap.visible = false;
            this._ui.aniTap.stop();
        }
    }

    private onTimer():void
    {
        Laya.timer.clear(this, this.onTimer);
        this._canClickGuide = true;
    }

    private onMaskClick():void
    {
        if( this._canClickGuide )
        {
            if(this._curFlyGuideType == FlyGuideType.Tap)
            {
                this.doTapGuide();
            }
            else if(this._curFlyGuideType == FlyGuideType.Boom)
            {
                this.doBoomGuide();
            }
            else if(this._curFlyGuideType == FlyGuideType.Reborn)
            {
                this.doRebronGuide();
            }

            this.close();
        }
    }

    private doTapGuide():void
    {
        this._hasTapGuide = true;
        this.saveGuideData();
    }

    public doBoomGuide():void
    {
        this._hasBoomGuide = true;
        this.saveGuideData();
    }

    private doRebronGuide():void
    {
        this._hasTapGuide = false;
        this._hasBoomGuide = false;
        this._hasLanded = false;
        this.saveGuideData();

        // GameEventMgr.instance.Dispatch(GameEvent.onRebornGame);
        GameEventMgr.instance.Dispatch(GameEvent.onForceRestartGame);
    }

    public onLand():void
    {
        this._hasLanded = true;
        this.saveGuideData();
    }
    
    public close():void
    {
        this._canClickGuide = false;
        UIManager.instance.removePopup(this._ui);
        GameManager.instance.continueGame();
        this._ui.aniTap.stop();

        this.boost();

        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }
    
    private boost():void
    {
        GameEventMgr.instance.Dispatch(GameEvent.OnClickToBoost);
    }
}