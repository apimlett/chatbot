# Claude Context - Cogfusion.ai Chatbot

This file contains important context for Claude to understand the project structure and recent work.

## Project Overview

**Cogfusion.ai** is an AI-powered chatbot application with:
- Vue.js 3 frontend (client/)
- Express.js backend (server/)
- OpenAI API integration
- Comprehensive CI/CD pipeline via GitHub Actions
- Deployments to Railway (server) and Vercel (client)

## Recent Work & Known Issues

### CI/CD Pipeline Status
- ✅ Server deployment to Railway is working correctly
- ⚠️ Client deployment to Vercel has authentication issues
- Fixed deployment badges in README.md
- Updated CI/CD workflow to handle missing Vercel projects

### Deployment Configuration

#### Railway (Server)
- Service is deployed successfully
- Uses Railway CLI in GitHub Actions
- Requires secrets: `RAILWAY_TOKEN`, `RAILWAY_SERVICE_ID`
- Health check endpoint: `/api/health`

#### Vercel (Client)
- Deployment attempts to link to existing project first
- Falls back to creating new project if needed
- Requires secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Note: Current `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` don't match any existing project

### Key Commands

```bash
# Run tests
cd client && npm test
cd server && npm test

# Run with coverage
cd client && npm run test:coverage
cd server && npm run test:coverage

# Lint checks (if configured)
npm run lint

# Type checks (if configured)
npm run typecheck
```

### Environment Variables

#### Server (.env)
```
OPENAI_API_KEY=your-api-key
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-client-domain.vercel.app
```

#### Client (.env.production)
```
VITE_API_URL=https://your-server.railway.app
```

### GitHub Secrets Required
- `RAILWAY_TOKEN` - Railway authentication
- `RAILWAY_SERVICE_ID` - Specific Railway service to deploy to
- `RAILWAY_SERVER_URL` - Server URL for client to connect to
- `VERCEL_TOKEN` - Vercel authentication
- `VERCEL_ORG_ID` - Vercel organization ID (currently invalid)
- `VERCEL_PROJECT_ID` - Vercel project ID (currently invalid)
- `VERCEL_CLIENT_URL` - Client URL for health checks

### Current Issues to Address

1. **Vercel Project Configuration**: The `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` in GitHub secrets don't match an existing Vercel project. Either:
   - Update the secrets with correct values from an existing Vercel project
   - Let Vercel create a new project and update the secrets afterward

2. **API URL Configuration**: Ensure `RAILWAY_SERVER_URL` secret is set correctly for the client to connect to the server

### Testing Notes

- Client tests use Vitest with 30 passing tests
- Server tests use Jest with 40+ tests
- Pre-commit hooks run client tests automatically
- Coverage requirements: 85% client, 75% server

### File Structure
```
.
├── client/                 # Vue.js frontend
│   ├── src/               # Source code
│   ├── dist/              # Build output
│   └── vercel.json        # Vercel configuration
├── server/                 # Express backend
│   └── index.js           # Main server file
├── .github/workflows/      
│   └── ci.yml             # CI/CD pipeline
├── README.md              # Project documentation
├── DEPLOYMENT.md          # Deployment guide
└── CLAUDE.md              # This file
```

### Recent Commits
- Fixed Vercel deployment error handling
- Updated deployment badges in README
- Fixed CI/CD Pipeline badge URL
- Improved error handling for non-existent Vercel projects

## Notes for Future Work

1. Consider setting up proper Vercel project and updating GitHub secrets
2. Add monitoring/logging for production deployments
3. Consider adding staging environment
4. Document the process for obtaining correct Vercel project/org IDs