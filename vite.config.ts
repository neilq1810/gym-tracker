import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this app from /gym-tracker/, so assets must be
  // requested with that prefix in production. Local dev keeps root '/'.
  base: process.env.GITHUB_PAGES ? '/gym-tracker/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
