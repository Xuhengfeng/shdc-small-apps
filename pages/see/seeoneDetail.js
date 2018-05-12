const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    isLoding: true,//正在为你安排经纪人
    isCancel: false,//取消中 正常显示样式
    isShadow: false,//取消对话框
    //显示对应的进度
    show3: false,
    show2: false,
    show1: false,
    seeHouseDetail: '',
    seeHouseId: null,
    currentCity: '',
  
  },
  onLoad(options) {
    if(options.status==2){
      this.setData({isCancel: true})
    }
    wx.getStorage({
      key: 'selectCity',
      success: (res)=>{
        this.setData({currentCity: res.data.value})
      }
    })
    this.setData({seeHouseId: options.id});
    this.seeHouseDetailRequest(options.id);
  },
  //取消预约
  cancelOrder() {
    this.setData({isShadow: true});
  },
  //取消预约 确定
  OrderConfirm() {
    let params = {
      "cancelCause": "取消",
      "id": this.data.seeHouseId,
      "unicode": wx.getStorageSync("userToken"),
      "scity": this.data.currentCity
    }
    utils.post(Api.IP_ORDERCANCEL, params)
    .then(data=>{
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
          prevPage.onLoad();
      wx.navigateBack();
    })
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