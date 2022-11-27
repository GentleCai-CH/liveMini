
import request from '../util/request'
const Model = {
  like(from_id,to_id){
    //promise
    return request({
      url:"/like",
      method:"POST",
      data:{
        from_id,
        to_id
      }
    })
  },

  sendGift({from_id,to_id,gift_id}){
    return request({
      url:"/sendgift",
      method:"POST",
      data:{
        from_id,
        to_id,
        gift_id
      }
    })
  },

  //关注
  follow({from_id,to_id}){
    return request({
      url:"/follow",
      method:"POST",
      data:{
        from_id,
        to_id
      }
    })
  },

  unfollow({from_id,to_id}){
    return request({
      url:"/unfollow",
      method:"POST",
      data:{
        from_id,
        to_id
      }
    })
  },
  //获取是否已经关注， 粉丝数量，点赞数量， 礼物数量。
  getUserInfo({from_id,to_id}){
    return request({
      url:"/getUserInfo",
      method:"POST",
      data:{
        from_id,
        to_id
      }
    })
  },

  getMember({tls}){
    // tls.getGroupMemberList()
    return tls.getGroupMemberList().then(res=>res.data) //获取在直播间得所有用户
  },
  getGiftList(to_id){
    return request({
      url:"/getGiftList",
      method:"POST",
      data:{
        to_id
      }
    })
  },

  buyGoods({from_id,to_id,name,price,id}){
    return request({
      url:"/buyGoods",
      method:"POST",
      data:{
        from_id,
        to_id,
        good_name:name,
        good_price:price,
        good_id:id
      }
    })
  },

  changeRoomStatus({type,im_id}){
    return request({
      url:"/changeRoomStatus",
      method:"POST",
      data:{
        type,
        im_id
      }
    })
  }
}


export default Model