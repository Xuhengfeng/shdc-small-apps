const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    imgUrls: [],//轮播图
    recommend: [],//为你推荐
    toastMsg: '为你找到1000房源',
    label: [],
    scrollTop: 0,
    cityCode: null,
    tone: 'rgba(249,249,249,0)',//头部渐变色值
    flagPrice: true,
    page: 1,
    isShow: 0,//nav是否显示
    showModalStatus: false,//遮罩层
    hasMore: true,
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
    params: {},//请求参数
    toastMsg1: null,
    toastMsg: null,
    time: null,
    name: ''
  },
  onLoad(options) {
    //初始化
    let name = wx.getStorageSync('houseTypeSelect');
    switch(name) {
      case '二手房':
      this.setData({
        name: name,
        flagPrice: true,
        num: 0,
        label: ["区域", "户型", "价格", "面积", "类型"]
      });
      break;
      // ----------------------------------------------------------
      case '租房':
      this.setData({
        name: name,
        flagPrice: false,
        num: 1,
        label: ["区域", "户型", "租金", "面积"]
      });
      break;
      // ----------------------------------------------------------
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
    utils.get(Api.IP_INDEXCONSULT + city + this.data.banner[this.data.num], {scity: city })
    .then(data => {
      this.setData({ imgUrls: data.data })
    });
    //为你推荐
    utils.get(this.data.recmd[this.data.num] + city, { scity: city })
    .then(data => {
      this.setData({ recommend: data.data })
    });
    //区域   用途 面积 户型    价格 租金
    this.areaRequest(city);
    this.useAreaRequest(city);
    this.priceAreaRequest(city);
  },
  //区域
  areaRequest(city) {
    utils.get(Api.IP_AREADISTRICTS + city, { scity: city })
    .then(data => {
      data.data.unshift({name: '不限',id: 0, districts: []});
      data.data.forEach((item) => {
            item.districts.unshift({name: '不限',id: 0, px: '',py: ''})
          })
      this.setData({area:  data.data});
    })
  },
  //类型 面积 户型
  useAreaRequest(city) {
    let params = ['HOUSE_TYPE', 'HOUSE_AREA', 'HOUSE_HUXING'];
    utils.post(Api.IP_DICTIONARY, params)
    .then(data => {
      this.setData({
        mode: data.data.HOUSE_TYPE,
        proportion: data.data.HOUSE_AREA,
        houseTy: data.data.HOUSE_HUXING
      })
    })
  },
  //价格 租金
  priceAreaRequest(city) {
    if (this.data.flagPrice) {//价格
      utils.get(Api.IP_DICTIONARYCONDITION + 'SELL_PRICE/' + city)
      .then(data => {
        this.setData({ price: data.data });
      })
    } else {//租金
      utils.get(Api.IP_DICTIONARYCONDITION + 'HOUSE_RENTAL/' + city)
      .then(data => {
        this.setData({ price: data.data });
      })
    }
  },
  //页面滚动监听
  onPageScroll(res) {
    const denominator  = wx.getSystemInfoSync().windowWidth / 375 * 330;
    let percent = res.scrollTop / denominator;
    let changeTone = 'rgba(249,249,249,' + percent + ')';
    let show = percent>=1 ? 1 : 0;

    this.setData({ tone: changeTone});
    this.setData({isShow: show});
  },
  //控制nav菜单
  selectItem(e) {
    const denominator = wx.getSystemInfoSync().windowWidth / 375 * 350;
    wx.pageScrollTo({scrollTop: denominator, duration: 0});
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
      utils.storage('houseTypeSelect')
      .then(res=>{
        wx.navigateTo({
          url: "../searchList/searchList?houseType=" + res.data + "&keywords=" + this.data.keyword
        })
      })
    }
  },
  //监听自定义navbar组件事件 首次渲染第1页数据
  onMyEventHouseList(item) {
    //先清空
    this.setData({houseList: []});
    if(item.detail.denominator){
      wx.pageScrollTo({scrollTop: item.detail.denominator, duration: 0});
    }
    try{
      //修正数据
      item.detail.houseList.forEach(item2 => {
        if (item2.houseTag) {
          item2.houseTag = item2.houseTag.split(',');
        }
      })
    }catch(e){};
    //刷新
    this.setData({
      houseList: item.detail.houseList,
      params: item.detail.params,
      page:  item.detail.params.pageNo,
      hasMore: false
    })
  },
  //上拉加载
  onReachBottom() {
    let page = this.data.page++;
    let IP = this.data.IPS[this.data.num];
    this.getDataFromServer(IP, page);
  },
  //请求数据
  getDataFromServer(IP, page) {//请求数据
    this.data.time =  null;
    let params = {'pageNo': page,'scity': this.data.cityCode};
        params = Object.assign(this.data.params, params);
        utils
          .post(IP, params)
          .then(data => {
            try{
              data.data.forEach((item) => {
                item.houseTag = item.houseTag.split(',');
              })
            }catch(e){};
            this.setData({hasMore: false});
            this.data.time = setTimeout(()=>{this.setData({toastMsg: null})},300);
            let falgpc = this.data.num == 0 ? true : false;
            this.setData({flagPrice: falgpc})
            if (page>1) {
              if (!data.data.length) {
                this.setData({toastMsg: `数据已加载全部`});
              }else{
                this.setData({toastMsg: `加载第${page}页数据...`});
              }
            };
            //刷新
            this.setData({houseList: this.data.houseList.concat(data.data)});
          })
  },
  //为你推荐跳转
  commendForYou(e) {
    this.linkMethods(e);
  },
  //房源详情
  gotoseeHouse(e) {
    this.linkMethods(e);
  },
  //跳转方式
  linkMethods(e) {
    utils.storage('houseTypeSelect')
    .then(res=>{
      if(res.data=='二手房'){
        wx.navigateTo({url: "../houseDetail/houseDetail?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
      }else if(res.data=='租房'){
        wx.navigateTo({url: "../houseDetail/houseDetail3?id="+e.currentTarget.dataset.id+"&scity="+e.currentTarget.dataset.scity});
      }
    })
  },
  //图片加载错误
  imgError(e) {
    utils.imgError(e, this);
  }
})