import Mathf from "../utils/Mathf";

/*
* 对玩家评论的点赞;
*/
export default class CommentLike
{
    private static readonly LikeMsgs:Array<string> = 
    [
        "给你的留言点了个大大的赞",
        "认真读完你的留言并给你个赞",
        "点赞你的留言并高喊666",
        "小心翼翼地在你的留言下点赞"
    ];

    private _solarId:number
    private _timemark:number;
    private _msgType:number;
    private _avatarId:number;

    constructor(solarId:number=-1)
    {
        this._solarId = solarId;
        this._timemark = Date.now();
        this._avatarId = Math.ceil( Mathf.range(100001, 104000) );
        this._msgType = Math.floor( CommentLike.LikeMsgs.length * Math.random() );
    }

    public parseData(dataStr:string):void
    {
        let data = JSON.parse( dataStr );

        this._solarId = data.solarId;
        this._timemark = data.timemark;
        this._avatarId = data.avatarId;
        this._msgType = data.msgType;
    }

    public get solarId():number
    {
        return this._solarId;
    }

    public get timemark():number
    {
        return this._timemark;
    }
    
    public get avatarId():number
    {
        return this._avatarId;
    }

    public get likeMsg():string
    {
        return CommentLike.LikeMsgs[ this._msgType ];
    }

    public get toStr():string
    {
        let data = 
        {
            "solarId": this._solarId,
            "timemark": this._timemark,
            "avatarId": this._avatarId,
            "msgType": this._msgType
        };
        return JSON.stringify( data );
    }
}