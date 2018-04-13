var Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    //轮播图banner
    imgUrls: ['../../images/banner.png'],//默认图片
    indicatorDots: false,
    indicatorColor: null,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    currentIndex: 1,
    
    hiddenModal: true,//二手房(买房)、租房联系经纪人true , 小区联系经纪人false
    likeFlag: true,//喜欢 收藏
    scrollTop: 0,

    //百度地图
    latitude: 38.76623,
    longitude: 116.43213,

    //二手房(买房)详情11，租房详情22, 小区详情33 
    detailType: '',//详情类型
    houseDetailId: '',//房屋的sdid编码
    houseDetail: null,//房屋详情 
    guanlianList: null,//关联小区
    community: null,//同小区房源
    nearbyHouse: null,//附近房源

    //小区详情 猜你喜欢
    guessYouLike: ['二手房', '租房'],
    guessLikeIP: [Api.IP_RENTHOUSELIKE, Api.IP_RENTHOUSERENTLIKE],
    num: 0,
    guessYoulikeHouse: [],//猜你喜欢的
    IPS: [Api.IP_TWOHANDHOUSEDETAIL, Api.IP_RENTHOUSEDETAIL, Api.IP_BUILDINFO],//二手房(买房) 租房 小区
    IpsNum: 0,
    currentCity: null,//城市
    page: 1,
    flagPrice: '',
    contentType: 11 //热门小区11， 小区二手房22
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "房源详情",
    })
    wx.getStorage({
      key: 'houseTypeSelect',
      success: (res) => {
          if (res.data == '二手房' || res.data == "小区二手房" || options.houseDetail == "二手房") {//二手房
            this.setData({
              detailType: 11,
              houseDetailId: options.id,
              IpsNum: 0,
              contentType: 22,
              flagPrice: true
            });
          } else if (res.data == '租房') {//租房
            this.setData({
              detailType: 22,
              houseDetailId: options.id,
              IpsNum: 1,
              flagPrice: false              
            });
          } else if (res.data == '小区找房' || options.houseDetail == '热门小区'||res.data=="小区") {//小区
            this.setData({
              detailType: 33,
              houseDetailId: options.id,
              IpsNum: 2,
              contentType: 11
            });
          }
      }
    })
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        this.setData({currentCity:  res.data.value})
        //二手房详情 租房详情 小区找房详情
        this.buyRentRequest(res.data.value, this.data.houseDetailId); 
      }    
    })
    
  },
  //二手房详情 租房详情 小区找房详情
  buyRentRequest(city, sdid) {
    if (this.data.detailType == 11 || this.data.detailType == 22) {

      //二手房  租房详情
      app.httpRequest(this.data.IPS[this.data.IpsNum] + city + '/' + sdid, 'GET', (error, data) => {
        console.log(data)
        this.setData({
          latitude: data.data.py,
          longitude: data.data.px,
          houseDetail: data.data,
          markers: [{
            id: "1",
            latitude: data.data.py,
            longitude: data.data.px,
            width: 50,
            height: 50,
            title: data.data.houseTitle
          }]
        })
        //同小区房源
        this.communityRequest(city, data.data.buildSdid);
        //附近房源详情
        this.nearbyHouseRequest(data.data.px, data.data.py, city, data.data.buildSdid);
        //关联小区详情 
        this.guanlianListRequest(data.data.px, data.data.py, city, data.data.buildSdid);
      })
    }
    //小区找房详情
    if (this.data.detailType == 33) {
      wx.request({
        url: this.data.IPS[this.data.IpsNum] + city + '/' + this.data.houseDetailId,
        data: {},
        method: "GET",
        header: { 'Content-Type': 'application/json' },
        success: (res2) => {
          this.setData({
            latitude: res2.data.data.py,
            longitude: res2.data.data.px,
            houseDetail: res2.data.data,
            markers: [{
              id: "1",
              latitude: res2.data.data.py,
              longitude: res2.data.data.px,
              width: 50,
              height: 50,
              title: res2.data.data.buildName
            }]
          });
        }
      })
      //猜你喜欢(默认二手房 首页第1页数据)
      var IP = this.data.guessLikeIP[this.data.num] + '/' + city;
      this.getDataFromServer(IP, { pageNo: 1 });
    }    
  },
  //同小区房源
  communityRequest(city, buildSdid) {
    app.httpRequest(Api.IP_SAMEUSED+city+'/'+buildSdid+'?pageNo='+1, 'GET', (error, data) => {
        data.data.forEach((item) => {
          item.houseTag = item.houseTag.split(',');
        })
        this.setData({community: data.data});
    })
  },
  //附近房源详情
  nearbyHouseRequest(px, py, city, buildSdid) {
    wx.request({
      url: Api.IP_RIMHOUSING,
      data: {
        "buildSdid": parseInt(buildSdid),
        "px": px,
        "py": py,
        'pageNo': 1,
        'pageSize': 10,
        'scity': city
      },
      method: "POST",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        console.log(res.data)
        res.data.data.forEach((item) => {
          item.houseTag = item.houseTag.split(',');
        })
        this.setData({
          nearbyHouse: res.data.data,
        });
      }
    })
  },
  //关联小区详情 
  guanlianListRequest(px, py, currentCity, buildSdid) {
    wx.request({
      url: Api.IP_BUILDINFO + currentCity + '/' + buildSdid,
      data: {},
      method: "GET",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        this.setData({
          guanlianList: res.data.data,
        });
      }
    })
  },
  listenSwiper(e) {
    this.setData({//显示图片当前的
      currentIndex: e.detail.current+1
    })
  },
  telphone(e) {//拨打电话
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })
  },
  contact() {//通讯录
    wx.addPhoneContact({
      weChatNumber: '132 1236 1223',
    })
  },
  listenerButton() {
    this.setData({
      hiddenModal: !this.data.hiddenModal
    })
  },
  RefreshHouseDetail(e){//重新请求数据
    wx.pageScrollTo({//回到顶部
      scrollTop: 0,
      duration: 0
    })
    let sdid = e.currentTarget.dataset.id;
    this.buyRentRequest(this.data.currentCity, sdid); 
  },
  jumpLookHouse() {//预约看房
    wx.navigateTo({
      url: "lookHouse?houseDetail=" + JSON.stringify(this.data.houseDetail)
    });
  },
  toggleSelectLike() {
    this.setData({
      likeFlag: !this.data.likeFlag
    })
    if (wx.getStorageSync("userToken").data || wx.getStorageSync("openId")) {
      wx.getStorage({
        key: 'selectCity',
        success: (res) => {
          wx.showLoading({
            title: '收藏成功',
            icon: 'loading'
          })
          //租房收藏
          wx.request({
            url: Api.IP_RENTCOLLECTION + res.data.value + '/' + this.data.houseDetailId,
            data: '',
            method: 'POST',
            header: {
              "Content-Type": "application/json",
              "unique-code": wx.getStorageSync("userToken").data
            },
            success: (res) => {
              wx.hideLoading();
            }
          })
        }
      })
    }else{
      wx.redirectTo({
        url: "/pages/mine/login"
      });
    }
  },
  previewIamge(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.houseDetail ? this.data.houseDetail.housePicList : this.data.imgUrls //需要预览的图片http链接列表  
    })
  },
  onPullDownRefresh() {
    console.log(23123)
  },
  onShareAppMessage(options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "世华地产",        // 默认是小程序的名称(可以写slogan等)
      // desc: '世华地产全球遥遥领先',
      path: '/pages/houseDetail/houseDetail',    //默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: (res)=> {
        if(res.errMsg == 'shareAppMessage:ok') {
          console.log(13132132132)
        }
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
    var IP = this.data.guessLikeIP[this.data.num] +'/'+ this.data.currentCity;
    var params = {
      pageNo: this.data.page
    }
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    this.setData({
      showload: true,
      hasMore: true
    })
    if(this.data.hasMore == true) {
      wx.request({
        url: IP,
        data: params,
        method: "GET",
        header: { 'Content-Type': 'application/json' },
        success: (res)=> {
          if (res.statusCode == 200) {
            res.data.data.forEach((item) => {
              item.houseTag = item.houseTag.split(',');
            })
            this.setData({
              guessYoulikeHouse: res.data.data,
              hasMore: false,
              showload: false
            })
            if (this.data.num == 0) {
              this.setData({ flagPrice: true })
            } else {
              this.setData({ flagPrice: false })
            }
          }
          if (res.statusCode == 500) {
            this.setData({
              hasMore: false,
              showload: false
            })
            wx.showModal({content: '服务器错误'})
          }
        },
        fail: (error)=> {
          this.setData({
            hasMore: false,
            showload: false
          })
          wx.showModal({content: '服务器错误'})
        }
      })
    }
  }

})