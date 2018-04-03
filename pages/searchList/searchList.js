var Api = require("../../utils/url");
const app = getApp();

Page({
  data: {
    label: [],
    houseList: [],//房源列表

    area: [],//区域
    houseType: [],//户型
    price: [],//价格
    proportion: [],//面积
    mode: [],//类型
    use: [],//用途
    houseAge: [],//楼龄

    num: null,//控制nav菜单
    modalFlag: false,
    page: 1,//首页数据
    showModalStatus: false,//遮罩层
    scrollTop: 0,
    flagPrice: true,
    flagTwoHouse: true,
    togglelabel: true,
   

    //区域  (户型 类型 面积)  价格标签
    IPS: [Api.IP_AREADISTRICTS, Api.IP_DICTIONARY, Api.IP_DICTIONARYCONDITION],

    //二手房列表 租房列表 小区找房列表
    IPS2: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE, Api.IP_BUILDLIST], 
    ipNum: 0,
    
    showload: false,
    hasMore: false,
    currentCity: '',
    keyword: '', //关键词
    params: {},
  },
  onLoad(options) {
    // 修正title
    wx.setNavigationBarTitle({
      title: options.houseType,
    })
     

    // 修正url keyword label 
   if(options.houseType == '二手房') {
     wx.setStorage({
       key: 'houseTypeSelect',
       data: '二手房',
       success: ()=>{
        this.setData({
            label: ["区域", "户型", "价格", "面积", "类型"],
            keyword: options.keywords,
            flagPrice: true,
            flagTwoHouse: true,
            ipNum: 0
        });
       }
     })
   }else if(options.houseType == '租房') {
     wx.setStorage({
       key: 'houseTypeSelect',
       data: '租房',
       success: ()=>{
         this.setData({
            label: ["区域", "户型", "租金", "面积"],
            keyword: options.keywords,
            flagPrice: false,
            flagTwoHouse: true,
            ipNum: 1
         });
       }
     })
   }else if(options.houseType == '小区找房' || options.houseType == '小区') {//小区找房
      wx.setStorage({
        key: 'houseTypeSelect',
        data: '小区',
        success: ()=>{
          this.setData({
              label: ['区域', '用途', '类型', '楼龄'],
              keyword: options.keywords,
              flagTwoHouse: false,
              ipNum: 2
          });
        }
      })
   }

    //获取筛选条件
    wx.getStorage({
      key: 'selectCity',
      success: (res)=>{
        //修正 当前的城市
        this.setData({currentCity: res.data.value})

        //区域
        this.areaRequest(res.data.value);

        //户型 类型 面积 用途 楼龄
        this.houseTypeRequest();

        //价格
        this.priceAreaRequest(res.data.value);
        
        //用途
        //楼龄

      }
    })
     
  },
  //区域
  areaRequest(currentCity) {
    app.httpRequest(this.data.IPS[0] + currentCity, 'GET', (error, data) => {
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
  //户型 类型 面积 用途 楼龄
  houseTypeRequest() {
    wx.request({
      url: this.data.IPS[1],
      data: ['HOUSE_HUXING', 'HOUSE_TYPE', 'HOUSE_AREA', 'HOUSE_USE','HOUSE_AGE'],
      method: 'POST',
      success: (res)=> {
        
        this.setData({
          houseType: res.data.data.HOUSE_HUXING,
          mode: res.data.data.HOUSE_TYPE,
          proportion: res.data.data.HOUSE_AREA,
          use: res.data.data.HOUSE_USE,
          houseAge: res.data.data.HOUSE_AGE
        })
        console.log(this.data.use)
      }
    })
  },
  //价格
  priceAreaRequest(currentCity) {
    wx.request({
      url: this.data.IPS[2] + 'SELL_PRICE/' + currentCity,
      data: '',
      method: 'GET',
      success: (res) => {
        this.setData({ price: res.data.data });
      }
    })
  },
  //用途
  useRequest( ) {

  },
  //楼龄
  houseAge() {

  },


  //请求数据
  getDataFromServer(IP, page, code) {
    this.setData({
      showload: true,
      hasMore: true
    })
    wx.request({
      url: IP,
      data: this.data.params,
      method: "POST",
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode == 200) {
          
          //修正数据
          res.data.data.forEach((item) => {
            console.log(item)
            if(item.houseTag) {
              item.houseTag = item.houseTag.split(',');
            }
          })
          this.setData({
            houseList: this.data.houseList.concat(res.data.data),
            showload: false,
            hasMore: false
          })
          this.data.ipNum == 0 ? this.setData({ flagPrice: true }) : this.setData({ flagPrice: false });
        }else{
          wx.showModal({
            title: '提示',
            content: '服务器异常',
            success: ()=> {
              this.setData({
                showload: false,
                hasMore: false
              })
            }
          })
        }
      }
    })
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
  //获取用户输入关键字
  userSearch(e) {
    this.setData({
      keyword: e.detail.value,
    })
  },

  //开始检索
  startsearch() {
    if (!this.data.keyword) {
      wx.showModal({
        content: '请输入关键词'
      })
    }
    this.setData({
      showload: true,
      hasMore: true,
    })
    wx.request({
      url: this.data.IPS2[this.data.ipNum],
      data: {
        'pageNo': 1,
        'pageSize': 10,
        'keyword': this.data.keyword,
        'scity': this.data.currentCity
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.length) {
          //修正数据
          res.data.data.forEach((item) => {
            if (item.houseTag) {
              item.houseTag = item.houseTag.split(',');
            }
          })
          this.setData({
            houseList: res.data.data,
            showload: false,
            hasMore: false
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '暂时没有找到数据',
            success: () => {
              this.setData({
                houseList: '',
                showload: false,
                hasMore: false
              })
            }
          })
        }
      }
    })
  },
  searchSubmit() {
    this.startsearch();
  },
  onShow() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  //上拉加载更多
  onReachBottom() {
    var pageNo = this.data.page++;
    this.getDataFromServer(this.data.IPS2[this.data.ipNum], pageNo, this.data.currentCity);
  }

})

