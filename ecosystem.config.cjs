/** pm2 线上启动：cd /xianzhi/oldtonew && pm2 start ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "oldtonew",
      cwd: __dirname,
      // 直接用 tsx 跑，pm2 监控的就是真正的 node 进程，max_memory_restart 才准确
      script: "node_modules/.bin/tsx",
      args: "server/index.ts",
      instances: 1,
      exec_mode: "fork",
      // 内存超限自动重启，避免泄漏拖垮机器
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        // 限制 V8 堆，纯只读行情接口足够，进一步压低常驻内存
        NODE_OPTIONS: "--max-old-space-size=256",
      },
    },
  ],
};
