/**
 * Vite Configuration
 * ------------------
 * Vite is a modern build tool that provides:
 *   - Lightning-fast dev server with Hot Module Replacement (HMR)
 *   - Optimized production builds
 *   - Built-in support for JSX when using the React plugin
 *
 * The @vitejs/plugin-react plugin enables:
 *   - Fast Refresh (instant feedback when you edit components)
 *   - JSX transformation (converts JSX syntax into JavaScript)
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
