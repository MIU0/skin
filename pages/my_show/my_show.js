// pages/my_show/my_show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store_list:[
      {
        img_src:'../../images/img/bj.png',
        commerce_name:'小猪佩奇'
      },
       {
        img_src: '../../images/img/bj.png',
        commerce_name: '小猪乔治'
      },
       {
        img_src: '../../images/img/bj.png',
        commerce_name: '萌萌哒'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({
  id: options.url
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
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/art/getArtList`,
  data:{
    art_type:that.data.id
  },
  header:{},
  success:function(res){
var my_show=res.data.data;
    console.log(my_show,2222)
    var shopNull=0
    if (!my_show || my_show.length==0){
      shopNull=1
    }
    that.setData({
      my_show:my_show,
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