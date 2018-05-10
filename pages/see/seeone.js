let Api = require("../../utils/url");
let app = getApp();
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["待看日程", "已看记录", "看房报告"],
    isCancel: false,//取消中 正常显示样式
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
    //this.getDataFromServer(0);
  },
  //跳转详情
  showDetail() {
    wx.navigateTo({url: 'seeoneDetail'});
  },
  //拨打电话
  call() {
    wx.makePhoneCall({phoneNumber: '13212361223'})
  },
  //点击切换
  tabClick(e) {
    console.log(e.currentTarget.dataset.index)
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //请求
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
});