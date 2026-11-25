import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base works seamlessly on both GitHub Pages subpaths and Vercel root deployments.
  // Override via VITE_BASE_PATH (e.g. "/TaskFlow/") when needed.
  base: process.env.VITE_BASE_PATH ?? './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
