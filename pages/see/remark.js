const Api = require("../../utils/url");
const utils = require("../../utils/util");
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    num: 1,
    tags: [],
    currentCity: null,
    content: null,
    seeHouseItem: null
  },
  onLoad(options) {
    this.setData({seeHouseItem: JSON.parse(options.item)});
    console.table(JSON.parse(options.item))
    utils.storage('selectCity')
    .then(res=>{
        this.setData({currentCity: res.data.value});
    })
    //添加房源备注
    this.tagsRequest();
  },
  //获取填写看房备注
  bindTextAreaBlur(e) {
    this.setData({content: e.detail.value}); 
  },
  //添加房源备注标签
  tagsRequest() {
    utils.get(Api.IP_DICTIONARYCONDITION+"USER_REMARK_TAG")
    .then(data=>{
      this.setData({tags: data.data})
    })
  },
  //提交看房备注
  commitRequest() {
    let tagStr='';
    this.data.tags.forEach((item)=>{
      if(item.isSelect){
        tagStr += item.value + ",";
      }
    })
    let params={
      "id": this.data.seeHouseItem.id,
      "memberRemark": this.data.content,
      "remarkTag": tagStr,
      "scity": this.data.currentCity,
      "unicode": wx.getStorageSync("userToken")
    }
    utils.post(Api.IP_FILLMEMBERMARK,params)
    .then(data=>{
      this.setData({tags: data.data})
      wx.navigateBack();
    })
  },
  //选着标签
  selectTag(e) {
    let index = e.currentTarget.dataset.index;
    this.data.tags[index].isSelect = !this.data.tags[index].isSelect;
    this.setData({tags: this.data.tags})
  },
  
})