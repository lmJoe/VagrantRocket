import { ui } from "../ui/layaMaxUI";
import UIManager from "../ctrl/UIManager";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import NationPopupUI from "../gameui/NationPopupUI";
import Util from "../utils/Util";
import VideoAd from "../wx/VideoAd";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import TipDialogMgr from "./TipDialogMgr";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";
import NationManager from "../ctrl/NationManager";
import ZMGameConfig from "../ZMGameConfig";

/*
* NationPopupMgr;
*/
export default class NationPopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:NationPopupMgr;
    public static get instance():NationPopupMgr
    {
        if(!this._instance)
        {
            this._instance = new NationPopupMgr();
        }
        return this._instance;
    }

    private _ui:NationPopupUI;

    private init():void
    {
        this._ui = new NationPopupUI();

        GameEventMgr.instance.addListener(GameEvent.OnNation_ClickEvent, this, this.onUIClick);
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);
        this._ui.showPage();
        //
        if(NationManager.instance.hasForceShowNation == false)
        {
            NationManager.instance.setForceShowNation();
        }
        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }

    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
    }

    private onMaskClick():void
    {
        this.close();
    }

    private onUIClick(clkTarget):void
    {
        let clkName = clkTarget.name;
        switch(clkTarget)
        {
            case this._ui.btnConfirm:
                this.onClickConfirm();
                break;
            case this._ui.btnChange:
                this.onClickChange();
                break;
        }
        if(clkName == "btnNation")
        {
            let parent = clkTarget.parent;
            if(parent)
            {
                let nationId = Util.getNumFromStr(parent.name);
                this.onSelectNation(nationId);
            }
        }
    }
    
    private onSelectNation(nationId:number):void
    {
        this._ui.selectNation(nationId);
        SoundManager.instance.playSound(MusicConfig.Click, false);
    }

    private onClickConfirm():void
    {
        this._ui.changeNation();
        TipDialogMgr.instance.show("选择国家成功");
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
        this.close();
    }
    
    private onClickChange():void
    {
        if( zm.share.rewardShareEnable() )
        {
            this.shareGain();
        }else
        {
            this.videoGain();
        }
    }

    private shareGain():void
    {
        SoundManager.instance.playSound(MusicConfig.Click, false);
        zm.share.shareMessage(ZMGameConfig.ChangeNationShareTag, null, Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享成功—切换国家阵营");
            this.changeNation();

        }),Laya.Handler.create(this, function():void
        {

            DataStatisticsMgr.instance.stat("分享失败—切换国家阵营");

        }));
    }
    
    private videoGain():void
    {
        VideoAd.showAd(Laya.Handler.create(this, this.adSuccess), Laya.Handler.create(this, this.adFail));
    }
    
    private adSuccess():void
    {
        DataStatisticsMgr.instance.stat("广告视频—切换国家阵营");
        this.changeNation();
    }

    private adFail():void
    {
        TipDialogMgr.instance.show("看广告失败，请重试！");
        SoundManager.instance.playSound(MusicConfig.NoCoin, false);
    }

    private changeNation():void
    {
        this._ui.changeNation();
        TipDialogMgr.instance.show("更换国家成功");
        SoundManager.instance.playSound(MusicConfig.GetAward, false);
    }

}