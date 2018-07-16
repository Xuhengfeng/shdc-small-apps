// pages/h5Pages/h5Pages.js
Page({
  data: {
    currentCity: null,
    redirect: null//重定向
  },
  onLoad(options) {
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        this.setData({ currentCity: res.data.value });
      }
    })
    console.log('进来了3')
    console.log(options)
    if(options.newHouseId){
      this.setData({
        redirect: options.redirect+'?id='+options.newHouseId
      })
    }else if (options.static){
      this.setData({
        redirect: options.redirect + "?scity=" + options.scity + "&scityname=" + options.scityname
      })
    }else{
      this.setData({
        redirect: options.redirect
      })
    }
  },
  message(e) {
    console.log('进来了4')
    wx.navigateTo({
      url: '',
    })
  }
})