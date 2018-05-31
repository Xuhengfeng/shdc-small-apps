const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
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
      scity: this.data.city,
      unicode: wx.getStorageSync("userToken"),
      content: this.data.inputVal
    }
    utils.post(Api.IP_ADVICE, params)
    .then(data=>{
      wx.navigateBack();
    })
  }
})
