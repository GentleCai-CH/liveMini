// components/goodlist/goodlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowGoodList:Boolean,
    goodList:Array
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
    handleCart(evt){
      // console.log(evt.currentTarget.dataset.item)
      wx.showModal({
        title:"提示",
        content:"确认购买该商品",
        success:(data)=>{
          if(data.confirm){
            this.triggerEvent("buy",evt.currentTarget.dataset.item)
          }
        }
      })
    }
  }
})
