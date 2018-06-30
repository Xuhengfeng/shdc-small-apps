// pages/h5Pages/h5Pages.js
Page({
  data: {
    redirect: null//重定向
  },
  onLoad(options) {
    if(options.newHouseId){
      this.setData({
        redirect: options.redirect+'?id='+options.newHouseId
      })
    }else{
      this.setData({
        redirect: options.redirect
      })
    }
  }
})