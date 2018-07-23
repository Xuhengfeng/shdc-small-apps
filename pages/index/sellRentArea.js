//小区
const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    estate: [],//小区
    keyword: '',//关键词
    currentCity: null,//当前城市
    page: 1,
    houseTypes: 0,//租房 或 售房
    toastMsg: null,
    time: null,
    buildingId: null//小区id
  },
  onLoad(options) {
    this.setData({houseTypes: options.houseTypes});
    utils.storage('selectCity2')
    .then(data=>{
      this.setData({currentCity:data.data.value});
      this.onReachBottom();
    })
  },
  //小区请求
  selectItemRequest(page) {
    this.data.falg = true;
    this.data.time =  null;
    let params = {
      pageNo: page,
      scity: this.data.currentCity,
      keyword: this.data.keyword
    }
    utils.post(Api.IP_BUILDINGLIST, params)
    .then(data=>{
      this.data.time = setTimeout(()=>{this.setData({toastMsg: null})},300);
      if (page>1) {
        if (!data.data.length) {
          this.setData({toastMsg: `数据已加载全部`});
        }else{
          this.setData({toastMsg: `加载第${page}页数据...`});
        }
      };
      this.setData({estate: this.data.estate.concat(data.data)});
    })
  },
  //选着小区
  selectItem(e){
    let target = e.currentTarget.dataset.item;
    this.setData({buildingId: target.id});
    wx.setStorageSync('xiaoqu', target.buildName);
    wx.navigateTo({url:`sellRentArea1?houseRimId=${target.id}`});
  },
  //获取用户输入关键字
  userSearch(e) {
    this.setData({keyword: e.detail.value});
    this.searchSubmit();
  },
  //点击icon搜索
  startsearch() {
    this.searchSubmit();
  },
  //键盘回车搜索
  searchSubmit() {
    this.data.estate = [];
    this.selectItemRequest(1);
  },
  //确定按钮
  confirmSearch() {
    if(this.data.keyword!=''){
      wx.setStorageSync('xiaoqu', this.data.keyword);
      let buildingId = this.data.buildingId;
      wx.navigateTo({url:`sellRentArea1?houseRimId=${buildingId}`});
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.selectItemRequest(page);
  }
})