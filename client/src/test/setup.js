import { beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Create MSW server instance
export const server = setupServer(
  // Chat API endpoint mock
  rest.post(`${import.meta.env.VITE_API_URL}/api/chat`, async (req, res, ctx) => {
    const { message } = await req.json()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return res(
      ctx.status(200),
      ctx.json({
        response: `Mock response to: ${message}`
      })
    )
  })
)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close()) 