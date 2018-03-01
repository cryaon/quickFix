//index.js
//获取应用实例
var app = getApp()
var order = ['red', 'yellow', 'blue', 'green', 'red']
let animationShowHeight = 300
Page( {
  data: {
    userInfo: {},
    settings: '设置',
    devices:'设备管理',
    queryRecord:'查询报修记录',
    phone:'手机号码:',
    bindPhone: '绑定手机号码',
    record:'报修记录',
    bgUrl:'',

    animationData: "",
    showBottomPopup: false,

    toView: 'red',
    scrollTop: 100,

    /*下拉框数据*/
    goodsInfoIndexName: '请您选择',

    isShowSelectInfo: true,
    //遮罩层是否显示

    goodsInfo: [ //遮罩层样式

      {
        title:
          '温莎领也叫敞角领。', radioValue:
        '0', radioName: '单扣大开领'
      },
      //单扣大开领

      {
        title:
          '超大的开角，配以宽大的领结。', radioValue:
        '1', radioName: '单扣一字领'
      },//单扣一字领

      {
        title:
          '单扣小方领和标准领类似。', radioValue:
        '2', radioName: '单扣小方领'
      },//单扣小方领

      {
        image: '/image/qrcode.png', title:
          '圆角领也是一种个性十足的领子。', radioValue:
        '3', radioName: '单扣圆领'
      },//单扣圆领

      {
        title:
          '立领是只有领座没有翻领的领型。', radioValue:
        '4', radioName: '立领'
      },//立领

      {
         title:
          '迷你小方领和标准领类似。', radioValue:
        '5', radioName: '迷你小方领'
      },//迷你小方领

    ]
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 2000
    })
  wx.stopPullDownRefresh();
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '/logs/logs'
    })
  },
  //跳转到设备管理界面
  toDevices: function () {
    wx.navigateTo({
      url: '/devices/index'
    })
  },

  //查询是否已绑定号码
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  },

  //绑定号码
  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        animationShowHeight = res.windowHeight;
      }
    })
  },
  radioChangeNeck: function (e) {
    // 单选按钮点击样式
    var that = this
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    that.setData({
      showBottomPopup: !this.data.showBottomPopup,
      goodsInfoIndex: e.detail.value,
      goodsInfoIndexName: that.data.goodsInfo[e.detail.value].radioName,
    })
  },
  radioChangeNeckBind: function (e) {
    var that = this
    console.log('radio发生change事件，携带value值为：', e.currentTarget.dataset.name)
    that.setData({
      showBottomPopup: !this.data.showBottomPopup,
      goodsInfoIndex: e.currentTarget.dataset.name,
      goodsInfoIndexName: that.data.goodsInfo[e.currentTarget.dataset.name].radioName,
    })
  },
  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    }),
    wx.request({
      url: 'https://api.it120.cc/diandian/api/transmit/339',
      success: function (res) {
        that.setData({
          bgUrl: res.data.data
        });
      },
      fail: function(res){
        wx.showModal({
          title: '服务器错误',
          content: '获取背景图片失败',
          showCancel: false
        })
      }
    })
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  }
})
