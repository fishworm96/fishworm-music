import request from '../../util/request'

// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '19975215515',
    password: 'WOszxh123',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调
  handleInput(e) {
    // let type = e.currentTarget.id  //用id的方式传值
    // 用data-type方式传值
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  // 登录的回调
  async login () {
    let {phone, password} = this.data
    if (!phone) {
      // 提示信息
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
    return
    }
     // 定义正则，验证手机号
     let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
     if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      }) 
      return
     }

     if (!password) {
       wx.showToast({
         title: '密码不能为空',
         icon: 'none'
       })
       return
     }
    //  后端验证
     let res = await request('/login/cellphone', {phone, password, isLogin: true})
     if (res.code == 200) {
       wx.showToast({
         title: '登录成功'
       })
      //  将用户的信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(res.profile))
       wx.reLaunch({
         url: '/pages/personal/personal'
       })
     }else if (res.code == 400) {
       wx.showToast({
         title: '手机号错误'
       })
     }else if(res.code == 502) {
       wx.showToast({
         title: '密码错误'
       })
     }else {
       wx.showToast({
         title: '登录失败',
       })
     }
  
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})