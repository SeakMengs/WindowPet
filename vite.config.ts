import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        react(),
        tsconfigPaths(),
        checker({
            // e.g. use TypeScript check
            typescript: true,
        }),
    ],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
        // Tauri supports es2021
        target:
            process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
        // don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    },
    esbuild: {
        supported: {
            "top-level-await": true, //browsers can handle top-level-await features
        },
    },
    // vitest need to configure it to use a browser environment and not a node one: https://vitest.dev/config/#environment
    // https://github.com/wobsoriano/vitest-canvas-mock
    test: {
        global: true,
        environment: "jsdom",
        setupFiles: ["./vitest.setup.ts"],
        optimizer: {
            web: {
                include: ["vitest-canvas-mock"],
            },
        },
    },
}));
