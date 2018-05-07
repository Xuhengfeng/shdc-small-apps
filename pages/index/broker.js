const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    brokers: []
  },
  onLoad() {
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let params = {
          "scity": res.data.value,
          "pageNo": 1
        }
        this.brokerRequest(params);
      }
    })
  
  },
  brokerRequest(params) {
    utils.post(Api.IP_BROKERSLIST,params)
    .then((data) => {
      data.data.forEach(item=>{
        if(item.emplFlag) {
          item.emplFlag = item.emplFlag.split(',')
        }
      })
      this.setData({ brokers: data.data });
    })
  },
  //返回刷新设置
  goBackSet(e) {
      let pages = getCurrentPages();//当前页面路由栈的信息
      let prevPage = pages[pages.length - 2];//上一个页面
      prevPage.setData({
        broker: e.currentTarget.dataset.item.emplName,
        brokerId: e.currentTarget.dataset.item.id,
        phcolorFlag2: false
      })
      wx.navigateBack();
  },
  //上拉
  onReachBottom() {
    let page = this.data.page++;
    let params = {
      'scity': this.data.currentCity,
      'pageNo': page
    }
    this.brokerRequest(params);
  }
})