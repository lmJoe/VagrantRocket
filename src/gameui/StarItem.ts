import { ui } from "../ui/layaMaxUI";
import StarInfo from "../model/StarInfo";
/*
* 星球百科组件;
*/
export default class StarItem extends ui.component.StarItemUI
{
    constructor(){
        super();
    }

    private _index:number;

    public setInfo(index:number, starInfo:StarInfo):void
    {
        this._index = index;
        this.imgStar.skin = starInfo.iconImg;
        this.txtStarName.text = starInfo.starName;
    }

}