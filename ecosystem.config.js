module.exports = {
    apps: [
      {
        name: 'your-app-name',
        script: 'server.js',
        instances: 'max',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };
  