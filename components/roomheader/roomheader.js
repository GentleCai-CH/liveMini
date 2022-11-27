// components/roomheader/roomheader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ownerInfo:Object,
    groupInfo:Object,
    isFollowed:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFollow(){
      this.triggerEvent("follow",true)
    },
    handleUnFollow(){
      this.triggerEvent("follow",false)
    },

    handleShowCard(){
      this.triggerEvent("showusercard")
    },
    handleintroductionshow(){
      this.triggerEvent("introductionshow")
    },
    handleOnline(){
      this.triggerEvent("onlineshow")
    },

    handleCoupon(){
      this.triggerEvent("coupon")
    }
  }
})
