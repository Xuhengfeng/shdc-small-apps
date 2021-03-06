const Api = require("../../utils/url");
const utils = require("../../utils/util");
const sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    tabs: ["待看日程", "已看记录", "看房报告"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    houseList: [],
    status: ['确认中','预约成功','已取消'],//0=确认中，1=预约成功，2=已取消
    borkerItems: [],//经纪人已看记录 
    report: [],//看房报告
    hasMore: false,
    showload: false,
    IPS: [Api.IP_READYLIST, Api.IP_COMPLETE, Api.IP_REPORTLIST], //待看日程 已看记录 看房报告
    num: 0,
    currentCity: '',
    page: 2,
    isShadow: false,
    islogin: false,//默认未登录
    isAuth: '未授权'
  },
  onLoad() {
    if(wx.getStorageSync("userToken")){
      this.setData({islogin: true});
    }else{
      this.setData({islogin: false});
      return;
    }
    wx.getSystemInfo({
      success: res => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    })
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.seeScheduleRequest();
    })
  },
  //授权信息
  userInfoHandle(e) {
    //拒绝授权
    if(e.detail.errMsg=='getUserInfo:fail auth deny'){
      wx.showModal({content: '授权失败'});
    }
    //同意授权
    else{
      wx.setStorage({
        key:'userInfo',
        data: JSON.stringify(e.detail.userInfo),
        success:()=>{
          this.setData({isAuth: '已授权'});
        }
      })
    }
  },
  //登录
  login() {
    if (wx.getStorageSync("userInfo")) {
      //已授权
      return wx.redirectTo({url: "/pages/mine/login"});
    }else{
      //未授权
      return wx.showModal({
        title: '注意',
        showCancel: true,
        confirmText:'好去授权',
        content: '为了您更好的体验,请先同意授权',
        success: res => { }
      }) 
    }
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
      this.setData({borkerItems: data.data});
    })
  },
  //看房报告
  seeHouseReportRequest() {
    let params = { pageNo: 1, unicode: wx.getStorageSync("userToken")};
    utils.get(Api.IP_REPORTLIST,params)
    .then(data=>{
      console.log(data)
    })
  },
  //看房报告跳转
  seeHouseReport() {
    
  },
  //跳转详情
  showDetail(e) {
    let seeHouseId = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({url: `seeoneDetail?id=${seeHouseId}&status=${status}`});
  },
  //拨打电话
  call(e) {
    if (e.currentTarget.dataset.phone) {
      wx.makePhoneCall({ phoneNumber: e.currentTarget.dataset.phone });
    } else {
      wx.showModal({content: '号码不存在'});
    }
  },
  //点击切换
  tabClick(e) {
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      num: num,
      page: 2
    });
  },
  //请求
  getDataFromServer(num) {
    switch(num){
      case 0:wx.setNavigationBarTitle({title: "待看日程"});this.seeScheduleRequest();;break;//请求一
      case 1:wx.setNavigationBarTitle({title: "已看记录"});this.borkerItemsRequest();break;//请求二
      case 2:wx.setNavigationBarTitle({title: "看房报告"});this.seeHouseReportRequest();;break;//请求三
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
  goComment(e) {
    wx.navigateTo({url:`apprasieBroker?item=${JSON.stringify(e.currentTarget.dataset.item)}`});
  },
  seeHouse(e) {
    this.cacheHouseType('二手房');
    this.cacheHouseType2('二手房');
    wx.navigateTo({url:`../houseDetail/houseDetail?id=${e.currentTarget.dataset.id}`});    
  },
  //添加看房备注
  addHouseRemark(e) {
    wx.navigateTo({url:`remark?item=${JSON.stringify(e.currentTarget.dataset.item)}`});
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
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
  wx.setStorageSync('houseTypeSelect', value)
  },
  //缓存房源类型 不可改变的
  cacheHouseType2(value) {
    wx.setStorageSync('onceHouseType', value)
  },
  //去预约
  addhouse() {
    wx.navigateTo({url: "../index/lookHouseList"});
  },
  onShow() {
    this.onLoad();
  },
  onHide() {
    //回到顶部
    wx.pageScrollTo({scrollTop: 0, duration: 0});
  }
});

