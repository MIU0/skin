// pages/no_fenxiao/no_fenxiao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    fenxiao_pop: false,
    disabled: false,
    phone_code: '获取验证码',
    parent_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let distributor_id = scene.split("&")[0];
      console.log(distributor_id, 11111);
      distributor_id=distributor_id.split("=")[1];
      getApp().globalData.distributor_id = distributor_id;
      //`${getApp().globalData.distributor_id}`
      this.setData({
        parent_id: distributor_id
      })
      //其他逻辑处理。。。。。
    }

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
      url: `${getApp().globalData.baseUrl}/wechat/distributor/getDistributor`,
      data: {
        c_user_id: c_user_id
      },
      header: {},
      success: function (res) {
        console.log(res.data.data, 767678);
        if (res.data.data) {
          wx.redirectTo({
            url: '../fenxiao/fenxiao'
          })
        }
      
        
      }
    });
  },

  phone_num: function(e) {
    var value = e.detail.value;
    console.log(value, 666);
    this.setData({
      phone: value
    })
  },
  name_text: function(e) {
    var value = e.detail.value;
    console.log(value, 777);
    this.setData({
      name: value
    })
  },
  code_num: function(e) {
    var value = e.detail.value;
    console.log(value, 777);
    this.setData({
      code: value
    })
  },
  /**获取验证码 */
  get_num: function(e) {
    var that = this;
    var phone = that.data.phone;
    if (!phone) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
        showCancel: false
      })
      return false;
    }
    var time = 60;
    that.setData({
      phone_code: '60秒后重发',
      disabled: true
    })
    var Interval = setInterval(function() {
      time--;
      if (time > 0) {
        that.setData({
          phone_code: time + '秒后重发'
        })
      } else {
        clearInterval(Interval);
        that.setData({
          phone_code: '获取验证码',
          disabled: false
        })
      }
    }, 1000)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/distributor/getVerificationCode`,
      data: {
        'phone': phone,
      },
      header: {},
      success: function(res) {
        console.log(res.data, 9898);
        if (res.data.code == 200) {

        } else if (res.data.code == 201) {
          wx.showModal({
            title: '提示',
            content: '该手机号已被注册',
            showCancel: false
          })
        }
      }
    })

  },
  /**打开弹框 */
  be_fenxiao: function(e) {
    this.setData({
      fenxiao_pop: true
    })
  },
  fx_cancle: function() {
    this.setData({
      fenxiao_pop: false
    })
  },
  /**提交注册信息 */
  be_sure: function(e) {
    var that = this
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    var name = that.data.name
    var phone = that.data.phone
    var code = that.data.code
    if (name.length>10){
      wx.showModal({
        title: '提示',
        content: '名字必须十位以内哟~',
      })
    }
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/distributor/saveDistributor`,
      data: {
        name: name,
        phone: phone,
        code: code,
        c_user_id: c_user_id,
        parent_id: that.data.parent_id
      },
      header: {},
      success: function(res) {
        if (res.data.code == 200) {
          var dis_id=res.data.data;
          console.log(dis_id,89989);
          getApp().globalData.my_distributor_id=dis_id;
          wx.redirectTo({
            url: '../fenxiao/fenxiao',
          })
        } else if (res.data.code == 201) {
          wx.showModal({
            title: '提示',
            content: '验证码错误',
          })
        } else if (res.data.code == 202) {
          wx.showModal({
            title: '提示',
            content: '验证码过期',
          })
        }
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