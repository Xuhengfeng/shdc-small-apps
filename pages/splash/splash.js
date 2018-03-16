var page = {
    data: {
        animationData: {}
    },
    onShow: function () {
        // // 页面显示的时候的动画
        var animation = wx.createAnimation({
            duration: 6000,
            timingFunction: 'linear',
            transformOrigin: "0 0",
        })

        this.animatin = animation

        animation.translateY(0).step()

        this.setData({
            animationData: animation.export(),
        })

        setTimeout(function () {
          animation.translateY(160).step()
            this.setData({
                animationData: animation.export(),
            })
        }.bind(this), 1000)
     

    },
    //点击的方法
    skipToMain() {
      wx.switchTab({
        url: "../index/index",
      })
    }

}

Page(page)


