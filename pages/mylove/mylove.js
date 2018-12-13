Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_store: [
      {
        store_img: 'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846023648.jpg',
        store_name: '【助力联考 全场五折】 《造型的高度-素描》',
        store_price: '64.00'
      },
      {
        store_img: 'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846013044.jpg',
        store_name: '【助力联考 全场五折】 《超越联考色彩》',
        store_price: '59.00'
      },
      {
        store_img: 'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846011313.jpg',
        store_name: '【助力联考 全场五折】 《精彩色调》',
        store_price: '48.00'
      }
    ],
    count: 1,
    store_pop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**跳转商品详情 */
  store_details: function (e) {
    var aa = e.currentTarget.dataset.id
    console.log(aa, 87868)
    wx.navigateTo({
      url: '../shop_details/shop_details?url=' + aa,
    })
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
      url: `${getApp().globalData.baseUrl}/wechat/user/getUserCollection`,
      data: {
        c_user_id:c_user_id
      },
      header: {},
      success: function (res) {
        var all_store = res.data.data;
        console.log(all_store, 8079)
        var shopNull=0
        if (!all_store || all_store.length==0){
          shopNull=1
        }
        that.setData({
          all_store: all_store,
          shopNull: shopNull
        })
      }
    })
  },
  /**弹出层 */
  gouwu_pop: function (e) {
    this.setData({
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
        // console.log(res.data.data, 787878);
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
    this.setData({
      store_pop: false
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