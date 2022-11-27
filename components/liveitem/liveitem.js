// components/liveitem/liveitem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object
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
    handleTap(){
      // console.log(this.properties.item)
      this.triggerEvent("event",this.properties.item)
    }
  }
})
