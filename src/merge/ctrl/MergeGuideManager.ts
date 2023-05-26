import GameSave from "../../data/GameSave";
import { MergeGuideType } from "../../model/GameModel";
import MergeGuidePopupMgr from "../../gameuictrl/MergeGuidePopupMgr";
import GameEventMgr from "../../event/GameEventMgr";
import GameEvent from "../../event/GameEvent";

/*
* MergeGuideManager;
*/
export default class MergeGuideManager
{
    constructor(){
        this.init();
    }

    private static _instance:MergeGuideManager;
    public static get instance():MergeGuideManager
    {
        if(!this._instance)
        {
            this._instance = new MergeGuideManager();
        }
        return this._instance;
    }

    private static readonly GuideStepKey:string = "MergeGuideStepKey";
    private static readonly GuidePeopleKey:string = "GuidePeopleKey";

    private static readonly PeopleGuideMax:number = 2;

    private _mergeGuideStep:MergeGuideType;
    private _peopleGuideShowCount:number;

    private init():void
    {
        this.getLocalGuideData();
        if( this.hasFinish == false ){
            GameEventMgr.instance.addListener(GameEvent.CombinationShip, this, this.onCombinaShip);
        }
    }

    public get hasFinish():boolean
    {
        return this._mergeGuideStep == MergeGuideType.Finished;
    }

    public get mergeGuideStep():MergeGuideType
    {
        return this._mergeGuideStep;
    }

    public get peopleGuideFinish():boolean
    {
        return this._peopleGuideShowCount >= MergeGuideManager.PeopleGuideMax;
    }

    private getLocalGuideData():void
    {
        let saveStr:string = GameSave.getValue(MergeGuideManager.GuideStepKey);
        // let saveStr:string = "0";
        this.getMergeGuideData(saveStr);
        
        let saveStr2:string = GameSave.getValue(MergeGuideManager.GuidePeopleKey);
        // let saveStr2:string = "";
        this.getPeopleGuideData(saveStr2);
    }

    public getServer(data:any):void
    {
        this.getMergeGuideData( data[MergeGuideManager.GuideStepKey] );
        this.getPeopleGuideData( data[MergeGuideManager.GuidePeopleKey] );
        this.saveGuideData();
    }

    private getMergeGuideData(saveStr:string):void
    {
        if(!saveStr || saveStr.length==0)
        {
            saveStr = "0";
        }
        let value = parseInt( saveStr );
        if(value <= MergeGuideType.StartGame)
        {
            this._mergeGuideStep = MergeGuideType.StartGame;
        }
        else if(value >= MergeGuideType.Finished)
        {
            this._mergeGuideStep = MergeGuideType.Finished;
        }
        else
        {
            this._mergeGuideStep = value;
        }
    }

    private getPeopleGuideData(saveStr2:string):void
    {
        if(!saveStr2 || saveStr2.length==0)
        {
            saveStr2 = "0";
        }
        this._peopleGuideShowCount = parseInt( saveStr2 );
    }

    public allMergeGuideData():any
    {
        let saveStr:string = GameSave.getValue(MergeGuideManager.GuideStepKey);
        let saveStr2:string = GameSave.getValue(MergeGuideManager.GuidePeopleKey);
        let data:any = {};
        data[MergeGuideManager.GuideStepKey] = saveStr;
        data[MergeGuideManager.GuidePeopleKey] = saveStr2;
        return data;
    }

    private saveGuideData():void
    {
        GameSave.setValue(MergeGuideManager.GuideStepKey, this._mergeGuideStep.toString());
        GameSave.setValue(MergeGuideManager.GuidePeopleKey, this._peopleGuideShowCount.toString());
    }

    public showMergeGuide():void
    {
        if(this._mergeGuideStep < MergeGuideType.Finished)
        {
            MergeGuidePopupMgr.instance.show(this._mergeGuideStep);
        }
    }

    public mergeStepFinish():void
    {
        this._mergeGuideStep ++;
        this.saveGuideData();
    }
    
    public showPeopleGuide():void
    {
        if( this.peopleGuideFinish == false )
        {
            this._peopleGuideShowCount ++;
            this.saveGuideData();
        }
    }
    
    private onCombinaShip():void
    {
        if(this.hasFinish == false)
        {
            this._mergeGuideStep = MergeGuideType.EndGuide;
            this.saveGuideData();
            MergeGuidePopupMgr.instance.close();
        }
    }
}