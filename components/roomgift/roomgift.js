// components/roomgift/roomgift.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isGiftShow:Boolean,
    gifts:Array
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
    handleTap(evt){
      // console.log(evt.currentTarget.dataset.myid)
      this.triggerEvent("sendgift",evt.currentTarget.dataset.myid)
    }
  }
})
