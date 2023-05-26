import { ui } from "../ui/layaMaxUI";
import SkinData from "../model/SkinData";
import { SkinType } from "../model/GameModel";
import SkinManager from "../ctrl/SkinManager";

/*
* 排行榜组件;
*/
export default class SkinItem extends ui.component.SkinItemUI
{
    constructor(){
        super();
    }

    public setInfo(index:number, skinData:SkinData, isSelect:boolean, locked:boolean):void
    {
        if(skinData.skinType == SkinType.Normal)
        {
            this.imgBg.skin = "imgRes2/skin/imgItemBgNormal.png";
        }else{
            this.imgBg.skin = "imgRes2/skin/imgItemBgSpecial.png";
        }
        this.imgSkin.skin = skinData.skinIcon;
        this.imgSelectSkin.visible = isSelect;

        this.imgBg.gray = locked;
        this.imgSkin.gray = locked;
        //红点
        if(isSelect)
        {
            SkinManager.instance.selectSkinItem(skinData.headId);
            this.imgReddot.visible = false;
        }else
        {
            this.imgReddot.visible = false;
            let skinNoSelectedList = SkinManager.instance.getSkinNoSelectedList();
            for(var i=0; i<skinNoSelectedList.length; i++)
            {
                let noSelectedSkinData = skinNoSelectedList[i];
                if(noSelectedSkinData && noSelectedSkinData.headId==skinData.headId)
                {   
                    this.imgReddot.visible = true;
                }
            }
        }
    }
}