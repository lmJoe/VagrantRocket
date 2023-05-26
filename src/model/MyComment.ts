import SolarComment from "./SolarComment";

/*
* 玩家评论;
*/
export default class MyComment
{
    public readonly solarId:number
    public readonly timemark:number;
    public readonly msg:string;
    public readonly order:number;
    public readonly solarComment:SolarComment;
    private _likeNum:number;

    private _likeChcckTimeList:Array<string>;
    private _staticLikeCheckCount:number;

    constructor(solarId:number, msg:string, order:number, likeNum:number, timemark:number, likeCheckList:Array<string>, staticLikeCheckCount:number)
    {
        this.solarId = solarId;
        this.msg = msg;
        this.order = order;
        this.timemark = timemark;
        this._likeNum = likeNum;
        this._likeChcckTimeList = likeCheckList;
        this._staticLikeCheckCount = staticLikeCheckCount;

        this.solarComment = new SolarComment(
            {
                "id": -1,
                "name": "self_comment",
                "desc": msg,
                "order": order
            }
        );
    }

    public get likeNum():number
    {
        return this._likeNum;
    }

    public get staticLikeCheckCount():number
    {
        return this._staticLikeCheckCount;
    }

    public get likeCheckList():Array<string>
    {
        return this._likeChcckTimeList;
    }

    public updateLikeNum():void
    {
        this._likeNum ++;
    }

    public updateCheckList(idx:number):void
    {
        this._likeChcckTimeList.splice(idx, 1);
    }

    public updateStaticCheckCount():void
    {
        this._staticLikeCheckCount ++;
    }

    public saveStr():string
    {
        let data = 
        {
            "solarId": this.solarId,
            "msg": this.msg,
            "order": this.order,
            "timemark": this.timemark,
            "likes": this._likeNum,
            "likeCheckList": this._likeChcckTimeList,
            "staticLikeCheckCount": this._staticLikeCheckCount
        };
        return JSON.stringify( data );
    }
}