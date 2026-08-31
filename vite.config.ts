import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@midnight-ntwrk/midnight-js-types': path.resolve(process.cwd(), './src/mock-midnight.ts'),
      '@midnight-ntwrk/midnight-js-contracts': path.resolve(process.cwd(), './src/mock-midnight.ts'),
      '@midnight-ntwrk/dapp-connector-proof-provider': path.resolve(process.cwd(), './src/mock-midnight.ts')
    }
  }
})
