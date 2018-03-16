const app = getApp();

Page({
  data: {
    label: ["区域", "户型", "价格", "面积", "类型"],
    houseList: [1],//房源列表
    num: null,//控制nav菜单
    modalFlag: false,
    page: 1,
    isScroll: true,//控制template的内scroll-view组件滚动开启
    showModalStatus: false,//遮罩层
    scrollTop: 0,
    togglelabel: true,
    houseDetail: null,//二手房(买房)、租房、小区
  },
  onLoad(options) {
   wx.setNavigationBarTitle({
     title: options.houseType,
   })
   if(options.houseType == '小区找房'||options.houseType == '小区') {//小区找房
    this.setData({ 
       label: ['区域', '用途', '类型', '楼龄'],
       houseDetail: options.houseType
    });
   }else if(options.houseType == '租房') {
    this.setData({
       label: ['区域', '用途', '类型', '楼龄'],
       houseDetail: options.houseType
    });
   }else if(options.houseType == '二手房') {
    this.setData({
       label: ["区域", "户型", "价格", "面积", "类型"],
       houseDetail: options.houseType
    });
   }
  },
  onShow: function() {
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

