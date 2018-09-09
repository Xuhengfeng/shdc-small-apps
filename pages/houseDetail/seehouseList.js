const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    day7Num: 0,//近7日带看次数
    totalSeeNum: 0,//总带看次数
    seelist: [], //带看记录
    page: 1,
    currentCity: null,
    id: null
  },  
  onLoad(options) {
    this.setData({
      day7Num: options.day7Num,
      totalSeeNum: options.totalSeeNum,
      id: options.id
    })
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.pullUpLoad();
    })
  },
  seelistRequest(page) {
    let params = {scity: this.data.currentCity, pageNo: page};
    utils.get(Api.IP_HOUSESEE + this.data.id, params)
    .then(data=>{
        //刷新
        this.setData({seelist: this.data.seelist.concat(data.data)});
    })
  },
  //拨打电话
  telphone(e) {
    wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.phone});
  },
  pullUpLoad() {
    let page = this.data.page++;
    this.seelistRequest(page);
  }
})