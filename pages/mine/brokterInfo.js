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
    brokerId: '',
    brokerComment: [],//经纪人评论
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
    this.brokerCommentInfo();
  },
  //经纪人评论
  brokerCommentInfo() { 
    let params = {
      brokerId: this.data.brokerId,
      pageNo: 1
    }
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
    wx.makePhoneCall({phoneNumber: e.currentTarget.dataset.phone});
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