/** 应用环境与对外地址（服务端、脚本可读 process.env） */

export function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

const PROD_APP_URL = "https://sp.zaoyinba.com";
const DEV_APP_URL = "http://localhost:5173";

export function getPublicAppUrl(): string {
  const fromEnv = process.env.PUBLIC_APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return isProductionEnv() ? PROD_APP_URL : DEV_APP_URL;
}

export function getApiPort(): number {
  return Number(process.env.PORT) || 3001;
}

/** 启动日志用 */
export function describeRuntimeEnv(): string {
  const prod = isProductionEnv();
  return prod
    ? `production · ${getPublicAppUrl()}`
    : `development · ${getPublicAppUrl()} (API :${getApiPort()})`;
}
