var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    //轮播图
    imgUrls: [],

    //为你推荐
    recommend: [],

    label: [], 
    scrollTop: 0,
    cityCode: null,
    tone:'rgba(249,249,249,0)',//头部渐变色值
    houseDetail: null,//房源详情
    flagPrice: true,
    page: 1,

    isShow: 'hidden',//nav是否显示
    showModalStatus: false,//遮罩层
    
    navNum: null, //菜单
    recmd: [Api.IP_HOUSERECMDLIST, Api.IP_RENTRECMDLIST], //推荐
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE],//列表
    showload: false,
    houseList: [],//房源列表
    area: [],//区域
    houseTypes: [],//户型
    price: [],//价格或者租金
    proportion: [],//面积
    mode: [],//类型
    num: 0,//修正ip的
    keyword: null,//获取用户输入值
  },
  onLoad(options) {
    //初始化
    let name = wx.getStorageSync('houseTypeSelect');
    wx.setNavigationBarTitle({title: name});
    if(name == '二手房') {
      this.setData({
        houseDetail: name,
        flagPrice: true,
        num: 0,
        label: ["区域", "户型", "价格", "面积", "类型"]
      });
    } else if (name == '租房') {
      this.setData({
        houseDetail: name,
        flagPrice: false,
        num: 1,
        label: ["区域", "户型", "租金", "面积"]
      });
    }

    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        this.setData({cityCode: res.data.value});
        this.oneBigRequest(res.data.value);
      }
    })
  },
  oneBigRequest(city) {
        // banner图片
        app.httpRequest(Api.IP_INDEXCONSULT + city + "/HOUSE_USED_BANNER", {scity: city}, (error, data) => {
          this.setData({ imgUrls: data.data })
        });
        //为你推荐
        app.httpRequest(this.data.recmd[this.data.num] + city, { scity: city }, (error, data) => {//获取主页资讯Banner
          this.setData({ recommend: data.data })
        });
        //区域
        this.areaRequest(city);
        //户型 类型 用途
        this.houseTypeRequest();
        //价格 面积
        this.priceAreaRequest(city);
  },
  //区域
  areaRequest(currentCity) {
    app.httpRequest(Api.IP_AREADISTRICTS + currentCity, {}, (error, data) => {
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
  //户型 类型 用途
  houseTypeRequest() {
    let params = ['HOUSE_HUXING', 'HOUSE_USE', 'HOUSE_AREA'];
    app.httpRequest(Api.IP_DICTIONARY, params, (error, data) => {
      this.setData({
        houseTypes: data.data.HOUSE_HUXING,
        mode: data.data.HOUSE_USE,
        proportion: data.data.HOUSE_AREA
      })
      console.log('----------------------------')
      console.log(data.data.HOUSE_HUXING)
      console.log('----------------------------')
      
    }, 'POST')
  },
  //价格 租金
  priceAreaRequest(currentCity) {
    if (this.data.flagPrice) {//租金
      app.httpRequest(Api.IP_DICTIONARYCONDITION + 'HOUSE_RENTAL/' + currentCity, {}, (error, data) => {
        this.setData({ price: data.data });
      })
    }else{//价格
      app.httpRequest(Api.IP_DICTIONARYCONDITION + 'SELL_PRICE/' + currentCity, {}, (error, data) => {
        this.setData({ price: data.data });
      })
    }
  },
  //页面滚动监听
  onPageScroll(res) {
    let percent = res.scrollTop / 300;
    var scrot = wx.getSystemInfoSync().windowWidth / 375 * 330
    let changeTone = 'rgba(249,249,249,' + percent + ')';
    this.setData({
      tone: changeTone//头部渐变色值 
    })
    if(res.scrollTop>scrot) {
        this.setData({
          isShow: 'visible'
        })
    }else{
      this.setData({
        isShow: 'hidden'
      })
    }
  },
  selectItem(e) {//控制nav菜单
    var scrot = wx.getSystemInfoSync().windowWidth / 375 * 350
    wx.pageScrollTo({
      scrollTop: scrot,
      duration: 0
    })
    this.setData({
      navNum: e.target.dataset.index,
      showModalStatus: true,
      tone: "rgba(249, 249, 249, 1)"
    })
  },
  userSearch(e) {//用户输入关键字
    this.setData({keyword: e.detail.value})
  },
  startsearch() {//点击icon搜索
    if (!this.data.keyword) {
      wx.showModal({ content: '请输入关键词' });
    } else {
      wx.getStorage({
        key: 'houseTypeSelect',
        success: (res) => {
          wx.navigateTo({
            url: "../searchList/searchList?houseType=" + res.data + "&keywords=" + this.data.keyword
          })
        }
      })
    }
  },
  searchSubmit() {
    if (!this.data.keyword)  {
      wx.showModal({content: '请输入关键词'});
    }else{
      wx.getStorage({
        key: 'houseTypeSelect',
        success: (res)=> {
          wx.navigateTo({
            url: "../searchList/searchList?houseType=" + res.data+"&keywords="+this.data.keyword
          })
        }
      })
    }
  },
  //监听事件 拿到首次 或 点击筛选条件的第一页数据
  onMyEventHouseList(item) {
    console.log(item)
    setTimeout(() => {
      //修正数据
      item.detail.houseList.forEach((item2) => {
        if (item2.houseTag) {
          item2.houseTag = item2.houseTag.split(',');
        }
      })
      this.setData({
        houseList: item.detail.houseList,
        params: item.detail.params
      })
    }, 500)
  },
  onReachBottom() {
    var page = this.data.page++;
    let IP = this.data.IPS[this.data.num];
    let Params = {
        pageNo: 1,
        pageSize: 10,
        keyword: '',
        scity: this.data.cityCode
    }
    this.getDataFromServer(IP, Params);
  },
  getDataFromServer(IP, Params) {//请求数据
    app.httpRequest(IP, Params, (error, data) => {
        data.data.forEach((item) => {
          item.houseTag = item.houseTag.split(',');
        })
        this.setData({houseList: this.data.houseList.concat(data.data)})
        if (this.data.num == 0) {
          this.setData({ flagPrice: true })
        } else {
          this.setData({ flagPrice: false })
        }
    },'POST')
  }
})