const Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    guideData: [],//购房指南
    windowHeight: null
  },
  onLoad() {
    app.httpRequest(Api.IP_INDEXCONSULT+"beihai"+"/PURCHASE_GUIDE", {}, (error, data) => {//获取主页资讯Banner
      data.data.forEach((item)=> {
        let diff = (new Date().getTime() - item.pubTime)/1000;
        let h = diff/3600;//小时
        let hours = parseInt(h);
        let m = (h - hours)*60;//分钟
        let minute = parseInt(m);
        let s = (m - minute)*60;//秒
        let second = parseInt(s);
        let day = (h/24)>0? parseInt(h/24): 0;
        if(day==0){
          item.pubTime = hours + '小时' + minute + '分' + second + '秒';
        }else{
          item.pubTime = day + '天前' + hours + '小时' + minute + '分' + second + '秒';
        }
      })
      this.setData({guideData: data.data })
      console.log(data.data)
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  onShow() {//接口调取成功的回调 生命周期
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  }
})