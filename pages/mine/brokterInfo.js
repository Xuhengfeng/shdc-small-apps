const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    guessYouLike: ['二手房', '租房'],
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    houseList: [],
    currentCity: '',
    brokerInfo: null,
    likeFlag: true,
    brokerId: ''
  },
  onLoad(options) {
    let id = options.id;
    this.setData({brokerId: id});
    utils.storage('selectCity')
    .then((res)=>{
      let city = res.data.value;
      let IP = this.data.guessLikeIP[0] + '/' + city;
      let params = {pageNo: 1, scity: city};

      this.setData({currentCity: city});
      this.getDataFromServer(IP, params);
      this.brokerInfoRequest(id);
    });
  },
  //猜你喜欢 二手房 租房
  selectYouLike(e) {
    this.setData({ num: e.target.dataset.index })
    this.cacheHouseType(this.data.guessYouLike[this.data.num]);

    let IP = this.data.guessLikeIP[this.data.num] + '/' + this.data.currentCity;
    let params = {pageNo: 1,scity: this.data.currentCity};
    this.getDataFromServer(IP, params);
  },
  //猜你喜欢
  getDataFromServer(IP, params) {
    utils.get(IP, params)
    .then(data => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      let flagpc = this.data.num == 0 ? true : false;
      this.setData({ flagPrice: flagpc })
      this.setData({ houseList: data.data })
    })
  },
  //经纪人详情
  brokerInfoRequest(id) {
    utils.get(Api.IP_BROKERSDETAIL+this.data.currentCity+'/'+id)
    .then(data=>{
      this.setData({brokerInfo: data.data});
    })
  },
  //收藏
  toggleSelectLike() {
    if (!wx.getStorageSync("userToken")) wx.redirectTo({url: "/pages/mine/login"});
    if(!this.data.likeFlag) {
      this.colletionRequest(true);
    }else{
      this.colletionRequest(false);
    }
    this.setData({likeFlag: !this.data.likeFlag});
  },
  //添加收藏 取消收藏 请求
  colletionRequest(bool) {
    if(bool) {
      let params = {"title": "收藏","unicode": wx.getStorageSync("userToken")};
      utils.post(Api.IP_BROKERADD + this.data.currentCity + '/' + this.data.brokerId, params)
      .then(data => {wx.hideLoading()});
    }else{
      let params = { "title": "取消", "unicode": wx.getStorageSync("userToken")}
      utils.post(Api.IP_BROKERCANCEL + this.data.currentCity + '/' + this.data.brokerId, params)
      .then(data => {wx.hideLoading()});
    }
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  }
})