// pages/cash/cash.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        //index:'0',
        name: 'weixin',
        value: '微信'
      },
      {
        //index: '1',
        name: 'ZFB',
        value: '支付宝',
        checked: 'true'
      },
      {
        //index:'2',
        name: 'card',
        value: '银行卡'
      }
    ],
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      balance: options.balance
    })
  },
  radio_select: function(e) {
    var index = e.currentTarget.dataset.index
    console.log(index, 8888888)
    this.setData({
      index: index
    })
  },
  formSubmit: function(e) {
    var that = this;
    const value = e.detail.value;
    console.log(value.price, 9999999)
    var balance = that.data.balance
    console.log(balance, 4444)

    if (value.price && value.account) {
      if (parseFloat(value.price) > parseFloat(balance)) {
        wx.showModal({
          title: '提示',
          content: '余额不足，请重新输入',
        })
        return false
      } else if (parseFloat(value.price) == 0) {
        wx.showToast({
          title: '金额不能为零',
          icon: "none"
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '即将提交，请确认信息是否正确',
          showCancel: true, //是否显示取消按钮
          cancelText: "否", //默认是“取消”
          confirmText: "是", //默认是“确定”
          confirmColor: 'green', //确定文字的颜色
          success: function(res) {
            if (res.confirm) {
                wx.request({
                  url: getApp().globalData.baseUrl + '/wechat/distributor/toDrawimg',
                  data: {
                    'distributor_id': getApp().globalData.my_distributor_id,
                    'Type': that.data.index,
                    'price': e.detail.value.price,
                    'account': e.detail.value.account
                  },
                  header: {},
                  success: function (res) {
                    if (res.data.code == 200) {
                      wx.showToast({
                        title: '已提交申请，审核中...',
                        icon:"none",
                        duration:2000,
                        success:function(res){
                          console.log(1111)
                        }
                      })
                      setTimeout(function () {
                        wx.redirectTo({
                          url: '../fenxiao/fenxiao',
                        });
                      }, 2000)
                      
                         
                        
                      
                     
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '提交异常',
                        showCancel: true,
                      })
                    }     
                  }
                })
             
            }else{
              wx.showToast({
                title: '已取消提现',
                icon:"none"
              })
            } 
          }
        })

      }

    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  },
  all_cash: function(e) {
    var balance = this.data.balance
    this.setData({
      price: balance
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})