const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    isLoding: true,//正在为你安排经纪人
    isCancel: false,//取消中 正常显示样式
    isShadow: false,//取消对话框
    //显示对应的进度
    show3: true,
    show2: true,
    show1: true,
    itemIndex: 0,//判断是那个跳转进来的
    seeHouseDetail: ''
  
  },
  onLoad(options) {
    this.seeHouseDetailRequest(options.id);
  },
  //取消预约
  cancelOrder() {
    this.setData({isShadow: true});
  },
  //取消预约 确定
  OrderConfirm() {
    let flag = 'houseList['+this.data.itemIndex+'].isCancel';
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
        prevPage.setData({[flag]: true});
    this.setData({isCancel: true,isShadow: false});
    wx.navigateBack();
  },
  //取消预约 取消
  OrderCancel() {
    this.setData({isCancel: false,isShadow: false});
  },
  //查看房源
  seeHouse() {
    wx.navigateTo({url: 'house'});
  },
  //待看日程的详情
  seeHouseDetailRequest(id) {
    let params = {unicode: wx.getStorageSync("userToken")};
    utils.get(Api.IP_READYDETAIL+id,params)
    .then((data)=>{
      this.setData({seeHouseDetail: data.data});
      let step = data.data.procStep;
      console.log(step)
      switch(step){
        case 'SUCCESS': this.setData({show1:true,show2:false,show3:false});break;
        case 'TO_ASSIGN_BROKER': this.setData({show1:true,show2:true,show3:false});break;
        case 'TO_SCHEDULE': this.setData({show1:true,show2:true,show3:true});break;
      }
    })
  }
})