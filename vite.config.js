import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        // Create an alias for '@' as the /src directory
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      // Define the server's port number
      port: 5173,
    },
    build: {
      // Specify the output directory for the build files
      outDir: 'dist',
    },
    define: {
      'process.env': {
        // Dynamically assign the backend URL from environment variables
        VITE_APP_BACKEND_URL: env.VITE_APP_BACKEND_URL
      }
    }
  }
});
