var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    //轮播图
    imgUrls: [{ picUrl: '../../images/banner.png' }],
    indicatorDots: false,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    currentIndex: 0,

    label: [1,2,3,4,5], 
    scrollTop: 0,
    cityCode: null,
    tone:'rgba(249,249,249,0)',//头部渐变色值
    houseDetail: null,//房源详情
    windowHeight: '100%',
    houseList: [1,1,1,1,1],
    flagPrice: true,
    navTop: null,//菜单距离顶部位置
    mysearch: null,//search高度
  },
  onLoad(options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.title
    })
    wx.showNavigationBarLoading();
    if(options.title == '我要买房') {
      that.setData({
        label: ["区域", "户型", "价格", "面积", "类型"],
        houseDetail: options.title,
        flagPrice: false
      });
    }else if(options.title == '我要租房') {
      that.setData({
        label: ["区域", "户型", "租金", "面积"],
        houseDetail: options.title,
        flagPrice: true
      });
    }
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let ret = res.data.value ? res.data.value : res.data;
        app.httpRequest(Api.IP_INDEXCONSULT + ret + "/HOUSE_USED_BANNER", 'GET',(error, data) => {//获取主页资讯Banner
          if(data) {
            that.setData({
              imgUrls: data.data
            })
          }
          if(error) {
            wx.showModal({
              title: '提示',
              content: '服务器异常',
            })
          }
        });
        wx.hideNavigationBarLoading();
      }
    })
    this.getRect();
  },
  getRect() {
    wx.createSelectorQuery().select('#mynav').boundingClientRect((rect)=> {
      this.setData({navTop: rect.top})
    }).exec()
    wx.createSelectorQuery().select('#mysearch').boundingClientRect((rect)=> {
      this.setData({mysearch: rect.height})
    }).exec()
  },
  onPageScroll(res) {//页面滚动监听
    let percent = res.scrollTop / this.data.navTop;
    if (percent >= 0.7) percent = 1;
    let changeTone = 'rgba(249,249,249,' + percent + ')';
    this.setData({
      scrollTop: res.scrollTop,
      tone: changeTone//头部渐变色值 
    })
    if(this.data.scrollTop < (this.data.navTop - this.data.mysearch)){
      this.selectComponent("#mynav").cancelModal();//父组件调用子组件方法
    } 
  },
  listenSwiper(e) {//修改指示器 高亮
    this.setData({//显示图片当前的
      currentIndex: e.detail.current
    })
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
  },
  onMyEvent(item) {//控制nav菜单
    console.log(item)
    wx.pageScrollTo({
      scrollTop: 333,
      duration: 0
    })
    this.setData({
      tone: '#f9f9f9',
    })
  },
  cancelModal() {
    this.setData({
      scrollTop: 0
    })
  }
})