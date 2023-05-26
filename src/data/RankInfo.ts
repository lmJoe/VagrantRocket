/*
* 排行榜数据元
*/
export default class RankInfo
{
    private _openid:string;
    private _head:string;
    private _nickname:string;

    private _score:number;
    private _solarNum:number;
    private _rank:number;

    private _isSelf:boolean;

    constructor(openid:string, head:string, nickname:string, score:number, solarNum:number, rank:number, isSelf:boolean=false)
    {
        this._openid = openid;
        this._head = head;
        this._nickname = nickname;
        this._score = score;
        this._solarNum = solarNum;
        this._rank = rank;
        this._isSelf = isSelf;
    }

    public get openid():string{
        return this._openid;
    }
    public get head():string{
        return this._head || "";
    }
    public get nickname():string{
        return this._nickname;
    }
    public get score():number{
        return this._score || 0;
    }
    public get solarNum():number{
        return this._solarNum || 0;
    }
    public get rank():number{
        return this._rank || 0;
    }
    public get isSelf():boolean{
        return this._isSelf;
    }

    public toJsonStr():string
    {
        let data:any = {};

        data.OpenID = this._openid;
        data.Avatar = this._head;
        data.Name = this._nickname;
        data.Score = this._score;
        data.SolarNum = this._solarNum;
        data.Rank = this._rank;
        data.IsSelf = this._isSelf;

        return JSON.stringify(data);
    }
}