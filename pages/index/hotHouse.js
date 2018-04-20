// pages/index/hotHouse.js
var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    houseList: [],
    page: 1,
    currentCity: null,//当前城市
    showload: false,//加载圈
    //热门小区  小区二手房 同小区房源
    contentType: null,
    IPS: [Api.IP_HOTBUILDING, Api.IP_HOTBUILDING, Api.IP_SAMEUSED],
    num: ''
  },
  onLoad(options) {
    wx.setNavigationBarTitle({title: options.title})

    if(options.title == '热门小区'){
      this.setData({
        contentType: 11,
        num: 0
      });
    }else if (options.title == '小区二手房') {
      this.setData({ 
        contentType: 22,
        num: 1
       });
    }else if(options.title == '同小区房源') {
      this.setData({
        contentType: 33,
        num: 2
      });
    }

    //热门小区  小区二手房
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity: res.data.value});
        //同小区房源
        if (this.data.contentType == 33) {
          let IP = this.data.IPS[this.data.num] + res.data.value+'/'+options.id
          let params = {'scity': this.data.currentCity, 'pageNo': 1}
          this.getServerData(IP, params);
        }
      }
    })
  },
  getServerData(IP, params) {
    app.httpRequest(IP, params, (error, data) => {
      this.setData({houseList: this.data.houseList.concat(data.data)});
    })
  },
  onReachBottom() {//上拉
    let page = this.data.page++;
    let params = {
      'scity': this.data.currentCity,
      'pageNo': page
    }
    this.getServerData(this.data.IPS[this.data.num], params);
  }
})