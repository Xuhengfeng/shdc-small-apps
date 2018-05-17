const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    roomNum: [],//门牌号
    keyword: null,
    currentCity: null,
    //栋座号名称 栋座号id 小区id 单元号  
    tempData: null,
  },
  onLoad(options) {
    console.log(options);
    this.setData({tempData: options});    
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      this.unitRequest(options.unitName);
    })
  },
  //门牌号请求
  unitRequest(dyname) {
    let params = {
      keyword: this.data.keyword,
      pageNo: 1,
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
    let target = e.currentTarget.dataset.item;
    //栋座号名称 单元号 门牌号 
    let str = '';
        str = this.data.tempData.buildingBlockName + ' '+
              this.data.tempData.unitName+' '+
              target;
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 4];//sellRent页面
    prevPage.setData({houseInfoContent: str,phcolorFlag4:false});
    //页面返回三级
    wx.navigateBack({delta: 3});
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
      this.unitRequest(this.data.tempData.dyname);
    }
  }, 
})