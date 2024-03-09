import { defineConfig } from 'umi';
import path from 'node:path';

export default defineConfig({
  title: '哔哔音乐',
  npmClient: 'pnpm',
  mpa: {
    template: './template.html',
    // entry: {
    //   index: './src/index.tsx',
    // },
  },
  alias: {
    '@wails': path.resolve('./wailsjs'),
    // '@bb-music/app': '/Users/lyy/code/project/bb-music/core/app',
  },
  extraBabelIncludes: ['@bb-music/app'],
  mfsu: false,
});
