# Rate & Reply - 微信小程序

一个简洁美观的微信小程序，帮助分析聊天对话并生成最佳回复建议。采用Apple风格的设计理念。

## 功能

- **文本输入**: 粘贴对话文本进行分析
- **图片上传**: 上传对话截图
- **情感分析**: 了解对方对您的感受
- **思想分析**: 获取对方可能的想法和意图
- **回复建议**: 获取三个AI生成的最佳回复
- **一键复制**: 方便地复制任意建议回复

## 项目结构

```
RateAndReply/
├── app.js             # 小程序入口逻辑
├── app.json           # 小程序全局配置
├── app.wxss           # 小程序全局样式
├── pages/             # 页面文件夹
│   ├── index/         # 首页
│   │   ├── index.js   # 首页逻辑
│   │   ├── index.json # 首页配置
│   │   ├── index.wxml # 首页结构
│   │   └── index.wxss # 首页样式
│   └── result/        # 结果页
│       ├── result.js
│       ├── result.json
│       ├── result.wxml
│       └── result.wxss
├── assets/            # 资源文件夹
├── project.config.json    # 项目配置
└── sitemap.json       # 站点地图配置
```

## 实现说明

当前原型使用模拟数据进行分析和回复生成。在实际应用中，您需要：

1. 实现真实的AI API调用来分析对话文本
2. 使用OCR（光学字符识别）从上传的截图中提取文本
3. 实现适当的错误处理和加载状态
4. 添加用户认证和隐私功能

## 开发和使用

1. 使用微信开发者工具打开此项目
2. 输入您的对话（粘贴文本或上传图片）
3. 点击"分析"
4. 查看分析结果和建议回复
5. 点击任意回复进行选择，然后点击"复制选中的回复"

## 未来增强

- 更详细的情感分析
- 上下文感知的回复生成
- 支持多种聊天平台的对话分析

## 配置说明

本项目需要配置API密钥才能正常工作。请按照以下步骤设置：

1. 在`utils`目录下，将`config.example.js`复制为`config.js`
2. 在`config.js`中填入您的API密钥和相关配置信息：
   - 腾讯元启API配置（必需）
   - Google Gemini API配置（可选，用于切换模型）

**注意**：`config.js`文件包含敏感信息，已被添加到`.gitignore`中，不会提交到Git仓库。 