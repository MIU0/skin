var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playIndex: null,//用于记录当前播放的视频的索引值
    courseList: [{
      duration: '你好年后', //视频时长
    }],
    cover_close: true, //弹出层
    discover:'0',
    // hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      translate_id: options.url,
     
    })
    wx.showLoading({
      title: '加载中...',
    })
  },
  /**跳转留言页面 */
  leave_text:function(e){
    var aa = e.currentTarget.dataset.id;
    // console.log(aa,65656565)
    var reserved1 = e.currentTarget.dataset.reserved1;
    console.log(reserved1, 65656565)
    if (reserved1==0){
      wx.showModal({
        title: '提示',
        content: '购买后才能写留言哟~',
      })
    }else{
      wx.navigateTo({
        url: '../video_leave/video_leave?url=' + aa,
      })
    }

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
    //var that=this;
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getTranslateDetail`,
      data: {
        translate_id: that.data.translate_id,
        c_user_id: c_user_id
      },
      header: {

      },
      success: function (res) {
        wx.hideLoading()
        var new_courseList = res.data.data;
        console.log(new_courseList, 999999);
        new_courseList.create_time = util.formatTime(new Date(new_courseList.create_time));
        var discover = new_courseList.reserved1
        if (discover == 1) {
          that.setData({
            cover_close: false
          })
        }
        that.setData({
          courseList: new_courseList,
          discover: discover
        })
      }
    })
  },
/**遮罩层 */
  preventTouchMove: function () {
  },
  cover_video: function () {
    
  },

  videoPlay: function (e) {
    var curIdx = e.currentTarget.dataset.index;
    console.log(curIdx,8888)
    // 没有播放时播放视频
    if (!this.data.playIndex) {
      this.setData({
        playIndex: curIdx
      })
      var videoContext = wx.createVideoContext('video' + curIdx) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
      if (this.data.playIndex != curIdx) {
        videoContextPrev.pause()
      }
      this.setData({
        playIndex: curIdx
      })
      var videoContextCurrent = wx.createVideoContext('video' + curIdx)
      videoContextCurrent.play()
    }
  },
  /**购买视频跳转 */
  video_pay:function(e){
    var aa=e.currentTarget.dataset.id;
    console.log(aa,777)
    wx.navigateTo({
      url: '../video_pay/video_pay?url='+aa,
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