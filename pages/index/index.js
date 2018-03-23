var Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    //轮播图
    imgUrls: [{ picUrl: '../../images/banner.png' }],//默认图片
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    loading: true,//控制loding显隐;
    hasMore: false,
    windowHeight: '100%',
    windowWidth: '100%',
    currentIndex: 0,//轮播图指示器

    //猜你喜欢
    pageNo: 1,//默认第1页
    myLocation: "北海",//默认地址
    num: 0,//猜你喜欢哪一个
    purchase_guide: null,//二手房购房指南资讯
    houseUsed: null,//成交量统计
    houseList: [],//房源数据
    hotbuilding: [],//获取热门小区
    guessYouLike: ['二手房', '租房'],//猜你喜欢
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    showload: false,
    scrollTop: 0, //距离顶部
    houseType: ['二手房', '租房'],//查看全部房源
    currentCity: 'beihai', //默认城市
    flagPrice: true //是否有价格  二手房 租房
  },
  onLoad() {
    //城市
    wx.setStorage({
      key: 'selectCity',
      data: {
        name: this.data.myLocation,
        value: this.data.currentCity
      }
    })

    //获取主页banner资讯
    app.httpRequest(Api.IP_INDEXCONSULT + this.data.currentCity +"/INDEX_BANNER", 'GET', (error, data)=> {
      console.log(data)
      if(data) this.setData({ imgUrls: data.data });
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res)=>{}
        })
      }
    })

    //获取主页二手房指南资讯
    app.httpRequest(Api.IP_INDEXCONSULT+ this.data.currentCity +"/PURCHASE_GUIDE", 'GET', (error, data)=> {
      if(data) this.setData({purchase_guide: data.data});
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res) => { }
        })
      }
    })

    //获取成交量统计
    app.httpRequest(Api.IP_HOUSEUSED+ this.data.currentCity, 'GET', (error, data)=> {
      if (data) this.setData({houseUsed: data.data});
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res) => { }
        })
      }
    })
   
   //热门小区
    wx.request({
      url: Api.IP_HOTBUILDING + this.data.currentCity,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      method: "GET",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if(res.statusCode == 200) {
          if(res.data.status == 1) {
            this.setData({ hotbuilding: res.data.data});
          }
        }else if(res.statusCode == 500) {
          wx.showModal({
            title: '提示',
            content: '服务器异常'
          })
        }
      }
    })

    //猜你喜欢(默认二手房 首页第1页数据)
    var IP = this.data.guessLikeIP[0] + '/' + this.data.currentCity;
    this.getDataFromServer(IP, {pageNo: 1});
  },
  onSwiperTap(e) {//轮播图点击跳转
    console.log(e.target.dataset.jump)
    wx.navigateTo({
      url: '../h5Pages/h5Pages?redirect=' + e.target.dataset.jump,
    })
  },
  listenSwiper(e) {//修改指示器 高亮
    this.setData({currentIndex: e.detail.current})
  },
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({num: e.target.dataset.index})
    var IP = this.data.guessLikeIP[this.data.num]+'/'+this.data.currentCity;
    var params = {pageNo: this.data.pageNo}
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    this.setData({
      showload: true,
      hasMore: true
    })
    if(this.data.hasMore == true) {
      wx.request({
        url: IP,
        data: params,
        method: "GET",
        header: {'Content-Type': 'application/json' },
        success: (res)=> {
          if(res.statusCode == 200) {
            if(res.data.status == 1) {
              res.data.data.forEach((item)=> {
                item.houseTag=item.houseTag.split(',');
              })
              this.setData({
                houseList: res.data.data,
                hasMore: false,
                showload: false
              })
              if(this.data.num == 0) {
                this.setData({flagPrice: true})
              }else{
                this.setData({flagPrice: false})
              }
            }
          }
          if(res.statusCode == 500) {
            this.setData({
              hasMore: false,
              showload: false
            })
            wx.showModal({
              title: '提示',
              content: '服务器异常'
            })
          }
        },
        fail: (error)=> {
          this.setData({
            hasMore: false,
            showload: false
          })
          wx.showModal({
            title: '提示',
            content: '服务器异常'
          })
        }
      })
    }
  },
  onShow() {//接口调取成功的回调 生命周期
    wx.getSystemInfo({
      success: (res)=> {
        console.log(res)
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  }
})
