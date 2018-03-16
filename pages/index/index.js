var Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    //轮播图
    imgUrls: [{picUrl:'../../images/banner.png'}],
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
    twohandhouse: [],//二手房
    guessYouLike: ['二手房', '租房'],//猜你喜欢
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    showload: false,
    scrollTop: 0, //距离顶部
    houseType: ['二手房', '租房'],//查看全部房源
    currentCity: 'beihai', //默认城市
  },
  onLoad() {
    app.httpRequest(Api.IP_INDEXCONSULT + this.data.currentCity +"/INDEX_BANNER", 'GET', (error, data)=> {//获取主页banner资讯
      if(data) this.setData({ imgUrls: data.data });
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res)=>{}
        })
        this.setData({
          hasMore: false,
          showload: false
        })
      }
    })
    app.httpRequest(Api.IP_INDEXCONSULT+ this.data.currentCity +"/PURCHASE_GUIDE", 'GET', (error, data)=> {//获取主页二手房指南资讯
      if(data) this.setData({purchase_guide: data.data});
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res) => { }
        })
        this.setData({
          hasMore: false,
          showload: false
        })
      }
    })
    app.httpRequest(Api.IP_HOUSEUSED+ this.data.currentCity, 'GET', (error, data)=> {//获取成交量统计
      if (data) this.setData({houseUsed: data.data});
      if(error) {
        wx.showModal({
          title: '提示',
          content: '服务器异常',
          success: (res) => { }
        })
        this.setData({
          hasMore: false,
          showload: false
        })
      }
    })

    var IP = this.data.guessLikeIP[0] + '/' + this.data.currentCity;//猜你喜欢(默认二手房 首页第1页数据)
    var params = {pageNo: 1, scity: this.data.currentCity};
    this.getDataFromServer(IP, params);
  },
  selectCityRequest() {
    var that = this;
    wx.getStorage({
      key: 'selectCity',
      success: function(res) {
        if(res.data.value) {
          app.httpRequest(Api.IP_INDEXCONSULT+res.data.value+"/INDEX_BANNER", 'GET', (error, data)=> {//获取主页资讯Banner
            that.setData({imgUrls: data.data})
          })
          app.httpRequest(Api.IP_HOUSEUSED+res.data.value, 'GET', (error, data)=> {//获取成交量统计
            that.setData({houseUsed: data.data})
          })
          app.httpRequest(Api.IP_RENTHOUSELIKE+res.data.value, 'POST', (error, data) => {//获取首页 猜你喜欢二手房
            that.setData({twohandhouse: data.data })
          })
        }
      }
    })
  },
  onSwiperTap(e) {//轮播图点击跳转
    var postId = e.target.dataset.id;
    wx.navigateTo({
      url: '../h5Pages/h5Pages?id='+postId,
    })
  },
  listenSwiper(e) {//修改指示器 高亮
    this.setData({currentIndex: e.detail.current})
  },
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({
      num: e.target.dataset.index,
    })
    var IP = this.data.guessLikeIP[this.data.num]+'/'+this.data.currentCity;
    var params = {
      pageNo: this.data.pageNo,
      scity: this.data.currentCity
    }
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    let that = this;
    that.setData({
      showload: true,
      hasMore: true
    })
    if(that.data.hasMore == true) {
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
              that.setData({
                twohandhouse: res.data.data,
                hasMore: false,
                showload: false
              })
            }
          }
          if(res.statusCode == 500) {
            that.setData({
              hasMore: false,
              showload: false
            })
            wx.showModal({
              title: '提示',
              content: '服务器异常',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: function(error) {
          that.setData({
            hasMore: false,
            showload: false
          })
          wx.showModal({
            title: '提示',
            content: '服务器异常',
            success: function (res) {
              if(res.confirm) {
                console.log('用户点击确定')
              }else if(res.cancel) {
                console.log('用户点击取消')
              }
            }
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
