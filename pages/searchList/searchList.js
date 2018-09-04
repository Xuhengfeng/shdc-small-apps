const Api = require("../../utils/url");
const utils = require("../../utils/util");
import Toast from '../../vant-weapp/dist/toast/index';

Page({
  data: {
    label: [],
    houseList: [],//房源列表
    dataList: [],//每一次的数据
    area: [],//区域
    houseTypes: [],//户型
    price: [],//价格
    proportion: [],//面积
    mode: [],//类型
    use: [],//用途
    houseAge: [],//楼龄
    hasMore: true,
    num: null,//控制nav菜单
    modalFlag: false,
    page: 2,//上拉开始 第1次已经在navBar.js里面做搜索了
    showModalStatus: false,//遮罩层
    scrollTop: 0,
    flagPrice: true,
    flagTwoHouse: true,
    togglelabel: true,
    //区域  (户型 类型 面积)  价格标签
    IPS: [Api.IP_AREADISTRICTS, Api.IP_DICTIONARY, Api.IP_DICTIONARYCONDITION],
    //二手房列表 租房列表 小区找房列表
    IPS2: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE, Api.IP_BUILDLIST], 
    ipNum: 0,
    showload: false,
    hasMore: false,
    currentCity: '',
    keyword: '', //关键词
    params: {},//第一次请求的参数体
    timer: null,//定时器 节流请求
  },
  onLoad(options) {
    let name = wx.getStorageSync('houseTypeSelect');
    wx.setNavigationBarTitle({title: name});
    //修正url keyword label 
    if(name == '二手房') {
      this.setData({
        ipNum: 0,
        houseList: '',
        keyword: options.keywords,
        flagPrice: true,
        flagTwoHouse: true
      });
    } else if (name == '租房') {
      this.setData({
        ipNum: 1,
        houseList: '',           
        keyword: options.keywords,
        flagPrice: false,
        flagTwoHouse: true
      });
    } else if (name == '小区'|| name == '小区找房') {
      this.setData({
        ipNum: 2,
        houseList: '',            
        keyword: options.keywords,
        flagTwoHouse: false
      });
    }
    //获取筛选条件
    utils.storage('selectCity')
    .then(res => {
      //修正 当前的城市
      this.setData({currentCity: res.data.value})
      //区域
      this.areaRequest(res.data.value);
      //户型 类型 面积 用途 楼龄
      this.houseTypeRequest();
      //价格
      this.priceAreaRequest(res.data.value);
    })
  },
  //区域
  areaRequest(currentCity) {
    utils.get(this.data.IPS[0] + currentCity)
    .then(data => {
      data.data.unshift({name: '不限',districts: []});
      var newData = data.data;
      newData.forEach((item) => {
        item.districts.unshift({name: '不限',px: '',py: ''})
      })
      this.setData({area: newData});
    })
  },
  //户型 类型 面积 用途 楼龄
  houseTypeRequest() {
    let params = ['HOUSE_HUXING', 'HOUSE_TYPE', 'HOUSE_AREA', 'HOUSE_USE', 'HOUSE_AGE'];
    utils.post(this.data.IPS[1], params)
    .then(data => {
      this.setData({
          houseTypes: data.data.HOUSE_HUXING,
          mode: data.data.HOUSE_TYPE,
          proportion: data.data.HOUSE_AREA,
          use: data.data.HOUSE_USE,
          houseAge: data.data.HOUSE_AGE
      })
    })
  },
  //价格
  priceAreaRequest(currentCity) {
    utils.get(this.data.IPS[2] + 'SELL_PRICE/' + currentCity)
    .then(data=>{
      this.setData({ price: data.data });
    })
  },
  //监听事件 拿到首次 或 点击筛选条件的第一页数据
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
  //获取用户输入关键字 节流请求
  userSearch(e) {
    clearTimeout(this.data.timer);
    this.data.timer = setTimeout(()=>{
      this.setData({keyword: e.detail.value});
      this.startsearch();
    },1000);
  },
  searchSubmit() {
    this.startsearch();
  },
  //开始检索
  startsearch() {
    let params = {
        'pageNo': 1,
        'keyword': this.data.keyword,
        'scity': this.data.currentCity
    }
    utils.post(this.data.IPS2[this.data.ipNum], params)
    .then(data => {
        //修正数据
        data.data.forEach((item) => {
          if (item.houseTag) {item.houseTag = item.houseTag.split(',')}
        })
        this.setData({houseList: data.data});
    })
  },
  //
  houseDetail2(e) {
    this.cacheHouseType('小区');
    let sdid = e.currentTarget.dataset.id;
    wx.navigateTo({url: '../houseDetail/houseDetail2?title=房源详情&id='+sdid});
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    let IP = this.data.IPS2[this.data.ipNum];
    let params = {
      'pageNo': page,
      'scity': this.data.currentCity  
    }
    let newParams = Object.assign(this.data.params, params);
    this.getDataFromServer(IP, newParams);
  },
  //请求数据
  getDataFromServer(IP, params) {
    this.setData({hasMore: true});
    utils.post(IP, params)
    .then(data => {
      //修正数据
      data.data.forEach((item) => {
        if (item.houseTag) {item.houseTag = item.houseTag.split(',')}
      })
      if (params.pageNo>1) {
        if (!data.data.length) {
          Toast("数据已加载全部");
        }else{
          Toast(`加载第${params.pageNo}页数据...`);
        }
      };
      this.setData({hasMore: false});
      this.setData({houseList: this.data.houseList.concat(data.data)});
      this.setData({dataList: data.data});
      this.data.ipNum == 0 ? this.setData({ flagPrice: true }) : this.setData({ flagPrice: false });
    })
  },
  //缓存房源类型
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value);
  },
  //图片加载错误
  imgError(e) {
    utils.imgError(e, 'houseList', this);
  }
})

