import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
    },
    define: {
      'process.env': {
        VITE_APP_BACKEND_URL: env.VITE_APP_BACKEND_URL
      }
    }
  }
});
