/**
 * =============================================================
 * VITE CONFIGURATION
 * =============================================================
 *
 * Vite is a modern build tool that provides:
 *   - Lightning-fast Hot Module Replacement (HMR)
 *   - Out-of-the-box JSX/React support via plugin
 *   - Dev server with proxy capabilities
 *   - Optimized production builds
 *
 * KEY CONCEPTS:
 *   - Plugins: Extend Vite's capabilities (here, React support)
 *   - Server config: Dev server settings like port and proxy
 *   - The proxy setting forwards /api requests to our backend
 *     so we avoid CORS issues during development
 * =============================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The React plugin enables JSX transformation and Fast Refresh
  plugins: [react()],

  server: {
    // Dev server runs on port 5173 by default
    port: 5173,

    // Proxy API requests to our backend server
    // This means fetch('/api/auth/login') in the browser
    // actually goes to http://localhost:3001/api/auth/login
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
