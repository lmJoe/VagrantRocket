// import Mathf from "../utils/Mathf";
// import SpaceshipMaster from "../ship/SpaceshipMaster";
// import WorldCamera from "../camera/WorldCamera";
// import DTime from "../utils/DTime";
// import ResourceManager from "../ctrl/ResourceManager";
// import SceneController from "../scene/SceneController";

// /*
// * 背景星星;
// */
// export default class BackgroundStar{
//     constructor(){
//     }

//     private readonly ScaleMinMax:Laya.Vector2 = new Laya.Vector2(1,2);
//     private readonly PoolingOffset:number = 0.9;

//     private _boundCheckTimer:number;
//     private _initShipZ:number;

//     private starLayer:Laya.Sprite3D;
//     private starList:Array<Laya.MeshSprite3D>;

//     public init():void
//     {
//         this.starLayer = new Laya.Sprite3D("bgstarlayer");
//         this.starLayer.transform.position = new Laya.Vector3(0,0,0);
//         this.starList = [];
//         this._boundCheckTimer = 0;

//         this.setStars();

//         this._initShipZ = SpaceshipMaster.instance.rokectPosition.z;
//     }

//     private setStars():void
//     {
//         let num:number = Mathf.range(100,150);
//         let zore = new Laya.Vector3(0,0,0);
//         for (var i = 0; i < num; i++) 
//         {
//             let smallStar:Laya.MeshSprite3D = ResourceManager.instance.getSmallStar();
//             this.initSmallStar(smallStar);
//             this.starList.push(smallStar);
//             this.starLayer.addChild(smallStar);
//         }

//         num = Mathf.range(5,10);
//         for (var i = 0; i < num; i++) 
//         {
//             let bigStar:Laya.MeshSprite3D = ResourceManager.instance.getBigStar();
//             this.initSmallStar(bigStar);
//             this.starList.push(bigStar);
//             this.starLayer.addChild(bigStar);
//         }
//         SceneController.instance.addBackgroundComponet(this.starLayer);

//         num = Mathf.range(5,10);
//         for (var j = 0; j < num; j++) 
//         {
//             let centerPos:Laya.Vector3 = new Laya.Vector3(0,150,50);
//             let diffPos:Laya.Vector3 = Mathf.getPointInCube(new Laya.Vector3(40,50,10));
//             let bigStar:Laya.MeshSprite3D = ResourceManager.instance.getSmallStar();
//             bigStar.transform.position = new Laya.Vector3(centerPos.x+diffPos.x, centerPos.y+diffPos.y, centerPos.z+diffPos.z);
//             SceneController.instance.addBackgroundComponet(bigStar);
//         }
//     }

//     private initSmallStar(star:Laya.MeshSprite3D):void
//     {
//         let centerPos:Laya.Vector3 = new Laya.Vector3(0,-100,150);
//         let diffPos:Laya.Vector3 = Mathf.getPointInCube(new Laya.Vector3(50,10,100));
//         star.transform.position = new Laya.Vector3(centerPos.x+diffPos.x, centerPos.y+diffPos.y, centerPos.z+diffPos.z);

//         let scaleNum:number = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
//         star.transform.localScale = new Laya.Vector3(scaleNum, scaleNum, scaleNum);
//     }
    
//     private initBigStar(star:Laya.MeshSprite3D):void
//     {
//         let centerPos:Laya.Vector3 = new Laya.Vector3(0,-100,150);
//         let diffPos:Laya.Vector3 = Mathf.getPointInCube(new Laya.Vector3(50,10,50));
//         star.transform.position = new Laya.Vector3(centerPos.x+diffPos.x, centerPos.y+diffPos.y, centerPos.z+diffPos.z);

//         let scaleNum:number = Mathf.range(this.ScaleMinMax.x, this.ScaleMinMax.y);
//         scaleNum = scaleNum*2;
//         star.transform.localScale = new Laya.Vector3(scaleNum, scaleNum, scaleNum);
//     }

// 	public update():void
// 	{
// 		if (this._boundCheckTimer < 0.5)
// 		{
// 			this._boundCheckTimer += DTime.deltaTime;
// 			return;
//         }
// 		// this._boundCheckTimer = 0;
        
//         if(this.starList && this.starList.length>0)
//         {
//             let diffZ:number = SpaceshipMaster.instance.rokectPosition.z - this._initShipZ;
//             if(diffZ != 0)
//             {
//                 this._initShipZ = SpaceshipMaster.instance.rokectPosition.z;
//                 let pos:Laya.Vector3 = this.starLayer.transform.position;
//                 pos.z += this.PoolingOffset*diffZ;
//                 this.starLayer.transform.position = pos;
//             }
//         }
// 	}
// }