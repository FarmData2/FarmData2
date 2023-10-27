import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import glob from 'glob';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';
import { exec } from 'child_process';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';

let viteConfig = {
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
          src: '../module/Controller',
          dest: 'src/',
        },
        {
          src: '../composer.json',
          dest: '.',
        },
      ],
    }),
    {
      // This plugin runs after a build and clears the drupal cache so that
      // the live farmos server shows the most recent content.
      name: 'afterBuild',
      closeBundle: async () => {
        await exec(
          'docker exec fd2_farmos drush cr',
          (error, stderr, stdout) => {
            if (error) {
              console.error(`error:  ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`stderr: ${stderr}`);
              return;
            }
            console.log(`Rebuilding drupal cache...\n  ${stdout}`);
          }
        );
      },
    },
  ],
  build: {
    outDir: '../../dist/farmdata2',
    emptyOutDir: true,
    exclude: ['**/*.cy.js', '**/*.cy.comp.js', '**/*.cy.unit.js'],
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('modules/farm_fd2/src/entrypoints/*')
          .map((dir) => [path.basename(dir), dir + '/index.html'])
      ),
      output: {
        // Ensures that the entry point and css names are not hashed.
        entryFileNames: '[name]/[name].js',
        assetFileNames: (assetInfo) => {
          let ext = assetInfo.name.split('.').at(1);
          if (ext === 'css') {
            return 'shared/[name].css';
          } else {
            return 'shared/[name].[ext]';
          }
        },
        chunkFileNames: '[name]/[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
      '@comps': fileURLToPath(new URL('../../components/', import.meta.url)),
      '@libs': fileURLToPath(new URL('../../libraries/', import.meta.url)),
    },
  },
};

console.log('Building: ');
console.log(viteConfig.build.rollupOptions.input);

export default defineConfig(viteConfig);
