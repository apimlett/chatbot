# LangChain Chatbot

A production-ready full-stack chatbot implementation with comprehensive testing, security, and CI/CD pipeline.

## Technology Stack

### Frontend
- **Vue.js 3** - Modern reactive framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Backend
- **Node.js/Express** - Server runtime and web framework
- **OpenAI API** - GPT-3.5-turbo integration
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Input Validation** - Request validation and sanitization

### Testing & Quality Assurance
- **Vitest** - Frontend testing framework
- **Testing Library** - Component testing utilities
- **Jest + Supertest** - Backend testing
- **MSW** - API mocking for tests
- **Coverage reporting** - Code coverage analysis
- **Quality gates** - Mandatory deployment checks

### DevOps & CI/CD
- **GitHub Actions** - Automated CI/CD pipeline
- **Husky** - Git hooks for quality gates
- **7-Gate Deployment Process** - Comprehensive validation
- **Security auditing** - Vulnerability scanning
- **Environment-specific configuration**

## Project Structure

```
.
├── client/                 # Vue.js frontend application
│   ├── src/
│   │   ├── App.vue        # Main component
│   │   ├── App.test.js    # Unit tests
│   │   ├── integration.test.js  # Integration tests
│   │   └── test/setup.js  # Test configuration
│   ├── vitest.config.js   # Test configuration
│   └── package.json       # Dependencies and scripts
├── server/                 # Express backend server
│   ├── index.js           # Main server file
│   ├── *.test.js          # Comprehensive test suite
│   └── package.json       # Dependencies and scripts
├── .github/workflows/     # CI/CD pipeline configuration
├── deploy.sh              # 7-gate deployment script
├── DEPLOYMENT.md          # Deployment documentation
└── README.md              # This file
```

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **OpenAI API key**
- **Git** (for version control and hooks)

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

## Testing & Quality Assurance

The project implements a comprehensive testing strategy with **mandatory quality gates** to ensure production readiness.

### Test Suite Overview

- **Frontend Tests**: 18 unit tests + 6 integration tests (Vitest + Testing Library)
- **Backend Tests**: 40+ unit/integration/API tests (Jest + Supertest)  
- **Coverage Requirements**: 85% client, 75% server
- **API Mocking**: MSW v2 for realistic testing
- **Mobile Testing**: Viewport-specific validation

### Running Tests

```bash
# Full test suite (both client and server)
node test-runner.js

# Individual test commands
cd client && npm test              # Frontend tests
cd server && npm test              # Backend tests

# Coverage reports
npm run test:coverage              # With coverage analysis
npm run test:ui                    # Interactive test UI
```

### Quality Gates & Deployment

The project implements **7 mandatory quality gates** that must pass for deployment:

```bash
# Full deployment validation
./deploy.sh

# Production deployment (strict mode)
NODE_ENV=production ./deploy.sh
```

#### 7-Gate Deployment Process

1. **🔍 Environment Validation** - Configuration checks
2. **🔒 Security Audit** - Vulnerability scanning (`npm audit`)
3. **🧪 Test Suite Validation** - All tests must pass
4. **📊 Coverage Threshold** - Minimum coverage requirements
5. **🔨 Build Validation** - Successful build process
6. **💨 Smoke Tests** - Basic functionality verification
7. **🌍 Environment-specific** - Production-ready configuration

### CI/CD Pipeline

**GitHub Actions** automatically runs on every push/PR:

```yaml
# .github/workflows/ci.yml
- Test execution (Gates 3 & 4)
- Security scanning (Gate 2)  
- Build validation (Gate 5)
- Multi-environment deployment
```

### Pre-commit Hooks

**Husky** prevents commits with failing tests:

```bash
# Automatically runs on git commit
git commit -m "feature: new functionality"

# Manual validation
npm run test:pre-commit
```

### Coverage Requirements

- **Client**: 85% minimum (branches, functions, lines, statements)
- **Server**: 75% minimum (branches, functions, lines, statements)
- **Enforcement**: Build fails if coverage drops below threshold

### Test Categories

#### Frontend Tests
- **Unit Tests**: Component rendering, user interactions, state management
- **Integration Tests**: Full user flows, API integration, mobile responsive
- **Edge Cases**: Error handling, empty states, rapid interactions

#### Backend Tests  
- **Unit Tests**: Route handlers, middleware, validation, security
- **Integration Tests**: Full request/response cycles, database interactions
- **API Tests**: All endpoints, CORS, rate limiting, authentication

## Features

### Core Functionality
- **Real-time Chat Interface** - Vue.js 3 with responsive design
- **OpenAI Integration** - GPT-3.5-turbo for intelligent responses
- **Mobile Optimized** - Tailwind CSS with mobile-first approach
- **Security Hardened** - Helmet, CORS, rate limiting, input validation

### Development & Operations
- **Comprehensive Testing** - 60+ tests with 85%/75% coverage requirements
- **Quality Gates** - 7-stage deployment validation process
- **CI/CD Pipeline** - Automated testing and deployment
- **Environment Management** - Development, staging, and production configs
- **Security Auditing** - Automated vulnerability scanning
- **Performance Monitoring** - Smoke tests and health checks

## Development Workflow

### Local Development
```bash
# Start both client and server in development mode
cd client && npm run dev &
cd server && npm run dev &
```

### Port Configuration
- **Client**: http://localhost:5173 (Vite dev server)
- **Server**: http://localhost:3001 (Express API)

### API Endpoints
- **POST** `/api/chat` - Send messages to the chatbot
- **GET** `/api/health` - Server health check
- **OPTIONS** `/*` - CORS preflight handling

### Development Commands
```bash
# Run tests during development
npm run test:watch              # Watch mode
npm run test:coverage          # Coverage analysis
npm run test:ui               # Interactive test runner

# Pre-commit validation
npm run test:pre-commit       # Quick validation
git commit                    # Triggers automatic testing
```

### Code Quality
- **Automatic Testing** - Pre-commit hooks prevent broken code
- **Coverage Enforcement** - Build fails if coverage drops
- **Security Scanning** - Automated dependency auditing
- **Environment Validation** - Configuration checks

## Environment Configuration

### Development Environment

**Server (.env)**:
```bash
NODE_ENV=development
OPENAI_API_KEY=your-dev-api-key
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Client (.env)**:
```bash
VITE_API_URL=http://localhost:3001
```

### Production Environment

**Server (.env)**:
```bash
NODE_ENV=production
OPENAI_API_KEY=your-production-api-key
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com
```

**Client (.env)**:
```bash
VITE_API_URL=https://api.yourdomain.com
```

### Environment Variable Validation

The deployment process validates required environment variables:
- **Development**: Relaxed validation, warnings only
- **Staging**: Moderate validation with warnings
- **Production**: Strict validation, deployment blocked if missing

Required for production:
- `OPENAI_API_KEY` - OpenAI API authentication
- `ALLOWED_ORIGINS` - CORS security configuration
- `NODE_ENV=production` - Production mode activation

## Troubleshooting

### Common Issues

#### Client Connection Issues
```bash
# Check if both services are running
cd client && npm run dev    # Should start on :5173
cd server && npm run dev    # Should start on :3001

# Verify environment variables
cat client/.env            # VITE_API_URL should match server port
cat server/.env            # ALLOWED_ORIGINS should include client URL
```

#### Test Failures
```bash
# Run specific test categories
cd client && npm test -- App.test.js
cd server && npm test -- index.test.js

# Check coverage issues
npm run test:coverage
open coverage/index.html    # View detailed coverage report
```

#### Deployment Issues
```bash
# Validate all quality gates
./deploy.sh

# Check specific gate failures
npm audit                   # Security issues
npm run test:pre-deploy    # Test and coverage failures
npm run build              # Build issues
```

#### Security Audit Failures
```bash
# View detailed security report
npm audit

# Fix automatically resolvable issues
npm audit fix

# Manual review for breaking changes
npm audit fix --force
```

### Quality Gate Failures

#### Gate 2: Security Audit
- **Issue**: High/critical vulnerabilities detected
- **Solution**: Run `npm audit fix` or update dependencies
- **Emergency**: Use `EMERGENCY_DEPLOY=true` (not recommended)

#### Gate 3: Test Suite Validation
- **Issue**: Tests failing in CI/CD
- **Solution**: Fix failing tests or improve test stability
- **Debug**: Use `npm run test:coverage -- --reporter=verbose`

#### Gate 4: Coverage Threshold
- **Issue**: Coverage below 85% (client) or 75% (server)
- **Solution**: Add tests for uncovered code
- **View**: Open `coverage/index.html` for detailed analysis

### Emergency Procedures

```bash
# Emergency deployment (bypasses non-critical gates)
EMERGENCY_DEPLOY=true ./deploy.sh

# Force production deployment (DANGEROUS)
FORCE_DEPLOY=true NODE_ENV=production ./deploy.sh
```

**⚠️ Warning**: Emergency overrides should only be used with explicit approval and documented justification.

## Contributing

### Development Process

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/chatbot.git
   cd chatbot
   ```

2. **Setup Development Environment**
   ```bash
   # Install dependencies
   cd client && npm install && cd ../server && npm install
   
   # Setup environment variables
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Development Workflow**
   ```bash
   # Run tests during development
   npm run test:watch
   
   # Check coverage regularly
   npm run test:coverage
   
   # Validate before commit
   npm run test:pre-commit
   ```

5. **Quality Requirements**
   - **All tests must pass** - Pre-commit hooks enforce this
   - **Coverage maintained** - 85% client, 75% server minimum
   - **Security clean** - No high/critical vulnerabilities
   - **Linting clean** - Code style consistency

6. **Commit & Push**
   ```bash
   git commit -m "feat: add new feature"  # Triggers automatic testing
   git push origin feature/your-feature-name
   ```

7. **Pull Request**
   - **All quality gates must pass** in CI/CD
   - **Review required** for main branch
   - **Tests included** for new functionality
   - **Documentation updated** if needed

### Code Standards

- **Testing**: Write tests for all new functionality
- **Coverage**: Maintain or improve coverage ratios
- **Security**: No new vulnerabilities introduced
- **Performance**: Consider impact on load times
- **Mobile**: Ensure responsive design compatibility

### Automated Validation

The CI/CD pipeline automatically validates:
- ✅ Test execution and coverage
- ✅ Security vulnerability scanning  
- ✅ Build process validation
- ✅ Code quality checks
- ✅ Multi-environment compatibility

### Documentation

See `DEPLOYMENT.md` for detailed information about:
- Quality gate processes
- CI/CD pipeline configuration
- Environment-specific requirements
- Troubleshooting procedures 