import ShipItem from "./ShipItem";
import SoundManager from "../../ctrl/SoundManager";
import MusicConfig from "../../config/MusicConfig";

export default class ShipItemDrag
{
    private _box:Laya.Box;

    private _dragIcon:Laya.Image;
    private _effctImgLeft:Laya.Image;
    private _effctImgRight:Laya.Image;

    private _inMergeing:boolean;

    public get iconBox():Laya.Box
    {
        return this._box;
    }

    public get inMergeing():boolean
    {
        return this._inMergeing;
    }

    constructor()
    {
        this._inMergeing = false;

        this._box = new Laya.Box();
        this._box.size(ShipItem.ShipItemIconWidth, ShipItem.ShipItemIconHeight);
        // this._box.anchorX = 0.5;
        // this._box.anchorY = 0.5;
        this._box.pos(-100, -100);
        this._box.mouseEnabled = false;
        this._box.mouseThrough = true;

        this._dragIcon = this.creatIconImg();
        this._dragIcon.visible = false;
        this._box.addChild(this._dragIcon);
        
        this._effctImgLeft = this.creatIconImg();
        this._effctImgLeft.visible = false;
        this._box.addChild(this._effctImgLeft);
        
        this._effctImgRight = this.creatIconImg();
        this._effctImgRight.visible = false;
        this._box.addChild(this._effctImgRight);
    }

    private creatIconImg():Laya.Image
    {
        let img = new Laya.Image();
        img.size(ShipItem.ShipItemIconWidth, ShipItem.ShipItemIconHeight);
        // img.anchorX = 0.5;
        // img.anchorY = 0.5;
        img.pos(0, 0);
        img.mouseEnabled = false;
        img.mouseThrough = true;
        return img;
    }

    private hide():void
    {
        this._inMergeing = false;

        this._dragIcon.visible = false;
        this._dragIcon.pos(0,0);

        this._effctImgLeft.visible = false;
        this._effctImgLeft.pos(0,0);
        
        this._effctImgRight.visible = false;
        this._effctImgRight.pos(0,0);
        
        this._box.pos(-100, -100);
    }

    private setBoxPos(pos:Laya.Vector2):void
    {
        this._box.pos(pos.x-0.5*ShipItem.ShipItemIconWidth, pos.y-0.5*ShipItem.ShipItemIconHeight);
    }

    public onBeginDrag(curDragItem:ShipItem, pos:Laya.Vector2):void
	{
        this._dragIcon.visible = true;
        this._dragIcon.skin = curDragItem.iconUrl;

        this.setBoxPos(pos);
	}
    
	public onDrag(pos:Laya.Vector2):void
	{
        this.setBoxPos(pos);
    }
    
	public onEndDrag(curDragItem:ShipItem, pos:Laya.Vector2):void
	{
        this._dragIcon.visible = false;
    }

    private onTw1Completed(callback:Laya.Handler):void
    {
        let twObj:any = {};
        twObj.num = 150;
        let tw2 = Laya.Tween.to(twObj,{num:0},150,Laya.Ease.circIn,Laya.Handler.create(this,function():void
        {
            Laya.Tween.clearTween(twObj);
            twObj = null;

            this.hide();
            callback.runWith(1);
        }));
        tw2.update = new Laya.Handler(this,function():void
        {
            this._effctImgLeft.x = -twObj.num;
            this._effctImgRight.x = twObj.num;
        });
    }

    public playLevelUpAni(item:ShipItem, pos:Laya.Vector2, callback:Laya.Handler):void
    {
        SoundManager.instance.playSound(MusicConfig.Merge, false);
        this._inMergeing = true;

        this._effctImgLeft.visible = true;
        this._effctImgLeft.skin = item.iconUrl;
        this._effctImgRight.visible = true;
        this._effctImgRight.skin = item.iconUrl;
        this.setBoxPos(pos);
        let twObj:any = {};
        twObj.num = 0;
        let tw1 = Laya.Tween.to(twObj,{num:150},100,Laya.Ease.circOut,Laya.Handler.create(this, function():void
        {
            Laya.Tween.clearTween(twObj);
            twObj = null;
            this.onTw1Completed(callback);
        }));      
        tw1.update = new Laya.Handler(this,function():void
        {
            this._effctImgLeft.x = -twObj.num;
            this._effctImgRight.x = twObj.num;
        });
    }
}