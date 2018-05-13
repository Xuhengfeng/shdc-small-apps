const Api = require("../../utils/url");
const utils = require("../../utils/util");

let filter = require("../../utils/filter.js");
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page(filter.loginCheck({
  data: {
    tabs: ["二手房", "租房", "小区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    houseList: [],
    hasMore: false,
    showload: false,
    IPS: [Api.IP_HOUSECOLLECTIONLIST, Api.IP_RENTCOLLECTIONLIST, Api.IP_COLLECTIONLIST],
    num: 0,
    currentCity: null,
    page: 1,
  },
  onLoad() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value})
    })
    this.getDataFromServer(0);    
  },
  tabClick(e) {
    let num = e.currentTarget.dataset.index;
    this.getDataFromServer(num);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      num: num,
      page: 1
    });
  },
  getDataFromServer(num) {
    this.setData({hasMore: true})
    let params = {pageNo: 1,unicode: wx.getStorageSync("userToken")}
    utils.get(this.data.IPS[num], params)
    .then(data => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({houseList: data.data})
      this.setData({hasMore: false});
    })
  },
  onReachBottom() {
    this.setData({ hasMore: true })
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(this.data.IPS[this.data.num], params)
    .then(data => {
      //修正数据
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({ houseList: this.data.houseList.concat(data.data)})
      this.setData({ hasMore: false });
    })
  }
}));