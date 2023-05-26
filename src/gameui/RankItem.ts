import { ui } from "../ui/layaMaxUI";
import RankInfo from "../data/RankInfo";

/*
* 排行榜组件;
*/
export default class RankItem extends ui.component.RankItemUI
{
    constructor(){
        super();
    }

    private _info:RankInfo;
    private _index:number;
    private _isBottomSelf:boolean;

    public setInfo(info:RankInfo, index:number, isBottomSelf:boolean=false):void
    {
        this._info = info;
        this._index = index;
        this._isBottomSelf = isBottomSelf;

        this.setBg();
        this.setRank();

        this.imgHead.skin = this._info.head;
        this.txtName.text = this._info.nickname;
        this.txtSolarNum.text = ""+this._info.solarNum;
        this.txtScore.value = ""+this._info.score;
    }

    private setBg():void
    {
        if(this._isBottomSelf)
        {
            this.imgBg.skin = "wxlocal/rank/imgmyitembg.png";
        }else
        {
            let idx = this._index % 2;
            this.imgBg.skin = "wxlocal/rank/imgitembg"+idx+".png";
        }
    }

    private setRank():void
    {   
        if(this._info.rank <= 0)
        {
            this.txtRank.visible = false;
            this.imgRank.visible = false;
            this.txtNoRank.visible = true;
            this.txtNoRank.text = "未上榜";
        }
        else if(this._info.rank <= 3)
        {
            this.txtNoRank.visible = false;
            this.txtRank.visible = false;
            this.imgRank.visible = true;
            this.imgRank.skin = "wxlocal/rank/imgrank"+this._info.rank+".png";
        }else{
            this.txtNoRank.visible = false;
            this.imgRank.visible = false;
            this.txtRank.visible = true;
            this.txtRank.value = ""+this._info.rank;
        }
    }

}