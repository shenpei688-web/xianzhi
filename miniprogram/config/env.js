/**
 * 小程序 API 地址
 * 开发：微信开发者工具 → 详情 → 本地设置 → 勾选「不校验合法域名」
 * 真机调试：改为电脑局域网 IP，如 http://192.168.1.100:3001
 * 上线：改为 https 已备案域名，并在微信公众平台配置 request 合法域名
 */
let envVersion = "develop";
try {
  envVersion = wx.getAccountInfoSync().miniProgram.envVersion || "develop";
} catch (e) {
  /* 开发者工具旧版本兼容 */
}

const PROD_API = "https://sp.zaoyinba.com";

const config = {
  develop: "http://127.0.0.1:3001",
  trial: PROD_API,
  release: PROD_API,
};

module.exports = {
  apiBase: config[envVersion] || config.develop,
  envVersion,
};
