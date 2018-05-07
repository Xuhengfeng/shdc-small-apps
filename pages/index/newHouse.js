const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    city: [],
    houseList: [],
  },
  onLoad(options) {
    wx.getStorage({
      key: 'currentCity',
      success: (res)=> {
          //新房城市信息列表
          utils.get(Api.IP_NEWBUILDING + '/' + 'beihai', {
            pageNo: 1
          })
            .then((data) => {
              this.setData({ houseList: data.data });
            })
      }
    })
    //新房城市
    utils.get(Api.IP_NEWBUILDINDEX )
    .then((data) => {
      this.setData({ city: data.data });
    })
   
  },

})