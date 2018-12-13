Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_type_list: [{
        type_img: '../../images/type_one.png',
        type_name: '待付款',
        status: '0'
      },
      {
        type_img: '../../images/type_two.png',
        type_name: '待发货',
        status: '2'
      },
      {
        type_img: '../../images/type_three.png',
        type_name: '待收货',
        status: '3'
      },
      {
        type_img: '../../images/type_four.png',
        type_name: '待评价',
        status: '4'
      },
      {
        type_img: '../../images/type_five.png',
        type_name: '退款/售后',
        status: '8'
      }

    ],
    person_other_list: [
      {
        id: 0,
        iconfont: 'icon-gouwuche',
        other_name: '购物车',
        url: '../shop_cart/shop_cart'
      },
      {
        id: 1,
        iconfont: 'icon-wodejuhuasuan',
        other_name: '分销员中心',
        url: '../no_fenxiao/no_fenxiao'
      },
      {
        id: 2,
        iconfont: 'icon-jushoucang',
        other_name: '我的收藏',
        url: '../mylove/mylove'
      },
      {
        id: 3,
        iconfont: 'icon-shouhuodizhi',
        other_name: '收货地址',
        url: '../my_address/my_address'
      }

    ],
    card_nums:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.getUserInfo({
      withCredentials: true, //此处设为true，才会返回encryptedData等敏感信息
      success: function(res) {
        var sex = 'F'
        if (res.userInfo.gender == 0) {
          sex = "M"
        } else {
          sex = "F"
        }
        wx.request({
          url: `${getApp().globalData.baseUrl}/wechat/user/updateUser`,
          data: {
            c_user_id: c_user_id,
            user_name: res.userInfo.nickName,
            sex: sex,
            avatar: res.userInfo.avatarUrl
          },
          header: {
            'content-type': 'application/json'  // 默认值
          },
          success: function (res) {
            //console.log(res.data,89989);
          }

        })
        that.setData({
          userInfo: res.userInfo,
          my_person: 0
        })
      },
      fail: function(res) {
        that.setData({
          my_person: 1
        })

      }
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/order/getCommAndTranOrderNum`,
      data: {
        c_user_id: c_user_id
      },
      header: {},
      success: function(res) {
        //console.log(res.data.data, 2345)
        var order_length = res.data.data;
        that.setData({
          order_length: order_length
        })
        that.onShow_shop();
      }
    })
    that.show_card();
  },
  onShow_shop: function() {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/user/getShopCartNum`,
      data: {
        c_user_id: c_user_id
      },
      header: {},
      success: function(res) {
        var show_shop = res.data.data;
        //console.log(show_shop, 9080808)
        that.setData({
          show_shop: show_shop
        })
      }
    })
  },
  /**显示积分、余额 */
  show_card:function(){
var that=this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    
wx.request({
  url: `${getApp().globalData.baseUrl}/wechat/user/personCenter`,
  data:{
    c_user_id: c_user_id
  },
  header:{},
  success:function(res){
//console.log(res.data.data,8888);
var person_card=res.data.data;
    var card_nums=''
    if (person_card.c_user_vip){
      card_nums='1'
    }
    var shopNull = 0;
    if (!person_card.c_user_vip) {
      shopNull = 1;
    }
that.setData({
  person_card: person_card,
  card_nums: card_nums,
  shopNull: shopNull
})
  }
})
  },
  /**跳转优惠券 */
  my_coupon:function(e){
wx.navigateTo({
  url: '../my_coupon/my_coupon',
})
  },
  /**跳转余额 */
  member:function(e){
    wx.navigateTo({
      url: '../member/member?type=0',
    })
  },
  /**积分跳转 */
  my_integral:function(e){
    wx.navigateTo({
      url: '../my_integral/my_integral',
    })
  },
  /**跳转购物车 */
  person_other: function(e) {
    var url = e.currentTarget.dataset.url;
    var id = e.currentTarget.dataset.id;
    var c_user_id = this.data.c_user_id;
    
    

    if(id==0){
      wx.switchTab({
        url: url
      })
    }else if(id==1){
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/distributor/getDistributor`,
        data: {
          c_user_id: c_user_id
        },
        header: {},
        success: function (res) {
          console.log(res.data.data, 767678);
          if (res.data.data){
            url = '../fenxiao/fenxiao'
          }
          console.log(url, 89898)
          wx.navigateTo({
            url: url
          })
        }
      });
      
        
    }else{
      wx.navigateTo({
        url: url
      })
    }
   
  },
  /**会员卡 */
  person_important: function() {
    var that = this
    var c_user_id = (wx.getStorageSync('c_user_id'));
    // console.log(c_user_id, 7777777)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/vip/checkVip`,
      data: {
        c_user_id: c_user_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },
      success: function(res) {
        // console.log(res.data.data,8888);
        if (!res.data.data) {
          wx.navigateTo({
            url: '../person_important/person_important',
          })
        } else {
          wx.navigateTo({
            url: '../vip_details/vip_details',

          })
        }

      }
    })
  },
  /**跳转订单列表 */
  my_order_list: function(e) {

    var status = e.currentTarget.dataset.status
    //console.log(status, 9087)
    wx.navigateTo({
      url: '../order_list/order_list?status=' + status,
    })
  },
  /**账号设置跳转 */
  my_account: function() {
    wx.navigateTo({
      url: '../my_account/my_account',
    })
  },
  /**查看全部订单 */
  all_order_list: function(e) {
    var status = e.currentTarget.dataset.status;
    if (status == 9) {
      status = ''
    }
    wx.navigateTo({
      url: '../order_list/order_list?status=' + status,
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