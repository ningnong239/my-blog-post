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
    // ใช้ esbuild แทน terser (default ของ Vite)
    minify: 'esbuild',
    // ลบ console.log ใน production
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
});
