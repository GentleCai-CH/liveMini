// components/roombottom/roombottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isTimReady:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    value:"",
    isAnimation:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleConfirm(evt){
      // console.log(evt.detail.value)

      //子传父
      this.triggerEvent("send",evt.detail.value)
      //清空value
      this.setData({
        value:""
      })
    },

    handleBack(){
      this.triggerEvent("back")
    },

    handleAnimation(){
      this.setData({
        isAnimation:true
      })

      setTimeout(()=>{
        this.setData({
          isAnimation:false
        })
      },800)

      this.triggerEvent("like")
    },

    handleGift(){
      this.triggerEvent("showgift")
    },

    handleshowgoodlist(){
      this.triggerEvent("showgoodlist")
    }
  }
})
