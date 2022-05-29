import { defineConfig } from "vite";
import unocssPreset from "unocss-preset-alloc";
import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    unocss({
      mode: "global",
      presets: [unocssPreset()],
    }),
  ],
});
