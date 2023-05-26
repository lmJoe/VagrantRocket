export function Alert(options: {
    content: string,
    confirmText?: string,
    callback?: Laya.Handler
}) {
    let win = window as any
    if (win.wx && win.wx.showModal) {
        // wx.showModal({
        //     content: options.content,
        //     confirmText: options.confirmText,
        //     showCancel: false,
        //     success(res) {
        //         if (options.callback) {
        //             options.callback.run();
        //         }
        //     }
        // })
    } else if (alert) {
        alert(options.content);
        if (options.callback) {
            options.callback.run();
        }
    }
}


export function AlertWithCancel( options: {
    content: string
    confirmText?: string
    cancelText?: string
    callback?: Laya.Handler
} ) {
    let win = window as any
    if (win.wx && win.wx.showModal) {
        // wx.showModal({
        //     content: options.content,
        //     showCancel: true,
        //     confirmText: options.confirmText,
        //     cancelText: options.cancelText,
        //     success(res) {
        //         let result;
        //         if (res.confirm) {
        //             result = true;
        //         } else if (res.cancel) {
        //             result = false;
        //         }

        //         if (options.callback) {
        //             options.callback.runWith(result);
        //         }
        //     }
        // });
    } else {
        let result = confirm(options.content);
        options.callback.runWith(result);
    }
}