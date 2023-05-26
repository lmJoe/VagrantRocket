import { ui } from "../ui/layaMaxUI";
import CommentLike from "../model/CommentLike";
import GameJsonConfig from "../config/GameJsonConfig";
import RobotConfig from "../config/RobotConfig";
/*
* 我的点赞item;
*/
export default class CommentLikeItem extends ui.component.CommentLikeItemUI
{
    constructor(){
        super();
    }

    private _index:number;
    
    public setInfo(index:number, commentLike:CommentLike):void
    {
        this._index = index;

        //头像
        let headUrl = RobotConfig.getRobotAvatarUrl(commentLike.avatarId);
        if(headUrl){
            this.imgMsgAvatar.skin = headUrl;
        }
        //评论
        this.txtMsgName.text = RobotConfig.getRobotName(commentLike.avatarId);
        this.txtMsg.text = commentLike.likeMsg;
        //点赞信息
        let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(commentLike.solarId);
        let date = new Date(commentLike.timemark);
        let timeStr:string =date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+date.getDate(); 
        this.txtLikeTime.text = solarInfoCfg.solarName + " " + timeStr;
    }

}