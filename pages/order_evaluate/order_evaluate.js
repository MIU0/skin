Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 0,//最少字数
    max: 200, //最多字数 (根据自己需求改变) 
    img_a: [{
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }, {
      id: 5
    }],
    starId_a: 0,
    starId_b: 0,
    starId_c: 0,
    src1: '../../images/star_select.png',
    src2: '../../images/star.png',
    loadhidden: true
  },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });

  },
  //点击右边,整颗星
  selecta: function (e) {
    console.log(e.currentTarget.dataset.index,9090)
    
    var starId_a = e.currentTarget.dataset.index;
    
    this.setData({
      starId_a: starId_a
    })
  },
  selectb: function (e) {
    console.log(e.currentTarget.dataset.index, 9090)

    
    var starId_b = e.currentTarget.dataset.index;
    
    this.setData({
      
      starId_b: starId_b
      
    })
  },
  selectc: function (e) {
    console.log(e.currentTarget.dataset.index, 9090)  
    var starId_c = e.currentTarget.dataset.index;
    this.setData({    
      starId_c: starId_c
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_id: options.url,
      img_url: options.img_url
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

  },
  submit_leave:function(e){
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id,
    })
    const value = e.detail.value;
    console.log(value.describe, 88888888)
    if (value.describe) {
      this.setData({
        loadhidden: false
      });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/evaluate/addEvaluate`,
      data: {
        'c_user_id': that.data.c_user_id,
        'order_id': that.data.order_id,
        'match_score': that.data.starId_a,
        'logistics_score': that.data.starId_b,
        'attitude_score': that.data.starId_c,
        't_describe': e.detail.value.describe
      },
      header: {},
      success: function (res) {
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              that.setData({
                content: '',
                loadhidden: true
              })
              wx.navigateBack({
                
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '提交异常',
            showCancel: true,
          })
        }
      }
    })
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
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