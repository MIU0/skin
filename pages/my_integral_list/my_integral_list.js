// pages/my_integral_list/my_integral_list.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inforHasMore: 1,
    inforPage: 1
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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/vip/getInteRecordList`,
      data: {
        c_user_id: c_user_id,
        page:1,
        rows: 10
      },
      header: {},
      success: function (res) {
        if (res.data.code = 200){
          var my_integral = res.data.data;
          var new_recordList = my_integral.recordList
          console.log(my_integral, 87678);
          for (var i = 0; i < new_recordList.length;i++){
            var recordList = new_recordList[i]["create_time"];
            new_recordList[i]["create_time"] = util.formatTime(new Date(recordList))
          }
          that.setData({
            my_integral: my_integral,
            recordList: new_recordList,
          })
          if (res.data.data.recordList.length < 10) {
            that.setData({
              inforHasMore: 0
            })
          } else {
            that.setData({
              inforPage: 2
            })
          }
        }else{
          that.setData({
            recordList: [],
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
    //console.log(88888888)
    var that = this;
   
    var inforHasMore = that.data.inforHasMore;
    if (inforHasMore == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      var pa_recordList = that.data.recordList;
      var inforPage = that.data.inforPage;
      console.log(pa_recordList, 9999);
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/vip/getInteRecordList`,
        data: {
          c_user_id: that.data.c_user_id,
          page: inforPage,
          rows:10
        },
        header: {
          'content-type': 'application/json'  // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code = 200) {
            var recordList = [];
            var new_recordList = pa_recordList.concat(res.data.data.recordList);
            for (var i = 0; i < new_recordList.length; i++) {
              recordList.push(new_recordList[i])
            }
            that.setData({
              recordList: recordList
            });
            //console.log(res.data.data.recordList, 555);
            if (res.data.data.recordList.length < 10) {
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
              recordList: pa_recordList,
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