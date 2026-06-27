#!/usr/bin/env bash
# 强制释放 3001 端口（杀掉占用该端口的所有进程）
set -euo pipefail

PORT=3001

echo "==> 当前占用 ${PORT} 的进程："
ss -tlnp | grep ":${PORT}" || echo "（无）"

pids=""
if command -v fuser >/dev/null 2>&1; then
  pids=$(fuser "${PORT}/tcp" 2>/dev/null | tr -s ' ' '\n' | grep -E '^[0-9]+$' || true)
fi

if [ -z "$pids" ] && command -v lsof >/dev/null 2>&1; then
  pids=$(lsof -t -i:"${PORT}" -sTCP:LISTEN 2>/dev/null || true)
fi

if [ -z "$pids" ]; then
  pids=$(ss -tlnp 2>/dev/null | grep ":${PORT}" | grep -oP 'pid=\K[0-9]+' | sort -u || true)
fi

if [ -z "$pids" ]; then
  echo "==> ${PORT} 未被占用"
  exit 0
fi

echo "==> 强制结束: $pids"
for pid in $pids; do
  kill -9 "$pid" 2>/dev/null || true
done

sleep 1

if ss -tlnp | grep -q ":${PORT}"; then
  echo "ERROR: ${PORT} 仍被占用，请手动检查："
  ss -tlnp | grep ":${PORT}"
  exit 1
fi

echo "==> ${PORT} 已释放"
