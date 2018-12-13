// pages/my_extend/my_extend.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_extend:[
      {
        number:'E2018112914345200'
      },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status){
      this.setData({
        id: options.url,
        status: options.status
      })
    }else{
      this.setData({
        id: options.url,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  qguang:function(){
wx.switchTab({
  url: '../store_list/store_list',
})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
var that=this;
    var status=that.data.status;
    if (!status){
      status='';
    }
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/distributor/getAllOrders`,
  data:{
    id:that.data.id,
    status: status
  },
  header:{},
  success:function(res){
    var new_my_extend=res.data.data;
    console.log(new_my_extend,666)
    var shopNull=0
    if (!new_my_extend || new_my_extend.length==0){
      shopNull=1
    }
    //var commodity_infoList = new_my_extend.t_order.commodity_infoList
    for (var i = 0; i < new_my_extend.length; i++) {
      var my_extend = new_my_extend[i]["create_time"]
      new_my_extend[i]["create_time"] = util.formatTime(new Date(my_extend));
    }
    that.setData({
      my_extend: new_my_extend,
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