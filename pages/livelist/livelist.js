// pages/livelist/livelist.js
import Model from '../../model/index'
import request from '../../util/request'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    roomList: [], //广场直播间
    currentRoom: {} //自己直播间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.auth()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.userData.id) {
      this.auth()
    }
  },

  auth() {
    wx.login({
      success: (data) => {
        console.log(data.code)
        request({
          url: "/getUser",
          method: "POST",
          header: {
            "content-type": "application/json"
          },
          data: {
            code: data.code
          }
        }).then(res => {
          // console.log(res)
          if (res.code === -2) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else {
            console.log(res.user)
            this.setData({
              userData: res.user
            })
            // 存储当前登录用户，
            app.userData = res.user
            this.getRoomList()
          }
        })
      }
    })
  },

  getRoomList() {
    return request({
      url: "/getRoomList",
      method: "get"
    }).then(res => {
      // console.log(res.rooms)

      this.setData({
        roomList: res.rooms.filter(item => item.room_owner !== this.data.userData.id)
      })

      this.setData({
        currentRoom: res.rooms.filter(item => item.room_owner === this.data.userData.id)[0]
      })


      // console.log(this.data.roomList,this.data.currentRoom)
    })
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
    this.getRoomList().then(res => {
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    })
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

  handleEvent(evt) {
    console.log("父组件定义", evt.detail.room_status)
    if (evt.detail.room_status) {
      //存储直播用户信息
      app.liveInfo = evt.detail
      wx.navigateTo({
        url: '/pages/live/live',
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '该用户未开通直播间',

      })
    }
  },

  async handleLive() {
    //改成room_status = 2
    app.isLive = true

    await Model.changeRoomStatus({
       type:2,
       im_id:this.data.currentRoom.im_id
    })

    app.liveInfo = this.data.currentRoom
    wx.navigateTo({
      url: '/pages/live/live',
    })
  }
})