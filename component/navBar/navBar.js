let Api = require("../../utils/url");
let app = getApp();

Component({
  properties: {
    area: {//区域
      type: Array,
      value: ''
    },
    houseTy: {//户型
      type: Array,
      value: ''
    },
    price: {//价格
      type: Array,
      value: ''
    },
    proportion: {//面积
      type: Array,
      value: ''
    },
    mode: {//类型
      type: Array,
      value: ''
    },
    use: {//用途
      type: Array,
      value: ''
    },
    houseAge: {//楼龄
      type: Array,
      value: ''
    },
    num: {//控制nav显示对应content
      type: Number,
      value: 5
    },
    keyword: {//关键词
      type: String,
      value: ''
    },
    showModalStatus: {//遮罩层
      type: Boolean,
      value: false
    }
   },
  created(){
    console.log('1111111111111111111111111')
    console.log(this.properties)
    console.log('1111111111111111111111111')
  },
  data: {
    //房源列表
    houseList: [],
    currentCity: '',

    page: 1,
    isScroll: true,
    scrollTop: 0,
    highSelectItem: false,//打开高亮
    
    //内部筛选条件
    areaCategories: 0,//区域分类
    areaCategoriesId: 0,//区域分类id(给后台的id）
    areaSubCategories: 0,//区域子分类
    areaSubCategoriesId: 0,//区域子分类id(给后台的id）

    //户型
    houseTypeCategories: 0,
    roomsNum: null,

    //价格
    priceCategories: 0,
    minPrice: null,
    maxPrice: null,

    //类型 二手房  租房 
    modeCategories: 0,
    modeCategoriesValue: null,

    //类型2 小区
    mode2Categories: 0,
    mode2CategoriesValue: null,

    //面积
    proportionCategories: 0,
    minBuildArea: null,
    maxBuildArea: null,
    
    //用途
    useCategories: 0,
    useCategoriesValue: null,
    
    //楼龄
    houseAgeCategories: 0,
    houseAgeCategoriesValue: null,


    //请求地址
    //二手房列表 租房列表 小区找房列表
    IPS: [Api.IP_TWOHANDHOUSE, Api.IP_RENTHOUSE, Api.IP_BUILDLIST],  
    IPSNUM: null,
    url: null,

    //显示 小区label 或  二手房 租房
    label: [], 
    twoHouseOrArea: true,
  },
  
  attached() {
    // 修正显示
    // 修正url
    this.setData({num: 5});
    let name = wx.getStorageSync('houseTypeSelect');
    if(name == '二手房') {
      this.setData({
        url: this.data.IPS[0],
        label: ["区域", "户型", "价格", "面积", "类型"],
        twoHouseOrArea: true,        
      });
    } else if (name == '租房') {
      this.setData({
        url: this.data.IPS[1],
        label: ["区域", "户型", "租金", "面积"],       
        twoHouseOrArea: true,        
      })
    }else if(name == '小区') {
      this.setData({
        url: this.data.IPS[2],
        label: ['区域', '用途', '类型', '楼龄'],
        twoHouseOrArea: false            
      })
    }    

    //第一页数据 首次请求
    wx.getStorage({
      key: 'selectCity',
      success: (res)=> {
        let params = {
            'pageNo': 1,
            'pageSize': 10,
            'scity': res.data.value,
            'keyword': this.data.keyword
        }
        //修正 当前城市
        this.setData({currentCity: res.data.value})
        this.getDataFromServer(this.data.url, params);
      }
    })
  },
  methods: {
    selectItem(e) {//控制nav菜单
      this.setData({
        num: e.target.dataset.index,
        isScroll: false,
        showModalStatus: true,
      });
    },
    cancelModal(e) {//取消
      this.setData({
        num: 5,
        isScroll: true,
        showModalStatus: false
      })
    },

    //请求二手房列表  租房列表 小区列表
    getDataFromServer(url, params) {
      app.httpRequest(url, params, (error, data)=>{
        let List = data.data.length?data.data:"";
        this.setData({houseList: List})
        let obj = {params: params, houseList: this.data.houseList}
        this.triggerEvent('myevent', obj);
      }, 'POST')
    },

    //切换城区分类
    changeCategories(e) {
      this.setData({
        areaCategories: e.target.dataset.num,
        areaCategoriesId: e.target.dataset.id,
        areaSubCategories: 0,
        scrollTop: 0
      })
      if (e.target.dataset.num == 0) {//第一列 不限
        let params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity
        }
        this.cancelModal();
        this.getDataFromServer(this.data.url, params);
      }
      
    },

    //切换城区子分类 进行请求
    changeSubCategories(e) {
      let id = e.target.dataset.num;
      let label = 'label['+0+']';
      this.setData({
        areaSubCategories: e.target.dataset.num,
        areaSubCategoriesId: e.target.dataset.id,
        highSelectItem: true,
        num: 0,
        // [label]: this.data.area[this.data.areaCategories].districts[id].name
      })
      let params;
      if (e.target.dataset.num == 0) {//第二列 不限
        params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'areaId': this.data.areaCategoriesId
        }
      } else {
        params = {
          'pageNo': 1,
          'pageSize': 10,
          'scity': this.data.currentCity,
          'districtId': this.data.areaSubCategoriesId,
          'areaId': this.data.areaCategoriesId
        }
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //户型
    changeHouseType(e) {
      let label = 'label[' +1 + ']';
      this.setData({
        houseTypeCategories: e.target.dataset.num,
        roomsNum: e.target.dataset.value,
        // [label]: this.data.houseType[e.target.dataset.num].name
      })
    },
    changeHouseTypeUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'roomsNum': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    changeHouseTypeTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'roomsNum': this.data.roomsNum
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //价格
    pricelabel(e) {
      let label = 'label[' + 2 + ']';
      this.setData({
        priceCategories: e.target.dataset.num,
        minPrice: e.target.dataset.minprice.value.split('-')[0],
        maxPrice: e.target.dataset.maxprice.value.split('-')[1],
        // [label]: this.data.price[e.target.dataset.num].name
      })
    },
    pricelabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minPrice': '',
        'maxPrice': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    pricelabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minPrice': this.data.minPrice,
        'maxPrice': this.data.maxPrice
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    minPrice(e) {
      this.setData({
        minPrice: e.detail.value
      })
    },
    maxPrice(e) {
      this.setData({
        maxPrice: e.detail.value
      })
    },

    //面积
    proportionlabel(e) {
      let label = 'label[' + 3 + ']';
      this.setData({
        proportionCategories: e.target.dataset.num,
        minBuildArea: e.target.dataset.minbuildarea.value.split('-')[0],
        maxBuildArea: e.target.dataset.maxbuildarea.value.split('-')[1],
        // [label]: this.data.proportion[e.target.dataset.num].name
      })
    },
    proportionlabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minBuildArea': '',
        'maxBuildArea': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    proportionlabelTrue(e) {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'minBuildArea': this.data.minBuildArea,
        'maxBuildArea': this.data.maxBuildArea
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //类型 二手房 租房
    modelabel(e) {
      let label = 'label[' + 4 + ']';
      this.setData({
        modeCategories: e.target.dataset.num,
        modeCategoriesValue: e.target.dataset.value,
        // [label]: this.data.mode[e.target.dataset.num].name
      })
    },
    modelabeUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseForm': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    modelabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseForm': this.data.modeCategoriesValue
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //用途
    uselabel(e) {
      let label = 'label[' + 1+ ']';
      this.setData({
        useCategories: e.target.dataset.num,
        useCategoriesValue: e.target.dataset.value,
        // [label]: this.data.mode[e.target.dataset.num].name
      })
    },
    uselabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'businessType': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    uselabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'businessType': this.data.useCategoriesValue
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },

    //类型2 小区
    modelabel2(e) {
      let label = 'label[' + 2 + ']';
      this.setData({
        mode2Categories: e.target.dataset.num,
        mode2CategoriesValue: e.target.dataset.value,
        // [label]: this.data.mode[e.target.dataset.num].name
      })
    },
    modelabe2Unlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseType': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    modelabel2True() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'houseType': this.data.mode2CategoriesValue
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
 
    //楼龄
    houseAgelabel(e) {
      let label = 'label[' + 1 + ']';
      this.setData({
        houseAgeCategories: e.target.dataset.num,
        houseAgeCategoriesValue: e.target.dataset.value,
        // [label]: this.data.mode[e.target.dataset.num].name
      })
    },
    houseAgelabelUnlimit() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'useYear ': ''
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    },
    houseAgelabelTrue() {
      let params;
      params = {
        'pageNo': 1,
        'pageSize': 10,
        'scity': this.data.currentCity,
        'useYear ': this.data.houseAgeCategoriesValue
      }
      this.cancelModal();
      this.getDataFromServer(this.data.url, params);
    }
  }
})


  
  
