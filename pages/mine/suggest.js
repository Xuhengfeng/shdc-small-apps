const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    inputVal: null,
    city: null
  },
  onLoad() {
    if (!wx.getStorageSync("userToken")) wx.redirectTo({url: "/pages/mine/login"});
    utils.storage('selectCity')
    .then(res=>{
      this.setData({city: res.data.value});
    })
  },
  inputValue(e) {
    this.setData({ inputVal: e.detail.value })
  },
  commitBtn() {
    let params = {
      unicode: wx.getStorageSync("userToken"),
      content: this.data.inputVal
    }
    utils.post(Api.IP_ADVICE, params)
    .then(data=>{
      wx.navigateBack();
    })
  }
})
