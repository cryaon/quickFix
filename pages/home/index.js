//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {

    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://cn.bing.com/az/hprichbg/rb/StubenamAlberg_ROW9779481183_1920x1080.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],


    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1200,
    showActionModal: false,
    showFormInput: false,
    limitReasonLen:'140',
    reasonMaxLen: '140',
    fixTime: '请选择日期',
    buildingIndex: 0,
    classroomIndex: 0,
    index: 0,
    buildingArr:['请选择教学楼'],
    classroomObjArr: [
      {
        id: 12,
        name: '请选择教室'
      }
    ],
  },
  buildingPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为(数组ID)', e.detail.value)
    this.setData({
      buildingIndex: e.detail.value
    })
  },
  classroomPickerChange: function (e) {
    console.log('教室picker发送选择改变，携带值为(数组ID)', e.detail.value)
    this.setData({
      classroomIndex: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  swiperchange: function(e) {
    //FIXME: 当前页码
    //console.log(e.detail.current)
  },
  //显示扫码或手动输入设备信息选项
  showAction: function(){
    this.setData({
      showActionModal: true
    })
  },
  inputData:function(){
    this.setData({
      showFormInput:true
    });
    this.hideActionModal();
  },

  /*调用二维码扫描*/
  sc_code: function () {
      wx.scanCode({
        success: (res) => {
          console.log(res);
          var date = new Date();
          this.setData({
            showFormInput: true,
            fix: JSON.parse(res.result),
            //reason: date.toUTCString(date.getUTCDay())*/
          });
          this.hideActionModal();
        }
      });
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideActionModal: function () {
    this.setData({
      showActionModal: false
    });
  },
  //字数统计
  countWords:function(e){
    var value=e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.reasonMaxLen)
      return;
    this.setData({
      limitReasonLen: this.data.reasonMaxLen - len //剩余字数  
    });      
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      fixTime: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  queryDevice:function(){

  },
  onLoad: function() {
    console.log( 'onLoad' )
    var that=this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
        that.setData( {
        userInfo: userInfo
      })
    })

    wx.request({
      url: "http://localhost:8080/QuickFix2/queryAllBuilding",
      header: {
        'Content-Type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        if(res.statusCode=200){
          console.log('教学楼查询结果：',res.data),
          that.setData({
            buildingArr: res.data //把json数据赋值给变量buildingArr
          })
        }else{
          wx.showToast({
            title: '当前页面发生错误，请刷新重试',
            icon: 'failed',
            duration: 2000
          })
        }
      }
    })
  }
})
