// pages/my_friend/my_friend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distributor_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id:options.url
    })
wx.showLoading({
  title: '加载中...',
})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },

  //保存图片
  saveImg: function (e) {
    var that = this;
    var times = that.data.timeend - that.data.timestart;
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success: function (res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              console.log("授权成功");
              var imgUrl = that.data.extension_img;
              wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
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
    that.test();
  },
  test: function() {
    
    var that = this;
    var distributor_id=that.data.id
    var scene =null;
    if (distributor_id){
      scene = decodeURIComponent("dis_id=" + distributor_id);
    }else{
      scene = decodeURIComponent("dis_id=none");
    }
     
    console.log(scene,976);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/distributor/getExtensionImg`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        c_user_id: that.data.c_user_id,
        sceneStr: scene,
        page: 'pages/no_fenxiao/no_fenxiao'
      },
      success: function(res) {
        wx.hideLoading();
        var path = res.data.data;
        var extension_img = path.extension_img
        console.log(res.data.data, 99999)
        that.setData({
          path: path,
          extension_img: extension_img
        })
      }
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