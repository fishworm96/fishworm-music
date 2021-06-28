import request from '../../util/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
//获取全局实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //音乐是否播放
    song: {}, //歌曲详情对象
    musicId: '', //音乐的ID
    musicLink: '', //音乐的链接
    currentTime: '00:00', //实时时间
    durationTime: '00:00', //总时长
    currentTimeWidth: 0, //实时进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)
    // 判断当前音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      //修改当前页面的播放状态为true
      this.setData({
        isPlay: true
      })
    }
    // 创建控制音乐播放的实例
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    // 监视音乐播放/暂停
    this.BackgroundAudioManager.onPlay(() => {
      // 修改音乐是否播放的状态
      this.changePlayState(true)
      // 修改全局音乐播放的状态
      appInstance.globalData.musicId = musicId
    })
    this.BackgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.BackgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    // 监听音乐实时播放
    this.BackgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentTimeWidth = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentTimeWidth
      })
    })
    // 监听音乐自然播放结束
    this.BackgroundAudioManager.onEnded(() => {
      // 自动切换下一首音乐
      PubSub.subscribe('musicId', (msg, musicId) => {
        // 获取音乐的详情信息
        this.getMusicInfo(musicId)
        // 自动播放音乐
        this.musicControl(true, musicId)
        // 取消订阅
        PubSub.unsubscribe('musicId')
      })
      PubSub.publish('switchType', 'next')
      // 实时进度条长度还原为0
      this.setData({
        currentTimeWidth: 0,
        currentTime: '00:00'
      })
    })
  },

  // 修改播放状态的功能函数
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', {
      ids: musicId
    })
    // songData.songs[0]单位毫秒
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  // 点击播放或者暂停音乐
  handlemusicPlay() {
    let isPlay = !this.data.isPlay
    let {
      musicId, musicLink
    } = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) { // 音乐播放
      if (!musicLink) {
        let musicLinkData = await request('/song/url', {
          id: musicId
        })
        // 创建控制音乐播放的实例
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }

      this.BackgroundAudioManager.src = musicLink
      this.BackgroundAudioManager.title = this.data.song.name
    } else {
      // 暂停音乐
      this.BackgroundAudioManager.pause()
    }
  },
  // 点击切换歌曲
  handleSwitch(e) {
    //获取切歌的类型
    let type = e.currentTarget.id
    // 关闭当前波播放的音乐
    this.BackgroundAudioManager.stop()
    PubSub.subscribe('musicId', (msg, musicId) => {
      // 获取音乐的详情信息
      this.getMusicInfo(musicId)
      // 自动播放音乐
      this.musicControl(true, musicId)
      // 取消订阅
      PubSub.unsubscribe('musicId')
    })
    //发布消息数据给recommendSong消息
    PubSub.publish('switchType', type)
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