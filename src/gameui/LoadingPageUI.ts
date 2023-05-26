import { ui } from "./../ui/layaMaxUI";
import Mathf from "../utils/Mathf";
import ZMGameConfig from "../ZMGameConfig";
import { sharedApplication } from "../zm";
import GameLayerMgr from "../scene/GameLayerMgr";
    
export default class LoadingPageUI extends ui.view.LoadingPageUI
{
    constructor() { 
        super(); 

        this.setProgress(0, false);
        this.setVersion();
        this.setBg();
    }

    private setBg():void
    {
        let bgWidth:number = GameLayerMgr.StageWidth;
        let bgHeight:number = bgWidth/720 * 1600;
        this.imgLoadingBg.size(bgWidth, bgHeight);
    }

    public setProgress(value:number, isZip:boolean):void
    {
        this.barProgress.value = value;
        this.setRocekt(value);
        this.setLoadingTxt(value, isZip);
    }

    private setRocekt(value:number):void
    {
        this.spRokect.x = Mathf.lerp(0, 450, value);
    }

    private setLoadingTxt(value:number, isZip:boolean):void
    {
        if(isZip)
        {
            this.txtLoading.text = "第一次加载，速度较慢："+Math.floor(value*100)+"%";
        }else{
            this.txtLoading.text = "解压资源中，不消耗流量："+Math.floor(value*100)+"%";
        }
    }

    public setVersion():void
    {
        let version:string = sharedApplication().appCfg.version;
        this.txtVersion.text = "版本号：" + version;
    }
    
    onEnable(): void 
    {
    }


    onDisable(): void 
    {
    }
}