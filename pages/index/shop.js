var Api = require("../../utils/url");
const app = getApp();

// pages/index/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: null,//获取用户输入值
    shops: null,//门店信息
    showload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  telphone() {//拨打电话
    wx.makePhoneCall({
      phoneNumber: '13212361223',
    })
  },
  purpose() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success:  (res)=> {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  userSearch(e) {//用户输入关键字
    this.setData({
      keyword: e.detail.value,
    })
  },
  startsearch() {//开始检索
    if (!this.data.keyword) {
      wx.showModal({
        content: '请输入关键词',
        success: (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    this.setData({
      showload: true
    })
    // /shop/shops
    wx.request({
      url: Api.IP_SHOPS,
      data: {
        keyword: this.data.keyword,
        pageNo: 1,
        pageSize: 10,
        px: 0,
        py: 0,
        scity: "beihai"
      },
      method: 'POST',
      success: (res)=> {
        if (res.statusCode == 200) {
          this.setData({
            showload: false,
            shops: res.data
          })
          if(!res.data.length) {
            wx.showModal({
              title: '提示',
              content: '暂时没有找到数据'
            })
          }
        }
      }
    })
  },
  searchSubmit() {
    this.startsearch();
  }
 
})