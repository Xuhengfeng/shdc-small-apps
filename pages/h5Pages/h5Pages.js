const utils = require("../../utils/util");
// pages/h5Pages/h5Pages.js
Page({
  data: {
    currentCity: null,
    redirect: null//重定向
  },
  onLoad(options) {
    utils.storage('selectCity')
    .then(res=>{
       this.setData({ currentCity: res.data.value });
        //新盘资讯页面
        if(options.newHouseId){
          this.setData({
            redirect: options.redirect+'?id='+options.newHouseId+"&cityName="+this.data.currentCity+"&type=wx"
          })
        }
        //统计页面
        else if (options.static){
          this.setData({
            redirect: options.redirect + "?scity=" + options.scity + "&scityname=" + options.scityname +"&type=wx"
          })
        }
        //微信页面
        else if(options.redirect ==  'https://mp.weixin.qq.com/s'){
          this.setData({redirect: wx.getStorageSync('weiXinUrl')});
        }
        //其他页面
        else{
          console.log(options)
          this.setData({
            redirect: options.redirect +"?cityName="+this.data.currentCity+"&type=wx"
          })
        }
    })


  }
})