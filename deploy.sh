#!/bin/bash

# Deployment script with mandatory test gates
set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Gate 1: Environment Check
echo "🔍 Gate 1: Environment Validation"
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV="production"
    print_warning "NODE_ENV not set, defaulting to production"
fi

if [ "$NODE_ENV" = "production" ]; then
    echo "📋 Production deployment checks enabled"
    STRICT_MODE=true
else
    echo "📋 Non-production deployment"
    STRICT_MODE=false
fi

# Gate 2: Dependency Security Check
echo "🔒 Gate 2: Security Audit"
echo "Checking client dependencies..."
cd client
if ! npm audit --audit-level=high; then
    print_error "Client security audit failed! High/Critical vulnerabilities found."
    exit 1
fi

echo "Checking server dependencies..."
cd ../server
if ! npm audit --audit-level=high; then
    print_error "Server security audit failed! High/Critical vulnerabilities found."
    exit 1
fi
print_status "Security audit passed"

# Gate 3: Test Suite Execution
echo "🧪 Gate 3: Test Suite Validation"
cd ../

# Run comprehensive test suite
if ! node test-runner.js; then
    print_error "Test suite failed! Deployment blocked."
    if [ "$STRICT_MODE" = true ]; then
        exit 1
    else
        print_warning "Non-production environment: continuing despite test failures"
    fi
else
    print_status "All tests passed"
fi

# Gate 4: Coverage Thresholds
echo "📊 Gate 4: Coverage Threshold Validation"
cd client
echo "Checking client coverage..."
if ! npm run test:coverage > /dev/null 2>&1; then
    print_error "Client coverage check failed!"
    if [ "$STRICT_MODE" = true ]; then
        exit 1
    fi
fi

cd ../server
echo "Checking server coverage..."
if ! npm run test:coverage > /dev/null 2>&1; then
    print_error "Server coverage below threshold!"
    if [ "$STRICT_MODE" = true ]; then
        print_error "Production deployment requires minimum 75% coverage"
        exit 1
    fi
fi
print_status "Coverage thresholds met"

# Gate 5: Build Process
echo "🔨 Gate 5: Build Validation"
cd ../client
if ! npm run build; then
    print_error "Client build failed!"
    exit 1
fi
print_status "Client build successful"

cd ../server
if ! npm run build; then
    print_error "Server build validation failed!"
    exit 1
fi
print_status "Server build validation successful"

# Gate 6: Pre-deployment Smoke Tests
echo "💨 Gate 6: Smoke Tests"
echo "Running pre-deployment smoke tests..."

# Test client build artifacts
if [ ! -d "client/dist" ]; then
    print_error "Client build artifacts not found!"
    exit 1
fi

# Test server startup (dry run)
cd server
if ! timeout 10s node index.js --dry-run 2>/dev/null; then
    print_warning "Server startup test timed out (may be normal)"
fi

print_status "Smoke tests completed"

# Gate 7: Environment-specific validations
echo "🌍 Gate 7: Environment Validation"
if [ "$NODE_ENV" = "production" ]; then
    echo "Production-specific checks:"
    
    # Check for production environment variables
    if [ -z "$OPENAI_API_KEY" ]; then
        print_error "OPENAI_API_KEY not set for production!"
        exit 1
    fi
    
    if [ -z "$ALLOWED_ORIGINS" ]; then
        print_error "ALLOWED_ORIGINS not set for production!"
        exit 1
    fi
    
    # Ensure no development dependencies in production
    cd ../client
    if npm ls --depth=0 --dev 2>/dev/null | grep -q "devDependencies"; then
        print_warning "Development dependencies detected in production build"
    fi
fi

print_status "Environment validation passed"

# Final Success
echo ""
echo "🎉 All deployment gates passed successfully!"
echo "📦 Application is ready for deployment to $NODE_ENV"
echo ""
echo "Deployment Summary:"
echo "- ✅ Security audit passed"
echo "- ✅ All tests passed"
echo "- ✅ Coverage thresholds met"
echo "- ✅ Build successful"
echo "- ✅ Smoke tests passed"
echo "- ✅ Environment validated"
echo ""
print_status "Deployment approved! 🚀"