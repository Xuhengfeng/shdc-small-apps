const Api = require("../../utils/url");
const utils = require("../../utils/util");
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["待看日程", "已看记录", "看房报告"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    houseList: [//房源 取消中 正常显示样式
      {isCancel: false},
      {isCancel: false},
      {isCancel: true},
      {isCancel: false}
    ],
    hasMore: false,
    showload: false,
    //待看日程 已看记录 看房报告
    IPS: [Api.IP_READYLIST, Api.IP_RENTCOLLECTIONLIST, Api.IP_COLLECTIONLIST],
  },
  onLoad() {
    //待看日程
    this.seeScheduleRequest()
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
    //this.getDataFromServer(0);
    this.seeScheduleRequest(0);
  },
  //待看日程
  seeScheduleRequest(num) {
    let params = { pageNo: 1, unicode: wx.getStorageSync("userToken")}
    utils.get(this.data.IPS[num],params)
    .then((data)=>{
      data.data.forEach((item)=>{
        item.isCancel = false
      })
      this.setData({houseList: data.data});
      console.log(data.data)
    })
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
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //请求
  getDataFromServer(num) {
    switch(num){
      case 0:;break;//请求一
      case 1:;break;//请求二
      case 2:;break;//请求三
    }
    // this.setData({ hasMore: true })
    // let params = { pageNo: 1, pageSize: 10, unicode: wx.getStorageSync("userToken").data }
    // utils.get(this.data.IPS[num], params)
    // .then((data) => {
    //   this.setData({ houseList: data.data })
    //   this.setData({ hasMore: false });
    // })
  }
});