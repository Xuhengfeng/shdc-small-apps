// pages/h5Pages/h5Pages.js
Page({
  data: {
    redirect: null//重定向
  },
  onLoad(options) {
      console.log(options)
    if(options.newHouseId){
      this.setData({
        redirect: options.redirect+'?id='+options.newHouseId
      })
    } else if (options.static){
      this.setData({
        redirect: options.redirect + "?scity=" + options.scity + "&scityname=" + options.scityname
      })
    }else{
      this.setData({
        redirect: options.redirect
      })
    }
  }
})