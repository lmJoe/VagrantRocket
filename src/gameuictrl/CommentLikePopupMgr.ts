import { ui } from "../ui/layaMaxUI";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";
import UIManager from "../ctrl/UIManager";
import CommentMgr from "../ctrl/CommentMgr";
import CommentLikeItem from "../gameui/CommentLikeItem";

/*
* CommentLikePopupMgr;
*/
export default class CommentLikePopupMgr
{
    constructor(){
        this.init();
    }

    private static _instance:CommentLikePopupMgr;
    public static get instance():CommentLikePopupMgr
    {
        if(!this._instance)
        {
            this._instance = new CommentLikePopupMgr();
        }
        return this._instance;
    }

    private _ui:ui.popup.CommentLikePopupUI;

    private init():void
    {
        this._ui = new ui.popup.CommentLikePopupUI();
        this._ui.mouseThrough = true;

        this._ui.listLikes.itemRender = CommentLikeItem;
        this._ui.listLikes.repeatX = 1;
        this._ui.listLikes.repeatY = 5;
        this._ui.listLikes.spaceY = 1;
        this._ui.listLikes.vScrollBarSkin = '';
        this._ui.listLikes.scrollBar.elasticBackTime = 200;
        this._ui.listLikes.scrollBar.elasticDistance = 100;
    }
    
    public show():void
    {
        UIManager.instance.showPopup(this._ui);

        this.setPage();
        CommentMgr.instance.checkLikes();

        GameEventMgr.instance.addListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
    }
    
    public close():void
    {
        GameEventMgr.instance.removeListener(GameEvent.OnPopupMaskClick, this, this.onMaskClick);
        UIManager.instance.removePopup(this._ui);
    }

    private setPage():void
    {
        let commentLikeList = CommentMgr.instance.likeList;
        this._ui.listLikes.renderHandler = new Laya.Handler(this, this.onItemRender);
        this._ui.listLikes.array = commentLikeList;
        this._ui.listLikes.scrollBar.value = 0;
    }

    private onItemRender(item: CommentLikeItem, index: number):void
    {
        item.setInfo(index, CommentMgr.instance.likeList[index]);
    }

    private onMaskClick():void
    {
        this.close();
    }
}