import { ui } from "../ui/layaMaxUI";
import SolarData from "../solar/SolarData";
import SolarComment from "../model/SolarComment";
import SolarManager from "../solar/SolarManager";
import DataStatisticsMgr from "../ctrl/DataStatisticsMgr";
import CommentMgr from "../ctrl/CommentMgr";
import RobotConfig from "../config/RobotConfig";
import WxUserInfo from "../wx/WxUserInfo";
/*
* 星系评论组件;
*/
export default class SolarMsgItem extends ui.component.SolarMsgItemUI
{
    constructor(){
        super();
    }

    //机器人头像位置
    // private static readonly ZanRate:Array<number> = [0.13,0.11,0.095,0.083,0.042,0.031,0.022,0.021,0.017,0.009];    
    private static readonly ZanRate:Array<number> = [0.009,0.13,0.11,0.095,0.083,0.042,0.031,0.022,0.021,0.017];    

    private _index:number;
    private _solarData:SolarData;
    private _solarComment:SolarComment;
    private _lastZanNum:number;

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClickZan);
    }
    
    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClickZan);
    }

    public setMyInfo(index:number, solarData:SolarData, solarComment:SolarComment):void
    {
        this._index = index;
        this._solarData = solarData;
        this._solarComment = solarComment;
        //头像
        let headUrl = WxUserInfo.instance.getUserAvatarUrl();
        if(headUrl){
            this.imgMsgAvatar.skin = headUrl;
        }else{
            this.imgMsgAvatar.skin = "manual/imgAvatar.png";
        }
        //评论
        this.txtMsgName.text = "访客" + this._solarComment.order;//名字 我的信息
        this.txtMsg.text = "" + this._solarComment.desc;
        //我的点赞
        this._lastZanNum = 0
        let myComment = CommentMgr.instance.getMyCommentBySolarIndex( this._solarData.index );
        if( myComment )
        {
            this._lastZanNum = myComment.likeNum;
        }
        this.setZan();
        //
        this.txtMsgType.text = "我的留言";
    }
    
    public setInfo(index:number, solarData:SolarData, solarComment:SolarComment):void
    {
        this._index = index;
        this._solarData = solarData;
        this._solarComment = solarComment;

        //头像
        if(this._solarComment.id == 1)
        {
            this.imgMsgAvatar.skin = RobotConfig.getSpecialRobot().avatar;
        }else{
            let headNum = this._solarData.commentHeads[this._index];
            let headUrl = RobotConfig.getRobotAvatarUrl(headNum);
            if(headUrl){
                this.imgMsgAvatar.skin = headUrl;
            }else{
                this.imgMsgAvatar.skin = "manual/imgAvatar.png";
            }
        }
        //评论
        this.txtMsgName.text = "访客" + this._solarComment.order;
        this.txtMsg.text = "" + this._solarComment.desc;
        //点赞
        this._lastZanNum = Math.ceil( SolarMsgItem.ZanRate[this._index] * this._solarData.discoverSequence );
        this.setZan();
        //
        this.txtMsgType.text = index == 0 ? "附近的人" : "热门留言";
    }

    private setZan():void
    {
        let hasZan:boolean = this._solarData.hasZan(this._index);
        if(hasZan)
        {
            this.btnZan.visible = true;
            this.btnUnZan.visible = false;
            this.txtZanNum.value = "" + (this._lastZanNum+1);
        }else{
            this.btnZan.visible = false;
            this.btnUnZan.visible = true;
            this.txtZanNum.value = "" + this._lastZanNum;
        }
    }

    private onClickZan(evt:Laya.Event):void
    {
		let clickTarget = evt.target;
		if(clickTarget == this.btnUnZan)
		{
			this.tryZan();
		}
    }
    
    private tryZan():void
    {
        this._solarData.updateZan(this._index);
        SolarManager.instance.saveSolarData(this._solarData);
        this.setZan();

        DataStatisticsMgr.instance.stat("点赞",{"评论ID":this._solarComment.id.toString()});
    }
}