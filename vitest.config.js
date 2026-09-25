import { defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default mergeConfig(
  defineConfig({ plugins: [react()] }),
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.js'],
      css: true,
      exclude: ['node_modules', 'cypress', 'dist'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: ['cypress/**', 'src/main.jsx', '**/*.config.js'],
      },
    },
  }),
);
