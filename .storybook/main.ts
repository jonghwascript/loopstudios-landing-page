import type { StorybookConfig } from '@storybook/html-vite';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// 없는 폴더를 staticDirs에 넣으면 빌드가 실패한다. 프로젝트마다 fonts 폴더 유무가 달라 있을 때만 넣는다.
const fontsDir = fileURLToPath(new URL('../src/fonts', import.meta.url));

const config: StorybookConfig = {
  stories: [
      '../src/**/*.mdx',
      '../src/**/*.stories.@(js|mjs|cjs)'
    ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [
    { from: '../src/images', to: '/images' },
    ...(existsSync(fontsDir) ? [{ from: '../src/fonts', to: '/fonts' }] : []),
  ],
};

export default config;
