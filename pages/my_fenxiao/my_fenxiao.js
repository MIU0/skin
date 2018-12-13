// pages/my_fenxiao/my_fenxiao.js
var util = require('../../utils/util.js');
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
this.setData({
  id:options.url
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
var that=this;
    console.log(that.data.id,21212)
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/distributor/getMyFans`,
  data:{
    id:that.data.id
  },
  header:{},
  success:function(res){
var new_my_fans=res.data.data
    console.log(new_my_fans,9999)
    var shopNull=0
    if (!new_my_fans || new_my_fans.length==0){
      shopNull=1
    }
    for (var i = 0; i < new_my_fans.length; i++) {
      var my_fans = new_my_fans[i]["create_time"]
      new_my_fans[i]["create_time"] = util.formatTime(new Date(my_fans));
    }
that.setData({
  my_fans: new_my_fans,
  shopNull: shopNull
})
  }
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