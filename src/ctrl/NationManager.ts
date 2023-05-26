import DTime from "../utils/DTime";
import CommentMgr from "./CommentMgr";
import CommentNoticeMgr from "../gameuictrl/CommentNoticeMgr";
import UserData from "../data/UserData";
import NationConfig from "../config/NationConfig";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import GameSave from "../data/GameSave";
import DataStatisticsMgr from "./DataStatisticsMgr";

/*
* 游戏中国家阵营管理;
*/
export default class NationManager{
    constructor(){
    }

    private static _instance:NationManager;
    public static get instance():NationManager
    {
        if(!this._instance)
        {
            this._instance = new NationManager();
        }
        return this._instance;
    }

    private static readonly ForceShowNationKey:string = "ForceShowNationKey";
    
    private _nationConfig:NationConfig;
    private _seizeNationId:number;
    private _hasForceShowNation:boolean;
    
    public get hasSelectNation():boolean
    {
        return UserData.instance.nationId > 0;
    }
    
    public get hasForceShowNation():boolean
    {
        return this._hasForceShowNation;
    }

    public get nationConfig():NationConfig
    {
        return this._nationConfig;
    }

    public get seiznNationId():number
    {
        return this._seizeNationId;
    }

    public init():void
    {
        // GameSave.clearValue(NationManager.ForceShowNationKey);

        this.getForceShowNation();
        this.clearSeizeBonus();
        this.getNationConfig();
    }

    private getNationConfig():void
    {
        let nationId:number = UserData.instance.nationId;
        if(nationId == 0)
        {
            this._nationConfig = NationConfig.getDefaultNationConfig();
        }else
        {
            this._nationConfig = NationConfig.getNationConfig(nationId);
        }
    }

    public changeNation(nationId:number):void
    {
        if(nationId != UserData.instance.nationId)
        {
            UserData.instance.changeNation(nationId);
            this.getNationConfig();
            GameEventMgr.instance.Dispatch(GameEvent.OnNationChange);
            DataStatisticsMgr.instance.stat("选择国家阵营", {"国家":nationId.toString()});
        }
    }

    public setFlagSkin(flag:Laya.MeshSprite3D, nationId:number=0):void
    {
        if(nationId == 0)
        {
            nationId = this._nationConfig.nationId;
        }
        let nationSkin:string = NationConfig.getNationSkinByNationId(nationId);
        if(flag)
        {
            let mat:Laya.UnlitMaterial = new Laya.UnlitMaterial();
            Laya.Texture2D.load(nationSkin, Laya.Handler.create(this, function(tex:Laya.Texture2D):void
            {
                if(flag && !flag.destroyed)
                {
                    mat.albedoTexture = tex;
                    flag.meshRenderer.material = mat;
                }
            }));
        }
    }

    public seizeOtherNation(nationId:number):void
    {
        if(this._nationConfig.nationId == nationId)
        {
            return;
        }
        this._seizeNationId = nationId;
    }

    public clearSeizeBonus():void
    {
        this._seizeNationId = 0;
    }

    //是否强制显示过 国家阵营弹窗
    private getForceShowNation():void
    {
        let str:string = GameSave.getValue(NationManager.ForceShowNationKey);
        this._hasForceShowNation = str == "yes";
    }

    public setForceShowNation():void
    {
        this._hasForceShowNation = true;
        GameSave.setValue(NationManager.ForceShowNationKey, "yes");
    }

    public checkNeedForceShowNation():boolean
    {
        if( this.hasSelectNation )
        {
            return false;
        }
        if( this.hasForceShowNation )
        {
            return false;
        }
        //登陆星球次数大于等于2
        if( UserData.instance.flySucCount < 2 )
        {
            return false;
        }
        return true;
    }
}