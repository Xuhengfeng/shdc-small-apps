const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    houseList: [1,1,1,1,1,1],
    page: 2,
    currentCity: null,//当前城市
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: options.title });
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        this.setData({ currentCity: res.data.value });
          let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/' + this.data.sdid;
          let params = { 'scity': this.data.currentCity, 'pageNo': 1 };
          this.getServerData(IP, params);
      }
    })
  },
  getServerData(IP, params) {
    utils.get(IP, params)
    .then((data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({ houseList: this.data.houseList.concat(data.data) });
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
    let IP = this.data.IPS[this.data.num] + this.data.currentCity + '/' + this.data.sdid;
    this.getServerData(IP, params);
  }
})