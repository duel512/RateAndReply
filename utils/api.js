// 腾讯元启API服务
const config = require('./config.js');
const BASE_URL = 'https://yuanqi.tencent.com/openapi/v1/agent/chat/completions';
const API_TOKEN = config.yuanqi.apiToken;
const ASSISTANT_ID = config.yuanqi.assistantId;

/**
 * 分析对话内容
 * @param {string} conversationText - 用户提供的对话内容
 * @param {string} userId - 用户ID，可以是自定义的唯一标识符
 * @returns {Promise} - 返回分析结果的Promise
 */
function analyzeConversation(conversationText, userId = config.yuanqi.userId) {
  return new Promise((resolve, reject) => {
    // 构建请求体
    const requestData = {
      assistant_id: ASSISTANT_ID,
      user_id: userId,
      stream: false,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `请分析以下聊天对话，判断对方对我的感情和目前的想法，并给出至少2个最佳回复建议。
请按照以下格式回复：
[互动热度]:75
[情感分析]:对方的情感分析内容
[回复1]:第一条建议回复
[回复2]:第二条建议回复
[回复3]:第三条建议回复（如果有）

聊天内容：${conversationText}`
            }
          ]
        }
      ]
    };
    
    console.log('API请求数据:', JSON.stringify(requestData));
    console.log('API令牌:', API_TOKEN ? '已配置' : '未配置');

    // 发起请求
    wx.request({
      url: BASE_URL,
      method: 'POST',
      header: {
        'X-Source': 'openapi',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      data: requestData,
      timeout: 30000, // 增加超时时间到30秒
      enableHttp2: true, // 启用HTTP/2
      enableQuic: true, // 启用QUIC
      enableCache: false, // 禁用缓存
      success: (res) => {
        console.log('API响应:', JSON.stringify(res.data).substring(0, 500) + '...');
        if (res.statusCode === 200) {
          try {
            // 处理API返回的数据
            const responseContent = res.data.choices[0].message.content;
            const processedResult = processAPIResponse(responseContent);
            resolve(processedResult);
          } catch (error) {
            console.error('处理API响应时出错:', error);
            reject({
              error: '处理响应失败',
              details: error.message
            });
          }
        } else {
          // 处理错误
          console.error('API请求失败, 状态码:', res.statusCode);
          reject({
            error: `请求失败(${res.statusCode})`,
            details: res.data
          });
        }
      },
      fail: (error) => {
        console.error('API请求网络错误:', error);
        reject({
          error: '网络错误',
          details: error
        });
      }
    });
  });
}

/**
 * 处理API响应，提取情感分析和建议回复
 * @param {string} responseText - API返回的文本
 * @returns {Object} - 格式化的分析结果
 */
function processAPIResponse(responseText) {
  console.log('处理API响应文本:', responseText.substring(0, 300) + '...');
  
  // 默认值 - 根据要求，如果没有互动热度，默认为50
  let sentiment = 50; 
  let thoughts = '无法确定对方的具体想法，需要更多对话内容。';
  const replies = [
    "很高兴收到你的消息，能告诉我更多关于你最近在做什么吗？",
    "谢谢分享，我很想了解更多你的想法。",
    "这很有趣，我们可以继续聊聊这个话题吗？"
  ];

  try {
    // 检查是否为结构化格式 [xxx]:
    const hasStructuredFormat = responseText.match(/\[\w+\]:/);
    
    if (hasStructuredFormat) {
      console.log('使用结构化格式解析');
      
      // 提取互动热度 - 如果没有则保持默认值50
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
    } else {
      // 非结构化格式解析 - 回退到旧的处理逻辑
      console.log('使用非结构化格式解析');
      
      // 解析情感部分 - 寻找可能包含情感指标的段落
      if (responseText.includes('积极') || responseText.includes('喜欢')) {
        sentiment = 75;
      } else if (responseText.includes('消极') || responseText.includes('不感兴趣')) {
        sentiment = 25;
      }

      // 提取想法分析
      const thoughtsMatch = responseText.match(/想法[：:](.*?)(?=建议|回复|$)/s);
      if (thoughtsMatch && thoughtsMatch[1]) {
        thoughts = thoughtsMatch[1].trim();
      } else {
        // 如果没有明确标记，尝试提取第一段
        const paragraphs = responseText.split('\n\n');
        if (paragraphs.length > 0) {
          thoughts = paragraphs[0].trim();
        }
      }

      // 提取回复建议
      const repliesMatch = responseText.match(/回复[：:](.*?)(?=$)/s);
      if (repliesMatch && repliesMatch[1]) {
        const repliesText = repliesMatch[1].trim();
        const repliesLines = repliesText.split(/\d+[\.、]/).filter(line => line.trim().length > 0);
        
        repliesLines.forEach((line, index) => {
          if (line.trim().length > 0 && index < 3) {
            replies[index] = line.trim();
          }
        });
      }
    }

  } catch (error) {
    console.error('解析API响应时出错:', error);
  }

  const result = {
    sentiment,
    thoughts,
    replies: replies.slice(0, 3) // 确保只返回最多3条建议回复
  };
  
  console.log('处理结果:', JSON.stringify(result));
  return result;
}

module.exports = {
  analyzeConversation
}; 