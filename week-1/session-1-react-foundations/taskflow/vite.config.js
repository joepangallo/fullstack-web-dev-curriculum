/**
 * Vite Configuration for TaskFlow
 * --------------------------------
 * Same setup as the lab — Vite + React plugin for JSX support.
 * This config is intentionally minimal. Vite's defaults are excellent
 * and cover most use cases out of the box.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
