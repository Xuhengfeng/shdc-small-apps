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
    isCancel: {//取消按钮
      type: Boolean,
      value: false
    },
    cancelText: {//取消文字
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
    scrollNum: {//标题栏渐变
      type: String,
      value: 0
    },
    isCenter: {//标题是否居中
      type: String,
      value: 'left'
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


  
  
