const Api = require("../../utils/url");
const utils = require("../../utils/util");
const bmap = require("../../libs/bmap-wx.min.js");//百度地图sdk
const pinyin = require("../../libs/toPinyin.js"); //汉字转拼音
const app = getApp();
Page({
  data: {
    imgUrls: [],//轮播图
    hasMore: false,
    purchase_guide: null,//二手房购房指南资讯
    plate: [
      {title:"独家好房",subhead:"价格优惠",imageUrl:"../../images/1.png"},
      {title:"新上好房",subhead:"一周内新上房",imageUrl:"../../images/2.png"},
      {title:"品质租房",subhead:"领包入住",imageUrl:"../../images/3.png"},
      {title:"热门好房",subhead:"热关注度房源",imageUrl:"../../images/4.png"},
    ],//四个栏目四张图片
    hotrecommend: [
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
    ],//热门推荐
    newinfohouse: [
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
      {title:'世华易居买房大放送',summary:'即日起世华易居买房大放送'},
    ],//新盘推荐
    hotbuilding: [
      {buildName:'世华易居买房大放送',avgSalePrice:0,saleCount:0,rentCount:0},
      {buildName:'世华易居买房大放送',avgSalePrice:0,saleCount:0,rentCount:0},
      {buildName:'世华易居买房大放送',avgSalePrice:0,saleCount:0,rentCount:0},
    ],//热门小区
    houseUsed: null,//成交量统计
    houseList: [],//房源数据
    currentCity: null, //默认城市
    myLocation: "",//默认地址
    pageNo: 1,//默认第1页
    flagPrice: true, //是否有价格  二手房 租房
    guessYouLike: ['二手房', '租房'],//猜你喜欢 查看全部房源
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    loadingHidden: true,
    //轮播图 二手房指南资讯 获取成交量统计 热门小区 新盘推荐 四个栏目四张图片 默认城市 所有的h5链接
    IPS: [Api.IP_INDEXCONSULT, Api.IP_INDEXCONSULT, Api.IP_HOUSEUSED, Api.IP_HOTBUILDING, Api.IP_NEWINFO, Api.IP_PLATE, Api.IP_DEFAULTCITY, Api.IP_ALLH5PAGEURL],
    allH5url: null,
  },
  onLoad(){
    //默认城市定位  
    utils.get(Api.IP_DEFAULTCITY)
    .then(data=>{
      wx.setStorage({
        key: 'selectCity',
        data: {
          name: data.data.name,
          value: data.data.value
        }
      });
      this.setData({currentCity: data.data.value});
      this.setData({myLocation: data.data.name});
      this.oneBigRequest(data.data.value);
    })
    .catch(error=>{
      //百度城市定位
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
    })

  },
  //逆解析
  BMapRegeoCode(res) {
    let BMap = new bmap.BMapWX({ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'});
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      location: res.latitude + ',' + res.longitude,//这是根据之前定位出的经纬度
      success: data => {
              let citytoPinyin = data.originalData.result.addressComponent.city.slice(0, -1);
              let lowCase = pinyin.Pinyin.getFullChars(citytoPinyin);
              let currentCity = lowCase.toLowerCase();
              let currentCityName = data.originalData.result.addressComponent.city.slice(0, -1);
              wx.setStorage({
                key: 'selectCity',
                data: {
                  name: currentCityName,
                  value: currentCity
                }
              });
              this.setData({scity: currentCity});
              this.setData({myLocation: data.data.name});
              this.oneBigRequest(currentCity);
      }
    });
  },
  oneBigRequest(city) {
    //获取主页banner资讯
    utils.get(this.data.IPS[0] + city + "/INDEX_BANNER", {scity: city})
    .then(data => {
      this.setData({ imgUrls: data.data });
    })

    //所有的H5链接
    utils.get(this.data.IPS[7] +"/APP_H5_URL",{scity: city})
    .then(data=>{
      this.setData({ allH5url: data.data });
    })

    //四个栏目四个图片
    utils.get(this.data.IPS[5] + "/INDEX_PLATE",{scity: city})
    .then(data => {
      try{
        this.setData({ plate: data.data })
      }catch(error){};
    })  
    
    //热门推荐
    utils.get(this.data.IPS[4] + "1001", {pageNo: 1,scity: city})
    .then(data => {
      if(data.data.length) this.setData({ hotrecommend: data.data });
    })

    //获取主页二手房指南资讯
    utils.get(this.data.IPS[1] + city + "/PURCHASE_GUIDE", {scity: city})
    .then(data => {
      this.setData({ purchase_guide: data.data });
    })    
    
    //获取成交量统计
    utils.get(this.data.IPS[2] + city, {scity: city}).then(data => {
      this.setData({ houseUsed: data.data });
    })
    
    //热门小区
    utils.get(this.data.IPS[3] + city, {
      pageNo: 1,
      pageSize: 10,
      scity: city
    })
    .then(data => {
      try{this.setData({ hotbuilding: data.data })}catch(error){};
    })
    
    //新盘推荐
    utils.get(this.data.IPS[4] + "1002", {
      pageNo: 1,
      scity: city
    })
    .then(data => {
      if(data.data.length) this.setData({ newinfohouse: data.data });
    })

    //猜你喜欢(默认二手房 首页第1页数据)
    var IP = this.data.guessLikeIP[0] + '/' + city;
    this.getDataFromServer(IP, {pageNo: 1,scity: city});
  },
  //猜你喜欢 二手房 租房
  selectYouLike(e) {
    this.setData({ num: e.target.dataset.index })
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);
    this.cacheHouseType2(this.data.guessYouLike[this.data.num]);
    let IP = this.data.guessLikeIP[this.data.num] + '/' + this.data.currentCity;
    let params = { pageNo: 1,scity: this.data.currentCity};
    this.getDataFromServer(IP, params);
  },
  //猜你喜欢
  getDataFromServer(IP, params) {
    this.setData({hasMore: true});
    utils.get(IP, params)
    .then(data => {
      data.data.forEach((item) => {
        try{
          item.houseTag = item.houseTag.split(',');
        }catch(error){};
      })
      let flagpc =  this.data.num == 0 ? true : false;
      this.setData({flagPrice: flagpc});
      this.setData({hasMore: false});
      data.data.forEach(item=>{item.show = false});
      this.setData({houseList: data.data});
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
        wx.navigateTo({url: "../index/buyRentHouse"});break;      
      case '2': 
        this.cacheHouseType('租房');
        this.cacheHouseType2('租房');
        wx.navigateTo({url: "../index/buyRentHouse"});break;      
      case '3': 
        this.cacheHouseType('小区');
        wx.navigateTo({url: "../searchList/searchList"});break;      
      case '4':
        wx.setStorageSync('currentPage', '主页');
        if (wx.getStorageSync("userInfo")) {
          if(!wx.getStorageSync('userToken')){
            //已授权
            wx.redirectTo({url: "/pages/mine/login"});
          }else{
            wx.navigateTo({url: "sellRent"});
          }
        }else{
          //未授权
          wx.showModal({
            title: '注意',
            showCancel: true,
            confirmText:'好去授权',
            content: '为了您更好的体验,请先同意授权',
            success: res => {
              if(res.confirm){
                wx.switchTab({url: "/pages/mine/mine"});
              }
            }
          })  
        }
        break;      
      case '5':wx.navigateTo({url: "shop"});break;      
    }
  },
  //活动版块2 跳转
  activity2(e) {
    let num = e.currentTarget.dataset.num;
    let urlArr = this.data.allH5url;
    switch(num) {
      case '1': wx.navigateTo({url: "newHouse"});break;      
      case '2': wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${urlArr[9].value}`});break;//海外置业      
      case '3': wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${urlArr[10].value}`});break;//旅居投资
      case '4': wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${urlArr[6].value}`});break;//世华公益
      case '5': wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${urlArr[3].value}`});break;//购房指南
    }
  },
  //四个模块
  fourPic(e){
    let http = e.currentTarget.dataset.http;   
    wx.navigateTo({url: `../h5Pages/h5Pages?type=wx&redirect=${http}`});
  },
  //热门推荐
  hottuj(e) {
    let http = e.currentTarget.dataset.http;
    wx.setStorageSync('weiXinUrl', http);
    wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${http}`});
  },
  //轮播图
  lunbo(e){
    let http = e.currentTarget.dataset.http;   
    wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${http}`});
  },
  //数量统计
  suliang(e){
    let urlArr = this.data.allH5url;
    let scityName = this.data.myLocation;
    let currentCity = this.data.currentCity;
    wx.navigateTo({url: `../h5Pages/h5Pages?redirect=${urlArr[0].value}&scityname=${scityName}&scity=${currentCity}&type=web&static=tongji`})
  },

  //新盘推荐
  newhouseRecommend(e){
    let http = e.currentTarget.dataset.http;
    let num = this.parseUrl(e.currentTarget.dataset.http).id;
    wx.navigateTo({url: `../h5Pages/h5Pages?newHouseId=${num}&redirect=${http}`});
  },
  parseUrl(url) {
    var urlparams = {};
    try{
        var urlStr=url.split("?")[1].split("&");
        for( let i=0;i<urlStr.length;i++){
            var item = urlStr[i].split("=")
            urlparams[item[0]]=item[1]
        }
    }catch(error){};
    return urlparams;
  },
  //热门小区
  hotxiaoqu(e) {
    let http;
    this.cacheHouseType('小区');
    if(e.currentTarget.dataset.id){
      http = "../houseDetail/houseDetail2?id="+e.currentTarget.dataset.id;
    }else{
      http = "hotHouse?title=热门小区";
    }
    wx.navigateTo({url: http});
  },
  //猜你喜欢
  guesslike(e) {
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);
    this.cacheHouseType2(this.data.guessYouLike[this.data.num]);
    utils.storage('houseTypeSelect')
    .then(res=>{
      if(res.data=='二手房'){
        wx.navigateTo({url: "../houseDetail/houseDetail?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
      }else if(res.data=='租房'){
        wx.navigateTo({url: "../houseDetail/houseDetail3?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
      }
    })
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  //缓存房源类型 不可改变的
  cacheHouseType2(value) {
    wx.setStorageSync('onceHouseType', value)
  },
  onHide() {
    //回到顶部
    wx.pageScrollTo({scrollTop: 0, duration: 0});
  }
})
