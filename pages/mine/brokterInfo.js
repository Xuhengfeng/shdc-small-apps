const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    guessYouLike: ['二手房', '租房'],
    num: 0,//猜你喜欢哪一个
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    houseList: [],
    currentCity: '',
    brokerInfo: null,
    likeFlag: true,
    brokerId: '',
    brokerComment: [],//经纪人评论
  },
  onLoad(options) {
    let item = JSON.parse(options.item);
    let IP = this.data.guessLikeIP[0] + '/' + item.scity;
    this.setData({brokerId: item.id, currentCity: item.scity});
    this.brokerInfoRequest(item);
    this.brokerCommentInfo(item);
    let params = {pageNo: 1, scity: item.scity};
    this.getDataFromServer(IP, params);
  },
  //经纪人评论
  brokerCommentInfo() { 
    let params = {brokerId: this.data.brokerId, pageNo: 1}
    utils.get(Api.IP_BROKEREVALUATE,params)
    .then(data=>{
      data.data.forEach(item=>{
        item.grade = this.newStar(item.grade);
        item.tag = item.tag.split(',');
      })
      this.setData({brokerComment: data.data});
    })
  },
  //查看更多的评论
  seeMoreComment() {
    wx.navigateTo({url: `moreComment?id=${this.data.brokerId}`})
  },
  //拨打电话
  call(e) {
    if(e.currentTarget.dataset.phone){
      wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.phone});
    }else{
      wx.showModal({content: '号码不存在'});
    }
  },
  //生成星星组合
  newStar(num) {
    let arr=[];
    for(let i=0;i<num;i++){
      arr.push(true);
    }
    for(let j=0;j<(5-num);j++){
      arr.push(false);
    }
    return arr;
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
      data.data.forEach(item => {
        item.houseTag = item.houseTag.split(',');
      })
      let flagpc = this.data.num == 0 ? true : false;
      this.setData({flagPrice: flagpc, houseList: data.data })
    })
  },
  //经纪人详情
  brokerInfoRequest(item) {
    utils.get(Api.IP_BROKERSDETAIL+item.scity+'/'+item.id)
    .then(data=>{
      console.log(data.data)
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
})