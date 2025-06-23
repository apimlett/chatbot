import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createPinia, setActivePinia } from 'pinia'

// Mock CSS imports for Vuetify
import 'vitest-canvas-mock'

// Mock CSS imports to prevent errors
global.CSS = { escape: (str) => str }

// Mock ResizeObserver for Vuetify
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver for Vuetify
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Create MSW server instance
export const server = setupServer(
  // Health API endpoint mock
  http.get('*/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      nodeEnv: 'test'
    })
  }),
  
  // Status API endpoint mock
  http.get('*/api/status', () => {
    return HttpResponse.json({
      server: 'Express.js',
      status: 'running',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    })
  }),
  
  // Example API endpoint mock
  http.post('*/api/example', async ({ request }) => {
    const data = await request.json()
    
    return HttpResponse.json({
      success: true,
      result: {
        received: data.data || 'No data provided',
        processed: true,
        timestamp: new Date().toISOString()
      }
    })
  })
)

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
  // Setup Pinia for tests
  setActivePinia(createPinia())
})

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers()
  // Reset Pinia state for each test
  setActivePinia(createPinia())
})

// Close server after all tests
afterAll(() => server.close()) 