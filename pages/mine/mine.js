Page({
  data: {
    showLogout: false,
    nickName: null,
    avatarUrl: null
  },
  telphone() {//拨打电话
    wx.makePhoneCall({phoneNumber: '13212361223'})
  },
  login() {//登录
    if(!wx.getStorageSync('userToken')) {
      wx.navigateTo({url: 'login'})
    }
  },
  logout() {//退出
    this.setData({
      showLogout: false,
      nickName: null,
      avatarUrl: null
    })
    wx.removeStorageSync('userToken');
  }
})
