const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
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
    detailType: '',//详情类型
    houseDetailId: '',//房屋的sdid编码
    houseDetail: null,//房屋详情 
    guanlianList: null,//关联小区
    community: [],//同小区房源
    nearbyHouse: [],//附近房源
    currentCity: null,//城市
    page: 1,
    flagPrice: false,
    count: 0,//待看房源列表计数
    token: null,
    toastMsg: null,
    time: null,
    isApp: false,//是否正确的应用场景值myId: null,//用户id
    myId: null,//用户id
    shareId: null,//分享id
    shareUrl: null,//分享url
  },
  onLoad(options) {
    try {
      myId = JSON.parse(wx.getStorageSync('myId'));
      this.setData({myId: myId});
    }catch (error) {}
    
    //存在分享id
    if(options.shareId){
      let params = {code: this.data.shareId}
      this.setData({shareId: options.shareId});
      //阅读量
      utils.post(Api.IP_SHAREADD,params)
      .then(data=>{})
    }
    let params = {
        id: this.data.myId,
        url: this.data.shareUrl,
        code: this.data.shareId
    }
    //分享
    utils.post(Api.IP_SHAREFETCHCODE,params)
    .then(data=>{})
    
    //房源sdid
    this.setData({houseDetailId: options.id});
    //用户登录标识
    this.setData({token: wx.getStorageSync("userToken")});
    //当前房源对应的城市
    if(options.scity){
      this.setData({currentCity: options.scity});
      this.rentHouseRequest(options.scity, this.data.houseDetailId); 
    }else{
      utils.storage('selectCity')
      .then(res=>{
        this.setData({currentCity: res.data.value});
        this.rentHouseRequest(res.data.value, this.data.houseDetailId); 
      })
    }

  },
  rentHouseRequest(city, sdid) {
    //租房详情
    let params = {scity: city,unicode: this.data.token};
    utils.get(Api.IP_RENTHOUSEDETAIL + city + '/' + sdid,params)
    .then(data => {
      let newData = data.data;
      //关联小区详情
      this.guanlianListRequest(newData.px, newData.py, city, newData.buildSdid);
      //同小区房源 
      this.communityRequest(city, newData.buildSdid);
      //附近房源详情
      this.nearbyHouseRequest(newData.px, newData.py, city, newData.buildSdid, 1);
      //刷新
      this.setData({houseDetail: newData});
      this.setData({latitude: newData.py, longitude: newData.px});
      this.setData({likeFlag: newData.isCollect,isAppoint: newData.isAppoint});
    })
  },
  //租房关联小区 
  guanlianListRequest(px, py, currentCity, buildSdid) {
    utils.get(Api.IP_BUILDINFO + currentCity + '/' + buildSdid)
    .then(data => {
      this.setData({guanlianList: data.data});
    })
  },
  //租房同小区房源
  communityRequest(city, buildSdid) {
    let params = {scity: city,unicode: this.data.token};
    utils.get(Api.IP_SAMEUSEDRENT+city+'/'+buildSdid+'?pageNo='+1,params)
    .then(data => {
      data.data.forEach((item) => {item.houseTag = item.houseTag.split(',')});
      this.setData({community: data.data.slice(0,2)});
    })
  },
  //租房周边房源详情
  nearbyHouseRequest(px, py, city, buildSdid, page) {
    this.data.time =  null;
    let params = {
      "buildSdid": parseInt(buildSdid),
      "px": px,
      "py": py,
      'pageNo': page,
      'scity': city
    }
    utils.post(Api.IP_RENTRIMHOUSING, params)
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
      this.setData({nearbyHouse: this.data.nearbyHouse.concat(data.data)});
    });
  },
  //待看房源列表
  seeHouseRequest(city) {
    let params = {
      scity: city,
      pageNo: 1,
      unicode: this.data.token
    }
    utils.get(Api.IP_DETAILLIST,params)
    .then(data=>{this.setData({count: data.data.length})});
  },
  //点击关联小区进入关联小区详情 
  guanlianxiaoqu() {
    this.cacheHouseType('小区');
    wx.navigateTo({url: '../houseDetail/houseDetail2?id='+this.data.guanlianList.sdid+'&scity='+this.data.guanlianList.scity});
  },
  //同小区房源更多
  tongyuanxiaoqu() {
    let once = wx.getStorageSync('onceHouseType');
    this.cacheHouseType(once);
    wx.redirectTo({url: '../index/hotHouse?title=同小区房源&id='+this.data.guanlianList.sdid+'&scity='+this.data.guanlianList.scity});
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value);
  },
  //地图
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
  //重新请求数据
  RefreshHouseDetail(e){
    wx.redirectTo({url: '../houseDetail/houseDetail3?id='+e.currentTarget.dataset.id+'&scity='+e.currentTarget.dataset.scity});
  },
  //联系人弹窗
  linkman() {
    this.setData({isLinkman: true});
  },
  //关闭联系人弹窗
  cancelLinkman() {
    this.setData({isLinkman: false});
  },
  //收藏
  toggleSelectLike() {
    if (!wx.getStorageSync("userToken")) return wx.redirectTo({url: "/pages/mine/login"});
    this.setData({likeFlag: !this.data.likeFlag});
    if(this.data.likeFlag) {
      this.colletionRequest(true, 1);//租房收藏添加
    }else{
      this.colletionRequest(false, 1);//租房收藏取消
    }
  },
  //收藏 请求
  colletionRequest(bool, num) {
    if(bool) {
      let params = {"title": "收藏","unicode": wx.getStorageSync("userToken"),"scity": this.data.currentCity};
      utils.post(Api.IP_RENTCOLLECTION + this.data.currentCity + '/' + this.data.houseDetailId, params)
      .then(data => {wx.hideLoading()});
    }else{
      let params = {"title": "取消","unicode": wx.getStorageSync("userToken"),"scity": this.data.currentCity};
      utils.post(Api.IP_RENTCOLLECTIONCANCEL + this.data.currentCity + '/' + this.data.houseDetailId, params)
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
  //跳回首页
  onMyEventBackHome() {
    wx.switchTab({url: '../index/index'});
  },
  //分享
  onShareAppMessage(options) {
    let  that = this;
    let sdid = this.data.houseDetailId;
    let scity = this.data.currentCity;
    let shareId = this.data.shareId;
    let shareUrl = `/pages/houseDetail/houseDetail3?id=${sdid}&scity=${scity}&shareId=${shareId}`;
    wx.showShareMenu({withShareTicket: true});
    var shareObj = {
      title: this.data.houseDetail.houseTitle,
      path: shareUrl,//默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: (res)=> {
        if(res.errMsg == 'shareAppMessage:ok') {
          wx.showToast({ title: '分享成功', icon: 'success', duration: 1000 });
        }
      },
      fail: (res)=> {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
          wx.showToast({ title: '取消分享', icon: 'warn', duration: 1000 });
        }else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
          wx.showToast({ title: '分享失败', icon: 'warn', duration: 1000 });
        }
      }
    }
    if(options.from == 'button') {
      var eData = options.target.dataset;
      // 此处可以修改 shareObj 中的内容
    }
    return shareObj
  },
  onReachBottom(){
    let page = this.data.page++;
    this.nearbyHouseRequest(this.data.longitude, this.data.latitude, this.data.currentCity, this.data.houseDetailId, page); 
  },
  onShow() {
    //判断场景值scene
    let scene = app.globalData.scene;
    if(scene==1036||scene==1069||scene==1089||scene==1090){
      this.setData({isApp: true});
    }else{
      this.setData({isApp: false});
    }
  },
  //图片加载错误
  imgError(e) {
    let name = e.currentTarget.dataset.name;
    utils.imgError(e, name, this);
    if(name=='houseDetail.housePicList'){
      utils.imgError2(e, name, this);
    }
  }
})