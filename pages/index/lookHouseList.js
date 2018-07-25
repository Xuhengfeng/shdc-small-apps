const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    startX: '',//设置触摸起始点水平方向位置
    count: 0,
    delBtnWidth: 110,
    list: [],
    select: [],//用户选中的房源 isMove是否移动  isSelect是否选着
    currentCity: '',
    token: '',
    winHeight: ''
  },
  onLoad() {
    wx.getSystemInfo({
      success:(res)=>{
        this.setData({winHeight: res.windowHeight})
      }
    })
    utils.storage('selectCity')
    .then(res=>{
      this.setData({currentCity: res.data.value});
      return utils.storage('userToken');
    })
    .then(data1=>{
      this.setData({token: data1.data});
      let params = {
        pageNo: 1,
        scity: this.data.currentCity,
        unicode: this.data.token
      };
      return utils.get(Api.IP_DETAILLIST,params);
    })
    .then(data2=>{
      this.setData({list: data2.data});
    })
  },
  //添加房源
  addorder() {
    this.cacheHouseType('二手房');
    wx.navigateTo({url: "../searchList/searchList"});
  },
  //缓存房源类型 可以改变的 
  cacheHouseType(value) {
    wx.setStorageSync('houseTypeSelect', value)
  },
  selectItem(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    list[index].isSelect = !list[index].isSelect;
    let count = 0;
    for (let i=0; i<list.length; i++) {
      //选中的
      if(list[i].isSelect == true){
        count++;
      }else{
      //未选中的
        continue;
      }
    }
    this.setData({list: list,count: count});
  },
  touchS(e) {
    if (e.touches.length == 1) {
      this.setData({startX: e.touches[0].clientX});
    }
  },
  touchM(e) {
    this.data.list.forEach((item)=>{
      item.isMove = false;
    })
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      let moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      let disX = this.data.startX - moveX;
      let delBtnWidth = this.data.delBtnWidth;
      let flag = false;
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        flag = false;
      }
      else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        flag = true;
      }
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = this.data.list;
      list[index].isMove = flag;
      //更新列表的状态
      this.setData({list: list});
    }
  },
  touchE(e){
    if(e.changedTouches.length==1){
      //手指移动结束后水平位置
      let endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = this.data.startX - endX;
      let delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let flag = disX > delBtnWidth/2 ? true:false;
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = this.data.list;
      list[index].isMove = flag;
      //更新列表的状态
      this.setData({list: list});
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth(w) {
    let real = 0;
    try{
      let res = wx.getSystemInfoSync().windowWidth;
      let scale = (750/2)/(w/2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res/scale);
      return real;
    } catch(e) {
      return false;
    }
  },
  initEleWidth() {
    let delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({delBtnWidth: delBtnWidth});
  },
  //点击删除按钮事件
  delItem(e){
    let count = 0;
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    
    //选中的
    for (let i=0; i<list.length; i++) {
      if(list[i].isSelect == true){
        count++;
      }else{
        continue;
      }
    }
    this.setData({list: list,count: count});

    //请求删除
    let params = {
        scity: this.data.currentCity,
        unicode: this.data.token
    }
    utils.delete(Api.IP_APPOINTDELETE+"/"+this.data.list[index].id, params)
    .then(data =>{
      list.splice(index,1);
      this.setData({list: list,count: count});
      wx.showModal({content: data.data})}
    );
  },
  //预约
  yuyue() {
    let mid = {};
    let list = this.data.list;
    this.setData({select: []});

    for (let i=0; i<list.length; i++) {
      //选中的
      if(list[i].isSelect == true){
        if(this.data.select.indexOf(list[i]== '-1')){
          mid.scity = list[i].houseScity;
          mid.sdid = list[i].houseSdid;
          this.data.select.push(mid);
        }
      }else{
      //未选中的
        continue;
      }
    }

    if (this.data.count>0){
      wx.setStorageSync('currentPage', '待看列表');
      wx.redirectTo({url: "../houseDetail/lookHouse?select="+JSON.stringify(this.data.select)});
    }else{
      wx.showModal({content: '至少添加一个房源信息'});
    }
  }
})