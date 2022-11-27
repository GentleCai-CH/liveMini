// pages/live/live.js
import TLS from 'im-live-sells'
import TIM from 'tim-wx-sdk'
import Model from '../../model/index'
import request from '../../util/request'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: null,
    ownerInfo: null,
    userInfo: null,
    message: [],
    isTimReady: false,
    isGiftShow: false,
    isLeftGiftShow: false,
    gifts: [{
        id: 1,
        name: "火箭",
        url: "/images/gift-item1.png"
      },
      {
        id: 2,
        name: "鲜花",
        url: "/images/gift-item2.png"
      }
    ],
    giftitem: {},
    isFollowed: false,

    isUserCardShow: false,
    isIntroductionShow: false,
    isOnLineShow: false,
    isShowCoupon: false,
    isShowGoodList: false,

    goodList: [],

    room_play_link: "",
    room_push_link: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 计算签名 
    this.setData({
      room_play_link: app.liveInfo.room_play_link,
      room_push_link: app.liveInfo.room_push_link
    })
    this.getUserSig()

    this.player = wx.createLivePlayerContext("player")
  },
  getUserSig() {
    request({
      url: '/getUserSig',
      method: "GET",
      data: {
        userID: app.userData.id
      }
    }).then(res => {
      // console.log(res)
      this.initTLS(res)
    })
  },

  initTLS(res) {
    console.log(app.liveInfo)
    this.tls = new TLS({
      SDKAppID: res.sdkID,
      roomID: app.liveInfo.im_id, //当前直播间得id
      userSig: res.userSig,
      userName: app.userData.id,
      TIM: TIM
    })

    app.tls = this.tls

    this.tls.on(TLS.EVENT.SDK_READY, async () => {
      console.log("初始化成功")

      let {
        groupInfo,
        userInfo
      } = await this.tls.joinRoom({
        roomID: app.liveInfo.im_id,
        getOwnerInfo: true
      })
      if (!groupInfo) {
        groupInfo = await this.tls.getRoomInfo();
      }
      console.log("test------------------", groupInfo)
      const goodlist = groupInfo.groupCustomField.filter(item => item.key === "ADD_GOODS")[0].value || "[]"
      this.setData({
        groupInfo,
        userInfo,
        ownerInfo: groupInfo.ownerInfo,
        isTimReady: true,
        goodList: JSON.parse(goodlist)
      })

      this.notification = groupInfo.notification

      if (this.notification) {
        var msg = []
        msg.push({
          type: 2, //这是公告
          name: "公告",
          message: this.notification,
          id: `id${Date.now()}`
        })

        this.setData({
          message: [...this.data.message, ...msg]
        })

        console.log(this.data.message)
      }

      // 获取 当前用户是否已经关注了此主播
      this.getUserInfo()
    })
    //加入群组
    this.tls.on(TLS.EVENT.JOIN_GROUP, async (data) => {
      console.log("加入群聊", data)
      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick(data),
        message: "加入了群聊",
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg]
      })
      console.log(this.data.message)

    })

    //退出群组
    this.tls.on(TLS.EVENT.EXIT_GROUP, async (data) => {
      // console.log("加入群聊",data)
      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick(data),
        message: "离开直播间",
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg]
      })
      // console.log(this.data.message)

    })


    //收到消息

    this.tls.on(TLS.EVENT.MESSAGE, async data => {
      // console.log(data)
      if (!data.userID) return
      if (!data.message) return
      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: data.message,
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg]
      })

    })

    this.tls.on(TLS.EVENT.LIKE, async data => {
      // console.log("11111111",data)

      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: "给主播点赞了",
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg]
      })

    })

    //发送了礼物

    this.tls.on(TLS.EVENT.SEND_GIFT, async data => {
      // console.log("11111111",data)

      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: "给主播送礼-" + JSON.parse(data.value || data.extension).name,
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg],
        isLeftGiftShow: true,
        giftitem: {
          userAvatar: data.avatar,
          userNick: data.nick,
          giftName: JSON.parse(data.value || data.extension).name,
          giftUrl: JSON.parse(data.value || data.extension).url
        }
      })

    })

    //有人关注得主播
    this.tls.on(TLS.EVENT.ATTENTION, async data => {
      // console.log("11111111",data)

      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: "关注了主播",
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg],
        ownerInfo: {
          ...this.data.ownerInfo,
          fans: this.data.ownerInfo.fans + 1
        }
      })

    })
    //有人取消关注主播
    this.tls.on(TLS.EVENT.CANCELATTENTION, async data => {
      // console.log("11111111",data)

      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: "取消关注了主播",
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg],
        ownerInfo: {
          ...this.data.ownerInfo,
          fans: this.data.ownerInfo.fans - 1
        }
      })

    })
    //有人修改了群简介
    this.tls.on(TLS.EVENT.NOTIFACATION, async data => {
        console.log("111111111111111111", data)

        var msg = []
        msg.push({
          type: 2, //这是消息
          name: "公告",
          message: "修改了资料",
          id: `id${Date.now()}`
        })

        this.setData({
          message: [...this.data.message, ...msg],
          groupInfo: {
            ...this.data.groupInfo,
            notification: data.notification
          }
        })

      }),

      //有人使用了优惠券
      this.tls.on(TLS.EVENT.USE_COUPON, async data => {
        // console.log("111111111111111111",data)

        var msg = []
        msg.push({
          type: 1, //这是消息
          name: this.formatNick({
            userID: data.userID,
            nick: data.nick
          }),
          message: "领取优惠券",
          id: `id${Date.now()}`
        })

        this.setData({
          message: [...this.data.message, ...msg],
        })
      })
    //只要有商品更新， 就会通知
    this.tls.on(TLS.EVENT.ADD_GOODS, async data => {
      // console.log("111111111111111111",data)

      wx.showToast({
        title: '商品有更新',
      })
      // console.log(data.value)

      this.setData({
        goodList: JSON.parse(data.value || data.extension)
      })
    })

    this.tls.on(TLS.EVENT.BUY_GOODS, async data => {
      console.log("111111111111111111", data)

      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: data.userID,
          nick: data.nick
        }),
        message: `购买了商品 （${JSON.parse(data.value || data.extension).name}）`,
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg],
      })
    })
  },

  formatNick({
    userID,
    nick
  }) {
    if (nick === "") return "管理员"
    if (userID === app.userData.id) {
      return "我"
    }
    return nick
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
    if (app.isLive) {
      app.isLive = false
      Model.changeRoomStatus({
        type: 1,
        im_id: app.liveInfo.im_id
      })
    }
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

  //回车 发送消息

  handleSend(evt) {
    // console.log(evt.detail)
    this.tls.sendMessage(evt.detail).then(data => {
      console.log(data)
      var msg = []
      msg.push({
        type: 1, //这是消息
        name: this.formatNick({
          userID: this.data.userInfo.userID,
          nick: this.data.userInfo.nick
        }),
        message: data.message,
        id: `id${Date.now()}`
      })

      this.setData({
        message: [...this.data.message, ...msg]
      })

    }).catch(err => {
      if (err.toString().includes("禁言")) {
        wx.showToast({
          title: '你被禁言24小时',
          icon: "error",
          duration: 2000
        })
      }
    })
  },

  handleBack() {
    // console.log("back")

    wx.showLoading({
      title: '退出...',
    })
    //退出群聊
    this.tls.exitRoom().then(() => {
      wx.navigateBack({
        delta: 1
      })

      wx.hideLoading({
        success: (res) => {},
      })

      if (app.isLive) {
        app.isLive = false
        Model.changeRoomStatus({
          type: 1,
          im_id: app.liveInfo.im_id
        })
      }
    })
  },

  async handleLike() {
    // console.log("like")
    await Model.like(this.data.userInfo.userID, this.data.groupInfo.ownerID)
    this.tls.like(TLS.EVENT.LIKE)
  },

  handleShowGift() {
    console.log("show")

    this.setData({
      isGiftShow: true
    })
  },

  handleSendGift(evt) {
    this.setData({
      isGiftShow: false
    })

    // console.log(evt.detail)
    Model.sendGift({
      from_id: this.data.userInfo.userID,
      to_id: this.data.groupInfo.ownerID,
      gift_id: evt.detail.id
    })
    this.tls.sendGift(JSON.stringify(evt.detail))
  },

  handleHideLeftGift() {
    this.setData({
      isLeftGiftShow: false
    })
  },
  async handleFollow(evt) {
    // console.log(evt.detail)

    this.setData({
      isFollowed: evt.detail
    })

    if (evt.detail) {
      //关注

      await this.tls.attention()

      //存自己数据库
      await Model.follow({
        from_id: this.data.userInfo.userID,
        to_id: this.data.groupInfo.ownerID
      })
    } else {
      //取消关注

      await this.tls.cancelAttention()
      await Model.unfollow({
        from_id: this.data.userInfo.userID,
        to_id: this.data.groupInfo.ownerID
      })
    }
  },

  //调用后台接口 查询此用户是否关注
  async getUserInfo() {
    var data = await Model.getUserInfo({
      from_id: this.data.userInfo.userID,
      to_id: this.data.groupInfo.ownerID
    })

    console.log(data)
    this.setData({
      isFollowed: data.isFollowed,
      ownerInfo: {
        ...this.data.ownerInfo,
        fans: data.fans
      }
    })
  },

  handleShowUserCard() {
    this.setData({
      isUserCardShow: true
    })
  },

  handleClose() {
    this.setData({
      isUserCardShow: false
    })
  },

  handleShowIntroduction() {
    this.setData({
      isIntroductionShow: true
    })
  },

  handleShowOnline() {
    this.setData({
      isOnLineShow: true
    })
  },
  handleHideOnline() {
    this.setData({
      isOnLineShow: false
    })
  },
  handleShowCoupon() {
    this.setData({
      isShowCoupon: true
    })
  },
  handleHideCoupon() {
    this.setData({
      isShowCoupon: false
    })
  },
  handleUseCoupon() {
    // console.log("usecoupon")
    this.tls.useCoupon().then(() => {
      this.handleHideCoupon()
    })
  },

  handleShowGoodList() {
    this.setData({
      isShowGoodList: true
    })
  },
  async handleBuyGood(evt) {
    console.log(evt.detail)
    await Model.buyGoods({
      from_id: this.data.userInfo.userID,
      to_id: this.data.groupInfo.ownerID,
      ...evt.detail
    })
    this.tls.sendCustomMsgAndEmitEvent("BUY_GOODS", JSON.stringify(evt.detail)).then(() => {
      this.setData({
        isShowGoodList: false
      })
    })
  },

  playstatechange(evt) {
    // console.log(evt.detail.code)

    switch (evt.detail.code) {
      case -2301:
        wx.showModal({
          // cancelColor: 'cancelColor',
          content: "主播不在线，再逛逛吧",
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack()
            } else {
              wx.showLoading({
                title: '重新连接中...',
                icon: "loading"
              })
              //重新连接播放地址
              this.player.play()
            }
          }
        })
    }
  },

})