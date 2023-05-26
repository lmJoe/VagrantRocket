export default class Button extends Laya.Script {

    /** @prop {name:HandlerClass,tips:"点击回调类名",type:string}*/
    handlerClass: string;
    /** @prop {name:HandlerMethod,tips:"点击回调函数名",type:string} */
    handlerMethod: string;

    private downing: boolean;
    private touchDown: boolean;

    private downEffect: Laya.EffectAnimation;
    private downUIView:any ={"type":"View","props":{},"compId":2,"child":[{"type":"Sprite","props":{"y":0,"x":0,"texture":"comp/image.png"},"compId":4}],"animations":[{"nodes":[{"target":4,"keyframes":{"scaleY":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":0},{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":1},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":10}],"scaleX":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":0},{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":1},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":10}]}}],"name":"ani1","id":1,"frameRate":24,"action":0},{"nodes":[],"name":"ani2","id":2,"frameRate":24,"action":0}],"loadList":["comp/image.png"],"loadList3D":[]};

    private upEffect: Laya.EffectAnimation;
    private upUIView:any = {"type":"View","props":{},"compId":2,"child":[{"type":"Sprite","props":{},"compId":3,"child":[{"type":"Image","props":{"skin":"comp/image.png"},"compId":4}]}],"animations":[{"nodes":[{"target":4,"keyframes":{"scaleY":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":0},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":1},{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleY","index":15}],"scaleX":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":0},{"value":1.2,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":1},{"value":1,"tweenMethod":"linearNone","tween":true,"target":4,"key":"scaleX","index":15}]}}],"name":"ani1","id":1,"frameRate":24,"action":0}],"loadList":["comp/image.png"],"loadList3D":[]};

    onStart() {
        (this.owner as Laya.View).anchorX = 0.5;
        (this.owner as Laya.View).anchorY = 0.5;
        this.downEffect = new Laya.EffectAnimation;
        this.downEffect.effectData = this.downUIView;
        this.downEffect.target = this.owner;

        this.upEffect = new Laya.EffectAnimation;
        this.upEffect.effectData = this.upUIView;
        this.upEffect.target = this.owner;

        this.owner.on(Laya.Event.CLICK, this, this.hello);
    }

    onMouseDown() {
        console.log('mouse down');
        this.touchDown = true;
        this.playDown();
    }

    onMouseOut() {
        console.log('mouse out');
        if (this.touchDown) {
            this.playUp();
        }
    }

    onMouseOver() {
        console.log('mouse over');
        if (this.touchDown) {
            this.playDown();
        }
    }

    onMouseUp() {
        console.log('mouse up');
        this.playUp();
        this.touchDown = false;
    }

    onStageMouseUp() {
        console.log('stage mouse up');
        this.playUp();
        this.touchDown = false;
    }

    private playDown() {
        if (this.downing) {
            return;
        }

        this.downEffect.play(0, false);
        this.downing = true;
    }

    private playUp() {
        if (!this.downing) {
            return;
        }

        this.upEffect.play(0, false);
        this.downing = false;
    }

    private hello() {
        console.log('hello click')
    }
}