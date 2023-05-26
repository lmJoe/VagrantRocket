import { ui } from "../ui/layaMaxUI";
import SolarData from "../solar/SolarData";
import SolarManager from "../solar/SolarManager";
import GameJsonConfig from "../config/GameJsonConfig";
/*
* 星系图鉴组件;
*/
export default class SolarManualItem extends ui.component.SolarManualItemUI
{
    constructor(){
        super();
    }

    private _index:number;

    public setInfo(index:number):void
    {
        this._index = index;
        let solarData = SolarManager.instance.getSolarDataBySolarIndex(this._index);
        if(solarData)
        {
            this.txtTime.text = solarData.discoverTimeDesc;
            this.txtTime.visible = true;
            this.imgIcon.skin = solarData.iconUrl;
            
            let solarInfoCfg = GameJsonConfig.instance.getSolarInfoConfig(solarData.index);
            this.txtName.text = solarInfoCfg.solarName;
        }
        else{
            this.txtName.text = "????";
            this.txtTime.visible = false;
            this.imgIcon.skin = "manual/imglock.png";
        }
    }

}