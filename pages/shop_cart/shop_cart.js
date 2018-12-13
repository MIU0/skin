// pages/shop_cart/shop_cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    shop_cart_list: [],
    hiddenName: true,
    hiddenDe: false,
     selectAllStatus: false,// 全选状态，默认全选
    totalPrice: '0.00', // 总价，初始为0
    totalNum:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 2000)
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
    var c_user_id = (wx.getStorageSync('c_user_id'));
    this.setData({
      c_user_id: c_user_id,
      
    })
    var that = this;
    
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getShopCartList`,
      data: {
        c_user_id: c_user_id,
      },
      header: {},
      success: function(res) {
        wx.hideLoading()
        var shop_cart_list = res.data.data.cartList;
        
        var shopNull = 0;
        if (!shop_cart_list || shop_cart_list.length == 0) {
          shopNull = 1;
        }
        var cart_ids=that.data.cart_ids+'';
        var selectAllStatus=that.data.selectAllStatus;
        if (selectAllStatus){
          for(var i=0;i<shop_cart_list.length;i++){
            shop_cart_list[i].selected=true;
          }
        }else{
          for (var i = 0; i < shop_cart_list.length; i++) {
            var cart_id=shop_cart_list[i].cart_id;
            if (cart_ids.indexOf(cart_id)!=-1){
              shop_cart_list[i].selected = true;
            }
          }
        }
        that.setData({
          shop_cart_list: shop_cart_list,
          shopNull: shopNull,
        })
      }
    })
  },
  /**去逛逛 */
  qguang:function(e){
wx.switchTab({
  url: '../store_list/store_list',
})
  },
  /**删除购物车列表 */
  shop_del:function(e){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/commerce/deleteCartById`,
            data: {
              cart_id: e.currentTarget.dataset.cart_id
            },
            header: {},
            success: function (res) {
              if (res.data.code == 200) {
                that.onShow();
              }
            }
          })
        }
      }
    })
    
  },

  /**单选事件 */
  selectList(e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let shop_cart_list = this.data.shop_cart_list; // 获取购物车列表
    const selected = shop_cart_list[index].selected; // 获取当前商品的选中状态
    shop_cart_list[index].selected = !selected;
    var comm_num = 0; // 改变状态
    var cart_ids='';
    for (var i = 0; i < shop_cart_list.length; i++) {
      var f = shop_cart_list[i].selected
      console.log(f, 88888)
      if (f) {
        cart_ids=cart_ids ? (cart_ids + "," + shop_cart_list[i].cart_id): (shop_cart_list[i].cart_id);
        comm_num++;
        console.log(comm_num);
      }
    }
    var selectAllStatus = false;
    if (shop_cart_list.length == comm_num) {
      selectAllStatus = !this.data.selectAllStatus;
      
    }
    var cart_bottom = 0;
    if (comm_num != 0) {
      cart_bottom = 1
    }
    console.log(cart_ids,999);
    this.setData({
      shop_cart_list: shop_cart_list,
      selectAllStatus: selectAllStatus,
      cart_bottom: cart_bottom,
      cart_ids: cart_ids
    });
    this.getTotalPrice(); // 重新获取总价
  },
  /**全选事件 */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let shop_cart_list = this.data.shop_cart_list;
    var cart_ids='';
    var comm_num = 0;
    for (let i = 0; i < shop_cart_list.length; i++) {
      shop_cart_list[i].selected = selectAllStatus; // 改变所有商品状态
      if (selectAllStatus) {
        cart_ids = cart_ids ? (cart_ids + "," + shop_cart_list[i].cart_id) : (shop_cart_list[i].cart_id);
        comm_num++;   
      }
    }
    console.log(cart_ids,9998);
    var cart_bottom = 0;
    if (comm_num != 0) {
      cart_bottom = 1
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      shop_cart_list: shop_cart_list,
      cart_bottom: cart_bottom,
      cart_ids: cart_ids
    });
    this.getTotalPrice(); // 重新获取总价
  },
  /**点击“编辑”显示隐藏 */
  clickMe: function(e) {
    var value = e.detail.value;
    // console.log(value, 33333)
    this.setData({
      hiddenName: !this.data.hiddenName,
      hiddenDe: !this.data.hiddenDe
    })
  },

  /**
   * 用户点击商品减1
   */
  subtracttap: function(e) {
    var that = this;
    var index = e.target.dataset.index;
    var shop_cart_list = this.data.shop_cart_list;
    var comm_num = shop_cart_list[index].comm_num;
    if (comm_num <= 1) {
      return;
    } else {
      shop_cart_list[index].comm_num--;
      this.setData({
        'shop_cart_list': shop_cart_list
      })
      this.getTotalPrice();
    }
    var commerce_id = e.currentTarget.dataset.commerce_id;
    console.log(commerce_id,8090)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/addShopCart`,
      data:{
        commerce_id: commerce_id,
        type:0,
        c_user_id: that.data.c_user_id
      },
      header:{},
      success:function(res){

      }
    })


  },
  /**
   * 用户点击商品加1
   */
  addtap: function(e) {
    var that=this;
    var index = e.target.dataset.index;
    var shop_cart_list = this.data.shop_cart_list;
    var comm_num = shop_cart_list[index].comm_num;
    shop_cart_list[index].comm_num++;
    this.setData({
      'shop_cart_list': shop_cart_list
    });
    this.getTotalPrice();
    var commerce_id = e.currentTarget.dataset.commerce_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/addShopCart`,
      data: {
        commerce_id: commerce_id,
        type: 1,
        c_user_id: that.data.c_user_id
      },
      header: {},
      success: function (res) {

      }
    })
  },
  /**计算总价 */
  getTotalPrice() {
    let shop_cart_list = this.data.shop_cart_list; // 获取购物车列表
    let total = 0;
    var totalNum = 0;

    for (let i = 0; i < shop_cart_list.length; i++) {
      var comm_num = parseInt(shop_cart_list[i].comm_num) // 循环列表得到每个数据
      if (shop_cart_list[i].selected) { // 判断选中才会计算价格
        totalNum += comm_num
        total += shop_cart_list[i].comm_num * shop_cart_list[i].commodity_price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      shop_cart_list: shop_cart_list,
      totalPrice: total.toFixed(2),
      totalNum: totalNum

    });
  },
  //商品结算跳转
  gouwu_js:function(e){
    var cart_ids = e.currentTarget.dataset.cart_ids
    wx.navigateTo({
      url: '../create_order/create_order?url=' + cart_ids,
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