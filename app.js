//app.js

App({
  onLaunch: function() {
    
    //wx.setStorageSync('c_user_id', "123");
    var openId = (wx.getStorageSync('openId'));
    var c_user_id = (wx.getStorageSync('c_user_id'));
    //console.log(c_user_id, 222);
    //console.log(openId, 11111);
    //console.log(c_user_id, 222);
    var that = this;
    if (!openId ||!c_user_id) {
      wx.login({
        success: function (res) {
          console.log(res.code)
          if (res.code) {

                wx.request({
                  //后台接口地址
                  url: `${ getApp().globalData.baseUrl }/wechat/home/index`,
                  data: {
                    code: res.code
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    // this.globalData.userInfo = JSON.parse(res.data);
                    console.log(res.data,3333);
                    wx.setStorageSync('openId', res.data.openid);
                    wx.setStorageSync('c_user_id', res.data.c_user_id);
                    c_user_id = res.data.c_user_id;
                    wx.request({
                      url: getApp().globalData.baseUrl+'/wechat/distributor/getDistributor',
                      data:{
                        c_user_id: c_user_id
                      },
                      header:{},
                      success:function(parms){
                        var distr=parms.data.data;
                        if (distr) {
                          getApp().globalData.my_distributor_id = distr.id;
                        }
                      }
  
                    })
                  }
                })
          }
        }
      })


    }else{
      wx.request({
        url: 'https://store.vimi66.com/skin/wechat/distributor/getDistributor',
        data: {
          c_user_id: c_user_id
        },
        header: {},
        success: function (parms) {
          var distr = parms.data.data;
          //console.log(distr, 7777)
          if (distr){
            getApp().globalData.my_distributor_id = distr.id;
          }
           
          //console.log(getApp().globalData.my_distributor_id,88989);
        }

      })
    }

    

  },

  globalData: {
    userInfo: null,
    baseUrl: 'https://store.vimi66.com/skin',
    distributor_id:null,
    my_distributor_id:null
  }
 
})