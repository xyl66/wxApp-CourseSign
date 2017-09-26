'use strict';
const config=require('../../../config');
let choose_year = null,
  choose_month = null;
const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    courseList:[],
    headerTitle:'今日课程',
    listShow:'',
    courseCount:0,
  },
  onLoad() {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    });
    this.dataInit();
  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      let day=i>=10?i:('0'+i),
      mth=month>=10?month:('0'+month);
      days.push({
        day: i,
        date: year + '-' + mth + '-' + day,
        choosed: false
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      });
    }
  },
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    //复原
    let index=days.findIndex((n) => n.choosed==1)
    if (index!==-1){
      days[index].choosed = !days[index].choosed;
    }
    days[idx].choosed = !days[idx].choosed;
    // this.setData({
    //   days,
    // });
    //更新标题
    let nowDate=new Date();
    let nowTime = this.getToday();
    console.log(nowTime)
    let headerTitle = nowTime == days[idx].date ? '今日课程':(days[idx].date + '日课程');
    this.setData({
      headerTitle: headerTitle
    })
    //获取数据
    this.getData(days[idx].date).then(res=>{
      let listShow = '', courseCount = res.length;
      if (!res.length){
        listShow='yes'
        res.push({
          course_id:false,
          course_place:" ",
          course_sign_id:0,
          course_speaker:" ",
          course_time_end:" ",
          course_time_start:" ",
          creat_time:1505799172,
          name:"暂无课程",
          sign_count:0
        })
      }
      this.setData({ days, courseList: res, listShow: listShow, courseCount: courseCount });
    }).catch(err=>{
      wx.showToast({
        title: err.msg,
      })
    })
  },
  chooseYearAndMonth() {
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    let picker_year = [],
      picker_month = [];
    for (let i = 1900; i <= 2100; i++) {
      picker_year.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      picker_month.push(i);
    }
    const idx_year = picker_year.indexOf(cur_year);
    const idx_month = picker_month.indexOf(cur_month);
    this.setData({
      picker_value: [idx_year, idx_month],
      picker_year,
      picker_month,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    choose_year = this.data.picker_year[val[0]];
    choose_month = this.data.picker_month[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      o.cur_year = choose_year;
      o.cur_month = choose_month;
      this.calculateEmptyGrids(choose_year, choose_month);
      this.calculateDays(choose_year, choose_month);
    }

    this.setData(o);
  },
  onShareAppMessage() {
    return {
      title: '小程序日历',
      desc: '还是新鲜的日历哟',
      path: 'pages/index/index'
    };
  },
  hourAndMin(val){
    let st = new Date(val);
    return (st.getHours() >= 10 ? st.getHours() : '0' + st.getHours()) + ':' + (st.getMinutes() >= 10 ? st.getMinutes() : '0' + st.getMinutes());
  },
  getData(val){
    return new Promise((resolve,reject)=>{
      //获取数据
      let time = Date.parse(new Date(val)) / 1000,
        _this = this;
      wx.request({
        url: config.service.getCourseListUrl,
        data: {
          course_time: time
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          let dataArr = [];
          for (let i in res.data) {
            res.data[i].course_time_start = _this.hourAndMin(res.data[i].course_time_start * 1000);
            res.data[i].course_time_end = _this.hourAndMin(res.data[i].course_time_end * 1000);
            dataArr.push(res.data[i]);
          }
          resolve(dataArr) ;
        },
        fail: function () {
          reject({msg:'加载数据失败'})
        }
      })
    })
  },
  getToday(){
    let nowDate = new Date();
    let day = nowDate.getDate() >= 10 ? nowDate.getDate() : ('0' + nowDate.getDate()),
      mth = nowDate.getMonth() + 1;
    mth = mth >= 10 ? mth : ('0' + mth);
    let nowTime = nowDate.getFullYear() + '-' + mth + '-' + day;
    return nowTime;
  },
  dataInit(){
    const today = this.getToday(),
    days=this.data.days;
    //点亮
    let index = days.findIndex(n => n.date == today);
    if (index !== -1) {
      days[index].choosed = !days[index].choosed;
    }
    //加载数据
    this.getData(today).then(res => {
      let listShow='';
      if(!res.length){
        listShow = 'yes'
      }
      this.setData({ days, courseList: res, listShow: listShow });
    }).catch(err => {
      wx.showToast({
        title: err.msg,
      })
    })
  },
  bindCourseDetail(event){
    if (event.currentTarget.dataset.id==0){
      return
    }
    wx.navigateTo({
      url: `../course-detail/index?id=${event.currentTarget.dataset.id}`
    })
  }
};

Page(conf);