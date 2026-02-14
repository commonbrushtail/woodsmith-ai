import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Load .env.local for integration tests that need Supabase credentials
const envLocal = {}
try {
  const content = fs.readFileSync('.env.local', 'utf8')
  for (const line of content.split('\n')) {
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...rest] = line.split('=')
      envLocal[key.trim()] = rest.join('=').trim()
    }
  }
} catch {
  // .env.local may not exist in CI
}

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    env: envLocal,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
