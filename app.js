App({
  httpRequest(url, params, callback, options) {
    wx.showLoading({
      title: '加载中...'
    })
    if(!options) {
        var options = "GET";
    }
    wx.request({
      url: url,
      data: params,
      method: options,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if(res.statusCode == 200) {
          if(res.data.status == 0) {
            wx.showModal({
              title: res.data.msg
            })
          }
          if(res.data.data) {
             callback(null, res.data);
          }
        }else if(res.statusCode == 500) {
          wx.showModal({
            title: '500错误'
          })
        }
        wx.hideLoading()
      },
      fail: (error) => {
        callback(error);
        wx.hideLoading()        
      }
    })
  },
  onLaunch() {
    //展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // //获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})