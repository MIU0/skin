
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay_type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      translate_id: options.url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    
    // console.log(that.data.translate_id,99999)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getTranslateDetail`,
      data:{
        translate_id: that.data.translate_id
      },
      header:{},
      success:function(res){

var new_video_pay=res.data.data;
        new_video_pay.create_time = util.formatTime(new Date);        
that.setData({
  video_pay: new_video_pay
})
      }
    })
  },
  /**确认支付 */
  toPay: function (e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    
    console.log(that.data)  
    var t_coupons = that.data.t_coupons;
    var coupons_id = '';
    if (t_coupons) {
      coupons_id = t_coupons.coupons_id;
    }
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/translateOrder`,
      data: {
        eat_type: 4,  
        coupons_id: coupons_id,
        translate_id: that.data.translate_id,
        c_user_id:c_user_id,
        pay_type: 0,

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        console.log(res.data.data, 999999)
        if (res.data.code == 200) {
          var order_id = res.data.data.order_id;
          if (that.data.pay_type == 0) {
            var openId = (wx.getStorageSync('openId'));
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/pay/weChatPay`,
              data: {
                openid: openId,
                order_id: order_id
              },
              success: function (param) {
                console.log(param.data);
                console.log(param.data.data.timeStamp);
                console.log(param.data.data.nonceStr);
                console.log(param.data.data.package);
                console.log(param.data.data.paySign);
                wx.requestPayment(
                  {
                    'timeStamp': '' + param.data.data.timeStamp,
                    'nonceStr': '' + param.data.data.nonceStr,
                    'package': '' + param.data.data.package,
                    'signType': 'MD5',
                    'paySign': '' + param.data.data.paySign,
                    'success': function (res) {
                      wx.request({
                        url: `${getApp().globalData.baseUrl}/wechat/order/orderPaySuccess`,
                        data: {
                          order_id: order_id
                        },
                        success: function (res) {

                        }
                      })
                      console.log(res);
                      wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000
                      });
                    },
                    'fail': function (res) {
                      wx.request({
                        url: `${getApp().globalData.baseUrl}/wechat/order/orderPayFail`,
                        data: {
                          order_id: order_id
                        },
                        success: function (res) {

                        }
                      })
                      console.log("支付失败");
                    },
                    'complete': function (res) {
                      console.log("pay complete")
                      // wx.redirectTo({
                      //   url: '../video_details/video_details?url=' + that.data.translate_id,
                      // })
                      wx.navigateBack({})
                    }
                  })
              }
            })
          } else {
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/pay/balancePay`,
              data: {
                order_id: order_id
              },
              success: function (param) {
                if (param.data.code = 200) {
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    success: function (res) {
                      wx.redirectTo({
                        url: '../video_details/video_details?url=' + that.data.translate_id,
                      })
                    }
                  })

                } else if (param.data.code = 501) {
                  if (param.data.code = 200) {
                    wx.showModal({
                      title: '提示',
                      content: '余额不足'
                    });
                  }
                }

              }

            });

          }

        }

      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})