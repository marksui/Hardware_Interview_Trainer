import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const devIndexFallback = (): Plugin => ({
  name: "dev-index-fallback",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const request = req as { url?: string };
      if (request.url === "/") {
        request.url = "/dev.html";
      }
      next();
    });
  },
});

export default defineConfig({
  base: "./",
  plugins: [devIndexFallback(), react()],
  build: {
    rollupOptions: {
      input: new URL("./dev.html", import.meta.url).pathname,
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name ?? "";
          return fileName.slice(-4) === ".css" ? "assets/index.css" : "assets/[name][extname]";
        },
      },
    },
  },
});
