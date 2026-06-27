# 旧物遇新 · 闲置市场

幸福生活二手交易平台 — **网页 + 微信小程序** 双端，共用一套后端 API。

## 架构

```
xianzhi/
├── src/              # 网页（React + Vite）
├── miniprogram/      # 微信小程序
├── server/           # Express API
└── shared/           # 共享数据与接口约定
```

| 端 | 技术 | 访问 |
|----|------|------|
| 网页 | React 18 · Vite 5 · Tailwind | http://localhost:5173 |
| 小程序 | 微信原生 WXML | 微信开发者工具 |
| API | Express 4 | http://localhost:3001/api |

两端请求同一 API，业务数据维护在 `shared/data/`。

## 功能

- **数据大盘**：各模块统计、发布趋势、城市分布
- **闲置市场** / **求购大厅** / **房屋租赁** / **宠物乐园**
- **订单管理**：买入/卖出、确认付款、完成、取消
- **订单通知**：新订单与状态变更、未读角标
- **登录**：账号密码、短信验证码、微信登录（网页演示 / 小程序 wx.login）
- **我的**：订单、发布、草稿（需登录）
- **首页**：品牌区、统计数据

## 网页本地运行

```bash
npm install
npm run dev
```

- 前端：http://localhost:5173
- API：http://localhost:3001/api

生产环境（网页 + API 同端口）：

```bash
cp .env.prod.example .env.prod   # 填 RDS 账号密码，仅放 ECS
npm run build
npm start
# 对外 https://sp.zaoyinba.com（Nginx 反代 3001）
```

| 环境 | 命令 | 配置 |
|------|------|------|
| 本地 | `npm run dev` | `.env` → 127.0.0.1 MySQL；或 `.env.development` → 测试 RDS |
| 线上 | `npm start` | `.env` + `.env.prod` → RDS `xianzhinew` |

## 微信小程序

详见 [miniprogram/README.md](./miniprogram/README.md)

1. `npm run dev` 启动后端
2. 微信开发者工具导入**项目根目录**
3. 关闭「校验合法域名」

## API

| 接口 | 说明 |
|------|------|
| `GET /api/health` | 健康检查 |
| `GET /api/brand` | 品牌信息 |
| `GET /api/stats` | 首页统计 |
| `GET /api/dashboard` | 数据大盘 |
| `GET /api/idle-items` | 闲置市场 |
| `GET /api/wanted-items?status=seeking` | 求购 |
| `GET /api/rental-listings` | 房屋租赁 |
| `GET /api/pet-listings` | 宠物乐园 |
| `GET /api/orders?role=buy` | 订单列表 |
| `POST /api/orders` | 创建订单 |
| `PATCH /api/orders/:id/status` | 更新订单状态 |
| `GET /api/notifications` | 通知列表（需登录） |
| `POST /api/auth/login` | 账号密码登录 |
| `POST /api/auth/sms/send` | 发送短信验证码 |
| `POST /api/auth/sms/login` | 手机号 + 验证码登录 |
| `POST /api/auth/wechat/login` | 微信 code 或 `{ demo: true }` |
| `GET /api/auth/me` | 当前用户（Bearer Token） |

### 登录与环境变量

复制 `.env.example` 为 `.env` 并按需填写。本地开发可不配置微信/短信：

| 方式 | 演示说明 |
|------|----------|
| 账号密码 | `shenpei` / `123456`（另有 zhang、li、wang） |
| 短信 | 手机号 `13800138000`，验证码见接口返回 `devCode` 或服务端控制台 |
| 微信网页 | 登录页「微信登录（演示）」 |
| 微信小程序 | `pages/login` 调用 `wx.login` |

需登录的页面：`/me`、`/notifications`；下单与订单 API 需携带 `Authorization: Bearer <token>`。

## 管理后台（老板）

| 地址 | 说明 |
|------|------|
| http://localhost:5173/admin/login | 管理员登录 |
| http://localhost:5173/admin | 运营总览 |

演示管理员账号：`shenpei` / `123456`（`role: admin`）。普通用户无法访问 `/api/admin/*`。

功能模块：**总览**、**用户**、**订单**、**全站信息**（闲置/求购/租房/宠物 + 用户发布）、**全站通知**。

## 为何网页与小程序分开写 UI？

- **网页**：React + Tailwind，适合浏览器与 H5
- **小程序**：WXML/WXSS，符合微信规范、包体更小

后续若希望「一套 React 代码」同时出 H5 与小程序，可迁移到 [Taro](https://docs.taro.zone/) 等跨端框架；当前方案改动最小、双端已可并行使用。

## 技术栈

React 18 · Vite 5 · Tailwind CSS 3 · Express 4 · 微信小程序
