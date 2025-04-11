/**
 * 配置文件（示例）
 * 请复制此文件为config.js并填入您的实际API信息
 */
module.exports = {
  // 腾讯元启API配置
  yuanqi: {
    apiToken: 'YOUR_YUANQI_API_TOKEN', // 请填入您的腾讯元启API令牌
    assistantId: 'YOUR_ASSISTANT_ID',  // 请填入您的助手ID
    userId: 'wx_miniprogram_user'      // 可以根据实际用户ID生成
  },
  
  // Gemini API配置
  gemini: {
    apiKey: 'YOUR_GEMINI_API_KEY',    // 请填入您的Gemini API密钥
    projectId: 'YOUR_PROJECT_ID',     // 请填入您的项目ID
    userId: 'wx_miniprogram_user'     // 用户ID
  }
}; 