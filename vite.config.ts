import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vite.dev/config/
export default defineConfig({
  plugins: [wasm(), topLevelAwait(), react()],
  resolve: {
    dedupe: [
      '@midnight-ntwrk/compact-runtime',
      '@midnight-ntwrk/compact-js',
      '@midnight-ntwrk/midnight-js-contracts',
      '@midnight-ntwrk/midnight-js-protocol'
    ]
  },
  build: {
    target: 'esnext'
  },
  // @ts-ignore
  test: {
    include: ['test/**/*.test.ts']
  }
});
