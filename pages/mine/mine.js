const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    showLogout: false,
    nickName: null,
    avatarUrl: null
  },
  onLoad() {
    try {
      let value = wx.getStorageSync('userInfo2');
      if (value) {
        let data = JSON.parse(value);
        this.setData({
          showLogout: data.showLogout,
          nickName: data.nickName,
          avatarUrl: data.avatarUrl
        })
      }
    } catch (e) {
      return false;
    }
  },
  //拨打电话
  telphone() {
    wx.makePhoneCall({phoneNumber: '13212361223'})
  },
  //登录
  login() {
    if(!wx.getStorageSync('userToken')) {
      wx.navigateTo({url: 'login'})
    }
  },
  //退出
  logout() {
    this.setData({
      showLogout: false,
      nickName: null,
      avatarUrl: null
    })
    wx.removeStorageSync('userToken');
    wx.removeStorageSync('userInfo2');
  },
  //跳转
  active(e) {
    let num = e.currentTarget.dataset.num;
    switch(num){
      case '1':wx.navigateTo({url:"collection"});break;//委托
      case '2':wx.navigateTo({url:"mybuyhouse?title=我的卖房&num=0"});break;//卖房
      case '3':wx.navigateTo({url:"mybuyhouse?title=我的租房&num=1"});break;//租房
      case '4':wx.navigateTo({url:"collection"});break;//收藏
      case '5':
        wx.setStorageSync('currentPage', '我的');
        wx.navigateTo({url:"../index/broker"});break;//经纪人
      case '6':wx.navigateTo({url:"comment"});break;//我的评论
      case '7':wx.navigateTo({url:"suggest"});break;//意见反馈
      case '8':wx.navigateTo({url:"../h5Pages/h5Pages?redirect=http://www.baidu.com"});break;//关于我们
    }
  }
})