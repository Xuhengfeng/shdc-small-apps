const Api = require("../../utils/url");
const utils = require("../../utils/util");
const filter = require("../../utils/filter");

Page(filter.loginCheck({
  data: {
    selectFlag1: true,//出售
    selectFlag2: false,//出租    
    phcolorFlag: true,//城市
    phcolorFlag2: true,//经纪人
    phcolorFlag3: true,//小区
    phcolorFlag4: true,//房源信息 
    phcolorFlag5: true,//具体地址 
    phcolorFlag6: true,//申请人
    city: '选择您房源所在城市',
    broker: '选择跟进联系人',
    houseRimName: '房源所在的小区',
    houseInfoContent: '房源信息',
    address:"输入您的房源具体地址",
    useself: "选择业主/推荐人",
    useselfTypes: "OWNER",//默认业主
    houseRimId: '',//房源小区id
    brokerId: '',
    selectCity: '',//当前的定位城市
    requestType: ['RENT', 'SELL'],
    //出售 出租
    IPS: [Api.IP_APPLYSELLHOUSE, Api.IP_APPLYRENTHOUSE],
    num: 0,
    inputValue1: '',//姓名
    inputValue2: '',//电话
    banner: ''
  },
  onLoad() {
    utils.storage('selectCity')
    .then(res=>{
      this.setData({selectCity: res.data.vlaue});
      this.bannerRequest(0);
    })
  },
  bannerRequest(num) {
    //banner 出租 出售
    let types = ['WILL_HOUSE_SELL_BANNER', 'WILL_HOUSE_RENT_BANNER']
    utils.get(Api.IP_INDEXCONSULT + this.data.selectCity + '/' + types[num])
    .then(data=>{
      this.setData({ banner: data.data});
    })
  },
  //输入姓名
  bindKeyInput1(e) {
    this.setData({inputValue1: e.detail.value});
  },
  //输入电话
  bindKeyInput2(e) {
    this.setData({inputValue2: e.detail.value});
  },
  //出售
  selectOne() {
    this.setData({selectFlag1: true,selectFlag2: false,num: 0});
    this.bannerRequest(0);
  },
  //出租
  selectTwo() {
    this.setData({selectFlag1: false,selectFlag2: true,num: 1});
    this.bannerRequest(1);
  },
  //城市
  jumpCityList() {
    wx.navigateTo({url: '../location/location?origin=sellRent'});
  },
  //经纪人
  jumpBrokerList() {
    if(this.data.city == "选择您房源所在城市"){
      wx.showModal({
        content: '请先选着城市'
      })
    }else{
      wx.navigateTo({url: 'broker'});
    }
  },
  //房源所在的小区
  houseRim() {
    if(this.data.city == "选择您房源所在城市"){
      wx.showModal({content: '请先选着城市'});
    }else{
      wx.setStorageSync('xiaoquFlag', true);//标志是小区处点击进入到栋座号的
      wx.navigateTo({url: `sellRentArea?houseTypes=${this.data.num}`});
    }
  },
  //房源信息
  houseInfo() {
    try{
      if(wx.getStorageSync('xiaoqu')){
        let houseRimId = wx.getStorageSync('xiaoquId');
        wx.setStorageSync('xiaoquFlag', false);//标志是房源信息处点击进入到栋座号的
        wx.navigateTo({url:`sellRentArea1?houseRimId=${houseRimId}`});
      }else{
        wx.showModal({content: '请先选着小区'});
      }
    }catch(error){
      wx.showModal({content: '请先选着小区'});
    }
  },
  //提交
  commit(IP) {
      let params = {
        "cityCode": this.data.city,//城市编码
        "brokerId": this.data.brokerId,//经纪人id
        "linkman": this.data.inputValue1,//姓名
        "phone": this.data.inputValue2,//联系电话
        "buildingName": this.data.houseRimName,//小区名字
        "buildNum": this.data.houseInfoContent.split(' ')[0],//栋号
        "unitNum": this.data.houseInfoContent.split(' ')[1],//单元号
        "roomNum": this.data.houseInfoContent.split(' ')[2],//房号
        "address": this.data.address,//详细地址
        "unicode": wx.getStorageSync("userToken"),
        "applicantType": this.data.useselfTypes//我是
      }
      if (this.data.inputValue1 == '' || this.data.inputValue2 == '' ){
          wx.showModal({title: '信息填写不完整!'})
      }else{
        utils.post(this.data.IPS[this.data.num], params)
        .then(data=>{
          wx.navigateBack()
        });
      }
  },
  // 操作表
  showSheet() {
    wx.showActionSheet({
      itemList: ['业主', '推荐人'],
      success: res=> {
        if(res.tapIndex==0){
          this.setData({
            useself: '业主',
            useselfTypes: 'OWNER'
          });
        }
        else if(res.tapIndex==1){
          this.setData({
            useself: '推荐人',
            useselfTypes: 'RECMD_MAN'
          });
        }
      },
      fail: res=> {
        console.log(res.errMsg)
      }
    })    
  },
  //清空还原
  cancelback() {
    this.setData({
      broker: '选择跟进联系人',
      houseRimName: '房源所在的小区',
      houseInfoContent: '房源信息',
      address:"输入您的房源具体地址",
      useself: "业主/推荐人",
    })
  }
}))