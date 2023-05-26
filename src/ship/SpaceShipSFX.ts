import { BoostRank } from "../model/GameModel";
import SoundManager from "../ctrl/SoundManager";
import MusicConfig from "../config/MusicConfig";

/*
* 飞船声效;
*/
export default class SpaceShipSFX
{
    constructor()
    {
    }

    private static _instance:SpaceShipSFX;
    public static get instance():SpaceShipSFX
    {
        if(!this._instance)
        {
            this._instance = new SpaceShipSFX();
        }
        return this._instance;
	}

    public startIgnition():void
    {
        SoundManager.instance.playSound(MusicConfig.Ignition, false);
    }

    public startEngine():void
    {
        SoundManager.instance.playSound(MusicConfig.Engine, true);
    }
    
    public stopEngine():void
    {
        SoundManager.instance.stopSound(MusicConfig.Engine);
    }

    public onLandedPlanet():void
    {
        this.stopEngine();
        SoundManager.instance.playSound(MusicConfig.LandSound, false);
    }
    
    public onExplode():void
    {
        this.stopEngine();
        SoundManager.instance.playSound(MusicConfig.Explosion0, false);
    }

    public booste(rank:BoostRank):void
    {
        let soundUrl:string = "";
        switch(rank)
        {
            case BoostRank.Insane:
                soundUrl = MusicConfig.BoostInsane;
                break;
            case BoostRank.Perfect:
                soundUrl = MusicConfig.BoostPerfect;
                break;
            case BoostRank.Great:
                soundUrl = MusicConfig.BoostGreat;
                break;
            case BoostRank.Good:
                soundUrl = MusicConfig.BoostGood;
                break;
            case BoostRank.OK:
                soundUrl = MusicConfig.BoostOK;
                break;
        }
        SoundManager.instance.playSound(soundUrl,false);
    }
}