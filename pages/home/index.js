const app = getApp();
import {formatDate} from './../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    showModal:false,
    startDate:'',
    content:'',
    time:'',
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      startDate:formatDate(new Date())
    })
    this.getAll();
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
    this.getAll();
    wx.stopPullDownRefresh();
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

  //获取全部记录
  getAll:function(){
    wx.showLoading({
      title:'加载中',
      mask: true
    });
    app.request({
      url:'get'
    }).then(res => {
      if(res.result.code == 0){
        let list = res.result.data;
        this.setData({
          list
        },()=>{
          wx.hideLoading();
        })
      }else{
        wx.showToast({
          title:res.result.msg
        });
      }
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },

  //完成
  finish:function(e){
    wx.showLoading({
      title:'更新中',
      mask: true
    });
    let id = e.currentTarget.dataset.id;
    app.request({
      url:'update',
      rData:{
        id
      }
    }).then(res => {
      wx.showToast({
        title:res.result.msg
      });
      this.getAll();
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },

  //删除
  del:function(e){
    wx.showLoading({
      title:'删除中',
      mask: true
    });
    let id = e.currentTarget.dataset.id;
    app.request({
      url:'delete',
      rData:{
        id
      }
    }).then(res => {
      wx.showToast({
        title:res.result.msg
      });
      this.getAll();
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },

  //添加
  add:function(){
    if(this.data.content === ''){
      wx.showToast({
        title:'请输入任务内容'
      });
      return
    }
    if(this.data.date === ''){
      wx.showToast({
        title:'请选择日期'
      });
      return
    }
    if(this.data.time === ''){
      wx.showToast({
        title:'请选择时间'
      });
      return
    }
    wx.showLoading({
      title:'添加中',
      mask: true
    });
    app.request({
      url:'add',
      rData:{
        content:this.data.content,
        done:false,
        date:`${this.data.date} ${this.data.time}`
      }
    }).then(res => {
      wx.showToast({
        title:res.result.msg
      });
      this.setModal();
      this.getAll();
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
    })
  },

  setModal:function(){
    let showModal = this.data.showModal;
    this.setData({
      showModal:!showModal
    })
  },

  timeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  textareaInput(e){
    this.setData({
      content:e.detail.value
    })
  },

  clear:function(){
    this.setData({
      content:'',
      time:'',
      date:''
    })
  }
})