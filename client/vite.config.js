import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

const proxyPort = process.env.PROXY_PORT || 3001;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/api/": {
        target: `http://localhost:${proxyPort}`,
        changeOrigin: true,
        secure: false,
        // ws: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request to the Target:",
              req.method,
              req.url,
              "body:",
              proxyReq.body
              // proxyReq
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              // "body:",
              // proxyRes.body,
              req.url
            );
          });
        },
      },
    },
  },
});
