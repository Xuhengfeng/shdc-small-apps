var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    //轮播图
    imgUrls: [],

    //为你推荐
    recommend: [],

    label: [], 
    scrollTop: 0,
    cityCode: null,
    tone:'rgba(249,249,249,0)',//头部渐变色值
    houseDetail: null,//房源详情
    flagPrice: true,
    page: 1,

    isShow: 'hidden',//nav是否显示
    showModalStatus: false,//遮罩层
    
    navNum: null, //菜单
    recmd: [Api.IP_HOUSERECMDLIST, Api.IP_RENTRECMDLIST], //推荐
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE],//列表
    showload: false,
    houseList: [],//房源列表
    area: [],//区域
    houseType: [],//户型
    price: [],//价格或者租金
    proportion: [],//面积
    mode: [],//类型
    num: 0,//修正ip的
    keyword: null,//获取用户输入值
  },
  onLoad(options) {
    //初始化
    let name = wx.getStorageSync('houseTypeSelect');
    wx.setNavigationBarTitle({title: name});
    if(name == '二手房') {
      this.setData({
        houseDetail: name,
        flagPrice: false,
        num: 0,
        label: ["区域", "户型", "价格", "面积", "类型"]
      });
    } else if (name == '租房') {
      this.setData({
        houseDetail: name,
        flagPrice: true,
        num: 1,
        label: ["区域", "户型", "租金", "面积"]
      });
    }

    wx.getStorage({
      key: 'selectCity',
      success: (res) => {
        this.setData({cityCode: res.data.value});
        
        // banner图片
        app.httpRequest(Api.IP_INDEXCONSULT + res.data.value + "/HOUSE_USED_BANNER", 'GET', (error, data) => {//获取主页资讯Banner
            this.setData({ imgUrls: data.data })
        });

        //为你推荐
        app.httpRequest(this.data.recmd[this.data.num] + res.data.value, 'GET', (error, data) => {//获取主页资讯Banner
            this.setData({ recommend: data.data })
        });

        //区域
        this.areaRequest(res.data.value);

        //户型 类型
        this.houseTypeRequest();

        //价格 面积
        this.priceAreaRequest(res.data.value);
      }
    })
  },
  //区域
  areaRequest(currentCity) {
    app.httpRequest(Api.IP_AREADISTRICTS + currentCity, 'GET', (error, data) => {
      data.data.unshift({
        name: '不限',
        districts: []
      });
      var newData = data.data;
      newData.forEach((item) => {
        item.districts.unshift({
          name: '不限',
          px: '',
          py: ''
        })
      })
      this.setData({ area: newData });
    })
  },
  //户型 类型
  houseTypeRequest() {
    wx.request({
      url: Api.IP_DICTIONARY,
      data: ['HOUSE_HUXING', 'HOUSE_USE', 'HOUSE_AREA'],
      method: 'POST',
      success: (res) => {
        this.setData({
          houseType: res.data.data.HOUSE_HUXING,
          mode: res.data.data.HOUSE_USE,
          proportion: res.data.data.HOUSE_AREA
        })
      }
    })
  },
  //价格 租金
  priceAreaRequest(currentCity) {
    if (this.data.flagPrice) {//租金
      wx.request({
        url: Api.IP_DICTIONARYCONDITION + 'HOUSE_RENTAL/' + currentCity,
        method: 'GET',
        success: (res) => {
          this.setData({ price: res.data.data });
        }
      })
    }else{//价格
      wx.request({
        url: Api.IP_DICTIONARYCONDITION + 'SELL_PRICE/' + currentCity,
        method: 'GET',
        success: (res) => {
          this.setData({ price: res.data.data });
        }
      })
    }
  },
  //页面滚动监听
  onPageScroll(res) {
    let percent = res.scrollTop / 300;
    let changeTone = 'rgba(249,249,249,' + percent + ')';
    this.setData({
      tone: changeTone//头部渐变色值 
    })
    if(res.scrollTop>330) {
        this.setData({
          isShow: 'visible'
        })
    }else{
      this.setData({
        isShow: 'hidden'
      })
    }
   
  },
  selectItem(e) {//控制nav菜单
    wx.pageScrollTo({
      scrollTop: 350,
      duration: 0
    })
    this.setData({
      navNum: e.target.dataset.index,
      showModalStatus: true,
      tone: "rgba(249, 249, 249, 1)"
    })
  },
  userSearch(e) {//用户输入关键字
    this.setData({
      keyword: e.detail.value,
    })
  },
  startsearch() {//点击icon搜索
    if (!this.data.keyword) {
      wx.showModal({ content: '请输入关键词' });
    } else {
      wx.getStorage({
        key: 'houseTypeSelect',
        success: (res) => {
          wx.navigateTo({
            url: "../searchList/searchList?houseType=" + res.data + "&keywords=" + this.data.keyword
          })
        }
      })
    }
  },
  searchSubmit() {
    if (!this.data.keyword)  {
      wx.showModal({content: '请输入关键词'});
    }else{
      wx.getStorage({
        key: 'houseTypeSelect',
        success: (res)=> {
          wx.navigateTo({
            url: "../searchList/searchList?houseType=" + res.data+"&keywords="+this.data.keyword
          })
        }
      })
    }
  },
  //监听事件 拿到首次 或 点击筛选条件的第一页数据
  onMyEventHouseList(item) {
    setTimeout(() => {
      //修正数据
      item.detail.houseList.forEach((item2) => {
        console.log(item2)
        if (item2.houseTag) {
          item2.houseTag = item2.houseTag.split(',');
        }
      })
      this.setData({
        houseList: item.detail.houseList,
        params: item.detail.params
      })
    }, 500)
  },
  onReachBottom() {
    var page = this.data.page++;
    let IP = this.data.IPS[this.data.num];
    let Params = {
        pageNo: 1,
        pageSize: 10,
        keyword: '',
        scity: this.data.cityCode
    }
    this.getDataFromServer(IP, Params);
  },
  getDataFromServer(IP, Params) {//请求数据
    this.setData({
      showload: true,
      hasMore: true
    })
    wx.request({
      url: IP,
      data: Params,
      method: "POST",
      header: {'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode == 200) {
          res.data.data.forEach((item) => {
            item.houseTag = item.houseTag.split(',');
          })
          this.setData({
            houseList: this.data.houseList.concat(res.data.data),
            hasMore: false,
            showload: false
          })
          if(this.data.num == 0) {
            this.setData({ flagPrice: true })
          }else{
            this.setData({ flagPrice: false })
          }
        }
        if(res.statusCode == 500) {
          this.setData({
            houseList: '',
            hasMore: false,
            showload: false
          })
          wx.showModal({content: '服务器异常'})
        }
      },
      fail: ()=> {
        this.setData({
          houseList: '',
          hasMore: false,
          showload: false
        })
      }
    })
  }
})

