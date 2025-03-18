import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "default",
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000
  }
});
