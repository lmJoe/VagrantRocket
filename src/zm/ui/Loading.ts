import { Loading as LoadingImg } from './Base64Image'
import { StageZOrder } from '../StageZOrder'

export class Loading {
    private static readonly rotationSpeed = 3;
    private static imageSize = 32;

    private static load: Loading;
    public static show(text?: string, tiemout = 10000) {
        if (!Loading.load) {
            Loading.load = new Loading;
        }

        Loading.load.show(text);

        Laya.timer.once(tiemout, Loading, Loading.hide);
    }

    public static hide() {
        if (!Loading.load) {
            return;
        }

        Laya.timer.clearAll(Loading);
        Loading.load.hide();
    }

    private loadImg: Laya.Image;
    private loadView: Laya.Sprite;
    private loadText: Laya.Label;
    private content: Laya.Sprite;
    private rotation = 0;

    public show(text?: string) {
        Laya.stage.addChild(this.view)
        Laya.timer.frameLoop(1, this, this.loop);

        this.content.visible = false;
        Laya.timer.once(500, this, this.showContent);

        text = text || "";
        this.loadText.text = text;
    }

    public hide() {
        this.view.removeSelf();
        Laya.timer.clearAll(this);
    }

    private showContent() {
        this.content.visible = true;
    }

    private get view(): Laya.Sprite {
        if (!this.loadView) {
            this.loadView = new Laya.Sprite;
            this.loadView.zOrder = StageZOrder.Loading;
            this.loadView.mouseEnabled = true;

            let mask = new Laya.Sprite;
            // mask.on(Laya.Event.CLICK, this, this.stopClick)
            mask.width = Laya.stage.width;
            mask.height = Laya.stage.height;
            this.loadView.addChild(mask);

            let hitArea = new Laya.HitArea;
            hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, '#000')
            mask.hitArea = hitArea;
            mask.mouseEnabled = true;
            mask.mouseThrough = false;

            this.content = new Laya.Sprite;
            let width = Laya.stage.width / 3;
            let height = width * 1.1;
            let arc = width * 0.05;
            this.content.graphics.drawPath(-width/2, -height/2 + 10, [
                ["moveTo", arc, 0], 
                ["lineTo", width - arc, 0], 
                ["arcTo", width, 0, width, arc, arc], 
                ["lineTo", width, height - arc], 
                ["arcTo", width, height, width - arc, height, arc], 
                ["lineTo", arc, height], 
                ["arcTo", 0, height, 0, height - arc, arc], 
                ["lineTo", 0, arc], 
                ["arcTo", 0, 0, arc, 0, arc], 
                ["closePath"]
            ], {fillStyle: "#000000"})

            this.content.x = Laya.stage.width / 2;
            this.content.y = Laya.stage.height / 2;
            this.content.alpha = 0.8;
            this.loadView.addChild(this.content);

            let loadImg = new Laya.Image(LoadingImg);
            loadImg.anchorX = 0.5;
            loadImg.anchorY = 0.5;
            let imageScale = width / 3 / Loading.imageSize;
            loadImg.y = -height * 0.05;
            loadImg.scale(imageScale, imageScale);
            this.content.addChild(loadImg);
            this.loadImg = loadImg;

            this.loadText = new Laya.Label();
            this.loadText.centerX = 0;
            this.loadText.centerY = height * 0.4 ;
            this.loadText.width = width * 0.9;
            this.loadText.fontSize = width * 0.1;
            this.loadText.color = '#ffffff';
            this.loadText.align = 'center';
            this.loadText.overflow = 'hidden';
            this.content.addChild(this.loadText);

        }

        return this.loadView;
    }

    private loop() {
        this.rotation += Loading.rotationSpeed;
        this.loadImg.rotation = this.rotation;
    }

    private stopClick(e: Laya.Event) {
        e.stopPropagation();
    }
}