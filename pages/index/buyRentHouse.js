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
    tone: 'rgba(249,249,249,0)',//头部渐变色值
    houseDetail: null,//房源详情
    flagPrice: true,
    page: 1,

    isShow: 0,//nav是否显示
    showModalStatus: false,//遮罩层

    navNum: null, //菜单
    banner: ['/HOUSE_USED_BANNER', '/HOUSE_RENT_BANNER'], //banner图
    recmd: [Api.IP_HOUSERECMDLIST, Api.IP_RENTRECMDLIST], //推荐
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE],//列表
    num: 0,//修正 banner图丶推荐丶列表
    houseList: [],//房源列表
    area: [],//区域
    houseTy: [],//户型
    price: [],//价格或者租金
    proportion: [],//面积
    mode: [],//类型
    keyword: null,//获取用户输入值
    params: {}//请求参数
  },
  onLoad(options) {
    //初始化
    let name = wx.getStorageSync('houseTypeSelect');
    wx.setNavigationBarTitle({ title: name });
    if (name == '二手房') {
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
        this.setData({ cityCode: res.data.value });
        this.oneBigRequest(res.data.value);
      }
    })
  },
  oneBigRequest(city) {
    // banner图片
    app.httpRequest(Api.IP_INDEXCONSULT + city + this.data.banner[this.data.num], { scity: city }, (error, data) => {
      this.setData({ imgUrls: data.data })
    });
    //为你推荐
    app.httpRequest(this.data.recmd[this.data.num] + city, { scity: city }, (error, data) => {
      this.setData({ recommend: data.data })
    });
    //区域
    this.areaRequest(city);
    //用途 面积 户型
    this.useAreaRequest(city);
    //价格 租金
    this.priceAreaRequest(city);
  },
  //区域
  areaRequest(city) {
    app.httpRequest(Api.IP_AREADISTRICTS + city, { scity: city }, (error, data) => {
      data.data.unshift({name: '不限',id: 0, districts: []});
      let newData = data.data;
          newData.forEach((item) => {
            item.districts.unshift({name: '不限',id: 0, px: '',py: ''})
          })
      this.setData({area: newData});
    })
  },
  //用途 面积 户型
  useAreaRequest(city) {
    let params = ['HOUSE_USE', 'HOUSE_AREA', 'HOUSE_HUXING'];
    app.httpRequest(Api.IP_DICTIONARY, params, (error, data) => {
      this.setData({
        mode: data.data.HOUSE_USE,
        proportion: data.data.HOUSE_AREA,
        houseTy: data.data.HOUSE_HUXING
      })
    }, 'POST')
  },
  //价格 租金
  priceAreaRequest(city) {
    if (this.data.flagPrice) {//租金
      app.httpRequest(Api.IP_DICTIONARYCONDITION + 'HOUSE_RENTAL/' + city, {}, (error, data) => {
        this.setData({ price: data.data });
      })
    } else {//价格
      app.httpRequest(Api.IP_DICTIONARYCONDITION + 'SELL_PRICE/' + city, {}, (error, data) => {
        this.setData({ price: data.data });
      })
    }
  },
  //页面滚动监听
  onPageScroll(res) {
    let scrot = wx.getSystemInfoSync().windowWidth / 375 * 330
    let percent = res.scrollTop / scrot;
    let changeTone = 'rgba(249,249,249,' + percent + ')';
    let show = res.scrollTop > scrot ? 1 : 0;
    this.setData({tone: changeTone})
    this.setData({isShow: show});
  },
  //控制nav菜单
  selectItem(e) {
    let scrot = wx.getSystemInfoSync().windowWidth / 375 * 350
    wx.pageScrollTo({scrollTop: scrot, duration: 0})
    this.setData({
      navNum: e.target.dataset.index,
      showModalStatus: true,
      tone: "rgba(249, 249, 249, 1)"
    })
  },
  //获取用户输入关键字
  userSearch(e) {
    this.setData({ keyword: e.detail.value })
  },
  //点击icon搜索
  startsearch() {
    this.searchSubmit();
  },
  //键盘回车搜索
  searchSubmit() {
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
  //监听自定义组件事件 首次渲染第一页数据
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
  //上拉加载
  onReachBottom() {
    let page = this.data.page++;
    let IP = this.data.IPS[this.data.num];
        this.data.params.pageNo = page;
        this.data.params.scity = this.data.cityCode;

        this.getDataFromServer(IP, this.data.params);
  },
  //请求数据
  getDataFromServer(IP, Params) {//请求数据
    app.httpRequest(IP, Params, (error, data) => {
      data.data.forEach((item) => {
        item.houseTag = item.houseTag.split(',');
      })
      this.setData({ houseList: this.data.houseList.concat(data.data) })
      let falgpc = this.data.num == 0 ? true : false;
      this.setData({flagPrice: falgpc})
    }, 'POST')
  }
})