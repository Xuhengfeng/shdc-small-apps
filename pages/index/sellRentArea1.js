const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    buildingBlock: [],//栋座
    keyword: null,
    currentCity: null,
    houseRimId: null,//小区id
  },
  onLoad(options) {
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value,houseRimId: options.houseRimId});
      if(options.houseRimId == ''){
        wx.showModal({
          content:'请先选着小区',
          success: (res)=>{
            res.confirm&wx.navigateBack();
          }
        });
      }else{
        this.buildingBlockRequest(options.houseRimId);
      }
    })
  },
  //栋座号请求
  buildingBlockRequest(houseRimId) {
    let params = {
      keyword: this.data.keyword,
      pageNo: 1,
      scity: this.data.currentCity
    };
    utils.get(Api.IP_BUILDINGLISTDZ+houseRimId, params)
    .then(data=>{
      data.data.unshift({id: '',name:'无栋座号'});
      this.setData({buildingBlock: data.data});
    })
  },
  //选着栋座号
  selectItem(e) {
    let target = e.currentTarget.dataset.item;
    let houseRimId = this.data.houseRimId;
    //栋座号名称 栋座号id 小区id ------------------------------------->>>>>>>单元号页面 
    wx.navigateTo({url: 
      `sellRentArea2?buildingBlockName=${target.name}&buildingBlockId=${target.id}&houseRimId=${houseRimId}`
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
      this.buildingBlockRequest(this.data.houseRimId);
    }
  }, 
})