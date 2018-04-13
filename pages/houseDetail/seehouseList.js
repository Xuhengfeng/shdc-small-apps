const Api = require("../../utils/url");
const app = getApp();

Page({
  data:{
      day7Num: 0,//近7日带看次数
      totalSeeNum: 0, //总带看次数
      seelist: [], //带看记录
  },  
  onLoad(options) {
    this.setData({
      day7Num: options.day7Num,
      totalSeeNum: options.totalSeeNum
    })
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        wx.request({
          url: Api.IP_HOUSESEE + options.id,
          data: {
            'scity': res.data.value,
            'pageNo': 1,
          },
          method: 'GET',
          success: (res) => {
             console.log(res.data.data)
          }
        })
      }
    })
  },
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })
  }
})