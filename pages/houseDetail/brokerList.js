const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    brokers: [],
    currentCity: '',
    page: 1,
    list: [],
  },
  onLoad(options) {
    JSON.parse(options.select).forEach(item=>{
      this.data.list.push(item.sdid);
    })
    this.setData({list: this.data.list});
    utils.storage('selectCity2')
      .then(res => {
        this.setData({currentCity: res.data.value});
        this.onReachBottom();
      })
  },
  brokerRequest(params) {
    utils.post(Api.IP_HOUSEBROKERSLIST, params)
      .then(data => {
        data.data.forEach(item => {
          if (item.emplFlag) { item.emplFlag = item.emplFlag.split(',') }
        })
        this.setData({ brokers: this.data.brokers.concat(data.data) });
      })
  },
  //返回刷新设置
  goBackSet(e) {
    let broker = e.currentTarget.dataset.item.emplName;
    let brokerId = e.currentTarget.dataset.item.id;
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
      houseSdid: this.data.list
    }
    this.brokerRequest(params);
  }
})