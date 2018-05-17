const utils = require("../../utils/util");
const bmap = require("../../libs/bmap-wx.min.js");//百度地图sdk
const pinyin = require("../../libs/toPinyin.js"); //汉字转拼音
const app = getApp();

Component({
  properties: {
    city: {
      type: Object,
      value: null,
      observer: 'resetRight'
    },
    myCity: {
      type: String,
      value: "..."
    },
    cityCode: {
      type: String,
      value: null
    },
    origin: {//判断那个页面跳入
      type: String,
      value: null
    },
    //用于外部组件搜索使用  meiyou
    search: {
      type: String,
      value: "",
      observer: function (newVal, oldVal) {
        this.value = newVal;
        this.searchMt();
      }
    }
  },
  data: {
    list: [],
    rightArr: [],// 右侧字母展示
    jumpNum: '',//跳转到那个字母
    myCityName: '请选择', // 默认我的城市,  
  },
  ready() {
    if (this.data.myCity) this.getCity();
  },
  methods: {
    resetRight(data) {// 数据重新渲染 
      let rightArr = []
      for (let i in data) {
        rightArr.push(data[i].title.substr(0, 1));
      }
      this.setData({list: data,rightArr})
    },
    getCity() {//定位
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          // 百度地图地址解析
          let BMap = new bmap.BMapWX({ak: '55An9ZpRGSA8v5Mw7uHxmONFCI3mkTW0'});
          // 发起regeocoding检索请求 
          BMap.regeocoding({
            location: res.latitude + ',' + res.longitude,//这是根据之前定位出的经纬度
            success: (data) => {
                  let citytoPinyin = data.originalData.result.addressComponent.city.slice(0, -1);
                  let lowCase = pinyin.Pinyin.getFullChars(citytoPinyin);
                  let currentCity = lowCase.toLowerCase();
                  let currentCityName = data.originalData.result.addressComponent.city.slice(0, -1);
                  this.setData({myCityName: currentCityName});
                  wx.setStorage({
                    key: 'currentCity',
                    data: {
                      name: currentCityName,
                      value: currentCity
                    }
                  });
            }
          });
        }
      })
    },
    jumpMt(e) {//右侧字母点击事件
      let jumpNum = e.currentTarget.dataset.id;
      this.setData({ jumpNum });
    },
    detailMt(e) {//列表点击事件  那个这里页面 没有options 
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      if (this.data.origin == "index") {
            prevPage.setData({
              myLocation: e.target.dataset.detail.name,
              scity: e.target.dataset.detail.value,
              currentCity: e.target.dataset.detail.value
            })
            prevPage.oneBigRequest(e.target.dataset.detail.value);//上一页重新加载数据
            wx.setStorage({key: 'houseTypeSelect',data: '二手房'})
            wx.setStorage({
              key: 'selectCity',
              data: {
                name: e.target.dataset.detail.name,
                value: e.target.dataset.detail.value
              },
              success: ()=> {wx.navigateBack()}
            });
      }else if (this.data.origin == "sellRent") {
        prevPage.setData({//直接给上移页面赋值
          city: e.target.dataset.detail.name,
          phcolorFlag: false
        });
        wx.navigateBack();//返回上一个页面
      }
    },
    input(e) {// 获取搜索输入内容
      this.value = e.detail.value;
    },
    searchMt() {// 基础搜索功能
      this._search();
    },
    _search() {
      let data = this.data.city;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        let itemArr = [];
        for (let j = 0; j < data[i].item.length; j++) {
            if (data[i].item[j].name.indexOf(this.value) > -1) {
              let itemJson = {};
              for (let k in data[i].item[j]) {
                itemJson[k] = data[i].item[j][k];
              }
              itemArr.push(itemJson);
            }
        }
        if (itemArr.length === 0) { continue };
        newData.push({
            title: data[i].title,
            type: data[i].type ? data[i].type : "",
            item: itemArr
        })
      }
      this.resetRight(newData);
    },
    locationMt(e) {// 定位城市点击选择
          let pages = getCurrentPages();//当前页面
          let prevPage = pages[pages.length - 2];//上一页面
          let lowCase = pinyin.Pinyin.getFullChars(e.target.dataset.detail);
          let currentCity = lowCase.toLowerCase();
          if(this.data.origin == "index") {
              prevPage.setData({
                num: 0,
                myLocation: e.target.dataset.detail,
                currentCity: currentCity
              });
              utils.storage('currentCity')
              .then((res)=>{
                  wx.setStorage({
                    key: 'selectCity',
                    data: {
                      name: e.target.dataset.detail,
                      value: res.data.value
                    }
                  });
                  wx.setStorage({key: 'houseTypeSelect',data: '二手房'});
                  prevPage.oneBigRequest(res.data.value);
                  wx.navigateBack();
              })
          }else if(this.data.origin == "sellRent") {
              prevPage.setData({city: e.target.dataset.detail,phcolorFlag: false});
              wx.navigateBack();
          }
        }
  }
})
