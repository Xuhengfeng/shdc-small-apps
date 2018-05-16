const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    page:1,
    brokerId: null,
    brokerComment: [],//经纪人评论
  },
  onLoad(options) {
    let brokerId = options.id;
    this.setData({brokerId: options.id});
    this.onReachBottom();
  },
  //查看更多的评论
  lookMoreCommentRequest(params) {
    utils.get(Api.IP_BROKEREVALUATE,params)
    .then(data=>{
      data.data.forEach(item=>{
        item.grade = this.newStar(item.grade);
        item.tag = item.tag.split(',');
      })
      this.setData({brokerComment: this.data.brokerComment.concat(data.data)});
    })
  },
  //生成星星组合
  newStar(num) {
    let arr=[];
    for(let i=0;i<num;i++){
      arr.push(true);
    }
    for(let j=0;j<(5-num);j++){
      arr.push(false);
    }
    return arr;
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    let params = {
      pageNo: page,
      brokerId: this.data.brokerId
    }
    this.lookMoreCommentRequest(params);
  }
})