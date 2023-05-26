import { ui } from "./../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import { RankType } from "../model/GameModel";
    
export default class RankPopupUI extends ui.popup.RankPopupUI
{
    constructor() { 
        super(); 

        this.mouseThrough = true;
    }

    onEnable(): void 
    {
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    onDisable(): void 
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
    }

    public setType(type:RankType):void
    {
        if(type == RankType.All)
        {
            this.imgAllRank.skin = "rank/imgallrank1.png"
            this.imgFriendRank.skin = "rank/imgfirendrank0.png"
        }else if(type == RankType.Firend)
        {
            this.imgAllRank.skin = "rank/imgallrank0.png"
            this.imgFriendRank.skin = "rank/imgfirendrank1.png"
        }
    }

    private onClick(evt:Laya.Event):void
    {
        let clickTarget = evt.target;
        GameEventMgr.instance.Dispatch(GameEvent.OnRank_ClickEvent, [clickTarget]);
    }

    public showRank():void
    {
        this.openViewer.visible = false;
        Laya.timer.once(200, this, this.onShowRank);
    }
    
    private onShowRank():void
    {
        this.openViewer.visible = true;
    }
}