const Api = require("../../utils/url");
const utils = require("../../utils/util");
Component({
  properties: {
    area: {//区域
      type: Array,
      value: ''
    }
   },
  data: {  
    //租房查询请求参数
    params2: {
      "areaId": null,
      "districtId": null,
      "keyword": "",
      "maxBuildArea": null,
      "maxRentPrice": null,
      "minBuildArea": null,
      "minRentPrice": null,
      "pageNo": null,
      "pageSize": null,
      "roomsNum": null,
      "scity": ""
    }
  },
  
  attached() {
    // 修正显示
    // 修正url
    
  },
  methods: {
    selectItem(e) {//控制nav菜单
      this.setData({num: e.target.dataset.index,showModalStatus: true});
    }
   
})


  
  
