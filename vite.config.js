import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // เพิ่มขนาด limit เป็น 1000 kB
    chunkSizeWarningLimit: 1000,
    // ลดขนาด bundle โดยการ minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // ลบ console.log ใน production
        drop_debugger: true, // ลบ debugger ใน production
      },
    },
  },
});
