var app = getApp();
let api = require('../../utils/url.js');

Page({
  data: {
    city: null
  },
  selectCity(e) {
    var pages = getCurrentPages();//当前页面路由栈的信息
    var currPage = pages[pages.length - 1];//当前页面
    var prevPage = pages[pages.length - 2];//上一个页面
    console.log(e)
    // detail
    wx.setStorage({
      key: 'selectCity',
      data: {
        name: e.detail.name,
        value: e.detail.value
      },
      success: ()=> {
        prevPage.setData({
          myLocation: e.detail.name,
          scity: e.detail.value
        })
        prevPage.oneBigRequest(e.detail.value);//上一页重新加载数据
        wx.navigateBack();//返回上一个页面
      }
    });
  }, 
  onLoad() {
    let hot_city = "热门";
    let hot_city_len = 2;
    let map = {
        "hot": {
            title: hot_city,
            item: []
        }
    }
    app.httpRequest(api.IP_CITYLIST, 'GET', (err, data)=> {
        data.data.forEach((obj, index) => {//城市数据 重新map排列
              if(index < hot_city_len) {
                map['hot'].item.push({
                  'name': obj.name,
                  'key': obj.value.slice(0, 1).toUpperCase(),
                  'value': obj.value
                })
              }
              const type = obj.value.slice(0, 1).toUpperCase();
              if(!map[type]) {
                map[type] = {
                  title: type,
                  item: []
                }
              }
              map[type].item.push({
                'name': obj.name,
                'key': obj.value.slice(0, 1).toUpperCase(),
                'value': obj.value
              })
              let hot = [], ret = [];
              for(let key in map) {
                let val = map[key];
                if(val.title.match(/[a-zA-Z]/)) {
                  ret.push(val)
                }else if(val.title === hot_city) {
                  hot.push(val)
                }
              }
              ret.sort((a, b)=> {
                return a.title.charCodeAt() - b.title.charCodeAt()
              })
              this.data.city = hot.concat(ret);
              this.setData({city: this.data.city});
        })
    });
  },
  input(e) {
    this.value = e.detail.value
  },
  searchMt() {
    //当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value) {this.value = ''}
    this.setData({value: this.value})
  }

})