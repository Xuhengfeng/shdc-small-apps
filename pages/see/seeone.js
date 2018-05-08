let Api = require("../../utils/url");
let app = getApp();
let filter = require("../../utils/filter.js");
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page(filter.loginCheck({
  data: {
    tabs: ["待看日程", "已看记录", "看房报告"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    houseList: [],
    hasMore: false,
    showload: false,
    IPS: [Api.IP_HOUSECOLLECTIONLIST, Api.IP_RENTCOLLECTIONLIST, Api.IP_COLLECTIONLIST]
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
    this.getDataFromServer(0);
  },
  tabClick(e) {
    console.log(e.currentTarget.dataset.index)
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getDataFromServer(num) {
    this.setData({ hasMore: true })
    let params = { pageNo: 1, pageSize: 10, unicode: wx.getStorageSync("userToken").data }
    app.httpRequest(this.data.IPS[num], params, (error, data) => {
      //修正数据
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({ houseList: data.data })
      this.setData({ hasMore: false });
    })
  }
}));