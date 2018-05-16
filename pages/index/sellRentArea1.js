Page({
  data: {
    buildingBlock: [],//栋座
  },
  onLoad(options) {
    let name = options.id;
    if (name == 'houseRim') {
      this.setData({ estate: true, buildingBlock: false, unit: false, roomNumber: false });
    } else {
      this.setData({ estate: false, buildingBlock: true, unit: false, roomNumber: false });
    }
  },
  //栋座号请求
  //选着栋座号
  selectItem1() {
    console.log(111);
    this.setData({ buildingBlock: false, unit: true });
  },

  //单元号请求
  //选着单元号
  selectItem2() {
    console.log(22)
    this.setData({ buildingBlock: false, unit: false, roomNumber: true });
  },
  //门牌号请求
  //选着门牌号请求
  selectItem3() {
    console.log(33)
  },
  //小区请求
  //选着小区
  selectItem4() {
    console.log(44)
  }
})