const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    unit: [],//单元
    keyword: null,
    currentCity: null,
    page: 1,
    //栋座号名称 栋座号id 小区id 这个要传递给门牌号  
    roomItem: null,
    toastMsg: null,
    time: null
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
      data.data.unshift('无单元号');
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
    //栋座号名称 栋座号id 小区id 单元号----------------------------->>>>>>>>>门牌号页面
    wx.navigateTo({url: 
      `sellRentArea3?buildingBlockName=${room.buildingBlockName}&buildingBlockId=${room.buildingBlockId}&houseRimId=${room.houseRimId}&unitName=${target}&dyname=${target}`
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
      wx.setStorage({key:'buildingBlockName',data: this.data.keyword});
      let buildingBlockName = this.data.keyword;
      let buildingBlockId = null;
      //栋座号名称 栋座号id 小区id ------------------------------------->>>>>>>单元号页面 
      wx.navigateTo({url: 
        `sellRentArea3?buildingBlockName=${buildingBlockName}&buildingBlockId=${buildingBlockId}&dyname=null`
      });
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.unitRequest(page);
  }
})