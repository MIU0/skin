Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    swiper_tab_infor:[],
      current: 0,
    currentTab: 0,
    cartData: {},
    index: 0,
    type_id: null,
    tipsshow: "",
    windows_out: false, //弹出层
    shop_lists: [],
    select_shop: [],
    minusStatus: 'display',
    inforHasMore: 1,
    inforPage: 1,
    zhuan:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.my_distributor_id,5555555555)
    if (options.my_distributor_id) {
      getApp().globalData.distributor_id = options.my_distributor_id
    }
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let distributor_id = scene.split("&")[0];
      //console.log(distributor_id, 11111);
      distributor_id = distributor_id.split("=")[1];
      wx.request({
        url: getApp().globalData.baseUrl+'/wechat/qr/readQr',
        data:{
          dis_id: distributor_id
        },
        header:{},
        success:function(res){
          //console.log(res.data.data,55555);
          var distributor=res.data.data;
          getApp().globalData.distributor_id = distributor.distributor_id
        }
      });
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
    var that=this;
    that.show_type();
    //that.show_store();
  },
  /**获取所有商品类型 */
  show_type:function(){
var that=this;
if(!that.data.type_id){
  wx.request({
    url: `${getApp().globalData.baseUrl}/wechat/commodity/getAllCommodityType`,
    data: {},
    header: {},
    success: function (res) {
      var new_swiper_tab_infor = []
      var newswiper_tab_infor = res.data.data;
      var type_id = newswiper_tab_infor[0].type_id;
      for (var i = 0; i < newswiper_tab_infor.length; i++) {
        new_swiper_tab_infor.push(newswiper_tab_infor[i])
      }
      var my_distributor_id = getApp().globalData.my_distributor_id;
      //console.log(my_distributor_id, 8909);
      var zhuan = 0
      if (my_distributor_id) {
        zhuan = 1
      }
      that.setData({
        swiper_tab_infor: new_swiper_tab_infor,
        type_id: type_id,
        zhuan: zhuan

      })
      that.show_store();
    }
  })
}else{
  that.show_store();
}

  },
  /**获取类型中所有商品 */
  show_store:function(){
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    });
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getAllCommerce`,
      data:{
        commerce_type: that.data.type_id,
        c_user_id: c_user_id,
        page: 1,
        rows: 10
      },
      header:{

      },
      success:function(res){
        if (res.data.code = 200) {

          var shop_lists = [];
          var new_shop_lists = res.data.data;
          for (var i = 0; i < new_shop_lists.length; i++) {
            shop_lists.push(new_shop_lists[i])
          }
          var is_show = 1
          if (!shop_lists || shop_lists.length == 0) {
            is_show = 0
          }
          that.setData({
            shop_lists: shop_lists,
            is_show: is_show
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
            shop_lists: [],
            inforHasMore: 0,
          });
        }
      },
       fail: function (res) {
        console.log('查询失败');
      }

    })
  },
  //类型列表底色切换
  swichNav: function (e) {
    // console.log('swichNav')
    var that = this;
    var index = e.currentTarget.dataset.index;
    var type_id = e.currentTarget.dataset.id;
    if (that.data.current === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: index,
        type_id: type_id
      })
      //console.log(type_id,212121)
      that.show_store();
    }

  },
  /**我的分销员中心 */
  fenxiao: function (e) {
    wx.navigateTo({
      url: '../fenxiao/fenxiao',
    })
  },
  /**分页加载 */
  loadingMore: function () {
    //console.log(88888888)
    var that = this;
    var current = that.data.current;
    var inforHasMore = that.data.inforHasMore;
    if (inforHasMore == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      var pa_shop_lists = that.data.shop_lists;
      var inforPage = that.data.inforPage;
      console.log(inforPage, 9999);
      wx.request({
        url: `${getApp().globalData.baseUrl}/wechat/commodity/getAllCommerce`,
        data: {
          commerce_type: that.data.type_id,
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
            var shop_lists = [];
            var new_shop_lists = pa_shop_lists.concat(res.data.data);
            for (var i = 0; i < new_shop_lists.length; i++) {
              shop_lists.push(new_shop_lists[i])
            }
            that.setData({
              shop_lists: shop_lists
            });
            console.log(res.data.data, 555);
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
              shop_lists: pa_shop_lists,
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
  store_details:function(e){
    var aa = e.currentTarget.dataset.commodity_id
    //console.log(aa,3333)
    wx.navigateTo({
      url: '../shop_details/shop_details?url='+aa,
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
  /**立即购买 */
  buy_now: function (e) {
   
  },
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
  my_code: function () {
    this.setData({
      zhuan_info: false,
      code_info: true
    })
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/qr/getEwm`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        commer_id:1,
        page: 'pages/store_list/store_list',
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
    var my_distributor_id = getApp().globalData.my_distributor_id
    //console.log(my_distributor_id,343434)
    return {
      title: 'GL好肌友皮肤管理',
      path: `pages/store_list/store_list?my_distributor_id=` + my_distributor_id, //点击分享的图片进到哪一个页面
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