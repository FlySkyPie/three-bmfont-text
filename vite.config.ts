import path from "path";
import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: path.resolve(__dirname, 'lib/index.ts'),
            name: 'threeBmfontText',
            fileName: 'three-bmfont-text',
        },
        rollupOptions: {
            external: "three",
        }
    },
    plugins: [dts({ rollupTypes: true })],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
                // gl: '',
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ]
        }
    }
})