import "./loadEnv.js";
import { describeRuntimeEnv } from "../shared/appConfig.js";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import fundRoutes from "./fundRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

/**
 * 运行中的代码版本：
 * - 部署时由 scripts/rsync-to-ecs.sh 生成 version.json 一起同步（生产机没有 .git）
 * - 本地开发无 version.json 时，回退到实时读取 git commit
 */
const STARTED_AT = new Date().toISOString();
const VERSION: {
  commit: string;
  commitTime: string | null;
  buildTime: string | null;
} = { commit: "unknown", commitTime: null, buildTime: null };
try {
  const versionPath = path.resolve(__dirname, "../version.json");
  if (fs.existsSync(versionPath)) {
    Object.assign(VERSION, JSON.parse(fs.readFileSync(versionPath, "utf8")));
  } else {
    VERSION.commit = execSync("git rev-parse --short HEAD", {
      cwd: __dirname,
    })
      .toString()
      .trim();
    VERSION.commitTime = execSync("git log -1 --format=%cI", {
      cwd: __dirname,
    })
      .toString()
      .trim();
  }
} catch {
  /* 拿不到版本信息时保持 unknown，不影响启动 */
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "fund-api",
    nodeEnv: process.env.NODE_ENV ?? "(未设置)",
    commit: VERSION.commit,
    startedAt: STARTED_AT,
  });
});

// 查询当前服务器运行的代码版本（commit / 提交时间 / 构建时间 / 启动时间）
app.get("/api/version", (_req, res) => {
  res.json({
    commit: VERSION.commit,
    commitTime: VERSION.commitTime,
    buildTime: VERSION.buildTime,
    startedAt: STARTED_AT,
    nodeEnv: process.env.NODE_ENV ?? "(未设置)",
  });
});

app.use("/api/fund", fundRoutes);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: err.message || "服务器错误" });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[env] ${describeRuntimeEnv()}`);
  console.log(`API server http://localhost:${PORT}`);
});
