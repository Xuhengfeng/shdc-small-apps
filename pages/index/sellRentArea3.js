//门牌号
const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    roomNum: [],//门牌号
    keyword: '',
    currentCity: null,//当前城市拼音
    page: 1,
    cityName: null,//城市名
    tempData: null,//小区id 栋座号id 单元号  
    toastMsg: null,
    time: null,
    nodata: {id: '',name:'无门牌号'},//无门牌号
  },
  onLoad(options) {
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
      if (page>1) {
        if (!data.data.length) {
          this.setData({toastMsg: `数据已加载全部`});
        }else{
          this.setData({toastMsg: `加载第${page}页数据...`});
        }
      };
      this.setData({roomNum: this.data.roomNum.concat(data.data)});
    })
  },
  //选着门牌号>>>>sellRent页面
  selectItem(e) {
    let xiaoqu = wx.getStorageSync('xiaoqu');//小区号名称 
    let buildingBlockName = wx.getStorageSync('dongzuo');//栋座号名称 
    let unitName = wx.getStorageSync('unitName');//单元号
    let target = e.currentTarget.dataset.item || this.data.keyword ;//门牌号
    let str = buildingBlockName + ' '+unitName+' '+target;//房源信息
    let str2 = this.data.cityName + xiaoqu +  str;//具体地址信息
    
    //页面栈
    let pages = getCurrentPages(), prevPage;
    try {
      if(wx.getStorageSync('xiaoquFlag')){
        let prevPage = pages[pages.length - 4];//sellRent页面
      }else{
        let prevPage = pages[pages.length - 5];//sellRent页面
      }
    }catch(error){
        let prevPage = pages[pages.length - 5];//sellRent页面
    }
    
    prevPage.setData({houseRimName: xiaoqu, houseInfoContent: str,address: str2});
    wx.navigateBack({delta: 4});//页面返回4级
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