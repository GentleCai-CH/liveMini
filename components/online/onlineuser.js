import Model from "../../model/index"
const app = getApp()

// components/online/onlineuser.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupInfo:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    current:'1',
    giftList:[],
    memberList:[],
    gifts:[
      {
        id:1,
        name:"火箭",
        url:"/images/gift-item1.png"
      },
      {
        id:2,
        name:"鲜花",
        url:"/images/gift-item2.png"
      }
    ],
  },

  lifetimes:{
    async attached(){
      const userlist = await Model.getMember({tls:app.tls})
      const {giftlist} = await Model.getGiftList(this.properties.groupInfo.ownerID)
      
      this.setData({
        memberList:userlist.memberList,
        giftList:giftlist.map(item=>({
          ...item,
          name:this.data.gifts.filter(current=>current.id===item.gift_id)[0].name,
          url:this.data.gifts.filter(current=>current.id===item.gift_id)[0].url
        }))
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClose(){
      this.triggerEvent("hideonline")
    },

    handleChange(evt){
      this.setData({
        current:evt.currentTarget.dataset.current
      })
    }
  }
})
