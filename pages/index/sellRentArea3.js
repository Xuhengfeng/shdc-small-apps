const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    roomNum: [],//门牌号
    keyword: null,
    currentCity: null,//当前城市拼音
    cityName: null,
    page: 1,
    //栋座号名称 栋座号id 小区id 单元号  
    tempData: null,
    toastMsg: null,
    time: null
  },
  onLoad(options) {
    console.log(options);
    this.setData({tempData: options});    
    utils.storage('selectCity2')
    .then(res=>{
      this.setData({currentCity: res.data.value,cityName:res.data.name});
      this.onReachBottom();
    })
  },
  //门牌号请求
  unitRequest(page, dyname) {
    let params = {
      keyword: this.data.keyword,
      pageNo: page,
      dyname: dyname,
      scity: this.data.currentCity,
      buildId: this.data.tempData.houseRimId,//小区id
      dzId: this.data.tempData.buildingBlockId//栋座号id
    };
    utils.post(Api.IP_BUILDINGLISTDYFH, params)
    .then(data=>{
      data.data.unshift('无门牌号');
      this.setData({roomNum: data.data});
    })
  },
  //选着门牌号 回到 sellRent 页面
  selectItem(e) {
    //栋座号名称 
    let buildingBlockName = this.data.tempData.buildingBlockName;
    //单元号
    let unitName = this.data.tempData.unitName;
    //门牌号
    let target = e.currentTarget.dataset.item || this.data.keyword ;
    //房源信息
    let str = '';
    //具体地址信息
    let str2 = '';
    //页面栈
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 5];//sellRent页面
    
    str = buildingBlockName + ' '+unitName+' '+target;

    utils.storage('sellRentXiaoQu')
    .then(res=>{
      str2 = this.data.cityName + res.data +  str;
      prevPage.setData({houseRimName: res.data, houseInfoContent: str,address:str2});
      wx.navigateBack({delta: 4});//页面返回4级
    })
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
    this.data.roomNum = [];
    this.unitRequest(1, this.data.tempData.dyname);
  }, 
  //确定按钮
  confirmSearch(e) {
    if (this.data.keyword != '') {
      this.selectItem(e);
    }
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    this.unitRequest(page, this.data.tempData.dyname);
  }
})