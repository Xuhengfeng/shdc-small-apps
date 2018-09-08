const Api = require("../../utils/url");
const utils = require("../../utils/util");
import Toast from '../../vant-weapp/dist/toast/index';
const app = getApp();
Page({
  data: {
    scrollNum: 0,
    statusBarHeight: app.globalData.statusBarHeight, 
    imgUrls: [],//轮播图默认图片 
    currentIndex: 1,
    likeFlag: false,//喜欢 收藏
    isAppoint: false,//预约看房 已经加入待看
    isAppointment: false,//点击预约看房弹窗
    isLinkman: false,//二手房 租房联系经纪人
    latitude: 38.76623,
    longitude: 116.43213,
    houseDetailId: '',//房屋的sdid编码
    houseDetail: null,//房屋详情 
    guanlianList: null,//关联小区
    nearbyHouse: null,//附近房源
    guessYouLike: ['二手房', '租房'],
    guessYoulikeHouse: [],//猜你喜欢的
    guessLikeIP: [Api.IP_SAMEUSED, Api.IP_SAMEUSEDRENT],
    num: 0,
    currentCity: null,//城市
    page: 1,
    flagPrice: '',
    count: 0,//待看房源列表计数
    token: null,
    arr1: [],//二手房
    arr2: []//租房
  },
  onLoad(options) {
    //房源sdid
    this.setData({houseDetailId: options.id});
    //用户登录标识
    this.setData({token: wx.getStorageSync("userToken")});
    if(options.scity){
      this.setData({currentCity: options.scity});
      this.xiaoquRequest(options.scity, this.data.houseDetailId); 
    }else{
      utils.storage('selectCity')
      .then(res=>{
        this.setData({currentCity: res.data.value});
        this.xiaoquRequest(res.data.value, this.data.houseDetailId); 
      })
    }
  },
  //小区详情
  xiaoquRequest(city, sdid) {
    utils.get(Api.IP_BUILDINFO + city + '/' + sdid, { scity: city })
      .then(data => {
        try {
          this.setData({
            latitude: data.data.py,
            longitude: data.data.px,
            likeFlag: data.data.isCollect
          });
        }
        catch(err) {}
        this.setData({houseDetail: data.data});
        this.onReachBottom(1);
      })
  },
  //小区二手房
  xiaoquTwoHouse() {
    this.cacheHouseType('小区二手房');
    wx.navigateTo({url: '../index/hotHouse?title=小区二手房&id='+this.data.houseDetail.sdid+'&scity='+this.data.houseDetail.scity});
  },
  //小区租房
  xiaoquRentHouse() {
    this.cacheHouseType('小区租房');
    wx.navigateTo({url: '../index/hotHouse?title=小区租房&id='+this.data.houseDetail.sdid+'&scity='+this.data.houseDetail.scity});
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value);
  },
  mapJump() {
    let obj = {
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      houseDetail: this.data.houseDetail
    }
    wx.navigateTo({url: "map?obj="+JSON.stringify(obj)});
  },
  //显示图片当前的数字
  listenSwiper(e) {
    this.setData({currentIndex: e.detail.current+1});
  },
  //拨打电话
  telphone(e) {
    wx.makePhoneCall({phoneNumber: e.target.dataset.phone});
  },
  //通讯录
  contact() {
    wx.addPhoneContact({ weChatNumber: '13212361223'});
  },
  //跳转
  jumpHouseDetail(e){
    if(this.data.num==0){
      this.cacheHouseType('二手房');
      wx.navigateTo({url: '../houseDetail/houseDetail?id='+e.currentTarget.dataset.id+'&scity='+e.currentTarget.dataset.scity});
    }else{
      this.cacheHouseType('租房');
      wx.navigateTo({url: '../houseDetail/houseDetail3?id='+e.currentTarget.dataset.id+'&scity='+e.currentTarget.dataset.scity});
    }
  },
  //收藏
  toggleSelectLike() {
    if (!wx.getStorageSync("userToken")) wx.redirectTo({url: "/pages/mine/login"});
    this.setData({likeFlag: !this.data.likeFlag});
    if(this.data.likeFlag) {
      this.colletionRequest(true);
    }else{
      this.colletionRequest(false);
    }
  },
  //收藏 请求
  colletionRequest(bool) {
    if(bool) {
      let params = {"title": "收藏","unicode": wx.getStorageSync("userToken")};
      utils.post(Api.IP_COLLECTIONADD + this.data.currentCity + '/' + this.data.houseDetailId, params)
      .then(data => {wx.hideLoading()});
    }else{
      let params = { "title": "取消", "unicode": wx.getStorageSync("userToken")}
      utils.post(Api.IP_COLLECTIONCANCEL + this.data.currentCity + '/' + this.data.houseDetailId, params)
      .then(data => {wx.hideLoading()});
    }
  },
  //图片预览
  previewIamge(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.houseDetail ? this.data.houseDetail.housePicList : '../../images/banner2.png' //需要预览的图片http链接列表  
    })
  },
  selectYouLike(e) {//同小区二手房 租房
    this.setData({num: e.target.dataset.index});
    this.setData({arr1: [],arr2:[]});
    let IP = this.data.guessLikeIP[this.data.num] + this.data.currentCity+'/'+this.data.houseDetailId;
    //第二次点击二手房时候page从2开始, 租房的page从1开始 修正上拉page参数
    if(this.data.num == 0){
      this.setData({page: 2});
    }else{
      this.setData({page: 1});
    }
    this.getDataFromServer(IP, 1);
  },
  //跳回首页
  onMyEventBackHome() {
    wx.switchTab({url: '../index/index'});
  },
  getDataFromServer(IP, page) {
    this.data.guessYoulikeHouse = [];
    let params = {
      'pageNo': page,
      'scity': this.data.currentCity,
      "unicode": wx.getStorageSync("userToken")
    }
    utils.get(IP, params)
    .then(data => {
      try{
        data.data.forEach(item => {item.houseTag = item.houseTag.split(',')});
      }catch(e){}
      if (page>1) {
        if (!data.data.length) {
          Toast("数据已加载全部");
        }else{
          Toast(`加载第${page}页数据...`);
        }
      };
      let flagpc;
      if (this.data.num == 0) {
        flagpc = true;
        this.data.arr1 = this.data.arr1.concat(data.data);
        this.setData({flagPrice: flagpc, guessYoulikeHouse: this.data.arr1});
      }else{
        flagpc = false;
        this.data.arr2 = this.data.arr2.concat(data.data);
        this.setData({flagPrice: flagpc, guessYoulikeHouse: this.data.arr2});
      }
    })
  },
  onReachBottom(){
    let page = this.data.page++;
    let IP = this.data.guessLikeIP[this.data.num] + this.data.currentCity+'/'+this.data.houseDetailId;
    this.getDataFromServer(IP, page); 
  },
  //图片加载错误
  imgError(e) {
    let name = e.currentTarget.dataset.name;
    utils.imgError(e, name, this);
    if(name=='houseDetail.housePicList'){
      utils.imgError2(e, name, this);
    }
  },
  //页面滚动监听
  onPageScroll(res) {
    let result = app.oScroll(res);
    this.setData({scrollNum: result.scrollNum});
  }
})