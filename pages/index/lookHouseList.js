const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    startX: '',//设置触摸起始点水平方向位置
    count: 0,
    delBtnWidth: 110,
    list: [],
    select: [],//用户选中的房源 isMove是否移动  isSelect是否选着
    // list: [
    //   {isMove: false, isSelect: true},
    //   {isMove: false, isSelect: true},
    //   {isMove: false, isSelect: true},
    //   {isMove: false, isSelect: true},
    //   {isMove: false, isSelect: true},
    //   {isMove: false, isSelect: true},
    // ],
  },
  onLoad() {
    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        wx.getStorage({
          key: 'userToken',
          success: (response)=> {
            let token = response.data
            let params = {
              scity: res.data.value,
              pageNo: 1,
              unicode: token
            };
            utils.get(Api.IP_DETAILLIST,params)
            .then((data)=>{
              console.log(data.data)
              this.setData({list: data.data})
            });
          }
        })
      }
    })
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
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch(e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth() {
    let delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({delBtnWidth: delBtnWidth});
  },
  //点击删除按钮事件
  delItem(e){
    //获取列表中要删除项的下标
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index,1);
    //更新列表的状态
    let count = 0;
    for (let i=0; i<list.length; i++) {
      //选中的
      if(list[i].isSelect == true){
        count++;
      }else{
        continue;
      }
    }
    this.setData({list: list,count: count});

    //请求删除
  // }else{
  //   count = this.data.count - 1;      
  //   wx.getStorage({
  //     key: 'userToken',
  //     success: (res)=>{
  //       let params = {
  //         scity: this.data.currentCity,
  //         unicode: res.data,
  //         // id: this.data.houseDetailId
  //       }
  //       wx.request({
  //         url: Api.IP_DETAILLIST+'/'+this.data.houseDetail.id,
  //         data: params,
  //         header: {
  //           'unique-code': params.unicode
  //         },
  //         method: 'DELETE',
  //         success: (res)=> {
  //             console.log(res)
  //         }
  //       })
  //       // utils.delete(Api.IP_DETAILLIST, params)
  //       // .then(()=>{});
  //     }
  //   })
  },
  //预约
  yuyue() {
    let list = this.data.list;
    let factoryObj = {};
    this.setData({select: []});
    for (let i=0; i<list.length; i++) {
      //选中的
      if(list[i].isSelect == true){
        if(this.data.select.indexOf(list[i]== '-1')){
          factoryObj.scity = list[i].houseScity;
          factoryObj.sdid = list[i].houseSdid;
          this.data.select.push(factoryObj);
        }
      }else{
      //未选中的
        continue;
      }
    }
    wx.navigateTo({url: "../houseDetail/lookHouse?select="+JSON.stringify(this.data.select)});
  }   
})