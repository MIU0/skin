// pages/my_integral/my_integral.js
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
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    // setTimeout(function () {
      
    // }, 2000)
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
    });
      //console.log(999)
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/vip/checkVip`,
        data: {
          c_user_id: c_user_id
          
        },
        header: {
        },
        success: function (res) {
          wx.hideLoading()
          //console.log(res.data.data, 99999);
          var vip_information = res.data.data;
          var shopNull = 1
          if (vip_information) {
            shopNull = 0
          }
          that.setData({
            shopNull: shopNull
          })

        }
      })
   
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/vip/getInteRecordList`,
      data:   {
        c_user_id: c_user_id,
        rows: 5
      },
      header: {},
      success: function(res) {
        var my_integral = res.data.data;
        var new_recordList = my_integral.recordList
        //console.log(my_integral, 87678)
        for (var i = 0; i < new_recordList.length; i++) {
          var recordList = new_recordList[i]["create_time"];
          new_recordList[i]["create_time"] = util.formatTime(new Date(recordList))
        }
        that.setData({
          my_integral: my_integral,
          recordList: new_recordList,
        })
      }
    })
  },
go_shop:function(){
  wx.navigateTo({
    url: '../person_important/person_important',
  })
},
integral_list:function(){
  wx.navigateTo({
    url: '../my_integral_list/my_integral_list',
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