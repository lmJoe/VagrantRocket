import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import SoundManager from "../ctrl/SoundManager";
import VibrateManager from "../ctrl/VibrateManager";
    
export default class SettingPopupUI extends ui.popup.SettingPopupUI
{
    constructor() { 
        super(); 
        this.mouseThrough = true;
    }

    
    onEnable(): void 
    {
        this.initSetting();
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    private initSetting():void
    {
        this.setMusic();
        this.setSound();
        this.setVibrate();
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnSetting_ClickEvent, [clickTarget]);
    }

    private setMusic():void
    {
        this.btnMusicOff.visible = !SoundManager.instance.musicEnable;
        this.btnMusicOn.visible = SoundManager.instance.musicEnable;
    }

    private setSound():void
    {
        this.btnSoundOff.visible = !SoundManager.instance.soundEnable;
        this.btnSoundOn.visible = SoundManager.instance.soundEnable;
    }

    private setVibrate():void
    {
        this.btnVibrateOff.visible = !VibrateManager.instance.vibrateEnable;
        this.btnVibrateOn.visible = VibrateManager.instance.vibrateEnable;
    }

    public clickMusic():void
    {
        SoundManager.instance.setMusieState( !SoundManager.instance.musicEnable );
        this.setMusic();
    }

    public clickSound():void
    {
        SoundManager.instance.setSoundState( !SoundManager.instance.soundEnable );
        this.setSound();
    }

    public clickVibrate():void
    {
        VibrateManager.instance.setState( !VibrateManager.instance.vibrateEnable );
        this.setVibrate();
    }

    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }
}