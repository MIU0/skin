
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_content: [
      {
        img: 'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846033073.jpg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      status: options.status
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
/**跳转订单详情 */
  order_details:function(e){
    var aa = e.currentTarget.dataset.id
wx.navigateTo({
  url: '../order_details/order_details?url='+aa,
})
  },
  guangguang:function(){
wx.switchTab({
  url: '../store_list/store_list',
})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id,
    })
    console.log(that.data.status,90909)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getCommAndTranOrderList`,
      data:{
        c_user_id: c_user_id,
        status: that.data.status
      },
      header:{},
      success:function(res){
        var order_content=res.data.data;
        console.log(order_content,888)
        var shopNull = 0;
        if (!order_content || order_content.length == 0) {
          shopNull = 1;
        }
        var my_arr=[];
        for (var i = 0; i < order_content.length; i++) {
          my_arr.push(order_content[i].commodity_infoList[0].img_src);
        }

        that.setData({
          order_content: order_content,    
          shopNull: shopNull,
          my_arr: my_arr
        })
      }

    })
  },
/**打开所有商品 */
  open_order:function(e){
    var order_id=e.currentTarget.dataset.order_id;
    console.log(order_id)
    var order_content=this.data.order_content;
    for (var i = 0; i < order_content.length;i++){
      var id=order_content[i].order_id;
      if (order_id==id){
        var  reserved1=order_content[i]['reserved1'];
        
        order_content[i]['reserved1'] = reserved1=='1'?'0':'1';
      }
    }
    
    this.setData({
      order_content: order_content
    })

  },
/**提醒发货 */
  remind:function(e){
    var that=this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    
    var index=e.currentTarget.dataset.index;
    var order_content=that.data.order_content;
    order_content[index].store_id=1;
    that.setData({
      c_user_id: c_user_id,
      order_content: order_content
    })
    var order_id = e.currentTarget.dataset.order_id
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/remindOrder`,
      data:{
        order_id: order_id,
        c_user_id: c_user_id
      },
      header:{},
      success:function(res){
        wx.showLoading({
          title: '已提醒卖家',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    })
  },
  //取消订单
  quxiao: function (e) {
    var that = this;
    wx.showModal({
      title: '您已取消订单',
      success: res => {

        if (res.confirm) {
          // 
          var order_id = e.currentTarget.dataset.order_id;
          console.log(order_id,1111);
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/order/updateCommerceOrder`,
            data: {
              status: 7,
              order_id: order_id
            },
            header: {
              'content-type': 'application/json'  // 默认值
            },
            success: function (res) {
              //在提示的成功函数中初始化当前加载订单页为第一页，清空订单列表数据
              //this.setData({ currentPage: 1, orderList: [] });
              //用onLoad周期方法重新加载，实现当前页面的刷新
               var status = e.target.dataset.status;
              console.log(status, 9090)
              wx.request({
                url: `${getApp().globalData.baseUrl}/wechat/order/getCommAndTranOrderList`,
                data: {
                  status: status,
                  c_user_id: that.data.c_user_id
                },
                header: {
                  'content-type': 'application/json'  // 默认值
                },
                success: function (res) {
                  var order_content = res.data.data;
                  that.setData({
                    order_content: order_content
                  })
                  // that.order_a();
                }
              })
            }
          })

        } else {
          console.log('用户点击取消')
        }
      }
    });


  },
  /**待付款付款 */
  mypay:function(e){
    wx.showLoading({
      title: '支付中...',
    })
    var order_id = e.currentTarget.dataset.order_id;
    //var eat_type = e.currentTarget.dataset.eat_type;
    var openId = (wx.getStorageSync('openId'));
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/pay/weChatPay`,
      data: {
        openid: openId,
        order_id: order_id
      },
      success: function (param) {
        wx.hideLoading()
        wx.requestPayment({
          'timeStamp': '' + param.data.data.timeStamp,
          'nonceStr': '' + param.data.data.nonceStr,
          'package': '' + param.data.data.package,
          'signType': 'MD5',
          'paySign': '' + param.data.data.paySign,
          'success': function (res) {
            // console.log(res);
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/order/orderPaySuccess`,
              data: {
                order_id: order_id,
                id: getApp().globalData.distributor_id
              },
              success: function (res) {

              }
            })
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });

          },
          'fail': function (res) {
            console.log("支付失败");
          },
          'complete': function (res) {
            console.log("pay complete");
            wx.hideLoading()
              wx.navigateTo({
                url: '../order_details/order_details?url=' + order_id,
              })


          }
        })
      }
    })
  },
  /**确认收货 */
  store_sure:function(e){
    var that = this;
    wx.showModal({
      title: '确认收货',
      success: res => {

        if (res.confirm) {
          // 
          var order_id = e.currentTarget.dataset.order_id;
          console.log(order_id, 1111);
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/order/updateCommerceOrder`,
            data: {
              status: 4,
              order_id: order_id
            },
            header: {
              'content-type': 'application/json'  // 默认值
            },
            success: function (res) {
              //在提示的成功函数中初始化当前加载订单页为第一页，清空订单列表数据
              //this.setData({ currentPage: 1, orderList: [] });
              //用onLoad周期方法重新加载，实现当前页面的刷新
              var status = e.target.dataset.status;
              console.log(status, 9090)
              wx.request({
                url: `${getApp().globalData.baseUrl}/wechat/order/getCommAndTranOrderList`,
                data: {
                  status: status,
                  c_user_id: that.data.c_user_id
                },
                header: {
                  'content-type': 'application/json'  // 默认值
                },
                success: function (res) {
                  var order_content = res.data.data;
                  that.setData({
                    order_content: order_content
                  })
                  // that.order_a();
                }
              })
            }
          })

        } else {
          console.log('用户确认收货')
        }
      }
    });


  },
  /**评价 */
  order_evaluate:function(e){
    var aa = e.currentTarget.dataset.order_id;
    var index = e.currentTarget.dataset.index;
    var my_arr=this.data.my_arr;
    console.log(my_arr);
    wx.navigateTo({
      url: '../order_evaluate/order_evaluate?url=' + aa + '&img_url=' + my_arr[index],
    })
  },
  order_a: function () {
    var that = this;
    var status = that.data.status;
    if (status == 9) {
      status = '';
    }
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getOrderList`,
      data: {
        status: status,
        c_user_id: that.data.c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function (res) {
        var order_content = res.data.data;

        //  my_orders.push(new_my_order)
        // console.log(new_my_order, 55)
        var my_choose = 0;
        if (!order_content || order_content.length == 0) {
          my_choose = 1;
        }
        

        that.setData({
          order_content: order_content,
          my_choose: my_choose,
        })

      }
    })

  },
  /**查看物流 */
  my_logs: function (e) {
    var aa = e.currentTarget.dataset.order_id;
    console.log(aa, 88888)
    wx.navigateTo({
      url: '../my_logs/my_logs?url=' + aa,
    })
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