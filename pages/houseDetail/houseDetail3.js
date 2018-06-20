const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    //轮播图banner
    imgUrls: ['../../images/banner.png'],//默认图片
    currentIndex: 1,

    likeFlag: false,//喜欢 收藏
    isAppoint: false,//预约看房 已经加入待看
    isAppointment: false,//点击预约看房弹窗
    isLinkman: false,//二手房 租房联系经纪人
    scrollTop: 0,

    //百度地图
    latitude: 38.76623,
    longitude: 116.43213,

    detailType: '',//详情类型
    houseDetailId: '',//房屋的sdid编码
    houseDetail: null,//房屋详情 
    guanlianList: null,//关联小区
    community: null,//同小区房源
    nearbyHouse: null,//附近房源
    currentCity: null,//城市
    page: 1,
    flagPrice: '',
    count: 0,//待看房源列表计数
    token: null,
   
  },
  onLoad(options) {
    this.setData({houseDetailId: options.id});
   
    //用户登录标识
    let token = wx.getStorageSync("userToken");
    this.setData({token: token});

    //当前房源对应的城市
    if(options.scity){
      this.setData({currentCity: options.scity});
      this.buyRentRequest(options.scity, this.data.houseDetailId); 
    }else{
      utils.storage('selectCity')
      .then(res=>{
        this.setData({currentCity: res.data.value});
        this.buyRentRequest(res.data.value, this.data.houseDetailId); 
      })
    }

  },
  buyRentRequest(city, sdid) {
    //租房详情
    let params = {scity: city,unicode: this.data.token};
    utils.get(Api.IP_RENTHOUSEDETAIL + city + '/' + sdid,params)
    .then(data => {
      //关联小区详情 附近房源详情 同小区房源 待看房源列表
      let newData = data.data;
      this.guanlianListRequest2(newData.px, newData.py, city, newData.buildSdid);
      this.nearbyHouseRequest2(newData.px, newData.py, city, newData.buildSdid);
      this.communityRequest2(city, newData.buildSdid);
      this.seeHouseRequest(city);
      this.setData({
        latitude: newData.py,
        longitude: newData.px,
        houseDetail: newData,
        likeFlag: newData.isCollect,
        isAppoint: newData.isAppoint
      })
    })
  },
  //租房关联小区 
  guanlianListRequest2(px, py, currentCity, buildSdid) {
    utils.get(Api.IP_BUILDINFO + currentCity + '/' + buildSdid)
    .then(data => {
      this.setData({guanlianList: data.data});
    })
  },
  //租房同小区房源
  communityRequest2(city, buildSdid) {
    let params = {scity: city,unicode: this.data.token};
    utils.get(Api.IP_SAMEUSEDRENT+city+'/'+buildSdid+'?pageNo='+1,params)
    .then(data => {
      data.data.forEach((item) => {item.houseTag = item.houseTag.split(',')});
      this.setData({community: data.data});
    })
  },
  //租房周边房源详情
  nearbyHouseRequest2(px, py, city, buildSdid) {
    let params = {
      "buildSdid": parseInt(buildSdid),
      "px": px,
      "py": py,
      'pageNo': 1,
      'pageSize': 10,
      'scity': city
    }
    utils.post(Api.IP_RENTRIMHOUSING, params)
    .then(data => {
      data.data.forEach((item) => {item.houseTag = item.houseTag.split(',')});
      this.setData({nearbyHouse: data.data});
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
    wx.navigateTo({url: '../houseDetail/houseDetail2?title=房源详情&id='+this.data.guanlianList.sdid});
  },
  //同小区房源更多
  tongyuanxiaoqu() {
    let once = wx.getStorageSync('onceHouseType');
    this.cacheHouseType(once);
    wx.redirectTo({url: '../index/hotHouse?title=同小区房源&id='+this.data.guanlianList.sdid});
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
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({phoneNumber: e.target.dataset.phone});
  },
  //回到顶部 重新请求数据
  RefreshHouseDetail(e){
    wx.pageScrollTo({scrollTop: 0,duration: 0});
    let sdid = e.currentTarget.dataset.id;
    this.buyRentRequest(this.data.currentCity, sdid); 
  },
  //联系人弹窗
  linkman() {
    this.setData({isLinkman: true});
  },
  //关闭联系人弹窗
  cancelLinkman() {
    this.setData({isLinkman: false});
  },
  //带看列表
  goSeeList() {
    wx.navigateTo({url: "../index/lookHouseList"});
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
  onShow() {
    this.seeHouseRequest(this.data.currentCity);
  }
})