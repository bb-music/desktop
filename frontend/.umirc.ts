import { defineConfig } from 'umi';
import path from 'node:path';

export default defineConfig({
  npmClient: 'pnpm',
  mpa: {
    // template: './template.html',
    // entry: {
    //   index: './src/index.tsx',
    // },
  },
  alias: {
    '@wails': path.resolve('./wailsjs'),
  },
  extraBabelIncludes: ['@bb-music/web-app'],
  mfsu: false,
});
