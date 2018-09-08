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
      value: ''
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
    },
    styleNum: {//控制样式
      type: Number,
      value: 1
    },
    scrollNum: {
      type: String,
      value: 0
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


  
  
