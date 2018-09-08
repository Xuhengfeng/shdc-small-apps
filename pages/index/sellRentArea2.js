//单元号
const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    unit: [],//单元
    keyword: null,
    currentCity: null,
    page: 1,
    roomItem: null,//小区id 栋座号id 
    toastMsg: null,
    time: null,
    nodata: '无单元号',//无单元号
  },
  onLoad(options) {
    this.setData({roomItem: options});    
    utils.storage('selectCity2')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.onReachBottom();
    })
  },
  //单元号请求
  unitRequest(page) {
    let params = {
      keyword: this.data.keyword,
      pageNo: page,
      dyname: null,
      scity: this.data.currentCity,
      buildId: this.data.roomItem.houseRimId,//小区id
      dzId: this.data.roomItem.buildingBlockId//栋座号id
    };
    utils.post(Api.IP_BUILDINGLISTDYFH, params)
    .then(data=>{
      if (page>1) {
        if (!data.data.length) {
          this.setData({toastMsg: `数据已加载全部`});
        }else{
          this.setData({toastMsg: `加载第${page}页数据...`});
        }
      };
      this.setData({unit: this.data.unit.concat(data.data)});
    })
  },
  //选着单元号
  selectItem(e) {
    let target = e.currentTarget.dataset.item;
    let room = this.data.roomItem;
    wx.setStorageSync('unitName', target);
    //小区id 栋座号id 单元号>>>>>>>>>门牌号页面
    wx.navigateTo({url: 
      `sellRentArea3?houseRimId=${room.houseRimId}&buildingBlockId=${room.buildingBlockId}&unitName=${target}&dyname=${target}`
    });
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
    this.data.unit = [];
    this.unitRequest(1);
  },  
  //确定按钮
  confirmSearch() {
    if(this.data.keyword!=''){
      let unitName = this.data.keyword;
      let houseRimId = this.data.roomItem.houseRimId;
      wx.setStorageSync('unitName', unitName);
      //小区id 栋座号id 单元号>>>>>>>>>门牌号页面
      wx.navigateTo({url: 
        `sellRentArea3?houseRimId=${houseRimId}&buildingBlockId=null&unitName=${unitName}&dyname=${unitName}`
      });
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.unitRequest(page);
  }
})