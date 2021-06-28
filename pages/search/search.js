import request from '../../util/request'
let isSend = false //函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //placeholder默认内容
    hotList: [], //热搜榜数据
    searchContent: '', //用户输入表单项的内容
    searchList: [], //搜索到的模糊关键字
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取初始化数据
    this.getInitData()
    // 获取历史记录
    this.getSearcHistory()
  },
  // 获取本地历史记录的功能函数
  getSearcHistory() {
    let historyList = wx.getStorageSync('searchHistory')
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  // 获取初始化的数据
  async getInitData() {
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hostList: hotListData.data
    })
  },

  //表单项内容发生改变的回调
  handleInputChange(e) {
    // 更新searchContent的状态数据
    this.setData({
      searchContent: e.detail.value.trim()
    })
    if (isSend) {
      return
    }
    isSend = true
    // 函数节流
    setTimeout(() => {
      this.getSearchList()
      isSend = false
    }, 300)
  },
  // 获取搜索数据的功能函数
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    // 发请求获取关键字模糊关键字
    let searchListData = await request('/search', {
      keywords: this.data.searchContent,
      limit: 10
    })
    this.setData({
      searchList: searchListData.result.songs
    })
  },

  // 将搜索的关键字添加到搜索历史记录中
  searchButtom() {
    let {
      searchContent,
      historyList
    } = this.data
    if (historyList.indexOf(searchContent) !== -1) historyList.splice(historyList.indexOf(searchContent), 1)
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    this.getSearchList()
    wx.setStorageSync('searchHistory', historyList)
  },

  // 清空搜索内容
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: ''
    })
  },

  // 清空搜索历史记录
  clearHistory() {
    wx.showModal({
      content: '确认删除吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory')
          this.setData({
            historyList: ''
          })
        }
      }
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
  onShareAppMessage: function () {

  }
})