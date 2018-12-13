var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 0,//最少字数
    max: 150, //最多字数 (根据自己需求改变) 
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      translate_id: options.url
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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    this.setData({
      c_user_id: c_user_id
    })
    var that=this;
     wx.request({
       url: `${getApp().globalData.baseUrl}/wechat/commerce/getTranslateMessage`,
       data:{
         c_user_id: that.data.c_user_id,
         translate_id: that.data.translate_id
       },
       header:{},
       success:function(res){
         var new_leave_content=res.data.data;
         for (var i = 0; i < new_leave_content.length; i++) {
           var leave_content = new_leave_content[i]["create_time"]
           new_leave_content[i]["create_time"] = util.formatTime(new Date(leave_content));
         }
         that.setData({
           leave: res.data.data,
           leave_content: new_leave_content
         })
       }
     })
  },
  //添加留言
  content: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
/**提交留言 */

  submit_leave:function(e){
    var c_user_id = (wx.getStorageSync('c_user_id'));
    this.setData({
      c_user_id: c_user_id
    })
    
    var that = this;
    // that.setData({
    //   loadhidden: true
    // });
    
    
    var that=this;
    const value = e.detail.value;
    console.log(value.content, 88888888)
    if(value.content){
      this.setData({
        loadhidden: false
      });
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commerce/addTranslateMessage`,
        data: {
          'c_user_id': that.data.c_user_id,
          'translate_id': that.data.translate_id,
          'content': e.detail.value.content
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
              }
            })
            that.onShow();
          } else {
            wx.showModal({
              title: '提示',
              content: '提交异常',
              showCancel: true,
            })
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }

  },
  /**删除留言 */
  leave_del:function(e){
var that=this;
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/commerce/deleteTranslateMessage`,
            data: {
              id: e.currentTarget.dataset.id
            },
            header: {},
            success: function (res) {
              that.onShow();
            }

          })
        } else if (sm.cancel) {

        }

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