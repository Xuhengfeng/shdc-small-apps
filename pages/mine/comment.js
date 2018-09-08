// IP_BROKEREVALUATE
const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    currentCity: null,
    page: 1,
    hasMore: true,
    commentInfo: [],//经纪人评论
  },
  onLoad(options) {
    utils.storage('selectCity')
    .then((res)=>{
      this.setData({currentCity: res.data.value})
      this.onReachBottom();
    })
  },
  onReachBottom() {
    this.setData({hasMore: true});
    let params = {
      scity: this.data.currentCity,
      pageNo: this.data.page++,
      unicode: wx.getStorageSync("userToken")
    }
    utils.get(Api.IP_MYCOMMENT, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.tag = item.tag.split(',');
        }catch(err){}
      })
      this.setData({hasMore: false});      
      this.setData({commentInfo: this.data.commentInfo.concat(data.data)});
    })
  },
})