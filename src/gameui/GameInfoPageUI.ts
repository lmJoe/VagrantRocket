import { ui } from "./../ui/layaMaxUI";
import Util from "../utils/Util";
import Constants from "../model/Constants";
import GameJsonConfig from "../config/GameJsonConfig";
import UserData from "../data/UserData";
    
export default class GameInfoPageUI extends ui.view.GameInfoPageUI
{
    constructor() { 
        super(); 
        this.reset();
    }

    private reset():void
    {
        this.setGameDistance(0);
    }

    public setGameDistance(distance:number):void
    {
        this.txtGameDistance.value = "" + distance;

        if(UserData.instance.gameLevel >= Constants.TotalLevelNum)
        {
            this.boxTip.visible = false;
        }else{
            let levelFlewDistance:number = UserData.instance.levelFlewDistance + distance; 
            let levelDistance:number = UserData.instance.levelDistance;
            let leftLevelDistance:number = levelDistance - levelFlewDistance;
            this.txtDistanceTips.value = ""+leftLevelDistance;
            this.boxTip.visible = this.showTip(levelDistance, leftLevelDistance);
        }

        this.setBarDistance(distance);
    }

    private setBarDistance(distance:number):void
    {
        let levelFlewDistance:number = UserData.instance.levelFlewDistance+distance; 
        if(UserData.instance.gameLevel >= Constants.TotalLevelNum)
        {
            this.boxDistance.visible = false;
        }else
        {
            let levelDistance:number = UserData.instance.levelDistance;
            let leftDistance = levelDistance - levelFlewDistance;
            if(leftDistance >= 0)
            {
                this.boxDistance.visible = true;
                
                this.txtCurLevel.value = "" + UserData.instance.gameLevel;
                this.txtNextLevel.value = "" + (UserData.instance.gameLevel+1);
                let rate = levelFlewDistance / levelDistance;
                this.barDistance.value = rate;
                this.imgPoint.y = this.barDistance.y - (rate)*this.barDistance.width;
                this.imgPoint.x = 27;
            }else{
                this.boxDistance.visible = false;
            }
        }
    }

    private showTip(levelDistance:number, leftLevelDistance:number):boolean
    {
        let rate:number = UserData.instance.curDiscoverIndex == Constants.DefaultFirstDiscoverIndex ? 0.5 : Constants.DistanceRate;
        let limit:number = Math.min( rate*levelDistance, Constants.DistanceLimit );
        return leftLevelDistance <= limit && leftLevelDistance >= 0;
    }

    public setBestDistance():void
    {
        this.txtBestDistance.value = "" + UserData.instance.bestDistance;
    }

    public onStart():void
    {
        this.boxScore.visible = false;
    }

    public onLaunched():void
    {
        this.boxScore.visible = true;
    }
    
    public onGameOver():void
    {
        this.boxScore.visible = false;
    }

    onEnable(): void 
    {
    }


    onDisable(): void 
    {
    }
}