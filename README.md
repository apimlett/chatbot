# LangChain Chatbot

A full-stack chatbot implementation using LangChain, OpenAI, and a modern web interface.

## Project Structure

```
.
├── client/          # Frontend Vue.js application
├── server/          # Backend Node.js/Express server
├── .env            # Environment variables (create from .env.example)
└── README.md       # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   PORT=3001
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

## Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The client will run on http://localhost:3000

## Testing

The project includes a comprehensive test suite using Vitest, Testing Library, and MSW for API mocking.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Coverage

The test suite provides coverage for:

1. Component Rendering
   - Chat interface rendering
   - Input field presence
   - Send button presence
   - Message display

2. User Interactions
   - Message sending
   - Empty message handling
   - Input field states
   - Message history

3. API Integration
   - Successful API calls
   - Error handling
   - Response display
   - Loading states

4. Edge Cases
   - Empty message validation
   - API error scenarios
   - Concurrent message handling

### Test Structure

```
client/
├── src/
│   ├── test/
│   │   └── setup.js        # Test configuration and API mocking
│   ├── App.test.js         # Main component tests
│   └── App.vue             # Main component
```

### API Mocking

The test suite uses MSW (Mock Service Worker) to mock API responses:

```javascript
// Example API mock
rest.post('/api/chat', async (req, res, ctx) => {
  const { message } = await req.json()
  return res(
    ctx.status(200),
    ctx.json({
      response: `Mock response to: ${message}`
    })
  )
})
```

### Test Cases

1. Component Rendering
   ```javascript
   it('renders the chat interface', () => {
     // Verifies basic component structure
   })
   ```

2. Message Handling
   ```javascript
   it('sends a message and displays the response', async () => {
     // Tests message sending and response display
   })
   ```

3. Error Handling
   ```javascript
   it('handles API errors gracefully', async () => {
     // Tests error scenarios and user feedback
   })
   ```

4. State Management
   ```javascript
   it('disables input while sending message', async () => {
     // Tests loading states and UI feedback
   })
   ```

### Coverage Reports

The test suite generates coverage reports in multiple formats:
- Text summary in console
- HTML report for detailed analysis
- JSON data for CI integration

Coverage metrics include:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Features

- Modern Vue.js frontend with real-time chat interface
- Express backend with LangChain integration
- OpenAI GPT-3.5-turbo model integration
- Environment variable configuration
- Error handling and loading states
- Responsive design
- Comprehensive test suite

## Development

- Server runs on port 3001
- Client runs on port 3000
- API endpoints:
  - POST `/api/chat` - Send messages to the chatbot
  - GET `/api/health` - Check server status

## Environment Variables

### Server (.env)
```
OPENAI_API_KEY=your-api-key-here
PORT=3001
```

### Client (.env)
```
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

1. If the client can't connect to the server:
   - Ensure both servers are running
   - Check that the ports match in your environment variables
   - Verify CORS settings in the server

2. If the chatbot isn't responding:
   - Verify your OpenAI API key is correct
   - Check the server logs for any error messages
   - Ensure you have sufficient API credits

3. If tests are failing:
   - Ensure all dependencies are installed
   - Check that the test environment variables are set
   - Verify that the API mocks are properly configured

## Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Commit your changes
6. Push to the branch
7. Create a new Pull Request 