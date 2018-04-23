let Api = require("../../utils/url");
let app = getApp();
Page({
  data: {
    guessYouLike: ['二手房', '租房'],
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    houseList: [],
    city: ''
  },
  onLoad(options) {
    wx.getStorage({
      key: "selectCity",
      success: (res)=> {
        let city = res.data.value;
        this.setData({ city: city})
        let IP = this.data.guessLikeIP[0] + '/' + city;
        let params = {pageNo: 1, scity: city};
        this.getDataFromServer(IP, params);
      },
    })
  },
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({ num: e.target.dataset.index })
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);
    let IP = this.data.guessLikeIP[this.data.num] + '/' + this.data.city;
    let params = {pageNo: 1,scity: this.data.city};
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    app.httpRequest(IP, params, (error, data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      let flagpc = this.data.num == 0 ? true : false;
      this.setData({ flagPrice: flagpc })
      this.setData({ houseList: data.data })
    })
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  }
})