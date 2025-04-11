const app = getApp()

Page({
  data: {
    sentiment: 0,
    thoughts: '',
    replies: [],
    selectedReply: null
  },

  onLoad: function () {
    // 从全局数据中获取分析结果
    const result = app.globalData.analysisResult
    
    if (!result) {
      wx.showToast({
        title: '无分析数据',
        icon: 'error',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      })
      return
    }
    
    console.log('展示分析结果:', JSON.stringify(result));
    
    // 动画显示情感值
    this.setData({
      thoughts: result.thoughts,
      replies: result.replies || []
    })
    
    // 使用动画效果显示情感值
    setTimeout(() => {
      this.setData({
        sentiment: result.sentiment || 50
      })
    }, 300)
  },
  
  // 选择回复
  selectReply: function(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedReply: index
    })
  },
  
  // 复制选中的回复
  copyReply: function() {
    if (this.data.selectedReply === null) return
    
    const reply = this.data.replies[this.data.selectedReply]
    
    wx.setClipboardData({
      data: reply,
      success: () => {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  },
  
  // 返回首页
  goBack: function() {
    wx.navigateBack()
  }
}) 