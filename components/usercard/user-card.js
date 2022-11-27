// components/usercard/user-card.js
import Model from '../../model/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userID:String,
    ownerID:String,
    ownerInfo:Object,
    isFollowed:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentUser:{}
  },

  lifetimes:{
    async attached(){
      console.log("attached",this.properties.userID)

      var data = await Model.getUserInfo({
        from_id:this.properties.userID,
        to_id:this.properties.ownerID
      })
      console.log(data)

      this.setData({
        currentUser:data
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleClose(){
      console.log("colose")

      this.triggerEvent("close")
    },
    handleFollow(){
      this.triggerEvent("follow",true)

      this.setData({
        currentUser:{
          ...this.data.currentUser,
          fans:this.data.currentUser.fans+1
        }
      })
    },

    handleUnfollow(){
      this.triggerEvent("follow",false)
      this.setData({
        currentUser:{
          ...this.data.currentUser,
          fans:this.data.currentUser.fans-1
        }
      })
    }
  }
})
