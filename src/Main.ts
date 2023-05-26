import GameConfig from "./GameConfig";
import ResourceManager from "./ctrl/ResourceManager";
import GameLayerMgr from "./scene/GameLayerMgr";
import GameJsonConfig from "./config/GameJsonConfig";
import UIManager from "./ctrl/UIManager";
import LoadingPageMgr from "./gameuictrl/LoadingPageMgr";
import DataStatisticsMgr from "./ctrl/DataStatisticsMgr";
import SystemControl from "./ctrl/SystemControl";
import GameEventMgr from "./event/GameEventMgr";
import GameEvent from "./event/GameEvent";
import { Application, bootstrap } from "./zm";
import WxUserInfo from "./wx/WxUserInfo";
import NationConfig from "./config/NationConfig";

class Main extends Application
{
	constructor() 
	{
		//开始加载
		DataStatisticsMgr.instance.stat("加载开始");
		super();
	}

	protected loadLocalRes():void
	{
		ResourceManager.instance.loadLocalRes( Laya.Handler.create(this,this.onLoadLocalRes));	
	}
	
	private onLoadLocalRes():void
	{
		console.log("stage onLoadLocalRes",Laya.stage.width, Laya.stage.height);
		GameLayerMgr.initStage(Laya.stage.width, Laya.stage.height);
		//初始化
		WxUserInfo.instance.checkUserInfo();
		GameLayerMgr.instance.initLayer();
		UIManager.instance.start();
		LoadingPageMgr.instance.show();
		this.onShowLoadView();
	}

	protected onZipDownloadProgress(n: number) :void
	{
		LoadingPageMgr.instance.setZipProgress(n);
    }
	
	protected didLaunch() 
	{
		LoadingPageMgr.instance.load(Laya.Handler.create(this, this.startLoadGameRes));
	}

	private startLoadGameRes():void
	{
		console.log("stage startLoadGameRes",Laya.stage.width, Laya.stage.height);
		this.onLoadRes()
	}

	private onLoadRes():void
	{
		GameJsonConfig.instance.initConfig();
		NationConfig.init();
		LoadingPageMgr.instance.load3D(Laya.Handler.create(this,this.onComplete));
	}

    private onComplete():void
    {
		GameEventMgr.instance.Dispatch(GameEvent.onLoad3dResCompleted);
		GameEventMgr.instance.addListener(GameEvent.onLoadMovieEnd, this, this.onLoadEnd);
	}
	
	private onLoadEnd():void
	{
		console.log("onLoadEnd :",Laya.stage.width, Laya.stage.height);
		DataStatisticsMgr.instance.stat("加载完成");
		zm.statistics.sendLoaded();
		
		ResourceManager.instance.loadPrefab();
		SystemControl.instance.start();
	}
}
//激活启动类
bootstrap(Main);
