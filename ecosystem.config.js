module.exports = {
  apps: [
    {
      name: 'pixelcraft-web',
      cwd: __dirname,
      script: 'server.js',
      env: {
        PORT: 3000
      }
    },
    {
      name: 'pixelcraft-cabinet-api',
      cwd: require('path').resolve(__dirname, '..', 'PortalPixel', 'server'),
      script: 'index.js',
      env: {
        PORT: 8080
      }
    }
  ]
};
