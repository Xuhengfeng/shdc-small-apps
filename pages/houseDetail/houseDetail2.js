const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    imgUrls: ['../../images/banner.png'],//轮播图默认图片 
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
    toastMsg: null,
    time: null,
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
    this.data.num==0
    ? this.cacheHouseType('二手房')
    : this.cacheHouseType('租房');

    wx.navigateTo({url: '../houseDetail/houseDetail?id='+e.currentTarget.dataset.id+'&scity='+e.currentTarget.dataset.scity});
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
      urls: this.data.houseDetail ? this.data.houseDetail.housePicList : this.data.imgUrls //需要预览的图片http链接列表  
    })
  },

  //分享
  onShareAppMessage(options) {
    var that = this;
    var shareObj = {
      title: "世华地产",
      // desc: '世华地产全球遥遥领先',
      path: '/pages/houseDetail/houseDetail',    //默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: (res)=> {
        if(res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: ()=> {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        }else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    }
    if(options.from == 'button') {
      var eData = options.target.dataset;
      console.log(eData)
      // 此处可以修改 shareObj 中的内容
      // shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    }
    return shareObj
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
    this.data.time =  null;
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
      this.data.time = setTimeout(()=>{this.setData({toastMsg: null})},300);
      if (page>1) {
        if (!data.data.length) {
          this.setData({toastMsg: `数据已加载全部`});
        }else{
          this.setData({toastMsg: `加载第${page}页数据...`});
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
  }
})