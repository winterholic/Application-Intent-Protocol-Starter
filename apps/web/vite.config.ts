import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 개발 중에는 generator를 빌드하지 않고 소스를 직접 쓴다.
    alias: {
      "@makeaip/generator": fileURLToPath(new URL("../../packages/generator/src/index.ts", import.meta.url)),
    },
  },
});
