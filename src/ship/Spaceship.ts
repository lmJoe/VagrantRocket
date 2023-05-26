import SpaceshipPod from "./SpaceshipPod";
import SpaceshipCapsuleHead from "./SpaceshipCapsuleHead";
import SpaceshipManager from "./SpaceshipManager";
import DTime from "../utils/DTime";
import UIManager from "../ctrl/UIManager";
import ResourceManager from "../ctrl/ResourceManager";
import BoostMeterManager from "../ctrl/BoostMeterManager";
import RocketLvData from "../model/RocketLvData";
import { BoostRank, BoosterType } from "../model/GameModel";
import SkinManager from "../ctrl/SkinManager";
import FPSStatistics from "../ctrl/FPSStatistics";

/*
* 飞船;
*/
export default class Spaceship{
    constructor(){
    }
    private _spaceship:Laya.MeshSprite3D;

    private _pods:Array<SpaceshipPod>;
    private _head:SpaceshipCapsuleHead;
    private _rotateSpeed:number=0;

    private _bottomNode:Laya.Transform3D;

    private _podList:Array<SpaceshipPod>;
    private _lastPod:SpaceshipPod;

    private _shipHeight:number;

    private _dropPods:Array<SpaceshipPod>;

    private _rokectCfg:RocketLvData;
    private _canRotatePod:boolean;

    public get shipObj():Laya.MeshSprite3D
    {
        return this._spaceship;
    }

    public get shipHeight():number
    {
        return this._shipHeight;
    }

    public load(cfg:RocketLvData):void
    {
        this._rokectCfg = cfg;
        this._spaceship = new Laya.MeshSprite3D();
        this._spaceship.transform.localPosition = new Laya.Vector3(0,0,0);

        this._dropPods = [];
        this._pods = [];

        if(SkinManager.instance.hasUseSkin)
        {
            this.creatCapsuleHead(SkinManager.instance.getShipHeadId());
        }else{
            this.creatCapsuleHead(this._rokectCfg.headId);
        }
        this.creatPods(this._rokectCfg.podList);

        this._bottomNode = new Laya.Transform3D(new Laya.Sprite3D("ShipBottom"));
        this._bottomNode.position = new Laya.Vector3(0,0,0);

        this.setPodCount(SpaceshipManager.instance.podsLeft);
        this.getLastPod();
        
        //初始可以每个节独自旋转
        this._canRotatePod = !FPSStatistics.instance.lowFps;
    }

    private creatCapsuleHead(headId:number):void
    {
        this._head = new SpaceshipCapsuleHead();
        this._head.load(headId);
        
        this._spaceship.addChild(this._head.pod);
        let zero = new Laya.Vector3(0,0,0);
        zero.z += this._head.podData.startPosZ;
        this._head.pod.transform.localPosition = zero;
        this._head.initHeadFxs();
        this._pods.unshift(this._head)
    }

    private creatPods(podList:Array<number>):void
    {
		let zore = new Laya.Vector3(0,0,0);
		for(var i=0; i<podList.length; i++)
		{
            let podId = podList[i];
            let pod:SpaceshipPod = new SpaceshipPod();
            pod.load(podId);
            this._spaceship.addChild(pod.pod);
            zore.z -= pod.podData.height;
            //减去上一节的偏移,头部的偏移不用减
            if(this._pods[this._pods.length-1] && i>0)
            {
                let lastPod = this._pods[this._pods.length-1];
                zore.z -= lastPod.podData.startPosZ;
            }
            pod.pod.transform.localPosition = zore.clone();
            this._pods.push(pod);
		}
    }

    private getLastPod():void
    {
        this._lastPod = this._podList[this._podList.length-1];
        this._lastPod.enable();
    }

    private changePodsPosition(changedVec3:Laya.Vector3):void
    {
        for(var i:number=0; i<this._pods.length; i++)
        {
            this._pods[i].pod.transform.translate(changedVec3);
        }
    }

    public setPodCount(num:number):void
	{
        this._shipHeight = 0;
        this._podList = [];
        for(var i:number=0; i<this._pods.length; i++)
        {
            if(i<num)
            {
                this._pods[i].setVisible(true);
                this._podList.push(this._pods[i]);
                this._shipHeight += this._pods[i].podHeight;
            }else{
                this._pods[i].setVisible(false);
            }
        }
        this._head.onFly();
        this.getBoundsCenter();
	}

    public update():void
    {
        if(this._rotateSpeed > 0)
        {
            let vec3:Laya.Vector3 = this._spaceship.transform.localRotationEuler;
            vec3.z += DTime.deltaTime * this._rotateSpeed;
            this._spaceship.transform.localRotationEuler = vec3;

            BoostMeterManager.instance.update();
        }
        this.updatePods();
    }

    public updatePods():void
    {
        //正常pod按配置旋转
        if(this._canRotatePod && this._podList && this._podList.length>0)
        {
            this._podList.forEach(pod => {
                pod.rotatePod();
            });
        }
        //掉落pod旋转飞散
        if(this._dropPods && this._dropPods.length>0)
        {
            this._dropPods.forEach(pod => {
                pod.flyAway();
            });
        }
    }

    public onFPSLow():void
    {
        if(this._canRotatePod)
        {
            this._canRotatePod = !FPSStatistics.instance.lowFps;
            if(this._podList && this._podList.length>0)
            {
                this._podList.forEach(pod => {
                    pod.clearRotation();
                });
            }
        }
    }

    public onLaunch():void
	{
        this._rotateSpeed = 35;//35
        this._lastPod.launch();
    }
    
    public onLanding():void
    {
        this._lastPod.landing();
    }

    public onLand():void
	{
        this._canRotatePod = false;
        this._rotateSpeed = 0;
        this._head.onLand();
	}

    public onLastBoostUsed():void
    {
        this._head.onLastBoostUsed();
    }

    public onExplode():void
    {
        this._lastPod.explode();
    }

    public clearBoosteFx():void
    {
        this._lastPod.clearBoosteFx();
    }
    
    public usePod(rank:BoostRank, aotu:boolean):void
	{
        this._lastPod.detach();
        this._podList.pop();
        this._dropPods.push(this._lastPod);

        this.getLastPod();
        this._lastPod.booste(rank, aotu);
        this._head.showWind(rank);
    }
    
    public getBoundsCenter():Laya.Vector3
	{
        let originRotation = this._spaceship.transform.rotation.clone();
        this._spaceship.transform.rotation = Laya.Quaternion.DEFAULT.clone();
        let center:Laya.Vector3 = new Laya.Vector3(0,0,0);
        for(var i=0; i<this._podList.length; i++)
        {
            let spod:SpaceshipPod = this._podList[i];
            Laya.Vector3.add(spod.pod.transform.localPosition, center, center);
        }
        Laya.Vector3.scale(center, 1/this._podList.length, center);
        let diffVec3:Laya.Vector3 = new Laya.Vector3(0,0,0);
        Laya.Vector3.subtract( new Laya.Vector3(0,0,0), center, diffVec3);
        this.changePodsPosition(diffVec3);
        this._spaceship.transform.rotation = originRotation;
        return this._spaceship.transform.position;
	}

    public getBoundsBottom():Laya.Vector3
	{
        this.getBoundsCenter();
        let originRotation = this._spaceship.transform.rotation.clone();
        this._spaceship.transform.rotation = Laya.Quaternion.DEFAULT.clone();
        if(this._podList && this._podList[this._podList.length-1])
        {
            let bottomPod = this._podList[this._podList.length-1];
            this._bottomNode.position = bottomPod.pod.transform.position.clone();
        }
        this._spaceship.transform.rotation = originRotation;
        return this._bottomNode.position;
    }

    public changeHead(headId:number):void
    {
        if(this._head)
        {
            if(this._head.podData.boosterType==BoosterType.Single && this._head.podData.boosterId==headId)
            {
                //一个模型换皮肤
                this._head.refreshSkin();
            }else
            {
                //不同模型换皮肤
                //获取当前头部的坐标和角度
                let headLocalPosition = this._head.pod.transform.localPosition.clone();
                headLocalPosition.z -= this._head.podData.startPosZ;
                let headlocalRotationEuler = this._head.pod.transform.localRotationEuler.clone();
                //移除旧的头部
                this._head.destorySelf();
                this._pods.shift();
                //创建的头部
                this.creatCapsuleHead(headId);
                //重置头部坐标和角度
                headLocalPosition.z += this._head.podData.startPosZ
                this._head.pod.transform.localPosition = headLocalPosition;
                this._head.pod.transform.localRotationEuler = headlocalRotationEuler;
                //刷新整根火箭位置
                this.setPodCount(this._pods.length);
            }
        }
    }

    public destoryPods():void
    {
        this._podList.forEach(pod => {
            
            pod.destorySelf();
    
        });
    }
    
    public destorySelf():void
    {
        this.destoryPods();
        this._spaceship.destroy(true);
        this._spaceship = null;
    }
}