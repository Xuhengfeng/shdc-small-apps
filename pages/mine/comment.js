// IP_BROKEREVALUATE
const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    brokerCommentInfo: [],//经纪人评论
  },
  onLoad(options) {
    
  },
  //经纪人评价信息列表
  brokerCommentInfoRequest() {
    utils.get(Api.IP_BROKEREVALUATE)
    .then(data=>{
      
    })
  }
})