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

    //小区详情
    houseDetailId: '',//房屋的sdid编码
    houseDetail: null,//房屋详情 
    guanlianList: null,//关联小区
    community: null,//同小区房源
    nearbyHouse: null,//附近房源

    //小区详情 猜你喜欢
    guessYouLike: ['二手房', '租房'],
    guessYoulikeHouse: [],//猜你喜欢的
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    num: 0,
    IPS: [Api.IP_TWOHANDHOUSEDETAIL, Api.IP_RENTHOUSEDETAIL, Api.IP_BUILDINFO],//二手房 租房 小区详情等
    IPS2: [Api.IP_HOUSECOLLECTION, Api.IP_RENTCOLLECTION, Api.IP_COLLECTIONADD],//二手房 租房 小区添加收藏 
    IPS3: [Api.IP_HOUSECOLLECTIONCANCEL, Api.IP_RENTCOLLECTIONCANCEL, Api.IP_COLLECTIONCANCEL],//二手房 租房 小区取消收藏 
    IpsNum: 0,
    currentCity: null,//城市
    page: 1,
    flagPrice: '',
    contentType: 11, //热门小区11， 小区二手房22
    count: 0,//待看房源列表计数
    token: null,
    title: null,
   
  },
  onLoad(options) {
    wx.setStorage({key:"houseDetailId",data: options.id});
    wx.getStorage({
      key: 'houseTypeSelect',
      success: (res) => {
        let str = res.data;
        switch(str) {
          case '小区':
          case '热门小区':
          this.setData({
              houseDetailId: options.id,
              IpsNum: 2,
              contentType: 11
          });
          break;
        }
      }
    })
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity:  res.data.value});
        this.buyRentRequest(res.data.value, this.data.houseDetailId); 
      }    
    })
    wx.getStorage({
      key: 'userToken',
      success: (res)=>{
        this.setData({token:  res.data});
      }
    })
  },
  //小区找房详情
  buyRentRequest(city, sdid) {
    utils.get(this.data.IPS[this.data.IpsNum] + city + '/' + sdid, { scity: city })
      .then(data => {
        try {
          this.setData({
            latitude: data.data.py,
            longitude: data.data.px,
            likeFlag: data.data.isCollect
          });
        }
        catch(err) {
          console.log(err)
        }
        this.setData({houseDetail: data.data});
      })
    //猜你喜欢(默认二手房 首页第1页数据)
    let IP = this.data.guessLikeIP[this.data.num] + '/' + city;
    this.getDataFromServer(IP, { pageNo: 1 });
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
  //小区二手房
  xiaoquTwoHouse() {
    this.cacheHouseType('小区二手房');
    wx.redirectTo({url: '../index/hotHouse?title=小区二手房&id='+this.data.houseDetail.sdid});
  },
  //小区租房
  xiaoquRentHouse() {
    this.cacheHouseType('小区租房');
    wx.redirectTo({url: '../index/hotHouse?title=小区租房&id='+this.data.houseDetail.sdid});
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
  jumpHouseDetail(e){
    this.data.num==0
    ? this.cacheHouseType('二手房')
    : this.cacheHouseType('租房');
    
    let sdid = e.currentTarget.dataset.id;
    wx.navigateTo({url: '../houseDetail/houseDetail?title=房源详情&id='+sdid});
  },
  //收藏
  toggleSelectLike() {
    if (!wx.getStorageSync("userToken")) wx.redirectTo({url: "/pages/mine/login"});
    this.setData({likeFlag: !this.data.likeFlag});
    let num = this.data.detailType;
    if(!this.data.likeFlag) {
        switch(num) {
          case 11: this.colletionRequest(true, 0);break;//二手房收藏
          case 22: this.colletionRequest(true, 1);break;//租房收藏
          case 33: this.colletionRequest(true, 2);break;//小区收藏
        }
    }else{
        switch(num) {
          case 11: this.colletionRequest(false, 0);break;//二手房收藏取消
          case 22: this.colletionRequest(false, 1);break;//租房收藏取消
          case 33: this.colletionRequest(false, 2);break;//小区收藏取消
        }
    }
  },
  //收藏 请求
  colletionRequest(bool, num) {
    if(bool) {
      let params = {"title": "收藏","unicode": wx.getStorageSync("userToken")};
      utils.post(this.data.IPS2[num] + this.data.currentCity + '/' + this.data.houseDetailId, params)
      .then(data => {wx.hideLoading()});
    }else{
      let params = { "title": "取消", "unicode": wx.getStorageSync("userToken")}
      utils.post(this.data.IPS3[num] + this.data.currentCity + '/' + this.data.houseDetailId, params)
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

  //小区详情 猜你喜欢
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({ num: e.target.dataset.index })
    let IP = this.data.guessLikeIP[this.data.num] +'/'+ this.data.currentCity;
    let params = {pageNo: this.data.page}
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {
    utils.get(IP, params)
    .then(data => {
      data.data.forEach((item) => {item.houseTag = item.houseTag.split(',')});
      let flagpc = this.data.num == 0? true : false;
      this.setData({ flagPrice: flagpc, guessYoulikeHouse: data.data});
    })
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value);
  },
})