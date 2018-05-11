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
  },
  globalData: {
    userInfo: null,
    ciphertext: null
  }
})



