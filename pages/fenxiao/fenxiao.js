Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/distributor/getDistributor`,
      data: {
        c_user_id: c_user_id
      },
      header: {},
      success: function(res) {
        console.log(res.data.data, 6666)
        var fx_info=res.data.data;
        var c_user_info = fx_info.c_user_info
        that.setData({
          fx_info: fx_info,
          c_user_info: c_user_info
        })
      }
    })
  },
  all_kh: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../my_fenxiao/my_fenxiao?url='+id,
    })
  },
  my_extend: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../my_extend/my_extend?url=' + id,
    })
  },
  my_friend:function(e){
    var id = e.currentTarget.dataset.id
    console.log(id,33333)
    wx.navigateTo({
      url: '../my_friend/my_friend?url='+id,
    })
  },
  my_djs:function(e){
    var status = e.currentTarget.dataset.status;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../my_extend/my_extend?status=' + status + '&url=' + id,
    })
  },
  js_money:function(e){
    var balance = e.currentTarget.dataset.balance
    wx.navigateTo({
      url: '../jiesuan/jiesuan?balance=' + balance,
    })
  },
  t_shop:function(e){
wx.switchTab({
  url: '../store_list/store_list',
})
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