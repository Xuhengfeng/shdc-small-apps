const Api = require("../../utils/url");
const utils = require("../../utils/util");
Page({
  data: {
    city: '',
    origin: ''
  },
  onLoad(options) {
    this.setData({origin: options.origin});
    let hot_city = "热门";
    let map = {"hot": {title: hot_city,item: []}}   
        map['hot'].item.push({
          'name': '南宁',
          'key': '',
          'value': 'nanning'
        })
        map['hot'].item.push({
          'name': '北海',
          'key': '',
          'value': 'beihai'
        })
      utils.get(Api.IP_CITYLIST)
      .then(data=> {
      data.data.forEach((obj, index) => {//城市数据 重新map排列
          const type = obj.value.slice(0, 1).toUpperCase();
          if(!map[type]) {
            map[type] = { title: type,item: []}
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
          this.setData({city: hot.concat(ret)});
      })
    });
  },
  input(e) {
    this.value = e.detail.value
  }
})