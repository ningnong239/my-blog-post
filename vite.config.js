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
        manualChunks: {
          // แยก vendor libraries
          vendor: ['react', 'react-dom'],
          // แยก Supabase
          supabase: ['@supabase/supabase-js'],
          // แยก UI components
          ui: ['lucide-react'],
          // แยก router
          router: ['react-router-dom'],
        },
      },
    },
    // เพิ่มขนาด limit เป็น 1000 kB
    chunkSizeWarningLimit: 1000,
  },
});
