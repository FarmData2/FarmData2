import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

let viteConfig = {
  root: 'modules/farm_fd2_school/src/entrypoints',
  publicDir: '../public',
  base: '/fd2_school/',
  plugins: [],
  build: {
    outDir: '../../dist/farmdata2',
    emptyOutDir: true,
    rollupOptions: {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
      '@comps': fileURLToPath(new URL('../../components/', import.meta.url)),
      '@libs': fileURLToPath(new URL('../../library/', import.meta.url)),
      '@css': fileURLToPath(new URL('../css/', import.meta.url)),
    },
  },
};

export default defineConfig(viteConfig);
