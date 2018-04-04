var Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    //轮播图
    imgUrls: [{picUrl: '../../images/banner.png' }],//默认图片
    indicatorDots: false,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    hasMore: false,
    currentIndex: 0,//轮播图指示器
   
    
    purchase_guide: null,//二手房购房指南资讯
    houseUsed: null,//成交量统计
    houseList: [],//房源数据
    hotbuilding: [],//获取热门小区
    
    showload: false,
    currentCity: 'beihai', //默认城市
    myLocation: "北海",//默认地址
    

    //猜你喜欢
    pageNo: 1,//默认第1页
    flagPrice: true, //是否有价格  二手房 租房
    guessYouLike: ['二手房', '租房'],
    houseType: ['二手房', '租房'],//查看全部房源
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],

    //banner资讯   二手房指南资讯   获取成交量统计 热门小区
    IPS: [Api.IP_INDEXCONSULT, Api.IP_INDEXCONSULT, Api.IP_HOUSEUSED, Api.IP_HOTBUILDING],  
  },
  onLoad() {
    //修正 当前城市
    wx.setStorage({
      key: 'selectCity',
      data: {
        name: this.data.myLocation,
        value: this.data.currentCity
      }
    })

    //获取主页banner资讯
    app.httpRequest(this.data.IPS[0]+ this.data.currentCity +"/INDEX_BANNER", 'GET', (error, data)=> {
     this.setData({ imgUrls: data.data });
    })

    //获取主页二手房指南资讯
    app.httpRequest(this.data.IPS[1]+ this.data.currentCity +"/PURCHASE_GUIDE", 'GET', (error, data)=> {
      this.setData({purchase_guide: data.data});
    })

    //获取成交量统计
    app.httpRequest(this.data.IPS[2]+ this.data.currentCity, 'GET', (error, data)=> {
     this.setData({houseUsed: data.data});
    })

   //热门小区
    wx.request({
      url: this.data.IPS[3] + this.data.currentCity,
      data: {
        pageNo: 1,
        pageSize: 10
      },
      method: "GET",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if(res.statusCode == 200) {
          this.setData({hotbuilding: res.data.data});
        }else if(res.statusCode == 500) {
          this.setData({hotbuilding: ''});
          wx.showModal({content: '服务器异常'})
        }
      },
      fail: (error) => {
        this.setData({hotbuilding: ''})
      }
    })

    //猜你喜欢(默认二手房 首页第1页数据)
    var IP = this.data.guessLikeIP[0] + '/' + this.data.currentCity;
    this.getDataFromServer(IP, {pageNo: 1,pageSize: 10});
  },
  onSwiperTap(e) {//轮播图点击跳转
    wx.navigateTo({
      url: '../h5Pages/h5Pages?redirect=' + e.target.dataset.jump,
    })
  },
  listenSwiper(e) {//修改指示器 高亮
    this.setData({currentIndex: e.detail.current})
  },
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({num: e.target.dataset.index})
    let IP = this.data.guessLikeIP[this.data.num] + '/' + this.data.currentCity;
    let params = {
      pageNo: this.data.pageNo,
      pageSize: 10
    }
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
            //修正数据
            res.data.data.forEach((item)=> {
              item.houseTag=item.houseTag.split(',');
            })
            this.setData({
              houseList: res.data.data,
              hasMore: false,
              showload: false
            })
            this.data.num == 0 ? this.setData({ flagPrice: true }) : this.setData({ flagPrice: false });
          }else if(res.statusCode == 500||res.statusCode == 404) {
            wx.showModal({
              content: '服务器异常',
              success: (res)=> {
                this.setData({
                  houseList: '',
                  hasMore: false,
                  showload: false
                })
              }
            })
          }
        },
        fail: (error)=> {
          this.setData({
            houseList: '',
            hasMore: false,
            showload: false
          })
        }
      })
    }
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  }
})
