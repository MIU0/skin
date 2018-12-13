Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/user/getUserInfo`,
  data:{
    c_user_id: c_user_id

  },
  header:{},
  success:function(res){
    var c_user_info = res.data.data.c_user_info;
    var c_user_vip = c_user_info.c_user_vip
    console.log(c_user_info,66665);
    var no_vip=1
    if (!c_user_vip){
      no_vip=0
    }
    that.setData({
      c_user_vip: c_user_vip,
      c_user_info: c_user_info,
      no_vip: no_vip
    })
  }
})
  },
  /**跳转我的地址 */
  my_address:function(){
wx.navigateTo({
  url: '../my_address/my_address',
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