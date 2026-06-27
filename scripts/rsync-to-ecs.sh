#!/usr/bin/env bash
# 本地 Mac → 阿里云 ECS 同步代码（在仓库根目录执行）
# 用法: bash scripts/rsync-to-ecs.sh
# 先测 SSH: ssh ecs-user@47.98.227.62

set -euo pipefail

ECS_USER="${ECS_USER:-ecs-user}"
ECS_HOST="${ECS_HOST:-47.98.227.62}"
REMOTE_DIR="${REMOTE_DIR:-/xianzhi/oldtonew}"

cd "$(dirname "$0")/.."

# 生成版本文件，随代码一起同步到服务器（生产机没有 .git，靠它判断运行的是哪份代码）
GIT_COMMIT="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
GIT_TIME="$(git log -1 --format=%cI 2>/dev/null || echo '')"
BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > version.json <<EOF
{ "commit": "${GIT_COMMIT}", "commitTime": "${GIT_TIME}", "buildTime": "${BUILD_TIME}" }
EOF
echo "==> 版本: ${GIT_COMMIT} (${GIT_TIME})"

echo "==> 目标: ${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}"
echo "==> 若提示密码，请输入 ECS 实例密码（输入时不显示字符）"
echo

rsync -avz --progress \
  --exclude node_modules \
  --exclude dist \
  --exclude .env \
  --exclude .env.development \
  --exclude .env.development.bak \
  --exclude .git \
  ./ "${ECS_USER}@${ECS_HOST}:${REMOTE_DIR}/"

echo
echo "==> 同步完成。登录服务器后部署:"
echo "    ssh ${ECS_USER}@${ECS_HOST}"
echo "    cd ${REMOTE_DIR} && npm install && npm run build && bash scripts/deploy-prod.sh"
echo
echo "若 rsync 报 Permission denied（目录无写权限），可先同步到 home:"
echo "    REMOTE_DIR=~/oldtonew bash scripts/rsync-to-ecs.sh"
echo "    ssh ${ECS_USER}@${ECS_HOST} 'sudo mkdir -p /xianzhi/oldtonew && sudo rsync -a ~/oldtonew/ /xianzhi/oldtonew/'"
