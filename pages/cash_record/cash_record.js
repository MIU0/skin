// pages/cash_record/cash_record.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inforHasMore: 1,
    inforPage: 1,
    cash_record: []
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
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/distributor/getDrawimgRecordList`,
      data: {
        distributor_id: getApp().globalData.my_distributor_id,
        c_user_id: c_user_id,
        page: 1,
        rows: 10
        
      },
      header: {},
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code = 200) {
          var new_cash_record = res.data.data;
          console.log(new_cash_record, 87678);
          var shopNull=0
          if (!new_cash_record || new_cash_record.length==0){
            shopNull=1
          }
          for (var i = 0; i < new_cash_record.length; i++) {
            var cash_record = new_cash_record[i]["create_time"];
            new_cash_record[i]["create_time"] = util.formatTime(new Date(cash_record))
          }
          that.setData({
            cash_record: new_cash_record,
            shopNull: shopNull
          })
          if (res.data.data.length < 10) {
            that.setData({
              inforHasMore: 0
            })
          } else {
            that.setData({
              inforPage: 2
            })
          }
        } else {
          that.setData({
            cash_record: [],
            inforHasMore: 0,
          });
        }

      },
      fail: function (res) {
        console.log('查询失败');
      }
    })
  },
  /**分页加载 */
  loadingMore: function () {
    console.log(88888888)
    var that = this;

    var inforHasMore = that.data.inforHasMore;
    if (inforHasMore == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      var pa_cash_record = that.data.cash_record;
      var inforPage = that.data.inforPage;
      console.log(pa_cash_record, 9999);
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/distributor/getDrawimgRecordList`,
        data: {
          c_user_id: that.data.c_user_id,
          page: inforPage,
          rows: 10
        },
        header: {
          'content-type': 'application/json'  // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code = 200) {
            var cash_record = [];
            var new_cash_record = pa_cash_record.concat(res.data.data);
            for (var i = 0; i < new_cash_record.length; i++) {
              cash_record.push(new_cash_record[i])
            }
            that.setData({
              cash_record: cash_record
            });
            //console.log(res.data.data.cash_record, 555);
            if (res.data.data.length < 10) {
              that.setData({
                inforHasMore: 0
              })
            } else {
              that.setData({
                inforPage: ++inforPage
              })
            }

          } else {
            that.setData({
              cash_record: pa_cash_record,
              inforHasMore: 0,
            });
          }

        },
        fail: function (res) {
          console.log("加载失败")
        },
        complete: function (res) {
          console.log("加载完成")
        }

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