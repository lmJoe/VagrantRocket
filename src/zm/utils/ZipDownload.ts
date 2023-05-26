// export class DownloadZipAction {
//     private complete: Laya.Handler;
//     private progress: Laya.Handler;
//     private zipurl: string;

//     private downloadTime: number;

//     private retryCnt = 0;
//     constructor(url: string, completeHandler: Laya.Handler, progressHandler?: Laya.Handler) {
//         this.zipurl = url;
//         this.complete = completeHandler;
//         this.progress = progressHandler;

//         this.doDownload();
//     }

//     private doDownload() {
//         let task = wx.downloadFile({
//             url: this.zipurl,
//             success: (res) => {
//                 this.success(res);
//             },
//             fail: () => {
//                 this.fail();
//             }
//         })

//         if (task && task.onProgressUpdate) {
//             task.onProgressUpdate(this.onProgress.bind(this));
//         } else {
//             this.downloadTime = Laya.Browser.now();
//             Laya.timer.loop(100, null, this.fakeProgress);
//         }
//     }

//     private fail() {
//         if (this.retryCnt >= 3) {
//             this.complete && this.complete.runWith(false)
//             return;
//         }
//         this.retryCnt++;
//         this.doDownload()
//     }

//     private success(res) {
//         if (res.statusCode != 200) {
//             this.fail();
//         } else if (!res.tempFilePath) {
//             this.fail();
//         } else {
//             let adpter = Laya.MiniAdpter as any;
//             adpter.removeAll(Laya.Handler.create(null, () => {
//                 wx.getFileSystemManager().unzip({
//                     zipFilePath: res.tempFilePath,
//                     targetPath: laya.wx.mini.MiniFileMgr.fileNativeDir,
//                     success: () => {
//                         this.unzipSuccess();
//                     },
//                     fail: (res) => {
//                         this.unzipFail(res);
//                     }
//                 })
//             }))
//         }
//     }

//     private unzipFail(res) {
//         if (res.errMsg && res.errMsg.indexOf('no such file or directory') > -1) {
//             this.fail()
//         } else {
//             this.complete && this.complete.runWith(false)
//         }
//     }

//     private unzipSuccess() {
//         this.progress && this.progress.runWith(1);
//         this.complete && this.complete.runWith(true)
//     }

//     private onProgress(res) {
//         this.progress && this.progress.runWith(res.progress * 0.95 / 100)
//     }

//     private fakeProgress() {
//         let now = Laya.Browser.now();
//         let t = ((now - this.downloadTime) / 1000)
//         let n = t / (t + 10)
//         this.progress && this.progress.runWith(n)
//     }
// }