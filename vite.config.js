import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {serverAddress} from "./global.js";

// https://vite.dev/config/
export default defineConfig({
    publicPath: './',
    plugins: [vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: 8080,
        proxy: { // 代理所有以 /api 开头的请求到远端服务器
            '/api': {
                target: serverAddress,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id
                            .toString()
                            .split('node_modules/')[1]
                            .split('/')[0]
                            .toString();
                    }
                },
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: '[ext]/[name]-[hash].[ext]',
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId
                        ? chunkInfo.facadeModuleId.split('/')
                        : [];
                    const fileName =
                        facadeModuleId[facadeModuleId.length - 2] || '[name]';
                    return `js/${fileName}/[name].[hash].js`;
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: true,
            }
        },
        sourcemap: false,
    },
})
