# 微信小程序

与网页版共用同一套 Express API（`server/` + `shared/`）。

## 打开方式

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目，目录选择仓库**根目录**（含 `project.config.json`）
3. 先在本机启动后端：`cd .. && npm run dev`
4. 开发者工具 → **详情 → 本地设置** → 勾选 **不校验合法域名、web-view、TLS**

## API 地址

编辑 `miniprogram/config/env.js`：

| 场景 | apiBase |
|------|---------|
| 模拟器 | `http://127.0.0.1:3001` |
| 真机调试 | `http://你的电脑局域网IP:3001` |
| 正式上线 | `https://已备案域名`（须在公众平台配置 request 合法域名） |

## 页面

| Tab / 页面 | 对应网页路由 |
|------------|----------------|
| 首页 | `/` |
| 数据大盘 | `/dashboard` |
| 闲置 | `/market` |
| 求购 | `/wanted` |
| 租房 | `/rental` |
| 宠物 | `/pets` |

## 上线前

1. 在微信公众平台注册小程序，将 `project.config.json` 中的 `appid` 改为真实 AppID
2. 后端部署 HTTPS，配置 request 合法域名
3. 小程序后台配置服务器域名
