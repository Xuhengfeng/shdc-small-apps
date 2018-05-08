const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    city: [],
    houseList: [],
    // tabbar  
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    scrollLeft: 0,
  },
  onLoad(options) {
    wx.getSystemInfo({
      success: (res)=> {
          this.setData({
            winWidth: res.windowWidth,
            winHieght: res.windowHeight
          })
      }
    })
    //新房城市信息
    wx.getStorage({
      key: 'currentCity',
      success: (res)=> {
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
  //滑动切换tab
  bindChange(e) {
      let that = this;
      that.setData({currentTab: e.detail.current});
      if(e.detail.current>7){
        let a = e.detail.current;
        let query = wx.createSelectorQuery();
        query.select('.scrollBox').boundingClientRect((res)=>{
          let b = res.width;
          console.log(b)
          that.setData({scrollLeft: (a-6)*75})
        })
        query.selectViewport().scrollOffset();
        query.exec((res)=>{})
      }else{
        let a = e.detail.current;
        this.setData({scrollLeft: 0})
      }
  },
  //点击切换tab
  swichNav(e) {  
    var that = this;  
    console.log(e.target)  
    if (this.data.currentTab === e.target.dataset.current) {  
      return false;  
    } else {  
      that.setData({currentTab: e.target.dataset.current})  
    }  
  },  
})