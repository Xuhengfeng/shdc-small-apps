const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    item: '二手房',//显示选中的
    num: 0,//控制item样式
    flag: false,//控制option显隐
    selectItem: ['二手房', '租房', '小区'],
    searchType: ['SELL','RENT','BUILDING'],
    history: [],
    keyword: null,//获取用户输入值
    token: null,
    currentCity: null
  },
  onLoad() {
    console.log('onload')
    this.cacheHouseType('二手房');
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity:  res.data.value});
      return utils.storage('userToken');
    })
    .then(res=>{
      this.setData({token:  res.data});
      this.searchhistory();
    })
  },
  //搜索历史记录
  searchhistory() {
    let params = {
      scity: this.data.currentCity,
      unicode: this.data.token
    }
    utils.get(Api.IP_SEARCHRECORD+this.data.searchType[this.data.num], params)
    .then(data=>{
      this.setData({history: data.data});
    })
  },
  //清空所有历史记录
  clearAll() {
    let params = {
      scity: this.data.currentCity,
      unicode: this.data.token
    }
    utils.delete(Api.IP_SEARCHRECORDCLEAR, params)
    .then(data=>{
      this.setData({history: ''});
    })
  },
  //点击下拉选项显示
  isShowItem() {
    this.setData({flag: true})
  },
  //点击下拉选项操作
  selectItem(e) {
    let num = e.target.dataset.index;
    this.setData({
      num: num,
      item: this.data.selectItem[num],
      flag: false
    })
    this.searchhistory();
    this.cacheHouseType(this.data.selectItem[num]);
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  //点击icon搜索
  startsearch() {
    if (!this.data.keyword) {
      wx.showModal({
        content: '请输入关键词',
        success: (res)=> { }
      })
    }else{
      if(this.data.history.length <= 5) {
        if(this.data.history.indexOf(this.data.keyword) == -1) {
          this.data.history.unshift(this.data.keyword);
        }
      }else{
        this.data.history.unshift(this.data.keyword);
        this.data.history.pop();
      }
      this.setData({history: this.data.history})
      wx.setStorage({
        key: 'history',
        data: this.data.history,
        success: ()=> {
          wx.redirectTo({
            url: `../../pages/searchList/searchList?keywords=${this.data.keyword}&houseType=${this.data.selectItem[this.data.num]}`
          })
        }
      })
      
    } 
  },
  //取消
  cancelBtn() {
    this.setData({inputTxt: null})
    wx.navigateBack();
  },
  //用户输入关键字
  userSearch(e) {
    this.setData({
      keyword: e.detail.value,
    })
  },
  //历史纪录点击
  historyLabel(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.redirectTo({
      url: "../../pages/searchList/searchList?keywords=" + e.target.dataset.item+"&houseType=" + this.data.selectItem[this.data.num]
    })
  },
  searchSubmit() {
    this.startsearch();
  }
})