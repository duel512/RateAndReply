const app = getApp()
const api = require('../../utils/api.js')

Page({
  data: {
    activeTab: 'text',
    conversationText: '',
    tempImagePath: '',
    canAnalyze: false,
    useMockData: false // 是否使用模拟数据
  },

  onLoad: function () {
    // 检查剪贴板是否有内容，提供快速粘贴选项
    this.checkClipboard();
    
    // 强制使用实际API，不使用模拟数据
    this.setData({
      useMockData: false
    });
  },

  // 检查剪贴板
  checkClipboard: function() {
    wx.getClipboardData({
      success: (res) => {
        if (res.data && res.data.length > 10) { // 只有当剪贴板有足够内容时才提示
          wx.showModal({
            title: '检测到剪贴板内容',
            content: '是否粘贴到对话框？',
            confirmText: '粘贴',
            success: (result) => {
              if (result.confirm) {
                this.setData({
                  conversationText: res.data,
                  activeTab: 'text'
                });
                this.checkCanAnalyze();
              }
            }
          });
        }
      }
    });
  },

  // 切换选项卡
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab
    })
    this.checkCanAnalyze()
  },

  // 监听文本输入
  onInputChange: function(e) {
    this.setData({
      conversationText: e.detail.value
    })
    this.checkCanAnalyze()
  },

  // 选择图片
  chooseImage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFiles[0].tempFilePath
        })
        this.checkCanAnalyze()
      }
    })
  },

  // 删除图片
  deleteImage: function() {
    this.setData({
      tempImagePath: ''
    })
    this.checkCanAnalyze()
  },

  // 检查是否可以分析
  checkCanAnalyze: function() {
    const canAnalyze = 
      (this.data.activeTab === 'text' && this.data.conversationText.trim() !== '') ||
      (this.data.activeTab === 'image' && this.data.tempImagePath !== '')
    
    this.setData({
      canAnalyze
    })
  },

  // 分析对话
  analyze: function() {
    if (!this.data.canAnalyze) return

    wx.showLoading({
      title: '分析中...',
    })

    if (this.data.activeTab === 'text') {
      // 使用文本分析
      this.analyzeText();
    } else {
      // 使用图片分析
      this.analyzeImage();
    }
  },

  // 分析文本
  analyzeText: function() {
    // 如果设置为使用模拟数据，则不调用API
    if (this.data.useMockData) {
      setTimeout(() => {
        const result = this.mockAnalysis();
        app.globalData.analysisResult = result;
        wx.hideLoading();
        wx.navigateTo({
          url: '/pages/result/result'
        });
      }, 1500);
      return;
    }
    
    // 否则调用实际的API
    api.analyzeConversation(this.data.conversationText)
      .then(result => {
        // 将分析结果存储到全局数据
        app.globalData.analysisResult = result;
        
        wx.hideLoading();
        
        // 跳转到结果页
        wx.navigateTo({
          url: '/pages/result/result'
        });
      })
      .catch(error => {
        console.error('分析失败:', error);
        wx.hideLoading();
        
        // 出错时询问是否使用模拟数据
        wx.showModal({
          title: 'API请求失败',
          content: '是否使用模拟数据进行演示？\n\n错误详情: ' + (error.error || JSON.stringify(error).substring(0, 100)),
          success: (res) => {
            if (res.confirm) {
              // 使用模拟数据
              const result = this.mockAnalysis();
              app.globalData.analysisResult = result;
              wx.navigateTo({
                url: '/pages/result/result'
              });
            } else {
              wx.showToast({
                title: '操作取消',
                icon: 'none'
              });
            }
          }
        });
      });
  },

  // 分析图片（需要OCR）
  analyzeImage: function() {
    // 实际场景中需要调用OCR API提取图片中的文本
    // 这里简单模拟OCR过程
    setTimeout(() => {
      wx.showModal({
        title: '提示',
        content: '图片分析功能需要OCR API支持，请先使用文本分析功能',
        showCancel: false,
        success: () => {
          wx.hideLoading();
        }
      });
    }, 1000);
    
    // 完整实现方式:
    // 1. 调用OCR API提取图片中的文本
    // 2. 提取成功后使用analyzeText方法分析文本
  },
  
  // 模拟分析结果
  mockAnalysis: function() {
    // 生成随机情感值（0-100）
    const sentiment = Math.floor(Math.random() * 101);
    
    // 根据情感值生成分析结果
    let thoughts;
    if (sentiment < 30) {
      thoughts = "这个人似乎对您不太感兴趣或者可能心情不佳。消息简短，缺乏热情。他们可能正在忙或处理其他事情。";
    } else if (sentiment < 70) {
      thoughts = "他们看起来态度中立但有参与对话。虽然不是非常兴奋，但他们在持续回复并对您说的话表现出一些兴趣。";
    } else {
      thoughts = "这个人似乎对您非常感兴趣！他们的消息充满热情，会提出后续问题，并积极保持对话进行。";
    }
    
    // 生成建议回复
    const replies = [
      "我一直在思考你说的话。你的观点很好，我很欣赏你的看法。",
      "这很有趣！如果你有时间，我很想听更多关于这个的内容。",
      "谢谢你和我分享这个。这实际上让我想起了我最近经历的一些事情。"
    ];
    
    return {
      sentiment,
      thoughts,
      replies
    };
  }
}) 