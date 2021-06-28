import config from './config'

export default (url, data={}, methods="get") => {
return new Promise((resolve, reject) => {
  wx.request({
    url: config.host + url,
    data,
    methods,
    header: {
      cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
    },
    success: (res) => {
      if (data.isLogin) { //登录请求
        //将用户的cookies存入本地
        wx.setStorage({
          key: 'cookies',
          data: res.cookies
        })
      }
      resolve(res.data)
    },
    fail: (err) => {
      reject(err)
    }
  })  
})
}