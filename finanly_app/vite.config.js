import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  resolve: {
    alias: {
      '@/components/ui': path.resolve(__dirname, './src/components/layout/ui'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
});
