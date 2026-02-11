import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, extname } from 'node:path';
import fs from 'node:fs';

const redirectRootToCabinet = () => ({
  name: 'redirect-root-to-cabinet',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/' || req.url === '/index.html') {
        res.statusCode = 302;
        res.setHeader('Location', '/cabinet/');
        res.end();
        return;
      }
      next();
    });

    server.middlewares.use(async (req, res, next) => {
      const url = req.url || '';
      if (!url.startsWith('/cabinet')) {
        next();
        return;
      }

      if (url.startsWith('/cabinet/assets') || extname(url)) {
        next();
        return;
      }

      const indexPath = resolve(__dirname, 'cabinet/index.html');
      const html = fs.readFileSync(indexPath, 'utf-8');
      const transformed = await server.transformIndexHtml(url, html);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(transformed);
    });
  }
});

export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' : '/cabinet/',
  plugins: [redirectRootToCabinet(), react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    rollupOptions: {
      input: {
        cabinet: resolve(__dirname, 'cabinet/index.html')
      }
    }
  }
});
