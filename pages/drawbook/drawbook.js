Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_list: [],
    store_pop: false,
    count: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      type_id:options.url
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
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getAllCommerce`,
      data: {
        commerce_type: that.data.type_id
      },
      header: {},
      success: function (res) {
        var store_list = res.data.data;
        console.log(store_list, 8079);
        var shopNull=0
        if (!store_list || store_list.length==0){
          shopNull=1
        }
        that.setData({
          store_list: store_list,
           shopNull: shopNull
        })
      }
    })
  },
  /**弹出层 */
  gouwu_pop: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
      store_pop: true
    })
    var that = this;
    var commerce_id = e.currentTarget.dataset.id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getCommerceDetail`,
      data: {
        commerce_id: commerce_id
      },
      header: {},
      success: function (res) {
        console.log(res.data.data, 787878);
        var store_pop = res.data.data;
        that.setData({
          store_pop: store_pop
        })
      }
    })
  },
  preventTouchMove: function () {

  },
  close_gouwu: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        store_pop: false
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
    })
  },
  /**添加购物车 */
  my_add: function (e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })

    var comm_num = e.currentTarget.dataset.count;
    var commodity_id = e.currentTarget.dataset.id
    console.log(commodity_id, 1111)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/addShopToCart`,
      data: {
        comm_num: comm_num,
        c_user_id: c_user_id,
        commodity_id: commodity_id

      },
      header: {},
      success: function (res) {
        wx.showToast({
          title: '加入购物车成功',
        })
      }
    })

  },
  /**立即购买 */
  buy_now: function (e) {
    var count = e.currentTarget.dataset.count;
    var id = e.currentTarget.dataset.id
    console.log(id, 322)
    wx.navigateTo({
      url: '../create_order/create_order?count=' + count + '&id=' + id,
    })
  },
  /**加商品 */
  addtap: function () {
    var that = this;
    that.setData({
      count: ++that.data.count
    })
  },
  subtracttap: function () {
    var that = this;
    var count = that.data.count
    if (count > 1) {
      count--
    }
    that.setData({
      count: count
    })
  },
  /**跳转商品详情 */
  shop_details: function (e) {
    var aa = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop_details/shop_details?url=' + aa,
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