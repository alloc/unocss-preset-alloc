import { defineConfig } from "tsup";

export default defineConfig({
  entry: Object.values(require("./package.json").exports).map((entry: any) =>
    entry.require.replace("dist", "src").replace(/\.js$/, ".ts")
  ),
  format: ["cjs", "esm"],
  treeshake: false,
  dts: true,
});
