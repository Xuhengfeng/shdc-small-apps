var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    keyword: null,//获取用户输入值
    showload: false,
    shops: []
  },
  onLoad(options) {
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
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
  //用户输入关键字
  userSearch(e) {
    this.setData({keyword: e.detail.value})
  },
  //icon点击搜索
  searchSubmit() {
    this.startsearch();
  },
  //键盘回车搜索
  startsearch() {
    if (!this.data.keyword) {
      wx.showModal({ content: '请输入关键词'})
    }else{
      this.lookShopsRequest(params);
    }
  },
  //门店
  lookShopsRequest(params) {
    app.httpRequest(Api.IP_SHOPS, params, (error, data) => {
      this.setData({shops: data.data});
    }, 'POST')
  }
 
})