const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    star: [//默认的灰色的星星5个
      { isStar: true },
      { isStar: true },
      { isStar: true },
      { isStar: true },
      { isStar: true }
    ],
    star1: '../../images/star-off.png',//红色的星星
    star2: '../../images/star-on.png',//灰色的星星
    tags: [
      {isSelect:false,name:'专业知识很强',value:'1'},
      {isSelect:false,name:'服务态度很好',value:'2'},
      {isSelect:false,name:'了解市场并给出实用建议',value:'3'},
      {isSelect:false,name:'对房源了解并能清晰讲解',value:'4'},
      {isSelect:false,name:'看房很高效',value:'5'},
      {isSelect:false,name:'了解法律与政策',value:'6'},
    ],
    item: null,
    content: null,//评价的内容
    num: null,
    grade: 0,//评分 ---> 星级
  },
  onLoad(options) {
    this.setData({item: JSON.parse(options.item)});
    this.tagsRequest();
  },
  //选着星星
  selectStar(e) {
    this.resetStar();    
    let len = e.target.dataset.index+1;
    for(let i=0;i<len;i++){
      this.data.star[i].isStar=false;
    }          
    this.setData({star: this.data.star,grade: len});
  },
  //选着标签
  selectTag(e) {
    let index = e.currentTarget.dataset.index;
    this.data.tags[index].isSelect = !this.data.tags[index].isSelect;
    this.setData({tags: this.data.tags})
  },
  //重置默认的星星
  resetStar() {
    this.data.star.forEach((item)=>{
      item.isStar = true;
    })
    this.setData({star: this.data.star});
  },
  //评价经纪人标签
  tagsRequest() {
    utils.get(Api.IP_DICTIONARYCONDITION+"BROKER_EVALUATE_TAG")
    .then(data=>{
      this.setData({tags: data.data})
    })
  },
  //评价的内容
  bindTextAreaBlur(e) {
    this.setData({content: e.detail.value}); 
  },
  //提交
  commitRequest() {
    let tagStr='';
    this.data.tags.forEach((item)=>{
      if(item.isSelect){
        tagStr += item.value + ",";
      }
    })
    let params = {
      "appHouseRecId": this.data.item.id,
      "brokerId": this.data.item.brokerId,
      "content": this.data.content,
      "grade": this.data.grade,
      "tag": tagStr,
      "unicode": wx.getStorageSync("userToken")
    }
    utils.post(Api.IP_FILLBROKEREVALUATE,params)
    .then(data=>{
      wx.showModal({
        content: "非常感谢您的评价!",
        success:(res)=>{
          if(res.confirm){
            wx.navigateBack();
          }
        }
      })
    })
  }
})