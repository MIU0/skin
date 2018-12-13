var postsData = require('../../data/data.js')

Page({
  data:{

  },

  onLoad: function () {
    this.setData({
      postList: postsData.postList
    });
  },
  detailTo: function (event) {
    var postId = event.currentTarget.dataset.postid;
    console.log(postId)
    wx.navigateTo({
      url: "order-detail/order-detail?id=" + postId
    })
  },




})