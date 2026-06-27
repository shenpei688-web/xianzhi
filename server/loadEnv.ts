/**
 * 按环境加载 .env：
 * - 保留 pm2 / npm 注入的 NODE_ENV（防止 .env 覆盖成 development）
 * - NODE_ENV=development → .env.development
 * - 否则 → .env.prod
 * 纯只读行情服务，不再需要任何第三方密钥。
 */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const envPath = path.join(projectRoot, ".env");
const prodEnvPath = path.join(projectRoot, ".env.prod");
const devEnvPath = path.join(projectRoot, ".env.development");

const injectedNodeEnv = process.env.NODE_ENV;

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

if (injectedNodeEnv) {
  process.env.NODE_ENV = injectedNodeEnv;
}

const isDev = process.env.NODE_ENV === "development";
if (isDev && fs.existsSync(devEnvPath)) {
  dotenv.config({ path: devEnvPath, override: true });
} else if (fs.existsSync(prodEnvPath)) {
  dotenv.config({ path: prodEnvPath, override: true });
}
