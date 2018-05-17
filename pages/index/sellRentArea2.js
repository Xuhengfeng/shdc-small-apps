const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    unit: [],//单元
    keyword: null,
    currentCity: null,
    //栋座号名称 栋座号id 小区id 这个要传递给门牌号  
    roomItem: null,
  },
  onLoad(options) {
    this.setData({roomItem: options});    
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.unitRequest();
    })
  },
  //单元号请求
  unitRequest() {
    let params = {
      keyword: this.data.keyword,
      pageNo: 1,
      dyname: null,
      scity: this.data.currentCity,
      buildId: this.data.roomItem.houseRimId,//小区id
      dzId: this.data.roomItem.buildingBlockId//栋座号id
    };
    utils.post(Api.IP_BUILDINGLISTDYFH, params)
    .then(data=>{
      data.data.unshift('无单元号');
      this.setData({unit: data.data});
    })
  },
  //选着单元号
  selectItem(e) {
    let target = e.currentTarget.dataset.item;
    let room = this.data.roomItem;
    //栋座号名称 栋座号id 小区id 单元号----------------------------->>>>>>>>>门牌号页面
    wx.navigateTo({url: 
      `sellRentArea3?buildingBlockName=${room.buildingBlockName}&buildingBlockId=${room.buildingBlockId}&houseRimId=${room.houseRimId}&unitName=${target}`
    });
  },
  //获取用户输入关键字
  userSearch(e) {
    this.setData({ keyword: e.detail.value })
  },
  //点击icon搜索 或 确定按钮
  startsearch() {
    this.searchSubmit();
  },
  //键盘回车搜索
  searchSubmit() {
    if (!this.data.keyword) {
      wx.showModal({ content: '请输入关键词' });
    } else {
      this.unitRequest(this.data.houseRimId);
    }
  }, 
})