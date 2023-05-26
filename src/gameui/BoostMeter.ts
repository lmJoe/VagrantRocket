import { ui } from "./../ui/layaMaxUI";
import BoostRankValue from "../boost/BoostRankValue";
import GameManager from "../ctrl/GameManager";
import SpaceshipMaster from "../ship/SpaceshipMaster";
import WorldCamera from "../camera/WorldCamera";
import Mathf from "../utils/Mathf";
import { BoostRank } from "../model/GameModel";
import Util from "../utils/Util";
import GameEventMgr from "../event/GameEventMgr";
import GameEvent from "../event/GameEvent";

/*
* 增压计;
*/
export default class BoostMeter extends ui.component.BoostMeterUI
{
    constructor()
    {
        super(); 
        this.init();
    }

    private _boostSp:Laya.Sprite;

    private _bgSp:Laya.Sprite; 
    private _prefectSp:Laya.Sprite; 
    private _paintSp:Laya.Sprite; 
    private _maskSp:Laya.Sprite;

    private _prefectRate:number;
    private _curColor:string;

    private _boostRank:BoostRank;
    private _boostCoin:number;

    private _isEnable:boolean;

    private init():void
    {

        this._boostSp = new Laya.Sprite();
        this._boostSp.size(100,100);
        this._boostSp.cacheAs = "bitmap";

        this._bgSp = new Laya.Sprite();
        this._bgSp.size(100,100);

        this._prefectSp = new Laya.Sprite();
        this._prefectSp.size(100,100);

        this._paintSp = new Laya.Sprite();
        this._paintSp.size(100,100);

        this._maskSp = new Laya.Sprite();
        this._maskSp.size(100,100);

        this._boostSp.addChild(this._bgSp);
        this._boostSp.addChild(this._paintSp);
        this._boostSp.addChild(this._prefectSp);
        this._boostSp.addChild(this._maskSp);

        this.addChild(this._boostSp);

        this.hideAllImgRank();

        this.initMeter();

        this.setEnable(false);
    }

    private initMeter():void
    {
        this._bgSp.graphics.drawCircle(50,50,50,"#2F4F4F");
        this._maskSp.graphics.drawCircle(50,50,30,"#ff0000");
        this._maskSp.blendMode = "destination-out";

        this._prefectRate = BoostRankValue.getOverPrefectRate();
        this.drawprefect(this._prefectRate);
    }

    private drawprefect(rate:number):void
    {
        this._prefectSp.visible = true;

        let angle:number = 360*rate-90;
        this._prefectSp.graphics.clear();
        this._prefectSp.graphics.drawPie(50, 50, 50, -90, angle, "#00ff00");
    }

    private draw():void
    {
        let leftRate:number = GameManager.instance.boostTimeLeft/GameManager.instance.boostTimeMax;
        leftRate = Math.max(0,leftRate);
        leftRate = Math.min(1,leftRate);

        let angle:number = 360*leftRate-90;
        this._paintSp.graphics.clear();
        
        this._curColor = this.getColor(leftRate);
        this._paintSp.graphics.drawPie(50, 50, 50, -90, angle, this._curColor);

        if(leftRate < this._prefectRate)
        {
            this.drawprefect(leftRate);
        }else{
            this.drawprefect(this._prefectRate);
        }
    }

    private getColor(leftRate:number):string
    {
        let colors = 
        [
            [255,83,43],
            [255,163,43],
            [248,255,44],
            [73,255,43]
        ];

        let num = colors.length-1;
        let newColor = [0,0,0];
        for(var i=0; i<num; i++)
        {
            let rateLimitMax = 1-(i/num);
            let rateLimitMin = 1-((i+1)/num);
            if( rateLimitMin < leftRate && leftRate <= rateLimitMax)
            {
                let defaultColor = colors[i];
                let targetColor = colors[i+1];
                let rateRange = 1/num;
                let diffRate = leftRate-rateLimitMin;
                let ttt = 1-diffRate/rateRange;
                newColor[0] = Math.floor( Mathf.lerp( defaultColor[0], targetColor[0], ttt ));
                newColor[1] = Math.floor( Mathf.lerp( defaultColor[1], targetColor[1], ttt ));
                newColor[2] = Math.floor( Mathf.lerp( defaultColor[2], targetColor[2], ttt ));
            }
        }
        let colorStr = "#"+newColor[0].toString(16)+newColor[1].toString(16)+newColor[2].toString(16);
        return colorStr;
    }

    private changePosition():void
    {
        let shipPosi:Laya.Vector3 = SpaceshipMaster.instance.rokectPosition;
        let cameraPosi:Laya.Vector3 = WorldCamera.instance.camera.transform.position;
        let screenPt:Laya.Vector3 = new Laya.Vector3(0,0,0);
        if(shipPosi.y < cameraPosi.y-5)
        {
            WorldCamera.instance.camera.worldToViewportPoint(shipPosi, screenPt);
        }
        this.x = screenPt.x - this.width - 20;
        this.y = screenPt.y;
    }

    public update():void
    {
        if(!this._isEnable){
            return;
        }
        this.changePosition();
        this.draw();
    }

    public onStartBoostRotate(totalTime:number):void
    {
    }

    public onBoost(rank:BoostRank, addCoin:number):void
    {
        this._boostRank = rank;
        this._boostCoin = addCoin;

        //圆环不震了
        // if(rank <= BoostRank.Great)
        // {
        //     this.boostMovie();
        // }
        this.imgRankMovie();
    }

    private imgRankMovie():void
    {
        this.imgRank.skin = "gameinfo/tagRank_"+this._boostRank+".png";
        this.imgRank.visible = true;
        this.imgRank.alpha = 1;
        this.imgRank.scale(1,1);
        this.imgRank.y = 130;
        this.aniRank.play(0, false);

        Laya.timer.clear(this, this.onRankMovieEnd);
        Laya.timer.once(1200, this, this.onRankMovieEnd);
    }

    private onRankMovieEnd():void
    {
        if(this._boostCoin > 0)
        {
            this.coinMovie();
        }else{
            this.onCoinMovieEnd();
        }
    }
    
    private coinMovie():void
    {
        this.boxCoin.visible = true;
        this.boxCoin.alpha = 1;
        this.boxCoin.y = -25;
        this.boxCoin.scale(1,1);
        this.txtCoin.value = Util.formatNumber(this._boostCoin);
        //加金币动画
        this.aniCoin.play(0, false);

        Laya.timer.clear(this, this.onCoinMovieEnd);
        Laya.timer.once(1200, this, this.onCoinMovieEnd);
    }
    
    private onCoinMovieEnd():void
    {
        this.hideAllImgRank();
        GameEventMgr.instance.Dispatch(GameEvent.BoostMeterMovieEnd);
    }
    
    private boostMovie():void
    {
        //颜色修改
        this._prefectSp.visible = false;
        this._boostSp.scale(1, 1);
        this._boostSp.pos(0, 0);
        //整个动画
        Laya.Tween.to(this._boostSp, {scaleX:1.3, scaleY:1.3, x:-15, y:-15}, 150, Laya.Ease.linearOut, Laya.Handler.create(this,this.onBoostMovie2));
    }

    private onBoostMovie2():void
    {
        Laya.Tween.to(this._boostSp, {scaleX:1, scaleY:1, x:0, y:0}, 150, Laya.Ease.linearOut, Laya.Handler.create(this,this.onBoostMovieEnd));
    }
    
    private onBoostMovieEnd():void
    {
        this._prefectSp.visible = true;
    }

    private hideAllImgRank():void
    {
        this.imgRank.visible = false;
        this.boxCoin.visible = false;
    }

    public setEnable(boo:boolean):void
    {
        this._isEnable = boo;
        this.visible = this._isEnable;
        if(this._isEnable){
            // this.draw();
            this.update();
        }
    }
}