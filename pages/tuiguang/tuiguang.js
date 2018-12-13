Page({

  data: {
    num:1,
    upd1:'../../images/img/upd1.png',
    upd2: '../../images/img/upd2.png',
    selectArea:false
  },

  clickList: function (e) {
    var that=this;
    console.log(e.target.dataset.num)
    if (e.target.dataset.num==4){
      that.setData({
        selectArea: !that.data.selectArea
      })
      
    }
    this.setData({
      num: e.target.dataset.num,
      
    })
  }, 

  
})