const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    brokers: [],
    page: 1
  },
  onLoad() {
    utils.storage('selectCity2')
    .then((res)=>{
      let params = {"scity": res.data.value,"pageNo": 1};
      this.brokerRequest(params);
    })  
  },
  brokerRequest(params) {
    utils.post(Api.IP_BROKERSLIST,params)
    .then((data) => {
      data.data.forEach(item=>{
        if(item.emplFlag) {item.emplFlag = item.emplFlag.split(',')}
      })
      this.setData({ brokers: this.data.brokers.concat(data.data) });
    })
  },
  //返回刷新设置
  goBackSet(e) {
    let broker = e.currentTarget.dataset.item.emplName;
    let brokerId =  e.currentTarget.dataset.item.id;
    let pages = getCurrentPages();//当前页面路由栈的信息
    let prevPage = pages[pages.length - 2];//上一个页面
    prevPage.setData({
      broker: broker,
      brokerId: brokerId,
      phcolorFlag2: false
    })
    wx.navigateBack();
  },
  //上拉
  onReachBottom() {
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++
    }
    this.brokerRequest(params);
  }
})