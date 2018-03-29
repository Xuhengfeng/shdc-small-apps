var Api = require("../../utils/url");
const app = getApp();
var filter = require("../../utils/filter.js");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page(filter.loginCheck({
  data: {
    tabs: ["二手房", "租房", "小区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    twoHouseColletion: '',//二手房
    rentHouseColletion: '',//租房
    nearbyColletion: ''//小区
  },
  onLoad() {
    // 二手房
    wx.request({
      url: Api.IP_HOUSECOLLECTIONLIST,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "unique-code": wx.getStorageSync("userToken").data
      },
      success: (res) => {
        console.log(res)
        wx.hideLoading();
      }
    })

    // 租房
    wx.request({
      url: Api.IP_RENTCOLLECTIONLIST,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "unique-code": wx.getStorageSync("userToken").data
      },
      success: (res) => {
        wx.hideLoading();
      }
    })

    // 小区
    wx.request({
      url: Api.IP_COLLECTIONLIST,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      method: 'GET',
      header: {
        "Content-Type": "application/json",
        "unique-code": wx.getStorageSync("userToken").data
      },
      success: (res) => {
        wx.hideLoading();
      }
    })

    wx.getSystemInfo({
      success: (res)=> {
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        });
      }
    });
  },
  tabClick(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
}));