var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: "../../images/logo.png",
    search: "../../images/img/search.png",
    imgUrls: [
      'http://wmdx.vimi66.com:8010/img-video/upload/img//20181105162846023648.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    myinterval: 3000,
    duration: 1000,
    isClick: false,
    no_select: '../../images/xinxin_white.png',
    xinxin_select: '../../images/xinxin_full.png',
    wall: "../../images/img/wall.png",
    corner: "../../images/img/corner.png",
    right: "../../images/img/right.png",
    msg: "../../images/img/msg.png",
    car: "../../images/img/car.png",
    gift: "../../images/img/gift.png",
    star: "../../images/img/star.png",
    dianzan: "../../images/img/dianzan.png",
    _num: 1,
    _praise: 9,
    productlist: [],
    store_pop: false,
    count: 1,
    coupon: false,
    zhuan:0,
    dis_id:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.my_distributor_id,34343434)
    if (options.my_distributor_id){
      getApp().globalData.distributor_id = options.my_distributor_id
      this.setData({
        commerce_id: options.url
      })
    }else{
      this.setData({
        commerce_id: options.url
      })
    } 
     var that=this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let distributor_id = scene.split("&")[0];
      //console.log(distributor_id, 11111);
      distributor_id = distributor_id.split("=")[1];

      that.setData({
        dis_id: distributor_id
      })
      //`${getApp().globalData.distributor_id}`
      //其他逻辑处理。。。。。
    }

    
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
    })
    var dis_id=that.data.dis_id;

    if (dis_id){
      wx.request({
        url: getApp().globalData.baseUrl + '/wechat/qr/readQr',
        data: {
          dis_id: dis_id
        },
        header: {
          'content-type': 'application/json'  // 默认值
        },
        async: false,
        success: function (res) {
          //console.log(res.data.data, 55555);
          var distributor = res.data.data;
          getApp().globalData.distributor_id = distributor.distributor_id
          // that.setData({
          //   commerce_id: distributor.commer_id
          // });
          var commerce_id = distributor.commer_id;
          //console.log(commerce_id, 9901201)
          wx.request({
            url: `${getApp().globalData.baseUrl}/wechat/commerce/getCommerceDetail`,
            data: {
              commerce_id: commerce_id,
              c_user_id: c_user_id
            },
            header: {},
            success: function (res) {
              var shop_details = res.data.data;
              var commerce_details = shop_details.commerce_details;
              if (commerce_details) {
                WxParse.wxParse('article', 'html', commerce_details, that, 5);
              }

              //console.log(shop_details, 99999);
              var reserved1 = shop_details.reserved1;
              var isClick = that.data.isClick
              if (reserved1 == '1') {
                isClick = true;
              }
              var my_distributor_id = getApp().globalData.my_distributor_id;
              //console.log(my_distributor_id, 8909);
              var zhuan = 0
              if (my_distributor_id) {
                zhuan = 1
              }
              that.setData({
                shop_details: shop_details,
                commerce_details: commerce_details,
                isClick: isClick,
                zhuan: zhuan
              })
            }
          })

        }
      });
    }else{
      var commerce_id = that.data.commerce_id;
      //console.log(commerce_id, 9901201)
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commerce/getCommerceDetail`,
        data: {
          commerce_id: commerce_id,
          c_user_id: c_user_id
        },
        header: {},
        success: function (res) {
          var shop_details = res.data.data;
          var commerce_details = shop_details.commerce_details;
          if (commerce_details) {
            WxParse.wxParse('article', 'html', commerce_details, that, 5);
          }

          //console.log(shop_details, 99999);
          var reserved1 = shop_details.reserved1;
          var isClick = that.data.isClick
          if (reserved1 == '1') {
            isClick = true;
          }
          var my_distributor_id = getApp().globalData.my_distributor_id;
          //console.log(my_distributor_id, 8909);
          var zhuan = 0
          if (my_distributor_id) {
            zhuan = 1
          }
          that.setData({
            shop_details: shop_details,
            commerce_details: commerce_details,
            isClick: isClick,
            zhuan: zhuan
          })
        }
      })
    }
    

    
    that.same_shop()
    that.show_coupon()
    that.min_coupon()
  },
  /**优惠券显示 */
  min_coupon: function () {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/coupons/getMinCouspons`,
      data: {
        c_user_id: c_user_id,
      },
      header: {},
      success: function (res) {
        //console.log(res.data.data, 8765432)
        var min_coupon = res.data.data;
        var show_coupon = 0;
        if (min_coupon) {
          show_coupon = 1;
        }
        that.setData({
          min_coupon: min_coupon,
          show_coupon: show_coupon
        })
        //console.log(show_coupon, 6666)
      }
    })
  },
  my_home:function(){
wx.switchTab({
  url: '../home/home',
})
  },
  /**优惠券 */
  show_coupon: function () {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/coupons/getAllCouponsList`,
      data: {
        c_user_id: c_user_id,
      },
      header: {},
      success: function (res) {
        var coupon_list = res.data.data;
        //console.log(coupon_list, 9080)
        that.setData({
          coupon_list: coupon_list
        })
      }
    })
  },
  /**我的分销员中心 */
  fenxiao: function (e) {
    wx.navigateTo({
      url: '../fenxiao/fenxiao',
    })
  },
  /**优惠券领取 */
  my_coupon: function (e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    var coupons_id = e.currentTarget.dataset.coupons_id;
    var index = e.currentTarget.dataset.index;
    var coupon_list = that.data.coupon_list;
    coupon_list[index].lq_status = 1;
    that.setData({
      coupons_id: coupons_id,
      coupon_list: coupon_list
    })
    //console.log(coupons_id, 9999)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/coupons/addCoupons`,
      data: {
        c_user_id: c_user_id,
        coupons_id: coupons_id
      },
      header: {
        'content-type': 'application/json'  // 默认值
      },

      success: function (res) {

      }
    })

  },
  /**优惠券完成 */
  coupon_end:function(e){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        coupon: false
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
    })
  },
  // 商品详情切换
  clickNum: function (e) {
    var comment_type = e.target.dataset.num
    //console.log(e.target.dataset.num)
    this.setData({
      _num: comment_type
    })
    if (comment_type == 2) {
      this.comment_num();
      this.show_Comment();

    }
  },
  /**加商品 */
  addtap: function () {
    var that = this;
    that.setData({
      count: ++that.data.count
    })
  },
  subtracttap: function () {
    var that = this;
    var count = that.data.count
    if (count > 1) {
      count--
    }
    that.setData({
      count: count
    })
  },
  /**立即购买 */
  buy_now: function (e) {
    var count = e.currentTarget.dataset.count;
    var id = e.currentTarget.dataset.id
    var that = this;
    var store_pop = that.data.store_pop;
    var commerce_id = e.currentTarget.dataset.id;
    if (!store_pop) {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
      this.setData({
        animationData: animation.export(),
        store_pop: true
      })
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commerce/getCommerceDetail`,
        data: {
          commerce_id: commerce_id
        },
        header: {},
        success: function (res) {
          //console.log(res.data.data, 787878);
          var store_pop = res.data.data;
          that.setData({
            store_pop: store_pop
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../create_order/create_order?count=' + count + '&id=' + id,
      })
    }
  },
  /**弹出层 */
  gouwu_pop: function (e) {
 
    var that = this;
    var store_pop = that.data.store_pop;
    var commerce_id = e.currentTarget.dataset.id;
    if (!store_pop) {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
      this.setData({
        animationData: animation.export(),
        store_pop: true
      })
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commerce/getCommerceDetail`,
        data: {
          commerce_id: commerce_id
        },
        header: {},
        success: function (res) {
          //console.log(res.data.data, 787878);
          var store_pop = res.data.data;
          that.setData({
            store_pop: store_pop
          })
        }
      })
    } else {
      var comm_num = e.currentTarget.dataset.count;
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commerce/addShopToCart`,
        data: {
          comm_num: comm_num,
          c_user_id: that.data.c_user_id,
          commodity_id: commerce_id

        },
        header: {},
        success: function (res) {
          wx.showToast({
            title: '加入购物车成功',
          })
        }
      })
    }


  },
  /**优惠券 */
  coupon: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
      coupon: true
    })
  },
  closecoupon: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        coupon: false
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
    })
  },
  preventTouchMove: function () {

  },
  close_gouwu: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        store_pop: false
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
    })
  },
  /**添加购物车 */
  my_add: function (e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    var comm_num = e.currentTarget.dataset.count;
    var commodity_id = e.currentTarget.dataset.id
    //console.log(commodity_id, 1111)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/addShopToCart`,
      data: {
        comm_num: comm_num,
        c_user_id: c_user_id,
        commodity_id: commodity_id
      },
      header: {},
      success: function (res) {
        wx.showToast({
          title: '加入购物车成功',
        })
      }
    })

  },
  /**购物车 */
  gouwu: function () {
    wx.switchTab({
      url: '../shop_cart/shop_cart',
    })
  },
  /**评价接口 */
  show_Comment: function () {
    var that = this;

    var commerce_id = that.data.commerce_id;
    var rank = that.data._praise;
    if (rank == 9) {
      rank = '';
    }
    //console.log(rank, 7766)
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/evaluate/getEvaluateList`,
      data: {
        commerce_id: commerce_id,
        rank: rank
      },
      header: {},
      success: function (res) {
        var new_all_comment = res.data.data;
        //console.log(new_all_comment, 989898)
        for (var i = 0; i < new_all_comment.length; i++) {
          var all_comment = new_all_comment[i]["create_time"];
          new_all_comment[i]["create_time"] = util.formatTime(new Date(all_comment))
        }
        var my_choose = 0;
        if (!new_all_comment || new_all_comment.length == 0) {
          my_choose = 1;
        }
        that.setData({
          all_comment: new_all_comment,
          my_choose: my_choose
        })
      }
    })
  },

  /**评价数量接口 */
  comment_num: function () {
    var that = this;
    var commerce_id = that.data.commerce_id;
    // var rank = that.data._praise;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/evaluate/getEvaluateNum`,
      data: {
        commerce_id: commerce_id
      },
      header: {},
      success: function (res) {
        var comment_num = res.data.data;
        //console.log(comment_num, 7878)
        that.setData({
          comment_num: comment_num
        })
      }
    })
  },
  clickPraise: function (e) {
    //console.log(e.target.dataset.praise, 99999)
    this.setData({
      _praise: e.target.dataset.praise
    })
    this.show_Comment();
  },


  /**喜欢收藏 */
  haveSave(e) {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    this.setData({
      isClick: !this.data.isClick
    })
    var commerce_id = e.currentTarget.dataset.commerce_id
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/cranlCollection`,
      data: {
        c_user_id: c_user_id,
        commerce_id: commerce_id
      },
      header: {},
      success: function (res) {

      }
    })
  },
  /**同类型推荐商品 */
  same_shop: function () {
    var that = this;
    var commerce_id = that.data.commerce_id;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getSameTypeCommerce`,
      data: {
        commerce_id: commerce_id
      },
      header: {
      },
      success: function (res) {
        var productlist = res.data.data;
        that.setData({
          productlist: productlist
        })
      }
    })
  },
  home:function(e){
    wx.switchTab({
      url: '../home/home',
    })
  },
  /**推荐商品跳转详情 */
  // jx_shop: function (e) {
  //   var commerce_id = e.currentTarget.dataset.commerce_id;
  //   wx.redirectTo({
  //     url: '../shop_details/shop_details?url=' + commerce_id,
  //   })
  //   wx.showLoading({
  //     title: '加载中...',
  //   })
  //   setTimeout(function () {
  //     wx.hideLoading()
  //   }, 2000)
  // },
  zhuan: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
      zhuan_info: true
    })
  },
  close_zhuan: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        zhuan_info: false
      })
    }.bind(this), 200)
    this.setData({
      animationData: animation.export(),
    })
  },
  my_code: function (e) {
    this.setData({
      zhuan_info: false,
      code_info: true
    })
    var that = this;
    var commerce_id = e.currentTarget.dataset.id

    //console.log(commerce_id, 976);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/qr/getEwm`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        commer_id:commerce_id,
        page: 'pages/shop_details/shop_details',
        distributor_id: getApp().globalData.my_distributor_id
      },
      success: function (res) {
        wx.hideLoading();
        var path = res.data.data;
        //console.log(res.data.data, 99999)
        that.setData({
          my_path: path
        })
      }
    })
  },
  close_code: function () {
    this.setData({
      code_info: false
    })
  },

  //点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },

  //保存图片
  saveImg: function (e) {
    var that = this;
    var times = that.data.timeend - that.data.timestart;
    if (times > 300) {
      //console.log("长按");
      wx.getSetting({
        success: function (res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              //console.log("授权成功");
              var imgUrl = that.data.my_path.path;
              wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
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
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      //console.log(ops.target)
    }
    var that=this
    var my_distributor_id = getApp().globalData.my_distributor_id
    //console.log(my_distributor_id,1111111)
    var aa = that.data.commerce_id
    return {
      title: 'GL好肌友皮肤管理',
      path: 'pages/shop_details/shop_details?my_distributor_id=' + my_distributor_id + '&url=' + aa, //点击分享的图片进到哪一个页面
      success: function (res) {
        // 转发成功
        //console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        //console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})