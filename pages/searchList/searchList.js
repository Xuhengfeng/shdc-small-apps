var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    label: ["区域", "户型", "价格", "面积", "类型"],
    houseList: [],//房源列表
    area: [],//区域
    houseType: [],//户型
    price: [],//价格
    proportion: [],//面积
    mode: [],//类型
    num: null,//控制nav菜单
    modalFlag: false,
    page: 1,
    isScroll: true,//控制template的内scroll-view组件滚动开启
    showModalStatus: false,//遮罩层
    scrollTop: 0,
    togglelabel: true,
    houseDetail: null,//二手房(买房)、租房、小区
    IPS: [Api.IP_BUILDLIST, null, null], //小区列表 租房列表  买房列表
    ipNum: null,
    showload: false,
    currentCity: ''
  },
  onLoad(options) {
   wx.setNavigationBarTitle({
     title: options.houseType,
   })
   if(options.houseType == '小区找房'||options.houseType == '小区') {//小区找房
    this.setData({ 
       label: ['区域', '用途', '类型', '楼龄'],
       houseDetail: options.houseType,
       ipNum: 0 
    });
   }else if(options.houseType == '租房') {
    this.setData({
       label: ['区域', '用途', '类型', '楼龄'],
       houseDetail: options.houseType,
       ipNum: 1       
    });
   }else if(options.houseType == '二手房') {
    this.setData({
       label: ["区域", "户型", "价格", "面积", "类型"],
       houseDetail: options.houseType,
       ipNum: 2
    });
   }
    //城市
    wx.getStorage({
      key: 'selectCity',
      data: {
        name: this.data.myLocation,
        value: this.data.currentCity
      },
      success: (res)=>{
        this.setData({currentCity: res.data.value})

        //区域
        this.areaRequest(res.data.value);

        //户型 类型
        this.houseTypeRequest();

        //价格 面积
        this.priceAreaRequest(res.data.value);
        
        //上拉
        this.getDataFromServer(this.data.IPS[this.data.ipNum], 1, res.data.value);
      }
    })
     
  },
  //区域
  areaRequest(currentCity) {
    app.httpRequest(Api.IP_AREADISTRICTS + currentCity, 'GET', (error, data) => {
      data.data.unshift({
        name: '不限',
        districts: []
      });
      var newData = data.data;
      newData.forEach((item) => {
        item.districts.unshift({
            name: '不限',
            px: '',
            py: ''
        })
      })
      this.setData({ area: newData });
    })
  },
  //户型 类型
  houseTypeRequest() {
    wx.request({
      url: Api.IP_DICTIONARY,
      data: ['HOUSE_HUXING', 'HOUSE_USE'],
      method: 'POST',
      success: (res)=> {
        res.data.data.HOUSE_HUXING.forEach((item)=> {
          item.colorFlag = false;
        })
        res.data.data.HOUSE_USE.forEach((item)=> {
          item.colorFlag = false;          
        })
        this.setData({
          houseType: res.data.data.HOUSE_HUXING,
          mode: res.data.data.HOUSE_USE
        })
      }
    })
  },
  //价格 面积
  priceAreaRequest(currentCity) {
    wx.request({
      url: Api.IP_DICTIONARYCONDITION + 'SELL_PRICE/' + currentCity,
      data: '',
      method: 'GET',
      success: (res) => {
        this.setData({ price: res.data.data });
      }
    })
    wx.request({
      url: Api.IP_DICTIONARYCONDITION + 'HOUSE_AREA/' + currentCity,
      data: '',
      method: 'GET',
      success: (res) => {
        console.log(res)
        this.setData({ proportion: res.data.data });
      }
    })
  },
  //请求数据
  getDataFromServer(IP, page, code) {
    let that = this;
    that.setData({ showload: true })
    wx.request({
      url: IP,
      data: {
        pageNo: page,
        pageSize: 10,
        scity: code
      },
      method: "POST",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          res.data.data.forEach((item) => {
            if(item.houseTag) {
              item.houseTag = item.houseTag.split(',');
            }
          })
          console.log(res.data.data)
          that.setData({
            houseList: res.data.data,
            showload: false
          })
          if (this.data.num == 0) {
            this.setData({ flagPrice: true })
          } else {
            this.setData({ flagPrice: false })
          }
        }
        if (res.statusCode == 500) {
          that.setData({ showload: false })
          wx.showModal({
            title: '提示',
            content: '服务器异常'
          })
        }
      }
    })
  },
  onShow() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  onReachBottom() {//上拉
    var pageNo = this.data.page++;
    this.getDataFromServer(this.data.IPS[this.data.ipNum], pageNo, this.data.value);
  },

})

