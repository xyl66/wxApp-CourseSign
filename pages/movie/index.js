// pages/movie/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},   // 影院热映
    comingSoon: {},    // 即将上映
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = 'https://api.douban.com/v2/movie/in_theaters';
    var comingSoonUrl = 'https://api.douban.com/v2/movie/coming_soon';
    this.getTestInfo(inTheatersUrl, "inTheaters", "影院热映")
    this.getTestInfo(comingSoonUrl, "comingSoon","即将上映")
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
  getTestInfo: function (url, setKey, categorytitle) {
    var self = this
    wx.request({
      url: url,
      data: {},
      header: {
        'Content-Type': 'json'
      },
      success: function (res) {
        self.setMovieListData(res.data, setKey, categorytitle);
      },
    });
  },
  setMovieListData:function(data,setKey,categoryTitle){
    var movies = [];
    for (let idx in data.subjects) {
      var subject = data.subjects[idx];
      var showRating = false;
      var showWish = false;
      if ("inTheaters" == setKey) {
        showRating = true;
        showWish = false;
      } else {
        showRating = false;
        showWish = true;
      }
      var temp = {
        id: subject.id,
        title: subject.title,
        rating: subject.rating,
        collect_count: subject.collect_count,
        images: subject.images,
        subtype: subject.subtype,
        directors: subject.directors,
        casts: subject.casts,
        year: subject.year,
        showRating: showRating,
        showWish: showWish
      };
      movies.push(temp);
    }
    var readyData={};
    readyData[setKey]={
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
  }
})