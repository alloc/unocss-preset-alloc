import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig({
  entry: Object.values(pkg.exports).map((entry: any) =>
    entry.import.replace("dist", "src").replace(/\.mjs$/, ".ts")
  ),
  format: ["cjs", "esm"],
  treeshake: false,
  dts: true,
});
