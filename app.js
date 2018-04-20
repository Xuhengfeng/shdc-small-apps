App({
  httpRequest(url, params, callback,  options) {
    wx.showLoading({title: '加载中...'})
    let scity = params.scity?params.scity : null;
    let unicode = params.unicode ? params.unicode : null;
    if(!options) var options = "GET";
    delete params.unicode;
 
    wx.request({
      url: url,
      data: params,
      method: options,
      header: { 
        'Content-Type': 'application/json',
        'scity': scity,
        'unique-code':  unicode,
      },
      success: (res) => {
        if(res.statusCode == 200) {
          if(res.data.status == 0) {
            wx.showModal({
              title: res.data.msg
            })
          }
          if(res.data.data||res.data.data.length) {
             callback(null, res.data);
             wx.hideLoading()
          }
        }else if(res.statusCode == 500) {
          wx.showModal({title: '500错误'})
          wx.hideLoading()
        }
      },
      fail: (error) => {
        callback(error);
        wx.hideLoading()        
      }
    })
  },
  onLaunch() {
    wx.login({
      success: res1 => {
        if (res1.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: (res) => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
               //获取session_key和openid
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session',
                data: {
                  js_code: res1.code,
                  appid: 'wxce209331358eecd8',
                  secret: '3258f8a5649ecdbfb3f1e3c43f5b2907',
                  grant_type: 'authorization_code'
                }, 
                success: response => {
                  this.globalData.session_key = response.data.session_key;
                  this.globalData.openid = response.data.openid;
                  this.globalData.code = res1.code;
                                //获取注册code
                                wx.request({
                                  url: 'https://api.weixin.qq.com/sns/jscode2session',
                                  data: {
                                    js_code: res1.code,
                                    appid: 'wxce209331358eecd8',
                                  },
                                  success: response => {
                                    this.globalData.session_key = response.data.session_key;
                                  }
                                })
                }
              })

            }
          })
        }
      }
    })
    // //获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
         if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    session_key: null,
    openid: null,
    code: null
  }
})