// pages/course-detail/index.js
const config=require('../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this=this
    this.getDetailInfo(options.id).then(res=>{
      console.log(res)
      if(res.status){
        Object.assign(res.data.course_time,{
          yearAndMonth: res.data.course_time.start.substr(0,10),
          start: res.data.course_time.start.substr(11),
          end: res.data.course_time.end.substr(11)
        })
        
        _this.setData({
          courseInfo: res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
        })
      } 
    }).catch(err=>{
      console.log(err)
      wx.showToast({
        title: err.msg,
      })
    })
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
  
  },
  getDetailInfo(id){
    return new Promise((resolve,reject)=>{
      const url = config.service.getCourseInfoUrl;
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        data: {
          cid: id,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          resolve(res.data)
        },
        fail: function () {
          reject({ msg: '加载数据失败' })
        }
      })
    })
  }
})