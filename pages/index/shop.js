var Api = require("../../utils/url");
const app = getApp();

// pages/index/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: null,//获取用户输入值
    showload: false,
    shops: []
  },
  onLoad(options) {

    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
          console.log(this)
          let params = {
            keyword: this.data.keyword,
            pageNo: 1,
            pageSize: 10,
            scity: res.data.value
          }
          //门店
          this.lookShopsRequest(params);
      }
    })
  },
  telphone(e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
    })
  },
  purpose(e) {
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: (res) => {
            var accuracy = res.accuracy
            console.log(accuracy)
            wx.openLocation({
              latitude: e.target.dataset.item.py,
              longitude: e.target.dataset.item.px,
              scale: 18,
              name: e.target.dataset.item.addr,
              address: e.target.dataset.item.deptName
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

    //门店
    this.lookShopsRequest(params);
  },
  //门店
  lookShopsRequest(params) {
    wx.request({
      url: Api.IP_SHOPS,
      data: params,
      method: 'POST',
      success: (res) => {
        console.log(res.data.data)
        if (res.statusCode == 200) {
          this.setData({
            showload: false,
            shops: res.data.data
          })
          console.log(this)
          if (!res.data.data.length) {
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