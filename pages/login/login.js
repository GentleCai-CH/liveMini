// pages/login/login.js
import request from '../../util/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  handleLogin(){
    // console.log("授权")
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo)

        wx.login({
          success:(data)=>{
            console.log(data.code)

            this.authImport({
              userInfo:res.userInfo,
              code:data.code
            })
          }
        })
      }
    })

  },

  authImport({userInfo,code}){
    // console.log(userInfo,code)
    request({
      url: '/wxRegister',
      method:"POST",
      data:{
        userInfo,
        code  
      },
      header:{
        "content-type":"application/json"
      }
    }).then(res=>{
      // console.log(res)
      this.createGroup(res.id,userInfo)
    })
  },

  createGroup(id,userInfo){
    request({
      url:"/createGroup",
      method:"POST",
      data:{
        id,
        userInfo
      },
      header:{
        "content-type":"application/json"
      }
    }).then(res=>{
      // console.log(res)
      wx.navigateBack({
        delta:1
      })
    })
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

  }
})