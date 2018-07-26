const Api = require("../../utils/url");
const utils = require("../../utils/util");
Component({
  properties: {
    isFlag: {//是否是小区详情或者对应的应用场景
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


  
  
