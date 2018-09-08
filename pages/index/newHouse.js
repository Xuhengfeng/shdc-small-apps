const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    imgUrls: [],
    city: [],
    houseList: [],
    hasMore: false,
    // tabbar  
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    scrollLeft: 0,
    selectCity: '',
    page: 1,
    num: 0,
    keyword: null
  },
  onLoad(options) {
    wx.getSystemInfo({
      success: (res)=> {
          this.setData({
            winWidth: res.windowWidth,
            winHieght: res.windowHeight
          })
      }
    })
    utils.storage('selectCity')
    .then(res=>{
      this.setData({ selectCity: res.data.value});
      this.swiperImgRequest();
    })
    //新房城市
    utils.get(Api.IP_NEWBUILDINDEX )
    .then(data => {
      this.setData({ city: data.data });
      this.newHouseListRequest(0,1);
    })
  },
  //新房城市列表
  newHouseListRequest(num, page) {
    this.setData({hasMore: true});
    utils.get(Api.IP_NEWBUILDING+'/'+ this.data.city[num].cityCode,{pageNo: page})
    .then(data=>{
      setTimeout(()=>{
        this.setData({hasMore: false});
      },1000);
      data.data.forEach((item) => {
        try{
          item.tag = item.tag.split(',');
        }catch(error){};
      })
      this.setData({houseList:data.data});
    })
  },
  //轮播图
  swiperImgRequest() {
    utils.get(Api.IP_INDEXCONSULT+'/'+this.data.selectCity+'/NEW_BUILD_INDEX_BANNER')
    .then(data=>{
      this.setData({imgUrls: data.data});
    })
    
  },
  //点击切换tab
  swichNav(e) {  
    var that = this;  
    if (this.data.currentTab === e.target.dataset.current) {  
      return false;  
    } else {  
      let num = e.target.dataset.current;
      that.setData({currentTab: num, num: num, page: 1});
      this.newHouseListRequest(num, 1);
    }  
  },  
  //上拉加载
  onReachBottom() {
    let page = this.data.page++;
    this.newHouseListRequest(this.data.num, page);
  },
  //h5页面跳转 轮播图 数量统计 热门推荐
  h5page(e) {
    if(e.currentTarget.dataset.http){
      wx.navigateTo({url: "../h5Pages/h5Pages?redirect="+e.currentTarget.dataset.http});
    }else{
      wx.showModal({
        content: '链接不存在',
      })
    }
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
})