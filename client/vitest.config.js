import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    // Handle CSS imports in tests
    css: {
      modules: {
        classNameStrategy: 'stable'
      }
    },
    // Mock CSS imports
    deps: {
      inline: ['vuetify']
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'dist/',
        '*.config.js',
        '.husky/'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },
    // Fail tests if coverage is below threshold
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})