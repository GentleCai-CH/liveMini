function request(params){
  return new Promise((resolve,reject)=>{
     //显示loading,

     wx.showLoading({
       title: '正在加载中...',
     })

     wx.request({
       ...params,
       url:`https://service-7ggpsalj-1309635506.bj.apigw.tencentcs.com/release`+params.url,
       success:(res)=>{
         resolve(res.data)
       },
       fail:(err)=>{
         reject(err)
       },
       complete:()=>{
         wx.hideLoading({
           success: (res) => {},
         })
       }
     })
  })
}


export default request