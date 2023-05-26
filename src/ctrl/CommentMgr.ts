import MyComment from "../model/MyComment";
import GameSave from "../data/GameSave";
import Constants from "../model/Constants";
import CommentLike from "../model/CommentLike";
import Mathf from "../utils/Mathf";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* 用户评论管理;
*/
export default class CommentMgr
{
    constructor()
    {
    }

    private static _instance:CommentMgr;
    public static get instance():CommentMgr
    {
        if(!this._instance)
        {
            this._instance = new CommentMgr();
        }
        return this._instance;
    }
    private static CommentKey:string = "CommentKey";
    private static CommentLikeKey:string = "CommentLikeKey";

    private _myCommentList:Array<MyComment>;
    private _likeList:Array<CommentLike>;
    private _unSeeNum:number;

    public get likeList():Array<CommentLike>
    {
        return this._likeList;
    }

    //最新的一条点赞内容
    public get lastLike():CommentLike
    {
        if(this._likeList.length > 0)
        {
            return this._likeList[0];
        }
        return null;
    }

    public get unSeeNum():number
    {
        return this._unSeeNum;
    }

    public get hasComment():boolean
    {
        return this._myCommentList.length > 0;
    }

    public start():void
    {
        //没有被看见的点赞数量
        this._unSeeNum = 0;

        //获取本地存储的玩家评论的点赞情况
        this._likeList = [];
        let likeStr:string = GameSave.getValue(CommentMgr.CommentLikeKey);
        if(likeStr && likeStr.length>0)
        {
            let arr = likeStr.split("$");
            for(var i=0; i<arr.length; i++)
            {
                let str = arr[i];
                if(str && str.length>0)
                {
                    let commentLike = new CommentLike();
                    commentLike.parseData(str);
                    this._likeList.push(commentLike);
                }
            }
        }
        this._likeList.sort(function(aa:CommentLike, bb:CommentLike):number
        {
            return bb.timemark - aa.timemark;
        });

        this._myCommentList = [];
        //获取本地存储的玩家评论
        for(var i=0; i<Constants.SolarNum; i++)
        {
            let saveStr:string = GameSave.getValue(CommentMgr.CommentKey+i);
            if(saveStr && saveStr.length>0)
            {
                let data = JSON.parse(saveStr);
                let comment = new MyComment(data.solarId, data.msg, data.order, data.likes, data.timemark, data.likeCheckList, data.staticLikeCheckCount);
                this._myCommentList.push( comment );

                this.updateComment(comment, false);
            }
        }
        //通知离线时的点赞
        if(this._unSeeNum > 0)
        {
            GameEventMgr.instance.Dispatch(GameEvent.OnMyCommentLikeNumUpdate, [this._unSeeNum]);
            GameEventMgr.instance.Dispatch(GameEvent.OnMyCommentLikeNotice, [ this.lastLike ]);
        }
    }

    public clearComment():void
    {
        GameSave.clearValue(CommentMgr.CommentLikeKey);
        for(var i=0; i<Constants.SolarNum; i++)
        {
            GameSave.clearValue(CommentMgr.CommentKey+i);
        }
    }

    private saveComment(comment:MyComment):void
    {
        GameSave.setValue(CommentMgr.CommentKey+comment.solarId, comment.saveStr());
    }

    private saveCommentLike():void
    {
        let saveStr:string = "";
        for(var i=0; i<this._likeList.length; i++)
        {
            let like = this._likeList[i];
            saveStr += like.toStr + "$";
        }
        GameSave.setValue(CommentMgr.CommentLikeKey, saveStr);
    }

    public getMyCommentBySolarIndex(solarIndex:number):MyComment
    {
        if(this._myCommentList)
        {
            for(var i=0; i<this._myCommentList.length; i++)
            {
                let myComment = this._myCommentList[i];
                if(myComment.solarId == solarIndex)
                {
                    return myComment;
                }
            }
        }
        return null;
    }

    public checkSolarHasBeenComment(solarIndex:number):boolean
    {
        return this.getMyCommentBySolarIndex(solarIndex) != null;
    }

    public update():void
    {
        this._myCommentList.forEach(myComment => {
            this.updateComment(myComment, true);
        }); 
    }

    public updateComment(myComment:MyComment, notify:boolean):void
    {
        let nowTime = Date.now();
        //更新likes
        for(var i=myComment.likeCheckList.length-1; i>=0; i--)
        {
            //随机点赞检测
            let checkData:string = myComment.likeCheckList[i];
            let arr = checkData.split("#");
            let checkTime = parseInt( arr[0] );
            let checkRate = parseInt( arr[1] );
            if( checkTime+myComment.timemark <= nowTime )
            {
                if(Math.random()*100 <= checkRate)
                {
                    myComment.updateLikeNum();
                    this.createCommontLike(myComment, notify);
                    console.log("solar "+myComment.solarId," check list :", Math.floor(checkTime/1000), " suc");
                }else{
                    console.log("solar "+myComment.solarId," check list :", Math.floor(checkTime/1000), " fail");
                }
                myComment.updateCheckList(i);
                this.saveComment(myComment);
            }
        }
        //固定点赞检测 - 每30分钟
        if(myComment.staticLikeCheckCount >= Constants.CommentLikeStaticCheckTotalCount)
        {
            return;
        }
        let timeDiff = nowTime - myComment.timemark;
        let checkCount = Math.min( Math.floor(timeDiff / Constants.CommentLikeStaticCheckTime), Constants.CommentLikeStaticCheckTotalCount);
        let needCheckCount = checkCount - myComment.staticLikeCheckCount;
        if(needCheckCount > 0)
        {
            for(var j=0; j<needCheckCount; j++)
            {
                if(Math.random()*100 <= Constants.CommentLikeStaticCheckRate)
                {
                    myComment.updateLikeNum();
                    this.createCommontLike(myComment, notify);
                    console.log("solar "+myComment.solarId," check static :", myComment.staticLikeCheckCount+1, " suc");
                }else{
                    console.log("solar "+myComment.solarId," check static :", myComment.staticLikeCheckCount+1, " fail");
                }
                myComment.updateStaticCheckCount();
                this.saveComment(myComment);
            }
        }
    }

    private createCommontLike(myComment:MyComment, notify:boolean):void
    {
        let commentLike = new CommentLike(myComment.solarId);
        if(this._likeList.length >= 10)
        {
            this._likeList.pop();
        }
        this._likeList.unshift(commentLike);
        this.saveCommentLike();
        this._unSeeNum ++;
        //通知一个
        if(notify)
        {
            GameEventMgr.instance.Dispatch(GameEvent.OnMyCommentLikeNumUpdate, [this._unSeeNum]);
            GameEventMgr.instance.Dispatch(GameEvent.OnMyCommentLikeNotice, [commentLike]);
        }
    }

    public inputComment(solarId:number, msg:string, order:number):void
    {
        let timemark = Date.now();
        let comment = new MyComment(solarId, msg, order, 0, timemark, this.createLikeCheckList(), 0);
        this._myCommentList.push( comment );

        this.saveComment(comment);
    }

    private createLikeCheckList():Array<string>
    {
       let list:Array<string> = [];
       
    //    list[0] = Math.floor(Mathf.range(5000, 10000))+"#"+90;//5-10#90
    //    list[1] = Math.floor(Mathf.range(25000, 30000))+"#"+85;
    //    list[2] = Math.floor(Mathf.range(45000, 50000))+"#"+80;
    //    list[3] = Math.floor(Mathf.range(65000, 70000))+"#"+75;
    //    list[4] = Math.floor(Mathf.range(95000, 100000))+"#"+70;

       list[0] = Math.floor(Mathf.range(5000, 10000))+"#"+90;//5-10#90
       list[1] = Math.floor(Mathf.range(30000, 60000))+"#"+85;
       list[2] = Math.floor(Mathf.range(90000, 150000))+"#"+80;
       list[3] = Math.floor(Mathf.range(180000, 360000))+"#"+75;
       list[4] = Math.floor(Mathf.range(600000, 1200000))+"#"+70;
       return list;
    }

    public checkLikes():void
    {
        this._unSeeNum = 0;
        GameEventMgr.instance.Dispatch(GameEvent.OnMyCommentLikeNumUpdate, [this._unSeeNum]);
    }
}