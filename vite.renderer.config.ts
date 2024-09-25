import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import vue from "@vitejs/plugin-vue"
import { pluginExposeRenderer } from './vite.base.config';
import path  from 'path';
// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      vue()    
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@" : path.resolve(__dirname, './src'),
        "components" : path.resolve(__dirname, './src/components'),
        "stores" : path.resolve(__dirname,'./src/stores'),
        "types" : path.resolve(__dirname, './src/types')
      }
    },
    clearScreen: false,
  } as UserConfig;
});
