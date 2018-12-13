 Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    order_content:[{
      img:'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846033073.jpg',
      commodity_name:'女青年色彩头像示范',
      commodity_price:'0.50',
      comm_num:'2'
    }],
    pay_type:0,
    selectpay: false,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    if ( options.url){
      this.setData({
        cart_ids: options.url
      }) 
    }else{
      this.setData({
        id: options.id,
        count: options.count,

      })
    }
    
    
   
    
  },
   // 单选框点击事件
   radioChange: function (e) {
     console.log('radio发生change事件，携带value值为：', e.detail.value);
     var pay_type = e.detail.value;
     console.log(pay_type, 787878);
     this.setData({
       pay_type: pay_type,
       selectpay: false
     })

   },
   //打开支付方式弹出层
   pay_style: function () {
     this.setData({
       selectpay: true
     })
   },
   closepay: function () {
     this.setData({
       selectpay: false
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
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/confirmShopOrder`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
       
      }
    })
    that.show_shop();
  },
 /**商品信息 */
 show_shop:function(){
var that=this; 
   console.log(that.data.cart_ids,6666)
   if (that.data.cart_ids){
     wx.request({
       url: `${getApp().globalData.baseUrl}/wechat/order/cartConfirmOrder`,
       data: {
         c_user_id: that.data.c_user_id,
         cart_ids: that.data.cart_ids
       },
       header: {},
       success: function (res) {
         console.log(res.data.data, 8976)
         var order_content = res.data.data;
         var cartList = order_content.cartList;
         var userAddress = order_content.userAddress;
         var c_user_vip = order_content.c_user_vip;
         var t_coupons = order_content.t_coupons
         var b = true;
         var coupons_null = 1;
         var isShow = false
         if (!t_coupons) {
           coupons_null = 0
         }
         if (userAddress) {
           b = false;
           isShow = true
         }
         console.log(order_content, 9080)
         that.setData({
           order_content: order_content,
           cartList: cartList,
           isNull: b,
           isShow: isShow,
           userAddress: userAddress,
           c_user_vip: c_user_vip,
           coupons_null: coupons_null,
           t_coupons: t_coupons
         })
       }
     })
   }else{
     wx.request({
       url: `${getApp().globalData.baseUrl}/wechat/order/commerceConfirmOrder`,
       data: {
         c_user_id: that.data.c_user_id,
         comm_num: that.data.count,
         commodity_id: that.data.id
       },
       header: {},
       success: function (res) {
         var order_content = res.data.data;
         var cartList = order_content.cartList;
         var userAddress = order_content.userAddress;
         var c_user_vip = order_content.c_user_vip;
         var t_coupons = order_content.t_coupons
         var b = true;
         var coupons_null = 1;
         var isShow=false
         if (!t_coupons) {
           coupons_null = 0
         }
         if (userAddress) {
           b = false;
           isShow=true
         }
         
         console.log(coupons_null,76767)
         console.log(order_content, 90909654)
         that.setData({
           order_content: order_content,
           cartList: cartList,
           isNull: b,
           isShow: isShow,
           userAddress: userAddress,
           c_user_vip: c_user_vip,
           t_coupons: t_coupons,
           coupons_null: coupons_null
         })
       }
     })


   }

 },
// 单选框点击事件
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var pay_type = e.detail.value;
    console.log(pay_type,787878);
    this.setData({
      pay_type: pay_type,
      selectpay: false
    })

  },
//打开支付方式弹出层
  pay_style:function(){
    this.setData({
      selectpay: true
    })
  },
  closepay:function(){
   this.setData({
  selectpay:false
})
},
  //添加备注
  remarks: function (e) {
    this.setData({
      remarks:e.detail.value
    })
  },
  preventTouchMove: function () {
  },
  bindText: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },

  

  // 跳转到'我的地址'
  myAddress: function (e) {
    wx.navigateTo({
      url: '../my_address/my_address',
    })
  },
 
/**确认支付 */
   toPay:function(e){
    var that = this;
   
    
    var remarks = that.data.remarks;
    console.log(that.data)
    if (!remarks) {
      remarks = '无'
    }
    if (!that.data.userAddress) {
      wx.showModal({
        title: '提示',
        content: '收货地址不能为空',
      })
      return false;
    }
    var t_coupons = that.data.t_coupons;
    var coupons_id = '';
    if (t_coupons) {
      coupons_id = t_coupons.coupons_id;
    }
     console.log(that.data.count,55555);
     var url = `${getApp().globalData.baseUrl}/wechat/order/toCommerceOrder`;
     if(that.data.cart_ids){
       url = `${getApp().globalData.baseUrl}/wechat/order/toCartOrder`;
     }
    wx.request({
      url: url,
      data: {
        eat_type: 3,
        address_id: that.data.userAddress.address_id,
        commodity_id: that.data.id,
        comm_num: that.data.count,
        coupons_id: coupons_id,
        remarks: remarks,
        c_user_id: that.data.c_user_id,
        pay_type: that.data.pay_type,
        cart_ids: that.data.cart_ids

      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        wx.showLoading({
          title: '支付中...',
        })
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
                          order_id: order_id,
                          id: getApp().globalData.distributor_id
                        },
                        success:function(res){
                       
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
                      wx.hideLoading()
                      wx.redirectTo({
                        url: '../order_details/order_details?url=' + order_id,
                      })
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
                wx.hideLoading()
                console.log(param.data,787878)
                console.log(order_id, 787878)
                if (param.data.code == 200) {
                  wx.request({
                    url: `${getApp().globalData.baseUrl}/wechat/order/orderPaySuccess`,
                    data: {
                      order_id: order_id,
                      id: getApp().globalData.distributor_id
                    },
                    success: function (res) {

                    }
                  })
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    success: function (res) {
                      wx.redirectTo({
                        url: '../order_details/order_details?url=' + order_id,
                      })
                    }
                  })

                } else if (param.data.code == 501) {
                  //if (param.data.code = 200) {
                    wx.showModal({
                      title: '提示',
                      content: '余额不足'
                    });
                  //}


                }
                wx.hideLoading()

              }

            });

          }

        } else if(res.data.code == 501){
          wx.showModal({
            title: '提示',
            content: '余额不足'
          });
          wx.hideLoading()
        } else if (res.data.code == 503) {
          wx.showModal({
            title: '提示',
            content: '库存不足啦~'
          });
          wx.hideLoading()
        }

      }
    });
  },

  check_sure:function(e){
    var time = e.target.dataset.time;
    this.setData({
      time: time
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