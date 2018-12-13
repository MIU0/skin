var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '00',
    h: '00',
    m: '00',
    s: '00',
    order_content:[
      {
        img:'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846033073.jpg'
      }
    ],
    init:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.url
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
    var init = that.data.init;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getCommerceOrderDetails`,
      data:{
        order_id: that.data.order_id
      },
      header:{},
      success:function(res){
var order_details_con=res.data.data;
       
        var new_t_order = order_details_con.t_order;
        var t_store_info = order_details_con.t_store_info;
        var recordList = order_details_con.t_order.recordList;
        var overtime = order_details_con.overtime;
        new_t_order.order_time = util.formatTime(new Date(new_t_order.order_time));
        new_t_order.pay_time = util.formatTime(new Date(new_t_order.pay_time));
        console.log(order_details_con, 9089);
        
        that.setData({
          order_details_con: order_details_con,
          t_order: new_t_order,
          t_store_info: t_store_info,
          recordList:recordList,
          overtime: overtime
        }) 
        if (init) {
           (init);
        }
        init=setInterval(aaa, 1000);
        that.setData({
          init:init
        })
        function aaa() {
          //console.log(overtime,878787)
          var time = parseInt((overtime - new Date().getTime()) / 1000);
          // console.log(time, 222)
          if (time > 0) {
            var s = parseInt(time % 60);
            time = time / 60;
            var m = parseInt(time % 60);
            time = time / 60;
            var h = parseInt(time % 24);
            var day = parseInt(time / 24);
            //console.log(toNum(day) + ':' + toNum(h) + ':' + toNum(m) + ":" + toNum(s), 98765);
            that.setData({
              day: toNum(day),
              h: toNum(h),
              m: toNum(m),
              s: toNum(s)
            })
          }

        }
        function toNum(num) {

          if (num < 10) {
            num = "0" + num;
          }

          return num;
        }  
      }
       
    })
  },

  
  /**退款 */
  refund: function (e) {
    var aa = e.currentTarget.dataset.order_id;
    console.log(aa, 88888)
    wx.navigateTo({
      url: '../refund/refund?url=' + aa,
    })
  },
  /**订单有疑问 */
  order_question:function(){
wx.navigateTo({
  url: '../order/order',
})
  },
  /**时间倒计时*/
  show_time:function(){
    
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