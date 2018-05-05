App({
  httpRequest(url, params, callback,  options) {
    let title = params.title ? params.title : '加载中...';
    let scity = params.scity?params.scity : null;
    let unicode = params.unicode ? params.unicode : null;
    if(!options) var options = "GET";
    delete params.unicode;
    delete params.title;
    wx.showLoading({title: title})
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
            wx.showModal({title: res.data.msg})
          }
          if(res.data.data !== ""||res.data.data.length !== "") {
            callback(null, res.data);//成功回调
          }
        }else if(res.statusCode == 500) {
          wx.showModal({title: '500错误'})
        }
        wx.hideLoading()     
      },
      fail: (error) => {
        callback(error);//错误回调
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
              this.globalData.userInfo = res.userInfo;
              if (this.userInfoReadyCallback) { this.userInfoReadyCallback(res)};
              wx.request({
                url: "http://112.74.181.229:7031/custAppApi/member/authWeixin",
                data: {"code": res1.code},
                method: 'GET',
                success: response => {
                  wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                  wx.setStorageSync('ciphertext', JSON.stringify(response.data.data));
                }
              })
            }
          })
        }
      }
    })
    //获取用户信息
    wx.getSetting({
      success: res => {
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
    ciphertext: null
  }
})