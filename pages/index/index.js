const Api = require("../../utils/url");
const utils = require("../../utils/util");
const bmap = require("../../libs/bmap-wx.min.js");//百度地图sdk
const pinyin = require("../../libs/toPinyin.js"); //汉字转拼音

Page({
  data: {
    imgUrls: [],//轮播图
    hasMore: false,
    purchase_guide: null,//二手房购房指南资讯
    houseUsed: null,//成交量统计
    houseList: [],//房源数据
    hotbuilding: [],//获取热门小区
    currentCity: null, //默认城市
    myLocation: "",//默认地址
    pageNo: 1,//默认第1页
    flagPrice: true, //是否有价格  二手房 租房
    guessYouLike: ['二手房', '租房'],//猜你喜欢 查看全部房源
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],

    //banner资讯   二手房指南资讯   获取成交量统计 热门小区
    IPS: [Api.IP_INDEXCONSULT, Api.IP_INDEXCONSULT, Api.IP_HOUSEUSED, Api.IP_HOTBUILDING],
  },
  onLoad(){
    //定位
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {this.BMapRegeoCode(res)},
      fail: (error) => {
        wx.showModal({
          title: '警告通知',
          content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting["scope.userLocation"]) {//如果用户重新同意了授权登录
                    wx.getLocation({
                      type: 'gcj02',
                      success: (res) => {
                          this.BMapRegeoCode(res);
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //逆解析
  BMapRegeoCode(res) {
    let BMap = new bmap.BMapWX({ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'});
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      location: res.latitude + ',' + res.longitude,//这是根据之前定位出的经纬度
      success: (data) => {
              let citytoPinyin = data.originalData.result.addressComponent.city.slice(0, -1);
              let lowCase = pinyin.Pinyin.getFullChars(citytoPinyin);
              let currentCity = lowCase.toLowerCase();
              let currentCityName = data.originalData.result.addressComponent.city.slice(0, -1);
              this.setData({ myLocation: currentCityName })
              wx.setStorage({
                key: 'selectCity',
                data: {
                  name: currentCityName,
                  value: currentCity
                }
              });
              this.oneBigRequest(currentCity);
      }
    });
  },
  oneBigRequest(city) {
    //获取主页banner资讯
    utils.get(this.data.IPS[0] + city + "/INDEX_BANNER", {scity: city}).then((data) => {
      this.setData({ imgUrls: data.data });
    })
    //获取主页二手房指南资讯
    utils.get(this.data.IPS[1] + city + "/PURCHASE_GUIDE", {scity: city}).then((data) => {
      this.setData({ purchase_guide: data.data });
    })    
    //获取成交量统计
    utils.get(this.data.IPS[2] + city, {scity: city}).then((data) => {
      this.setData({ houseUsed: data.data });
    })
    //热门小区
    utils.get(this.data.IPS[3] + city, {
      pageNo: 1,
      pageSize: 10,
      scity: city
    })
    .then((data) => {
      this.setData({ hotbuilding: data.data });
    })

    //猜你喜欢(默认二手房 首页第1页数据)
    var IP = this.data.guessLikeIP[0] + '/' + city;
    this.getDataFromServer(IP, { 
      pageNo: 1,
      scity: city
    });
  },
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({ num: e.target.dataset.index })
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);
    let IP = this.data.guessLikeIP[this.data.num] + '/' + this.data.currentCity;
    let params = { pageNo: 1,scity: this.data.currentCity};
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    utils.get(IP, params)
    .then((data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      let flagpc =  this.data.num == 0 ? true : false;
      this.setData({flagPrice: flagpc})
      this.setData({houseList: data.data})
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  //活动版块1 跳转
  activity(e) {
    let num = e.currentTarget.dataset.num;
    switch(num) {
      case '1': 
        this.cacheHouseType('二手房');
        this.cacheHouseType2('二手房');
        wx.navigateTo({url: "../index/buyRentHouse"});
        break;      
      case '2': 
        this.cacheHouseType('租房');
        this.cacheHouseType2('租房');
        wx.navigateTo({url: "../index/buyRentHouse"});
        break;      
      case '3': 
        this.cacheHouseType('小区');
        wx.navigateTo({url: "../searchList/searchList"});
        break;      
      case '4':wx.navigateTo({url: "sellRent"});break;      
      case '5':wx.navigateTo({url: "shop"});break;      
    }
  },
  //活动版块2 跳转
  activity2(e) {
    let num = e.currentTarget.dataset.num;
    switch(num) {
      case '1': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;      
      case '2': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;      
      case '3': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;      
      case '4': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;      
      case '5': wx.navigateTo({url: "shop"});break;      
    }
  },
  //四张pic
  goodsHouse(e) {
    let num = e.currentTarget.dataset.num;
    switch(num) {
      case '1': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;
      case '2': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;
      case '3': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;
      case '4': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;
      case '5': wx.navigateTo({url: "../h5Pages/h5Pages?redirect=https://www.baidu.com"});break;
    }
  },
  //h5页面跳转 轮播图 数量统计 热门推荐
  h5page(e) {
    let http = e.currentTarget.dataset.http?e.currentTarget.dataset.http:"https://www.baidu.com";
    wx.navigateTo({url: "../h5Pages/h5Pages?redirect="+http});
  },
  //热门小区
  hotxiaoqu(e) {
    let http;
    this.cacheHouseType('热门小区');
    if(e.currentTarget.dataset.id){
      http = "../houseDetail/houseDetail?id="+e.currentTarget.dataset.id;
    }else{
      http = "hotHouse?title=热门小区";
    }
    wx.navigateTo({url: http});
  },
  //猜你喜欢
  guesslike(e) {
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);
    wx.navigateTo({url: "../houseDetail/houseDetail?id="+e.currentTarget.dataset.id});
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  //缓存房源类型 不可改变的
  cacheHouseType2(value) {
    wx.setStorageSync('onceHouseType', value)
  }
})
