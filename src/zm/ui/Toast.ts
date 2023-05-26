import { StageZOrder } from '../StageZOrder'
import { ToastBg } from './Base64Image'

export class Toast {
    private static toast: Toast;
    private static readonly duration = 1500;

    public static show(text: string, time?: number) {
        if (!Toast.toast) {
            Toast.toast = new Toast;
        }

        Toast.toast.show(text, time);
    }

    public static hide() {
        if (Toast.toast) {
            Toast.toast.hide();
        }
    }

    private toastView: Laya.Sprite;
    private label: Laya.Label;
    private background: Laya.Image;

    private get view(): Laya.Sprite {
        if (!this.toastView) {
            this.toastView = new Laya.Sprite;
            this.toastView.zOrder = StageZOrder.Toast;
            this.toastView.x = Laya.stage.width * 0.5;
            this.toastView.y = Laya.stage.height * 0.5;

            this.background = new Laya.Image(ToastBg);
            this.background.sizeGrid = "30,30,30,30";
            this.background.centerX = 0;
            this.background.centerY = 0;
            this.background.height = 70;
            this.toastView.addChild(this.background);


            this.label = new Laya.Label;
            this.label.zOrder = 1;
            this.label.centerX = 0;
            this.label.centerY = 0;
            this.label.fontSize = 30;
            this.label.color = '#FFFFFF';
            this.toastView.addChild(this.label);
        }

        return this.toastView;
    }

    private set text(text: string) {
        if (text) {
            this.label.text = text.toString();
        } else {
            this.label.text = "";
        }
        let width = this.label.width + 20;
        if (width < 300) {
            width = 300;
        }

        this.background.width = width;
    }

    public show(text: string, time?: number) {
        time = time || Toast.duration;
        Laya.timer.clear(this, this.hide);
        Laya.timer.once(time, this, this.hide);

        Laya.stage.addChild(this.view);
        this.text = text;
    }

    public hide() {
        this.view.removeSelf();
        Laya.timer.clear(this, this.hide);
    }
}