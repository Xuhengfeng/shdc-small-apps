const Api = require("utils/url");
App({
  onLaunch() {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: Api.weChat,
            data: {"code": res.code},
            method: 'GET',
            success: response => {
              wx.setStorageSync('ciphertext', JSON.stringify(response.data.data));
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



