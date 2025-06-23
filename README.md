# Vue.js + Express.js Template

<div align="center">

| Build & Quality | Coverage | Runtime | Deployment |
|:---:|:---:|:---:|:---:|
| [![CI/CD Pipeline](https://github.com/apimlett/chatbot/actions/workflows/ci.yml/badge.svg)](https://github.com/apimlett/chatbot/actions/workflows/ci.yml) | [![codecov](https://codecov.io/gh/apimlett/chatbot/branch/main/graph/badge.svg)](https://codecov.io/gh/apimlett/chatbot) | [![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/) | [![Railway Deploy](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fapimlett%2Fchatbot) |
| [![Quality Gate](https://img.shields.io/badge/quality%20gate-7%20gates-brightgreen.svg)](#deployment-guide) | [![Security](https://img.shields.io/badge/security-audited-brightgreen.svg)](#security) | [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fapimlett%2Fchatbot) |

</div>

A clean, production-ready template for full-stack applications using Vue.js 3 and Express.js.

## Features

- **Frontend**: Vue.js 3 with Vite for fast development
- **Backend**: Express.js with security middleware and validation
- **Testing**: Comprehensive test suites for both frontend and backend
- **CI/CD**: GitHub Actions pipeline with build, test, and lint
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Deployment Ready**: Commented deployment configs for Railway and Vercel

## Tech Stack

### Frontend
- Vue.js 3 (Composition API)
- Vite (Build tool and dev server)
- Axios (HTTP client)
- Vitest (Testing framework)

### Backend
- Express.js
- Helmet (Security headers)
- CORS (Cross-origin resource sharing)
- Express Rate Limit (Rate limiting)
- Express Validator (Input validation)
- Jest + Supertest (Testing)

### Development & Deployment
- GitHub Actions (CI/CD)
- Husky (Git hooks)
- Railway (Server deployment - commented)
- Vercel (Client deployment - commented)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vue-express-template
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies  
   cd ../server && npm install
   ```

3. **Start development servers**
   ```bash
   # Terminal 1 - Start the backend server
   cd server && npm run dev
   
   # Terminal 2 - Start the frontend dev server
   cd client && npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Project Structure

```
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── App.vue        # Main app component
│   │   ├── main.js        # App entry point
│   │   └── App.test.js    # App tests
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                 # Express.js backend
│   ├── index.js           # Server entry point
│   ├── index.test.js      # Server tests
│   └── package.json       # Backend dependencies
├── .github/workflows/      # CI/CD pipeline
│   └── ci.yml            # GitHub Actions workflow
├── .gitignore
└── README.md
```

## Available Scripts

### Client (Frontend)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run preview      # Preview production build
```

### Server (Backend)
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm test             # Run tests
npm run test:coverage # Run tests with coverage
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status
- `GET /api/status` - Server status information

### Example Endpoint
- `POST /api/example` - Example API endpoint with validation

Example request:
```bash
curl -X POST http://localhost:3001/api/example \
  -H "Content-Type: application/json" \
  -d '{"data": "Hello World"}'
```

## Testing

### Run All Tests
```bash
# From root directory
npm run test:all  # If you add this script to root package.json

# Or run individually
cd client && npm test
cd server && npm test
```

### Coverage Reports
Both frontend and backend generate coverage reports:
- Client: `client/coverage/`
- Server: `server/coverage/`

## Environment Variables

### Server (.env file)
```bash
NODE_ENV=development
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Client (.env files)
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3001

# .env.production  
VITE_API_BASE_URL=https://your-production-api.com
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Server-side validation with express-validator
- **Trust Proxy**: Configured for deployment platforms

## Deployment

### Preparation
1. Uncomment deployment jobs in `.github/workflows/ci.yml`
2. Configure the required secrets in your GitHub repository
3. Update the deployment configurations

### Railway (Backend)
Required secrets:
- `RAILWAY_TOKEN`
- `RAILWAY_SERVICE_ID` 
- `RAILWAY_SERVER_URL`

### Vercel (Frontend)
Required secrets:
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`
- `VERCEL_CLIENT_URL`

## CI/CD Pipeline

The GitHub Actions workflow includes:
- **Test**: Run tests on Node.js 18.x and 20.x
- **Lint**: Code linting (when configured)
- **Security Scan**: npm audit for vulnerabilities  
- **Build**: Create production builds
- **Deploy**: Deploy to Railway and Vercel (commented out)

## Customization

### Adding New API Endpoints
1. Add routes to `server/index.js`
2. Add validation middleware
3. Add corresponding tests in `server/index.test.js`

### Adding New Frontend Components
1. Create components in `client/src/components/`
2. Import and use in `App.vue` or other components
3. Add tests alongside components

### Database Integration
To add a database:
1. Install your preferred database client (e.g., `mongoose`, `pg`, `mysql2`)
2. Create database connection in `server/config/`
3. Add database models/schemas
4. Update environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the example implementations in the codebase