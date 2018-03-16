var amapFile = require("../../libs/amap-wx.js");//高德地图sdk
var Api = require("../../utils/url");
const app = getApp();
Page({
  data: {
    //轮播图banner
    imgUrls: ['http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
    imgalist: [],
    indicatorDots: false,
    indicatorColor: null,
    autoplay: false,
    interval: 2000,
    duration: 1000,
    currentIndex: 1,//初始值
    imagelength: 1,//默认图片长度
    
    hiddenModal: true,//二手房(买房)、租房联系经纪人true , 小区联系经纪人false
    guanlianList: [],//关联小区
    likeFlag: true,//喜欢 收藏

    //高德地图定位
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    src: null,//静态图和动态图切换

    //小区详情 猜你喜欢
    guessYouLike: ['二手房', '租房'],
    num: 0,//默认样式

    //二手房(买房)详情11，租房详情22, 小区详情33 
    detailType: null,//详情类型
    houseDetail: null,
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.houseDetail,
    })
    console.log(options)
    if(options.houseDetail == '二手房'||options.houseDetail == '我要买房') {//二手房
      this.setData({
        detailType: 11,
        houseDetail: options.houseDetail
      });
    }else if(options.houseDetail == '租房'||options.houseDetail == '我要租房'){//租房
      this.setData({
        detailType: 22,
        houseDetail: options.houseDetail
      });
    }else if(options.houseDetail == '小区找房'){//小区
      this.setData({
        detailType: 33,
        houseDetail: options.houseDetail
      });
    }

    //TODO: 请求banner 图片length;
    this.setData({imagelength: 1});


    var that = this;
    var myAmapFun = new amapFile.AMapWX({key: 'beb494604d40692de0a8af2d5137c244' });

    // 动态地图
    myAmapFun.getPoiAround({
      iconPathSelected: '选中 marker 图标的相对路径', //如：..­/..­/img/marker_checked.png
      iconPath: '未选中 marker 图标的相对路径', //如：..­/..­/img/marker.png
      success: (data)=> {
        console.log(data)
        var markersData = data.markers; 
        that.setData({
          markers: markersData//这块考虑怎么用真实数据替换掉
        });
        that.setData({
          latitude: markersData[0].latitude
        });
        that.setData({
          longitude: markersData[0].longitude + 0.098
        });
        // that.showMarkerInfo(markersData, 0);
      },
      fail: (info)=> {
        wx.showModal({ title: info.errMsg })
      }
    })

    // 静态地图
    wx.getSystemInfo({
      success: (data)=> {
        var width = data.windowWidth
        var size = width + "*" + 200;
        myAmapFun.getStaticmap({
          zoom: 8,
          size: size,
          scale: 2,
          markers: "mid,0xFF0000,A:116.37359,39.92437;116.47359,39.92437",
          success: (data)=> {
            that.setData({src: data.url})
          },
          fail: (info)=> {
            wx.showModal({ title: info.errMsg })
          }
        })
      }
    })

  },
  makertap(e) {//覆盖物点击
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },
  showMarkerInfo: function(data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "选中 marker 图标的相对路径"; //如：..­/..­/img/marker_checked.png
      } else {
        data[j].iconPath = "未选中 marker 图标的相对路径"; //如：..­/..­/img/marker.png
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  listenSwiper(e) {
    console.log(e)
    this.setData({//显示图片当前的
      currentIndex: e.detail.current+1
    })
  },
  telphone() {//拨打电话
    wx.makePhoneCall({
      phoneNumber: '132 1236 1223',
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
  jumpLookHouse() {//预约看房
    wx.navigateTo({
      url: "lookHouse"
    });
  },
  toggleSelectLike() {
    this.setData({
      likeFlag: !this.data.likeFlag
    })
  },
  regionchange(e) {//拖动地图
    console.log(e.type)
  },
  markertap(e) {//覆盖物点击
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  previewIamge(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgUrls //需要预览的图片http链接列表  
    })
  },
  onPullDownRefresh() {
    console.log(23123)
  },
  onShareAppMessage(options) {
    console.log(options)
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "世华地产",        // 默认是小程序的名称(可以写slogan等)
      desc: '世华地产全球遥遥领先',
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
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    }
    return shareObj
  },

  //小区详情 猜你喜欢
  selectYouLike(e) {//猜你喜欢 二手房 租房
    this.setData({ num: e.target.dataset.index })
    var IP = this.data.guessLikeIP[this.data.num];
    var params = {
      pageNo: this.data.pageNo
    }
    this.getDataFromServer(IP, params);
  },
  getDataFromServer(IP, params) {//猜你喜欢
    let that = this;
    that.setData({
      showload: true,
      hasMore: true
    })
    if(that.data.hasMore == true) {
      wx.request({
        url: IP,
        data: params,
        method: "POST",
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          if (res.statusCode == 200) {
            if (res.data.status == 1) {
              that.setData({
                twohandhouse: res.data,
                hasMore: false,
                showload: false
              })
            }
          }
          if (res.statusCode == 500) {
            that.setData({
              hasMore: false,
              showload: false
            })
            wx.showModal({
              title: '提示',
              content: '服务器异常',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        },
        fail: function (error) {
          that.setData({
            hasMore: false,
            showload: false
          })
          wx.showModal({
            title: '提示',
            content: '服务器异常',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }
  }

})