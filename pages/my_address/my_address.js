Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_left: [
    

    ],
    windows_out: false, //弹出层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

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
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/getAddressList`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {

        //var address_left = []
        var newaddress_left = res.data.data;
        //address_left.push(newaddress_left);
        //console.log(address_left, 111)
        var shopNull=0
        if (!newaddress_left || newaddress_left.length==0){
          shopNull=1
        }
        that.setData({
          address_left: newaddress_left,
          shopNull: shopNull
        })
      }
    })
  },
  // 新增地址
  addAddress: function() {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  // 修改地址
  editAddress: function(e) {
    var param = e.currentTarget.dataset.address_id;
    wx.navigateTo({
      url: '../add_address/add_address?address_id=' + param,
    })
  },
  //删除地址
  delAddress: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.address_id, 999)
    if (e.currentTarget.dataset.status == 1) {
      wx.showModal({
        title: '提示',
        content: '该地址为默认地址，不可删除',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确认要删除吗',
        success: function(sm) {
          if (sm.confirm) {
            wx.showLoading({
              title: '加载中...',
            })
            wx.request({
              url: `${getApp().globalData.baseUrl}/wechat/user/deleteAddress`,
              data: {
                address_id: e.currentTarget.dataset.address_id
              },
              success: function(res) {
wx.hideLoading();
                console.log(res.data);
                that.onShow()
              }

            })
          } else if (sm.cancel) {

          }

        }
      })
    }



  },
  //单选框
  setDefault: function(e) {
    var that = this;
    console.log(e.detail.value);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/updateStatus`,
      data: {
        address_id: e.detail.value,
        c_user_id: that.data.c_user_id
      },

      success: function(res) {
        that.onShow()
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