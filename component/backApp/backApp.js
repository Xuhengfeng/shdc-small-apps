const Api = require("../../utils/url");
const utils = require("../../utils/util");
Component({
  properties: {
    isXiaoqu: {//是否是小区详情
      type: Boolean,
      value: false
    }
  },
  data: {  
    
  },
  attached() {

  },
  methods: {
    backHome() {
      this.triggerEvent('myevent');
    },
    launchAppError: function(e) { 
      console.log(e.detail.errMsg) 
    }
  }
})


  
  
