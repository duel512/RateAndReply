App({
  onLaunch: function () {
    // 初始化
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 配置网络请求
    this.configureNetwork();
  },
  
  // 配置网络请求
  configureNetwork: function() {
    // 显示网络状态
    wx.getNetworkType({
      success: (res) => {
        console.log('当前网络类型:', res.networkType);
        if (res.networkType === 'none') {
          wx.showToast({
            title: '无网络连接',
            icon: 'error'
          });
        }
      }
    });
    
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      console.log('网络状态变化, 当前是否连接:', res.isConnected);
      console.log('当前网络类型:', res.networkType);
    });
    
    // 设置请求超时时间
    wx.setStorageSync('requestTimeout', 30000);
    
    // 注册域名 - 仅开发环境使用
    if (wx.canIUse('setRequestDomainVerifyEnable')) {
      try {
        // 仅开发环境下禁用域名校验
        // 正式环境必须在小程序管理后台配置域名
        wx.setRequestDomainVerifyEnable({
          enable: false
        });
        console.log('已禁用域名校验（仅开发环境有效）');
      } catch (error) {
        console.error('禁用域名校验失败:', error);
      }
    }
  },
  
  globalData: {
    userInfo: null,
    // 全局分析数据
    analysisResult: null
  }
}) 