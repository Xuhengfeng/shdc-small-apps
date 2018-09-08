//栋座号
const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    buildingBlock: [],//栋座
    keyword: '',
    currentCity: null,
    page: 1,
    houseRimId: null,//小区id
    toastMsg: null,
    time: null,
    nodata: {id: '',name:'无栋座号'},//无栋座号
  },
  onLoad(options) {
    utils.storage('selectCity2')
    .then(res=>{
      this.setData({
        currentCity: res.data.value,
        houseRimId: options.houseRimId
      });
      this.onReachBottom();
    })
  },
  //栋座号请求
  buildingBlockRequest(page) {
    this.data.falg = true;
    this.data.time =  null;
    let params = {
      keyword: this.data.keyword,
      pageNo: page,
      scity: this.data.currentCity
    };
    utils.get(Api.IP_BUILDINGLISTDZ+this.data.houseRimId, params)
    .then(data=>{
      if (page>1) {
        if (!data.data.length) {
          this.setData({toastMsg: `数据已加载全部`});
        }else{
          this.setData({toastMsg: `加载第${page}页数据...`});
        }
      };
      this.setData({buildingBlock: this.data.buildingBlock.concat(data.data)});
    })
  },
  //选着栋座号
  selectItem(e) {
    let target = e.currentTarget.dataset.item;
    let houseRimId = this.data.houseRimId;
    wx.setStorageSync('dongzuo', target.name);
    //小区id 栋座号id >>>>>>>单元号页面 
    wx.navigateTo({url:`sellRentArea2?houseRimId=${houseRimId}&buildingBlockId=${target.id}`});
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
    this.data.buildingBlock = [];
    this.buildingBlockRequest(1);
  }, 
  //确定按钮
  confirmSearch() {
    if(this.data.keyword!=''){
      wx.setStorageSync('dongzuo', this.data.keyword);
      let houseRimId = this.data.houseRimId;
      //小区id 栋座号id >>>>>>>单元号页面 
      wx.navigateTo({url:`sellRentArea2?houseRimId=${houseRimId}&buildingBlockId=null`});
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.buildingBlockRequest(page);
  }
})