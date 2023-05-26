import { Application } from "./Application"
import { Toast } from "./ui/Toast";
import { Loading } from "./ui/Loading";

// export * from "./ui/Alert";

export {
    Application
}

let app: Application;

export function bootstrap(clazz: {new(): Application}) {
    app = new clazz;
}

export function sharedApplication(): Application {
    return app;
}

export function isDebug(): boolean {
    return app.appCfg.debug;
}

export function version(): string {
    return app.appCfg.version;
}

/**
 * 显示转圈loading
 * @param text 转圈显示的内容
 * @param timeout 超过时间后会自动消失，单位：ms
 */
export function showLoading(text?: string, timeout?: number) {
    Loading.show(text, timeout);

}

/**
 * 隐藏转圈loading
 */
export function hideLoading() {
    Loading.hide();
}

export function showToast(text: string, time?: number) {
    Toast.show(text, time)
}

export function hideToast() {
    Toast.hide();
}