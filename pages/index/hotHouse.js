// pages/index/hotHouse.js
var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    houseList: [],
    page: 2,
    currentCity: null,//当前城市
    showload: false,//加载圈
    //热门小区  小区二手房 同小区房源
    contentType: null,
    IPS: [Api.IP_HOTBUILDING,Api.IP_SAMEUSED],
    num: '',//切换ip
    sdid: ''
  },
  onLoad(options) {
    console.log(options)
    wx.setNavigationBarTitle({title: options.title});
    wx.getStorage({
      key: 'houseTypeSelect',
      success: (res) => {
        if(res.data == '小区二手房'){
          this.setData({ 
            contentType: 22,
            sdid: options.id,
            num: 1
          });
        }else if(res.data == '小区租房') {
          this.setData({
            contentType: 33,
            sdid: options.id,
            num: 1
          });
        }else if(res.data == '同小区房源') {
          this.setData({
            contentType: 33,
            sdid: options.id,
            num: 1
          });
        }else if(res.data == '热门小区') {
          this.setData({
            contentType: 11,
            sdid: options.id,
            num: 0
          });
        }
      }
    })

    //热门小区 同小区房源 小区二手房
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity: res.data.value});
          let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/'+ this.data.sdid;
          let params = {'scity': this.data.currentCity, 'pageNo': 1};
          this.getServerData(IP, params);
      }
    })
  },
  getServerData(IP, params) {
    app.httpRequest(IP, params, (error, data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({houseList: this.data.houseList.concat(data.data)});
    })
  },
  onReachBottom() {//上拉
    let page = this.data.page++;
    let params = {
      'scity': this.data.currentCity,
      'pageNo': page
    }
    let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/'+ this.data.sdid;
    this.getServerData(IP, params);
  }
})