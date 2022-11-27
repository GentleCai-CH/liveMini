// app.js
import Model from './model/index'
App({
  onLaunch() {

  },

  onShow(){
    if(this.isLive){
      Model.changeRoomStatus({
        type:2,
        im_id:this.liveInfo.im_id
     })
    }
  },

  onHide(){
    if(this.isLive){
      Model.changeRoomStatus({
        type:1,
        im_id:this.liveInfo.im_id
     })
    }
  }
 
})
