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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // แยก node_modules ออกเป็น chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('lucide-react')) {
              return 'ui-icons';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            // libraries อื่นๆ
            return 'vendor';
          }
        },
      },
    },
    // เพิ่มขนาด limit เป็น 1000 kB
    chunkSizeWarningLimit: 1000,
  },
});
