const Api = require("../../utils/url");
const utils = require("../../utils/util");
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["待看日程", "已看记录", "看房报告"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    houseList: [],
    status: ['确认中','预约成功','已取消'],//0=确认中，1=预约成功，2=已取消
    borkerItems: [],//经纪人已看记录 
    hasMore: false,
    showload: false,
    //待看日程 已看记录 看房报告
    IPS: [Api.IP_READYLIST, Api.IP_COMPLETE, Api.IP_COLLECTIONLIST],
    num: 0,
    currentCity: '',
    page: 1,
    isShadow: false,
  },
  onLoad() {
    wx.setNavigationBarTitle({title: "待看日程"});
    //待看日程
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
    wx.getStorage({
      key: 'selectCity',
      success: (res)=>{
        this.setData({currentCity: res.data.value})
        this.seeScheduleRequest()
      }
    })
  },
  //待看日程
  seeScheduleRequest() {
    let params = { pageNo: 1,  scity: this.data.currentCity, unicode: wx.getStorageSync("userToken")}
    utils.get(Api.IP_READYLIST, params)
    .then((data)=>{
      this.setData({houseList: data.data});
    })
  },
  //经纪人已看记录
  borkerItemsRequest() {
    let params = { pageNo: 1, unicode: wx.getStorageSync("userToken")}
    utils.get(Api.IP_COMPLETE,params)
    .then((data)=>{
      data.data.forEach((item)=>{
        item.houseList.forEach((item2)=>{
          item2.houseTag = item2.houseTag.split(',');
        })
      })
      console.log(data.data)
      this.setData({borkerItems: data.data});
    })
  },
  //跳转详情
  showDetail(e) {
    let seeHouseId = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({url: `seeoneDetail?id=${seeHouseId}&status=${status}`});
  },
  //拨打电话
  call(e) {
    wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.phone});
  },
  //点击切换
  tabClick(e) {
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      num: num,
      page: 1
    });
  },
  //请求
  getDataFromServer(num) {
    switch(num){
      case 0:wx.setNavigationBarTitle({title: "待看日程"});this.seeScheduleRequest();;break;//请求一
      case 1:wx.setNavigationBarTitle({title: "已看记录"});this.borkerItemsRequest();break;//请求二
      case 2:wx.setNavigationBarTitle({title: "看房报告"});this.borkerItemsRequest();;break;//请求三
    }
  },
  //投诉弹窗
  complain(e) {
    wx.hideTabBar();
    wx.showModal({
      title: '投诉',
      content: e.currentTarget.dataset.phone,
      success: (res)=> {
        wx.showTabBar();
        if(res.confirm){
          wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.phone});
        }
      }
    })
  },
  //评价联系人
  goComment() {
    wx.navigateTo({url:'apprasieBroker'});
  },
  //添加看房备注
  addHouseRemark() {
    wx.navigateTo({url:'remark'});
  },
  //上拉
  onReachBottom() {
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(this.data.IPS[this.data.num], params)
    .then((data) => {
      this.setData({ houseList: this.data.houseList.concat(data.data) })
      this.setData({ hasMore: false });
    })
  }
});

