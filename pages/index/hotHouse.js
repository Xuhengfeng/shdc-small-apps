// pages/index/hotHouse.js
var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    houseList: [],
    //热门小区  小区二手房 同小区房源
    contentType: null,
    page: 1,
    currentCity: null,
    showload: false,//加载圈
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })

    if(options.title == '热门小区'){
      this.setData({contentType: 11});
    }else if (options.title == '小区二手房') {
      this.setData({ contentType: 22 });
    }else if(options.title == '同小区房源') {
      this.setData({contentType: 33});
    }

    //热门小区
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity: res.data.value})
        this.getServerData(1, this.data.currentCity);
      }
    })
  },
  getServerData(pageNo, currentCity) {
    this.setData({
      showload: true
    })
    setTimeout(()=>{
      wx.request({
        url: Api.IP_HOTBUILDING + currentCity,
        data: {
          pageNo: pageNo,
          pageSize: 10
        },
        method: "GET",
        header: { 'Content-Type': 'application/json' },
        success: (res) => {
          if (res.statusCode == 200) {
            if (res.data.status == 1) {
              this.setData({
                houseList: this.data.houseList.concat(res.data.data),
                showload: false
              });
            }
          } else if (res.statusCode == 500) {
            wx.showModal({content: '服务器异常'})
          }
        }
      })
    }, 1000);
  },
  onReachBottom() {//上拉
    let pageNo = this.data.page++;
    this.getServerData(pageNo, this.data.currentCity)
  }
})