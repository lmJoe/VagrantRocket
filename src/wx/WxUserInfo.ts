export interface IWxUserInfo {
    nickName: string,
    avatarUrl: string    
}

export default class WxUserInfo
{
    private userNickName: string = null;
    private userAvatarUrl: string = null;

    // private userInfoButton: wx.UserInfoButton;
    private userInfoButton:any;

    private checkUserInfoSuccessHandler: Laya.Handler;
    private checkUserInfoFailHandler: Laya.Handler;
    private getUserInfoSuccessHandler: Laya.Handler;

    private static _instance: WxUserInfo;
    public static get instance(): WxUserInfo
    {
        if (!this._instance)
        {
            this._instance = new WxUserInfo();
        }
        return this._instance;
    }

    public getUserNickName(): string
    {
        return this.userNickName;
    }

    public getUserAvatarUrl(): string
    {
        return this.userAvatarUrl;
    }

    public hasUserInfo():boolean
    {
        return this.userNickName != null && this.userAvatarUrl != null;
    }

    public setUserInfoSuccess(handler: Laya.Handler)
    {
        this.getUserInfoSuccessHandler = handler;
    }

    public checkUserInfo(successHandler?: Laya.Handler, failHandler?: Laya.Handler)
    {
        if (window['wx'] == null)
        {
            return;
        }
        if (!wx.getSetting)
        {
            return;
        }

        if ( this.hasUserInfo() ) 
        {
            if(successHandler)
            {
                successHandler.run()
            }
            return;
        }

        this.checkUserInfoSuccessHandler = successHandler;
        this.checkUserInfoFailHandler = failHandler;
        // wx.getSetting({
        //     success: this.getUserSettingSuccess.bind(this),
        //     fail: this.getUserSettingFail.bind(this)
        // });
    }

    private getUserSettingSuccess(res)
    {
        console.log("getUserSettingSuccess:", res);
        if (res.authSetting['scope.userInfo'])
        {
            // wx.getUserInfo({
            //     withCredentials: true,
            //     success: this.getUserInfoSuccess.bind(this)
            // });
        }
        else
        {
            if (this.checkUserInfoFailHandler != null)
            {
                let handler = this.checkUserInfoFailHandler;
                this.clearCheckHandlers();
                handler.run();
            }
        }
    }

    private getUserSettingFail(res)
    {
        if (this.checkUserInfoFailHandler != null)
        {
            let handler = this.checkUserInfoFailHandler;
            this.clearCheckHandlers();
            handler.run();
        }
    }

    private getUserInfoSuccess(res)
    {
        if (res && res.userInfo)
        {
            this.setUserInfo(res.userInfo);
        }

        if (this.checkUserInfoSuccessHandler != null)
        {
            let handler = this.checkUserInfoSuccessHandler;
            this.clearCheckHandlers();
            handler.run();
        }
    }

    private clearCheckHandlers() {
        this.checkUserInfoSuccessHandler = null;
        this.checkUserInfoFailHandler = null;
    }

    private onClickUserInfoButton(res) {
        let userInfo;
        if(res && res.userInfo)
        {
            userInfo = res.userInfo;
            this.setUserInfo(userInfo);
        }

        if (this.getUserInfoSuccessHandler != null)
        {
            let handler = this.getUserInfoSuccessHandler;
            this.getUserInfoSuccessHandler = null;
            handler.runWith(userInfo);
        }
    }

    public setUserInfo(userInfo)
    {
        console.log("setUserInfo:", userInfo);
        if(userInfo)
        {
            this.userNickName = userInfo.nickName;
            this.userAvatarUrl = userInfo.avatarUrl;

            this.hideUserInfoButton();
        }
    }

    public createUserInfoButton(x: number, y: number, width: number, height: number)
    {
        if ( window['wx'] == null || this.hasUserInfo() ) 
        {
            return;
        }
        // console.log("createUserInfoButton");
        // let scale = wx.getSystemInfoSync().windowHeight / Laya.stage.height;
        // if (!this.userInfoButton && wx.createUserInfoButton != null)
        // {
        //     this.userInfoButton = wx.createUserInfoButton({
        //         type: 'text',
        //         text: '',
        //         style: {
        //             width: width * scale,
        //             height: height * scale,
        //             left: x * scale,
        //             top: y * scale,
        //             // backgroundColor: '#ff0000'
        //         }
        //     })
        //     this.userInfoButton.onTap(this.onClickUserInfoButton.bind(this));
        // }
        // this.userInfoButton.show();
    }

    public showUserInfoButton()
    {
        if( this.hasUserInfo() )
        {
            return;
        }
        if (this.userInfoButton == null)
        {
            return;
        }
        this.userInfoButton.show();
    }

    public hideUserInfoButton()
    {
        if (this.userInfoButton == null)
        {
            return;
        }
        this.userInfoButton.hide();
    }
}