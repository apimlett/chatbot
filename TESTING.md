# Comprehensive Testing Guide

This document outlines the comprehensive test suite implemented for the chatbot application, covering both client and server components.

## Test Structure Overview

```
chatbot/
├── client/
│   ├── src/
│   │   ├── App.test.js          # Unit tests for main component
│   │   ├── integration.test.js   # Client integration tests
│   │   └── test/
│   │       └── setup.js         # Test configuration
│   └── coverage/                # Client coverage reports
├── server/
│   ├── index.test.js            # Server unit tests
│   ├── integration.test.js      # Server integration tests
│   ├── api.test.js              # API endpoint tests
│   ├── test/
│   │   └── setup.js             # Server test configuration
│   └── coverage/                # Server coverage reports
└── test-runner.js               # Unified test runner
```

## Running Tests

### Quick Start
```bash
# Run all tests with coverage
node test-runner.js

# Run client tests only
cd client && npm run test:coverage

# Run server tests only
cd server && npm run test:coverage
```

### Individual Test Suites
```bash
# Client unit tests
cd client && npm test

# Client tests with UI
cd client && npm run test:ui

# Server tests with watch mode
cd server && npm run test:watch
```

## Test Coverage

### Client Tests (Vue.js)

#### Unit Tests (`App.test.js`)
- **Component Rendering**: Verifies UI elements render correctly
- **User Interactions**: Tests button clicks, form submissions, keyboard input
- **State Management**: Validates message history, loading states, error handling
- **Mobile Responsiveness**: Tests viewport height tracking and responsive behavior
- **Event Handling**: Verifies window resize, orientation change event listeners
- **API Integration**: Tests HTTP requests, error handling, loading states
- **Edge Cases**: Empty messages, whitespace, special characters, rate limiting

**Key Test Scenarios:**
- ✅ Interface renders with input and send button
- ✅ Messages are sent and responses displayed
- ✅ Loading indicators show during API calls
- ✅ Error messages display for failed requests
- ✅ Input validation prevents empty submissions
- ✅ Viewport height updates on mobile browser changes
- ✅ Event listeners are properly cleaned up
- ✅ Message history is maintained correctly

#### Integration Tests (`integration.test.js`)
- **Full User Flows**: Complete conversation scenarios
- **Rapid Message Handling**: Sequential and concurrent message processing
- **Viewport Changes**: UI behavior during mobile browser transitions
- **Performance**: Long conversation handling
- **Accessibility**: Keyboard navigation, ARIA attributes

### Server Tests (Express.js)

#### Unit Tests (`index.test.js`)
- **Environment Configuration**: Environment variable validation
- **Middleware Setup**: CORS, security headers, rate limiting
- **Input Validation**: Request validation and sanitization
- **Error Handling**: OpenAI failures, malformed requests
- **Security**: CORS policies, trust proxy configuration

#### Integration Tests (`integration.test.js`)
- **Complete Chat Flows**: Multi-message conversations
- **Concurrent Request Handling**: Multiple simultaneous requests
- **CORS Integration**: Preflight and actual request flows
- **Rate Limiting**: Cross-IP rate limiting enforcement
- **Error Recovery**: Service outage and recovery scenarios
- **Performance**: Request processing efficiency

#### API Endpoint Tests (`api.test.js`)
- **Success Cases**: Valid requests with various message types
- **Validation Errors**: Invalid input handling and error responses
- **Server Errors**: OpenAI API failures and error handling
- **Rate Limiting**: 429 responses and retry headers
- **CORS Headers**: Cross-origin request handling
- **Security Headers**: Helmet middleware verification

## Test Configuration

### Client (Vitest + Testing Library)
```javascript
// Key testing tools:
- Vitest: Test runner and assertions
- @testing-library/vue: Component testing utilities
- MSW (Mock Service Worker): API mocking
- jsdom: Browser environment simulation
```

### Server (Jest + Supertest)
```javascript
// Key testing tools:
- Jest: Test runner and mocking framework
- Supertest: HTTP assertion library
- OpenAI mocking: Service dependency mocking
```

## Coverage Targets

### Client Coverage Goals
- **Functions**: >90%
- **Lines**: >85%
- **Branches**: >80%
- **Statements**: >85%

### Server Coverage Goals
- **Functions**: >95%
- **Lines**: >90%
- **Branches**: >85%
- **Statements**: >90%

## Test Categories

### 1. Unit Tests
- Individual component/function testing
- Isolated functionality verification
- Mock external dependencies

### 2. Integration Tests
- Multi-component interaction testing
- End-to-end user flow validation
- Real dependency integration

### 3. API Tests
- Endpoint-specific functionality
- Request/response validation
- Error scenario handling

### 4. Security Tests
- CORS policy enforcement
- Input validation and sanitization
- Rate limiting effectiveness

### 5. Performance Tests
- Response time validation
- Concurrent request handling
- Memory usage monitoring

## Continuous Integration

### Pre-commit Hooks
```bash
# Run linting and tests before commits
npm run test && npm run lint
```

### CI/CD Pipeline Recommendations
1. **Pull Request**: Run full test suite
2. **Staging Deploy**: Run tests + integration tests
3. **Production Deploy**: Require all tests passing

## Test Data Management

### Mocked Services
- **OpenAI API**: Consistent mock responses
- **External APIs**: Controlled test responses
- **Database**: In-memory test databases

### Test Environment Variables
```bash
NODE_ENV=test
OPENAI_API_KEY=test-api-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Debugging Tests

### Client Test Debugging
```bash
# Debug specific test
npm run test -- --reporter=verbose App.test.js

# Run tests in watch mode
npm run test:watch

# Open test UI
npm run test:ui
```

### Server Test Debugging
```bash
# Debug with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- index.test.js

# Debug with inspect
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

### Test Organization
1. **Arrange-Act-Assert**: Clear test structure
2. **Descriptive Names**: Tests describe expected behavior
3. **Independent Tests**: No test dependencies
4. **Consistent Setup**: Shared test configuration

### Mock Management
1. **Minimal Mocking**: Mock only what's necessary
2. **Realistic Data**: Use production-like test data
3. **Mock Cleanup**: Restore mocks after tests
4. **Shared Mocks**: Reusable mock configurations

### Coverage Guidelines
1. **Focus on Logic**: Test business logic thoroughly
2. **Edge Cases**: Include error scenarios
3. **Integration Points**: Test component interactions
4. **User Workflows**: Cover common user paths

## Troubleshooting

### Common Issues

#### Client Tests
- **Component Not Rendering**: Check test environment setup
- **API Mocks Failing**: Verify MSW configuration
- **Async Test Issues**: Use proper `waitFor` patterns

#### Server Tests
- **Port Conflicts**: Ensure test isolation
- **OpenAI Mock Issues**: Check mock implementation
- **CORS Test Failures**: Verify origin configuration

### Performance Optimization
- **Parallel Testing**: Run tests concurrently where possible
- **Test Selection**: Use pattern matching for specific tests
- **Mock Optimization**: Minimize expensive mock operations

## Maintenance

### Regular Tasks
1. **Update Dependencies**: Keep testing libraries current
2. **Review Coverage**: Maintain coverage targets
3. **Refactor Tests**: Keep tests maintainable
4. **Add New Tests**: Cover new features immediately

### Monitoring
- **Test Execution Time**: Watch for performance regression
- **Coverage Trends**: Monitor coverage over time
- **Flaky Tests**: Identify and fix unstable tests