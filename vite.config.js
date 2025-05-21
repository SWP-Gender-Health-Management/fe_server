import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Node.js path module

export default defineConfig({
  plugins: [react()], // Sử dụng plugin React của Vite
  resolve: {
    alias: {
      // Tạo aliases để import ngắn gọn hơn
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});