// Test setup file
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:5173';

// Set reasonable rate limits for testing (more permissive for most tests)
process.env.RATE_LIMIT_WINDOW_MS = '1000';  // 1 second window
process.env.RATE_LIMIT_MAX = '50';          // 50 requests per window (more permissive)

// Mock OpenAI for tests
jest.mock('openai', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    choices: [{
      message: {
        content: 'Mock OpenAI response'
      }
    }]
  });

  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }));
});

// Increase timeout for integration tests
jest.setTimeout(10000);