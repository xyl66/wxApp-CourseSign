// pages/course-detail/index.js
const config = require('../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo: {},
    locInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    this.getDetailInfo(options.id).then(res => {
      if (res.status) {
        Object.assign(res.data.course_time, {
          yearAndMonth: res.data.course_time.start.substr(0, 10),
          start: res.data.course_time.start.substr(11),
          end: res.data.course_time.end.substr(11)
        })

        _this.setData({
          courseInfo: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err.msg,
      })
    });
    this.getLocString();
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
  getDetailInfo(id) {
    return new Promise((resolve, reject) => {
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
          resolve(res.data)
        },
        fail: function () {
          reject({ msg: '加载数据失败' })
        }
      })
    })
  },
  getLocString() {
    wx.showLoading({
      title: '获取位置中',
    })
    this.locToString().then(res => {
      wx.hideLoading()
      this.setData({ locInfo: res })
    })
  },

  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          resolve(res);
        }
      })
    })
  },
  locToString() {
    //通过高德地图 API获取街道名称
    return new Promise((resolve, reject) => {
      var amapFile = require('../../../libs/amap-wx.js');
      var myAmapFun = new amapFile.AMapWX({ key: 'e201c37083c5f674ef835d5e366bca52' });
      myAmapFun.getRegeo({
        success: function (data) {
          //成功回调
          resolve(data[0].regeocodeData.formatted_address)
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    })

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const url = config.service.couseSignUrl,
    signdata = {
      course_id: this.data.courseInfo.course.course_id,
      user_id: e.detail.value.userid,
      user_name: e.detail.value.name,
      user_department: e.detail.value.dept,
      sign_place: e.detail.value.loc,
    };
    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: signdata,
      header: {
        "Content-Type": "application/x-www-form-urlencoded" // 默认值
      },
      method:'POST',
      success: function (res) {
        if(res.data.status){
          wx.showModal({
            title: '课程签到系统提醒您',
            content: res.data.msg,
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          wx.showModal({
            title: '课程签到系统提醒您',
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        console.log(res.data)
      },
      fail: function (err) {
        wx.showToast({
          title: err.msg,
        })
      }
    })
  },
})