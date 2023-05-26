import GameSave from "../data/GameSave";

/*
* 音效控制;
*/
export default class SoundManager{
    constructor(){
        this.init();
    }

    private static _instance:SoundManager;
    public static get instance():SoundManager
    {
        if(!this._instance)
        {
            this._instance = new SoundManager();
        }
        return this._instance;
    }

    private static MusicKey:string = 'MusicKey';
    private static SoundKey:string = 'SoundKey';

    private _musicEnable:boolean;
    private _soundEnable:boolean;

    private _curMusicUrl:string;
    private _curMusicLoops:number;

    public get musicEnable():boolean
    {
        return this._musicEnable;
    }

    public get soundEnable():boolean
    {
        return this._soundEnable;
    }

    private init():void
    {
        this._curMusicUrl = null;
        this._curMusicLoops = -1;

        let musicValue = GameSave.getValue(SoundManager.MusicKey);
        if(musicValue == "no")
        {
            this._musicEnable = false;
        }else{
            this._musicEnable = true;
        }
        Laya.SoundManager.musicMuted = !this._musicEnable;

        let soundValue = GameSave.getValue(SoundManager.SoundKey);
        if(soundValue == "no")
        {
            this._soundEnable = false;
        }else{
            this._soundEnable = true;
        }
        Laya.SoundManager.soundMuted = !this._soundEnable;
    }

    public setMusieState(enable:boolean):void
    {
        let value = enable ? "yes" : "no";
        GameSave.setValue(SoundManager.MusicKey, value);

        this._musicEnable = enable;
        Laya.SoundManager.musicMuted = !this._musicEnable;
    }

    public setSoundState(enable:boolean):void
    {
        let value = enable ? "yes" : "no";
        GameSave.setValue(SoundManager.SoundKey, value);

        this._soundEnable = enable;
        Laya.SoundManager.soundMuted = !this._soundEnable;
    }


    /* 音效 */
    public playSound(url:string, loop:boolean=false):void
    {
        Laya.SoundManager.playSound(url, loop ? 0:1);
    }
    
    public stopSound(url:string):void
    {
        Laya.SoundManager.stopSound(url);
    }
    
    /* 音乐 */
    public playMusic(url:string, loops:number=0):void
    {
        if(!this._curMusicUrl)
        {
            if(this._curMusicUrl==url && this._curMusicLoops==0)
            {
                return;
            }
            this.stopMusic();
        }
        this._curMusicUrl = url;
        this._curMusicLoops = loops;
        Laya.SoundManager.playMusic(url, loops);
    }
    
    public stopMusic():void
    {
        this._curMusicUrl = null;
        this._curMusicLoops = -1;
        Laya.SoundManager.stopMusic();
    }

    //停止所有音效
    public stopAllSound():void
    {
        Laya.SoundManager.stopAllSound(); 
    }

    //停止所有声音(音乐和音效)
    public stopAll():void
    {
        Laya.SoundManager.stopAll(); 
    }
}