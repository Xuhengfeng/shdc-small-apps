const Api = require("../../utils/url");
const utils = require("../../utils/util");
Component({
  properties: {
    statusBarHeight: {//状态栏
      type: Number,
      value: 20
    },
    text: {//标题
      type: String,
      value: '世华易居'
    },
    isPublic: {//标题栏
      type: Boolean,
      value: true
    },
    isBack: {//返回键
      type: Boolean,
      value: true
    },
    isStatusBar: {//单独显示状态栏
      type: Boolean,
      value: false
    }
  },
  data: {  
    
  },
  methods: {
    backPage() {
      wx.navigateBack();
    }
  }
})


  
  
