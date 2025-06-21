import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { createPinia, setActivePinia } from 'pinia'

// Create MSW server instance
export const server = setupServer(
  // Chat API endpoint mock - catch all /api/chat requests regardless of base URL
  http.post('*/api/chat', async ({ request }) => {
    const { message } = await request.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return HttpResponse.json({
      response: `Mock response to: ${message}`
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