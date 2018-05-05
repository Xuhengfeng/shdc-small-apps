// pages/index/hotHouse.js
const Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    houseList: [],
    page: 2,
    currentCity: null,//当前城市
    showload: false,//加载圈
    //热门小区  同小区二手房 同小区租房
    contentType: null,
    IPS: [Api.IP_HOTBUILDING,Api.IP_SAMEUSED, Api.IP_SAMEUSEDRENT],
    num: '',//切换ip
    sdid: ''
  },
  onLoad(options) {
    wx.setNavigationBarTitle({title: options.title});
    wx.getStorage({
      key: 'houseTypeSelect',
      success: (res) => {
        if(res.data == '小区二手房'||res.data == '二手房'){
          this.setData({ 
            contentType: 22,
            sdid: options.id,
            num: 1
          });
        }else if(res.data == '小区租房'||res.data == '租房') {
          this.setData({
            contentType: 33,
            sdid: options.id,
            num: 2
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

    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity: res.data.value});
        if (this.data.contentType == 11) {//热门小区
              let IP = this.data.IPS[this.data.num] + this.data.currentCity;
              let params = { 'scity': this.data.currentCity, 'pageNo': 1 };
              this.getServerData2(IP, params);
        } else {//同小区房源 小区二手房
              let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/'+ this.data.sdid;
              let params = {'scity': this.data.currentCity, 'pageNo': 1};
              this.getServerData(IP, params);
        }
      }
    })
  },
  //同小区房源 小区二手房
  getServerData(IP, params) {
    app.httpRequest(IP, params, (error, data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({houseList: this.data.houseList.concat(data.data)});
    })
  },
  //热门小区
  getServerData2(IP, params) {
    app.httpRequest(IP, params, (error, data) => {
      this.setData({ houseList: this.data.houseList.concat(data.data) });
    })
  },
  //重新请求数据
  RefreshHouseDetail(e){
    let sdid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../houseDetail/houseDetail?title=房源详情&id='+sdid
    })
  },
  //预约看房
  jumpLookHouse() {
    wx.navigateTo({
      url: "lookHouse?houseDetail=" + JSON.stringify(this.data.houseDetail)
    });
  },
  //上拉
  onReachBottom() {
    let page = this.data.page++;
    let params = {
      'scity': this.data.currentCity,
      'pageNo': page
    }
    let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/'+ this.data.sdid;
    this.getServerData(IP, params);
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  }
})