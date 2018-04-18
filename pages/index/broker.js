let Api = require("../../utils/url");
let app = getApp();

Page({
  data: {
    brokers: []
  },
  onLoad() {
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
          app.httpRequest(Api.IP_BROKERSLIST, {
              "scity": res.data.value,
              "pageNo": 1
            }, (error, data) => {
              console.log(data)
              data.data.forEach(item=>{
                if(item.emplFlag) {
                  item.emplFlag = item.emplFlag.split(',')
                }
              })
              this.setData({ brokers: data.data });
            },'POST')
      }
    })
  
  },
  //返回刷新设置
  goBackSet(e) {
      let pages = getCurrentPages();//当前页面路由栈的信息
      let prevPage = pages[pages.length - 2];//上一个页面
      prevPage.setData({
        broker: e.currentTarget.dataset.item.emplName,
        brokerId: e.currentTarget.dataset.item.id,
        phcolorFlag2: false
      })
      wx.navigateBack();
  }
})