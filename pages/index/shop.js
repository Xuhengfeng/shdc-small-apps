const Api = require("../../utils/url");
const utils = require("../../utils/util");

Page({
  data: {
    keyword: null,//获取用户输入值
    shops: [],
    hasMore: true,
    page: 1,
    //当前选定的城市
    city: '',
    //用户当前位置 py px
    lat1: '',
    lng1: ''
  },
  onLoad() {
    //定位用户当前位置
     wx.getLocation({
      type: 'gcj02',
      success: (res) => {
          this.setData({lat1: res.latitude,lng1: res.longitude});
          //门店信息
          utils.storage('selectCity')
          .then(res2=>{
            this.setData({city: res2.data.value});
            let params = {pageNo: 1, scity: res2.data.value};
            this.lookShopsRequest(params);
          })
      }
    })
  },
  telphone(e) {//拨打电话
    if(e.target.dataset.tel){
      wx.makePhoneCall({phoneNumber: e.target.dataset.tel})
    }else{
        wx.showModal({
          content: '号码不存在',
        })
    }
  },
  purpose(e) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        //导航
        wx.openLocation({
          latitude: e.target.dataset.item.py,
          longitude: e.target.dataset.item.px,
          scale: 15,
          name: e.target.dataset.item.addr,
          address: e.target.dataset.item.deptName
        })
      }
    })
  },
  //用户输入关键字
  userSearch(e) {
    this.setData({keyword: e.detail.value})
  },
  //icon点击搜索
  //键盘回车搜索
  startsearch() {
    this.setData({page: 1,shops: [],hasMore: true});
    let params = {pageNo: 1, scity: this.data.city, keyword: this.data.keyword};
    this.lookShopsRequest(params);
  },
  //门店
  lookShopsRequest(params) {
    let lat1 = this.data.lat1;
    let lng1 = this.data.lng1;
    utils.post(Api.IP_SHOPS, params)
    .then(data=> {
      if(!data.data.length) this.setData({hasMore: false});
      data.data.forEach((item)=> {
        let lat2 = item.py;
        let lng2 = item.px;
        item.distance = (this.getFlatternDistance(lat1,lng1,lat2,lng2) / 1000).toFixed(2);
      })
      this.setData({shops: this.data.shops.concat(data.data)});
    })
  },
  //计算两点距离
  getFlatternDistance(lat1,lng1,lat2,lng2){
    var f = this.getRad((lat1 + lat2)/2);
    var g = this.getRad((lat1 - lat2)/2);
    var l = this.getRad((lng1 - lng2)/2); 
    var sg = Math.sin(g);
    var sl = Math.sin(l);
    var sf = Math.sin(f); 
    var s,c,w,r,d,h1,h2;
    var a = 6378137;
    var fl = 1/298.257; 
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf; 
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s; 
        return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
  },
  getRad(d){
    return d*Math.PI/180.0;
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.page++;
    let params = {
      pageNo: page,
      keyword: this.data.keyword,
      scity: this.data.city
    }
    this.lookShopsRequest(params);
  }
})