import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/ai-whale': process.env.AI_WHALE_API_URL || 'http://localhost:3001',
      '/api/generate-quiz': process.env.AI_DOLPHIN_API_URL || 'http://localhost:5001',
      '/api/explain-term': process.env.AI_DOLPHIN_API_URL || 'http://localhost:5001'
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
