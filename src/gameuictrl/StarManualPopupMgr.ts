import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import StarInfo from "../model/StarInfo";
import GameJsonConfig from "../config/GameJsonConfig";
import StarItem from "../gameui/StarItem";
import StarPopupMgr from "./StarPopupMgr";
import StarManager from "../ctrl/StarManager";

/*
* StarManualPopupMgr;
*/
export default class StarManualPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:StarManualPopupMgr;
    public static get instance():StarManualPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new StarManualPopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.StarManualPopupUI;
    private _starList:Array<StarInfo>;
    private _showDetailInfo:boolean;

    private init():void
    {
        this._ui = new ui.popup.StarManualPopupUI();
        this._ui.mouseThrough = true;

        this._ui.listStar.itemRender = StarItem;
        this._ui.listStar.repeatX = 3;
        this._ui.listStar.repeatY = 4;
        this._ui.listStar.spaceX = 20;
        this._ui.listStar.spaceY = 20;
        this._ui.listStar.vScrollBarSkin = '';
        this._ui.listStar.scrollBar.elasticBackTime = 200;
        this._ui.listStar.scrollBar.elasticDistance = 100;
        this._ui.listStar.selectEnable = true;

        this._ui.listStar.renderHandler = new Laya.Handler(this, this.onManualRender);
        this._ui.listStar.selectHandler = new Laya.Handler(this, this.onItemSelect);
    }
    
    public show():void
    {
        this._showDetailInfo = false;
        this.setStarInfo();
        UIManager.instance.showPopup(this._ui);
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }
    
    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
    }

    private onMaskClick():void
    {
        if(!this._showDetailInfo)
        {
            this.close();
        }
    }

    private getDiscoverStarList():void
    {
        this._starList = [];
        let discoverStarIds = StarManager.instance.discoverStarIds;
        for(var i=0; i<discoverStarIds.length; i++)
        {
            let starId = discoverStarIds[i];
            let starInfo = GameJsonConfig.instance.getStarInfoById(starId);
            this._starList.push(starInfo);
        }
    }

    private setStarInfo():void
    {
        this._ui.listStar.selectedIndex = -1;
        this.getDiscoverStarList();
        this._ui.listStar.array = this._starList;
        this._ui.listStar.scrollBar.value = 0;
    }

    private onManualRender(star: StarItem, index: number):void
    {
        let starInfo:StarInfo = this._starList[index];
        star.setInfo(index, starInfo);
    }

    private onItemSelect(index:number):void
    {
        if(index >= 0)
        {
            let starInfo:StarInfo = this._starList[index];
            this._showDetailInfo = true;
            StarPopupMgr.instance.show(starInfo.id, Laya.Handler.create(this, this.onStarPopupClose));
            SoundManager.instance.playSound(MusicConfig.Click, false);
        }   
    }

    private onStarPopupClose():void
    {
        this._showDetailInfo = false;
        this._ui.listStar.selectedIndex = -1;
    }

}