import request from '../../util/request'
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGropList: [], //导航标签数据
    navId: '', //导航的标识
    videoList: [], //视频列表数据
    videoId: '', //video表示
    videoUpdateTime: [], //记录video播放的时长
    isTriggered: false, //标识下拉刷新是否被出发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航标签的数据
    this.getVideoGropListData()
  },

  //获取导航数据
  async getVideoGropListData(navId) {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  // 点击切换导航的回调
  changeNav(e) {
    let navId = e.currentTarget.id
    this.setData({
      navId: navId >>> 0,
      videoList: []
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载...'
    })
    // 动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {
      return
    }
    let videoListData = await request('/video/group', {
      id: navId
    })
    // 关闭消息提示框
    wx.hideLoading()
    let index = 0
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false //关闭下拉刷新
    })
  },
  // 点击播放的回调/ 继续播放的回调
  handlePlay(e) {
    // 创建控制video标签的实例对象
    let vid = e.currentTarget.id
    // 关闭上一个播放的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    this.videoContext = wx.createVideoContext(vid)
    // 判断当前的视频是否播放过
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    // this.videoContext.play()
  },
  // 监听视频播放进度的回调
  hadnleTimeUpdate(e) {
    let vdieoTimeObj = {
      vid: e.currentTarget.id,
      currentTime: e.detail.currentTime
    }
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vdieoTimeObj.vid)
    if (videoItem) {
      videoItem.currentTime = vdieoTimeObj.currentTime
    } else {
      videoUpdateTime.push(vdieoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束的回到
  handleEnded(e) {
    let {
      videoUpdateTime
    } = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vide === e.currentTarget.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  //自定义下拉刷新的回调: scroll-view
  handleRefresher() {
    // 发起请求，获取列表数据
    this.getVideoList(this.data.navId)
  },
  // 上拉触底的回调
  handleScrollLower () {
    
  },

  //跳转到搜索页面
  toSearch()  {
    wx.navigateTo({
      url: '/pages/search/search'
    })
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
  onShareAppMessage: function ({from}) {
    if(from === 'button') {
      return {
        title: '来自button的转发',
        pages: '/pages/video/video',
        imageUrl: '/static/images/logo.png'
      }
    }else {
      return {
        title: '来自menu的转发',
        pages: '/pages/video/video',
        imageUrl: '/static/images/logo.png'
      }
    }
  }
})