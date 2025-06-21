# Deployment Guide

This project uses **GitHub Actions** to orchestrate deployments to Railway (server) and Vercel (client) with mandatory quality gates.

## Overview

The deployment process implements **7 Quality Gates** that ensure code quality, security, and reliability:

```
🔍 Gate 1: Environment Validation
🔒 Gate 2: Security Audit  
🧪 Gate 3: Test Suite Validation
📊 Gate 4: Coverage Threshold Validation
🔨 Gate 5: Build Validation
💨 Gate 6: Smoke Tests
🌍 Gate 7: Environment-specific Validation
```

## Quality Gate Details

### Gate 1: Environment Validation
- **Purpose**: Verify deployment environment configuration
- **Checks**: 
  - NODE_ENV properly set
  - Environment-specific settings validated
- **Failure Action**: Warning (non-blocking for non-prod)

### Gate 2: Security Audit
- **Purpose**: Ensure no high/critical security vulnerabilities
- **Checks**:
  - `npm audit --audit-level=high` for client and server
  - Dependency vulnerability scanning
- **Failure Action**: **BLOCKING** (all environments)

### Gate 3: Test Suite Validation  
- **Purpose**: Verify all functionality works correctly
- **Checks**:
  - Client tests: All unit and integration tests
  - Server tests: API, security, and integration tests
  - End-to-end functionality validation
- **Failure Action**: **BLOCKING** (production), Warning (other environments)

### Gate 4: Coverage Threshold Validation
- **Purpose**: Ensure adequate test coverage
- **Thresholds**:
  - **Client**: 85% minimum (lines, branches, functions, statements)
  - **Server**: 75% minimum (lines, branches, functions, statements)
- **Failure Action**: **BLOCKING** (production), Warning (other environments)

### Gate 5: Build Validation
- **Purpose**: Verify application builds successfully
- **Checks**:
  - Client build process (`npm run build`)
  - Server build validation
  - Asset generation verification
- **Failure Action**: **BLOCKING** (all environments)

### Gate 6: Smoke Tests
- **Purpose**: Basic functionality verification
- **Checks**:
  - Build artifacts exist
  - Server startup validation
  - Critical path verification
- **Failure Action**: **BLOCKING** (all environments)

### Gate 7: Environment-specific Validation
- **Purpose**: Environment-specific requirements
- **Production Checks**:
  - Required environment variables set
  - Production-ready configuration
  - No development dependencies
- **Failure Action**: **BLOCKING** (production only)

## Usage

### Automated Deployment
```bash
# Full deployment with all gates
./deploy.sh

# Production deployment (strict mode)
NODE_ENV=production ./deploy.sh

# Staging deployment
NODE_ENV=staging ./deploy.sh
```

### Manual Build Process
```bash
# Client build (includes test gate)
cd client && npm run build

# Server build (includes test gate)  
cd server && npm run build
```

### Pre-commit Hooks
```bash
# Automatically runs on git commit
git commit -m "feature: add new functionality"

# Manual pre-commit check
npm run test:pre-commit
```

## CI/CD Integration

### GitHub Actions Orchestration
The `.github/workflows/ci.yml` pipeline automatically:
1. Runs all quality gates on push/PR
2. **Sequential deployment**: Server (Railway) → Client (Vercel)  
3. Health checks and verification after each deployment
4. Automatic rollback on failure

### Pipeline Stages
```yaml
Jobs:
  test           # Gates 3 & 4: Test execution and coverage
  lint           # Code quality validation  
  security-scan  # Gate 2: Security audit
  build          # Gate 5: Build validation
  deploy-server  # Railway deployment with health check
  deploy-client  # Vercel deployment (depends on server success)
```

### Required GitHub Secrets
Configure these in your repository settings:

**Railway:**
- `RAILWAY_TOKEN` - Railway API token
- `RAILWAY_SERVER_URL` - Production server URL for health checks

**Vercel:**  
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VERCEL_CLIENT_URL` - Production client URL for verification

### Branch Protection
- **main**: All gates must pass + PR review required
- **develop**: All gates must pass
- **feature/***: Test gates must pass (coverage warnings allowed)

## Coverage Requirements

### Client (Vue.js)
```javascript
coverage: {
  thresholds: {
    global: {
      branches: 85,
      functions: 85, 
      lines: 85,
      statements: 85
    }
  }
}
```

### Server (Express.js)  
```javascript
coverageThreshold: {
  global: {
    branches: 75,
    functions: 75,
    lines: 75, 
    statements: 75
  }
}
```

## Failure Handling

### Test Failures
```bash
# View detailed test output
npm run test:coverage

# Debug specific failing tests
npm test -- --reporter=verbose --testNamePattern="failing test"

# Run tests in watch mode for development
npm run test:watch
```

### Coverage Failures
```bash
# Generate detailed coverage report
npm run test:coverage -- --reporter=html

# View coverage report
open coverage/index.html
```

### Security Failures
```bash
# View detailed audit report
npm audit

# Fix automatically resolvable issues
npm audit fix

# Manual review for major version changes
npm audit fix --force
```

## Environment Configuration

### Required Environment Variables

#### Production
```bash
NODE_ENV=production
OPENAI_API_KEY=<production-key>
ALLOWED_ORIGINS=<production-domain>
PORT=<production-port>
```

#### Staging
```bash
NODE_ENV=staging
OPENAI_API_KEY=<staging-key>
ALLOWED_ORIGINS=<staging-domain>
```

#### Development
```bash
NODE_ENV=development
OPENAI_API_KEY=<dev-key>
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Override Options

### Emergency Deployments
```bash
# Skip non-critical gates (NOT RECOMMENDED)
EMERGENCY_DEPLOY=true ./deploy.sh

# Force production deployment (DANGEROUS)
FORCE_DEPLOY=true NODE_ENV=production ./deploy.sh
```

**⚠️ Warning**: Emergency overrides bypass critical safety checks and should only be used in genuine emergencies with explicit approval.

## Monitoring and Alerts

### Failed Deployments
- Automated alerts sent to development team
- Detailed failure logs available in CI/CD dashboard
- Rollback procedures automatically triggered

### Coverage Degradation
- Coverage trend monitoring
- Alerts when coverage drops below threshold
- Weekly coverage reports generated

## Best Practices

### Development Workflow
1. **Write tests first** (TDD approach)
2. **Run tests locally** before committing
3. **Check coverage** during development
4. **Address security issues** immediately
5. **Validate builds** before pushing

### Team Responsibilities
- **Developers**: Ensure tests pass locally
- **Tech Leads**: Review coverage trends
- **DevOps**: Monitor deployment pipeline health
- **Security Team**: Review audit failures

### Continuous Improvement
- Regular review of gate effectiveness
- Adjustment of coverage thresholds based on project maturity
- Addition of new gates as requirements evolve
- Performance optimization of test execution

---

## Quick Reference Commands

```bash
# Full test suite
node test-runner.js

# Pre-commit validation  
npm run test:pre-commit

# Pre-deployment validation
npm run test:pre-deploy

# Production deployment
NODE_ENV=production ./deploy.sh

# Emergency deployment (use with caution)
EMERGENCY_DEPLOY=true ./deploy.sh
```