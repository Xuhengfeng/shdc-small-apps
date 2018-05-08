// pages/mine/mybuyhouse.js
Page({
  data: {
    startX: '',//设置触摸起始点水平方向位置
    num: 0,
    delBtnWidth: 110,
    list: [
      {txtStyle: 0},
      {txtStyle: 0},
      {txtStyle: 0},
      {txtStyle: 0},
      {txtStyle: 0},
      {txtStyle: 0},
      {txtStyle: 0}
    ],
  },
  onload() {

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
      let txt = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txt = "left:0px";
      }
      else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txt = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txt = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = this.data.list;
      list[index].txtStyle = txt;
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
      let txt = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.index;
      let list = this.data.list;
      list[index].txtStyle = txt;
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
    this.setData({list:list});
  }
})