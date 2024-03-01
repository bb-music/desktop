import { defineConfig } from 'umi';
import path from 'node:path';

export default defineConfig({
  title: '哔哔音乐',
  npmClient: 'pnpm',
  mpa: {
    // template: './template.html',
    // entry: {
    //   index: './src/index.tsx',
    // },
  },
  alias: {
    '@wails': path.resolve('./wailsjs'),
    '@bb-music/web-app': path.resolve('./app'),
  },
  extraBabelIncludes: [
    path.join(__dirname, './app'),
    // '@bb-music/web-app'
  ],
  mfsu: false,
});
