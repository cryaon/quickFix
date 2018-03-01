Page({
    data: {
        title: ''
    },
    //事件处理函数
    bindViewTap: function(){
      wx.scanCode({
        success: (res) => {
          console.log(res);
          var date=new Date();
          this.setData({
            success:true,
            fix:JSON.parse(res.result),
            reason: date.toUTCString(date.getUTCDay())
          });
        }
      })
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '扫一扫'
        })
    },
})
