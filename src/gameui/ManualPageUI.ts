import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import { DiaryType } from "../model/GameModel";
import SolarManager from "../solar/SolarManager";
import SolarData from "../solar/SolarData";
import GameJsonConfig from "../config/GameJsonConfig";
import Constants from "../model/Constants";
import ResourceConfig from "../config/ResourceConfig";
import SolarMsgItem from "./SolarMsgItem";
import SolarComment from "../model/SolarComment";
import SolarManualItem from "./SolarManualItem";
import UserData from "../data/UserData";
import CommentMgr from "../ctrl/CommentMgr";
import WxUserInfo from "../wx/WxUserInfo";
/*
* 日记界面;
*/
export default class ManualPageUI extends ui.view.ManualPageUI
{
    constructor(){
        super();
        this.init();
    }

    private _curSolarData:SolarData;
    private _solarComments:Array<SolarComment>;
    private _solarIcons:Array<number>;

    private _hasMyComment:boolean;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }   

    public get curShowSolarDiscoverIndex():number
    {
        return this._showSolarDiscoverIndex;
    }

    private init():void
    {
        this.listMsg.itemRender = SolarMsgItem;
        this.listMsg.repeatX = 1;
        this.listMsg.repeatY = 5;
        this.listMsg.spaceY = 1;
        this.listMsg.vScrollBarSkin = '';
        this.listMsg.scrollBar.elasticBackTime = 200;
        this.listMsg.scrollBar.elasticDistance = 100;
        this.listMsg.selectEnable = true;

        this.listManual.itemRender = SolarManualItem;
        this.listManual.repeatX = 4;
        this.listManual.repeatY = 4;
        this.listManual.spaceX = 2;
        this.listManual.spaceY = 2;
        this.listManual.vScrollBarSkin = '';
        this.listManual.scrollBar.elasticBackTime = 200;
        this.listManual.scrollBar.elasticDistance = 100;
        this.listManual.selectEnable = false;
    }
    
    public createWxUseInfoBtn():void
    {
        let pt = this.boxMsg.localToGlobal(new Laya.Point(this.imgCommentBg.x, this.imgCommentBg.y));
        WxUserInfo.instance.createUserInfoButton(pt.x, pt.y, this.imgCommentBg.width, this.imgCommentBg.height+10);
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.onManual_ClickEvent, [clickTarget]);
    }

    private _curType:DiaryType;
    private _showSolarDiscoverIndex:number;

    public setPage(type:DiaryType, showSolarDiscoverIndex:number):void
    {
        this._showSolarDiscoverIndex = showSolarDiscoverIndex;
        this.changeTab(type);
        this.setCommentReddot();
    }

    public changeTab(type:DiaryType):void
    {
        this._curType = type;
        this.setTab();
        this.boxGalaxyPage.visible = this._curType == DiaryType.Galaxy;
        this.boxManualPage.visible = this._curType == DiaryType.Manual;
        if(this._curType == DiaryType.Galaxy)
        {
            this.showGalaxy();
            this.showWxUserInfoBtn(true);
        }else{
            this.showManual();
            this.showWxUserInfoBtn(false);
        }
    }

    private setTab():void
    {
        if(this._curType == DiaryType.Galaxy)
        {
            this.btnTabGalaxy.skin = "manual/btnGalaxy1.png";
            this.btnTabManual.skin = "manual/btnManual0.png";
            this.btnTabGalaxy.mouseEnabled = false;
            this.btnTabManual.mouseEnabled = true;
        }else{
            this.btnTabGalaxy.skin = "manual/btnGalaxy0.png";
            this.btnTabManual.skin = "manual/btnManual1.png";
            this.btnTabGalaxy.mouseEnabled = true;
            this.btnTabManual.mouseEnabled = false;
        }
    }

    private showGalaxy():void
    {
        this._curSolarData = SolarManager.instance.getSolarDataByDiscoverIndex( this._showSolarDiscoverIndex );
        let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(this._curSolarData.index);

        this.txtArrive.value = ""+this._curSolarData.discoverSequence;
        this.imgSolarIcon.skin = this._curSolarData.iconUrl;

        this.txtSolarName.text = solarInfoCfg.solarName;
        this.txtSolarDesc.text = solarInfoCfg.solarDesc;

        this.listMsg.renderHandler = new Laya.Handler(this, this.onMsgRender);
        //星系评论配置
        let solarCommentCfg = GameJsonConfig.instance.getSolarComments(this._curSolarData.index);
        //最后一条 变成 附近的人
        this._solarComments = [];
        this._solarComments.push( solarCommentCfg.pop() );
        this._solarComments = this._solarComments.concat( solarCommentCfg );
        //检查有无 我的评论
        this._hasMyComment = false;
        let myComment = CommentMgr.instance.getMyCommentBySolarIndex( this._curSolarData.index );
        if( myComment )
        {
            this._solarComments.unshift( myComment.solarComment );  
            this._hasMyComment = true;
        }
        this.listMsg.array = this._solarComments;
        this.listMsg.scrollBar.value = 0;
    }

    private onMsgRender(solarMsgItem: SolarMsgItem, index: number):void
    {
        let info = this._solarComments[index];
        if(this._hasMyComment)
        {
            if(index == 0)
            {
                //默认玩家的评论放在第一位，但实际是最后一位，保证其他评论兼容点赞数据
                solarMsgItem.setMyInfo(10, this._curSolarData, info);
            }else{
                solarMsgItem.setInfo(index-1, this._curSolarData, info);
            }
        }
        else
        {
            solarMsgItem.setInfo(index, this._curSolarData, info);
        }
    }

    private showManual():void
    {
        this.listManual.renderHandler = new Laya.Handler(this, this.onManualRender);
        this.listManual.array = this.getSolarNumList();
        this.listManual.scrollBar.value = 0;
    }

    private getSolarNumList():Array<number>
    {
        let temp:Array<number> = [];
        for(var i=0; i<Constants.SolarNum; i++)
        {
            temp[i] = i;
        }
        return temp;
    }

    private onManualRender(solarManualItem: SolarManualItem, index: number):void
    {
        solarManualItem.setInfo(index);
    }

    public nextSolar():void
    {
        if(this._curType == DiaryType.Galaxy)
        {
            this._showSolarDiscoverIndex ++;
            this._showSolarDiscoverIndex = this._showSolarDiscoverIndex % UserData.instance.totalDiscoverIndex;
            this.showGalaxy();
        }
    }

    public prevSolar():void
    {
        if(this._curType == DiaryType.Galaxy)
        {
            this._showSolarDiscoverIndex --;
            this._showSolarDiscoverIndex += UserData.instance.totalDiscoverIndex;
            this._showSolarDiscoverIndex = this._showSolarDiscoverIndex % UserData.instance.totalDiscoverIndex;
            this.showGalaxy();
        }
    }

    public onInputConfirm(msg:string):void
    {
        let solarData = SolarManager.instance.getSolarDataByDiscoverIndex( this._showSolarDiscoverIndex );
        CommentMgr.instance.inputComment(solarData.index, msg, solarData.discoverSequence);
        //刷新
        this.showGalaxy();
    }

    public setCommentReddot():void
    {
        let unSeeNum = CommentMgr.instance.unSeeNum;
        if(unSeeNum > 0)
        {
            this.imgReddot.visible = true;
            this.txtNum.visible = true;
            this.txtNum.text = ""+unSeeNum;
        }else{
            this.imgReddot.visible = false;
            this.txtNum.visible = false;
            this.txtNum.text = ""+0; 
        }
    }

    public showWxUserInfoBtn(isShow: boolean)
    {
        if (isShow)
        {
            WxUserInfo.instance.showUserInfoButton();
        }
        else
        {
            WxUserInfo.instance.hideUserInfoButton();
        }
    }
}