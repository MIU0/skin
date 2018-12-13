var postsData = require('../../../data/data.js')

Page({
  data: {
    
  },
  onLoad: function (option) {
    var postId = option.id;
    console.log(postsData,8888)
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    })
    console.log(postData)
    },


    callme:function(){
      wx.makePhoneCall({
        phoneNumber: '0571-89988550',
      })
    }
  
})