var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rollUrls: [
      '营业时间：9：00 - 22：00',
      '服务电话：400-8998-8898',
      '配送条件：1元起送  配送费6元'
    ],
    roll_indicatorDots: false,
    roll_interval: 3000,
    indicatorDots: true,
    autoplay: true,
    myinterval: 3000,
    duration: 1000,
    imgsUrl: [], //轮播
    store_digest: [],
    store_list: [],
    video_list: [],
    person_info: false,
    no_refuse:false,
    refuse:true,
    zhuan_info: false,
    code_info: false,
    zhuan:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.my_distributor_id){
      getApp().globalData.distributor_id = options.my_distributor_id
    }
    //console.log(options.my_distributor_id,6666666)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let distributor_id = scene.split("&")[0];
      //console.log(distributor_id, 11111);
      distributor_id = distributor_id.split("=")[1];
      wx.request({
        url: getApp().globalData.baseUrl + '/wechat/qr/readQr',
        data: {
          dis_id: distributor_id
        },
        header: {},
        success: function (res) {
          //console.log(res.data.data, 55555);
          var distributor = res.data.data;
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
  onReady: function() {

  },
  onShow_img: function() {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getAdver`,
      data: {

      },
      header: {

      },
      success: function(res) {
        var imgUrl = res.data.data;
        // console.log(imgUrl, 999999);
        that.setData({
          imgsUrl: imgUrl
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    
    that.setData({
      c_user_id: c_user_id,
    })
    wx.getUserInfo({
      withCredentials: true, //此处设为true，才会返回encryptedData等敏感信息
      success: function (res) {
        that.setData({
          userInfo: res.userInfo,
          person_info: false
        })
      },
      fail: function (res) {
        that.setData({
          person_info: true
        })
      }
    })   
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getRecommendComm`,
      data: {},
      header: {},
      success: function(res) {
        var store_list = res.data.data;
         //console.log(store_list,7676766)
        var my_distributor_id = getApp().globalData.my_distributor_id;
        //console.log(my_distributor_id, 8909);
        var zhuan = 0
        if (my_distributor_id) {
          zhuan = 1
        }
        

        that.setData({
          store_list: store_list,
          zhuan: zhuan
        })

      }
    })
    that.onShow_img();
    that.show_run();
    that.show_typeone();
    that.show_top();
    
  },

  /**页面公告 */
  show_run: function() {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/loadNotice`,
      data: {},
      header: {},
      success: function(res) {

        var rollUrls = res.data.data;
       //console.log(rollUrls,888899)
        var top_roll_show = 1;
        if (rollUrls && rollUrls.length>0) {
          top_roll_show = 0
        }
        // console.log(top_roll,6666)
        that.setData({
          rollUrls: rollUrls,
          top_roll_show: top_roll_show
        })
      }
    })
  },

  getUserInfo: function () {
    var that = this;
    var c_user_id = (wx.getStorageSync('c_user_id'));
    that.setData({
      c_user_id: c_user_id
    })
    wx.getUserInfo({
      withCredentials: true, //此处设为true，才会返回encryptedData等敏感信息
      success: function (res) {
        //console.log(res.userInfo, 999999)
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
          my_person: 0,
          person_info:false
        })
      },
      fail: function (res) {
        that.setData({
          my_person: 1
        })
      }
    })
  },
  preventTouchMove: function () {

  },
  /**授权弹出框 */
  refuse: function () {

    this.setData({
      refuse: !this.data.refuse,
      no_refuse: !this.data.no_refuse
    })
  },
  /**跳转商品详情 */
  shop_details: function (e) {
    var aa = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop_details/shop_details?url=' + aa,
    })
  },
  /**我的分销员中心 */
  fenxiao:function(e){
wx.navigateTo({
  url: '../fenxiao/fenxiao',
})
  },
  /**第一行类型跳转 */
  store_typeone: function (e) {
    var index = e.currentTarget.dataset.index;
    var type_id = e.currentTarget.dataset.type_id
    wx.navigateTo({
      url: '../drawbook/drawbook?url=' + type_id
    })

  },

  /**总类别列表第一行 */
  show_typeone: function () {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commodity/getCommodityType`,
      data: {},
      header: {},
      success: function (res) {
        var all_type = res.data.data

        //console.log(all_type, 888)
        that.setData({
          all_type: all_type
        })
      }
    })
  },
  /**推荐商品 */
  show_top: function () {
    var that = this;
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/commerce/getThreeRecommendCommerceList`,
      data: {},
      header: {},
      success: function (res) {
        var all_recommend = res.data.data;
        //console.log(all_recommend, 7778)
        var recommend_one = []
        recommend_one.push(all_recommend[0])
        var recommend_two = []
        recommend_two.push(all_recommend[1])
        var recommend_three = []
        recommend_three.push(all_recommend[2])
        //console.log()
        that.setData({
          recommend_first: recommend_one,
          recommend_second: recommend_two,
          recommend_third: recommend_three
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  zhuan:function() {
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
  close_zhuan: function() {
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
  my_code: function() {
    this.setData({
      zhuan_info: false,
      code_info: true
    })
    var that = this;
    //var distributor_id = that.data.id
    var scene = decodeURIComponent("dis_id=" + getApp().globalData.my_distributor_id);
    
    //console.log(scene, 976);
    wx.request({
      url: `${getApp().globalData.baseUrl}/wechat/qr/getEwm`,
      header: {
        'content-type': 'application/json'
      },
      data: {
        commer_id:0,
        page: 'pages/home/home',
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
  close_code: function() {
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
  onShareAppMessage: function(ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      //console.log(ops.target)
    }
    var my_distributor_id=getApp().globalData.my_distributor_id
    return {
      title: 'GL好肌友皮肤管理',
      path: `pages/home/home?my_distributor_id=` + my_distributor_id, //点击分享的图片进到哪一个页面
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