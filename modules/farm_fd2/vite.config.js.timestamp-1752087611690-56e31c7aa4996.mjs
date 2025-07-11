// modules/farm_fd2/vite.config.js
import { fileURLToPath, URL } from 'node:url';
import glob from 'file:///home/fd2dev/FarmData2/node_modules/glob/glob.js';
import { defineConfig } from 'file:///home/fd2dev/FarmData2/node_modules/vite/dist/node/index.js';
import { viteStaticCopy } from 'file:///home/fd2dev/FarmData2/node_modules/vite-plugin-static-copy/dist/index.js';
import vue from 'file:///home/fd2dev/FarmData2/node_modules/@vitejs/plugin-vue/dist/index.mjs';
import { exec } from 'child_process';
import Components from 'file:///home/fd2dev/FarmData2/node_modules/unplugin-vue-components/dist/vite.mjs';
import { BootstrapVueNextResolver } from 'file:///home/fd2dev/FarmData2/node_modules/unplugin-vue-components/dist/resolvers.mjs';
var __vite_injected_original_import_meta_url =
  'file:///home/fd2dev/FarmData2/modules/farm_fd2/vite.config.js';
var viteConfig = {
  root: 'modules/farm_fd2/src/entrypoints',
  publicDir: '../public',
  base: '/fd2/',
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
    viteStaticCopy({
      // Copy the Drupal module stuff...
      targets: [
        {
          src: '../module/*.yml',
          dest: '.',
        },
        {
          src: '../module/*.install',
          dest: '.',
        },
        {
          src: '../module/Controller',
          dest: 'src/',
        },
        {
          src: '../module/config',
          dest: '.',
        },
        {
          src: '../composer.json',
          dest: '.',
        },
        {
          src: '../module/*.css',
          dest: 'style/',
        },
        {
          src: '../module/*.module',
          dest: '.',
        },
      ],
    }),
    {
      // This plugin runs after a build and clears the drupal cache so that
      // the live farmos server shows the most recent content.
      name: 'afterBuild',
      closeBundle: async () => {
        exec('docker exec fd2_farmos drush cr', (error, stderr, stdout) => {
          if (error) {
            console.error(`error:  ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`Rebuilding drupal cache...
  ${stdout}`);
        });
      },
    },
  ],
  build: {
    outDir: '../../dist/farmdata2',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('modules/farm_fd2/src/entrypoints/*/*.html').map((dir) => {
          let key = dir.split('/').at(-2) + '/' + dir.split('/').at(-1);
          return [key, dir];
        })
      ),
      output: {
        // Ensures that the entry point and css names are not hashed.
        entryFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
        chunkFileNames: '[name]/[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src/', __vite_injected_original_import_meta_url)
      ),
      '@comps': fileURLToPath(
        new URL('../../components/', __vite_injected_original_import_meta_url)
      ),
      '@libs': fileURLToPath(
        new URL('../../library/', __vite_injected_original_import_meta_url)
      ),
      '@css': fileURLToPath(
        new URL('../css/', __vite_injected_original_import_meta_url)
      ),
    },
  },
};
console.log('Building: ');
console.log(viteConfig.build.rollupOptions.input);
var vite_config_default = defineConfig(viteConfig);
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibW9kdWxlcy9mYXJtX2ZkMi92aXRlLmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2ZkMmRldi9GYXJtRGF0YTIvbW9kdWxlcy9mYXJtX2ZkMlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZmQyZGV2L0Zhcm1EYXRhMi9tb2R1bGVzL2Zhcm1fZmQyL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2ZkMmRldi9GYXJtRGF0YTIvbW9kdWxlcy9mYXJtX2ZkMi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5JztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgQm9vdHN0cmFwVnVlTmV4dFJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcblxubGV0IHZpdGVDb25maWcgPSB7XG4gIHJvb3Q6ICdtb2R1bGVzL2Zhcm1fZmQyL3NyYy9lbnRyeXBvaW50cycsXG4gIHB1YmxpY0RpcjogJy4uL3B1YmxpYycsXG4gIGJhc2U6ICcvZmQyLycsXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW0Jvb3RzdHJhcFZ1ZU5leHRSZXNvbHZlcigpXSxcbiAgICB9KSxcbiAgICB2aXRlU3RhdGljQ29weSh7XG4gICAgICAvLyBDb3B5IHRoZSBEcnVwYWwgbW9kdWxlIHN0dWZmLi4uXG4gICAgICB0YXJnZXRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICcuLi9tb2R1bGUvKi55bWwnLFxuICAgICAgICAgIGRlc3Q6ICcuJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJy4uL21vZHVsZS8qLmluc3RhbGwnLFxuICAgICAgICAgIGRlc3Q6ICcuJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJy4uL21vZHVsZS9Db250cm9sbGVyJyxcbiAgICAgICAgICBkZXN0OiAnc3JjLycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICcuLi9tb2R1bGUvY29uZmlnJyxcbiAgICAgICAgICBkZXN0OiAnLicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICcuLi9jb21wb3Nlci5qc29uJyxcbiAgICAgICAgICBkZXN0OiAnLicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICcuLi9tb2R1bGUvKi5jc3MnLFxuICAgICAgICAgIGRlc3Q6ICdzdHlsZS8nLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnLi4vbW9kdWxlLyoubW9kdWxlJyxcbiAgICAgICAgICBkZXN0OiAnLicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICAgIHtcbiAgICAgIC8vIFRoaXMgcGx1Z2luIHJ1bnMgYWZ0ZXIgYSBidWlsZCBhbmQgY2xlYXJzIHRoZSBkcnVwYWwgY2FjaGUgc28gdGhhdFxuICAgICAgLy8gdGhlIGxpdmUgZmFybW9zIHNlcnZlciBzaG93cyB0aGUgbW9zdCByZWNlbnQgY29udGVudC5cbiAgICAgIG5hbWU6ICdhZnRlckJ1aWxkJyxcbiAgICAgIGNsb3NlQnVuZGxlOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIGV4ZWMoJ2RvY2tlciBleGVjIGZkMl9mYXJtb3MgZHJ1c2ggY3InLCAoZXJyb3IsIHN0ZGVyciwgc3Rkb3V0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBlcnJvcjogICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN0ZGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgc3RkZXJyOiAke3N0ZGVycn1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coYFJlYnVpbGRpbmcgZHJ1cGFsIGNhY2hlLi4uXFxuICAke3N0ZG91dH1gKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnLi4vLi4vZGlzdC9mYXJtZGF0YTInLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgZ2xvYi5zeW5jKCdtb2R1bGVzL2Zhcm1fZmQyL3NyYy9lbnRyeXBvaW50cy8qLyouaHRtbCcpLm1hcCgoZGlyKSA9PiB7XG4gICAgICAgICAgbGV0IGtleSA9IGRpci5zcGxpdCgnLycpLmF0KC0yKSArICcvJyArIGRpci5zcGxpdCgnLycpLmF0KC0xKTtcbiAgICAgICAgICByZXR1cm4gW2tleSwgZGlyXTtcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBlbnRyeSBwb2ludCBhbmQgY3NzIG5hbWVzIGFyZSBub3QgaGFzaGVkLlxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ1tuYW1lXS9bbmFtZV0uanMnLFxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ1tuYW1lXS9bbmFtZV0uW2V4dF0nLFxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ1tuYW1lXS9bbmFtZV0uanMnLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy8nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAY29tcHMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4uLy4uL2NvbXBvbmVudHMvJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGxpYnMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4uLy4uL2xpYnJhcnkvJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGNzcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi4vY3NzLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zb2xlLmxvZygnQnVpbGRpbmc6ICcpO1xuY29uc29sZS5sb2codml0ZUNvbmZpZy5idWlsZC5yb2xsdXBPcHRpb25zLmlucHV0KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHZpdGVDb25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLGVBQWUsV0FBVztBQUMxVSxPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxzQkFBc0I7QUFDL0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsWUFBWTtBQUNyQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGdDQUFnQztBQVA2SSxJQUFNLDJDQUEyQztBQVN2TyxJQUFJLGFBQWE7QUFBQSxFQUNmLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUNYLE1BQU07QUFBQSxFQUNO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
