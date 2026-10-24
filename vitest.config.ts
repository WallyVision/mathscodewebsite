import { fileURLToPath } from "node:url";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: { "server-only": fileURLToPath(new URL("./test/server-only.ts", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
    // Database tests share one database, so files run one at a time.
    fileParallelism: false,
  },
});
