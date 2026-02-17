/**
 * =============================================================
 * VITE CONFIGURATION - Full-Stack Integration
 * =============================================================
 *
 * The proxy configuration is critical for full-stack development.
 * It forwards /api requests from the Vite dev server (port 5173)
 * to the Express backend (port 3001).
 *
 * WITHOUT PROXY:
 *   Frontend: http://localhost:5173
 *   API call: fetch('http://localhost:3001/api/tasks')
 *   Problem: CORS error! Different origins.
 *
 * WITH PROXY:
 *   Frontend: http://localhost:5173
 *   API call: fetch('/api/tasks')
 *   Vite proxy: forwards to http://localhost:3001/api/tasks
 *   Result: Works! Same origin from browser's perspective.
 * =============================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    // Proxy API requests to the Express backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Also proxy uploaded files
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
