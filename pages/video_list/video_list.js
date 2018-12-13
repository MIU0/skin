var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
/**跳转详情 */
  video_details:function(e){
    var aa = e.currentTarget.dataset.id
    //  console.log(aa, 55555)
    wx.navigateTo({
      url: '../video_details/video_details?url=' + aa,
    })
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
    var that=this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getAllTranslateType`,
      data:{},
      header:{},
      success:function(res){
        console.log(res.data.data,878787);
        var new_all_type=res.data.data;
        var translateList2=[];
        for (var i = 0; i < new_all_type.length;i++){
          var new_translateList = new_all_type[i].translateList
          for (var j = 0; j < new_translateList.length; j++) {
            var translateList = new_translateList[j]["create_time"]
            new_translateList[j]["create_time"] = util.shortTime(new Date(translateList));
          }
          translateList2.push(new_translateList);
        }
        
        console.log(translateList2,9999)
        
        that.setData({
          all_type: new_all_type,
          translateList: translateList2
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