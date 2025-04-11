// API管理器 - 统一管理不同模型的API调用
const yuanqiApi = require('./api.js');
const modelConfig = require('./gemini_api.js'); // 目前gemini_api.js实际上是modelConfig

/**
 * 根据当前配置选择API并分析对话
 * @param {string} conversationText - 用户提供的对话内容
 * @returns {Promise} - 返回分析结果的Promise
 */
function analyzeConversation(conversationText) {
  // 获取当前使用的模型
  const currentModel = modelConfig.getModel();
  console.log('当前使用的模型:', currentModel);
  
  // 根据当前模型选择API
  if (currentModel === 'gemini') {
    console.log('使用Gemini模型分析对话');
    return processGeminiResponse(conversationText);
  } else {
    console.log('使用元启API分析对话');
    return yuanqiApi.analyzeConversation(conversationText);
  }
}

/**
 * 处理Gemini格式的响应文本
 * @param {string} conversationText - 模拟的Gemini响应
 * @returns {Promise} - 返回格式化的分析结果
 */
function processGeminiResponse(responseText) {
  return new Promise((resolve) => {
    console.log('处理Gemini响应文本...');
    
    // 默认值 - 如果没有返回互动热度，则默认为50
    let sentiment = 50;
    let thoughts = '无法确定对方的具体想法，需要更多对话内容。';
    const replies = [
      "很高兴收到你的消息，能告诉我更多关于你最近在做什么吗？",
      "谢谢分享，我很想了解更多你的想法。",
      "这很有趣，我们可以继续聊聊这个话题吗？"
    ];

    try {
      // 提取互动热度
      const sentimentMatch = responseText.match(/\[互动热度\]:\s*(\d+)/);
      if (sentimentMatch && sentimentMatch[1]) {
        const value = parseInt(sentimentMatch[1]);
        if (!isNaN(value) && value >= 0 && value <= 100) {
          sentiment = value;
        }
      }

      // 提取情感分析 - 直接绑定到"对方想法"部分
      const thoughtsMatch = responseText.match(/\[情感分析\]:\s*([\s\S]*?)(?=\[回复1\]|$)/);
      if (thoughtsMatch && thoughtsMatch[1]) {
        thoughts = thoughtsMatch[1].trim();
      }

      // 提取三个建议回复
      const reply1Match = responseText.match(/\[回复1\]:\s*([\s\S]*?)(?=\[回复2\]|$)/);
      const reply2Match = responseText.match(/\[回复2\]:\s*([\s\S]*?)(?=\[回复3\]|$)/);
      const reply3Match = responseText.match(/\[回复3\]:\s*([\s\S]*?)(?=\[|$)/);

      if (reply1Match && reply1Match[1]) {
        replies[0] = reply1Match[1].trim();
      }
      if (reply2Match && reply2Match[1]) {
        replies[1] = reply2Match[1].trim();
      }
      if (reply3Match && reply3Match[1]) {
        replies[2] = reply3Match[1].trim();
      }
    } catch (error) {
      console.error('解析Gemini响应时出错:', error);
    }

    const result = {
      sentiment,
      thoughts,
      replies
    };
    
    console.log('Gemini处理结果:', JSON.stringify(result));
    resolve(result);
  });
}

module.exports = {
  analyzeConversation
};
