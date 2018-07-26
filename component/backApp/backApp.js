const Api = require("../../utils/url");
const utils = require("../../utils/util");
Component({
  properties: {

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


  
  
