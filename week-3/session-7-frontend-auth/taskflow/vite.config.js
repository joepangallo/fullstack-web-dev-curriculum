/**
 * =============================================================
 * TASKFLOW - VITE CONFIGURATION
 * =============================================================
 *
 * Same Vite setup as the lab, configured for TaskFlow.
 * The proxy forwards /api requests to the TaskFlow backend
 * which will be built in Session 8.
 * =============================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
