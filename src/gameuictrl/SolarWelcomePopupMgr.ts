import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import ManualPageMgr from "./ManualPageMgr";
import UserData from "../data/UserData";
import SolarManager from "../solar/SolarManager";
import GameJsonConfig from "../config/GameJsonConfig";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";

/*
* SolarWelcomePopupMgr;
*/
export default class SolarWelcomePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:SolarWelcomePopupMgr;
    public static get instance():SolarWelcomePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new SolarWelcomePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.SolarWelcomePopupUI;

    private init():void
    {
        this._ui = new ui.popup.SolarWelcomePopupUI();
        this._ui.mouseThrough = true;

        this._ui.on(Laya.Event.CLICK, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        GameEventMgr.instance.Dispatch(GameEvent.GalaxyUIEnable, [false]);
        SoundManager.instance.playMusic(MusicConfig.GameBgm);
        this.setPage();
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
        GameEventMgr.instance.Dispatch(GameEvent.GalaxyUIEnable, [true]);
    }

    private setPage():void
    {
        let curSolarData = SolarManager.instance.getSolarDataByDiscoverIndex( UserData.instance.curDiscoverIndex );
        let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(curSolarData.index);
        this._ui.txtWelcom0.text = solarInfoCfg.solarName;
        let peopleBeforeMe:number = curSolarData.discoverSequence - 1;
        this._ui.txtWelcom1.text = "在你抵达之前，已有" + peopleBeforeMe + "人来到这块土地，去看看吧！";
    }

    private onMaskClick():void
    {
        this.close();
    }

    private onUIClick(evt:Laya.Event):void
    {
        let clkTarget = evt.target;
        switch(clkTarget)
        {
            case this._ui.btnCheckDiary:
                this.onClickCheckDiary();
                break;
        }
    }

    private onClickCheckDiary():void
    {
        this.close();
        ManualPageMgr.instance.show();
    }
}