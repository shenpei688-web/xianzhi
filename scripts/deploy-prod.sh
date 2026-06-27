#!/usr/bin/env bash
# 线上 ECS 一键部署：cd /xianzhi/oldtonew && bash scripts/deploy-prod.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> 目录: $(pwd)"
echo "==> git pull"
git fetch origin main
git pull origin main
echo "    HEAD: $(git log -1 --oneline)"

echo "==> 清理会覆盖线上配置的本地开发 env"
rm -f .env.development

echo "==> npm install（仅纳指基金只读 API，无需数据库/支付宝）"
npm install

echo "==> 重启 pm2（先强制释放 3001，再 delete + start）"
pm2 delete oldtonew 2>/dev/null || true
bash scripts/kill-port-3001.sh
pm2 start ecosystem.config.cjs
pm2 save

echo "==> 等待服务就绪"
sleep 3

echo "==> 验证"
echo "--- /api/health ---"
curl -s http://127.0.0.1:3001/api/health
echo
echo "--- /api/fund/quotes（截断） ---"
curl -s "http://127.0.0.1:3001/api/fund/quotes" | head -c 200
echo

if curl -s http://127.0.0.1:3001/api/health | grep -q '"nodeEnv"'; then
  echo "OK: 已运行新版代码（fund-api）"
else
  echo "WARN: health 无 nodeEnv 字段，可能仍是旧代码，请检查 git log 与 pm2 show oldtonew"
  exit 1
fi
