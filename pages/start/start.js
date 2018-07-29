// pages/start/start.js
Page({
  onLoad() {
      setTimeout(()=>{
        wx.switchTab({
          url: "../index/index"
        })
      },3000)
  }
})