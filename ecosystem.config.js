module.exports = {
  apps: [
    {
      name: "smartpark",
      script: "npm",
      args: "start",
      cwd: "/home/azureuser/smartpark",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_URI: "mongodb://127.0.0.1:27017/smartpark",
        JWT_SECRET: "your_secure_secret_key_here",
      },
      error_file: "/var/log/pm2/smartpark-error.log",
      out_file: "/var/log/pm2/smartpark-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "500M",
      watch: false,
    },
  ],
};
