// components/leftgift/leftgift.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    giftitem:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes:{
    created(){
      setTimeout(()=>{
        this.triggerEvent("hideleftgift")
      },1000)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
