// 模型配置
module.exports = {
  // 当前使用的模型: "yuanqi" 或 "gemini"
  currentModel: "yuanqi",
  
  // 设置当前模型
  setModel: function(model) {
    if (model !== "yuanqi" && model !== "gemini") {
      console.error("不支持的模型类型:", model);
      return false;
    }
    this.currentModel = model;
    wx.setStorageSync('current_model', model);
    console.log("已切换到模型:", model);
    return true;
  },
  
  // 获取当前模型
  getModel: function() {
    // 优先使用存储的值，如果没有则使用默认值
    const storedModel = wx.getStorageSync('current_model');
    if (storedModel === "yuanqi" || storedModel === "gemini") {
      this.currentModel = storedModel;
    }
    return this.currentModel;
  }
};
