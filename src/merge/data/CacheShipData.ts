import { ShipBoxType } from "./MergeModel";

/*
* 已经可以掉落，但是由于位置不够等原因，等待产出的火箭
*/
export default class CacheShipData
{
    constructor()
    {
    }

    private _shipId:number;
    private _boxType:ShipBoxType;
    private _isOepn:boolean;
    private _isVideoBox:boolean;

	public init(shipId:number, boxType:ShipBoxType, isOpen:boolean=false, isVideoBox:boolean=false):void
	{
        this._shipId = shipId;
        this._boxType = boxType;
        this._isOepn = isOpen;
        this._isVideoBox = isVideoBox;
    }
    
    public get shipId():number
    {
        return this._shipId;
    }
    
    public get boxType():ShipBoxType
    {
        return this._boxType;
    }
    
    public get isOpen():boolean
    {
        return this._isOepn;
    }

    public get isVideoBox():boolean
    {
        return this._isVideoBox;
    }

}