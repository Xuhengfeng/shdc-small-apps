const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    buildingBlock: [],//栋座
    keyword: '',
    page: 1,
    currentCity: null,
    houseRimId: null,//小区id
    toastMsg: null,
    time: null
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
      data.data.unshift({id: '',name:'无栋座号'});
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
    //栋座号名称 栋座号id 小区id ------------------------------------->>>>>>>单元号页面 
    wx.navigateTo({url: 
      `sellRentArea2?buildingBlockName=${target.name}&buildingBlockId=${target.id}&houseRimId=${houseRimId}`
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
    this.data.buildingBlock = [];
    this.buildingBlockRequest(1);
  }, 
  //确定按钮
  confirmSearch() {
    if(this.data.keyword!=''&&!this.data.buildingBlock.length){
      wx.setStorage({key:'buildingBlockName',data: this.data.keyword});
      let buildingBlockName = this.data.keyword;
      let buildingBlockId = null;
      let houseRimId = this.data.houseRimId;
      //栋座号名称 栋座号id 小区id ------------------------------------->>>>>>>单元号页面 
      wx.navigateTo({url: 
        `sellRentArea2?buildingBlockName=${buildingBlockName}&buildingBlockId=${buildingBlockId}&houseRimId=${houseRimId}`
      });
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.buildingBlockRequest(page);
  }
})